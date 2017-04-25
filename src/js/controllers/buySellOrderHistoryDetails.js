'use strict';

angular.module('copayApp.controllers').controller('buySellOrderHistoryDetails', function($state,urlService, $http, $log, ongoingProcess, $ionicModal, $rootScope, $scope) {
    $scope.data = {};


    var data = $rootScope.items;
    console.log(data);


    $scope.transactionId = data._id;
    $scope.buySell = data.orderType;
    var buySell = data.orderType;
    $scope.amount = data.btcQty;
    $scope.INRAmount = data.inrAmount;
    $scope.dateTime = data.createdAt;
    $scope.status = data.orderStatus;
    $scope.paymentReferance = data.orderProcessing.transactionRefNo;

    if ($scope.buySell === 'Buy') {
        $scope.addPaymentReference = 'Add Payment Reference';
        $scope.paymentReferanceListView = 'Payment Reference';
    }
    else {
        $scope.addPaymentReference = 'Add Transaction Id';
        $scope.paymentReferanceListView = 'Transaction Id';
    }

    if ($scope.paymentReferance === '' || $scope.paymentReferance === 'YTR') {
        $scope.paymentReferanceButton = true;
        $scope.showPaymentReferanceText = false;
    }
    else {
        $scope.paymentReferanceButton = false;
        $scope.showPaymentReferanceText = true;
    }

    $scope.openPopup = function() {
        $ionicModal.fromTemplateUrl('views/includes/paymentReference.html',
            {
                scope: $scope,
                backdropClickToClose: true,
                hardwareBackButtonClose: true,
            }).then(function(modal) {
                if (buySell == 'Buy') {
                    $scope.dialogBoxTitle = 'Add Payment Reference';
                }
                else {
                    $scope.dialogBoxTitle = 'Add Transaction Id';
                }
                $scope.warningModal = modal;
                $scope.warningModal.show();

                $scope.close = function() {
                    var paymentReference = $scope.data.paymentReference;

                    if (paymentReference === '') {

                    }
                    else {
                        // alert("blacnk not");
                        ongoingProcess.set('loading', true);

                        var data =
                            {
                                orderId: $scope.transactionId,
                                transRefNo: $scope.data.paymentReference

                            };

                        var res = $http.post(urlService.serverURL + urlService.userOrderTransrefAPI, data);
                        res.success(function(data, status, headers, config) {

                            if (data.status == 200) {
                                ongoingProcess.clear();
                                $scope.showPaymentReferanceText = true;
                                $scope.paymentReferance = paymentReference;
                                $scope.paymentReferanceButton = false;
                                alert("Thank You ! your reference id updated successfully");
                                $state.go('buySellOrderHistory');
                            }
                            else {
                                ongoingProcess.clear();
                                alert(data.message);
                            }

                        });
                        res.error(function(data, status, headers, config) {
                            ongoingProcess.clear();
                            alert("Sorry something went wrong. try again");
                        });
                        // $scope.showPaymentReferanceText = false;
                        // $scope.paymentReferanceButton = true;

                    }
                    $scope.warningModal.hide();
                    $scope.data.paymentReference = '';

                }
            });
    }

});