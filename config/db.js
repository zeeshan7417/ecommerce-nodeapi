const config = require('mongoose');

const conection = async()=>{

    const dbconfig = {useNewUrlParser:true, useUnifiedTopology:true}
     const url ='mongodb+srv://ecommerce-new1:ecommerce-new1@cluster0.eeviw.mongodb.net/?retryWrites=true&w=majority'

    try{

         await config.connect(url,dbconfig);
         console.log(`database conencted on  ${process.pid}`.bgCyan);
    }
    catch(error){
        console.log(`database Not conected   ${error}`.bgRed);
        return false;
    }
}

module.exports = conection();

  