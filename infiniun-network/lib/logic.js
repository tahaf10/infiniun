
/**
 * New script file
/**
*@param {org.acme.addDoctor} newDoctor
*@transaction
 */


function addDoctor(newDoctor) {
  
  var factory = getFactory(); 
  var NS='org.acme';
  var doctor = factory.newResource(NS,'Doctor',newDoctor.doctor.doctorID);
  doctor.contact = newDoctor.doctor.contact;
  doctor.doctorSchedule = newDoctor.doctor.doctorSchedule;

  
  return getParticipantRegistry('org.acme.Doctor')
      .then(function(doctorRegistry){
        doctorRegistry.addAll([doctor]);
  })
}

/** 
@param {org.acme.addPatient} newPatient
@transaction
*/

function addPatient (newPatient) {

    var factory = getFactory(); 
    var NS='org.acme';
    var patient = factory.newResource(NS,'Patient',newPatient.patient.patientID);
    patient.contact = newPatient.patient.contact;

    return getParticipantRegistry('org.acme.Patient')
      .then(function(patientRegistry){
          patientRegistry.addAll([patient]);
      })
}

/**
*@param {org.acme.addHospital} newHospital
*@transaction
*/

function addHospital(newHospital) {
  
    var factory = getFactory(); 
    var NS='org.acme';
    var hospital = factory.newResource(NS,'Hospital',newHospital.hospital.hospitalID);
    hospital.contact = newHospital.hospital.contact;
  
    return getParticipantRegistry('org.acme.Hospital')
      .then(function(hospitalRegistry){
        hospitalRegistry.addAll([hospital]);
  })
}

/**
*@param {org.acme.addLab} newLab
*@transaction
*/

function addLab(newLab) {
  
    var factory = getFactory(); 
    var NS='org.acme';
    var lab = factory.newResource(NS,'Lab',newLab.lab.labID);
    lab.contact = newLab.lab.contact;
  
  return getParticipantRegistry('org.acme.Lab')
      .then(function(labRegistry){
        labRegistry.addAll([lab]);
  })
}

/**
*@param {org.acme.addPharmacy} newPharmacy
*@transaction
*/

function addPharmacy(newPharmacy) {
  
    var factory = getFactory(); 
  var NS='org.acme';
  var pharmacy = factory.newResource(NS,'Pharmacy',newPharmacy.pharmacy.pharmacyID);
  pharmacy.contact = newPharmacy.pharmacy.contact;

  
  return getParticipantRegistry('org.acme.Doctor')
      .then(function(doctorRegistry){
        doctorRegistry.addAll([doctor]);
  })
}

/**
 * @param {org.acme.Treatment} newTreatment
 * @transaction
 */

function treatment (newTreatment){
    var factory = getFactory();
    var NS = 'org.acme'

    var treatmentData = factory.newResource(NS,'TreatmentData',newTreatment.treatmentData.treatmentID);
    treatmentData.procedure = newTreatment.treatmentData.procedure;

    return getAssetRegistry('org.acme.TreatmentData')
        .then(function(treatmentDataRegistry){
            treatmentDataRegistry.addAll([treatmentData]);
    })
}

/**
* @param {org.acme.Consultation} newConsultation
* @transaction
*/

function consultation (newConsultation){
    var factory = getFactory(); 
    var NS='org.acme';
  
    var consultationData = factory.newResource(NS,'ConsultationData',newConsultation.consultationData.consultationID);
    consultationData.illnessDescription= newConsultation.consultationData.illnessDescription;
  	consultationData.treatmentRequired = newConsultation.consultationData.treatmentRequired;
  
    consultationData.patient = factory.newRelationship(NS,'Patient',newConsultation.consultationData.patient);
    consultationData.doctor = factory.newRelationship(NS,'Doctor',newConsultation.consultationData.doctor);

    var treatmentData = factory.newResource(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);
    treatmentData.procedure = newConsultation.treatmentData.procedure;
    treatmentData.consultationData = factory.newRelationship(NS,'ConsultationData',consultationData.consultationID);

    
   
    
    return getAssetRegistry('org.acme.ConsultationData')
        .then(function(consultationDataRegistry){
            consultationDataRegistry.addAll([consultationData]);
        })

    
    
        .then(function(){
            return getAssetRegistry('org.acme.TreatmentData')
        .then(function(treatmentDataRegistry){
            treatmentDataRegistry.addAll([treatmentData]);
        })
        })
        
}

