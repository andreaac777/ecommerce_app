import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
    try {
        const { cartItems, shippingAddress } = req.body;
        const user = req.user;

        // Validate cart items
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.streetAddress) {
            return res.status(400).json({ error: "Shipping address is required" });
        }

        // Calculate total from server-side (don't trust client - ever.)
        let subtotal = 0;
        const validatedItems = [];

        for (const item of cartItems) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.product.name} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            subtotal += product.price * item.quantity;
            validatedItems.push({
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const shipping = 10000;
        const tax = Math.round(subtotal * 0.19);  
        const total = subtotal + shipping + tax;

        if (total <= 0) {
            return res.status(400).json({ error: "Invalid order total" });
        }
        
        const stripeAmount = Math.round(total * 100);

        const minAmountCOP = 2000;
        if (total < minAmountCOP) {
            console.error("Error: Amount is less than the minimum for Stripe");
            return res.status(400).json({ 
                error: `The minimum amount to process payments is $${minAmountCOP} COP` 
            });
        }

        // find or create the stripe customer
        let customer;
        if (user.stripeCustomerId) {
            try {
                customer = await stripe.customers.retrieve(user.stripeCustomerId);
            } catch (error) {
                customer = null;
            }
        }

        if (!customer) {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    clerkId: user.clerkId,
                    userId: user._id.toString(),
                },
            });

            await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
        }

        // create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmount,
            currency: "cop",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                clerkId: user.clerkId,
                userId: user._id.toString(),
                orderItems: JSON.stringify(validatedItems),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: total.toString(),
            },
        });

        res.status(200).json({ 
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id 
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ 
            error: "Failed to create payment intent",
            details: ENV.NODE_ENV === "development" ? error.message : undefined
        });
    }
}

export async function handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        try {
            const { userId, clerkId, orderItems, shippingAddress, totalPrice } = paymentIntent.metadata;

            const existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id });

            if (existingOrder) {
                console.log("Order already exists for payment:", paymentIntent.id);
                return res.json({ received: true });
            }

            // create order
            const order = await Order.create({
                user: userId,
                clerkId,
                orderItems: JSON.parse(orderItems),
                shippingAddress: JSON.parse(shippingAddress),
                paymentResult: {
                id: paymentIntent.id,
                status: "succeeded",
                },
                totalPrice,
            })

            const items = JSON.parse(orderItems);

            for (const item of items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity },
                });
            }
            console.log("Order created successfully:", order._id);
        } catch (error) {
            console.error("Error processing webhook:", error);
        }
    }

    res.json({ received: true });
}