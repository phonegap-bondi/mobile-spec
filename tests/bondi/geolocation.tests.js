Tests.prototype.GeoLocationTests = function() {	
	module('Geolocation (bondi.geolocation)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi.geolocation != null, "bondi.geolocation should not be null.");
	});
	test("should contain a getCurrentPosition function", function() {
		expect(2);
		ok(typeof bondi.geolocation.getCurrentPosition != 'undefined' && bondi.geolocation.getCurrentPosition != null, "bondi.geolocation.getCurrentPosition should not be null.");
		ok(typeof bondi.geolocation.getCurrentPosition == 'function', "bondi.geolocation.getCurrentPosition should be a function.");
	});
	test("should contain a watchPosition function", function() {
		expect(2);
		ok(typeof bondi.geolocation.watchPosition != 'undefined' && bondi.geolocation.watchPosition != null, "bondi.geolocation.watchPosition should not be null.");
		ok(typeof bondi.geolocation.watchPosition == 'function', "bondi.geolocation.watchPosition should be a function.");
	});
	test("getCurrentPosition success callback should be called with a Position object", function() {
		expect(9);
		stop(tests.TEST_TIMEOUT);
		var win = function(p) {
			ok(p.coords != null, "Position object returned in getCurrentPosition success callback has a 'coords' property.");
            ok(p.coords.latitude != null, "Coordinates object returned in getCurrentPosition success callback has a 'latitude' property.");
            ok(p.coords.longitude != null, "Coordinates object returned in getCurrentPosition success callback has a 'longitude' property.");
            ok(p.coords.altitude != null, "Coordinates object returned in getCurrentPosition success callback has a 'altitude' property.");
            ok(p.coords.accuracy != null, "Coordinates object returned in getCurrentPosition success callback has a 'accuracy' property.");
			//altitudeAccuracy must be null if it cannot be provided
			ok(typeof p.coords.altitudeAccuracy != 'undefined', "Coordinates object returned in getCurrentPosition success callback has a 'altitudeAccuracy' property.");         
			ok(p.coords.heading != null, "Coordinates object returned in getCurrentPosition success callback has a 'heading' property.");
            ok(p.coords.speed != null, "Coordinates object returned in getCurrentPosition success callback has a 'speed' property.");
			ok(p.timestamp != null, "Position object returned in getCurrentPosition success callback has a 'timestamp' property.");
			start();
		};
		var fail = function() { start(); };
		bondi.geolocation.getCurrentPosition(win, fail);
	});
    var watchID;
    test("watchPosition success callback should be called", function() {
		expect(2);
		stop(tests.TEST_TIMEOUT);
		var win = function(p) {
			ok(p.coords != null, "Position object returned in watchPosition success callback has a 'coords' property.");
			ok(p.timestamp != null, "Position object returned in watchPosition success callback has a 'timestamp' property.");
			start();
		};
		var fail = function() { start(); };
		watchID = bondi.geolocation.watchPosition(win, fail);
	});
	test("clearWatch should stop watchPosition success callback",function () {
		 expect(1);
		 try {
			bondi.geolocation.clearWatch(watchID);
		 } catch(error) {
			ok( false, "bondi.geolocation.clearWatch should be able to stop location updates.");
		 }
		 ok( true, "bondi.geolocation.clearWatch should be able to stop location updates.");
	});
	module('Geolocation model');
	test("should be able to define a Position object with coords and timestamp properties", function() {
		expect(3);
		var pos = new Position({});
		ok(pos != null, "new Position() should not be null.");
		ok(typeof pos.coords != 'undefined' && pos.coords != null, "new Position() should include a 'coords' property.");
		ok(typeof pos.timestamp != 'undefined' && pos.timestamp != null, "new Position() should include a 'timestamp' property.");
	});
	test("should be able to define a Coordinates object with latitude, longitude, accuracy, altitude, heading and speed properties", function() {
		expect(8);
		var coords = new Coordinates(1,2,3,4,5,6,7,8);
		ok(coords != null, "new Coordinates() should not be null.");
		ok(typeof coords.latitude != 'undefined' && coords.latitude != null, "new Coordinates() should include a 'latitude' property.");
		ok(typeof coords.longitude != 'undefined' && coords.longitude != null, "new Coordinates() should include a 'longitude' property.");
		ok(typeof coords.accuracy != 'undefined' && coords.accuracy != null, "new Coordinates() should include a 'accuracy' property.");
		ok(typeof coords.altitude != 'undefined' && coords.altitude != null, "new Coordinates() should include a 'altitude' property.");
		ok(typeof coords.altitudeAccuracy != 'undefined', "new Coordinates() should include a 'altitudeAccuracy' property.");
		ok(typeof coords.heading != 'undefined' && coords.heading != null, "new Coordinates() should include a 'heading' property.");
		ok(typeof coords.speed != 'undefined' && coords.speed != null, "new Coordinates() should include a 'speed' property.");
	});
	test("checking PositionError values", function() {
		expect(3);
		equals( 1, PositionError.PERMISSION_DENIED, "We expect PERMISSION_DENIED to be 1" );
		equals( 2, PositionError.POSITION_UNAVAILABLE, "We expect POSITION_UNAVAILABLE to be 2" );
		equals( 3, PositionError.TIMEOUT, "We expect TIMEOUT to be 3" );
	});
};