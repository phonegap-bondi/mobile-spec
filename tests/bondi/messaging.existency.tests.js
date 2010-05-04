Tests.prototype.MessagingExistencyTests = function() {	
	module('Messaging (bondi.messaging)');
	test("should exist", function() {
  		expect(1);
  		bondi.requestFeature(ok(bondi.messaging != null, "bondi.messaging should not be null."),nop{}(), "http://bondi.omtp.org/api/1.1/messaging");
	});
	test("should contain a createSMS function", function() {
		expect(2);
		ok(typeof bondi.messaging.createSMS != 'undefined' && bondi.messaging.createSMS != null, "bondi.messaging.getCurrentPosition should not be null.");
		ok(typeof bondi.messaging.createSMS == 'function', "bondi.messaging.createSMS should be a function.");
	});
	test("should contain a sendSMS function", function() {
		expect(2);
		ok(typeof bondi.messaging.sendSMS != 'undefined' && bondi.messaging.sendSMS != null, "bondi.messaging.sendSMS should not be null.");
		ok(typeof bondi.messaging.sendSMS == 'function', "bondi.messaging.sendSMS should be a function.");
	});
	test("should contain a subscribeToSMS function", function() {
		expect(2);
		ok(typeof bondi.messaging.subscribeToSMS != 'undefined' && bondi.messaging.subscribeToSMS != null, "bondi.messaging.subscribeToSMS should not be null.");
		ok(typeof bondi.messaging.subscribeToSMS == 'function', "bondi.messaging.subscribeToSMS should be a function.");
	});
	test("should contain a unsubscribeFromSMS function", function() {
		expect(2);
		ok(typeof bondi.messaging.unsubscribeFromSMS != 'undefined' && bondi.messaging.unsubscribeFromSMS != null, "bondi.messaging.unsubscribeFromSMS should not be null.");
		ok(typeof bondi.messaging.unsubscribeFromSMS == 'function', "bondi.messaging.unsubscribeFromSMS should be a function.");
	});
	test("should contain an INBOX_FOLDER constant", function() {
		expect(2);
		ok(typeof bondi.messaging.INBOX_FOLDER != 'undefined' && bondi.messaging.INBOX_FOLDER != null, "bondi.messaging.INBOX_FOLDER should not be null.");
		ok(bondi.messaging.INBOX_FOLDER == 0, "bondi.messaging.INBOX_FOLDER should be 0.");
	});
	test("should contain an SENT_FOLDER constant", function() {
		expect(2);
		ok(typeof bondi.messaging.SENT_FOLDER != 'undefined' && bondi.messaging.SENT_FOLDER != null, "bondi.messaging.SENT_FOLDER should not be null.");
		ok(bondi.messaging.SENT_FOLDER == 1, "bondi.messaging.SENT_FOLDER should be 1.");
	});
	test("should contain an OUTBOX_FOLDER constant", function() {
		expect(2);
		ok(typeof bondi.messaging.OUTBOX_FOLDER != 'undefined' && bondi.messaging.OUTBOX_FOLDER != null, "bondi.messaging.OUTBOX_FOLDER should not be null.");
		ok(bondi.messaging.OUTBOX_FOLDER == 2, "bondi.messaging.OUTBOX_FOLDER should be 2");
	});
	test("should contain an DRAFTS_FOLDER constant", function() {
		expect(2);
		ok(typeof bondi.messaging.DRAFTS_FOLDER != 'undefined' && bondi.messaging.DRAFTS_FOLDER != null, "bondi.messaging.DRAFTS_FOLDER should not be null.");
		ok(bondi.messaging.DRAFTS_FOLDER == 3, "bondi.messaging.DRAFTS_FOLDER should be 3.");
	});
};