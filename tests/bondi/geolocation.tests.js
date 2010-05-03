Tests.prototype.GeolocationTests = function() {

	module('GEO_ex_getCurrentPosition');
	test("Geolocation.getCurrentPosition should exist", function() {
		expect(1);
		stop(tests.TEST_TIMEOUT);
		var win = function(p) { ok( true, "successCallback was called"); start();};
		var fail = function() { ok( true, "errorCallback was called"); start(); };
		var options = {}; options.timeout = 20000; options.maximumAge = 60000;
		bondi.geolocation.getCurrentPosition(win, fail, options);
	});
	module('GEO_ex_watchPosition');
	var id;
	test("Geolocation.watchPosition should exist", function() {
        expect(1);
        stop(tests.TEST_TIMEOUT);
        var win = function(p) {
            ok( true, "successCallback was called");
            start();
        };
        var fail = function(e) {
            ok( true, "errorCallback was called");
            start(); 
        };
        id = bondi.geolocation.watchPosition(win, fail,{timeout:10000, maximumAge:60000, enableHighAccuracy:false});
	});
	module('GEO_ex_clearWatch');
	test("Geolocation.clearWatch should exist",function () {
        expect(1);
        try {
            bondi.geolocation.clearWatch(id);
        } catch(error) {
            ok( false, "Should be able to stop location updates.");
        }
        ok( true, "Should be able to stop location updates.");
	});
	module('GEO_para_getCurrentPosition');
	test("Should be able to handle parameters correctly", function() {
		 expect(7);
		 var exception = false;
		 try {
			bondi.geolocation.getCurrentPosition(null, null);
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when successCallback=null");
		 
		 exception = false;
		 try {
			bondi.geolocation.getCurrentPosition(function (p){}, function (e){},{timeout:-2});
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when timeout=-2");
		 
		 exception = false;
		 try {
			bondi.geolocation.getCurrentPosition(function (p){}, function (e){},{maximumAge:-2});
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when maximumAge=-2");
		 
		 exception = true;
		 try {
			bondi.geolocation.getCurrentPosition(function (p){}, null);
		 } catch(error) {
			exception = false;
		 }
		 ok( exception, "Should throw no exception when errorCallback=null");
		 
		 exception = false;
		 try {
			bondi.geolocation.getCurrentPosition(function (p){}, 'geotest');
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when errorCallback='geotest'");
		 
		 exception = false;
		 try {
			bondi.geolocation.getCurrentPosition(function (p){}, function (e){},'geotest');
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when PositionOptions='geotest'");
		 
		 exception = true;
		 try {
		 bondi.geolocation.getCurrentPosition(function (p){}, {maximumAge:100000});
		 } catch(error) {
		 exception = false;
		 }
		 ok( exception, "Should throw no exception when no errorCallback is supplied");
		 
	});
    module('GEO_para_watchPosition');
	test("Should be able to handle parameters correctly", function() {
		 expect(7);
		 var exception = false;
		 try {
			bondi.geolocation.watchPosition(null, null);
		 } catch(error) {
			exception = true;		
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when successCallback=null");
		 
		 exception = false;
		 try {
		 bondi.geolocation.watchPosition(function (p){}, function (e){},{timeout:-2});
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when timeout=-2");
		 
		 exception = false;
		 try {
		 bondi.geolocation.watchPosition(function (p){}, function (e){},{maximumAge:-2});
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when maximumAge=-2");
		 
		 exception = true;
		 try {
		 id = bondi.geolocation.watchPosition(function (p){}, null);
		 } catch(error) {
			exception = false;
		 }
		 ok( exception, "Should throw no exception when errorCallback=null");
		 bondi.geolocation.clearWatch(id);
		 
		 exception = false;
		 try {
		 bondi.geolocation.watchPosition(function (p){}, 'geotest');
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when errorCallback='geotest'");
		 
		 exception = false;
		 try {
		 bondi.geolocation.watchPosition(function (p){}, function (e){},'geotest');
		 } catch(error) {
			exception = true;
		 }
		 ok( exception, "Should throw INVALID_ARGUMENT_ERROR when PositionOptions='geotest'");
		 
		 exception = true;
		 try {
		 id = bondi.geolocation.watchPosition(function (p){}, {maximumAge:100000});
		 } catch(error) {
		 exception = false;
		 }
		 ok( exception, "Should throw no exception when no errorCallback is supplied");
		 bondi.geolocation.clearWatch(id);
	});
	module('GEO_imp_getCurrentPosition_1');
	test("Geolocation.getCurrentPosition successCallback should be called with a Position object", function() {
        expect(9);
        stop(tests.TEST_TIMEOUT);
        var win = function(p) {
            ok(p.timestamp != null && typeof p.timestamp == 'number', "Position object returned in getCurrentPosition success callback has a 'timestamp' property.");	
            ok(p.coords != null, "Position object returned in getCurrentPosition success callback has a 'coords' property.");
            ok(p.coords.latitude != null && p.coords.latitude >= -90 && p.coords.latitude <= 90, "Coordinates object returned in getCurrentPosition success callback has a 'latitude' property.");
            ok(p.coords.longitude != null && p.coords.longitude >= -180 && p.coords.longitude <= 180, "Coordinates object returned in getCurrentPosition success callback has a 'longitude' property.");
            ok(p.coords.altitude == null || typeof p.coords.altitude == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'altitude' property.");
            ok(p.coords.accuracy != null && typeof p.coords.accuracy == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'accuracy' property.");
            ok(p.coords.altitudeAccuracy == null || typeof p.coords.altitudeAccuracy == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'altitudeAccuracy' property.");         
            ok(p.coords.heading == null || (p.coords.heading != null && p.coords.heading >= 0 && p.coords.heading<=360), "Coordinates object returned in getCurrentPosition success callback has a 'heading' property.");
            ok(p.coords.speed == null || typeof p.coords.speed == 'number' , "Coordinates object returned in getCurrentPosition success callback has a 'speed' property.");				 
            start();
        };
        var fail = function() {
            ok( false, "successCallback was expected");
            start(); 
        };
        bondi.geolocation.getCurrentPosition(win, fail,{timeout:60000, maximumAge:120000, enableHighAccuracy:false});
	});
	module('GEO_imp_watchPosition_1');
	test("Geolocation.watchPosition successCallback should be called with a Position object", function() {
		 expect(9);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(p) {
			 ok(p.timestamp != null && typeof p.timestamp == 'number', "Position object returned in getCurrentPosition success callback has a 'timestamp' property.");	
			 ok(p.coords != null, "Position object returned in getCurrentPosition success callback has a 'coords' property.");
			 ok(p.coords.latitude != null && p.coords.latitude >= -90 && p.coords.latitude <= 90, "Coordinates object returned in getCurrentPosition success callback has a 'latitude' property.");
			 ok(p.coords.longitude != null && p.coords.longitude >= -180 && p.coords.longitude <= 180, "Coordinates object returned in getCurrentPosition success callback has a 'longitude' property.");
			 ok(p.coords.altitude == null || typeof p.coords.altitude == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'altitude' property.");
			 ok(p.coords.accuracy != null && typeof p.coords.accuracy == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'accuracy' property.");
			 ok(p.coords.altitudeAccuracy == null || typeof p.coords.altitudeAccuracy == 'number', "Coordinates object returned in getCurrentPosition success callback has a 'altitudeAccuracy' property.");         
			 ok(p.coords.heading == null || (p.coords.heading != null && p.coords.heading >= 0 && p.coords.heading<=360), "Coordinates object returned in getCurrentPosition success callback has a 'heading' property.");
			 ok(p.coords.speed == null || typeof p.coords.speed == 'number' , "Coordinates object returned in getCurrentPosition success callback has a 'speed' property.");				 
			 bondi.geolocation.clearWatch(id);
			 start();
		 };
		 var fail = function() {
			 ok( false, "successCallback was expected");
			 start(); 
		 };
		 id = bondi.geolocation.watchPosition(win, fail,{timeout:60000, maximumAge:120000, enableHighAccuracy:false});
	});	
	};