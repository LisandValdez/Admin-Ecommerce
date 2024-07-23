import mongoose, { Schema, models, model } from "mongoose";


const AdminSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
});

export const Admin = models.Admin || model('Admin', AdminSchema);