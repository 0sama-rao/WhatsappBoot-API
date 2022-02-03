const  config = {
  user:  'sa', // sql user
  password:  'Akdiml@123', //sql user password
  server:  '10.1.1.14', // if it does not work try- localhost
  database:  'AKDIML',
  options: {

    encrypt: false,
    trustServerCertificate: true,
    instancename:  'MSSQLSERVER'  // SQL Server instance name
  },
  port:  1433
}

module.exports = config;
