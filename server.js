/* Import all packages */
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./server/database/connection');
const path = require('path');
var mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const bodyParser = require('body-parser');



const app = express();
const upload = multer();

/* Routes */
const appRoutes = require('./server/routes/appRoutes');
const volRoutes = require('./server/routes/volRoutes');
const avionRoutes = require('./server/routes/avionRoutes');
const resRoutes = require("./server/routes/reservationRoutes");

/* 404 Error */
const error = require('./server/controllers/erreur404');

/*Required to use the file .env*/
dotenv.config({ path: '.env' });

/*Promise mongoose*/
mongoose.Promise = global.Promise;

app.use(morgan('tiny'));

/*Set view engine*/
app.set("view engine", "ejs");
app.set('views', 'views');

/*Parse Request to bodyParser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*load assets folder*/
app.use(express.static(path.join(__dirname, "assets")));

/*Required to read cookies*/
app.use(cookieParser());

/*Required to use multer*/
app.use(upload.array());

/*Configuring the express-session middleware*/
app.use(session({
    secret: 'Keep it secret Tatie',
    resave: true,
    saveUninitialized: true
}));


app.use(appRoutes);
app.use(volRoutes);
app.use(avionRoutes);
app.use(resRoutes);
app.use(error.get404);

/*database connection*/
dbConnection();
app.listen(process.env.PORT, () => {
    console.log(`The server Nodejs is running on http://localhost:${process.env.PORT}`)
})