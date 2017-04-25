'use strict';

angular.module('copayApp.controllers').controller('loginControllers', function(urlService,$scope,openURLService,$timeout,ongoingProcess, $log, $http, $state, storageService, $ionicLoading,
profileService,scannerService,$ionicHistory,lodash) {
    $scope.data = {};

    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    $scope.errorMessage = false;

    $scope.signup = function()
    {
         profileService.loadAndBindProfile(function (err) 
    {

      if (lodash.isEmpty(profileService.getWallets())) 
      {                      

        $state.go('onboarding.welcome');
      }
      else 
      {                              
        $state.go('tabs.home');
      }
    });      
    }




    $scope.login = function() {

        

        if ($scope.data.userName == undefined) 
        {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter email address';
        }
        else if ($scope.data.password == undefined) {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter password';
        }
        else if (!EMAIL_REGEXP.test($scope.data.userName)) 
        {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'Please enter a valid email address';
        }
        else if(localStorage.getItem("userEmail") != undefined && $scope.data.userName != localStorage.getItem("userEmail"))
        {
            $scope.errorMessage = true;
            $scope.validationErrorLabel = 'You must be login with '+ localStorage.getItem("userEmail");
        }
        else
         {
            ongoingProcess.set('loading', true);

            var data = {
                email: $scope.data.userName,
                password: $scope.data.password
            };

            console.log("-- email --", $scope.data.userName);
            console.log("-- password --", $scope.data.password);

            var res = $http.post(urlService.serverURL+urlService.loginAPI, data);
            res.success(function(data, status, headers, config) {
               
                console.log("-- data --", data);
                console.log("-- status --", data.status);

                if (data.status == 200) {
                    console.log("-- status --", data.status);
                    console.log("-- token --", data.message);
                    console.log("-- id --", data.profile.id);
                    console.log("-- firstName --", data.firstName);
                    console.log("-- lastName --", data.lastName);
                    console.log("-- email --", data.profile.email);
                    console.log("-- mobile --", data.profile.mobile);
                    console.log("-- token --", data.token);
                    console.log("-- isEmailVerified --", data.profile.isEmailVerified);
                    console.log("-- isContactVerified --", data.profile.isContactVerified);

                    if (data == null) {
                        $state.go('tabs.home');
                    }
                   
                    localStorage.setItem("userId", data.profile.id);
                    localStorage.setItem("userEmail", data.profile.email);
                    localStorage.setItem("userMobile", data.profile.mobile);
                    localStorage.setItem("userFirstName", data.profile.firstName);
                    localStorage.setItem("userLastName", data.profile.lastName);
                    localStorage.setItem("userToken", data.token);
                    localStorage.setItem("isEmailVerified", data.profile.isEmailVerified);
                    localStorage.setItem("isContactVerified", data.profile.isContactVerified);


                    ongoingProcess.clear();

                    // Try to open local profile
                    profileService.loadAndBindProfile(function (err) {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true
                        });
                        if (err) {
                            if (err.message && err.message.match('NOPROFILE')) 
                            {
                                $log.debug('No profile... redirecting');
                                console.log("-- status NOPROFILE");
                                $state.go('onboarding.welcome');
                            } 
                            else if (err.message && err.message.match('NONAGREEDDISCLAIMER')) 
                            {
                                if (lodash.isEmpty(profileService.getWallets())) 
                                {
                                    console.log("-- status NONAGREEDDISCLAIMER");
                                    $log.debug('No wallets and no disclaimer... redirecting');
                                    $state.go('onboarding.welcome');
                                } else 
                                {
                                    $log.debug('Display disclaimer... redirecting');
                                    $state.go('onboarding.disclaimer', {
                                        resume: true
                                    });
                                }
                            } else {
                                throw new Error(err); // TODO
                            }
                        } else {
                            profileService.storeProfileIfDirty();
                            $log.debug('Profile loaded ... Starting UX.');
                            scannerService.gentleInitialize();
                            $state.go('tabs.home');
                        }

                        // After everything have been loaded, initialize handler URL
                        $timeout(function () {
                            openURLService.init();
                        }, 1000);
                    });

                } else {
                    ongoingProcess.clear();
                    console.log("-- status --", data.status);
                    console.log("-- token --", data.message);
                    alert("" + data.message);
                }
            });
            res.error(function(data, status, headers, config) {
                ongoingProcess.clear();
                alert("Sorry something went wrong. try again");
            });
        }

    }
});