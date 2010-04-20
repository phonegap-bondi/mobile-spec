Tests.prototype.Messaging2Tests = function() {	
	test("should exist", function() {
  		expect(1);
  		ok(bondi != null, "bondi should not be null.");
	});
	test("should contain a requestFeature function", function() {
		expect(2);
		ok(typeof bondi.requestFeature != 'undefined' && bondi.camera.getCameras != null, "bondi.requestFeature should not be null.");
		ok(typeof bondi.requestFeature == 'function', "bondi.requestFeature should be a function.");
	});
	
	
	module('Messaging (bondi.messaging2)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi.messaging != null, "bondi.messaging should not be null.");
	});

	 
	var telephoneNumber = DStatus.getOwnNumber();
	var recipients = [];
	if (telephoneNumber == "15555218135"){
		// We are running in an emulator. Number seems to not work for sending sms there
		// so let's just guess the port number on which we are running
//		window.confirm("Warning: Emulator detected, setting phoneno. for testing to assumed port 5554");
		recipients.push("5554");
	} else {
		recipients.push(telephoneNumber);
	}
	
	// test description: MESS_ex_createSMS
	test("should contain a createSMS function", function() {
		expect(3);
		var sms = bondi.messaging.createSMS({to:recipients,body:"Hello world"});
		ok(typeof sms != 'undefined' && sms != null, "created sms should not be null.");
		ok(sms.to[0] == recipients[0], "the recipients should be set correctly");
		ok(sms.body == "Hello world", "the body should be set correctly");
	});
	
	// test description: MESS_ex_sendSMS
	test("should contain a sendSMS function", function() {
		expect(2);		
		stop(tests.TEST_TIMEOUT * 2);
		var successCallback = function(result) {
			ok(result == "SMS_SENT_RESULT_OK", "result should be SMS_SENT_RESULT_OK");
		};
		var errorCallback = function(response) {
			ok(false, "Sending sms failed with error " + response.name + " because of " + response.message);
		};
		var sms = bondi.messaging.createSMS({body:"Just arrived",to:recipients});
		var pe = bondi.messaging.sendSMS(successCallback, errorCallback, sms, false);
		ok(pe != null, "result of sendSMS should not be null");
	});
	
	// test description: MESS_ex_subscribeToSMSunsubscribeFromSMS
	test("should contain a subscribeToSMS function", function() {
		expect(4);
		stop(tests.TEST_TIMEOUT * 25);
		var listenerID = -1;
		
		var listenerSuccessCallback = function(id){
				ok(id != null && id >=0, "subscribeToSMS should return a listenerID >= 0 via given successCallback");
				listenerID = id;
				bondi.messaging.sendSMS(successCallback, errorCallback, sms, false);
			}
		var successCallback = function(response) {
		};
		var errorCallback = function(response) {
		};
		var mysmslistener = function(reSMS) {
			alert("RECEIVED SMS!!! " + reSMS.body);
			var testString = "Should not been received";
			if (reSMS.body != testString){
				ok(reSMS.body == "Hello world", "received sms should contain the same text as we send");
				var exceptionAtUnsubscribe = false;
				try {
					bondi.messaging.unsubscribeFromSMS(listenerID);
				} catch (e) {
					exceptionAtUnsubscribe = true;
				}
				ok(!exceptionAtUnsubscribe, "should not throw an exception at unsubscribing sms-listener");
				sms.body = testString;
				bondi.messaging.sendSMS(successCallback, errorCallback, sms, false);
			} else {
				ok(reSMS == null, "Second sms should not be received anymore because of our unsubscription");
			}
		};

		var sms = bondi.messaging.createSMS({to:recipients,body:"Hello world"});
		ok(typeof sms != 'undefined' && sms != null, "created sms should not be null.");
		bondi.messaging.subscribeToSMS(listenerSuccessCallback,errorCallback,mysmslistener,{from:telephoneNumber},true);
		start();
	});
	
	// test description: MESS_para_createSMS.doc
	test("createSMS does not expect a string parameter", function() {
		expect(1);
		try {
			var sms = bondi.messaging.createSMS("neue SMS");
		} catch (e) {
			ok(e.code == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
		}
	});
	
	// test description: MESS_para_sendSMS_1.doc
	test("sendSMS requires the parameter successCallback", function() {
		expect(1);
		var sms = bondi.messaging.createSMS({body:"Just arrived",to:["+491711234567"]});
		try {
			var errorCallback = function(e) {
				ok(e.name == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
				};
			bondi.messaging.sendSMS(null, errorCallback, sms, false); 
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
	});
	
	// test description: MESS_para_sendSMS_2.doc
	test("sendSMS requires the parameter errorCallback", function() {
		expect(1);
		var sms = bondi.messaging.createSMS({body:"Just arrived",to:["+491711234567"]});
		try {
			var successCallback = function(key, value) {
			};
			bondi.messaging.sendSMS(successCallback, null, sms, false); 
		} catch (e) {
			ok(e.name == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
		}
	});

	// test description: MESS_para_sendSMS_3.doc
	test("sendSMS requires the parameter sms", function() {
		expect(1);
		try {
			var successCallback = function(key, value) {
			};
			var errorCallback = function(e) {
				ok(e.name == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
			};
			bondi.messaging.sendSMS(successCallback, errorCallback, null, false); 
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
	});
	
	// test description: MESS_para_sendSMS_4.doc
	test("sendSMS requires four parameters", function() {
		expect(1);
		var sms = bondi.messaging.createSMS({body:"Just arrived",to:["+491711234567"]});
		try {
			var successCallback = function(key, value) {
			};
			var errorCallback = function(e) {
				ok(e.name == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
			};
			bondi.messaging.sendSMS(successCallback, errorCallback, sms, null); 
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
	});
	
	// prepare some tests
	test("subscribeToSMS should check the parameter", function() {
		expect(5);
		var sms = bondi.messaging.createSMS({to:recipients,body:"Hello world"});
		var successCallback = function(response) {
		};
		var errorCallback = function(error) {
//			alert("error! " + " name: " + error.name + " code: " + error.code + " message: " + error.message)
			ok(error.name == error.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
			};
		var smslistener = function(text) {
			//alert('sms received. text=' + text);
			};
		ok(typeof sms != 'undefined' && sms != null, "created sms should not be null.");
		
		// test description: MESS_para_subscribeToSMS
		try {
			var pe = bondi.messaging.subscribeToSMS(null,errorCallback,smslistener,{from:telephoneNumber},true);
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
		
		// test description: MESS_para_subscribeToSMS_1.doc
		try {
			var pe = bondi.messaging.subscribeToSMS(successCallback, null, sms, true);
		} catch (e) {
			ok(e.name == e.INVALID_ARGUMENT_ERROR, "an INVALID_ARGUMENT_ERROR was expected.");
		}
		
		// test description: MESS_para_subscribeToSMS_2.doc
		try {
			var pe = bondi.messaging.subscribeToSMS(successCallback,errorCallback,null, {from:telephoneNumber},true); 
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
		
		// test description: MESS_para_subscribeToSMS_3.doc
		try {
			var pe = bondi.messaging.subscribeToSMS(successCallback,errorCallback,smslistener, null, true); 
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
		
		// test description: MESS_para_subscribeToSMS_4.doc
		try {
			var pe = bondi.messaging.subscribeToSMS(successCallback,errorCallback,smslistener, {from:telephoneNumber},"vielleicht"),  
		} catch (e) {
			ok(e == null, "all errors should have been gone to the errorcallback");
		}
	});
};