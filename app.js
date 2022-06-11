const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
dotenv.config({path:'./config/config.env'});
const app = express();
const product = require('./routes/product');
const user = require('./routes/user');
const errorHandler = require('./utils/error');
 const connection = require('./config/db');
 var cookieParser = require('cookie-parser')
 const bodyParser = require('body-parser');
 const cloudinary = require('cloudinary');
  const fileupload = require('express-fileupload');
 const cors = require('cors');
const order = require('./routes/order');
const payament = require('./routes/process-payments');
// const upload = require('./utils/Multer');
// const cloud = require('./utils/Clodnary');
app.use(express.json());
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload({
  useTempFiles:true
}));

cloudinary.config({ 
  cloud_name: process.env.CLOUDNAME, 
  api_key: process.env.CLOUDAPIKEY, 
  api_secret: process.env.CLOUDAPISECRET,
 // secure: true
});
app.use("/api/v1", product);
app.use("/api/v1/user", user);
app.use("/api/v1", order);
app.use('/api/v1',  payament)
const port = process.env.Port||6000;
app.use(errorHandler);
// Enable CORS
app.use(cors());


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
let server = app.listen(port, ()=>{
     console.log(`server is rungin ${port}`)
})


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
