var  db = require('./controllers/userController');
var pdf = require('./controllers/pdfController');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
const HttpError = require('./models/http-error');
var  app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
  console.log('Method Executed !');
  next();
});


//to list all the users/investors
router.route('/users').get((request, response) => {
  db.getUsers().then((data) => {
    response.json(data[0]);
  })
})

//Get UserInfo by RegNo
router.route('/user/info/:id').get((request, response) => {
  db.getUserByRegNo(request.params.id).then((data) => {
    if(data == null){
      response.json("Data not found",404)
    }
    response.json(data);
  })
})

//list the user with Mobile Number
router.route('/user/:mobile').get((request, response) => {
  db.getUserByMobileNumber(request.params.mobile).then((data) => {
    response.json(data);
  })
})

//get Balance Inquirey by MobileNumber
router.route('/user/BalanceInquiry/:mobile').get((request, response) => {
  db.getUserBalanceInquiryByMobileNumber(request.params.mobile).then((data) => {
    response.json(data);
  })
})

router.route('/user/FundPrices/:id').get((request, response) => {
  db.getFundPrices(request.params.id).then((data) => {
    response.json(data);
  })
})


// const getFundPrices = (req, res, next) => {
//   const placeId = req.params.id; //{pid: 'p1'}
//   const place = accStat.find(p=>{
//     return p.RegNo === id;
//   });
//
//   if( !place ){
//     throw new HttpError ('Could not find the place for the provide ID',404);
//   }
//   res.json({place}); // => {place } => {place: place}
// };
//get Balance Inquirey by MobileNumber
// router.route('/user/AccountStatement/:mobile').get((request, response) => {
//   pdfController.createInvoice(request.params.mobile).then(() => {
//   response.return(path);
//



router.route('/user/AccountStatement/:mobile').get((request, response) => {
  pdf.createPdf(request.params.mobile).then((data)=>{
    response.json(data);
  });

  response.json("Pdf Created! ");
});

// router.route('/user/AccountStatement/:mobile').get((request, response) => {
//   const pMob = request.params.id;
//   const pData = createPdf.find(data=>{
//     response.json(data);
//   })
//   if (!pData){
//     throw new Httperror('Not Regiestered! ')
//   }
//   response.json(data);
// });


router.route('users/login').post((request, response) => {
  let user = {...request.body}
  db.addUser(user).then(data => {
    response.status(201).json(data);
  })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('Port is listening at '+ port);
