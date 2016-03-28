

var app = angular.module('home');

app.controller('homeCtrl', ['$scope', 'location', function ($scope, location) {
   location.get(angular.noop, angular.noop);
  // $scope.data = false;
}]);
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
    	// scope.navClass = 'big';
        scope.data = false;
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 100) {
                 // scope.navClass = 'small';
                 scope.data = true;
             } else {
                  // scope.navClass = 'big';
                  scope.data = false;
             }
            scope.$apply();
        });
    };
});
