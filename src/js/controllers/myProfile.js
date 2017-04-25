'use strict';

angular.module('copayApp.controllers').controller('myProfileControllers', function($scope, urlService, $log, $http, $state, storageService, $ionicLoading,ongoingProcess) {
    $scope.data = {};

    //  var userId = localStorage.getItem('userId');
    //  $scope.userId = userId;
    $scope.isDisabled = false;
    var userEmail = 
    $scope.userEmail = userEmail;

    $scope.userFirstName = localStorage.getItem('userFirstName');
    $scope.userLastName = localStorage.getItem('userLastName');

    var userFullName = $scope.userFirstName + ' ' + $scope.userLastName;
    $scope.userFullName = userFullName;

    var userMobile = localStorage.getItem('userMobile');
    $scope.userMobile = userMobile;

    var isContactVerified = localStorage.getItem('isContactVerified');

    var isEmailVerified = localStorage.getItem('isEmailVerified');
    // $scope.isEmailVerified = isEmailVerified;

    if (isEmailVerified == "false") {
        $scope.isEmailVerified = 'Verify Now';
        $scope.color = {
            "color": "Red",
            "text-decoration": "underline",
            "font-size": "15px"
        }

    } else {
        $scope.isEmailVerified = 'Verified';
        $scope.isDisabled = false;
        $scope.color = {
            "color": "Green",
            "font-size": "15px"
        }
    }

    if (isContactVerified == "false") {
        $scope.isContactVerified = 'Verify Now';
        $scope.style = {
            "color": "Red",
            "text-decoration": "underline",
            "font-size": "15px"
        }
    } else {
        $scope.isContactVerified = 'Verified';
        $scope.style = {
            "color": "Green",
            "font-size": "15px"
        }
    }
    // var userToken = localStorage.getItem('userToken');
    // $scope.userToken = userToken;

    console.log(" __[myProfile.js]___ Variable ____ userEmail: " + JSON.stringify(userEmail));
    console.log(" __[myProfile.js]___ Variable ____ userFullName: " + JSON.stringify(userFullName));
    console.log(" __[myProfile.js]___ Variable ____ userMobile: " + JSON.stringify(userMobile));

    $scope.sendEmail = function()
    {
        console.log(localStorage.getItem('isEmailVerified'));
        console.log(isEmailVerified);

        if (isEmailVerified == "false")
        {

         ongoingProcess.set('loading', true);

            var data =
                {

                    email: localStorage.getItem('userEmail')
                };

            var res = $http.post(urlService.serverURL + urlService.sendVerifyEmail, data);
            res.success(function (data, status, headers, config) {

                if (data.status == 200) {
                    ongoingProcess.clear();
                    alert(data.msg);
                   
                }
                else {
                    ongoingProcess.clear();
                    alert(data.msg);
                }

            });
            res.error(function (data, status, headers, config) {
                ongoingProcess.clear();
                alert("Sorry something went wrong. try again");
            });
        }
       

    }

});