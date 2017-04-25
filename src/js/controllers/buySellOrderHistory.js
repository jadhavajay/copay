'use strict';

angular.module('copayApp.controllers').controller('buySellOrderHistoryControllers', function ($scope,$http,ongoingProcess,urlService,$rootScope, $log, $state, $ionicLoading) {
    $scope.data = {};

    // document.addEventListener("resume", onResume, false);

    // callSellOrderHistoryAPI();

    //   function onResume() {
    // // Handle the resume event
    //     callSellOrderHistoryAPI();
    // }
       

    // var callSellOrderHistoryAPI = function()
    // {

        // Resume refresh
        // $rootScope.$on('onResumeCordova', function(event) {

        //     alert('Hello....');

        // });

       ongoingProcess.set('loading', true);

            var userId = localStorage.getItem('userId');
            var res = $http.get(urlService.serverURL+urlService.userOrderAPI+userId+urlService.userOrderAPIOrders);
            console.log(urlService.serverURL+urlService.userOrderAPI+userId+urlService.userOrderAPIOrders);
            res.success(function(data) {
               
                    // console.log("-- token --", JSON.stringify(data));
                   
                    if (data !== null) {

                    $scope.todos= angular.fromJson(data.data);
                  
                    ongoingProcess.clear();            
                }
                else
                {
                  alert("Sorry something went wrong. try again");  
                }
            });
            res.error(function(data, status, headers, config) {
                ongoingProcess.clear();
                alert("Sorry something went wrong. try again");
            });
    // }
    // $scope.todos = [
    //   {
    //     transactionId:'111',
    //     buySell: 'Sell',
    //     amount: '0.50 BTC',
    //     dateTime: '26 Jan 2017 3.00pm',
    //     status:'Pending',
    //     paymentReferance:'111111wdwd22222'
    //   },
    //   {
    //     transactionId:'112',
    //     buySell: 'Buy',
    //     amount: '0.20 BTC',
    //     dateTime: '26 Jan 2017 1.30pm',
    //     status: 'Complete',
    //     paymentReferance:''        
    //   },
    //   {
    //     transactionId:'113',
    //     buySell: 'Buy',
    //     amount: '0.20 BTC',
    //     dateTime: '26 Jan 2017 1.30pm',
    //     status: 'Complete',
    //     paymentReferance:'33wefdef43223'        
    //   },
    //   ];

    $scope.show = function(item)
      {
        console.log(item);
        $rootScope.items = item;
        $state.go('tabs.detailedView');
      }
});
