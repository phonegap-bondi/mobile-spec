Tests.prototype.BondiTests = function() {	
	module('Bondi (bondi)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi != null, "bondi should not be null.");
	});

	test("should contain a requestFeature function", function() {
		expect(5);
		ok(typeof bondi.requestFeature != 'undefined' && bondi.requestFeature != null, "bondi.requestFeature should not be null.");
		ok(typeof bondi.requestFeature == 'function', "bondi.requestFeature should be a function.");
		var win=function(){ok(true,"bondi.requestFeature must be available");};
		var fail=function(){ok(true,"bondi.requestFeature must be available");};
		var pendingOperation=bondi.requestFeature(win,fail,"http://bondi.omtp.org/api/1.1/messaging");

		win=function(p){ok(false,"bondi.requestFeature unknown feature must raise NOT_FOUND_ERROR");};
		fail=function(p){ok(p.code==10002,"bondi.requestFeature unknown feature must raise NOT_FOUND_ERROR");};
		pendingOperation=bondi.requestFeature(win,fail,"http://bondi.omtp.org/api/messaging");

		fail=function(p){ok(p.code==10001,"bondi.requestFeature invalid success callback must raise INVALID_ARGUMENT_ERROR");};
		pendingOperation=bondi.requestFeature(null,fail,"http://bondi.omtp.org/api/messaging");		
	});

	
	test("should contain a getFeatures function", function() {
		ok(typeof bondi.getFeatures != 'undefined' && bondi.getFeatures != null, "bondi.getFeatures should not be null.");
		ok(typeof bondi.getFeatures == 'function', "bondi.getFeatures should be a function.");

		var featurelist=bondi.getFeatures();
		ok(typeof featurelist != 'undefined' && featurelist != null && featurelist.length>=0, "bondi.getFeatures should return a featurelist.");
		
		var featureArray=new Array();
		featureArray[0]="http://bondi.omtp.org/api/1.1/filesystem.read";
		featureArray[1]="http://bondi.omtp.org/api/1.1/filesystem.write";
		featureArray[2]="http://bondi.omtp.org/api/1.1/camera.access";
		featureArray[3]="http://bondi.omtp.org/api/1.1/camera.capture";
		featureArray[4]="http://bondi.omtp.org/api/1.1/geolocation.position";
		if (messageImplemented){
		 featureArray[5]="http://bondi.omtp.org/api/1.1/messaging.sms.send";
		 featureArray[6]="http://bondi.omtp.org/api/1.1/messaging.sms.subscribe";
		} 
		for (i = 0; i < featureArray.length; i++)
		{
			var found=false;
			for (j=0; j<featurelist.length; j++)
			{				
				if (featurelist[j].match("^"+featureArray[i])==featureArray[i])				
				{
					found=true;
				}
			}
			ok(found, "Feature "+featureArray[i]+" should exist.")				
		}
	});


	test("should contain a cancel function", function() {
		expect(3);
		var pendingOperation = new PendingOperation();
		ok(typeof pendingOperation.cancel != 'undefined' && pendingOperation.cancel != null, "PendingOperation.cancel should not be null.");
		ok(typeof pendingOperation.cancel == 'function', "PendingOperation.cancel should be a function.");
		var win=function(){};
		var fail=function(){};
		pendingOperation=bondi.requestFeature(win,fail,"http://bondi.omtp.org/api/messaging");
		if (typeof pendingOperation == 'object' && pendingOperation.cancel()==false)
			ok(true,"PendingOperation.cancel must return false on unavailable features");
	});
	
};