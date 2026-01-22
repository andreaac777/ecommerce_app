import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({
    id: "ecommerce-app",   
});

const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event:"clerk.user.created"},
    async ({event}) => {

        console.log("sync user function executed");
        
        await connectDB();
        const {id, email_addresses, first_name, last_name, image_url}=event.data;
        const newUser = {
            clerkId:id,
            email:email_addresses[0]?.email_address,
            name:`${first_name || ""} ${last_name || ""}` || "Usuario",
            imageUrl:image_url,
            address:[],
            wishlist:[],       
        };
        await User.create(newUser);
        console.log("User created in DB");
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db"},
    {event:"clerk.user.deleted"},
    async ({event}) => {

        console.log("delete user from DB function executed");
        
        await connectDB();
        const {id}=event.data;
        await User.deleteOne({clerkId:id});

        console.log("User deleted from DB");
    }
);

export const functions = [syncUser, deleteUserFromDB];