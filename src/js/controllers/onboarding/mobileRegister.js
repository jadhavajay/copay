'use strict';

angular.module('copayApp.controllers').controller('mobileControllers', function (urlService, ongoingProcess, $http, $scope, $log, $rootScope, $state, $stateParams) {
    $scope.data = {};

    var MOBILE_REGXP = /^[7-9][0-9]{9}$/;
    var sessionId = '';
    $scope.errorMessage = false;
    $scope.showOTPEditText = false;
    $scope.reSendOtpLink = false;
    $scope.otpButton = "Submit";
    $scope.mobileNext = function () {
        $scope.truefalse = false;
        var contact = $scope.data.contact;
        $rootScope.contact = contact;
        if (!MOBILE_REGXP.test(contact)) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter a valid mobile number';
        }
        else if (contact.length < 10) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter 10 digit valid number';
        }
        else if (contact == undefined) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter mobile number';
        }
        else {

            if ($scope.otpButton == 'Submit') {
                ongoingProcess.set('loading', true);

                var data =
                    {


                        mobile: $scope.data.contact

                    };

                var res = $http.post(urlService.serverURL + urlService.mobileExistAPI, data);
                res.success(function (data, status, headers, config) {
                    console.log("-- data --", data);
                    console.log("-- status --", data.status);

                    if (data.status == 200) {
                        ongoingProcess.clear();
                        generateOTP();

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
            else if ($scope.otpButton == 'Verify') {
                ongoingProcess.set('loading', true);

                console.log("sessionId=" + sessionId + $scope.data.otp + $scope.data.contact);
                var data =
                    {
                        sessionId: sessionId,
                        otp: $scope.data.otp,
                        mobile: $scope.data.contact
                    };

                var res = $http.post(urlService.serverURL + urlService.verifyOTPAPI, data);
                res.success(function (data, status, headers, config) {
                    console.log("-- data --", data);
                    console.log("-- status --", data.status);

                    if (data.status == 200) {
                        ongoingProcess.clear();
                        $state.go('onboarding.nameRegister');
                        $scope.data.contact = "";
                        $scope.data.otp = "";
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

    }



    var generateOTP = function () {
        ongoingProcess.set('loading', true);

        var data =
            {
                mobile: $scope.data.contact
            };

        var res = $http.post(urlService.serverURL + urlService.generateOTPAPI, data);
        res.success(function (data, status, headers, config) {
            console.log("-- data --", data);
            console.log("-- status --", data.status);

            if (data.status == 200) {
                sessionId = data.sessionId;
                $scope.showOTPEditText = true;
                $scope.truefalse = true;
                $scope.errorMessage = false;
                $scope.otpButton = "Verify";
                $scope.reSendOtpLink = true;
                $scope.style = {
                    "color": "#cc9400",
                    "text-decoration": "underline",
                    "font-size": "15px",
                    "margin-right": "10%"
                }
                ongoingProcess.clear();
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

    $scope.resendOTP = function () {
        $scope.reSendOtpLink = false;
        var MOBILE_REGXP = /^[7-9][0-9]{9}$/;
        var sessionId = '';
        $scope.errorMessage = false;
        $scope.showOTPEditText = false;
        $scope.truefalse = false;
        $scope.data.otp = "";
        $scope.otpButton = "Submit";
    }

    $scope.Back = function () {
        $state.go('onboarding.emailRegister');

    }
});