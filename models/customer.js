const mongoose = require('mongoose');

//define the schema for a customer
const customerSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
// create a model using the schema
const Customer = mongoose.model('Customer', customerSchema);

//export model so we can use it in other files
module.exports = Customer;
