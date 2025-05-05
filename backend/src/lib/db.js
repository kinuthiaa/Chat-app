import mongoose from 'mongoose'

export const connDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo Connected Jimmmy: ${conn.connection.host}`)

    }catch(error){
        console.log(error); 
        process.exit(1); 

    }
}