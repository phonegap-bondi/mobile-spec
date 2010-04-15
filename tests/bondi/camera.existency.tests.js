Tests.prototype.CameraExistencyTests = function() {	
	module('CameraManager (bondi.camera)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi.camera != null, "bondi.camera should not be null.");
	});
	test("should contain a getCameras function", function() {
		expect(2);
		ok(typeof bondi.camera.getCameras != 'undefined' && bondi.camera.getCameras != null, "bondi.camera.getCameras should not be null.");
		ok(typeof bondi.camera.getCameras == 'function', "bondi.camera.getCameras should be a function.");
	});
    module('Camera (bondi.camera)');
    test("should be able to instantiate a Camera object with properties", function () {        
        stop(tests.TEST_TIMEOUT);
        var win = function(cameras) {
			expect(25);
            var camera = cameras[0];
            ok(camera != null, "new Camera object should not be null.");
            ok(typeof camera == 'object', "new Camera object should be of type 'object'.");
            ok(camera.ZOOM != null, "new Camera object should have an 'ZOOM' property.");
            ok(camera.ZOOM_NOZOOM != null, "new Camera object should have a 'ZOOM_NOZOOM' property.");
            ok(camera.CONTRAST != null, "new Camera object should have a 'CONTRAST' property.");
            ok(camera.BRIGHTNESS != null, "new Camera object should have a 'BRIGHTNESS' property.");
            ok(camera.NIGHTMODE != null, "new Camera object should have a 'NIGHTMODE' property.");
            ok(camera.NIGHTMODE_OFF != null, "new Camera object should have a 'NIGHTMODE_OFF' property.");
            ok(camera.NIGHTMODE_ON != null, "new Camera object should have a 'NIGHTMODE_ON' property.");
            ok(camera.MANUALFOCUS != null, "new Camera object should have a 'MANUALFOCUS' property.");
            ok(camera.MANUALFOCUS_ON != null, "new Camera object should have a 'MANUALFOCUS_ON' property.");
            ok(camera.MANUALFOCUS_OFF != null, "new Camera object should have a 'MANUALFOCUS_OFF' property.");
            ok(camera.FOCUS != null, "new Camera object should have a 'FOCUS' property.");
            ok(camera.LIGHT != null, "new Camera object should have a 'LIGHT' property.");
            ok(camera.FLASH != null, "new Camera object should have a 'FLASH' property.");
            ok(camera.FLASH_NO_FLASH != null, "new Camera object should have a 'FLASH_NO_FLASH' property.");
            ok(camera.FLASH_AUTOFLASH != null, "new Camera object should have a 'FLASH_AUTOFLASH' property.");
            ok(camera.FLASH_FORCEDFLASH != null, "new Camera object should have a 'FLASH_FORCEDFLASH' property.");
            ok(camera.description != null, "new Camera object should have a 'description' property.");
            
            ok(typeof camera.takePicture == 'function', "takePicture should be a function.");
            ok(typeof camera.getSupportedFeatures == 'function', "getSupportedFeatures should be a function.");
            ok(typeof camera.setFeature == 'function', "setFeature should be a function.");
            ok(typeof camera.requestLiveVideo == 'function', "requestLiveVideo should be a function.");
            ok(typeof camera.beginRecording == 'function', "beginRecording should be a function.");
            ok(typeof camera.endRecording == 'function', "endRecording should be a function.");
            
            start();
        };
        var fail = function() { start(); };
        bondi.camera.getCameras(win,fail);
        
	});
};