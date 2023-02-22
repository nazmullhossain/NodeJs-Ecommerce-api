const mongoose = require("mongoose");
const { productSchema } = require("./product_model");

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,

    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                const rex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return value.match(rex);
            },
            message: "please enter a validate email address",

        },
    },
    password: {
        required: true,
        type: String,
        validate: {
            validator: (value) => {

                return value.length > 6;
            },
            message: "please enter a long password",

        },
    },
    address: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "user",

    },
    //cart
    cart:[
      {
        product:productSchema,
        quantity:{
            type:Number,
            required:true,
            
        }
      }
    ],

    
});
const User = mongoose.model("User", userSchema);
module.exports = User;