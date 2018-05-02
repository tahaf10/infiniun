
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
 * @param {org.acme.ReferHospital} hospData
 * @transaction
 */

 function referHospital(hospData) {
    var factory = getFactory(); 
    var NS='org.acme';

    var sharedHospital = factory.newResource(NS,'SharedHospital',hospData.sharedHospital.sharedHospitalID);
    sharedHospital.hospitalTreatment = factory.newRelationship(NS,'HospitalTreatment',hospData.sharedHospital.hospitalTreatment);
    sharedHospital.hospital = factory.newRelationship(NS,'Hospital',hospData.sharedHospital.hospital);



    return getAssetRegistry('org.acme.SharedHospital')
        .then(function(sharedHospRegistry){
            sharedHospRegistry.addAll([sharedHospital]);
        })

 }

 /**
  * @param {org.acme.LabTest} test
  * @transaction
  */

  function labTest(test) {
      var factory = getFactory();
      var NS = 'org.acme';

      var sharedLabTest = factory.newResource(NS,'SharedLabTest',test.sharedLabTest.sharedLabTestID);
      sharedLabTest.treatmentLabTest = factory.newRelationship(NS,'TreatmentLabTest',test.sharedLabTest.treatmentLabTest);
      sharedLabTest.lab = factory.newRelationship(NS,'Lab',test.sharedLabTest.lab);

      
      
      return getAssetRegistry('org.acme.SharedLabTest')
        .then(function(sharedLabTestRegistry){
            sharedLabTestRegistry.addAll([sharedLabTest]);
        })
  }

/**
 * @param {org.acme.GetDrugs} drugs
 * @transaction
 */

 function getDrugs(drugs){
    var factory = getFactory(); 
    var NS='org.acme';

    var sharedDrugs = factory.newResource(NS,'SharedDrugs',drugs.sharedDrugs.sharedDrugID);

    sharedDrugs.treatmentDrugs = factory.newRelationship(NS,'TreatmentDrugs',drugs.sharedDrugs.treatmentDrugs);
    sharedDrugs.pharmacy = factory.newRelationship(NS,'Pharmacy',drugs.sharedDrugs.pharmacy);


    if(sharedDrugs.treatmentDrugs.treatmentDrugsID == sharedDrugs.pharmacy.pharmacyMedDB){

    }

    return getAssetRegistry('org.acme.SharedDrugs')
        .then(function(sharedDrugsRegistry){
            sharedDrugsRegistry.addAll([sharedDrugs]);
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
  
    consultationData.patient = factory.newRelationship(NS,'Patient',newConsultation.consultationData.patient);
    consultationData.doctor = factory.newRelationship(NS,'Doctor',newConsultation.consultationData.doctor);

    var treatmentData = factory.newResource(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);
    treatmentData.procedure = newConsultation.treatmentData.procedure;
    treatmentData.hospitalVisitNeeded = newConsultation.treatmentData.hospitalVisitNeeded;
    treatmentData.medRequired = newConsultation.treatmentData.medRequired;
    treatmentData.labTestRequired = newConsultation.treatmentData.labTestRequired;
    treatmentData.consultationData = factory.newRelationship(NS,'ConsultationData',consultationData.consultationID);

    if (treatmentData.hospitalVisitNeeded == true) {
        var hospitalTreatment = factory.newResource(NS,'HospitalTreatment',newConsultation.hospitalTreatment.hospTreatmentID);
        hospitalTreatment.stuff = newConsultation.hospitalTreatment.stuff;
        hospitalTreatment.treatmentData = factory.newRelationship(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);

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
        .then(function(){
            return getAssetRegistry('org.acme.HospitalTreatment')
        .then(function(hospTreatmentRegistry){
            hospTreatmentRegistry.addAll([hospitalTreatment]);
        })    
        })
        
    }

    if (treatmentData.medRequired==true && treatmentData.labTestRequired==true){
        var treatmentDrugs = factory.newResource(NS,'TreatmentDrugs',newConsultation.treatmentDrugs.treatmentDrugsID);
        treatmentDrugs.drugDetail = newConsultation.treatmentDrugs.drugDetail;
        treatmentDrugs.treatmentData = factory.newRelationship(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);

        var treatmentLabTest = factory.newResource(NS,'TreatmentLabTest',newConsultation.treatmentLabTest.treatmentLabTestID);
        treatmentLabTest.testDetail = newConsultation.treatmentLabTest.testDetail;
        treatmentLabTest.treatmentData = factory.newRelationship(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);

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
        .then(function(){
            return getAssetRegistry('org.acme.TreatmentDrugs')
        .then(function(treatmentDrugsRegistry){
            treatmentDrugsRegistry.addAll([treatmentDrugs]);
        })    
        })
        .then(function(){
            return getAssetRegistry('org.acme.TreatmentLabTest')
        .then(function(treatmentLabTestRegistry){
            treatmentLabTestRegistry.addAll([treatmentLabTest]);
        })
        })
    }

    if (treatmentData.medRequired == true){
        
        var treatmentDrugs = factory.newResource(NS,'TreatmentDrugs',newConsultation.treatmentDrugs.treatmentDrugsID);
        treatmentDrugs.drugDetail = newConsultation.treatmentDrugs.drugDetail;
        treatmentDrugs.treatmentData = factory.newRelationship(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);

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
        .then(function(){
            return getAssetRegistry('org.acme.TreatmentDrugs')
        .then(function(treatmentDrugsRegistry){
            treatmentDrugsRegistry.addAll([treatmentDrugs]);
        })    
        })

    }

    if (treatmentData.labTestRequired == true) {
        var treatmentLabTest = factory.newResource(NS,'TreatmentLabTest',newConsultation.treatmentLabTest.treatmentLabTestID);
        treatmentLabTest.testDetail = newConsultation.treatmentLabTest.testDetail;
        treatmentLabTest.treatmentData = factory.newRelationship(NS,'TreatmentData',newConsultation.treatmentData.treatmentID);

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
        .then(function(){
            return getAssetRegistry('org.acme.TreatmentLabTest')
        .then(function(treatmentLabTestRegistry){
            treatmentLabTestRegistry.addAll([treatmentLabTest]);
        })
        })
    }
   



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

