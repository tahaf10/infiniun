'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var cors = require('cors');

//create express web-app
const app = express();
const router = express.Router();

//get the libraries to call
var network = require('./network/network.js');
var validate = require('./network/validate.js');
var analysis = require('./network/analysis.js');

//bootstrap application settings
app.use(cors());
app.use(express.static('./public'));
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));
app.use(bodyParser.json());

//get home page
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//get member page
app.get('/member', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member.html'));
});

//get member registration page
app.get('/registerMember', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerMember.html'));
});

//get partner page
app.get('/partner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/partner.html'));
});

//get partner registration page
app.get('/registerPartner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerPartner.html'));
});

//get about page
app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/about.html'));
});


//post call to register member on the network
app.post('/api/registerMember', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;

  //print variables
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' email: ' + email + ' phonenumber: ' + phoneNumber + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

        //else register member on the network
        network.registerMember(cardId, accountNumber, firstName, lastName, email, phoneNumber)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
});

//post call to register partner on the network
app.post('/api/registerPatient', function(req, res) {

  //declare variables to retrieve from request
  var name = req.body.name;
  var contact = req.body.contact;
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + name + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  
        //else register partner on the network
        network.registerPartner(cardId, partnerId, name, contact)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
      

});
//post call to register partner on the network
app.post('/api/registerLabs', function(req, res) {

  //declare variables to retrieve from request
  var contact = req.body.contact;
 
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + contact + ' partnerId: ' + partnerId + ' cardId: ' + cardId);
        //else register partner on the network
        network.registerLabs(cardId, partnerId, contact)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
     
});
//post call to perform EarnPoints transaction on the network
app.post('/api/beginConsultation', function(req, res) {

  //declare variables to retrieve from request
  var patientID = req.body.patientID;
  var cardId = req.body.cardid;
  var doctorID = req.body.doctorID;
  var consultation = req.body.consultation;

  //print variables
  console.log('Using param - points: ' + cardId + ' partnerId: ' + patientID + ' accountNumber: ' + doctorID + 'consultation: ' + JSON.stringify(consultation));

  //validate points field

  
        //else perforn EarnPoints transaction on the network
        network.beginConsultation(cardId,JSON.stringify(consultation),patientID,doctorID)
        .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });

});

//post call to perform UsePoints transaction on the network
app.post('/api/usePoints', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var partnerId = req.body.partnerid;
  var points = parseFloat(req.body.points);

  //print variables
  console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //validate points field
  validate.validatePoints(points)
    //return error if error in response
    .then((checkPoints) => {
      if (checkPoints.error != null) {
        res.json({
          error: checkPoints.error
        });
        return;
      } else {
        points = checkPoints;
        //else perforn UsePoints transaction on the network
        network.usePointsTransaction(cardId, accountNumber, partnerId, points)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
      }
    });


});

//post call to retrieve member data, transactions data and partners to perform transactions with from the network
app.post('/api/doctorData', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;

  //print variables
  console.log('memberData using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get member data from network
  network.memberData(cardId, accountNumber)
    .then((doctor) => {
      //return error if error in response
      if (doctor.error != null) {
        res.json({
          error: doctor.error
        });
      } else {
        //else add doctor data to return object
        returnData.doctorID = doctor.doctorID;
        returnData.name = doctor.doctorName;
        returnData.contact = doctor.contact;
        returnData.description = doctor.description;
      }

      console.log(returnData);

      res.json(returnData);

    })
    /*.then(() => {
      //get UsePoints transactions from the network
      network.usePointsTransactionsInfo(cardId)
        .then((usePointsResults) => {
          //return error if error in response
          if (usePointsResults.error != null) {
            res.json({
              error: usePointsResults.error
            });
          } else {
            //else add transaction data to return object
            returnData.usePointsResults = usePointsResults;
          }

        })*//*.then(() => {
          //get EarnPoints transactions from the network
          network.earnPointsTransactionsInfo(cardId)
            .then((earnPointsResults) => {
              //return error if error in response
              if (earnPointsResults.error != null) {
                res.json({
                  error: earnPointsResults.error
                });
              } else {
                //else add transaction data to return object
                returnData.earnPointsResult = earnPointsResults;
              }

            })*/
            /*.then(() => {
              //get partners to transact with from the network
              network.allPartnersInfo(cardId)
              .then((partnersInfo) => {
                //return error if error in response
                if (partnersInfo.error != null) {
                  res.json({
                    error: partnersInfo.error
                  });
                } else {
                  //else add partners data to return object
                  returnData.partnersData = partnersInfo;
                }

                //return returnData
                res.json(returnData);

              });
            });*/
        });
    


//post call to retrieve partner data and transactions data from the network
app.post('/api/patientData', function(req, res) {

  //declare variables to retrieve from request
  var partnerId = req.body.patientid;
  var cardId = req.body.cardid;

  //print variables
  console.log('partnerData using param - ' + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get partner data from network
  network.partnerData(cardId, partnerId)
    .then((patient) => {
      //return error if error in response
      if (patient.error != null) {
        res.json({
          error: patient.error
        });
      } else {
        //else add partner data to return object
        returnData.id = patient.patientID;
        returnData.name = patient.name;
        returnData.contact = patient.contact;
      }

      console.log(returnData);

      res.json(returnData);

    })
   /* .then(() => {
      //get UsePoints transactions from the network
      network.usePointsTransactionsInfo(cardId)
        .then((usePointsResults) => {
          //return error if error in response
          if (usePointsResults.error != null) {
            res.json({
              error: usePointsResults.error
            });
          } else {
            //else add transaction data to return object
            returnData.usePointsResults = usePointsResults;
            //add total points collected by partner to return object
            returnData.pointsCollected = analysis.totalPointsCollected(usePointsResults);
          }

        })
        .then(() => {
          //get EarnPoints transactions from the network
          network.earnPointsTransactionsInfo(cardId)
            .then((earnPointsResults) => {
              //return error if error in response
              if (earnPointsResults.error != null) {
                res.json({
                  error: earnPointsResults.error
                });
              } else {
                //else add transaction data to return object
                returnData.earnPointsResults = earnPointsResults;
                //add total points given by partner to return object
                returnData.pointsGiven = analysis.totalPointsGiven(earnPointsResults);
              }

              //return returnData
              res.json(returnData);

            });
        });
    });*/

});

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});
