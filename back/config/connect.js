//connection with database:
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/server')
//condition
.then(
    ()=>{
        console.log("connected");
    }
)
.catch(
    (err)=>{
        console.log(err);
    }
)

module.exports = mongoose;
