var app = angular.module('nestTest', ['ngCookies', 'firebase']);

app.controller('thermCtrl', ['$scope', '$cookies', '$timeout', '$window', function($scope, $cookies, $timeout, $window){

	$scope.data = {};
	$scope.structure = {};
	$scope.thermostat = {
		ambient_temperature_f: 0,
		temperature_scale: 'F'
	};
	
	var accessToken = $cookies.get('nest_token');
	var baseUrl = new $window.Firebase('wss://developer-api.nest.com');
	baseUrl.authWithCustomToken(accessToken, function(e) {
		if (e) {
			console.log('there was an error');
		}
	});

	var firstChild = function(object) {
  		for(var key in object) {
    		return object[key];
  		}
	}

	if (accessToken) {
		document.getElementById('reg-button').style.display = "none";
	}

	$scope.regDevice = function() {
		window.location.replace('/auth/nest');
	};

	baseUrl.on('value', function (snapshot) {
		$timeout(function() {
			$scope.data = snapshot.val();
	  		$timeout(function() { 
	  			$scope.structure = firstChild($scope.data.structures);
	  		});
	  		$timeout(function() { 
	  			$scope.thermostat = $scope.data.devices.thermostats[$scope.structure.thermostats[0]];
	  			$scope.thermostat.device_id = $scope.structure.thermostats[0];
	  		});
	  		
	  		console.log($scope.data);
		});
	});

}]);