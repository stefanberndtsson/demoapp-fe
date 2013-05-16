notey.factory('Login', function($http, $cookies, $cookieStore) {
    $http.defaults.useXDomain = true;
    $http.defaults.withCredentials = true;
    return {
	authenticate: function(formData, callback, callbackErr) {
	    $http({
		url: "http://localhost:1337/login", 
		method: 'GET',
		params: formData
	    }).success(function(data) {
		callback(data);
	    }).error(function(err) {
		callbackErr(err);
	    });
	},
	whoami: function(callback) {
	    $http({
		url: "http://localhost:1337/whoami",
		method: 'GET'
	    }).success(function(data) {
		callback(data);
	    })
	}
    }
});

notey.controller('LoginCtrl', function($rootScope, $scope, $cookieStore, $location, Login) {
    $scope.login = function() {
	Login.authenticate(
	    $scope.form, 
	    function(data) {
		$location.path('/');
	    },
	    function(err) {
		$scope.form = {};
	    }
	);
    }

    $scope.form = {}
});

