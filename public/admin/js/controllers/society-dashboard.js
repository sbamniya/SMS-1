
socialApp.controller('societyDashboard',['$scope', '$http', '$location', '$compile', '$routeParams', '$route', function ($scope, $http,$location, $compile, $routeParams,$route) {
		
		var id = window.atob($routeParams.blockID);
		
		$http.post('/getSingleBlock', {id: id}).success(function(response){
			if(response.success){

				$scope.block = response.success;
				$scope.blockStorey = [];
				
				var numberOfStoreys = parseInt(response.success.storeys);
				
				for (var i = numberOfStoreys; i >= 1; i--) {
					
					$http.post('/getFlatList', {id: id, storey_number:i}).success(function(res){
						if(res.success){
							
								if(res.success.length > 0){

									$scope.blockStorey.push({flats:res.success, storeyNo: res.success[0].storey_number});
									$scope.isUpdated = false;
								}else{
									$scope.isUpdated = true;
								}
								
						}else{
							$location.path('/404');
						}
					});
				}
				$scope.block.parent_id = window.btoa($scope.block.parent_id);
				$scope.block.id = window.btoa($scope.block.id);

			}else{
				$location.path('/404');
			}

		});

		$scope.addResident = function(flatId){
			$location.path('/add-resident/'+btoa(id)+'/'+btoa(flatId));
		}

		
	}]);