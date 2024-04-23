const mongoose = require('mongoose');
const User = mongoose.model('User', {
    name:{
        type: String
    },
    email:{
        type: String
    },
    address:{
        type: String
    },
    phone:{
        type: Number
    },
    domaine:{
        type: String
    },
    password:{
        type: String
    },
    role: {
        type: String,
        default: null
       
    },
    
})
module.exports = User;