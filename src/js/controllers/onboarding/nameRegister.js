'use strict';

angular.module('copayApp.controllers').controller('nameControllers', function (urlService,$scope, $ionicHistory, $http, ongoingProcess, $rootScope, $log, $state) {
    $scope.data = {};

    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var MOBILE_REGXP = /^[7-9][0-9]{9}$/;
    $scope.errorMessage=false;
    $scope.nameEntry = function () {
        var firstName = $scope.data.firstName;
        var lastName = $scope.data.lastName;
        var email = $rootScope.mail;
        var mobile = $rootScope.contact;
        var password = $rootScope.password;
        var referalCode = $rootScope.referalCode;
        
        // alert("Yay! " + $rootScope.mail);
        // alert("Yay! " + $rootScope.password);
        // alert("Yay! " + $rootScope.contact);
        // alert("Yay! " + firstName);
        // alert("Yay! " + lastName);

        if (firstName == undefined) {
            $scope.errorMessage=true;
            $scope.validationErrorLabel = 'Please enter frist name';

        }
        else if (lastName == undefined) {
            $scope.errorMessage=true;
            $scope.validationErrorLabel = 'Please enter last name';

        }
        else {

            ongoingProcess.set('loading', true);


            console.log("data = " + email + mobile + password + firstName + lastName + referalCode);
            var data =
                {
                    email: email,
                    mobile: mobile,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    referralCode: referalCode
                };

            var res = $http.post(urlService.serverURL+urlService.signupAPI, data);
            res.success(function (data, status, headers, config) {
                console.log("-- data --", data);
                console.log("-- status --", data.status);

                if (data.status == 200) {
                    ongoingProcess.clear();
                    alert(data.message);
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                    $state.go('onboarding.landing');
                    $scope.data.firstName = "";
                    $scope.data.lastName = "";
                }
                else {
                    ongoingProcess.clear();
                    alert(data.message);
                }

            });
            res.error(function (data, status, headers, config) {
                ongoingProcess.clear();
                alert("Sorry something went wrong. try again");
            });

            // $state.go('onboarding.landing');
        }
    }
    $scope.Back = function() {
     $state.go('onboarding.mobileRegister');
        
    }
});