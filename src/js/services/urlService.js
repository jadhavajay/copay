'use strict';

angular.module('copayApp.services').factory('urlService', function() {

    var root = {};


    root.serverURL = 'https://coinsri.com/api/';
    root.loginAPI = 'login';
    root.emailExistAPI = 'signup/email-exist';
    root.generateOTPAPI = 'generateOTPAPI';
    root.mobileExistAPI = 'signup/mobile-exist';
    root.signupAPI = 'signup';
    root.mapWallet = 'map-wallet';
    root.deleteWallet = 'delete-wallet';
    root.verifyOTPAPI = 'verifyOTPAPI';
    root.sendVerifyEmail = 'send-verify-email';
    root.logoutAPI = 'logout';
    root.userOrderAPI = 'user/';
    root.userOrderAPIOrders = '/orders';
    root.userOrderTransrefAPI = 'transref';
    root.getRateAPI = 'get-rate';
    return root;

});
