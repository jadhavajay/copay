'use strict';
angular.module('copayApp.services')
    .factory('landingService', function (logHeader, fileStorageService, localStorageService, sjcl, $log, lodash, platformInfo, $timeout) {

        var root = {};

        // File storage is not supported for writing according to
        // https://github.com/apache/cordova-plugin-file/#supported-platforms
        var shouldUseFileStorage = platformInfo.isCordova && !platformInfo.isWP;
        $log.debug('Using file storage:', shouldUseFileStorage);


        var storage = shouldUseFileStorage ? fileStorageService : localStorageService;

        var getUUID = function (cb) {
            // TO SIMULATE MOBILE
            //return cb('hola');
            if (!window || !window.plugins || !window.plugins.uniqueDeviceID)
                return cb(null);

            window.plugins.uniqueDeviceID.get(
                function (uuid) {
                    return cb(uuid);
                }, cb);
        };

        // This is only used in Copay, we used to encrypt profile
        // using device's UUID.

        var decryptOnMobile = function (text, cb) {
            var json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                $log.warn('Could not open profile:' + text);

                var i = text.lastIndexOf('}{');
                if (i > 0) {
                    text = text.substr(i + 1);
                    $log.warn('trying last part only:' + text);
                    try {
                        json = JSON.parse(text);
                        $log.warn('Worked... saving.');
                        storage.set('profile', text, function () { });
                    } catch (e) {
                        $log.warn('Could not open profile (2nd try):' + e);
                    };
                };

            };

            if (!json) return cb('Could not access storage')

            if (!json.iter || !json.ct) {
                $log.debug('Profile is not encrypted');
                return cb(null, text);
            }

            $log.debug('Profile is encrypted');
            getUUID(function (uuid) {
                $log.debug('Device UUID:' + uuid);
                if (!uuid)
                    return cb('Could not decrypt storage: could not get device ID');

                try {
                    text = sjcl.decrypt(uuid, text);

                    $log.info('Migrating to unencrypted profile');
                    return storage.set('profile', text, function (err) {
                        return cb(err, text);
                    });
                } catch (e) {
                    $log.warn('Decrypt error: ', e);
                    return cb('Could not decrypt storage: device ID mismatch');
                };
                return cb(null, text);
            });
        };

        root.getLogin = function (cb) 
        {
            $log.info('**** getLogin....');
            storage.get('login', function (err, str) {
                if (err || !str)
                    return cb(err);
            });
        };

        root.checkLoggedIn = function (cb) 
        {
            root.getLogin(function (err, login) {
                if (err) {
                    $rootScope.$emit('Local/DeviceError', err);
                    return cb(err);
                }

                $log.info('**** checkLoggedIn ....');

                if (!login) {
                    $log.info('**** NOTLOGGEDIN ....');
                    return cb(new Error('NOTLOGGEDIN: No login'));
                } else {
                    $log.debug('Login read');
                    return root.bindLogin(login, cb);
                }
            });
        };

        root.bindLogin = function (login, cb) {
            root.login = login;
        }


        return root;
    });