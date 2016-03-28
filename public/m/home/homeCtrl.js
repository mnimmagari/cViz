

var app = angular.module('home');

app.controller('homeCtrl', ['$scope', 'location', function ($scope, location) {
   location.get(angular.noop, angular.noop);
}]);
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
    	scope.navClass = 'big';
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 0) {
                 scope.navClass = 'small';
             } else {
                  scope.navClass = 'big';
             }
            scope.$apply();
        });
    };
});
