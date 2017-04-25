'use strict';

angular.module('copayApp.services').factory('mapCoinSriWallet', function ($http,walletService,ongoingProcess,urlService) {

    var root = {};
    root.mapCoinSriWalletAPI = function(wallet,typeCall) {

            var callType ;
            walletService.getAddress(wallet, false, function (err, addr) {

                console.log("ADDress - ", addr);

                var userId = localStorage.getItem('userId');
                if (userId) {

                    ongoingProcess.set('loading', true);

                    var copayersId = [];

                    copayersId.push(wallet.credentials.copayerId);

                    console.log("-- data --", localStorage.getItem("userId"));
                    console.log("-- status --", copayersId);

                    console.log("userId:", localStorage.getItem("userId"));
                    console.log("walletId:", wallet.credentials.walletId);
                    console.log("email:", localStorage.getItem("userEmail"));
                    console.log("walletName:", wallet.credentials.walletName);
                    console.log("xPubKey:", wallet.credentials.xPubKey);
                    console.log("address:", addr);
                    console.log("network:", wallet.credentials.network);
                    console.log("n:", wallet.credentials.n);
                    console.log("m:", wallet.credentials.m);
                    console.log("copayers:", copayersId);

                    if(typeCall == '1')
                    {
                        console.log("event:CREATED");
                        callType = 'CREATED'
                    }
                    else if (typeCall == '2')
                    {
                        console.log("event:IMPORTED");
                        callType = 'IMPORTED'
                    }                    

                    console.log("callType:", callType);
                    var walletId = wallet.credentials.walletId;

                    var data =
                        {
                            userId: localStorage.getItem("userId"),
                            walletId: wallet.credentials.walletId,
                            email: localStorage.getItem("userEmail"),
                            walletName: wallet.credentials.walletName,
                            xPubKey: wallet.credentials.xPubKey,
                            address: addr,
                            network: wallet.credentials.network,
                            m: wallet.credentials.m,
                            n: wallet.credentials.n,
                            copayers: copayersId,
                            event : callType,
                            token : localStorage.getItem("token")                                          
                        };

                    var res = $http.post(urlService.serverURL + urlService.mapWallet, data);
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
            });
        
    };



    return root;
});
