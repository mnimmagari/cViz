
'use strict';

var visitsApp = angular.module('visits');

//Autocompleate - Factory
// visitsApp.factory('AutoCompleteService', ["$http", function ($http) {
//   return {
//     search: function (term) {
//       //var client = {name: new RegExp(term, 'i')};
//       var maxRecs = 10;
//       var fields = ('name _id cscPersonnel');
//       var sort = ({name:'ascending'});
//       return $http({
//         method: 'GET',
//         url: '/api/v1/secure/clients/find',
//         params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
//       }).then(function (response) {
//         return response.data;
//       });
//     }
//   };
// }]);
//Autocompleate - Factory
visitsApp.factory('FeedbackService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id type');
      var sort = ({title:'ascending'});
      var type = "visit";
      return $http({
        method: 'GET',
        url: '/api/v1/secure/feedbackDefs/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort, type: type }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);
//Autocompleate - Factory
visitsApp.factory('SessionService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id type');
      var sort = ({title:'ascending'});
      var type ="session";
      return $http({
        method: 'GET',
        url: '/api/v1/secure/feedbackDefs/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort, type: type }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);
//Autocompleate - Factory
visitsApp.factory('KeynoteService', ["$http", function ($http) {
  return {
    search: function (term) {
      //var client = {title: new RegExp(term, 'i')};
      var maxRecs = 10;
      var fields = ('title _id');
      var sort = ({title:'ascending'});
      return $http({
        method: 'GET',
        url: '/api/v1/secure/keynotes/find',
        params: { query: term, fields: fields, maxRecs: maxRecs, sort: sort }
      }).then(function (response) {
        return response.data;
      });
    }
  };
}]);

visitsApp.controller('visitsControllerMain', ['$scope', '$http', '$route', '$filter', '$routeParams','$rootScope', '$location', 'growl', '$window','$mdDialog', '$mdMedia', '$timeout','Upload', 'FeedbackService', 'KeynoteService',
  function($scope, $http, $route,$filter, $routeParams, $rootScope, $location, growl, $window ,$mdDialog , $mdMedia ,$timeout, Upload, FeedbackService, SessionService, KeynoteService) {

    var id = $routeParams.id;

  // AUtomatically swap between the edit and new mode to reuse the same frontend form
  $scope.mode=(id==null? 'add': 'edit');
  $scope.hideFilter = true;
  $scope.checked = false;
  $scope.schedules=[];
  $scope.visitors=[];
  $scope.keynotes=[];
  $scope.small= "small";
  $scope.large= "LARGE";
  $scope.medium= "medium";
  $scope.clientnameonly= "clientnameonly";
  $scope.nameonly= "nameonly";
  $scope.visitid = id;
  $scope.showAvatar = false;
  $scope.arraydata = [];
  $scope.dataOne=[];
  $scope.tab=false;
  $scope.anchor='';
  $scope.secondaryVmanager='';
  $scope.clientId='';
  
  $scope.visitGrid=false;
  $scope.navVisit ='';
  $scope.agendaEdit= false;
  $scope.showKey=false;
  $scope.subdis= true;
  $scope.stdate= true;

  $scope.agendaTab=true;
  $scope.visitorsTab=false;
  $scope.finalizeTab=false;
  $scope.notifyTab=false;
  $scope.visitGrid= false;
  $scope.designation= "designation";
  $scope.visvalid= true;
  $scope.secTrue=false;
  $scope.privalid=true;
  $scope.array = [];
  $scope.arrayiwo = [];
  $scope.closeSave=0;
  // $scope.sessiondbId = "";

  $scope.cscPersonnel={};

  $scope.salesExecId = "";
  $scope.salesExecEmail = "";
  $scope.salesExecUser =  "";

  $scope.accountGMId = "";
  $scope.accountGMEmail = "";
  $scope.accountGMUser =  "";

  $scope.industryExecId = "";
  $scope.industryExecEmail = "";
  $scope.industryExecUser =  "";

  $scope.globalDeliveryId = "";
  $scope.globalDeliveryEmail = "";
  $scope.globalDeliveryUser =  "";

  $scope.creId = "";
  $scope.creEmail = "";
  $scope.creUser =  "";

  $scope.nextTab = function(data) {
    $location.path('/visits/'+data+'/edit');
    $route.reload();
  };

  var user= $rootScope.user._id; 
  var group = $rootScope.user.memberOf;

  if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
    $scope.visitGrid= true;
  }

  if ($rootScope.user.groups.indexOf("admin") > -1) {
    $scope.adminInitVman= true;
  }

  //visit manager group- HTTP get for drop-down
  $http.get('/api/v1/secure/admin/groups/vManager/users').success(function(response) {
    var i= 0;
    i= response.length;
    response[i++]= {name:{first:"none"},_id:null};
    $scope.data=response;
  });

  //Location - Http get for drop-down
  $http.get('/api/v1/secure/lov/locations').success(function(response) {
    $scope.location=response.values;
  });

  //offerings - Http get for drop-down
  $http.get('/api/v1/secure/lov/offerings').success(function(response) {
    $scope.offerings=response.values;
  });

  //Influence - Http get for drop-down
  $http.get('/api/v1/secure/lov/influence').success(function(response) {
    $scope.influence=response.values;
  });

  //vertical - Http get for drop-down
  $http.get('/api/v1/secure/lov/vertical').success(function(response) {
    $scope.vertical=response.values;
  });

  //regions - Http get for drop-down
  $http.get('/api/v1/secure/lov/regions').success(function(response) {
    $scope.regions=response.values;
  });


  // console.log($scope.mode);
  if($scope.mode == 'edit')
  {
    $http.get('/api/v1/secure/visitSchedules/visit/'+$routeParams.id).success(function(response) {
      $scope.sessiondbId = response;
    });
  }

  $scope.visitorId = "";
  $scope.visitor = "";
  $scope.visitorUser =  "";

  $scope.agmId = "";
  $scope.agmEmail = "";
  $scope.agmUser =  "";

  var refresh = function() {

    $scope.setTimeline = function(time){
      $scope.timeline = time;
      // console.log("setting timeline to " + $scope.timeline )
      $scope.visitBatch = $scope.allVisits[$scope.timeline];
    }
    
    $http.get('/api/v1/secure/visits/all/my').success(function(response) {
      $scope.allVisits = response;
      // console.log("after delete :"+$scope.allVisits)
      var allVisits = [];
      // var key ="today";
      Object.keys($scope.allVisits).forEach(function (key) {

       var value = $scope.allVisits[key]
       if(key === "today" || key === "next-week" || key === "further" || key === "next-on"){
        allVisits.push.apply(allVisits, value.visits);
        // console.log(value.visits.length, allVisits.length);
      }
    })

      $scope.allVisits["all"] = {
        "start" : "begin",
        "end": "end",
        "visits": allVisits
      };

      
      if($scope.timeline=="" || $scope.timeline===undefined){
        $scope.timeline = "all";
        // console.log("no timeline. Set to " + $scope.timeline);
        $scope.visitBatch = $scope.allVisits[$scope.timeline];
      }
      else{
       $scope.timeline = "all";
       // console.log("no timeline. Set to " + $scope.timeline);
       $scope.visitBatch = $scope.allVisits[$scope.timeline];
     }
     // console.log(JSON.stringify($scope.visitBatch,null,2));

     $scope.visits = "";
     $scope.schedules=[];
     $scope.visitors=[];
     $scope.keynotes=[];



     switch($scope.mode)    {
      case "add":
      $scope.visits = "";
      break;

      case "edit":
      $scope.visits = $http.get('/api/v1/secure/visits/' + id).success(function(response){
        console.log(response);
        for(var files=0;files<response.visitAttachment.length;files++)
        {
          $scope.array.push(response.visitAttachment[files])
        }

        $scope.arrayiwo.push(response.wbscodeAttachment);
        var visits = response;
        if (visits.anchor!=undefined){
          $scope.anchor = visits.anchor._id;
          $scope.secTrue=true;
        }
        if(visits.secondaryVmanager!=undefined) {
          $scope.secondaryVmanager = visits.secondaryVmanager._id;
          $scope.yes();
          $scope.addSec=false;
        }else {
          $scope.secTrue=false;
          $scope.addSecMan();
        }

        switch(visits.status){
          case "confirm": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.agendaSave=1;
          break;

          case "tentative": 
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.agendaSave=1;
          break;

          case "wip":
          if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
            $scope.finalizeTab= true;
            $scope.agendaTab=true;
            $scope.visitorsTab=true;
            $scope.notifyTab=false;
            $scope.agendaSave=0;
            $scope.visitorSave=1;
          }
          else{
           $scope.agendaTab= true;
           $scope.visitorsTab= true;
           $scope.finalizeTab= false;
           $scope.notifyTab= false;
           $scope.agendaSave=1;

         }
         break;

         case "finalize": 
         if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
          $scope.finalizeTab= true;
          $scope.agendaTab=true;
          $scope.visitorsTab=true;
          $scope.notifyTab=true;
          $scope.agendaSave=0;
          $scope.visitorSave=0;
          $scope.finalizeSave=1;
        }
        else{
         $scope.agendaTab= true;
         $scope.visitorsTab= true;
         $scope.finalizeTab= false;
         $scope.notifyTab= false;
         $scope.agendaSave=1;

       }
       break;

       case "complete": 
       if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
        $scope.closeTab=true;
        $scope.finalizeTab= true;
        $scope.agendaTab=true;
        $scope.visitorsTab=true;
        $scope.notifyTab=true;
        $scope.agendaSave=0;
        $scope.visitorSave=0;
        $scope.finalizeSave=0;
        $scope.closeSave=1;
      }

      break;

      case "close": 
      if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
        $scope.closeTab=true;
        $scope.finalizeTab= true;
        $scope.agendaTab=true;
        $scope.visitorsTab=true;
        $scope.notifyTab=true;
        $scope.agendaSave=0;
        $scope.visitorSave=0;
        $scope.finalizeSave=0;
        $scope.closeSave=1;
      }

      break;

    };
    console.log(visits.client);
    $scope.clientIdData=visits.client._id;
    $scope.parentSelected= visits.client.name;
    $scope.childSelected= visits.client.subName;
    $scope.industrySelected= visits.client.industry;
    $scope.regionsSelected= visits.client.regions;

    for(var files=0;files<response.visitGallery.length;files++)
    {
      $scope.arrayClose.push(response.visitGallery[files])
    }

    $scope.visitors = visits.visitors;
    if ($scope.visitors.length == 0)
    {
      $scope.visvalid= true;

    }
    else{
      $scope.visvalid= false;

    }
        $scope.schedules = visits.schedule;//List of schedules
        if ($scope.schedules.length == 0)
        {
          $scope.subdis= true;

        }
        else{
          $scope.subdis= false;

        }
        $scope.status= visits.status;
        if (visits.billable == "billable") {
          $scope.checked=true;
        };
          $scope.visits = visits;//Whole form object

          $scope.arraydata=response.invitees;
          if (response.agm!=undefined) {
            $scope.agmUser = response.agm;
            $scope.agmEmail = response.agm.email;
            $scope.agmId = response.agm._id;
          }
          $scope.clientName= response.client.name;//auto fill with reff client db

          if (response.feedbackTmpl!=undefined) {
            $scope.feedback= response.feedbackTmpl.title;//auto fill with reff feedback db
          }

          if(response.sessionTmpl!=undefined) {
          $scope.session= response.sessionTmpl.title;//auto fill with reff feedback db
        }

        for (var i =0; i<visits.keynote.length;i++) {
          $scope.keynotes.push({
            note: visits.keynote[i].note._id,
            noteName: visits.keynote[i].note.title, 
            context: visits.keynote[i].context,
            order: visits.keynote[i].order
          });
        };
        if (response.cscPersonnel!=undefined) {

          $scope.salesExecUser = response.cscPersonnel.salesExec;
          $scope.salesExecEmail = response.cscPersonnel.salesExec.email;
          $scope.salesExecId = response.cscPersonnel.salesExec._id;

          $scope.accountGMUser = response.cscPersonnel.accountGM;
          $scope.accountGMEmail = response.cscPersonnel.accountGM.email;
          $scope.accountGMId = response.cscPersonnel.accountGM._id;

          $scope.industryExecUser = response.cscPersonnel.industryExec;
          $scope.industryExecEmail = response.cscPersonnel.industryExec.email;
          $scope.industryExecId = response.cscPersonnel.industryExec._id;

          $scope.globalDeliveryUser = response.cscPersonnel.globalDelivery;
          $scope.globalDeliveryEmail = response.cscPersonnel.globalDelivery.email;
          $scope.globalDeliveryId = response.cscPersonnel.globalDelivery._id;

          $scope.creUser = response.cscPersonnel.cre;
          $scope.creEmail = response.cscPersonnel.cre.email;
          $scope.creId = response.cscPersonnel.cre._id;
        }

            // Reformat date fields to avoid type compability issues with <input type=date on ng-model
            $scope.visits.createdOn = new Date($scope.visits.createdOn);
          });
break;

      } // Switch scope.mode ends
    }); // Get visit call back ends
  }; // Refresh method ends

  refresh();

  $scope.save = function(){
    // Set agm based on the user picker value
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.status =$scope.status;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.visitAttachment = $scope.array;
    $scope.visits.wbscodeAttachment = $scope.arrayiwo;
    $scope.visits.visitGallery = $scope.arrayClose;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.check= true;
    if ($scope.checked == false){
      $scope.unbillable= "non-billable";
      if($scope.visits.wbsCode!=null){$scope.visits.wbsCode= null;}
      $scope.visits.billable=$scope.unbillable;
      $scope.visits.wbscodeAttachment ="";
      }//check code
      else{
        $scope.billable= "billable";
        if($scope.visits.chargeCode!=null){$scope.visits.chargeCode= null;}
        $scope.visits.billable=$scope.billable;
        $scope.visits.wbscodeAttachment = $scope.arrayiwo.toString();
        }//WBS code

        $scope.visits.feedbackTmpl = $scope.feedbackId;
        $scope.visits.sessionTmpl = $scope.sessionId;
        console.log($scope.visits);
        // while edit vll get id den v need to search by id too...
        $http.get('/api/v1/secure/clients/find?query=' + $scope.visits.clientName+"&subQuery="+$scope.visits.subName+"&industry="+$scope.visits.industry+"&regions="+$scope.visits.regions+"&id=").success(function(response) {
          console.log(response);
          if (response.id!="null") {
        // if ($scope.clientId!= null) {
          $scope.visits.client = response.id;

          switch($scope.mode){
            case "add":
            $scope.create();
            break;

            case "edit":
            $scope.update();
            $route.reload();
            break;

          }
        }
        else if($scope.clientIdData!=undefined && response.id!="null" ){
          console.log("you can proceed now");
          $scope.visits.clientIdData=$scope.clientIdData;
          $scope.update(); 
        }
        else
        {//get al client data
          console.log($scope.visits);
          
          var inDataClient ={};
          // inDataClient.name =$scope.visits.client;
          // inDataClient.subName =$scope.visits.subName;
          // inDataClient.industry =$scope.visits.industry;
          //  inDataClient.regions =$scope.visits.regions;
          if ($scope.visits.clientName!=undefined) 
            {inDataClient.name =$scope.visits.clientName;}
          else inDataClient.name = $scope.parentSelected;

          if ($scope.visits.subName!=undefined) 
            {inDataClient.subName =$scope.visits.subName;}
          else inDataClient.subName = $scope.childSelected;
          
          if ($scope.visits.industry!=undefined) 
            {inDataClient.industry =$scope.visits.industry;}
          else inDataClient.industry = $scope.industrySelected;
          
          if ($scope.visits.regions!=undefined) 
            { inDataClient.regions =$scope.visits.regions;}
          else inDataClient.regions = $scope.regionsSelected;

          if ($rootScope.user.groups.indexOf("admin") > -1 ) {
            inDataClient.status="final";
          }else inDataClient.status="draft";

          // if ($scope.avatar!=undefined) {
          //   inData.logo=avatar;}
            console.log(inDataClient)

            $http.post('/api/v1/secure/clients', inDataClient).success(function(response) {
             $scope.visits.client = response._id;
             switch($scope.mode){
              case "add":
              $scope.create();
              break;

              case "edit":
              $scope.update();
              $route.reload();
              break;

            }
          })
          }
        })
        } // End of save method

        $scope.create = function() {

          var inData       = $scope.visits;
          inData.schedule = $scope.schedules;
          inData.keynote = $scope.keynotes;
          inData.visitors = $scope.visitors;
          inData.createBy =  $rootScope.user._id;
          inData.cscPersonnel =$scope.cscPersonnel;
          console.log($scope.cscPersonnel);
          console.log(inData.client);
          var client ={};
          client.cscPersonnel =$scope.cscPersonnel;
          $http.put('/api/v1/secure/clients/id/' + inData.client, client).success(function(response) {
            // console.log("added");
          })
          $http.post('/api/v1/secure/visits', inData).success(function(response) {

            $http.get('/api/v1/secure/email/'+ response._id+'/newvisit').success(function(response) {
             console.log(response);
           })
            $scope.nextTab(response._id);

            growl.info(parse("visit [%s]<br/>Added successfully", inData.title));
          })
          .error(function(data, status){
            growl.error("Error adding visit");
    }); // Http post visit ends
          
  }; //End of create method

  $scope.delete = function(visits) {
    var title = visits.title;
    $http.delete('/api/v1/secure/visits/' + visits._id).success(function(response) {
      refresh();
      growl.info(parse("visits [%s]<br/>Deleted successfully", title));
    })
    .error(function(data, status){
      growl.error("Error deleting visit");
    }); // Http put delete ends
  }; // Delete method ends

  $scope.update = function() {
    console.log($scope.visits);
    console.log($scope.visits.clientIdData)
    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;
    inData.cscPersonnel =$scope.cscPersonnel;
    var client ={};
    client.cscPersonnel =$scope.cscPersonnel;

    if ($scope.visits.clientName!=undefined) 
      {client.name =$scope.visits.clientName;}
    else client.name = $scope.parentSelected;

    if ($scope.visits.subName!=undefined) 
      {client.subName =$scope.visits.subName;}
    else client.subName = $scope.childSelected;

    if ($scope.visits.industry!=undefined) 
      {client.industry =$scope.visits.industry;}
    else client.industry = $scope.industrySelected;

    if ($scope.visits.regions!=undefined) 
      { client.regions =$scope.visits.regions;}
    else client.regions = $scope.regionsSelected;

    if ($rootScope.user.groups.indexOf("admin") > -1 ) {
      client.status="final";
    }else client.status="draft";

    // if ($scope.avatar!=undefined) {
    //   inData.logo=avatar;}

      console.log(client);
      $http.put('/api/v1/secure/clients/id/' + inData.client, client).success(function(response) {
      })
      .error(function(data, status){
        growl.error("Error updating client");
    }); // http put keynoges ends

      $http.put('/api/v1/secure/visits/' + $scope.visits._id,  inData).success(function(response) {
       refresh();
       growl.info(parse("visit [%s]<br/>Edited successfully",  $scope.visits.title));

       if ($rootScope.user.groups.indexOf("vManager") > -1 || $rootScope.user.groups.indexOf("admin") > -1) {
        if($scope.agendaTab == true && $scope.agendaEdit == false) {
          if(($scope.status == "confirm" || $scope.status =="tentative") ||( $scope.visitorsTab == true && $scope.check == true && $scope.finall == true && $scope.status == "wip"))
          {
            $location.path("visits/list");
          }else
          $location.path("/visits/"+$scope.visits._id+"/edit"); 
        }
        else if($scope.finalizeTab == true && $scope.finall == true)
        {
          $location.path("visits/list");
        }
        else   $location.path("/visits/"+$scope.visits._id+"/edit"); 
      }

      else if($scope.agendaTab == true && $scope.agendaEdit == false) {
        if($scope.visitorsTab == true && $scope.check == true)
        {
          $location.path("visits/list");
        }else
        $location.path("/visits/"+$scope.visits._id+"/edit"); 
      }
    })
.error(function(data, status){
  growl.error("Error updating visit");
    }); // Http put visit ends
  }; // Update method ends

  $scope.cancel = function() {

    $scope.visits="";
    $location.path("visits/list");
   // window.history.back();
 }

 $scope.getUser = function(){
  $http.get('/api/v1/secure/admin/users/' + inData.agm).success(function(response) {
    var user = response;
    $scope.visits.agm = parse("%s %s, <%s>", user.name.first, user.name.last, user.email); });
}

// $scope.valppl=function(){

//   if($scope.salesExecId == undefined || $scope.salesExecId == null || $scope.salesExecId == ""){
//     $scope.people= true;
//     $scope.errsalExe ="Sales Exec undefined"
//     $timeout(function () { $scope.people =false;$scope.errsalExe=''; }, 25000);

//   }
//   else if($scope.accountGMId == undefined || $scope.accountGMId == null || $scope.accountGMId == ""){
//     $scope.people= true;
//     $scope.erragm ="Account GM undefined"
//     $timeout(function () { $scope.people =false; $scope.erragm=''; }, 25000);

//   }
//   else if($scope.industryExecId == undefined || $scope.industryExecId == null || $scope.industryExecId == ""){
//     $scope.people= true;
//     $scope.errsalExe ="Industry Exec undefined"
//     $timeout(function () { $scope.people =false;$scope.errsalExe=''; }, 25000);

//   }
//   else if($scope.globalDeliveryId == undefined || $scope.globalDeliveryId == null || $scope.globalDeliveryId == ""){
//     $scope.people= true;
//     $scope.errglo ="Global Delivery undefined"
//     $timeout(function () { $scope.people =false;$scope.globalDeliveryId=''; }, 25000);

//   }
//   else if($scope.creId == undefined || $scope.creId == null || $scope.creId == ""){
//     $scope.people= true;
//     $scope.errcre ="CRE undefined"
//     $timeout(function () { $scope.people =false;$scope.creId=''; }, 25000);

//   }
//   else if($scope.agmId == undefined || $scope.agmId == null || $scope.agmId == ""){
//     $scope.people= true;
//     $scope.errspon ="sponser undefined"
//     $timeout(function () { $scope.people =false;$scope.agmId=''; }, 25000);

//   }
//   else{ $scope.people= false;
//    $scope.save();}
//  }

   //add vmanager
   $scope.AddVmanager=function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;
    // $scope.dataOne=[];

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, $scope.visits).success(function(response) {
     growl.info(parse("Visit Manager Added successfully"));
     $scope.nextTab($scope.visits._id);
     $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/visitownerchange').success(function(response) {
      console.log(response);
      growl.info(parse("Email sent to visit managers successfully"));
    }) 
   })
  };

  $scope.showNotifie= function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status ="finalize";
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;

    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
      growl.info(parse("Planning stage compleated successfully"));
      $scope.nextTab($scope.visits._id);
    })

  }
  $scope.reachedEnd=function(){
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status ="close";
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.visits.visitGallery = $scope.arrayClose;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;

    var inData       = $scope.visits;
    inData.keynote = $scope.keynotes;

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
      growl.info(parse("Planning stage compleated successfully"));
      $location.path("visits/list"); 
      
    })
  }
  $scope.getvalidation= function(ev){

    $scope.visits.agm = $scope.agmId;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;


    var inData     = $scope.visits;
    inData.keynote = $scope.keynotes;
    
    $scope.errinData=[];
    $http.put('/api/v1/secure/visits/validation/finalize/'+ $scope.visits._id,inData).success(function(response) {
      console.log(response)
      if(response == undefined || response == 0 || response == null){
        $scope.showNotifie($scope.visits.status);
      }
      else{
        for (var i =0; i<response.length; i++) {
          $scope.errinData.push(response[i]);
        };
        $mdDialog.show({
          templateUrl: '/public/mods/visits/valFinal.html',
          scope: $scope.$new(),
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true

        })
      }

    })
  }
  $scope.sendAnchor= function(anchor,status){
    $scope.anchorman = anchor;
    $scope.privalid=false;
    $scope.dataOne=[];


    if ($scope.notifyTab== true) {
      $scope.status = status;
    }
    else{
      $scope.status = status;
      $scope.status="wip";
    }
    $scope.yes();
  }
  $scope.sendSecVman= function(secondaryVmanager,status){
    if ($scope.secTrue==false) {
      $scope.vman = null;
    }else
    $scope.vman = secondaryVmanager;
    if ($scope.notifyTab== true) {
      $scope.status = status;
    }
    else{
      $scope.status = status;
      $scope.status="wip";
    }
  }

  $scope.yes=function(anchor){
    $scope.addSec=true;
    $scope.dataOne=[];
    $http.get('/api/v1/secure/admin/groups/vManager/users').success(function(response) {
      for (var i =0;i< response.length; i++) {
        if ($scope.anchorman== response[i]._id || anchor== response[i]._id || $scope.anchor == response[i]._id) {
        }else{
         $scope.dataOne.push({
          response: response[i]
        });
       }
     };
   });
  }
  $scope.optionsec=function(){
    $scope.secTrue=true;
    $scope.addSec=false;
  }
  $scope.removeVman=function(){
    $scope.secTrue=false;
    $scope.sendSecVman();
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.status =$scope.status;
    $scope.visits.agm = $scope.agmId;
    $scope.visits.anchor = $scope.anchorman;
    $scope.visits.secondaryVmanager= $scope.vman;
    $scope.visits.createBy= $rootScope.user._id;
    $scope.visits.client = $scope.clientIdData;
    $scope.visits.invitees = $scope.arraydata;
    $scope.visits.feedbackTmpl = $scope.feedbackId;
    $scope.visits.sessionTmpl = $scope.sessionId;
    $scope.cscPersonnel.salesExec = $scope.salesExecId;
    $scope.cscPersonnel.accountGM= $scope.accountGMId;
    $scope.cscPersonnel.industryExec = $scope.industryExecId;
    $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
    $scope.cscPersonnel.cre= $scope.creId;
    $scope.visits.cscPersonnel=$scope.cscPersonnel;

    // $scope.dataOne=[];

    $http.put('/api/v1/secure/visits/' + $scope.visits._id, $scope.visits).success(function(response) {
    });
  }
  $scope.addSecMan=function(){
    $scope.addSec=true;
  }
  $scope.checkedBill=function(){
    $scope.checked=true;
  }
  $scope.checkednonBill=function(){
    $scope.checked=false;
  }
  $scope.clientEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/welcomeclient').success(function(response) {
     growl.info(parse("client invitations sent successfully"));
   })
  }
  $scope.inviteEmail=function(){
    $http.get('/api/v1/secure/email/'+ $scope.visits._id+'/inviteeAttendees').success(function(response) {
     growl.info(parse("invitees invitations sent successfully"));
   })
  }

  $scope.closeNotification=function(){
   $location.path("visits/list"); 
 }
 $scope.closeVisit=function(status){
  console.log(status);
  $scope.status = status;
  $scope.status="complete";

  $scope.visits.anchor = $scope.anchorman;
  $scope.visits.secondaryVmanager= $scope.vman;
  $scope.visits.status =$scope.status;
  $scope.visits.agm = $scope.agmId;
  $scope.visits.anchor = $scope.anchorman;
  $scope.visits.secondaryVmanager= $scope.vman;
  $scope.visits.createBy= $rootScope.user._id;
  $scope.visits.client = $scope.clientIdData;
  $scope.visits.invitees = $scope.arraydata;
  $scope.visits.feedbackTmpl = $scope.feedbackId;
  $scope.visits.sessionTmpl = $scope.sessionId;
  $scope.cscPersonnel.salesExec = $scope.salesExecId;
  $scope.cscPersonnel.accountGM= $scope.accountGMId;
  $scope.cscPersonnel.industryExec = $scope.industryExecId;
  $scope.cscPersonnel.globalDelivery = $scope.globalDeliveryId;
  $scope.cscPersonnel.cre= $scope.creId;
  $scope.visits.cscPersonnel=$scope.cscPersonnel;

  var inData       = $scope.visits;
  inData.keynote = $scope.keynotes;

  $http.put('/api/v1/secure/visits/' + $scope.visits._id, inData).success(function(response) {
    growl.info(parse("notifications stage compleated successfully"));
    $scope.nextTab($scope.visits._id);
  })

}
$scope.isDataValid=function(schedule){
  var Today = new Date();

  if(schedule === "" || schedule === undefined)
    return "Data undefined !";

  if(schedule.startDate === "" || schedule.startDate === undefined || schedule.startDate === null)
    return "Start Date not valid !";

  if(schedule.endDate === "" || schedule.endDate === undefined || schedule.endDate === null)
    return "End Date not valid !";

  if(currentDiff(schedule.startDate)<0)
    return "Start Date cannot be less than Current Date !";

  if(DateDiff(schedule.startDate,schedule.endDate)>0)
    return "End Date cannot be less than Start Date !";

  if(schedule.location === "" || schedule.location === undefined )
    return "Location not valid !";

  return "OK";
} 
  // Visit schedule table
  $scope.addSchedule=function(schedule){
    var isValid = $scope.isDataValid(schedule);
    if(isValid === "OK"){
      var startDate = moment(schedule.startDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
      var endDate = moment(schedule.endDate).format('YYYY-MM-DDTHH:mm:ss.SSSS');
      $scope.subdis= false;
      $scope.schedules.push({
        startDate: startDate,
        endDate: endDate,
        location: schedule.location,
        meetingPlace: schedule.meetingPlace
      });
    }
    else {
      console.log(isValid);
      $scope.err = isValid;
      $scope.subdis= true;
      $timeout(function () { $scope.err = ''; }, 5000);}

      schedule.startDate='';
      schedule.endDate='';
      schedule.location='';
      schedule.meetingPlace='';
    };

    $scope.removeSchedule = function(index,schedules){

      $scope.schedules.splice(index, 1);
      if (schedules.length == 0)
      {
        $scope.subdis= true;
      }else{
        $scope.subdis= false;}
      };

    // $scope.editSchedule = function(index,schedule){
    //   $scope.schedule= schedule;
    //   $scope.schedules.splice(index, 1);
    // };
// Visit schedule table end

 // Visit keynote table
 $scope.isDataValidkey=function(keynoteDef){
  console.log(keynoteDef);
  if(keynoteDef === "" || keynoteDef === undefined)
    return "Data undefined !";

  if(keynoteDef.noteName === "" || keynoteDef.noteName === undefined || keynoteDef.noteName === null)
    return "keynote not valid !";

  if(keynoteDef.context === "" || keynoteDef.context === undefined || keynoteDef.context === null)
    return "context not valid !";

  if(keynoteDef.order === "" || keynoteDef.order === undefined || keynoteDef.order === null)
    return "order not valid !";

  return "OK";
}

$scope.addkeynote=function(keynoteDef){
  var isValid = $scope.isDataValidkey(keynoteDef);
  if(isValid === "OK"){
    $scope.keyvalid=false;
    $scope.keynotes.push({
      note: $scope.keynoteId,
      noteName: keynoteDef.noteName, 
      context: keynoteDef.context,
      order: keynoteDef.order
    });
  }else {$scope.keyvalid=isValid;
    $timeout(function () { $scope.keyvalid = ''; }, 5000);}

    keynoteDef.noteName='';
    keynoteDef.context='';
    keynoteDef.order='';
  };

  $scope.removekeynote = function(index){
    $scope.keynotes.splice(index, 1);
  };

// $scope.editkeynote = function(index,keynoteDef){
//   $scope.showKey=true;
//   console.log(keynoteDef);
//   $scope.keynoteDef= keynoteDef;
//   $scope.keynotes.splice(index, 1);
// };
// Visit keynote table end

function toTitleCase(string)
{
      // \u00C0-\u00ff for a happy Latin-1
      return string.toLowerCase().replace(/_/g, ' ').replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
        return initial.toUpperCase();
      }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
        return match.toLowerCase();
      });
    }

    $scope.inputChanged = function(str) {
      $scope.jobTitle = str;
    }  
  //adding visitor data if not registered user
  $scope.addvisitordata = function(userdata,emailId,influencedata,avatar)
  { 
    $scope.contactNo = [];
    $scope.contactNo.push({
      contactNumber:"+" + userdata.contactNumber,
      contactType:userdata.contactType
    })

    if(avatar == '' || avatar == undefined)
    {
      userdata.avatar = '/public/assets/g/imgs/avatar.jpg';
    }  
    if(avatar != '' || avatar !=undefined)
    {  
      userdata.avatar = avatar;
    }
    userdata.email = emailId;
    userdata.local.email = emailId;
    userdata.association = 'customer';
    userdata.contactNo = $scope.contactNo;
    userdata.orgRef = $scope.visits.client._id;
    if(userdata.jobTitle!=null)
    {
      userdata.jobTitle = toTitleCase(userdata.jobTitle);
    }

    if(userdata.jobTitle==null)
    {
      userdata.jobTitle = toTitleCase($scope.jobTitle);
    }
    $http.post('/api/v1/secure/admin/users/',userdata).success(function(response){
    }).then(function() {
    // "complete" code here
    $http.get('/api/v1/secure/admin/users/email/' + userdata.email).success(function(response) {
     $scope.userId = response._id;
     $scope.showFlag = "user";
     $scope.visitors.push({
      visitor: $scope.userId,
      influence: influencedata
    });

     if ($scope.visitors.length == 0)
     {
       $scope.visvalid=true;

     }else{
       $scope.visvalid=false;

     }
   });
  });
    $scope.avatar = '/public/assets/g/imgs/avatar.jpg';


  }

  $scope.cancelButton = function(){
    $scope.showFlag = "noUser";
    $scope.message = "";
  };

  // Visit visitor table
  // //id
  $scope.callClientId=function() {
    console.log("im here in callClientId lucky u");
    $http.get('/api/v1/secure/clients/find?query=' + $scope.visits.client+"&subQuery="+$scope.visits.subName+"&industry="+$scope.visits.industry+"&regions="+$scope.visits.regions+"&id=").success(function(response) {
      console.log(response);
      if (response.id!="null") {
        $scope.clientId= response.id;
        console.log($scope.clientId);
      }

    })
  }

  $scope.addvisitor=function(visitorDef){
    $scope.showAvatar = false;
    $scope.showFlag='';
    $scope.message='';
    $scope.emailId = '';
    var influence= visitorDef.influence;
    var emailid = visitorDef.visitorId;
    var influencedata = visitorDef.influence;
    if(visitorDef.visitorId!=null)
    {
      $http.get('/api/v1/secure/admin/users/email/' + emailid.toLowerCase()).success(function(response) {
       if(response.association == 'customer' && response.orgRef == $scope.visits.client._id)
       { 
         $scope.userId = response._id;
         $scope.showFlag = "user";
         $scope.visvalid= false;
         $scope.visitors.push({
          visitor: $scope.userId,
          influence: influence
        });

         for(var i=0;i<$scope.visitors.length - 1;i++)
         {
          if($scope.userId == $scope.visitors[i].visitor)
          {
            $scope.showFlag = "noUser";
            $scope.message = "Visitor Already Exists , Add Unique Visitor";
            $timeout(function () { $scope.message = ''; }, 3000);
            $scope.visitors.splice($scope.visitors.length - 1, 1);
          }
        }
      }

      else if(response.groups == 'exec')
      { 
       $scope.userId = response._id;
       $scope.showFlag = "user";
       $scope.visvalid= false;
       $scope.visitors.push({
        visitor: $scope.userId,
        influence: influence
      });

       for(var i=0;i<$scope.visitors.length - 1;i++)
       {
        if($scope.userId == $scope.visitors[i].visitor)
        {
          $scope.showFlag = "noUser";
          $scope.message = "Senior Executive Already Exists , Add Unique Senior Executive";
          $timeout(function () { $scope.message = ''; }, 3000);
          $scope.visitors.splice($scope.visitors.length - 1, 1);
        }
      }
    }

    else if(response.association !='customer' || response.groups!='exec')
    {
      $scope.showFlag = "noUser";
      $scope.message = "User is not senior executive or client.";
      $timeout(function () { $scope.message = ''; }, 3000);
    }

    else if(response.orgRef != $scope.visits.client._id)
    {
      $scope.showFlag = "noUser";
      $scope.message = "User does not belongs to " + $scope.visits.client.name;
      $timeout(function () { $scope.message = ''; }, 3000);
    }
  })
}

if(visitorDef.visitorId==null)
{
  $scope.showFlag = "notRegisteredUser";
  console.log(influencedata);
  $scope.emailId = emailid;
  $scope.influencedata = influencedata;
  console.log($scope.emailId); 
  $scope.message = "Client Does Not Exist.Please Add new client for this visit.";
}  
// .error(function(response, status){

//   $scope.showFlag = "notRegisteredUser";
//   if(status===404)
//   { 
//     console.log(influencedata);
//     $scope.emailId = emailid;
//     $scope.influencedata = influencedata;
//     console.log($scope.emailId); 
//     $scope.message = "User not found plz register";
//   }
//   else
//     console.log("error with user directive");
// });


    //if not found add visitor-post that and get id
    visitorDef.influence='';
    visitorDef.visitorId='';
    visitorDef.visitor = '';
    visitorDef.visitorUser = '';
    $scope.selectedUser = '';
  };
  
  $scope.removevisitor = function(visitorDef,visitors){
    var index = visitors.indexOf(visitorDef);
    $scope.visitors.splice(index, 1);
    if (visitors.length == 0)
    {
     $scope.visvalid=true;
     
   }else{
     $scope.visvalid=false;

   }
 };

 $scope.editvisitor = function(index,visitorDef){
  $scope.visitorDef = visitorDef;
  $scope.visitors.splice(index, 1);
  };// Visit visitor table end

  $scope.mySort = $scope.newestFirst = function(visitorDef) {
    return -$scope.visitors.indexOf(visitorDef);
  }
  //Feedback by Person
  $scope.feedbackbyPerson = function(visitid) {
    $scope.feedbackTitles = [];
    $http.get('/api/v1/secure/feedbacks').success(function(response1)
    { 
      $scope.feedbackDatalist = $filter('filter')(response1, { visitid: visitid, feedbackOn: "visit" });
      console.log($scope.feedbackDatalist);
      $http.get('/api/v1/secure/feedbackDefs/id/'+$scope.feedbackDatalist[0].template).success(function(response2)
      {
        $scope.feedbackTitles.push(response2.title);
      });
    });
  }

  //Feedback By Question
  $scope.feedbackbyQuestion = function(visitid) {
   $http.get('/api/v1/secure/feedbacks').success(function(response1)
   {
    $scope.arrayQuery = [];
    $scope.arrayItem = [];
    $scope.feedbacks = $filter('filter')(response1, { visitid: visitid, feedbackOn: "visit" });
    var feedbackData = $scope.feedbacks;
    for(var i =0;i<feedbackData.length;i++)
    {
      for(var j=0;j<feedbackData[0].item.length;j++)
      {
        $scope.arrayItem.push(feedbackData[i].item[j]);
      }
    }
  });
 }

 $scope.haschange = function()
 {
  $scope.view ={"mode":null};
}
  //Feedback by Person
  $scope.sessionFeedbackbyPerson = function(visitId,sessionId) {
    $scope.feedbackSampleTitles = [];
    $scope.persons = [];
    $http.get('/api/v1/secure/feedbacks').success(function(response1)
    { 
      $scope.feedbackSamplelist = $filter('filter')(response1, {visitid:visitId, sessionid: sessionId, feedbackOn: "session" });
      $http.get('/api/v1/secure/feedbackDefs/id/'+$scope.feedbackSamplelist[0].template).success(function(response2)
      {
        $scope.feedbackSampleTitles.push(response2.title);
      });

    });

    $http.get('/api/v1/secure/visitSchedules/' + sessionId).success(function(response3)
    {
      $scope.owner = response3.session.owner;
      $scope.supporter = response3.session.supporter;
      $scope.locationsession = response3.session.location;
      $scope.description = response3.session.desc;
      $scope.sessiontitle = response3.session.title;

      $http.get('/api/v1/secure/admin/users/' + $scope.owner).success(function(response)
      {
        $scope.userModel = response;
      });

      $http.get('/api/v1/secure/admin/users/' + $scope.supporter).success(function(response)
      {
        $scope.userModel1 = response;
      });
    });


  }

  //Feedback By Question
  $scope.sessionFeedbackbyQuestion = function(visitId,sessionId) {

   $http.get('/api/v1/secure/feedbacks').success(function(response1)
   {
    $scope.arrayQuery = [];
    $scope.arrayItem = [];
    $scope.feedbacks = $filter('filter')(response1, {visitid:visitId, sessionid: sessionId, feedbackOn: "session" });
    var feedbackData = $scope.feedbacks;
    for(var i =0;i<feedbackData.length;i++)
    {
      for(var j=0;j<feedbackData[0].item.length;j++)
      {
        $scope.arrayItem.push(feedbackData[i].item[j]);
      }
    }
  });

   $http.get('/api/v1/secure/visitSchedules/' + sessionId).success(function(response4)
   {
    $scope.owner1 = response4.session.owner;
    $scope.supporter1 = response4.session.supporter;
    $scope.locationsession = response4.session.location;
    $scope.description = response4.session.desc;
    $scope.sessiontitle = response4.session.title;

    $http.get('/api/v1/secure/admin/users/' + $scope.owner1).success(function(response)
    {
      $scope.userModel2 = response;

    });

    $http.get('/api/v1/secure/admin/users/' + $scope.supporter1).success(function(response)
    {
      $scope.userModel3 = response;
    });
  });

 }


 var indexedQuestions = [];

 $scope.questionsToFilter = function() {
  indexedQuestions = [];
  return $scope.arrayItem;
}

$scope.filterQuestions = function(item) {
  var questionIsNew = indexedQuestions.indexOf(item.query) == -1;
  if (questionIsNew) {
    indexedQuestions.push(item.query);
  }
  return questionIsNew;
}

// Show Profile Dialog for non-registered users
$scope.showProfileButton = function(ev) {
  $mdDialog.show({
    templateUrl: '/public/mods/visits/profilePictureDialog.html',
    scope: $scope.$new(),
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true

  })
  .then(function(answer) {
    $scope.status = 'You said the information was "' + answer + '".';
  }, function() {
    $scope.status = 'You cancelled the dialog.';
  });

};

$scope.addpicture = function (dataUrl) {
  Upload.upload({
    url: '/api/v1/upload/profilePics',
    data: {
      file: Upload.dataUrltoBlob(dataUrl),
    },
  }).then(function (response) {
    $scope.userdata ='';
    $scope.result = response.data;
    var filepath = response.data.file.path;
    var imagepath = '/'+ filepath.replace(/\\/g , "/");
    $scope.avatar = imagepath;
    $scope.showAvatar = true;
    $mdDialog.hide();
  });

};

$scope.hide = function() {
  $mdDialog.hide();
};
$scope.canceldialog = function() {
  $mdDialog.cancel();
};
$scope.answer = function(answer) {
  $mdDialog.hide(answer);
};

$scope.clearInput = function (id) {
  if (id) {
    $scope.$broadcast('angucomplete-alt:clearInput', id);
  }
  else{
    $scope.$broadcast('angucomplete-alt:clearInput');
  }
}
}])

//Autocompleate - Directive '$timeout', function($timeout)
// visitsApp.directive("autocomplete", ["AutoCompleteService", "$timeout", function (AutoCompleteService,$timeout) {
//   return {
//     restrict: "A",              //Taking attribute value
//     link: function (scope, elem, attr, ctrl) {
//       elem.autocomplete({
//         source: function (searchTerm, response) {
//           AutoCompleteService.search(searchTerm.term).then(function (autocompleteResults) {
//             if(autocompleteResults == undefined || autocompleteResults == ''){
//               scope.autoFail=true;
//               scope.clientNotFound="Client not found!!!"
//               // $timeout(function () { scope.clientNotFound = ''; }, 5000);
//             }
//             else{
//               response($.map(autocompleteResults, function (autocompleteResult) {
//                 console.log(autocompleteResult)
//                 return {
//                   label: autocompleteResult.name,
//                   value: autocompleteResult.name,
//                   id: autocompleteResult._id,
                  // salesExecId: autocompleteResult.cscPersonnel.salesExec,
                  // accountGMId: autocompleteResult.cscPersonnel.accountGM,
                  // industryExecId: autocompleteResult.cscPersonnel.industryExec,
                  // globalDeliveryId: autocompleteResult.cscPersonnel.globalDelivery,
//                   // creId: autocompleteResult.cscPersonnel.cre
//                 }
//               }))
//             }
//           });
// },
// minLength: 3,
// select: function (event, selectedItem) {
//   scope.clientName= selectedItem.item.value;
//   scope.clientId= selectedItem.item.id;
  // scope.salesExecId = selectedItem.item.salesExecId;
  // scope.accountGMId= selectedItem.item.accountGMId;
  // scope.industryExecId = selectedItem.item.industryExecId;
  // scope.globalDeliveryId = selectedItem.item.globalDeliveryId;
  // scope.creId= selectedItem.item.creId;
//   scope.autoFail=false;
//   scope.$apply();
//   event.preventDefault();
// }
// });
// }
// };
// }]);
//Autocompleate - Directive
visitsApp.directive("feedback", ["FeedbackService", "$timeout", function (FeedbackService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          FeedbackService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailfed=true;
              scope.feedbackNotFound="Feedback Template not found!!!"
              // $timeout(function () { scope.feedbackNotFound = ''; }, 5000);
            }else{
              response($.map(autocompleteResults, function (autocompleteResult) {
                return {
                  label: autocompleteResult.title,
                  value: autocompleteResult.title,
                  id: autocompleteResult._id
                }
              }))
            }
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.feedback= selectedItem.item.value;
          scope.feedbackId= selectedItem.item.id;
          scope.autoFailfed=false;
          scope.$apply();
          event.preventDefault();
        }
      });
}
};
}]);
//Autocompleate - Directive
visitsApp.directive("session", ["SessionService", "$timeout", function (SessionService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          SessionService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailsec=true;
              scope.sessionNotFound="Session Template not found!!!"
            }else{
              response($.map(autocompleteResults, function (autocompleteResult) {
                return {
                  label: autocompleteResult.title,
                  value: autocompleteResult.title,
                  id: autocompleteResult._id
                }
              }))
            }
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          scope.session= selectedItem.item.value;
          scope.sessionId= selectedItem.item.id;
          scope.autoFailsec=false;
          scope.$apply();
          event.preventDefault();
        }
      });
    }
  };
}]);
//Autocompleate - Directive
visitsApp.directive("keynote", ["KeynoteService", "$timeout", function (KeynoteService,$timeout) {
  return {
    restrict: "A",              //Taking attribute value
    link: function (scope, elem, attr, ctrl) {
      elem.autocomplete({
        source: function (searchTerm, response) {
          KeynoteService.search(searchTerm.term).then(function (autocompleteResults) {
            if(autocompleteResults == undefined || autocompleteResults == ''){
              scope.autoFailkey=true;
              scope.keynoteNotFound="keynote not found!!!"
            }else{
              response($.map(autocompleteResults, function (autocompleteResult) {
                return {
                  label: autocompleteResult.title,
                  value: autocompleteResult._id,
                  id: autocompleteResult._id
                }
              }))
            }
          });
        },
        minLength: 4,
        select: function (event, selectedItem) {
          // scope.keynoteDef.note= selectedItem.item.label;
          scope.keynoteDef.noteName= selectedItem.item.label;
          scope.keynoteId= selectedItem.item.id;
          scope.autoFailkey=false;
          scope.$apply();
          event.preventDefault();
        }
      });
}
};
}]);
//ui-date picker - Directive
visitsApp.directive('uiDate', function() {
  return {
    require: '?ngModel',
    link: function($scope, element, attrs, controller) {
      var originalRender, updateModel, usersOnSelectHandler;
      if ($scope.uiDate == null) $scope.uiDate = {};
      if (controller != null) {
        updateModel = function(value, picker) {
          return $scope.$apply(function() {
            return controller.$setViewValue(element.datepicker("getDate"));
          });
        };
        if ($scope.uiDate.onSelect != null) {
          usersOnSelectHandler = $scope.uiDate.onSelect;
          $scope.uiDate.onSelect = function(value, picker) {
            updateModel(value);
            return usersOnSelectHandler(value, picker);
          };
        } else {
          $scope.uiDate.onSelect = updateModel;
        }
        originalRender = controller.$render;
        controller.$render = function() {
          originalRender();
          return element.datepicker("setDate", controller.$viewValue);
        };
      }
      return element.datepicker($scope.uiDate);
    }
  };
});

visitsApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
