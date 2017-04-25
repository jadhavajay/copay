'use strict';

angular.module('copayApp.controllers').controller('demoControllers', function (urlService, $scope, $rootScope, $log, $state, ongoingProcess, $http) {
    $scope.data = {};

    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    $scope.demoNext = function () {


        var email = $scope.data.email;
        var password = $scope.data.password;
        var confirmPassword = $scope.data.confirmpassword;
        var referalCode = $scope.data.referralcode;

        $scope.errorMessage = false;
        $rootScope.mail = email;
        $rootScope.password = password;
        $rootScope.referalCode = referalCode;

        if (email == undefined) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter email address';
        }
        else if (password == undefined) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter password';
        }
        else if (confirmPassword == undefined) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please confirm your password';
        }
        else if (password != confirmPassword) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Password did not matched';
        }
        else if (!EMAIL_REGEXP.test(email)) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter a valid email address';
        }
        else {

            ongoingProcess.set('loading', true);

            var data =
                {
                    email: $scope.data.email
                };

            var res = $http.post(urlService.serverURL + urlService.emailExistAPI, data);
            res.success(function (data, status, headers, config) {

                if (data.status == 200) {
                    ongoingProcess.clear();
                    $state.go('onboarding.mobileRegister');
                    $scope.data.email = "";
                    $scope.data.password = "";
                    $scope.data.confirmpassword = "";
                    $scope.data.referralcode = "";
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
        }

    }
    $scope.goBack = function () {
        $state.go('onboarding.landing');

    }
});