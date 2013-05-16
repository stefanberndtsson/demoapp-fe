notey.factory('User', function($resource, $http) {
    $http.defaults.useXDomain = true;
    $http.defaults.withCredentials = true;
    return $resource('http://localhost:port/users/:id',
		     { port: ':1337', id: '@id'},
		     { 
			 update: {method: 'PUT'},
			 chpwd: {method: 'PUT'}
		     });
});

notey.controller('UserCtrl', function($scope, User, $window) {
    console.log("UserCtrl");
    $scope.fetch = function() {
	User.query({},
		   function(data) {
		       $scope.users = data;
		   });
    }

    $scope.resetForm = function() {
	$scope.form = {}
    }

    $scope.resetForm();
    $scope.fetch();

    $scope.cancel = function() {
	$window.location.href = '#/';
	return false;
    }

    $scope.formValid = function() {
	if(!$scope.form) { return false; }
	if(!$scope.form.name) { return false; }
	if(!$scope.form.username) { return false; }
	return true;
    }

    $scope.saveForm = function() {
	if($scope.form.id) {
	    User.update($scope.form,
			function(data) {
			    $scope.resetForm();
			    $scope.fetch();
			});
	} else {
	    User.save($scope.form,
		      function(data) {
			  $scope.resetForm();
			  $scope.fetch();
		      });
	}
	$scope.editingMode = 'new';
	$window.location.href = '#/';
    }

    $scope.chpwd = function(user) {
	$scope.form = angular.copy(user);
	$scope.editingMode = 'chpwd';
    }

    $scope.edit = function(user) {
	$scope.form = angular.copy(user);
	$scope.editingMode = 'existing'; 
   }
});

notey.directive('userForm', function() {
    return {
	restrict: 'E',
	templateUrl: 'partials/user-form.html',
	link: function(scope, elem, attrs) {
	    
	}
    }
});
		 
notey.directive('userList', function() {
    return {
	restrict: 'E',
	templateUrl: 'partials/user-list.html',
	link: function(scope, elem, attrs) {
	    
	}
    }
});
		 
