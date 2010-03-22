Tests.prototype.BondiTests = function() {	
	module('Bondi (bondi)');
	test("should exist", function() {
  		expect(1);
  		ok(bondi != null, "bondi should not be null.");
	});
	test("should contain a requestFeature function", function() {
		expect(2);
		ok(typeof bondi.requestFeature != 'undefined' && bondi.camera.getCameras != null, "bondi.requestFeature should not be null.");
		ok(typeof bondi.requestFeature == 'function', "bondi.requestFeature should be a function.");
	});
};