socialApp.controller('residentList',['$scope', '$http', '$location', '$compile','$route','$routeParams', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $http,$location, $compile, $route, $routeParams, $timeout,DTOptionsBuilder,DTColumnBuilder) {

	    var id = atob($routeParams.blockID);
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server
            DTColumnBuilder.newColumn("id", "Resident ID").notSortable(),
            DTColumnBuilder.newColumn("flat_number", "Flat Number").notSortable(), 
            DTColumnBuilder.newColumn("first_name", "Name").notSortable(),
            DTColumnBuilder.newColumn("user_name", "Username").notSortable(),
            DTColumnBuilder.newColumn("email", "Email").notSortable(),
            DTColumnBuilder.newColumn("contact_no", "Contact").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getresidentList",
            type:"GET",
            data: function(d){
                d.id = id;
            },
            dataSrc: function (res) { 
                var generateResponse = JSON.parse(res.success);
                var log=[];
                angular.forEach(generateResponse, function(value, key){
                    if (value.first_name=='') {
                        value.first_name = 'N/A';
                    }
                    if (value.contact_no=='') {
                        value.contact_no = 'N/A';
                    }
                    log.push(value);
                });
                return log;
      		}
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
        .withOption('responsive', true)
        .withOption('createdRow', createdRow);

        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="#/resident-info/'+btoa(id)+'/'+btoa($d.id)+'" title="Know More"><i class="fa fa-question-circle" aria-hidden="true"></i></a>'
        }
        
		/*$scope.deleteBlock = function(id){
			var url = '/deleteBlock';
			$http.post(url, {id: id}).success(function(response){
				$route.reload();
			});
		}*/
}]);

socialApp.controller('residentInfo', ['$scope','$routeParams', '$location','$http', function($scope, $routeParams, $location,$http){
    var id = atob($routeParams.blockID);
    var residentId = atob($routeParams.residentID);
    $scope.residentDetail = {};
    $http.get('/getresidentInfo?id='+residentId).success(function(response){
        if (response.hasOwnProperty('success')) {
            $scope.residentDetail = JSON.parse(response.success);
            if ($scope.residentDetail.first_name=='' && $scope.residentDetail.last_name=='') {
                $scope.residentDetail.first_name = 'N/A';
            }
            if ($scope.residentDetail.contact_no=='') {
                $scope.residentDetail.contact_no = 'N/A';
            }
            if ($scope.residentDetail.area=='') {
                $scope.residentDetail.area = 'N/A';
            }
            if ($scope.residentDetail.location=='') {
                $scope.residentDetail.location = 'N/A';
            }
            if ($scope.residentDetail.registory_no=='') {
                $scope.residentDetail.registory_no = 'N/A';
            }
            if ($scope.residentDetail.ownership=='') {
                $scope.residentDetail.ownership = 'N/A';
            }
            if ($scope.residentDetail.loan=='') {
                $scope.residentDetail.loan = 'N/A';
            }
        }
   });
}])