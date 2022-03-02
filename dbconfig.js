const  config = {
  user:  'akdiml', // sql user
  password:  'imlweb', //sql user password
  server:  '202.63.219.93', // if it does not work try- localhost
  database:  'AKDIML',
  options: {

    encrypt: false,
    trustServerCertificate: true,
    instancename:  'MSSQLSERVER'  // SQL Server instance name
  },
  port:  1433
}

module.exports = config;
