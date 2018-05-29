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
  *@param {org.acme.addPatientRelative} newRelative
  *@transaction
  */
  
  function addPatientRelative(newRelative){
      var factory = getFactory();
      var NS='org.acme';
  
      var patientRelative=factory.newResource(NS,'PatientRelative',newRelative.patientRelative.patientRelativeID);
      patientRelative.patient=factory.newRelationship(NS,'Patient',newRelative.patientRelative.patient.patientID);
  
      return getParticipantRegistry('org.acme.PatientRelative')
      .then(function(consultationDataRegistry){
          consultationDataRegistry.addAll([patientRelative]);
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
  
      return getAssetRegistry('org.acme.SharedDrugs')
          .then(function(sharedDrugsRegistry){
              sharedDrugsRegistry.addAll([drugs.sharedDrugs]);
            
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
* @param {org.acme.INITSchedule} sc
* @transaction
 */
  
function initschedule(sc) {
    
    return getAssetRegistry('org.acme.Schedule')
    .then(function(scheduleRegistry){
        scheduleRegistry.addAll([sc.schedule]);
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
  
  for(var v=0;v<sc.availablTimes.length;v++){
    
  	if(sc.availablTimes[v].day=="monday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
         inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.monday);
      }
    }
    else if(sc.availablTimes[v].day=="tuesday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
          inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.tuesday);
      }
    }
    else if(sc.availablTimes[v].day=="wednesday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
                  inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.wednesday);

      }
    }
    else if(sc.availablTimes[v].day=="thursday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
         inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.thursday);

      }
    }
    else if(sc.availablTimes[v].day=="friday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
         inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.friday);

      }
    }
    else if(sc.availablTimes[v].day=="saturday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
          inserToSchedule(sc,sc.availablTimes[v].time[x], sc.schedule.availableDays.saturday);

      }
    }
    else if(sc.availablTimes[v].day=="sunday"){
      for(var x=0;x<sc.availablTimes[v].time.length;x++){
        inserToSchedule(sc,sc.availablTimes[v].time[x],sc.schedule.availableDays.sunday);
        
      }
    }
    }
    })
  }
    
  function inserToSchedule(sc,time,day){
    switch(time) {
          case "AM00":
             day.AM00.push(sc.docID);
             break;
        
          case "AM01":
              day.AM01.push(sc.docID);
              break;
          case "AM02":
              day.AM02.push(sc.docID);
              break;
          case "AM03":
             day.AM03.push(sc.docID);
              break;
          case "AM04":
              day.AM04.push(sc.docID);
              break;

          case "AM05":
              day.AM05.push(sc.docID);
              break;
          case "AM06":
              day.AM06.push(sc.docID);
              break;
          case "AM07":
              day.AM07.push(sc.docID);
              break;
          case "AM08":
              day.AM08.push(sc.docID);
              break;
          case "AM09":
               day.AM09.push(sc.docID);
              break;
          case "AM10":
              day.AM10.push(sc.docID);
              break;
          case "AM11":
              day.AM11.push(sc.docID);
              break;
          case "PM00":
               day.PM00.push(sc.docID);
              break;
          case "PM01":
               day.PM01.push(sc.docID);
              break;
          case "PM02":
               day.PM02.push(sc.docID);
              break;
          case "PM03":
               day.PM03.push(sc.docID);
              break;
        case "PM04":
               day.PM04.push(sc.docID);
              break;
        case "PM05":
               day.PM05.push(sc.docID);
              break;
        case "PM06":
               day.PM06.push(sc.docID);
              break;
        case "PM07":
               day.PM07.push(sc.docID);
              break;
        case "PM08":
               day.PM08.push(sc.docID);
              break;
        case "PM09":
               day.PM09.push(sc.docID);
              break;
        case "PM10":
               day.PM10.push(sc.docID);
              break;
        case "PM11":
               day.PM11.push(sc.docID);
              break;
        
           default:
        }
   
  
  return getAssetRegistry('org.acme.Schedule')
    .then(function(scheduleRegistry){
     scheduleRegistry.update(sc.schedule);
     
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