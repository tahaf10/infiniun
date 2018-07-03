const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declare namespace
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
    * @param {String} patientID as identifier on network
    * @param {String} contact 
    * @param {String} name

    */
   registerMember: async function (cardId, patientID, contact, name) {
      try {
  
        //connect as admin
        businessNetworkConnection = new BusinessNetworkConnection();
        await businessNetworkConnection.connect('admin@infiniun-network');
  
        //get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
  
        //create member participant
        const patient = factory.newResource(namespace, 'Patient', patientID);
        patient.contact = contact;
        patient.name = name;

        //add member participant
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
        await participantRegistry.add(patient);
  
        //issue identity
        const identity = await businessNetworkConnection.issueIdentity(namespace + '.Member#' + accountNumber, cardId);
  
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
  
    }
}

