socialApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(fields, uploadUrl, file){

        fd.append('file', file);
        for(var i = 0; i < fields.length; i++){
            fd.append(fields[i].name, fields[i].data)
        }

        
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);