/*For Resident*/
socialApp.controller('logComplaint', ['$scope','$http','$location', '$routeParams','$window', function($scope, $http, $location, $routeParams, $window){
	var residentId = JSON.parse(window.localStorage.getItem('userDetails'));
	$scope.complaint = {
		resident_id: residentId.id,
		suggestion:''
	};
	$scope.addComplaint = function(){
		var url = '/addComplaint';
		
		
		$http.post(url, $scope.complaint).success(function(response,status,headers,config){
			if(response.hasOwnProperty('success')){
				$window.open('#/full-complaint-form/'+btoa(response.last_id), "popup", "width=600,height=400,left=10,top=50");
				$location.path("/complaint-list");
            }else{
               $location.path("/complaint-list");
            }
        });
	}
		
}]);

socialApp.controller('fullComplaintForm', ['$scope','$http','$location', '$routeParams','$timeout', '$window', function($scope, $http, $location, $routeParams, $timeout, $window){
		var complaintId = atob($routeParams.complaintID);
		var url = '/getcomplaintDetail';
		$scope.complaintDetail = {};
		$http.post(url, {complaintID: complaintId}).success(function(response,status,headers,config){
			
			if (response.hasOwnProperty('success')) {
				$scope.complaintDetail = JSON.parse(response.success);
				var date = new Date($scope.complaintDetail.date);
				$scope.complaintDetail.date = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear();
			}
			$timeout($window.print, 0);
        });
		
}]);

socialApp.controller('complaintList',['$scope', '$http', '$location', '$compile','$route', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $http,$location, $compile, $route, $timeout,DTOptionsBuilder,DTColumnBuilder) {

	    var residentId = JSON.parse(window.localStorage.getItem('userDetails'));
		var id = residentId.id;
		$scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Complaint ID").notSortable(),
            DTColumnBuilder.newColumn("subject", "Complaint Subject").notSortable(),
            DTColumnBuilder.newColumn("complaint", "Complaint").notSortable(),
            DTColumnBuilder.newColumn("suggestion", "Your Suggestion").notSortable(),
            DTColumnBuilder.newColumn("date", "Complaint Date").notSortable(),
            DTColumnBuilder.newColumn("status", "Complaint Status").notSortable(),
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getcomplaintList",
            type:"GET",
            data: function(d){
                d.id = id;
            },
            dataSrc: function (res) { 
                var log = [];
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse, function(value, key){
                    if (value.status=='Pending') {
                        value.status = '<div class="alert alert-danger">'+value.status+'</div>';
                    }else if (value.status=='Resolved'){
                        value.status = '<div class="alert alert-success">'+value.status+'</div>';
                    }else{
                        value.status = '<div class="alert alert-warning">'+value.status+'</div>';
                    }
                    log.push(value);

                });
                return log;
      		}
        })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
        .withOption('responsive', true);
        
        
}]);

/*For Society Manager*/
socialApp.controller('pendingComplaintList',['$scope', '$http', '$location', '$compile','$route', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder','$routeParams', function ($scope, $http,$location, $compile, $route, $timeout,DTOptionsBuilder,DTColumnBuilder, $routeParams) {

        var residentId = JSON.parse(window.localStorage.getItem('userDetails'));
        var id = residentId.id;
        var block_id = atob($routeParams.blockID);
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Complaint ID").notSortable(),
            DTColumnBuilder.newColumn("subject", "Complaint Subject").notSortable(),
            DTColumnBuilder.newColumn("complaint", "Complaint").notSortable(),
            DTColumnBuilder.newColumn("suggestion", "Your Suggestion").notSortable(),
            DTColumnBuilder.newColumn("date", "Complaint Date").notSortable(),
            //DTColumnBuilder.newColumn("status", "Complaint Status").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getcomplaintList",
            type:"GET",
            data: function(d){
                d.id = id;
                d.block_id = block_id;
                d.status = 0;
            },
            dataSrc: function (res) { 
                var log = [];
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse, function(value, key){
                    if (value.status=='Pending') {
                        value.status = '<div class="alert alert-danger">'+value.status+'</div>';
                    }else if (value.status=='Resolved'){
                        value.status = '<div class="alert alert-success">'+value.status+'</div>';
                    }else{
                        value.status = '<div class="alert alert-warning">'+value.status+'</div>';
                    }
                    log.push(value);

                });
                return log;
            }
        })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
        .withOption('responsive', true)
        .withOption('createdRow', createdRow);;
        
        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="javascript:void(0)" title="Know More"><i class="fa fa-question-circle" aria-hidden="true"></i></a>'
        }
}]);

socialApp.controller('usComplaintList',['$scope', '$http', '$location', '$compile','$route', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder','$routeParams', function ($scope, $http,$location, $compile, $route, $timeout,DTOptionsBuilder,DTColumnBuilder, $routeParams) {

        var residentId = JSON.parse(window.localStorage.getItem('userDetails'));
        var id = residentId.id;
        var block_id = atob($routeParams.blockID);
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Complaint ID").notSortable(),
            DTColumnBuilder.newColumn("subject", "Complaint Subject").notSortable(),
            DTColumnBuilder.newColumn("complaint", "Complaint").notSortable(),
            DTColumnBuilder.newColumn("suggestion", "Your Suggestion").notSortable(),
            DTColumnBuilder.newColumn("date", "Complaint Date").notSortable(),
            //DTColumnBuilder.newColumn("status", "Complaint Status").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getcomplaintList",
            type:"GET",
            data: function(d){
                d.id = id;
                d.block_id = block_id;
                d.status = 1;
            },
            dataSrc: function (res) { 
                var log = [];
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse, function(value, key){
                    if (value.status=='Pending') {
                        value.status = '<div class="alert alert-danger">'+value.status+'</div>';
                    }else if (value.status=='Resolved'){
                        value.status = '<div class="alert alert-success">'+value.status+'</div>';
                    }else{
                        value.status = '<div class="alert alert-warning">'+value.status+'</div>';
                    }
                    log.push(value);

                });
                return log;
            }
        })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
        .withOption('responsive', true)
        .withOption('createdRow', createdRow);;
        
        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="javascript:void(0)" title="Know More"><i class="fa fa-question-circle" aria-hidden="true"></i></a>'
        }
}]);

socialApp.controller('resolvedComplaintList',['$scope', '$http', '$location', '$compile','$route', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder','$routeParams', function ($scope, $http,$location, $compile, $route, $timeout,DTOptionsBuilder,DTColumnBuilder, $routeParams) {

        var residentId = JSON.parse(window.localStorage.getItem('userDetails'));
        var id = residentId.id;
        var block_id = atob($routeParams.blockID);
        $scope.dtColumns = [
            //here We will add .withOption('name','column_name') for send column name to the server 
            DTColumnBuilder.newColumn("id", "Complaint ID").notSortable(),
            DTColumnBuilder.newColumn("subject", "Complaint Subject").notSortable(),
            DTColumnBuilder.newColumn("complaint", "Complaint").notSortable(),
            DTColumnBuilder.newColumn("suggestion", "Your Suggestion").notSortable(),
            DTColumnBuilder.newColumn("date", "Complaint Date").notSortable(),
            //DTColumnBuilder.newColumn("status", "Complaint Status").notSortable(),
            DTColumnBuilder.newColumn(null, "Action").notSortable().renderWith(actionsHtml)
        ]
 
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            contentType: "application/json;",
            url:"/getcomplaintList",
            type:"GET",
            data: function(d){
                d.id = id;
                d.block_id = block_id;
                d.status = 2;
            },
            dataSrc: function (res) { 
                var log = [];
                var generateResponse = JSON.parse(res.success);
                angular.forEach(generateResponse, function(value, key){
                    if (value.status=='Pending') {
                        value.status = '<div class="alert alert-danger">'+value.status+'</div>';
                    }else if (value.status=='Resolved'){
                        value.status = '<div class="alert alert-success">'+value.status+'</div>';
                    }else{
                        value.status = '<div class="alert alert-warning">'+value.status+'</div>';
                    }
                    log.push(value);

                });
                return log;
            }
        })
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withPaginationType('full_numbers') 
        .withDisplayLength(10) // Page size
        .withOption('aaSorting',[0,'asc'])
        .withOption('responsive', true)
        .withOption('createdRow', createdRow);;
        
        function createdRow(row, data, dataIndex) {
        
            $compile(angular.element(row).contents())($scope);
        }
        function actionsHtml(data, type, full, meta) {
            $d = full;
            return '<a href="javascript:void(0)" title="Know More"><i class="fa fa-question-circle" aria-hidden="true"></i></a>'
        }
}]);