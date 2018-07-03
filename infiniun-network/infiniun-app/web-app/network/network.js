const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.acme';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'infiniun-network';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'infiniun-network';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

  //disconnect existing connection
  await businessNetworkConnection.disconnect();

  //connect to network using cardName
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//export module
module.exports = {
/*
  * Create Member participant and import card for identity
  * @param {String} cardId Import card id for member
  */
 getDoctors: async function (cardId) {
  try {

    console.log("Hi-"+cardId);
    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@infiniun-network');

    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    
    //add member participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
    await participantRegistry.getAll();

    console.log("here1");
    
    //disconnect
    await businessNetworkConnection.disconnect('admin@infiniun-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log("here111 "+err);
    var error = {};
    error.error = err.message;
    return error;
  }

},




  /*
  * Create Member participant and import card for identity
  * @param {String} cardId Import card id for member
  * @param {String} accountNumber Member account number as identifier on network
  * @param {String} firstName Member first name
  * @param {String} lastName Member last name
  * @param {String} phoneNumber Member phone number
  * @param {String} email Member email
  */
 registerMember: async function (cardId, accountNumber,firstName, lastName, email, phoneNumber) {
    try {

      console.log("Hi-"+cardId);
      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@infiniun-network');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create member participant
      const member = factory.newResource(namespace, 'Doctor', accountNumber);
      member.doctorName = firstName;
      member.contact = phoneNumber;
      member.description = "date";

      //add member participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      await participantRegistry.add(member);

      console.log("here1");
      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Doctor#' + accountNumber, cardId);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

      //import card for identity
      await importCardForIdentity(cardId, identity);
      console.log(cardStore);
      //disconnect
      await businessNetworkConnection.disconnect('admin@infiniun-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log("here111 "+err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
/*
  * Create Pharmacy participant and import card for identity
  * @param {String} cardId Import card id for partner
  * @param {String} pharmacyId as identifier on network
  * @param {String} name Pharmacy name
  * @param {String} contact
  *  @param {String} pharmacyMedDB
  */
 registerPharmacy: async function (cardId, pharmacyId, name, contact,pharmacyMedDB) {

  try {

    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@infiniun-network');

    //get the factory for the business network.
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    console.log("hi here");
    //create partner participant
    const pharmacy = factory.newResource(namespace, 'Pharmacy', pharmacy);
    pharmacy.pharmacyName = name;
    pharmacy.pharmacyMedDB = pharmacyMedDB;
    pharmacy.contact = contact;

    //add partner participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Pharmacy');
    await participantRegistry.add(pharmacy);

    console.log("hi added");
    console.log(cardStore);

    //issue identity
    const identity = await businessNetworkConnection.issueIdentity(namespace + '.Pharmacy#' +pharmacyId, cardId);

    //import card for identity
    await importCardForIdentity(cardId, identity);

    //disconnect
    await businessNetworkConnection.disconnect('admin@infiniun-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},





  /*
  * Create Partner participant and import card for identity
  * @param {String} cardId Import card id for partner
  * @param {String} partnerId Partner Id as identifier on network
  * @param {String} name Partner name
  * @param {String} contact
  */
  registerPartner: async function (cardId, partnerId, name, contact) {

    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@infiniun-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      console.log("hi here");
      //create partner participant
      const partner = factory.newResource(namespace, 'Patient', partnerId);
      partner.name = name;
      partner.contact = contact;
      //add partner participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      await participantRegistry.add(partner);

      console.log("hi added");
      console.log(cardStore);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Patient#' + partnerId, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@infiniun-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },
/*
  * Create Partner participant and import card for identity
  * @param {String} cardId Import card id for partner
  * @param {String} labId Partner Id as identifier on network
  * @param {String} contact
  */
 registerLabs: async function (cardId, labId, contact) {

  try {

    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@infiniun-network');

    //get the factory for the business network.
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create lab participant
    const lab = factory.newResource(namespace, 'Lab', labId);
    lab.contact = contact;
    //add partner participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Lab');
    await participantRegistry.add(lab);

    //issue identity
    const identity = await businessNetworkConnection.issueIdentity(namespace + '.Lab#' + labId, cardId);

    //import card for identity
    await importCardForIdentity(cardId, identity);

    //disconnect
    await businessNetworkConnection.disconnect('admin@infiniun-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},
  /*
  * Perform EarnPoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} patientID Patient Id of partner
  * @param {String} doctorID Points value
  * @param {String} consultationID consultationid
  * @param {String} illnessDescription illnessDescription
  * @param {String} message messageTo doctor
  * @param {String} consultationCompleted consultation Status

  */
  beginConsultation: async function (cardId, consultationID, patientID, doctorID,illnessDescription,consultationCompleted,message) {

    try {
      console.log('Using param - cardId: ' + cardId + ' patientID: ' + patientID + ' doctorID: ' + doctorID +' ConsultationID: ' + consultationID+' illnessDescription: ' + illnessDescription );

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@infiniun-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const startConsultation = factory.newTransaction(namespace, 'StartConsultation');
     //startConsultation.consultation = consultation;
      startConsultation.doctor = factory.newRelationship(namespace, 'Doctor', doctorID);
      startConsultation.patient = factory.newRelationship(namespace, 'Patient', patientID);

      
      
      startConsultation.consultation = factory.newResource(namespace, 'Consultation',consultationID);
      startConsultation.consultation.illnessDescription=illnessDescription;
      startConsultation.consultation.message='message';
      startConsultation.consultation.consultationCompleted=false;

      startConsultation.consultation.patient=factory.newRelationship(namespace, 'Patient', patientID);
      startConsultation.consultation.doctor=factory.newRelationship(namespace, 'Doctor', doctorID);
      // console.log("model="+JSON.stringify(startConsultation));
      // console.log("parameter="+JSON.stringify(consultation));
  
      //submit transaction
      await businessNetworkConnection.submitTransaction(startConsultation);
      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Perform UsePoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Patient Id of partner
  * @param {Integer} points Points value
  */
  usePointsTransaction: async function (cardId, accountNumber, partnerId, points) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const usePoints = factory.newTransaction(namespace, 'UsePoints');
      usePoints.points = points;
      usePoints.member = factory.newRelationship(namespace, 'Doctor', accountNumber);
      usePoints.partner = factory.newRelationship(namespace, 'Patient', partnerId);

      //submit transaction
      await businessNetworkConnection.submitTransaction(usePoints);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get Member data
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  */
  memberData: async function (cardId, doctorID) {

    try {
      console.log("############################################");

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get member from the network
      const memberRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      const member = await memberRegistry.get(doctorID);
      console.log("HERE");


      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return member object
      console.log(cardStore);
      return member;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },



  /*
  * Get Consultation data for Patient
  * @param {String} cardId Card id to connect to network
  * @param {String} patientID Account number of member
  */
 getPatientConsultationData: async function (patientID,cardId) {

  try {
    console.log("############################################");

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@infiniun-network');
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    var treatmentInf={};

    const consultationData = await businessNetworkConnection.query('selectConsultationPatient',{ patientID: 'resource:org.acme.Patient#'+patientID });
    console.log("con-ID :"+JSON.parse(JSON.stringify(consultationData))[0].consultationID);
    var consultationID=JSON.parse(JSON.stringify(consultationData))[0].consultationID;
    treatmentInf.consultationID=JSON.parse(JSON.stringify(consultationData))[0].consultationID;
    treatmentInf.illnessDescription=JSON.parse(JSON.stringify(consultationData))[0].illnessDescription;
    treatmentInf.message=JSON.parse(JSON.stringify(consultationData))[0].message;
    treatmentInf.consultationCompleted=JSON.parse(JSON.stringify(consultationData))[0].consultationCompleted;

    const treatmentData = await businessNetworkConnection.query('selectTreatmentPatient',{ consultationID: 'resource:org.acme.Consultation#'+consultationID });
    console.log("treat-ID :"+JSON.parse(JSON.stringify(treatmentData))[0].treatmentID);
    var treatmentID=JSON.parse(JSON.stringify(treatmentData))[0].treatmentID;
    treatmentInf.procedure=JSON.parse(JSON.stringify(treatmentData))[0].procedure;


    const treatmentDrugs = await businessNetworkConnection.query('selectTreatmentDrugs',{ ctreatmentID: 'resource:org.acme.Treatment#'+treatmentID });
    treatmentInf.medicine=JSON.parse(JSON.stringify(treatmentDrugs))[0].medicine;

    
    //disconnect
    await businessNetworkConnection.disconnect('admin@infiniun-network');
    //return member object
    //console.log("treatInfo-Consultaion"+JSON.stringify(treatmentInf));


    return treatmentInf;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},


  /*
  * Get Consultation data
  * @param {String} cardId Card id to connect to network
  * @param {String} doctorID Account number of member
  */
 getConsultationData: async function (doctorID,cardId) {

  try {
    console.log("############################################");

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //startConsultation.doctor = factory.newRelationship(namespace, 'Doctor', doctorID);

    const consultationData = await businessNetworkConnection.query('selectConsultation',{ doctorID: 'resource:org.acme.Doctor#'+doctorID });

    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    //return member object
    return JSON.stringify(consultationData);
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},



/*
  * Get SharedDrugs data
  * @param {String} cardId Card id to connect to network
  * @param {String} pharmacyID Account number of member
  */
 getSharedDrugs: async function (pharmacyID,cardId) {

  try {
    console.log("############################################");

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //startConsultation.doctor = factory.newRelationship(namespace, 'Doctor', doctorID);

    const sharedDrugs = await businessNetworkConnection.query('getSharedDrugs',{ pharmacyID: 'resource:org.acme.Pharmacy#'+pharmacyID });
    


    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    //return member object
    return JSON.stringify(sharedDrugs);
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},



/*
  * End Consultation data
  * @param {String} cardId Card id to connect to network
  * @param {String} doctorID DOCTOR ID 
  * 
  * @param {String} treatmentID 
  * @param {String} procedure 
  * @param {Boolean} medRequired  
  * @param {Boolean} hospitalVisitNeeded 
  * @param {Boolean} labTestRequired  
  * 
  * @param {String} illnessDescription  
  * @param {String} message 
  * 
  * 
  * @param {String} consultationID 
  * 
  * 
  * @param {String} treatmentDrugsID 
  * @param {String} medicineName
  * @param {String} medicineMG
  * @param {String} medicineAmount
  * 
  * 
  * @param {String} doctorID
  * @param {String} patientID
  */
 endConsultation: async function (cardId, consultationID,medicineName, medRequired,patientID, doctorID,illnessDescription,message,treatmentID,treatmentDrugsID,medicineMG,medicineAmount) {

    try {
        console.log("start Consultation Details : cardID :"+cardId, "consultID :"+consultationID, "medReq :"+medRequired,"PID :"+patientID, "Doc-Id :"+doctorID,"Illness-Desc :"+illnessDescription,"messge :"+message,"treatID :"+treatmentID,"teatDrgId :"+treatmentDrugsID);

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@infiniun-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const startConsultation = factory.newTransaction(namespace, 'EndConsultation');
     

      //concultationDetails Entry
      startConsultation.consultationDetails = factory.newConcept(namespace, 'ConsultationDetails');

      startConsultation.consultationDetails.illnessDescription=illnessDescription;
      startConsultation.consultationDetails.message=message;


        //Treatment Entry
        startConsultation.treatment = factory.newResource(namespace, 'Treatment',treatmentID);
        startConsultation.treatment.procedure = "take medicine";
        startConsultation.treatment.hospitalVisitNeeded = false;
        startConsultation.treatment.medRequired = medRequired;
        startConsultation.treatment.labTestRequired = false;
        startConsultation.treatment.consultation = factory.newRelationship(namespace, 'Consultation',consultationID);
      
      
        //TreatmentDrugs Entry
        startConsultation.treatmentDrugs = factory.newResource(namespace, 'TreatmentDrugs',treatmentDrugsID);
        startConsultation.treatmentDrugs.treatment = factory.newRelationship(namespace, 'Treatment',treatmentID);


       startConsultation.treatmentDrugs.medicine=factory.newConcept(namespace, 'Medicine');
       medicine=factory.newConcept(namespace, 'Medicine');
        medicine.name=medicineName;
        medicine.mg=medicineMG;
        medicine.amount=medicineAmount;
      
       startConsultation.treatmentDrugs.medicine=[medicine
       ]

       



        startConsultation.consultation = factory.newRelationship(namespace, 'Consultation', consultationID);
        startConsultation.patient = factory.newRelationship(namespace, 'Patient', patientID);
        startConsultation.doctor = factory.newRelationship(namespace, 'Doctor', doctorID);

      // console.log("model="+JSON.stringify(startConsultation));
      // console.log("parameter="+JSON.stringify(consultation));
  
      //submit transaction
      await businessNetworkConnection.submitTransaction(startConsultation);
      //disconnect
      await businessNetworkConnection.disconnect('admin@infiniun-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },



  /*
  * Get Patient data
  * @param {String} cardId Card id to connect to network
  * @param {String} partnerId Patient Id of partner
  */
  partnerData: async function (cardId, patientID) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get member from the network
      const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      const patient = await patientRegistry.get(patientID);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return partner object
      return patient;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all partners data
  * @param {String} cardId Card id to connect to network
  */
  allPartnersInfo : async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query all partners from the network
      const allPartners = await businessNetworkConnection.query('selectPartners');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return allPartners object
      return allPartners;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  /*
  * Get all EarnPoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  earnPointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query EarnPoints transactions on the network
      const earnPointsResults = await businessNetworkConnection.query('selectEarnPoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return earnPointsResults object
      return earnPointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  usePointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query UsePoints transactions on the network
      const usePointsResults = await businessNetworkConnection.query('selectUsePoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return usePointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  }

}
