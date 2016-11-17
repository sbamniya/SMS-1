
/*For Login*/

socialApp.controller('login',['$scope', '$http', '$location', '$compile', function ($scope, $http,$location, $compile) {
		$scope.noError = true;
        
		$scope.loginAction = function(){
			
			$http.post("/login", $scope.admin).success(function(response,status,headers,config){
		            if (response.error) 
		            {
		            	$scope.noError = false;	
		            	$scope.ErrorMessage = response.error;
		            }
		            else
		            {
		            	$location.path("/dashboard");
		            }
        	}); 
		}
}]);

/*For Forget password*/
socialApp.controller('resetPasswordController',['$scope', '$http', function ($scope, $http) {
 	
 $scope.noError = true;  
 $scope.noSuccess = true;
 $scope.resetPassword = function(){
  
   $http.post("/resetPasswordProcess", {email : $scope.useremail}).success(function(response,status,headers,config){
   			   if(response.hasOwnProperty('success'))
                   {   $scope.noSuccess = false;
                        $scope.noError = true;
                       $scope.successMessage = response.success;
                   }
                else
                    {
                        $scope.noSuccess = true;
                        $scope.noError = false;
                        $scope.ErrorMessage = response.error;
                    }
       
         

        });     
 }
		
}]);


/*For password reset*/
socialApp.controller('newPasswordController',['$scope','$http','$location','$routeParams', function ($scope, $http, $location, $routeParams) {
      
      var token =  $routeParams.token;
      var id = $routeParams.id;
      
      $scope.noError = true;  
 	  $scope.noSuccess = true;
     
      $http.post("/confirmToken", {userid:id, token: token}).success(function(response,status,headers,config){
            if (response.error) 
            {
            	$location.path('/404');
            }
            else if(response.hasOwnProperty('succes'))
            {
            	$scope.userid = response.id;
            }
        }); 
     $scope.updatePassword = function(){
         var pass = $scope.userPassword;
         var confirmPass = $scope.confirmPassword;
         var id = $scope.userid;
         
         if(pass==''){
             $scope.noError = false;
             $scope.ErrorMessage = 'Please Enter New  Password';
         }else if(pass != confirmPass){
             $scope.noError = false;
             $scope.ErrorMessage = 'Please Enter Same Password';
         }else{
             $http.post('/updatePassword', {id:id, pass:pass}).success(function(response,status,headers,config){
                if (response.error) 
                {
                    $scope.noError = false;
                    $scope.noSuccess = true;
                    $scope.ErrorMessage = response.error;
                }
                else if(response.hasOwnProperty('succes'))
                {
                    $scope.noSuccess = false;
                    $scope.noError = true;
                    $scope.successMessage = "Password Changed Successfully.";
                }
             });
         }
     };
}]);


socialApp.controller('residentLogin', ['$scope','$http','$location', function($scope, $http, $location){
        $scope.forget_url = "resident-reset-password";
        $scope.titleContent = " Enter Your Username and Password to log on:";
        $scope.userPlaceholder = "Username...";
        $scope.noError = true;
        $http.get("/authentication/resident").success(function(response,status,headers,config){
             if(response.status =='success'){
                $location.path("/select-block");
             }else{
                
             }
        });
        $scope.loginAction = function(){
            
            $http.post("/resident-login", $scope.user).success(function(response,status,headers,config){
                    if (response.error) 
                    {
                        $scope.noError = false; 
                        $scope.ErrorMessage = response.error;
                    }
                    else
                    {
                        $location.path("/resident-dashboard");
                    }
            }); 
        }
}]);

/*For Forget password For reseident*/
socialApp.controller('residentRessetPassword',['$scope', '$http', function ($scope, $http) {
    
    $scope.login_url = "resident-login";
    
    $scope.noError = true;  
    $scope.noSuccess = true;

    $scope.resetPassword = function(){

        $http.post("/resident-resetPasswordProcess", {email : $scope.useremail}).success(function(response,status,headers,config){
          
            if(response.hasOwnProperty('success')){

                $scope.noSuccess = false;
                $scope.noError = true;
                $scope.successMessage = response.success;
            
            }else{
                
                $scope.noSuccess = true;
                $scope.noError = false;
                $scope.ErrorMessage = response.error;
            }
        });     
    }
}]);


/*For password reset*/
/*socialApp.controller('residentChangePassword',['$scope','$http','$location','$routeParams', function ($scope, $http, $location, $routeParams) {
      $scope.login_url = "resident-login";
      var token =  $routeParams.token;
      var id = $routeParams.id;
      
      $scope.noError = true;
      $scope.noSuccess = true;
     
      $http.post("/resident-confirmToken", {userid:id, token: token}).success(function(response,status,headers,config){
            if (response.error) 
            {
                $location.path('/');
            }
            else if(response.hasOwnProperty('succes'))
            {
                $scope.userid = response.id;
            }
        }); 
      
$scope.updatePassword = function(){

            var pass = $scope.userPassword;
            var confirmPass = $scope.confirmPassword;
            var id = $scope.userid;
            

            if(pass==''){
                
                $scope.noError = false;
                $scope.ErrorMessage = 'Please Enter New  Password';

            }else if(pass != confirmPass){
                
                $scope.noError = false;
                $scope.ErrorMessage = 'Please Enter Same Password';
            
            }else{
                
                $http.post('/resident-updatePassword', {id:id, pass:pass}).success(function(response,status,headers,config){
                    if (response.error) 
                    {
                        $scope.noError = false;
                        $scope.noSuccess = true;
                        $scope.ErrorMessage = response.error;
                    }
                    else if(response.hasOwnProperty('succes'))
                    {
                        $scope.noSuccess = false;
                        $scope.noError = true;
                        $scope.successMessage = "Password Changed Successfully.";
                    }
                });
            }
        };
}]);*/

