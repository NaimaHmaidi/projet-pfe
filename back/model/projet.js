const mongoose = require('mongoose');
const Projet = mongoose.model('Projet', {
    name:{
        type: String
    },
    nameequipe:{
        type: String
    },
    nameclient:{
        type:String
    },
    date:{
        type: Date
    },
    
    
})
module.exports = Projet;