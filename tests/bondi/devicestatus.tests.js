Tests.prototype.DeviceTests = function() {
	module('DeviceStatusManager (bondi.devicestatus)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi.devicestatus !== null, "bondi.devicestatus should not be null.");
	});
	
    test("should contain a listVocabularies function", function() {
        expect(3);
        ok(typeof bondi.devicestatus.listVocabularies !== 'undefined' && bondi.devicestatus.listVocabularies != null, "bondi.devicestatus.listVocabularies should not be null.");
        ok(typeof bondi.devicestatus.listVocabularies == 'function', "bondi.devicestatus.listVocabularies should be a function.");
		var value = bondi.devicestatus.listVocabularies();
		ok(typeof value != 'undefined' && value !== null && value.length>0, "list of vocabularies should not be null");
	});
    
    test("should contain a setDefaultVocabulary function", function() {
        expect(7);
        ok(typeof bondi.devicestatus.setDefaultVocabulary !== 'undefined' && bondi.devicestatus.setDefaultVocabulary != null, "bondi.devicestatus.setDefaultVocabulary should not be null.");
        ok(typeof bondi.devicestatus.setDefaultVocabulary == 'function', "bondi.devicestatus.setDefaultVocabulary should be a function.");
		var value = bondi.devicestatus.listVocabularies();
		try
		{
		  bondi.devicestatus.setDefaultVocabulary(value[0]);
		  ok(true,"A default vocabulary must always be available");
		}
		catch(myError)
		{
		  ok(false,"A default vocabulary must always be available");
		}	
	
		try
		{
		  bondi.devicestatus.setDefaultVocabulary("bonditest");
		  ok(false,"One may not set a non-existent vocabulary (NOT_FOUND_ERROR)");
		}
		catch(myError)
		{
		  ok(myError.code==10002,"One may not set a non-existent vocabulary (NOT_FOUND_ERROR)");
		}	
	
		try
		{
		  bondi.devicestatus.setDefaultVocabulary(null);
		  ok(false,"One may not set a null vocabulary (INVALID_ARGUMENT_ERROR)");
		}
		catch(myError)
		{
		  ok(myError.code==10001,"One may not set a null vocabulary (INVALID_ARGUMENT_ERROR)");
		}	
	
		try
		{
		  bondi.devicestatus.setDefaultVocabulary('');
		  ok(false,'One may not set an empty string as vocabulary (INVALID_ARGUMENT_ERROR)');
		}
		catch(myError)
		{
		  ok(myError.code==10001,'One may not set an empty string as vocabulary (INVALID_ARGUMENT_ERROR)');
		}	
	
		try
		{
		  var undefinedTestVariable;
		  bondi.devicestatus.setDefaultVocabulary(undefinedTestVariable);
		  ok(false,'One may not set an undefined variable as vocabulary (INVALID_ARGUMENT_ERROR)');
		}
		catch(myError)
		{
		  ok(myError.code==10001,'One may not set an undefined variable as vocabulary (INVALID_ARGUMENT_ERROR)');
		}
	});
	
    test("should contain a listAspects function", function() {
        expect(3);
        ok(typeof bondi.devicestatus.listAspects !== 'undefined' && bondi.devicestatus.listAspects !== null, "bondi.devicestatus.listAspects should not be null.");
        ok(typeof bondi.devicestatus.listAspects == 'function', "bondi.devicestatus.listAspects should be a function.");
		var value = bondi.devicestatus.listAspects();
		ok(typeof value != 'undefined' && value.length>0, "bondi.devicestatus.listAspects must always deliver at least on value");
		});
    
    test("should contain a getComponents function", function() {
        expect(3);
        ok(typeof bondi.devicestatus.getComponents !== 'undefined' && bondi.devicestatus.getComponents !== null, "bondi.devicestatus.getComponents should not be null.");
        ok(typeof bondi.devicestatus.getComponents == 'function', "bondi.devicestatus.getComponents should be a function.");
        var value = bondi.devicestatus.listAspects();
		var components = bondi.devicestatus.getComponents({aspect:value[0]});
		ok(typeof components != 'undefined' && components.length>=0, "an aspect must always have at least one component");
	});
    
    
    test("should contain a listProperties function", function() {
        expect(3);
        ok(typeof bondi.devicestatus.listProperties !== 'undefined' && bondi.devicestatus.listProperties !== null, "bondi.devicestatus.listProperties should not be null.");
        ok(typeof bondi.devicestatus.listProperties == 'function', "bondi.devicestatus.listProperties should be a function.");
		var value = bondi.devicestatus.listAspects();
		var properties = bondi.devicestatus.listProperties({aspect:value[0]});
		ok(typeof properties != 'undefined' && properties.length>0, "an aspect must always have at least one property");
	});
    
    test("should contain a getPropertyValue function", function() {
        expect(3);
        ok(typeof bondi.devicestatus.getPropertyValue !== 'undefined' && bondi.devicestatus.getPropertyValue !== null, "bondi.devicestatus.getComponents should not be null.");
        ok(typeof bondi.devicestatus.getPropertyValue == 'function', "bondi.devicestatus.getPropertyValue should be a function.");
		var value = bondi.devicestatus.listAspects();
		var properties = bondi.devicestatus.listProperties({aspect:value[0]});
		var level = bondi.devicestatus.getPropertyValue({property:properties[0]});
		ok(typeof level != 'undefined' && level != null, "An aspect has at least one valid property set"); 
	});

    test("should contain a clearPropertyChange function", function() {
        expect(2);
        ok(typeof bondi.devicestatus.clearPropertyChange !== 'undefined' && bondi.devicestatus.clearPropertyChange !== null, "bondi.devicestatus.clearPropertyChange should not be null.");
        ok(typeof bondi.devicestatus.clearPropertyChange == 'function', "bondi.devicestatus.clearPropertyChange should be a function.");
	});
    
	
    test("should contain a watchPropertyChange function", function() {
        expect(5);
        ok(typeof bondi.devicestatus.watchPropertyChange !== 'undefined' && bondi.devicestatus.watchPropertyChange !== null, "bondi.devicestatus.watchPropertyChange should not be null.");
        ok(typeof bondi.devicestatus.watchPropertyChange == 'function', "bondi.devicestatus.watchPropertyChange should be a function.");
		var numwatchcallleft = 3;
		stop(tests.TEST_TIMEOUT); 
		var batteryChangeHandler = bondi.devicestatus.watchPropertyChange({aspect:"Battery", property:"batteryLevel"},															  
											  function onPropertyChange(ref, value) {
											  numwatchcallleft--;
											  if (numwatchcallleft==0){
											  var exception = false;
											  try {
											  bondi.devicestatus.clearPropertyChange(batteryChangeHandler);
											  } catch (e) { exception = true; ok(false,"clearing property change watch failed");}
											  if (!exception){
											  ok(numwatchcallleft==0,"clearing property change watch succeeded");}
											  start();
											  }
												}, {maxTimeout:1000,callCallbackOnRegister:true});		 
		var exception = false;
		try
		{
			var batteryChangeHandler = bondi.devicestatus.watchPropertyChange({aspect:"battery", property:"batterylevel"}, 
	                null, {
	                        maxTimeout:1000,
	                        callCallbackOnRegister:true
	                }
	        );
		}
		catch(myException)
		{
			exception = true;
			ok(myException.code==10001,"The watch property success callback may not be null (INVALID_ARGUMENT_ERROR)");
		}			
	
		if (!exception){
			ok(false,"The watch property success callback may not be null (INVALID_ARGUMENT_ERROR)");
		}
		 
		 exception = false;
		 try
		 {
		 var batteryChangeHandler = bondi.devicestatus.watchPropertyChange({aspect:"battery", property:"batterylevels"}, 
					function onPropertyChange(ref, value) {}, {
	                        maxTimeout:1000,
	                        callCallbackOnRegister:true
	                }
	        );
		 }
		 catch (myException)
		 {
			 exception = true;
			 ok(myException.code==10001,"Invalid property should throw INVALID_ARGUMENT_ERROR");
		 }	

		 if (!exception){
			ok(false,"Invalid property should throw INVALID_ARGUMENT_ERROR");}
		
	});
		
	test("should contain OS attributes", function() {
		expect(4);
        var value = bondi.devicestatus.getPropertyValue({property:"name", aspect:"OperatingSystem", component:"_default"});
		 ok(typeof value !== 'undefined' && value !== null, "name should not be null.");
        value = bondi.devicestatus.getPropertyValue({property:"version", aspect:"OperatingSystem", component:"_default"});
		 ok(typeof value !== 'undefined' && value !== null, "version should not be null.") ;
        value = bondi.devicestatus.getPropertyValue({property:"language", aspect:"OperatingSystem", component:"_default"});
		 ok(typeof value !== 'undefined' && value !== null, "language should not be null."); 
        value = bondi.devicestatus.getPropertyValue({property:"vendor", aspect:"OperatingSystem", component:"_default"});
		 ok(typeof value !== 'undefined' && value !== null, "vendor should not be null."); 
	});
	
    test("should contain Battery attributes", function() {
		expect(3);
        var value = bondi.devicestatus.getPropertyValue({property:"batteryLevel", aspect:"Battery", component:"_default"});
		 ok(typeof value !== 'undefined' && value !== null, "batteryLevel should not be null.");
        value = bondi.devicestatus.getPropertyValue({property:"batteryBeingCharged"});
		 ok(typeof value !== 'undefined' && value !== null, "batteryBeingCharged should not be null."); 
        value = bondi.devicestatus.getPropertyValue({property:"batteryTechnology"});
		 ok(typeof value !== 'undefined' && value !== null, "batteryTechnology should not be null."); 
	});
    var watchID = 0;
    
    test("watchPropertyChange success callback should be called", function() {
		expect(2);
		stop(tests.TEST_TIMEOUT);
		var win = function(ref,value) {
			ok(ref !== null, "PropertyRef object returned in watchPropertyChange success callback should not be null.");
			ok(value !== null, "new Value object returned in watchPropertyChange success callback should not be null.");			
			start();
		};
		var fail = function() { start(); };
		watchID = bondi.devicestatus.watchPropertyChange({aspect:"Battery", property:"batteryLevel"}, win, {maxTimeout:5000});
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