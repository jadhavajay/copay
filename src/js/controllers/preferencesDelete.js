'use strict';

angular.module('copayApp.controllers').controller('preferencesDeleteWalletController',
  function($scope, $ionicHistory, gettextCatalog, urlService,lodash,$http, profileService, $state, ongoingProcess, popupService, pushNotificationsService) {
    
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      if (!data.stateParams || !data.stateParams.walletId) {
        popupService.showAlert(null, gettextCatalog.getString('No wallet selected'), function() {
          $ionicHistory.goBack();
        });
        return;
      }
      $scope.wallet = profileService.getWallet(data.stateParams.walletId);
      if (!$scope.wallet) {
        popupService.showAlert(null, gettextCatalog.getString('No wallet found'), function() {
          $ionicHistory.goBack();
        });
        return;
      }
      $scope.alias = lodash.isEqual($scope.wallet.name, $scope.wallet.credentials.walletName) ? null : $scope.wallet.name + ' ';
      $scope.walletName = $scope.wallet.credentials.walletName;
    });

    $scope.showDeletePopup = function() {
      var title = gettextCatalog.getString('Warning!');
      var message = gettextCatalog.getString('Are you sure you want to delete this wallet?');
      popupService.showConfirm(title, message, null, null, function(res) {
        if (res) deleteWallet();
      });
    };

    function deleteWallet() {
      ongoingProcess.set('deletingWallet', true);
      profileService.deleteWalletClient($scope.wallet, function(err) {
        ongoingProcess.set('deletingWallet', false);
        if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err.message || err);
        } else {

          deleteWalletFromServer($scope.wallet.credentials.walletId);
          pushNotificationsService.unsubscribe($scope.wallet);
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            historyRoot: true
          });
          $ionicHistory.clearHistory();
          $state.go('tabs.settings').then(function() {
            $state.transitionTo('tabs.home');
          });
        }
      });
    };

    // call delete wallet API

    function deleteWalletFromServer(walletId)
    {
       var userId = localStorage.getItem('userId');
                if (userId) {

                    ongoingProcess.set('loading', true);

                    console.log("userId:", localStorage.getItem("userId"));
                    console.log("walletId:", walletId);

                    var data =
                        {
                            userId: localStorage.getItem("userId"),
                            walletId:walletId,                                          
                        };

                    var res = $http.post(urlService.serverURL + urlService.deleteMapWallet, data);
                    res.success(function (data, status, headers, config) {

                        console.log("-- data --", data);
                        console.log("-- status --", data.status);

                        if (data.status == 200) {

                            ongoingProcess.clear();

                        } else {
                            ongoingProcess.clear();
                            console.log("-- status --", data.status);
                            console.log("-- token --", data.message);
                        }
                    });
                    res.error(function (data, status, headers, config) {
                        ongoingProcess.clear();
                    });

                }
    }


  });
