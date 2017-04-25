'use strict';

angular.module('copayApp.controllers').controller('landingController', function($log, $state, $scope,$ionicHistory, $ionicConfig,startupService,lodash, profileService) {

  $ionicConfig.views.swipeBackEnabled(false);

   $ionicHistory.clearHistory();
   $ionicHistory.clearCache();          
  
  $scope.$parent.$on("$ionicView.afterEnter", function() {
    startupService.ready();
  });

  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };

$scope.checkSkip = function()
  {
    //  alert($ionicHistory.backView().stateId);
     
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

  //  $scope.takePicture = function (options) {
	
  //     var options = {
  //        quality : 75,
  //        targetWidth: 200,
  //        targetHeight: 200,
  //        sourceType: 1
  //     };

  //     Camera.getPicture(options).then(function(imageData) 
  //     {
  //       alert("HI");
  //        $scope.picture = imageData;;
  //     }, function(err) {
  //         alert("Error");
  //        console.log(err);
  //     });
		
  //  };


//   $scope.loadImage = function() {
//   var options = {
//     title: 'Select Image Source',
//     buttonLabels: ['Load from Library', 'Use Camera'],
//     addCancelButtonWithLabel: 'Cancel',
//     androidEnableCancelButton : true,
//   };
//   $cordovaActionSheet.show(options).then(function(btnIndex) {
//     var type = null;
//     if (btnIndex === 1) {
//       type = Camera.PictureSourceType.PHOTOLIBRARY;
//     } else if (btnIndex === 2) {
//       type = Camera.PictureSourceType.CAMERA;
//     }
//     if (type !== null) {
//       // $scope.selectPicture(type);
//       alert("",type);
//     }
//   });
// };

// $scope.selectPicture = function(sourceType) {
//   var options = {
//     quality: 100,
//     destinationType: Camera.DestinationType.FILE_URI,
//     sourceType: sourceType,
//     saveToPhotoAlbum: false
//   };
 
//   $cordovaCamera.getPicture(options).then(function(imagePath) {
//     // Grab the file name of the photo in the temporary directory
//     var currentName = imagePath.replace(/^.*[\\\/]/, '');
 
//     //Create a new name for the photo
//     var d = new Date(),
//     n = d.getTime(),
//     newFileName =  n + ".jpg";
 
//     // If you are trying to load image from the gallery on Android we need special treatment!
//     if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
//       window.FilePath.resolveNativePath(imagePath, function(entry) {
//         window.resolveLocalFileSystemURL(entry, success, fail);
//         function fail(e) {
//           console.error('Error: ', e);
//         }
 
//         function success(fileEntry) {
//           var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
//           // Only copy because of access rights
//           $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
//             $scope.image = newFileName;
//           }, function(error){
//             $scope.showAlert('Error', error.exception);
//           });
//         };
//       }
//     );
//     } else {
//       var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
//       // Move the file to permanent storage
//       $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
//         $scope.image = newFileName;
//       }, function(error){
//         $scope.showAlert('Error', error.exception);
//       });
//     }
//   },
//   function(err){
//     // Not always an error, maybe cancel was pressed...
//   })
// };

  // $scope.capturePhoto = function() {

  //   var options = {
  //       quality: 50,
  //       destinationType: Camera.DestinationType.DATA_URL,
  //       sourceType: Camera.PictureSourceType.CAMERA,
  //       allowEdit: true,
  //       encodingType: Camera.EncodingType.JPEG,
  //       targetWidth: 100,
  //       targetHeight: 100,
  //       popoverOptions: CameraPopoverOptions,
  //       saveToPhotoAlbum: false,
  //     correctOrientation:true
  //     };

  //    $cordovaCamera.getPicture(options).then(function(imageData) {
  //      var image = document.getElementById('myImage');
  //       image.src = "data:image/jpeg;base64," + imageData;
  //     }, function(err) {
  //     // error
  //   });
  // }

});
