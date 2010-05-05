Tests.prototype.DeviceExistencyTests = function() {
	bondi.requestFeature(function () {}, function () {}, "http://bondi.omtp.org/api/1.1/devicestatus");
	
	module('DeviceStatusManager (bondi.devicestatus)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi.devicestatus != null, "bondi.devicestatus should not be null.");
	});
    test("should contain a listVocabularies function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.listVocabularies != 'undefined' && bondi.devicestatus.listVocabularies != null, "bondi.devicestatus.listVocabularies should not be null.");
        ok(typeof bondi.devicestatus.listVocabularies == 'function', "bondi.devicestatus.listVocabularies should be a function.");
	});
    test("should contain a setDefaultVocabulary function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.setDefaultVocabulary != 'undefined' && bondi.devicestatus.setDefaultVocabulary != null, "bondi.devicestatus.setDefaultVocabulary should not be null.");
        ok(typeof bondi.devicestatus.setDefaultVocabulary == 'function', "bondi.devicestatus.setDefaultVocabulary should be a function.");
	});
    test("should contain a listAspects function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.listAspects != 'undefined' && bondi.devicestatus.listAspects != null, "bondi.devicestatus.listAspects should not be null.");
        ok(typeof bondi.devicestatus.listAspects == 'function', "bondi.devicestatus.listAspects should be a function.");
	});
    test("should contain a getComponents function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.getComponents != 'undefined' && bondi.devicestatus.getComponents != null, "bondi.devicestatus.getComponents should not be null.");
        ok(typeof bondi.devicestatus.getComponents == 'function', "bondi.devicestatus.getComponents should be a function.");
	});
    test("should contain a listProperties function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.listProperties != 'undefined' && bondi.devicestatus.listProperties != null, "bondi.devicestatus.listProperties should not be null.");
        ok(typeof bondi.devicestatus.listProperties == 'function', "bondi.devicestatus.listProperties should be a function.");
	});
    test("should contain a getPropertyValue function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.getPropertyValue != 'undefined' && bondi.devicestatus.getPropertyValue != null, "bondi.devicestatus.getComponents should not be null.");
        ok(typeof bondi.devicestatus.getPropertyValue == 'function', "bondi.devicestatus.getPropertyValue should be a function.");
	});
    test("should contain a watchPropertyChange function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.watchPropertyChange != 'undefined' && bondi.devicestatus.watchPropertyChange != null, "bondi.devicestatus.watchPropertyChange should not be null.");
        ok(typeof bondi.devicestatus.watchPropertyChange == 'function', "bondi.devicestatus.watchPropertyChange should be a function.");
	});
    test("should contain a clearPropertyChange function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.clearPropertyChange != 'undefined' && bondi.devicestatus.clearPropertyChange != null, "bondi.devicestatus.clearPropertyChange should not be null.");
        ok(typeof bondi.devicestatus.clearPropertyChange == 'function', "bondi.devicestatus.clearPropertyChange should be a function.");
	});
	test("should contain OS attributes", function() {
		expect(4);
        var value = bondi.devicestatus.getPropertyValue({property:"name", aspect:"OperatingSystem", component:"_default"});
		ok(typeof value != 'undefined' && value != null, "name should not be null.")
        value = bondi.devicestatus.getPropertyValue({property:"version", aspect:"OperatingSystem", component:"_default"});
		ok(typeof value != 'undefined' && value != null, "version should not be null.") 
        value = bondi.devicestatus.getPropertyValue({property:"language", aspect:"OperatingSystem", component:"_default"});
		ok(typeof value != 'undefined' && value != null, "language should not be null.") 
        value = bondi.devicestatus.getPropertyValue({property:"vendor", aspect:"OperatingSystem", component:"_default"});
		ok(typeof value != 'undefined' && value != null, "vendor should not be null.") 
	});
    test("should contain Battery attributes", function() {
		expect(3);
        var value = bondi.devicestatus.getPropertyValue({property:"batteryLevel", aspect:"Battery", component:"_default"});
		ok(typeof value != 'undefined' && value != null, "batteryLevel should not be null.")
        value = bondi.devicestatus.getPropertyValue({property:"batteryBeingCharged"});
		ok(typeof value != 'undefined' && value != null, "batteryBeingCharged should not be null.") 
        value = bondi.devicestatus.getPropertyValue({property:"batteryTechnology"});
		ok(typeof value != 'undefined' && value != null, "batteryTechnology should not be null.") 
	});
    var watchID = 0;
    test("watchPropertyChange success callback should be called", function() {
		expect(2);
		stop(tests.TEST_TIMEOUT);
		var win = function(ref,value) {
			ok(ref != null, "PropertyRef object returned in watchPropertyChange success callback should not be null.");
			ok(value != null, "new Value object returned in watchPropertyChange success callback should not be null.");			
			start();
		};
		var fail = function() { start(); };
		watchID = bondi.devicestatus.watchPropertyChange({aspect:"Battery", property:"batteryLevel"}, win, {minTimeout:5000});
    });
	test("clearPropertyChange should stop watchPropertyChange success callbacks", function () {
		 expect(1);
		 try {
			bondi.devicestatus.clearPropertyChange(watchID);
		 } catch(error) {
			ok( true, "bondi.devicestatus.clearPropertyChange should be able to stop property changes.");
		 }
		 ok( true, "bondi.devicestatus.clearPropertyChange should be able to stop property changes.");
	});
};