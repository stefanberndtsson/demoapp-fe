notey.factory('Note', function($resource, $http, $cookies) {
    $http.defaults.useXDomain = true;
    $http.defaults.withCredentials = true;
    $http.defaults.headers.common['Pragma'] = 'no-cache';
    return $resource('http://localhost:port/users/:user_id/notes/:id',
		     { port: ':1337', user_id: '@user_id', id: '@id' },
		     { update: {method: 'PUT'} });
});

notey.controller('NoteCtrl', function($scope, $rootScope, Note, Login) {
    console.log("NoteCtrl");

    $scope.noteView = "active";

    $scope.setNoteView = function(newView) {
	$scope.noteView = newView;
	$scope.fetch($rootScope.loggedIn);
	return false;
    }

    Login.whoami(function(user) {
	$rootScope.loggedIn = user;
	$scope.fetch(user);
    });
    $scope.fetch = function(user) {
	var queryData = {
	    user_id: user ? user.id : 0
	}
	if($scope.noteView == "deleted") { queryData.deleted = true }
	if($scope.noteView == "archived") { queryData.archived = true }
	Note.query(queryData,
		   function(data) {
		       $scope.notes = data;
		   });
    }

    $scope.resetForm = function() {
	if($rootScope.loggedIn) {
	    $scope.form = {user_id: $rootScope.loggedIn.id}
	}
    }

    $scope.resetForm();

    $scope.saveForm = function() {
	if($rootScope.loggedIn) {
	    $scope.form.user_id = $rootScope.loggedIn.id
	    if($scope.form.id) {
		Note.update($scope.form,
			    function(data) {
				$scope.resetForm();
				$scope.fetch($rootScope.loggedIn);
			    });
	    } else {
		Note.save($scope.form,
			  function(data) {
			      $scope.resetForm();
			      $scope.fetch($rootScope.loggedIn);
			  });
	    }
	}
    }

    $scope.destroy = function(note, archive) {
	if($rootScope.loggedIn) {
	    var deleteObj = {
		user_id: $rootScope.loggedIn.id,
		id: note.id,
		archive: archive
	    }
	    Note.delete(deleteObj, function(data) {
		$scope.fetch($rootScope.loggedIn);
	    });
	}
    }

    $scope.edit = function(note) {
	$scope.form = angular.copy(note);
    }

    $scope.selectedNotes = {}
    
    $scope.selectOneNote = function(noteId) {
	$scope.selectedNotes = {};
	$scope.selectNote(noteId);
    }

    $scope.selectNote = function(noteId) {
	$scope.selectedNotes[noteId] = true;
    }

    $scope.unselectNote = function(noteId) {
	$scope.selectedNotes[noteId] = false;
    }

    $scope.toggleSelectNote = function(noteId) {
	$scope.selectedNotes[noteId] = $scope.selectedNotes[noteId] ? false : true;
    }
});

notey.directive('noteyForm', function() {
    return {
	restrict: 'E',
	templateUrl: 'partials/form.html',
	link: function(scope, elem, attrs) {
	    
	}
    }
});
		 
notey.directive('noteyNote', function() {
    return {
	restrict: 'E',
	replace: true,
	templateUrl: 'partials/note.html',
	link: function(scope, elem, attrs) {
	    scope.enter = function() {
		scope.hovered = true;
	    }
	    scope.leave = function() {
		scope.hovered = false;
	    }
	}
    }
});

notey.directive('noteyNoteList', function($rootScope) {
    return {
	restrict: 'E',
	replace: true,
	template: '<notey-note ng-repeat="note in notes"></notey-note>',
	link: function(scope, elem, attrs) {
	    scope.fetch($rootScope.loggedIn);
	}
    }
});

