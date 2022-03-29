const fs = require("fs");
const PDFDocument = require("pdfkit");
var  config = require('../dbconfig');
const  sql = require('mssql');


let regNo, mobileNumber, userName, address, city, country, zakatStatus, url ;
let cgtdata;

async function createCGTtaxPdf(mob, MobileNumber, path) {

   try{
     let  pool = await  sql.connect(config);
     mobtax = await  pool.request()
     .input('input', sql.VarChar, mob)
     .query("exec taxCertPDF @MobileNumber = '"+mob+"'");
     cgtData = mobtax.recordsets;





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



         var options = {  year: 'numeric', month: 'long', day: 'numeric' };
         var today  = new Date().toLocaleDateString("en-US",options);
         console.log(today)

         let doc = new PDFDocument({ size: "A4", margin: 20 });

         generateHeader(doc);
         generateCustomerInformation(doc);
         //generateHeading(doc);
         generateInvoiceTable(doc, cgtData);
         //generateFooter(doc);

         doc.end();
         doc.pipe(fs.createWriteStream('taxCertf/CGT-taxCertf/AKDIML-CGT-TAX'+regNo+'.pdf'));




       function generateHeader(doc) {
         doc
           .image("logo.png", 20, 20, {width: 320})
           .moveDown();
       }


       function generateCustomerInformation(doc) {

         const customerInformationTop = 155;

         doc
           .fontSize(10)
           .font("Helvetica-Bold")
           .text(today  , 20, customerInformationTop + -15)

           .font("Helvetica")
           .text("Mobile: "+mobileNumber, 20, customerInformationTop + 85)
           .font("Helvetica-Bold")
           .text("Reg. No. "+regNo  , 20, customerInformationTop + 10)
           .font("Helvetica-Bold")
           .text(userName, 20, customerInformationTop + 25)
           .font("Helvetica")
           .text(address, 20, customerInformationTop + 40)
           .text( city.replace(/\s+/g, ' ').trim(),20, customerInformationTop + 55)
           .text( country.replace(/\s+/g, ' ').trim(), 20, customerInformationTop + 70)
           .moveDown();
       }

       function generateInvoiceTable(doc, cgtData) {

         let i;
         const accStatTableTop = 350;

         doc.font("Helvetica-Bold");
         generateTableRow(
           doc
           .fontSize(11)
           .text("Fund Code", 35 ,accStatTableTop)
           .text("Type", 170 ,accStatTableTop)
           .text("Date", 320 ,accStatTableTop)
           .text("Amount", 440 ,accStatTableTop)

         );

         generateHr(doc, accStatTableTop + 20);
         generateHr(doc, accStatTableTop -10);
         generateHr(doc, accStatTableTop +110);


         let xPos = 20;
         let yPos = 380;
         generateHry(doc, yPos+170 );
         generateHry(doc, yPos+20 );
         generateHry(doc, 270 );
         generateHry(doc, 120);
         generateHry(doc, yPos -360);

         generateTableRow(
           doc
           .text("Dear Investor,",20 , 300)
         );

         for (i = 0; i < cgtData[0].length; i++) {
           let item = cgtData[i];

           generateTableRow(
             doc
             .fontSize(10)
             .font("Helvetica")

             .text(cgtData[0][i].FundCode, xPos+20, yPos)
             .text(cgtData[0][i].Type , xPos+135, yPos)
              .text(cgtData[0][i].TranDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0] , xPos+290, yPos)
             .text(cgtData[0][i].Amount , xPos+415, yPos)

             );


             yPos =yPos +15;

}
function generateTableRow(
  doc,
  y,
  date,
  fund,
  type,
  class1,
  rate,
  amount,
  units
) {
  doc
    .fontSize(10)
    .text(date, 50, y)
    .text(fund, 100, y)
    .text(type, 170, y, { width: 90, align: "right" })
    .text(class1, 240, y, { width: 90, align: "right" })
    .text(rate, 310, y, {width:90, align: "right"})
    .text(amount, 380, y, {width: 90, align:"right"})
    .text(units, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#000")
    .lineWidth(1)
    .moveTo(20, y)
    .lineTo(550, y)
    .stroke();
}

function generateHry(doc, x) {
  doc
    .strokeColor("#000")
    .lineWidth(1)
    .moveTo(x, 340)
    .lineTo(x, 460)
    .stroke();
}

}}
       catch (error){
         console.log("Data not found", error);
       }
}
catch (error){
  console.log("Data not found", error);


}
}



async function createICtaxPdf(mob, MobileNumber, path) {

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



         var options = {  year: 'numeric', month: 'long', day: 'numeric' };
         var today  = new Date().toLocaleDateString("en-US",options);
         console.log(today)

         let doc = new PDFDocument({ size: "A4", margin: 20 });

         generateHeader(doc);
         generateCustomerInformation(doc);
         //generateHeading(doc);
         //generateInvoiceTable(doc);
         //generateFooter(doc);

         doc.end();
         doc.pipe(fs.createWriteStream('taxCertf/IC-taxCertf/AKDIML-IC-TAX'+regNo+'.pdf'));




       function generateHeader(doc) {
         doc
           .image("logo.png", 20, 20, {width: 320})
           .moveDown();
       }


       function generateCustomerInformation(doc) {

         const customerInformationTop = 155;

         doc
           .fontSize(10)
           .font("Helvetica-Bold")
           .text(today  , 20, customerInformationTop + -15)

           .font("Helvetica")
           .text("Mobile: "+mobileNumber, 20, customerInformationTop + 85)
           .font("Helvetica-Bold")
           .text("Reg. No. "+regNo  , 20, customerInformationTop + 10)
           .font("Helvetica-Bold")
           .text(userName, 20, customerInformationTop + 25)
           .font("Helvetica")
           .text(address, 20, customerInformationTop + 40)
           .text( city.replace(/\s+/g, ' ').trim(),20, customerInformationTop + 55)
           .text( country.replace(/\s+/g, ' ').trim(), 20, customerInformationTop + 70)
           .font("Helvetica-Bold")
           .text("SUBJECT :                         "+" INVESTMENT CONFIRMATION" , 20, customerInformationTop + 120)

           .moveDown();
       }
}
       catch (error){
         console.log("Data not found", error);
       }
}
catch (error){
  console.log("Data not found", error);


}
}

async function createVoItaxPdf(mob, MobileNumber, path) {

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



         var options = {  year: 'numeric', month: 'long', day: 'numeric' };
         var today  = new Date().toLocaleDateString("en-US",options);
         console.log(today)

         let doc = new PDFDocument({ size: "A4", margin: 20 });

         generateHeader(doc);
         generateCustomerInformation(doc);
         //generateHeading(doc);
         //generateInvoiceTable(doc);
         //generateFooter(doc);

         doc.end();
         doc.pipe(fs.createWriteStream('taxCertf/VoI-taxCertf/AKDIML-VOI-TAX'+regNo+'.pdf'));




       function generateHeader(doc) {
         doc
           .image("logo.png", 20, 20, {width: 320})
           .moveDown();
       }


       function generateCustomerInformation(doc) {

         const customerInformationTop = 155;

         doc
           .fontSize(10)
           .font("Helvetica-Bold")
           .text(today  , 20, customerInformationTop + -15)

           .font("Helvetica")
           .text("Mobile: "+mobileNumber, 20, customerInformationTop + 85)
           .font("Helvetica-Bold")
           .text("Reg. No. "+regNo  , 20, customerInformationTop + 10)
           .font("Helvetica-Bold")
           .text(userName, 20, customerInformationTop + 25)
           .font("Helvetica")
           .text(address, 20, customerInformationTop + 40)
           .text( city.replace(/\s+/g, ' ').trim(),20, customerInformationTop + 55)
           .text( country.replace(/\s+/g, ' ').trim(), 20, customerInformationTop + 70)
           .font("Helvetica-Bold")
           .text("SUBJECT :                         " +  "CONFIRMATION OF VALUE OF INVESTMENTS" , 20, customerInformationTop + 120)

           .moveDown();


       }


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
   createCGTtaxPdf:createCGTtaxPdf ,
   createICtaxPdf: createICtaxPdf,
   createVoItaxPdf:createVoItaxPdf

 }
