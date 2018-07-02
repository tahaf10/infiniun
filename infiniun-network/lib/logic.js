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
    doctor.doctorName = newDoctor.doctor.doctorName;
    doctor.description = newDoctor.doctor.description;
    //doctor.doctorSchedule = newDoctor.doctor.doctorSchedule;
  
    
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
      patient.family=factory.newRelationship(NS,'Family',newPatient.patient.family.familyID);
      patient.relationship = newPatient.patient.relationship;
  
      return getParticipantRegistry('org.acme.Patient')
        .then(function(patientRegistry){
            patientRegistry.addAll([patient]);
        })
  }
  

  
  /**
  *@param {org.acme.addFamily} newFamily
  *@transaction
  */
  
  function addFamily(newFamily){
      var factory = getFactory();
      var NS='org.acme';
  
      var family=factory.newResource(NS,'Family',newFamily.family.familyID);
      family.contact = newFamily.family.contact;
      family.name = newFamily.family.name;
  
      return getParticipantRegistry('org.acme.Family')
      .then(function(consultationDataRegistry){
          consultationDataRegistry.addAll([family]);
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

        return getAssetRegistry('org.acme.SharedLabTest')
          .then(function(sharedLabTestRegistry){
              sharedLabTestRegistry.addAll([test.sharedLabTest]);
          })
    }
  
  /**
   * @param {org.acme.ShareDrugswithPharmacy} drugs
   * @transaction
   */
  
   function ShareDrugswithPharmacy(drugs){
  
      return getAssetRegistry('org.acme.SharedDrugs')
          .then(function(sharedDrugsRegistry){
              sharedDrugsRegistry.addAll([drugs.sharedDrugs]);
            
            })
      
   }

   
  

/**
* @param {org.acme.GetAvailableDoctors} sc
* @transaction
 */
  
function getAvailableDoctors(sc) {
    
    return query('availableDoctors', {"hour" : sc.availability.hour , "day" : sc.availability.day})
    .then(function(results){
        var availablDocs = [];

        for (var n = 0; n < results.length; n++) {
            var schedule_asset = results[n];
            availableDocs[n] = schedule_asset.doctor.getIdentifier();
        }

        return availableDocs;
    })

}

/**
 * Sample transaction processor function.
 * @param {org.acme.Scheduler} sc The sample transaction instance.
 * @transaction
 */
function scheduler(sc) {  // eslint-disable-line no-unused-vars
    // Get the asset registry for the asset.
  
  return getAssetRegistry('org.acme.Schedule')
    .then(function(scheduleRegistry){
  
            scheduleRegistry.addAll([sc.schedule]);
    })
  
}


    /**
    * @param {org.acme.StartConsultation} newConsultation
    * @transaction
    */
  
   function startConsultation(newConsultation) {
    var factory = getFactory(); 
    var NS='org.acme';
  
    var consultation = factory.newResource(NS,'Consultation',newConsultation.consultation.consultationID);
    
    consultation.patient = factory.newRelationship(NS,'Patient',newConsultation.consultation.patient.patientID);
    consultation.doctor = factory.newRelationship(NS,'Doctor',newConsultation.consultation.doctor.doctorID);



    return getAssetRegistry('org.acme.Consultation')
    .then(function(consultationDataRegistry){
        consultationDataRegistry.addAll([consultation]);
    })

}


  /**
  * @param {org.acme.EndConsultation} newConsultation
  * @transaction
  */
  
  function endConsultation (newConsultation){
      var factory = getFactory(); 
      var NS='org.acme';
    

      var treatment = factory.newResource(NS,'Treatment',newConsultation.treatment.treatmentID);
      treatment.procedure = newConsultation.treatment.procedure;
      treatment.hospitalVisitNeeded = newConsultation.treatment.hospitalVisitNeeded;
      treatment.medRequired = newConsultation.treatment.medRequired;
      treatment.labTestRequired = newConsultation.treatment.labTestRequired;
      treatment.consultation = factory.newRelationship(NS,'Consultation',newConsultation.consultation.consultationID);
  
      var event1 = getFactory().newEvent(NS,'ConsultationUpdated');
      event1.consultation = newConsultation.consultation;

      var event2 = getFactory().newEvent(NS,'TreatmentUpdated');
      event2.treatment = newConsultation.treatment;

      if (treatment.hospitalVisitNeeded == true) {
          var hospitalTreatment = factory.newResource(NS,'HospitalTreatment',newConsultation.hospitalTreatment.hospTreatmentID);
          hospitalTreatment.stuff = newConsultation.hospitalTreatment.stuff;
          hospitalTreatment.treatment = factory.newRelationship(NS,'Treatment',newConsultation.treatment.treatmentID);
  
        return getAssetRegistry('org.acme.Consultation')
            .then(function(consultationDataRegistry){
                newConsultation.consultation.illnessDescription = newConsultation.consultationDetails.illnessDescription;
                newConsultation.consultation.message = newConsultation.consultationDetails.message;
                newConsultation.consultation.consultationCompleted = true;
                consultationDataRegistry.update(newConsultation.consultation);
                emit(event1);

            })
            .then(function(){

            
              return getAssetRegistry('org.acme.Treatment')
          .then(function(treatmentDataRegistry){
              treatmentDataRegistry.addAll([treatment]);
              emit(event2);
          })
          })
          .then(function(){
              return getAssetRegistry('org.acme.HospitalTreatment')
          .then(function(hospTreatmentRegistry){
              hospTreatmentRegistry.addAll([hospitalTreatment]);
            
          })
          })

          
      }
  
      if (treatment.medRequired==true && treatment.labTestRequired==true){
          var treatmentDrugs = factory.newResource(NS,'TreatmentDrugs',newConsultation.treatmentDrugs.treatmentDrugsID);
          treatmentDrugs.drugDetail = newConsultation.treatmentDrugs.drugDetail;
          treatmentDrugs.treatment = factory.newRelationship(NS,'Treatment',newConsultation.treatment.treatmentID);
  
          var treatmentLabTest = factory.newResource(NS,'TreatmentLabTest',newConsultation.treatmentLabTest.treatmentLabTestID);
          treatmentLabTest.testDetail = newConsultation.treatmentLabTest.testDetail;
          treatmentLabTest.treatment = factory.newRelationship(NS,'Treatment',newConsultation.treatment.treatmentID);
  

          return getAssetRegistry('org.acme.Consultation')
          .then(function(consultationDataRegistry){
              newConsultation.consultation.illnessDescription = newConsultation.consultationDetails.illnessDescription;
              newConsultation.consultation.message = newConsultation.consultationDetails.message;
              newConsultation.consultation.consultationCompletedd = true;
              consultationDataRegistry.update(newConsultation.consultation);
              emit(event1);
          })
          .then(function(){

          
        return getAssetRegistry('org.acme.Treatment')
          .then(function(treatmentDataRegistry){
              treatmentDataRegistry.addAll([treatment]);
              emit(event2);
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
  
      if (treatment.medRequired == true){
          
         /* var treatmentDrugs = factory.newResource(NS,'TreatmentDrugs',newConsultation.treatmentDrugs.treatmentDrugsID);
          treatmentDrugs.drugDetail = newConsultation.treatmentDrugs.drugDetail;
          treatmentDrugs.treatment = factory.newRelationship(NS,'Treatment',newConsultation.treatment.treatmentID);
        */
          return getAssetRegistry('org.acme.Consultation')
          .then(function(consultationDataRegistry){
              newConsultation.consultation.illnessDescription = newConsultation.consultationDetails.illnessDescription;
              newConsultation.consultation.message = newConsultation.consultationDetails.message;
              newConsultation.consultation.consultationCompletedd = true;
              consultationDataRegistry.update(newConsultation.consultation);
              emit(event1);

          })
          .then(function(){

          
            return getAssetRegistry('org.acme.Treatment')
          .then(function(treatmentDataRegistry){
              treatmentDataRegistry.addAll([treatment]);
              emit (event2);
          })
        })
          .then(function(){
              return getAssetRegistry('org.acme.TreatmentDrugs')
          .then(function(treatmentDrugsRegistry){
              treatmentDrugsRegistry.addAll([newConsultation.treatmentDrugs]);
          })    
          })
  
      }
  
      if (treatment.labTestRequired == true) {
          var treatmentLabTest = factory.newResource(NS,'TreatmentLabTest',newConsultation.treatmentLabTest.treatmentLabTestID);
          treatmentLabTest.testDetail = newConsultation.treatmentLabTest.testDetail;
          treatmentLabTest.treatment = factory.newRelationship(NS,'Treatment',newConsultation.treatment.treatmentID);
  

          return getAssetRegistry('org.acme.Consultation')
          .then(function(consultationDataRegistry){
              newConsultation.consultation.illnessDescription = newConsultation.consultationDetails.illnessDescription;
              newConsultation.consultation.message = newConsultation.consultationDetails.message;
              newConsultation.consultation.consultationCompletedd = true;
              consultationDataRegistry.update(newConsultation.consultation);
              emit(event1);

          })
          .then(function(){

          
        return getAssetRegistry('org.acme.Treatment')
          .then(function(treatmentDataRegistry){
              treatmentDataRegistry.addAll([treatment]);
              emit(event2);
          })
        })
          .then(function(){
              return getAssetRegistry('org.acme.TreatmentLabTest')
          .then(function(treatmentLabTestRegistry){
              treatmentLabTestRegistry.addAll([treatmentLabTest]);
          })
          })
      }
     
  
  
      return getAssetRegistry('org.acme.Consultation')
      .then(function(consultationDataRegistry){
          newConsultation.consultation.illnessDescription = newConsultation.consultationDetails.illnessDescription;
          newConsultation.consultation.message = newConsultation.consultationDetails.message;
          newConsultation.consultation.consultationCompleted = true;
          consultationDataRegistry.update(newConsultation.consultation);
          emit(event1);

      })
      .then(function(){

      

    return getAssetRegistry('org.acme.Treatment')
        .then(function(treatmentDataRegistry){
              treatmentDataRegistry.addAll([treatment]);
              emit(event2);
          })
        })
          
  }

  /**
    * @param {org.acme.PatientAllowAccess} tempConsultation
    * @transaction
    */
  
   function PatientAllowAccess(tempConsultation) {
    var factory = getFactory();
    var NS='org.acme';
    
    //var consult = factory.newRelationship(NS,'Consultation',tempConsultation.consultation.consultationID);

    tempConsultation.consultation.consultationAccess = tempConsultation.doctor.doctorID;


    return getAssetRegistry('org.acme.Consultation')
     .then(function(consultationDataRegistry){

     consultationDataRegistry.update(tempConsultation.consultation);
 })
}