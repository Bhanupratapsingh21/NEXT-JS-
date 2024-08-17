import mongoose from 'mongoose'

type ConnnectionObjec = {
    isConnected? : number
}

const connection:ConnnectionObjec = {}

async function dbconnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected To DB")
        return
    }
    try { 
        const db = await mongoose.connect(process.env.MONGODBURI || '')
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected SuccessFully")
    } catch (error) {
        console.log("DB CONNECTION FAILD" , error)
        process.exit(1)
    }
}

export default dbconnect