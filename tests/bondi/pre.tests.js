Tests.prototype.CleanUpTests = function() {
	module('Pre-Processing');

		test("Preparing a clean file i/o test environment - Check 1", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 var innerwin=function(){
					ok(true,"directory fstest in default location of 'images' successfully deleted"); 
				 };
				 
				 var innerfail=function(){
					ok(false,"diretory fstest in default location of 'images' could not be deleted, please check"); 
				 }
				 
				 imageLocation.deleteDirectory(innerwin, innerfail, true);
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fstest in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"fstest");	
			 });
		
		test("Preparing a clean file i/o test environment - Check 2", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 imageLocation.deleteFile();
				 ok(true, "/fstest in default location of 'images' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fstest in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"fstest");	
			 });
		
		test("Preparing a clean file i/o test environment - Check 3", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 imageLocation.deleteFile();
				 ok(true, "/fswritetest in default location of 'images' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fswritetest in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"fswritetest");	
			 });

		test("Preparing a clean file i/o test environment - Check 4", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 imageLocation.deleteFile();
				 ok(true, "/fstest.txt in default location of 'images' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fstest.txt in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"fstest.txt");	
			 });
		
		
		test("Preparing a clean file i/o test environment - Check 5", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 imageLocation.deleteFile();
				 ok(true, "/fswritetest in default location of 'documents' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fswritetest in default location of 'documents' non-existent as expected");
			 start(); 
			 };
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents")+"fswritetest");	
			 });
		
		test("Preparing a clean file i/o test environment - Check 6", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 try {
					 imageLocation.deleteFile();
				 } catch (e) {
				 }
				 ok(true, "/fswritetest in default location of 'documents' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
				 expect(1);
				 ok( true, "\0/fswritetest in default location of 'documents' non-existent as expected");
				 start(); 
			 };
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents")+"\0/fswritetest");	
		});
		
		test("Preparing a clean file i/o test environment - Check 7", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
				 expect(1);
				 imageLocation.deleteFile();
				 ok(true, "//fswr\0itetest\0 in default location of 'documents' successfully deleted");
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "//fswr\0itetest\0 in default location of 'documents' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents")+"/fswr\0itetest\0");	
			 });
		
		test("Preparing a clean file i/o test environment - Check 8", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
			 expect(1);
			 imageLocation.deleteDirectory(ok(true, "/fst\0est in default location of 'images' successfully deleted"),
										   ok(false,"/fst\0est in default location of 'images' could not be deleted, please check"),true);	   
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/fst\0est in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"fs/test");	
			 });
		
		test("Preparing a clean file i/o test environment - Check 9", function() {
			 
			 stop(tests.TEST_TIMEOUT);
			 var win = function(imageLocation) {
			 expect(1);
			 var innerwin=function(){
					ok(true,"directory data in default location of 'images' successfully deleted"); 
				 };
				 
				 var innerfail=function(){
					ok(false,"diretory data in default location of 'images' could not be deleted, please check"); 
				 }
				 
				 imageLocation.deleteDirectory(innerwin, innerfail, true);
				 start();
			 };
			 
			 var fail = function() {
			 expect(1);
			 ok( true, "/data/resolvetest/resolve in default location of 'images' non-existent as expected");
			 start(); 
			 };
			 
			 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"data");	
			 });
	

	
	//GPS pre-Test	
	test("getCurrentPosition is used to check if GPS is available", function() {
		 stop();
		 expect(1);
		 var win = function(p) { 
			 ok( true, "successfully retrieved position");
			 gpsAvailable = true;
			 start();
		 };
		 var fail = function() {			 
			ok( true, "no position was acquired"); 
            start(); 
		 };
		 var options = {}; options.timeout = 20000;
		 bondi.geolocation.getCurrentPosition(win, fail, options);
		 });
};