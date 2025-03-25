const prompt = require('prompt-sync')();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/customer.js')

dotenv.config();

// connect to MongoDB using the variable specified in our dotenv file
const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
};

// function to Create customer
const createCustomer = async (name,age) => {
    const customer = await new Customer( {name, age});
    await customer.save()
    console.log('New Customer: ', customer);
}

// fn to view (Read) all customers
const getCustomers = async () => {
    const customers = await Customer.find()
    if (customers.length===0) {
        console.log("No customers found");
    } else {
        console.log('Customer List:');
        customers.forEach(customer => {
            console.log (`ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
        });
    }

};
// function to Update an existing customer
const updateCustomer = async (id, name, age) => {
    const customer = await Customer.findByIdAndUpdate(id, {name, age}, {new:true});
    console.log('Updated Customer:', customer);
}
// function to Delete customer
const deleteCustomer = async (id) => {
    const customer = await Customer.findByIdAndDelete(id);
    console.log('Deleted Customer:', customer);
}
// main menu and CRUD ops
const main = async () => {
    await connect();

    let quit = false;
    while(!quit) {
        console.log(` Welcome to the CRM!
            What would you like to do?
            1. Create customer
            2. View customers
            3. Update customer
            4. Delete customer
            5. Quit CRM
            `);
            const userInput = prompt('Choose an option:');

            switch (userInput) {
                case '1':
                const name = prompt("Enter customer name: ");
                const age = parseInt(prompt('Enter the customer age: '), 10);
                await createCustomer(name,age);
                break;
                case '2':
                await getCustomers();
                break;
                case '3':
                const updateID = prompt('Enter the customer ID to update: ');
                const updatedName = prompt('Enter the new name: ');
                const updatedAge = prompt(('Enter the new age: '), 10);
                await updateCustomer(updateID, updatedName, updatedAge);
                case '4' : deleteId = prompt('Enter the customer ID to delete: ');
                await deleteCustomer;
                break;
                case '5':
                quit = true;
                break;
                default:
                console.log('Invalid option, please try again')
            }
    }
    console.log('Exiting the CRM...');
    await mongoose.disconnect();
    console.log('disconnected from MongoDB');
    process.exit()
};


main();
