'use strict';

var schedulerApp = angular.module('scheduler', ['ngFloatingLabels', "kendo.directives"]);

schedulerApp.controller('schedulerController', ['$scope', '$http', '$routeParams', '$location', 'growl',
    function($scope, $http, $routeParams, $location, growl) {


$scope.selection = {
            listGroup: undefined
        };

        $scope.listGroups = [{
            date: 'Hyderabad'
        }];

        var id = $routeParams.id;
        // AUtomatically swap between the edit and new mode to reuse the same frontend form
        $scope.mode = (id == null ? 'add' : 'edit');
        $scope.hideFilter = true;

        $scope.session = {};

        $scope.ownerId = "";
        $scope.ownerEmail = "";
        $scope.ownerUser = "";

        $scope.supporterId = "";
        $scope.supporterEmail = "";
        $scope.supporterUser = "";


        var refresh = function() {
            // $scope.visits =
             $http.get('/api/v1/secure/visits/' ).success(function(response){
                console.log(response);
                        $scope.visits = response;
                        $scope.visits ="";
                        console.log($scope.visits);
                      $scope.schedules = $scope.visits.schedule;  

console.log($scope.schedules);
            var startDate = visits.schedule[0].startDate;
              var endDate = visits.schedule[visits.schedule.length-1].endDate;

            })

            $http.get('/api/v1/secure/visitSchedules').success(function(response) {

                $scope.visit_schedulesList = response;
                $scope.visit_schedules = "";

                switch ($scope.mode) {
                    case "add":
                        $scope.visit_schedules = "";
                        break;

                    case "edit":
                        $scope.visit_schedules = $http.get('/api/v1/secure/visitSchedules/' + id).success(function(response) {
                            $scope.visit_schedules = response;

                            $scope.ownerUser = response.session.owner;
                            $scope.ownerEmail = response.session.owner.email;
                            $scope.ownerId = response.session.owner._id;

                            $scope.supporterUser = response.session.supporter;
                            $scope.supporterEmail = response.session.supporter.email;
                            $scope.supporterId = response.session.supporter._id;


                        });

                } // switch scope.mode ends
            }); // get visitSchedule call back ends
        }; // refresh method ends

        refresh();

        $scope.save = function() {
                // set noteBy based on the user picker value
                $scope.session.owner = $scope.ownerId;
                $scope.session.supporter = $scope.supporterId;
                switch ($scope.mode) {
                    case "add":
                        $scope.create();
                        break;

                    case "edit":
                        $scope.update();
                        break;
                } // end of switch scope.mode ends

                $location.path("/s/");
            } // end of save method

        $scope.create = function() {
            var inData = $scope.visit_schedules;
            inData = $scope.session;
            $http.post('/api/v1/secure/visitSchedules', inData).success(function(response) {
                    refresh();

                    growl.info(parse("visitSchedule [%s]<br/>Added successfully", $scope.visit_schedules.visit));
                })
                .error(function(data, status) {
                    growl.error("Error adding visitSchedule");
                }); // http post visitSchedule ends
        }; // create method ends

        $scope.delete = function(visit_schedules) {
            //var title = visit_schedules.session;
            $http.delete('/api/v1/secure/visitSchedules/' + visit_schedules._id).success(function(response) {
                    refresh();
                    growl.info(parse("visitSchedule [%s]<br/>Deleted successfully"));
                })
                .error(function(data, status) {
                    growl.error("Error deleting visitSchedule");
                }); // http delete visitSchedule ends
        }; // delete method ends

        $scope.update = function() {
            var inData = $scope.visit_schedules;
            inData = $scope.session;

            $http.put('/api/v1/secure/visitSchedules/' + $scope.visit_schedules._id, inData).success(function(response) {
                    refresh();
                    growl.info(parse("visitSchedule [%s]<br/>Edited successfully", $scope.visit_schedules.visit));
                })
                .error(function(data, status) {
                    growl.error("Error updating visitSchedule");
                }); // http put visitSchedule ends
        }; // update method ends


        $scope.getUser = function() {


            $http.get('/api/v1/secure/admin/users/' + $scope.session).success(function(response) {

                var user = response;
                $scope.session.owner = parse("%s %s, <%s>", user.name.first, user.name.last, user.email);
                $scope.session.supporter = parse("%s %s, <%s>", user.name.first, user.name.last, user.email);


            });
        }
        $scope.showModal = false;
        $scope.toggleModal = function() {
            $scope.showModal = !$scope.showModal;
        };


        // type field dropdown list
        $scope.type = [{
            session: 'presentation'
        }, {
            session: 'discussion'
        }, {
            session: 'tea'
        }, {
            session: 'lunch'
        }, {
            session: 'dinner'
        }, {
            session: 'floor-walk'
        }];


        // location field dropdown list
        $scope.location = [{
            session: 'Hyderabad'
        }, {
            session: 'Chennai'
        }, {
            session: 'Banglore'
        }, {
            session: 'Indore'
        }, {
            session: 'Noida'
        }, {
            session: 'Mumbai'
        }];
        

    }
]);

// Pop up directive
schedulerApp.directive('modal', function() {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});


