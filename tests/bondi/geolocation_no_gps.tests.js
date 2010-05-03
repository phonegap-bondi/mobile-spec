Tests.prototype.GeolocationNoGPSTests = function() {
	module('NO_GPS GEO_imp_getCurrentPosition_2');
	test("Geolocation.getCurrentPosition errorCallback should be called when there is no reception", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(p) {
			ok( false, "should call errorCallback when there is no reception");
			start();
		 };
		 var fail = function(e) {
			 ok( e.code >=1 && e.code <=3 && typeof e.message != 'undefined', "should call errorCallback when there is no reception");
			 start(); 
		 };
		 bondi.geolocation.getCurrentPosition(win, fail,{timeout:60000, maximumAge:120000, enableHighAccuracy:false});
	});
	module('NO_GPS GEO_imp_watchPosition_2');
	test("Geolocation.watchPosition errorCallback should be called when there is no reception", function() {
		 expect(1);
		 stop(tests.TEST_TIMEOUT);
		 var win = function(p) {
			ok( false, "should call errorCallback when there is no reception");
			bondi.geolocation.clearWatch(id);
			start();
		 };
		 var fail = function(e) {
			ok( e.code >=1 && e.code <=3 && typeof e.message != 'undefined', "should call errorCallback when there is no reception");
			start(); 
		 };
		 id = bondi.geolocation.watchPosition(win, fail,{timeout:60000, maximumAge:120000, enableHighAccuracy:false});
	});
	};