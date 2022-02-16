const fs = require("fs");
const PDFDocument = require("pdfkit");
var  config = require('../dbconfig');
const  sql = require('mssql');



let regNo, userName, address, city, country, zakatStatus, url ;
let transRec1, transRec2, transRec3, transRec4, transRec5, statData;
let transData = [];
async function createPdf(mob, path) {

   try{
     let  pool = await  sql.connect(config);
     mob = await  pool.request()
     .input('input', sql.VarChar, mob)
     .query("SELECT * from Users where Mobile = @input");

     regNo = mob.recordset[0].RegNo;
     userName = mob.recordset[0].Name;
     address = mob.recordset[0].Address;
     city = mob.recordset[0].City;
     country = mob.recordset[0].Country;
     zakatStatus = mob.recordset[0].ZakatStatus;
      console.log();

        try{
          let  pool = await  sql.connect(config);
          mob = await  pool.request()

          .query("select top 5 TranDate, FundCode,Type,  Class,Rate, Amount, Units from AccStat where RegNo ='5735' order by 1 desc");

          statData = mob.recordsets;


          transData = [[
           mob.recordset[0].TranDate,
           mob.recordset[0].FundCode,
           mob.recordset[0].Type,
           mob.recordset[0].Class,
           mob.recordset[0].Rate,
           mob.recordset[0].Amount,
           mob.recordset[0].Units
         ],
           [
           mob.recordset[1].TranDate,
           mob.recordset[1].FundCode,
           mob.recordset[1].Type,
           mob.recordset[1].Class,
           mob.recordset[1].Rate,
           mob.recordset[1].Amount,
           mob.recordset[1].Units
         ],
          [
           mob.recordset[2].TranDate,
           mob.recordset[2].FundCode,
           mob.recordset[2].Type,
           mob.recordset[2].Class,
           mob.recordset[2].Rate,
           mob.recordset[2].Amount,
           mob.recordset[2].Units
         ],
         [
           mob.recordset[3].TranDate,
           mob.recordset[3].FundCode,
           mob.recordset[3].Type,
           mob.recordset[3].Class,
           mob.recordset[3].Rate,
           mob.recordset[3].Amount,
           mob.recordset[3].Units
         ],
         [
           mob.recordset[4].TranDate,
           mob.recordset[4].FundCode,
           mob.recordset[4].Type,
           mob.recordset[4].Class,
           mob.recordset[4].Rate,
           mob.recordset[4].Amount,
           mob.recordset[4].Units
         ]
];



          console.log(transData);



          }
        catch (error){
          console.log("Data not found", error);
        }



     //Should take input and save data into string and pass thath string into formatted form of pdf
     let doc = new PDFDocument({ size: "A4", margin: 50 });

     generateHeader(doc);
     generateCustomerInformation(doc, userName);
     generateHeading(doc);
     generateInvoiceTable(doc, statData);
     generateFooter(doc);

     doc.end();
     doc.pipe(fs.createWriteStream('pdf-files/AKDIML'+regNo+'.pdf'));

}

  catch (error){
     console.log("Data not found", error);
   }
//
// Generating main header heading with forma
// function generateHeader(doc){
//   doc
//   .image("lgo.png",50 ,45 {width:50})
//   .fillcolor("#0000")
//   .fontSize(20)
//   .text("AKDIML", 110, 57)
//   .fontsize(10)
//   .text("Table data" 120, 122)
//   .fontsize(10)
//   .text("Xyz" 110, 112)
//   .movedown()
//
// }

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 40, {width: 180})
    .moveDown();
}


function generateCustomerInformation(doc) {
  doc
    .fillColor("#444444")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Personal Information", 50, 160);

  generateHr(doc, 175);

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(formatDate(new Date()), 50, customerInformationTop + 90)
    .font("Helvetica-Bold")
    .text("Reg. No. "+regNo  , 50, customerInformationTop + 15)
    .font("Helvetica-Bold")
    .text(userName, 50, customerInformationTop + 30)
    .font("Helvetica")
    .text(address, 50, customerInformationTop + 45)
    .text( city.replace(/\s+/g, ' ').trim()
    + ", " + country.replace(/\s+/g, ' ').trim(),
    50, customerInformationTop + 60)
    .text(zakatStatus , 50, customerInformationTop + 75)
    .moveDown();
}

function generateHeading(doc) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("ACCOUNT STATEMENT", 240,320);

  generateHr(doc, 340);
}







function generateInvoiceTable(doc, statData) {

  let i;
  const accStatTableTop = 350;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    accStatTableTop,
    "Date",
    "Fund",
    "Type",
    "Class",
    "Amount",
    "Units",
    "Bal Units",

  );

  generateHr(doc, accStatTableTop + 15);
  doc.font("Helvetica");

  // for (i = 0; i < statData.length; i++) {
  //      const item = statData[i];
  //     }
  for (i = 0; i < transData.length; i++) {
    let item = transData[i];
    const position = accStatTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      transData.TranDate,
      transData.FundCode,
      item.Class,
      item.Rate,
      item.Amount,
      item.Units
    );

  }
}

//   const subtotalPosition = accStatTableTop + (i + 1) * 30;
//   generateTableRow(
//     doc,
//     subtotalPosition,
//     "",
//     "",
//     "Subtotal",
//     "",
//     formatCurrency(accStat.subtotal)
//   );
//
//   const paidToDatePosition = subtotalPosition + 20;
//   generateTableRow(
//     doc,
//     paidToDatePosition,
//     "",
//     "",
//     "Paid To Date",
//     "",
//     formatCurrency(accStat.paid)
//   );
//
//   const duePosition = paidToDatePosition + 25;
//   doc.font("Helvetica-Bold");
//   generateTableRow(
//     doc,
//     duePosition,
//     "",
//     "",
//     "Balance Due",
//     "",
//     formatCurrency(accStat.subtotal - accStat.paid)
//   );
//   doc.font("Helvetica");
// }
//
function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
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
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return  (cents).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}


// const accStat = {
//   AccInfo: {
//     RegNo: 1,
//     name: "AKD",
//     address: "618 CONTINENTAL TRADE CENTRE BLOCK-VIII CLIFTON",
//     city: "KARACHI",
//     country: "PAKISTAN",
//     zakat_status: "ZAKAT DECLALRATION ATTACHED"
//   },
//   items: [
//     {
//       item: "TC 100",
//       description: "Toner Cartridge",
//       quantity: 2,
//       amount: 6
//     },
//     {
//       item: "USB_EXT",
//       description: "USB Cable Extender",
//       quantity: 1,
//       amount: 2000
//     }
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234
// };
// }
}

 module.exports = {
   createPdf:createPdf
 }
