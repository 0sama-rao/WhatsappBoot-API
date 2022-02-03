var  db = require('./controllers/userController');
const { pdfController } = require('./controllers/pdfController');
var  login = require('./login');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
  console.log('middleware');
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


//to list all the users/investors
router.route('/user/create-pdf').get((request, response) => {
  pdfController.createInvoice().then((data) => {
    response.json("Pdf Created", path);
  })
})
// //list the user with NIC
// router.route('/user/:id').get((request, response) => {
//   db.getUserByNIC(request.params.id).then((data) => {
//     response.json(data);
//   })
// })







router.route('users/login').post((request, response) => {
  let user = {...request.body}
  db.addUser(user).then(data => {
    response.status(201).json(data);
  })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('Port is listening at '+ port);
