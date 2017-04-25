'use strict';

angular.module('copayApp.controllers').controller('tabSettingsController', function ($rootScope,$state,$ionicHistory,$http, $timeout, $scope, appConfigService, $ionicModal, $log, lodash, uxLanguage, platformInfo, profileService, feeService, configService, externalLinkService, bitpayAccountService, bitpayCardService, storageService, glideraService, gettextCatalog,popupService,ongoingProcess,urlService, buyAndSellService) {


    // Hide Myprofile and Logout tag start
      var userId = localStorage.getItem('userId');
      if (userId) {
        $scope.showProfile = true;
        $scope.userLogout = true;
      }
      else {
        $scope.showProfile = false;
        $scope.userLogout = false;
      }

    // Hide Myprofile and Logout tag End


  var updateConfig = function () {
    $scope.currentLanguageName = uxLanguage.getCurrentLanguageName();
    $scope.feeOpts = feeService.feeOpts;
    $scope.currentFeeLevel = feeService.getCurrentFeeLevel();
    $scope.wallets = profileService.getWallets();
    $scope.buyAndSellServices = buyAndSellService.getLinked();

    configService.whenAvailable(function (config) {
      $scope.unitName = config.wallet.settings.unitName;
      $scope.selectedAlternative = {
        name: config.wallet.settings.alternativeName,
        isoCode: config.wallet.settings.alternativeIsoCode
      };

      // TODO move this to a generic service
      bitpayAccountService.getAccounts(function (err, data) {
        if (err) $log.error(err);
        $scope.bitpayAccounts = !lodash.isEmpty(data);

        $timeout(function () {
          $rootScope.$apply();
        }, 10);
      });

      // TODO move this to a generic service
      bitpayCardService.getCards(function (err, cards) {
        if (err) $log.error(err);
        $scope.bitpayCards = cards && cards.length > 0;

        $timeout(function () {
          $rootScope.$apply();
        }, 10);
      });
    });
  };

  $scope.openExternalLink = function () {
    var appName = appConfigService.name;
    var url = appName == 'copay' ? 'https://github.com/bitpay/copay/issues' : 'https://help.bitpay.com/bitpay-app';
    var optIn = true;
    var title = null;
    var message = gettextCatalog.getString('Help and support information is available at the website.');
    var okText = gettextCatalog.getString('Open');
    var cancelText = gettextCatalog.getString('Go Back');
    externalLinkService.open(url, optIn, title, message, okText, cancelText);
  };

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isCordova = platformInfo.isCordova;
    $scope.isDevel = platformInfo.isDevel;
    $scope.appName = appConfigService.nameCase;
    configService.whenAvailable(function (config) {
      $scope.locked = config.lock && config.lock.method != '' ? true : false;
      $scope.method = config.lock && config.lock.method != '' ? config.lock.method.charAt(0).toUpperCase() + config.lock.method.slice(1) : gettextCatalog.getString('Disabled');
    });
  });

  $scope.$on("$ionicView.enter", function (event, data) {
    updateConfig();
  });


  // Logout Method start
  $scope.logout = function () {
    var title = gettextCatalog.getString('Logout');
    var message = gettextCatalog.getString('Are you sure you want to logout?');
    var okText = gettextCatalog.getString('Yes');
    var cancelText = gettextCatalog.getString('No');
    popupService.showConfirm(title, message, okText, cancelText, function (val) {
      if (val) {


        userLogout();
      }
    });

  }

  var userLogout = function () {
    ongoingProcess.set('loading', true);

    var res = $http.get(urlService.serverURL + urlService.logoutAPI);
    res.success(function (data, status, headers, config) {

      console.log("-- data --", data);
      console.log("-- status --", data.status);

      if (data.status == 200) {
        console.log("-- status --", data.status);

        localStorage.removeItem("userId");
        localStorage.removeItem("userMobile");
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userLastName");
        localStorage.removeItem("userToken");
        localStorage.removeItem("isEmailVerified");
        localStorage.removeItem("isContactVerified");

        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        
        ongoingProcess.clear();

        $state.go('onboarding.landing');
      } else {
        ongoingProcess.clear();
        console.log("-- status --", data.status);
        console.log("-- token --", data.message);
        alert("" + data.message);
      }
    });
    res.error(function (data, status, headers, config) {
      ongoingProcess.clear();
      alert("Sorry something went wrong. try again");
    });
  }
  // Logout Method End


});
