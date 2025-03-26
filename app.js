const prompt = require('prompt-sync')();

const username= prompt("what's your name?");
console.log(`Hi, ${username}! Welcome to the CRM.`);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/customer.js')

dotenv.config();

// connect to MongoDB using the variable specified in our dotenv file
const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
};

// function to create customer (Crud)
const createCustomer = async (name,age) => {
    const customer = new Customer({name, age});
    await customer.save()
    console.log('New Customer: ', customer);
}

// fn to view all customers (cRud)
const getCustomers = async () => {
    const customers = await Customer.find()
    if (customers.length===0) {
        console.log("No customers found");
    } else {
        console.log('Customer List:');
        customers.forEach(({_id, name, age}) => {
            console.log (`ID: ${_id}, Name: ${name}, Age: ${age}`);
        });
    }

};
// function to update customer (crUd)
const updateCustomer = async (id, name, age) => {
    try {
    const customer = await Customer.findByIdAndUpdate(id, {name, age}, {new:true});
    if (!customer) {
        console.log("Customer not found");
        return;
    }
        console.log('Updated Customer:', customer);
    } catch (error) {
        console.log('Error updating customer:', error)
    }
}

// function to delete customer (cruD)
const deleteCustomer = async (id) => {
    try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
        console.log("Customer not found in CRM.")
        return;
    }
    console.log(`Deleted Customer ${customer.name}`, customer);
} catch (error) {
    console.error("Error deleting customer:", error);
}
};

// main menu and CRUD ops
const main = async () => {
    await connect();

    let quit = false;
    while(!quit) {
        console.log(`
            What would you like to do?

            1. Create customer
            2. View customers
            3. Update customer
            4. Delete customer
            5. Quit CRM
            `);

            const userInput = prompt('Choose an option (1-5):');

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
                    break;
                case '4':
                    const deleteId = prompt('Enter the customer ID to delete: ');
                    await deleteCustomer(deleteId);
                    break;
                case '5':
                    quit = true;
                    break;
                default:
                    console.log('Invalid option, please try again.')
            }
    }
    console.log('Exiting the CRM...');
    await mongoose.disconnect();
    console.log('disconnected from MongoDB');
    process.exit()
};


main();
