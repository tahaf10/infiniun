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
  */
  beginConsultation: async function (cardId, consultation, patientID, doctorID) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const startConsultation = factory.newTransaction(namespace, 'StartConsultation');
      startConsultation.consultation = consultation;
      startConsultation.doctor = factory.newRelationship(namespace, 'Doctor', doctorID);
      startConsultation.patient = factory.newRelationship(namespace, 'Patient', patientID);

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
  memberData: async function (cardId, accountNumber) {

    try {
      console.log("############################################");

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get member from the network
      const memberRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      const member = await memberRegistry.get(accountNumber);
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
