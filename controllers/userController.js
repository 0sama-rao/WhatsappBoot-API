var  config = require('../dbconfig');
const  sql = require('mssql');
const HttpError = require ('../models/http-error');

async function getUsers() {

  try {
    let pool = await  sql.connect(config);
    let users = await  pool.request()
    .query("Select * from Users"); //exexuting get User procedure
    return users.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

//getUser data by InvestorID
async  function  getUserByRegNo(RegNo) {
  try{
    let  pool = await  sql.connect(config);
    let  product = await  pool.request()
    .input('input_parameter', sql.Int, RegNo)
    .query("SELECT * from Users where RegNo = @input_parameter");
    return  product.recordsets;



  }



  catch (error) {
    console.log("Cant use Characters ", 404);
  }

}

 // => {place } => {place: place}

//Get UserInfo by MobileNumberS
async  function  getUserByMobileNumber(MobileNumber) {
  try {
    let  pool = await  sql.connect(config);
    let  mobFunc = await  pool.request()
    .input('input_parameter', sql.VarChar, MobileNumber)
    .query("SELECT * from Users where Mobile = @input_parameter");
    return mobFunc.recordsets;
  }
  catch (error) {
    console.log("Error found !! ", 404);
  }
  finally{
    if(!MobileNumber){
      console.log("Cant found ")
    }
  }
}


//get Balance Inquirey by MobileNumber
async  function getUserBalanceInquiryByMobileNumber(MobileNumber) {
  try {
    let  pool = await  sql.connect(config);
    let  mob = await  pool.request()
    .input('MobileNumber', sql.VarChar, MobileNumber)
    .execute('GetBalanceInquiery_new');
    return  mob.recordsets;
  }
  catch (error) {
    console.log("Data not found", error);
  }
}


//Latest Fund Prices

async  function  getLatestFundPrices() {
  try {
    let  pool = await  sql.connect(config);
    let  fundPrices = await  pool.request()
    .execute("LatestFundPrices");
    return fundPrices.recordsets;
  }
  catch (error) {
    console.log("Error found !! ", 404);
  }
}

//Get fund manager report link
async  function  getFmReport() {
  try {
    let  pool = await  sql.connect(config);
    let  report = await  pool.request()
    .query("SELECT   FileName FROM   UFiles where page ='FundManager Reports' and PageHead ='Product Monitor' and ID in  (SELECT  Max(ID) FROM  UFiles where page ='FundManager Reports' and PageHead ='Product Monitor')   order by 1 desc");
    return report.recordsets;
  }
  catch (error) {
    console.log("Error found !! ", 404);
  }
}
// async function createPDF(pdf){
//   try{
//
//     let pool = wait sql.connect(config );
//     let cc = await pool.request ()
//     .input()
//     .query();
//     return cc.recordsets
//   }
//   catch(error){
//     console.log("Error 404", error);
//   }
// }

// //getUser data by NIC
// async  function  getUserByNIC(NIC) {
//   try {
//     let  pool = await  sql.connect(config);
//     let  product = await  pool.request()
//     .input('input_parameter', sql.NVarChar, NIC)
//     .query("SELECT * from login where NIC = @input_parameter");
//     return  product.recordsets;
//   }
//   catch (error) {
//     console.log(error);
//   }
// }



async function addUser(user) {
  try {
    let pool = await sql.connect(config);
    let insertUser = await pool.request()
    .input('Email', sql.NVarChar, user.Email)
    .input('Password', sql.NVarChar, user.Password)
    .input('User_Type', sql.NVarChar, user.User_Type)

    .execute('InsertUsers');
    return insertUser.recordsets;
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {
  getUsers:getUsers,
  getUserByRegNo:getUserByRegNo,
  getUserByMobileNumber:getUserByMobileNumber,
  getUserBalanceInquiryByMobileNumber:getUserBalanceInquiryByMobileNumber,
  getLatestFundPrices: getLatestFundPrices,
  getFmReport: getFmReport,
  addUser:addUser
}
