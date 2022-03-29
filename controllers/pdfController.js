const fs = require("fs");
const PDFDocument = require("pdfkit");
var  config = require('../dbconfig');
const  sql = require('mssql');



let regNo, mobileNumber, userName, address, city, country, zakatStatus, url ;
let balInquirey,balUnitCount, balInquirey2, balInquirey3, statData, balance,balance1,balance2,oPBalance;

async function createPdf(mob, MobileNumber, path) {

   try{
     let  pool = await  sql.connect(config);
     mob1 = await  pool.request()
     .input('input', sql.VarChar, mob)
     .query("SELECT * from Users where Mobile ='"+mob+"'");


      userInfromation = mob1.recordsets;


     regNo = mob1.recordset[0].RegNo;
     userName = mob1.recordset[0].Name;
     address = mob1.recordset[0].Address;
     city = mob1.recordset[0].City;
     country = mob1.recordset[0].Country;
     zakatStatus = mob1.recordset[0].ZakatStatus;
     mobileNumber = mob1.recordset[0].Mobile;



        try{

          let  pool = await  sql.connect(config);
          mob2 = await  pool.request()
          .input('MobileNumber', sql.VarChar, mob)
          .query("exec trump_D @MobileNumber  = '"+mob+"';");


          transData = mob2.recordsets;

        console.log(transData);


      try {
        let  pool = await  sql.connect(config);
        let  mob3 = await  pool.request()
        .input('MobileNumber', sql.VarChar, mob)
        .query("exec balInformation @MobileNumber  = '"+mob+"';");
        statData2 = mob3.recordsets;

        balInquirey = mob3.recordsets;

        console.log(mob3.recordset);
        // console.log(balInquirey[0][2].fundcode)




            try{
              let  pool = await  sql.connect(config);
              let  mob4 = await  pool.request()
              .input('MobileNumber', sql.VarChar, mob)
              .query("exec OpenBalance @MobileNumber  = '"+mob+"';");
              balance1 = mob4.recordset[0].openBalance


              balance = balance1;


              console.log(balance1);
              console.log(mob);


     //Should take input and save data into string and pass thath string into formatted form of pdf
     let doc = new PDFDocument({ size: "A4", margin: 20 });

     generateHeader(doc);
     generateCustomerInformation(doc, userName);
     generateHeading(doc);
     generateInvoiceTable(doc, statData);
     generateFooter(doc);

     doc.end();
     doc.pipe(fs.createWriteStream('accountStatement-pdf-files/AKDIML'+regNo+'.pdf'));




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
    .image("logo.png", 20, 20, {width: 320})
    .moveDown();
}


function generateCustomerInformation(doc) {

  const customerInformationTop = 105;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Mobile: "+mobileNumber, 20, customerInformationTop + 75)
    .font("Helvetica-Bold")
    .text("Reg. No. "+regNo  , 20, customerInformationTop + 0)
    .font("Helvetica-Bold")
    .text(userName, 20, customerInformationTop + 15)
    .font("Helvetica")
    .text(address, 20, customerInformationTop + 30)
    .text( city.replace(/\s+/g, ' ').trim()
    + ", " + country.replace(/\s+/g, ' ').trim(),
    20, customerInformationTop + 45)
    .text(zakatStatus , 20, customerInformationTop + 60)
    .moveDown();
}

function generateHeading(doc) {
  doc
    .fillColor("#444444")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Account Statement", 220,210);

  generateHr(doc, 230);
}







function generateInvoiceTable(doc, statData) {

  let i;
  const accStatTableTop = 240;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc
    .fontSize(11)
    .text("Date", 20,240)
    .text("Fund", 80,240)
    .text("Type", 125,240)
    .text("Class", 215,240)
    .text("Rate", 258,240)
    .text("Amount", 300,240)
    .text("Units", 360,240)
    .text("Bal Units", 425,240)
    .text("Value in Rs.", 490,240)
  );

  generateHr(doc, accStatTableTop + 20);
  doc.font("Helvetica");

  // for (i = 0; i < statData.length; i++) {
  //      const item = statData[i];
  //     }

  let xPos = 20;
  let yPos = 285;
  let openBal ;
  let yPosH = 385;
  let yPos2= 410;
  for (i = 0; i < transData[0].length; i++) {
    let item = transData[i];

    balance = transData[0][i].Units+ balance;
    balUnitCount = balance.toFixed(4);

    let opnBalance = balance1.toFixed(4);

    generateTableRow(
      doc
      .fontSize(10)
      .font("Helvetica")
      .text(opnBalance, 425, 270)
      .text(transData[0][i].TranDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0] , xPos, yPos)
      .text(transData[0][i].FundCode,  xPos+60, yPos)
      .text("Opening Balance" , xPos+105, 270)
      .text(transData[0][i].Type , xPos+105, yPos)
      .text(transData[0][i].Class , xPos+208, yPos)
      .text(transData[0][i].Rate , xPos+235, yPos)
      .text(transData[0][i].Amount , xPos+280, yPos)
      .text(transData[0][i].Units , xPos+340, yPos)
      .text( balUnitCount , xPos+405, yPos)
      .text()


      // .text("Balance based on repurchase price:", xPos, yPos2)
      // .text(balInquirey[0][0]+": "+balInquirey[0][1]+"  (" + formatDate(new Date())+")", xPos, yPos2+10)
      // .text(balInquirey[1][0]+": "+balInquirey[1][1]+"  (" + formatDate(new Date())+")", xPos, yPos2+20)
      // .text(balInquirey[2][0]+": "+balInquirey[2][1]+"  (" + formatDate(new Date())+")", xPos, yPos2+30)
      // .text(balInquirey[3][0]+": "+balInquirey[3][1]+"  (" + formatDate(new Date())+")", xPos, yPos2+40)

      );


      yPos =yPos +15;



      // .text(transData[i][0][1], 50, 430));
    //   + transData[i][1] + "\xa0\xa0\xa0\xa0\xa0\xa0" + transData[i][2] + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +transData[i][3] + "\xa0\xa0\xa0\xa0\xa0\xa0" + transData[i][4] + "\xa0\xa0\xa0\xa0\xa0\xa0" + transData[i][5] + "\xa0\xa0\xa0\xa0\xa0\xa0"+ transData[i][6] + "\xa0\xa0\xa0\xa0\xa0\xa0"
    // );
}
generateHr(doc, yPos);


for (j = 0; j < balInquirey[0].length; j++) {
  let items = balInquirey[j];

generateTableRow(
  doc
  .fontSize(10)
  .font("Helvetica-Bold")
  .text(balInquirey[0][j].fundcode+":", xPos, yPos2-15)
  .text("Rs."+balInquirey[0][j].Redemption.toFixed(4), xPos + 45, yPos2-15)
  .text(balInquirey[0][j].BalUnits.toFixed(4), xPos+405, yPos2-15)
  .text(balInquirey[0][j].Values.toFixed(2), xPos+475, yPos2-15)
  // .text(balInquirey[j][1], xPos +60, yPos2)

);
yPos2 = yPos2+10;

}
generateTableRow(
  doc
  .fontSize(10)

  .text("Disclaimer:",xPos, yPosH+335)
  .text("Balance based on repurchase price of: "+balInquirey[0][0].eDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0] , xPos, yPosH-8)
  .text(balUnitCount , xPos+405, yPos+8)

);
var x ="'AKD Investment Management Limited Registrar'";
generateTableRow(
doc
.fontSize(10)
.font("Helvetica")
.text("The following Account Statement is for information and viewing purposes only. The value of the Units is applicable for" ,xPos, yPosH+350)
.text("the mentioned date only. The value of the Units may vary at the time of more purchase of Units or at the time of redemption" ,xPos, yPosH+363)
.text("of Units.For any discrepancy in the account statement call our UAN: 92-21-111-253-465 or call Registrar of the Fund " ,xPos, yPosH+376)
.text("at 92-21-35810461-0466." ,xPos+234, yPosH+389)
.font("Helvetica-Bold")
.text(x,xPos, yPosH+389 )
.text("(This is system generated statement doest not require any signature)",xPos+105, yPosH+413 )
);
}

function generateFooter(doc) {
  doc
    .fontSize(10)

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
    .moveTo(20, y)
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

  return day + "/" + month + "/" + year;
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
catch (error){
  console.log("Data not found", error);
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
catch (error){
  console.log("Data not found", error);
}

}



 module.exports = {
   createPdf:createPdf
 }
