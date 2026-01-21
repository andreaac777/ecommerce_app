import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
   name:{
    type: String,
    required: true
   },
   description:{
    type: String,
    required: true
   },
   price:{
    type: Number,
    required: true,
    min: 0
   },
   stock:{
    type: Number,
    required: true,
    min: 0
   },
   image:{
    type: String,
    required: true
   },
   category:{
    type: String,
    required: true
   },
   brand:{
    type: String,
    required: true
   },
   color:{
    type: String,
    required: true
   },
   size:{
    type: String,
    required: true
   },
   rating:{
    type: Number,
    required: true
   },
   numReviews:{
    type: Number,
    required: true
   },
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
   createdAt:{
    type: Date,
    required: true
   },
   updatedAt:{
    type: Date,
    required: true
   }     
},
{
    timestamps: true
}
);