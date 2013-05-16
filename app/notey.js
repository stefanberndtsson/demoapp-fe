var notey = angular.module('Notey', ['ngResource', 'ngCookies'], function($locationProvider, $httpProvider) {
    var interceptor = function ($rootScope, $q, $location) {

        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if (status == 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            // otherwise
            return $q.reject(response);

        }

        return function (promise) {
            return promise.then(success, error);
        }

    };
    $httpProvider.responseInterceptors.push(interceptor);
});

notey.controller('AppCtrl', function($rootScope, $scope, Login, $cookies, $window) {
    $scope.pageTitle = "Notey";
    $scope.logout = function() {
	delete $cookies['connect.sid']
	$rootScope.loggedIn = false;
    }
    $rootScope.debug = "foobar";
});

notey.config(function($routeProvider) {
    $routeProvider.when("/user", {
	templateUrl: "partials/user-index.html",
	controller: "UserCtrl"
    });
    $routeProvider.when("/login", {
	templateUrl: "partials/login.html",
	controller: "LoginCtrl"
    });
    $routeProvider.otherwise({
	templateUrl: "partials/note-index.html",
	controller: "NoteCtrl"
    });
});

notey.directive('noteyNavbar', function($rootScope, Login) {
    return {
	restrict: 'E',
	templateUrl: 'partials/navbar.html',
	transclude: true,
	link: function(scope, elem, attrs) {
	    scope.brand = attrs.brand;
	}
    }
});

notey.directive('noteyRegister', function($rootScope, Login) {
    return {
	restrict: 'E',
	replace: true,
	template: '<li><a href="#/user" ng-click="register()">Register</a></li>',
	link: function(scope, elem, attrs) {
	}
    }
});

notey.directive('noteyLogout', function($rootScope, Login) {
    return {
	restrict: 'E',
	replace: true,
	template: '<li><a href="#" ng-click="logout()">Logout</a></li>',
	link: function(scope, elem, attrs) {
	}
    }
});

