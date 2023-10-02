//Uses mongodb data base -> same query and methods: find(), aggregate()
const mongoose = require('mongoose')

//Sets connection to planhub_app database
const connectDB = (url) => {
   return mongoose.connect(url, {
      writeConcern:{
         w:'majority'
      }
    })
}


module.exports = connectDB