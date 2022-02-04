var  config = require('../dbconfig');
const  sql = require('mssql');

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
  try {
    let  pool = await  sql.connect(config);
    let  product = await  pool.request()
    .input('input_parameter', sql.Int, RegNo)
    .query("SELECT * from Users where RegNo = @input_parameter");
    return  product.recordsets;
  }
  catch (error) {
    console.log("Error found !! ", 404);
  }
}

//Get UserInfo by MobileNumberS
async  function  getUserByMobileNumber(MobileNumber) {
  try {
    let  pool = await  sql.connect(config);
    let  product = await  pool.request()
    .input('input_parameter', sql.VarChar, MobileNumber)
    .query("SELECT * from Users where Mobile = @input_parameter");
    return  product.recordsets;

  }
  catch (error) {
    console.log("Error found !! ", 404);
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


async function getFundPrices (){
  let pool = await sql.connect (config);
  let fundNav = await pool.
}

//
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
  addUser:addUser
}
