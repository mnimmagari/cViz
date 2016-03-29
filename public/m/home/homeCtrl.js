var app = angular.module('home');

app.controller('homeCtrl', ['$scope', 'location', function($scope, location) {
    location.get(angular.noop, angular.noop);

}]);
app.directive("scroll", function($window) {
    return function(scope, element, attrs) {
        scope.data = false;
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                scope.data = true;
            } else {
                scope.data = false;
            }
            scope.$apply();
        });
    };
});