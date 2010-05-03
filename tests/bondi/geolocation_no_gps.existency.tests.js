Tests.prototype.GeolocationNoGPSExistencyTests = function() {	
	module('NO_GPS Geolocation (bondi.geolocation)');
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
	module('NO_GPS  Geolocation model');
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