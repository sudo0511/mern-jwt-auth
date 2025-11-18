import mongoose from "mongoose";
import { MONGO_URI } from "../contants/env";

export const connectToDatabase = async () =>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('Connected successfully to the database')
    }catch(error){
        console.log('Database connection error: ', error);
    }
}