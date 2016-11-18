/*Admin Header*/
socialApp.directive('header', ['$compile','$http','$location','$route', function ($compile, $http,$location,$route) {
    return {
        restrict: 'E',
        templateUrl: 'admin/admin-panel/html/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
             scope.headerOption = false;
            $http.get("/authentication/admin").success(function(response,status,headers,config){
                 if(response.status =='success'){

                 }else{
                    $location.path("/admin-login");
                 }
            }); 
            var i = 1;
            scope.openModel = function(){
                if (i%2==1) {
                    angular.element('.dropdown-menu').css('display', 'block');
                }else{
                    angular.element('.dropdown-menu').css('display', 'none');
                }
                i++;
            }
            scope.logOut = function() {

                $http.get("/logout", {logout: 'admin'}).success(function(response,status,headers,config){
                     $location.path("/admin-login");
                }); 
            };
        }
    }
}]);

/*Society manager Header*/
socialApp.directive('societyHeader', ['$compile','$http','$location','$routeParams','$route', function ($compile, $http,$location, $routeParams, $route) {
    return {
        restrict: 'C',
        templateUrl: 'society/html/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
                scope.headerOption = false;
                scope.isSocietyManager = false;
                scope.activetab = $route.current.activetab;
                scope.isUpdated = true;

                var id = window.atob($routeParams.blockID);
                scope.manageDetail = window.localStorage.getItem('manageDetail');
                scope.userDetail = JSON.parse(window.localStorage.getItem('userDetails'));
                $http.get("/authentication/societyManager").success(function(response,status,headers,config){
                     if(response.status =='success'){

                     }else{
                        $location.path("/society-manager-login");
                     }
                });
                
                $http.post("/checkForSocietyManager").success(function(response,status,headers,config){
                     if(response.is_societymanager ==1){
                        scope.isSocietyManager = true;
                     }else{
                        
                     }
                });
                $http.post('/getSingleBlock', {id: id}).success(function(response){

                    if(response.success){

                        scope.parent_id = window.btoa(response.success.parent_id);
                        scope.id = window.btoa(response.success.id);
                        scope.societyLogo = response.success.logo;
                        /*if (response.success.is_updated==1) {
                            scope.isUpdated = false;
                        }*/

                    }else{

                        $location.path('/404');

                    }
                });
                var i = 1;
                scope.openModel = function(){
                    if (i%2==1) {
                        angular.element('.dropdown-menu').css('display', 'block');
                    }else{
                        angular.element('.dropdown-menu').css('display', 'none');
                    }
                    i++;
                }
                scope.logOut = function() {

                        $http.get("/logout", {logout: 'societyManager'}).success(function(response,status,headers,config){
                            window.localStorage.removeItem('manageDetail');
                            window.localStorage.removeItem('userDetails');
                            $location.path("/society-manager-login");
                     }); 
                };

        }
    }
}]);
/*Society manager Header*/
socialApp.directive('man2helpForm', ['$compile','$http','$location', function ($compile, $http,$location) {
    return {
        restrict: 'C',
        templateUrl: 'front/html/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
                scope.man2help = true;
                scope.man2helpFormClose = function(){
                    scope.man2help = false;
                }
        }
    }
}]);
/*Man2Help Header*/
socialApp.directive('man2helpHeader', ['$compile','$http','$location', function ($compile, $http,$location) {
    return {
        restrict: 'C',
        templateUrl: 'man2help/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
        }
    }
}]);

/*Resident Header*/
socialApp.directive('residentheader', ['$compile','$http','$location','$routeParams','$route', function ($compile, $http,$location, $routeParams, $route) {
    return {
        restrict: 'E',
        templateUrl: 'resident/html/header.html',
        transclude:true,
        link: function(scope, element, attrs) {
                scope.activetab = $route.current.activetab;
                scope.userDetail = JSON.parse(window.localStorage.getItem('userDetails'));
                if (scope.userDetail.first_name=='' && scope.userDetail.last_name=='') {
                    scope.userDetail.fullName = scope.userDetail.email;
                }else{
                    scope.userDetail.fullName = scope.userDetail.first_name+' '+scope.userDetail.last_name;
                }
                
                $http.get("/authentication/Resident").success(function(response,status,headers,config){
                     if(response.status =='success'){

                     }else{
                        $location.path("/resident-login");
                     }
                });
                var i = 1;
                scope.openModel = function(){
                    if (i%2==1) {
                        angular.element('.dropdown-menu').css('display', 'block');
                    }else{
                        angular.element('.dropdown-menu').css('display', 'none');
                    }
                    i++;
                }
                scope.logOut = function() {

                        $http.get("/logout", {logout: 'resident'}).success(function(response,status,headers,config){
                            window.localStorage.removeItem('userDetails');
                            $location.path("/resident-login");
                     }); 
                };

        }
    }
}]);