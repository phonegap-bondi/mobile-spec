Tests.prototype.FilesystemExistencyTests = function() {	
	
	module('FileSystemManager (bondi.filesystem)');
	test("should exist", function() {
		 expect(1);
		 ok(bondi.filesystem != null, "bondi.filesystem should not be null.");
		 });
	test("should contain a bondi.filesystem.getDefaultLocation function", function() {
		 expect(2);
		 ok(typeof bondi.filesystem.getDefaultLocation != 'undefined' && bondi.filesystem.getDefaultLocation!= null, "bondi.filesystem.getDefaultLocation should not be null.");
		 ok(typeof bondi.filesystem.getDefaultLocation == 'function', "bondi.filesystem.getDefaultLocation should be a function.");
		 });
	test("should contain a bondi.filesystem.getRootLocations function", function() {
		 expect(2);
		 ok(typeof bondi.filesystem.getRootLocations != 'undefined' && bondi.filesystem.getRootLocations!= null, "bondi.filesystem.getRootLocations should not be null.");
		 ok(typeof bondi.filesystem.getRootLocations == 'function', "bondi.filesystem.getRootLocations should be a function.");
		 });
	test("should contain a bondi.filesystem.resolve function", function() {
		 expect(2);
		 ok(typeof bondi.filesystem.resolve != 'undefined' && bondi.filesystem.resolve!= null, "bondi.filesystem.resolve should not be null.");
		 ok(typeof bondi.filesystem.resolve == 'function', "bondi.filesystem.resolve should be a function.");
		 });
	
    module('File (bondi.filesystem)');
    test("should be able to instantiate a File object with properties from default documents location", function () {
		 stop(tests.TEST_TIMEOUT);		
		 var win = function(file) {
		 expect(12);
		 ok(file != null, "new File object should not be null.");
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(file.parent != null, "new File object should have an 'parent' property.");
		 ok(file.readOnly != null, "new File object should have a 'readOnly' property.");
		 ok(file.isFile != null, "new File object should have a 'isFile' property.");
		 ok(file.isDirectory != null, "new File object should have a 'isDirectory' property.");
		 ok(file.created != null, "new File object should have a 'created' property.");
		 ok(file.modified != null, "new File object should have a 'modified' property.");
		 ok(file.path != null, "new File object should have a 'path' property.");
		 ok(file.name != null, "new File object should have a 'name' property.");
		 ok(file.absolutePath != null, "new File object should have a 'absolutePath' property.");
		 ok(file.fileSize != null, "new File object should have a 'fileSize' property.");
		 start();
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a listFiles function", function() {
		 stop(tests.TEST_TIMEOUT);	
		 var win = function(file) {
		 expect(3);        
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.listFiles != 'undefined' && file.listFiles!= null, "listFiles should not be null.");
		 ok(typeof file.listFiles == 'function', "listFiles should be a function.");
		 start(); 
		 };
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a open function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.open != 'undefined' && file.open!= null, "open should not be null.");
		 ok(typeof file.open == 'function', "open should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a copyTo function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.copyTo != 'undefined' && file.copyTo!= null, "copyTo should not be null.");
		 ok(typeof file.copyTo == 'function', "copyTo should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a moveTo function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.moveTo != 'undefined' && file.moveTo!= null, "moveTo should not be null.");
		 ok(typeof file.moveTo == 'function', "moveTo should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a createDirectory function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.createDirectory != 'undefined' && file.createDirectory!= null, "createDirectory should not be null.");
		 ok(typeof file.createDirectory == 'function', "createDirectory should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a createFile function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.createFile != 'undefined' && file.createFile!= null, "createFile should not be null.");
		 ok(typeof file.createFile == 'function', "createFile should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a resolve function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.resolve != 'undefined' && file.resolve!= null, "resolve should not be null.");
		 ok(typeof file.resolve == 'function', "resolve should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a deleteDirectory function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.deleteDirectory != 'undefined' && file.deleteDirectory!= null, "deleteDirectory should not be null.");
		 ok(typeof file.deleteDirectory == 'function', "deleteDirectory should be a function.");		 
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	test("should contain a deleteFile function", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(file) {
		 expect(3);
		 ok(typeof file == 'object', "new File object should be of type 'object'.");
		 ok(typeof file.deleteFile != 'undefined' && file.deleteFile!= null, "deleteFile should not be null.");
		 ok(typeof file.deleteFile == 'function', "deleteFile should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
    
    module('FileStream (bondi.filesystem)');
    test("should be able to instantiate a FileStream object with properties by opening or resolving a created file", function () {		 
		 stop(tests.TEST_TIMEOUT);
		 var win = function(documentsLocation) {
		 expect(12);
		 ok(typeof documentsLocation == 'object', "new File object should be of type 'object'.");
		 var file;
		 try {
		 file = documentsLocation.resolve("testFile");
		 }catch (e) {			
		 file = documentsLocation.createFile("testFile");
		 }
		 var fileStream = file.open("w","UTF-8");
		 ok(fileStream != null, "new FileStream object should not be null.");
		 ok(typeof fileStream == 'object', "new FileStream object should be of type 'object'.");
		 ok(fileStream.eof != null, "new FileStream object should have an 'eof' property.");
		 ok(fileStream.position != null, "new FileStream object should have an 'position' property.");
		 ok(fileStream.bytesAvailable != null, "new FileStream object should have an 'bytesAvailable' property.");
		 ok(typeof fileStream.read == 'function', "read should be a function.");
		 ok(typeof fileStream.readBytes == 'function', "readBytes should be a function.");
		 ok(typeof fileStream.readBase64 == 'function', "readBase64 should be a function.");
		 ok(typeof fileStream.write == 'function', "write should be a function.");
		 ok(typeof fileStream.writeBytes == 'function', "write should be a function.");
		 ok(typeof fileStream.writeBase64 == 'function', "write should be a function.");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };

		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	
};