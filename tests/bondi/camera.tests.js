Tests.prototype.CameraTests = function() {	
	module('CAM_ex_imp_getCameras');
	test("CameraManager.getCameras should exist", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
			ok( cameras.length >= 0, "successCallback is working correctly");
			start();
		 };
		 var fail = function() {
			ok( false, "errorCallback was called");
			start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_ex_nimp_beginRecording');
	test("Camera.beginRecording should exist", function() {		
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
		 expect(2);
		 ok(typeof cameras[0].beginRecording != 'undefined' && cameras[0].beginRecording != null && typeof cameras[0].beginRecording == 'function', "Camera.beginRecording should not be null and be a function.");
		 var exception = false;
		 try {
		 cameras[0].beginRecording(function (p){},function(e){},function(f){},{});
		 } catch (e){
			exception = true;
		 }
		 ok(exception, "should throw an exception since beginRecording is not implemented");
		 start();
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_ex_nimp_endRecording');
	test("Camera.endRecording should exist", function() {		 
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
		 expect(2);
		 ok(typeof cameras[0].endRecording != 'undefined' && cameras[0].endRecording != null && typeof cameras[0].endRecording == 'function', "Camera.endRecording should not be null and be a function.");
		 var exception = false;
		 try {
		 cameras[0].endRecording(function (p){},function(e){});
		 } catch (e){
		 exception = true;
		 }
		 ok(exception, "should throw an exception since beginRecording is not implemented");
		 start();
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_ex_nimp_requestLiveVideo');
	test("Camera.requestLiveVideo should exist", function() {		 
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
		 expect(2);
		 ok(typeof cameras[0].requestLiveVideo != 'undefined' && cameras[0].requestLiveVideo != null && typeof cameras[0].requestLiveVideo == 'function', "Camera.requestLiveVideo should not be null and be a function.");
		 var exception = false;
		 try {
		 cameras[0].requestLiveVideo(function (p){},function(e){});
		 } catch (e){
		 exception = true;
		 }
		 ok(exception, "should throw an exception since beginRecording is not implemented");
		 start();
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_ex_getSupportedFeatures');
	test("Camera.getSupportedFeatures should exist", function() {
		
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
		 expect(2);
		 ok(typeof cameras[0].getSupportedFeatures != 'undefined' && cameras[0].getSupportedFeatures != null && typeof cameras[0].getSupportedFeatures == 'function', "Camera.getSupportedFeatures should not be null and be a function.");
		 var noexception = true;
		 try{
		 cameras[0].getSupportedFeatures()
		 } catch (e){
		 noexception = false;
		 }
		 ok(noexception, "no exception should be thrown");
		 start();
		 };
		 var fail = function() {
		expect(1);
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });

	module('CAM_ex_setFeature');
	test("Camera.setFeature should exist", function() {
		 
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {
		 expect(2);
		 ok(typeof cameras[0].setFeature != 'undefined' && cameras[0].setFeature != null && typeof cameras[0].setFeature == 'function', "Camera.setFeature should not be null and be a function.");
		 var exception = false;
		 try {
		 cameras[0].setFeature(0,0);
		 } catch (e){
		 if (e.code = 10002)
			exception = true;
		 }
		 ok(exception, "should throw an INVALID_ARGUMENT_ERROR since setFeature is not supported");
		 start();
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_ex_takePicture');
	test("Camera.takePicture should exist", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) { 
		 var noexception = true;
		 try {
			cameras[0].takePicture(function (p){},function(e){},{});
		 } catch (e) {noexception = false;}
		 ok (noexception, "No Exception is thrown");
		 
		 start();
		 };
		 var fail = function() {
		 ok( false, "errorCallback was called");
		 start(); 
		 };
		 bondi.camera.getCameras(win, fail);
		 });
	module('CAM_imp_takePicture');
	test("Camera.takePicture should work", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {		 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(file) {
			 ok(file != null, "file path to picture should be returned: " + file);
			 start();
			 };
			 var fail = function() {
			 ok( false, "errorCallback was called by takePicture");
			 start(); 
			};
			cameras[0].takePicture(win,fail,{});		 
		 };
		 var fail = function() {
			ok( false, "errorCallback was called");
		 };
		 bondi.camera.getCameras(win, fail);
	});
	module('CAM_para_getCameras');
	test("CameraManager.getCameras should handle faulty parameters", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var fail = function(e) {
		 if (e.code = 10002)
			ok( true, "INVALID_ARGUMENT_ERROR is returned in errorCallback");
		 else
			fail( true, "INVALID_ARGUMENT_ERROR is returned in errorCallback");
		 start(); 
		 };
		 bondi.camera.getCameras(null, fail);
		 });
	module('CAM_para_takePicture');
	test("Camera.takePicture should handle faulty parameters", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(cameras) {		 
		 stop(tests.TEST_TIMEOUT);
		 var fail = function(e) {
		 if (e.code = 10002)
		 ok( true, "INVALID_ARGUMENT_ERROR is returned in errorCallback");
		 else
		 fail( true, "INVALID_ARGUMENT_ERROR is returned in errorCallback");
		 start(); 
		 };
		 cameras[0].takePicture(null,fail,{});		 
		 };
		 var fail = function() {
		 ok( false, "errorCallback was called by getCameras");
		 };
		 bondi.camera.getCameras(win, fail);
		 });
};