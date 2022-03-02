const fs = require("fs");
const PDFDocument = require("pdfkit");
var  config = require('../dbconfig');
const  sql = require('mssql');


let regNo, mobileNumber, userName, address, city, country, zakatStatus, url ;

async function createTaxPdf(mob, MobileNumber, path) {

   try{
     let  pool = await  sql.connect(config);
     mobtax = await  pool.request()
     .input('input', sql.VarChar, mob)
     .query("exec taxCertPDF @MobileNumber = '"+mob+"'");
     console.log(mobtax.recordsets[0][0].ID);
     console.log(mobtax.recordsets[1]);


       try{
         let  pool = await  sql.connect(config);
         mob1 = await  pool.request()
         .input('input', sql.VarChar, mob)
         .query("SELECT * from Users where Mobile ='"+mob+"'");




         regNo = mob1.recordset[0].RegNo;
         userName = mob1.recordset[0].Name;
         address = mob1.recordset[0].Address;
         city = mob1.recordset[0].City;
         country = mob1.recordset[0].Country;
         zakatStatus = mob1.recordset[0].ZakatStatus;
         mobileNumber = mob1.recordset[0].Mobile;

         console.log(mob1.recordset[0].Name);


       }
       catch (error){
         console.log("Data not found", error);
       }
}
catch (error){
  console.log("Data not found", error);


}
}


 module.exports = {
   createTaxPdf:createTaxPdf
 }
