const mongoose = require('mongoose');
const Tache = mongoose.model('Tache', {
    name:{
        type: String
    },
    description:{
        type: String
    },
    namedeveloppeur:{
        type:String
    },
    date:{
        type: Date
    },
    
    
})
module.exports = Tache;