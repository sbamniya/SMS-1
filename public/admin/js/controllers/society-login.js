/*For Login*/

socialApp.controller('societyLogin',['$scope', '$http', '$location', '$compile', function ($scope, $http,$location, $compile) {
		$scope.forget_url = "manager-reset-password";
        $scope.titleContent = " Enter your Email and Password to log on:";
        $scope.userPlaceholder = "Email...";
        $scope.noError = true;
		$http.get("/authentication/societyManager").success(function(response,status,headers,config){
             if(response.status =='success'){
             	$location.path("/select-block");
             }else{
                
             }
        });
		$scope.loginAction = function(){
			
			$http.post("/society-login", $scope.user).success(function(response,status,headers,config){
		            if (response.error) 
		            {
		            	$scope.noError = false;	
		            	$scope.ErrorMessage = response.error;
		            }
		            else
		            {
                        window.localStorage.setItem('userDetails', JSON.stringify(response.success));
		            	$location.path("/select-block");
		            }
        	}); 
		}
}]);

/*For Forget password*/
socialApp.controller('societyResetPasswordController',['$scope', '$http', function ($scope, $http) {
    
    $scope.login_url = "society-manager-login";
    $scope.noError = true;  
    $scope.noSuccess = true;

    $scope.resetPassword = function(){

        $http.post("/society-resetPasswordProcess", {email : $scope.useremail}).success(function(response,status,headers,config){
		  
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
socialApp.controller('society-newPasswordController',['$scope','$http','$location','$routeParams', function ($scope, $http, $location, $routeParams) {
      $scope.login_url = "society-manager-login";
      var token =  $routeParams.token;
      var id = $routeParams.id;
      
      $scope.noError = true;
      $scope.noSuccess = true;
     
      $http.post("/society-confirmToken", {userid:id, token: token}).success(function(response,status,headers,config){
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
                
                $http.post('/societyManager-updatePassword', {id:id, pass:pass}).success(function(response,status,headers,config){
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


/*For Change Password*/

socialApp.controller('changePassword',['$scope', '$http', '$location', '$compile', function ($scope, $http,$location, $compile) {
        
        $scope.noError = true;
        $scope.noSuccess = true;

        $scope.updatePassword = function(){

            var pass = $scope.user.newPassword;
            var confirmPass = $scope.user.confirmNewPassword;
            
            if(pass==''){
                
                $scope.noError = false;
                $scope.ErrorMessage = 'Please Enter New  Password';

            }else if(pass != confirmPass){
                
                $scope.noError = false;
                $scope.ErrorMessage = 'Please Enter Same Password';
            
            }else{
                
                $http.post('/society-updatePassword', {pass:pass}).success(function(response,status,headers,config){
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