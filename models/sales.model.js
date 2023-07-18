import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
    id : {
        type : Number,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    }, 
    price : {
        type : Number,
        required : true
    }, 
    description : {
        type : String,
        required : true
    }, 
    category : {
        type : String,
        required : true
    }, 
    image : {
        type : String,
    }, 
    sold : {
        type : Boolean,
        required : true
    }, 
    dateOfSale : {
        type : Date,
        required : true
    },
    monthOfSale : {
        type : Number,
        required : true
    }

});


export default mongoose.model("SalesTransaction", SalesSchema);