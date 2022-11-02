/*Connection with the database*/

const mongoose = require('mongoose');

const dbConnection = async() => {
    try {

        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log(`Mongodb connected on ${con.connection.host + '/' +con.connection.name}`);
    } catch (error) {
        console.error(error);
        process.exit(1);

    }
}
module.exports = dbConnection;