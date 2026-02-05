import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const getPopulatedCart = async (clerkId) => {
    return await Cart.findOne({ clerkId }).populate("items.product");
};

export async function getCart(req, res) {
    try {
        let cart = await getPopulatedCart(req.user.clerkId);

        if (!cart) {

            const user = req.user;

            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }
        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Error in getCart controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function addToCart(req, res) {
    try {
        const { productId, quantity = 1 } = req.body;

        // validate product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        let cart = await Cart.findOne({ clerkId: req.user.clerkId });

        if (!cart) {

            cart = await Cart.create({
                user: req.user._id,
                clerkId: req.user.clerkId,
                items: [],
            });
        }

        // check if item already in the cart
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            // increment quantity by 1
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ error: "Insufficient stock" });
            }
            existingItem.quantity = newQuantity;
        } else {
            // add new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        const updatedCart = await getPopulatedCart(req.user.clerkId);

        return res.status(200).json({ cart: updatedCart });
    } catch (error) {
        console.error("Error in addToCart controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        // check if product exists & validate stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const updatedCart = await getPopulatedCart(req.user.clerkId);

        return res.status(200).json({ cart: updatedCart });
    } catch (error) {
        console.error("Error in updateCartItem controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function removeFromCart(req, res) {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        const updatedCart = await getPopulatedCart(req.user.clerkId);

        return res.status(200).json({ cart: updatedCart });
    } catch (error) {
        console.error("Error in removeFromCart controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        const updatedCart = await getPopulatedCart(req.user.clerkId);

        return res.status(200).json({ cart: updatedCart });
    } catch (error) {
        console.error("Error in clearCart controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}