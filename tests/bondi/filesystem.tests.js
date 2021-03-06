Tests.prototype.FilesystemTests = function() {
	bondi.requestFeature(function () {}, function () {}, "http://bondi.omtp.org/api/1.1/filesystem.read");
	
	module('FILE_ex_getDefaultLocation');
	test("FileSystemManager.getDefaultLocation should be implemented", function() {
		 var imageLocation = bondi.filesystem.getDefaultLocation("images");
		 ok(typeof imageLocation == "string", "Location is a string");
	 });
	module('FILE_ex_createDirectoryDeleteDirectory');
	test("Creating and Deleting directories should be possible", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(2);
			 var noexception = true;
			 var fstest = null;
			 try{
			 fstest = imageLocation.createDirectory("fstest");
			 } catch (e){
			 noexception = false;
			 }
			 ok(noexception, "createDirectory should throw no exception");
		     
			 if (fstest){
				 var win = function(f) {
				 ok(true, "directory was successfully deleted");
				 start();
				 }
				 var fail = function() {
				 ok(false, "directory was successfully deleted");
				 start(); 
				 };
				 fstest.deleteDirectory(win,fail,true)
			 }
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected of resolve");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
	module('FILE_ex_createFileDeleteFile');
	test("Creating and Deleting files should be possible", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(2);
			 var noexception = true;
			 var fstest = null;
			 try{
			 fstest = imageLocation.createFile("fstest");
			 } catch (e){
			 noexception = false;
			 }
			 ok(noexception, "createFile should throw no exception");
			 
			 if (fstest){
				ok(fstest.deleteFile(), "file was successfully deleted");
			 }
			start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected of resolve");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
	module('FILE_imp_WRITEtoFILE');
	test("Execution of a test cycle (create,open,write,close)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 var noexception = true;
			 var fswritetest = null;
			 try{
				 try {
					fswritetest = imageLocation.createFile("fswritetest");
				 }
				 catch(e){
					fswritetest = imageLocation.resolve("fswritetest");
				 }
				 var fs = fswritetest.open("w","UTF-8");				 	 
				 fs.write("FSTestwrite");
				 fs.writeBytes([0,1,2,3,4,5,6,7,8,9]);
				 fs.writeBase64("FSTestwriteBase64");
				 fs.close();
			 } catch (e){
				noexception = false;
			 }
			 ok(noexception, "test cycle should throw no exception");
			 start();
		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
	
	module('FILE_ex_FileAttr');
	test("Plausability of file attributes", function() {
		
		stop(tests.TEST_TIMEOUT);
		var win = function(imageLocation) {
			expect(23);			
		    var fswritetest = imageLocation.resolve("fswritetest");		
			
			ok(fswritetest != null, "new File object should not be null.");
			ok(typeof fswritetest == 'object', "new File object should be of type 'object'.");
			ok(fswritetest.readOnly != null && fswritetest.readOnly == false, "new File object should have a 'readOnly' property and is false: "+ fswritetest.readOnly);
			ok(fswritetest.isFile != null && fswritetest.isFile == true, "new File object should have a 'isFile' property and is true: " + fswritetest.isFile);
			ok(fswritetest.isDirectory != null && fswritetest.isDirectory == false, "new File object should have a 'isDirectory' property and is false: " + fswritetest.isDirectory);
			var date = fswritetest.created;
			ok(date != null && typeof date.getMonth == 'function', "new File object should have a 'created' property and is a date object: " + date);
			date = fswritetest.modified;
			ok(date!= null && typeof date.getMonth == 'function', "new File object should have a 'modified' property and is a date object: " + date);
			var correctPath = imageLocation.absolutePath;
			ok(fswritetest.path != null && fswritetest.path == correctPath, "new File object should have a 'path' property: " + fswritetest.path);
			ok(fswritetest.name != null, "new File object should have a 'name' property: " + fswritetest.name);
			correctPath += "/fswritetest";
			ok(fswritetest.absolutePath != null && fswritetest.absolutePath == correctPath, "new File object should have a 'absolutePath' property: " + fswritetest.absolutePath);
			ok(fswritetest.fileSize != null, "new File object should have a 'fileSize' property: " + fswritetest.fileSize);
			ok(fswritetest.metadata != null, "new File object should have a 'metadata' property: " + fswritetest.metadata);
			
			//testing the parent
			ok(fswritetest.parent != null, "new File object should have an 'parent' property.");
			var fstestparent = fswritetest.parent;
			ok(fstestparent.readOnly != null && fstestparent.readOnly == false, "new File object should have a 'readOnly' property and is false: "+ fstestparent.readOnly);
			ok(fstestparent.isFile != null && fstestparent.isFile == false, "new File object should have a 'isFile' property and is false: " + fstestparent.isFile);
			ok(fstestparent.isDirectory != null && fstestparent.isDirectory == true, "new File object should have a 'isDirectory' property and is true: " + fstestparent.isDirectory);
			var date = fstestparent.created;
			ok(date != null && typeof date.getMonth == 'function', "new File object should have a 'created' property and is a date object: " + date);
			date = fstestparent.modified;
			ok(date!= null && typeof date.getMonth == 'function', "new File object should have a 'modified' property and is a date object: " + date);
			ok(fstestparent.path != null, "new File object should have a 'path' property: " + fstestparent.path);
			ok(fstestparent.name != null, "new File object should have a 'name' property: " + fstestparent.name);
			ok(fstestparent.absolutePath != null, "new File object should have a 'absolutePath' property: " + fstestparent.absolutePath);
			ok(fstestparent.fileSize != null, "new File object should have a 'fileSize' property: " + fstestparent.fileSize);
			ok(fstestparent.metadata != null, "new File object should have a 'metadata' property: " + fstestparent.metadata);
			
			start();
		} 
		var fail = function() {
			expect(1);
			ok( false, "successCallback was expected of resolve");
			start(); 
		};
		bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
	module('FILE_ex_getRootLocations');
	test("FileSystemManager.getRootLocations should be implemented", function() {
		 var rootLocations = bondi.filesystem.getRootLocations();
		 expect(1);
		 ok(rootLocations.length >= 3, "rootLocations is an array with at least 3 locations: " + rootLocations.join(" "));
		 });
	module('FILE_ex_maxPathLength');
	test("FileSystemManager.maxPathLength should be implemented", function() {
		 expect(1);
		 ok(bondi.filesystem.maxPathLength > 0, "maxPathLength should be > 0: " + bondi.filesystem.maxPathLength);
		 });
	module('FILE_ex_resolve');
	test("Tests if a conversion from path to file handle is successful", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
		 expect(1);
		 ok( true, "successCallback was expected of resolve");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected of resolve");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
	
	module('FILE_imp_WRITEtoFILE');
	test("Execution of a test cycle (create,open,write,close)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
		 expect(1);
		 var noexception = true;
		 var fswritetest = null;
		 try{
		 try {
		 fswritetest = imageLocation.createFile("fswritetest");
		 }
		 catch(e){
		 fswritetest = imageLocation.resolve("fswritetest");
		 }
		 var fs = fswritetest.open("w","UTF-8");				 	 
		 fs.write("FSTestwrite");
		 fs.writeBytes([0,1,2,3,4,5,6,7,8,9]);
		 fs.writeBase64("FSTestwriteBase64");
		 fs.close();
		 } catch (e){
		 noexception = false;
		 }
		 ok(noexception, "test cycle should throw no exception");
		 start();
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected of resolve");
		 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
         
    module('FILE_imp_copyTo_1');
	test("Files should be copied correctly", function() {
		 stop(tests.TEST_TIMEOUT);
		 var imageLocation = null, documentsLocation = null;		 
		 var win = function(location) {
		 expect(5);		  		 
		 if (!imageLocation){
			imageLocation = location;
		 }
		 else if (!documentsLocation){
			 documentsLocation = location;
			 
			 var fswritetest = imageLocation.resolve("fswritetest");
			 ok(fswritetest != null, "fswritetest should not be null.");				
			 var copySuccess =  function(copiedFile) {
				 ok(true, "Copying fswritetest was successful");
				 ok(typeof copiedFile == 'object', "copiedFile should be of type 'object'.");
				 var correctPath = documentsLocation.absolutePath+"/fswritetest";
				 ok(copiedFile.absolutePath != null && copiedFile.absolutePath == correctPath, "copiedFile should be at correct path: " + copiedFile.absolutePath);
				 
				 ok(copiedFile.deleteFile(), "copiedFile was successfully deleted");
				 start();
			 }
			 var copyFailure =  function(error) { 
				 ok(false, "Copying fswritetest was unsuccessful");
				 start();
			 }
			 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",true); 
			 }	
		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected");
			 start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 
		 
		 });	
	module('FILE_imp_copyTo_2');
	test("Files should be copied correctly", function() {
		 stop(tests.TEST_TIMEOUT);
		 var imageLocation = null, documentsLocation = null;		 
		 var win = function(location) {
		 expect(8);		  		 
		 if (!imageLocation)
		 imageLocation = location;
		 else if (!documentsLocation){
		 documentsLocation = location;
		 
		 var fswritetest = imageLocation.resolve("fswritetest");
		 ok(fswritetest != null, "fswritetest should not be null.");
		 var counter = 0;
		 var copySuccess =  function(copiedFile) {
		 counter++;
		 ok(true, "Copying fswritetest was successful");
		 ok(typeof copiedFile == 'object', "copiedFile should be of type 'object'.");
		 var correctPath = documentsLocation.absolutePath+"/fswritetest";
		 ok(copiedFile.absolutePath != null && copiedFile.absolutePath == correctPath, "copiedFile should be at correct path: " + copiedFile.absolutePath);
		 
		 if (counter == 2){
		 ok(copiedFile.deleteFile(), "copiedFile was successfully deleted");
		 start();
		 }
		 }
		 var copyFailure =  function(error) { 
		 ok(false, "Copying fswritetest was unsuccessful");
		 start();
		 }
		 
		 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",false);
		 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",true);			 
		 }
		 
		 }
		 var fail = function() {
		 expect(1);
		 ok( false, "successCallback was expected");
		 start(); 
		 };
		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	module('FILE_imp_copyTo_3');
	test("Copying files with no file name should throw an exception", function() {
		 stop(tests.TEST_TIMEOUT);
		 expect(1);	
		 var imageLocation = null, documentsLocation = null;
		 var win = function(location) {			 	  		 
			 if (!imageLocation)
				imageLocation = location;
			 else if (!documentsLocation){
				documentsLocation = location;			 
				var fswritetest = imageLocation.resolve("fswritetest");
				var copySuccess =  function(copiedFile) {
					 ok(false, "Should throw an exception");
					 start();
				}
				var copyFailure =  function(error) { 
				if (error.code == 10004)
					 ok(true, "Correct exception was thrown");
				else
					 ok(false, "Wrong exception was thrown");
				start();
				}				
				fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath,true);		 
			}
		 }
		 var fail = function() {
			 ok( false, "successCallback was expected");
			 start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });


	module('FILE_imp_copyTo_4');
	test("Overwriting files with overwrite=no should throw an exception", function() {		 
		 stop(tests.TEST_TIMEOUT);
		 expect(1);	
		 var imageLocation = null, documentsLocation = null;
		 var win = function(location) {			 	  		 
			 if (!imageLocation)
				imageLocation = location;
			 else if (!documentsLocation)
				documentsLocation = location;
			 
			 if (imageLocation && documentsLocation){
			 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 var copySuccess =  function(copiedFile) {	
					 //start();
				 }
				 var copyFailure =  function(error) { 
					if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					else
						ok(false, "Wrong exception was thrown");
					start();
				}
				fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",false);
				fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",false);
			 
			}
		 
		 }
		 var fail = function() {
			 ok( false, "successCallback was expected");
			 start(); 
		 };         
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	module('FILE_imp_copyTo_5');
	test("Copying files with invalid characters should throw an exception", function() {
		 stop(tests.TEST_TIMEOUT);
		 expect(1)
		 var imageLocation = null, documentsLocation = null;
		 var win = function(location) {				  		 
			 if (!imageLocation)
				imageLocation = location;
			 else if (!documentsLocation)
				documentsLocation = location;
			 
			 if (imageLocation && documentsLocation){
				var fswritetest = imageLocation.resolve("fswritetest");
				var copySuccess =  function(copiedFile) {
					 ok(false, "Should not be successful");
					 start();
				 }
				 var copyFailure =  function(error) { 
					 if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					 else
						ok(false, "Wrong exception was thrown");
					start();
				 }
				 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"\0/fswritetest",true);
			}
		 }
		 var fail = function() {
			 ok( false, "successCallback was expected");
			 start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 });
	module('FILE_imp_createDirectoryDeleteDirectory_1');
	test("Creating and Deleting directories (non-recursive)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(2);
			 var noexception = true;
			 var fstest = null;
			 try{
				fstest = imageLocation.createDirectory("fstest");
				fstest.createFile("fstest.txt");
			 } catch (e){
				noexception = false;
			 }
			 ok(noexception, "createDirectory and createFile should throw no exception");
			 
			 if (fstest){
				 var win = function(f) {
					ok(false, "directory was successfully deleted but should not");
					start();
				}
				var fail = function(error) {
					if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					else
						ok(false, "Wrong exception was thrown");
					start(); 
				};
			 
				fstest.deleteDirectory(win,fail,false)
			}
		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });

	module('FILE_imp_createDirectoryDeleteDirectory_2');
	test("Creating and Deleting directories (recursive)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 var fstest = null;

			try{
				fstest = imageLocation.createDirectory("fstest");
				fstest.createFile("fstest.txt");
			} catch(e) {
				fstest = imageLocation.resolve("fstest");
			}			
			 
			 if (fstest){
				 var win = function(f) {
					ok(true, "directory was successfully deleted");
					start();
				}
				var fail = function(error) {
					ok(false, "Exception was thrown but should not have");
					start(); 
				};
			 
				fstest.deleteDirectory(win,fail,true)
			}
		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
	module('FILE_imp_createDirectoryDeleteDirectory_3');
	test("Creating and Deleting directories (file deletion)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			var fstestfile = null;
	
			 try{
				fstestfile = imageLocation.createFile("fstest.txt");
			 } catch (e){
				fstestfile = imageLocation.resolve("fstest.txt");
			 }
			 var w = function(f) {

					ok(false, "file was successfully deleted but should not");
					start();
			 };
			 var f = function(error) {
					if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					else
						ok(false, "Wrong exception was thrown");
					start();
			};
			fstestfile.deleteDirectory(w,f,false)

		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
    module('FILE_imp_createDirectoryDeleteDirectory_4');
	test("Creating and Deleting directories (file deletion)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			var fstestfile = null;
	
			 try{
				fstestfile = imageLocation.createFile("fstest.txt");
			 } catch (e){
				fstestfile = imageLocation.resolve("fstest.txt");
			 }

			 var w = function(farg) {
					ok(false, "file was successfully deleted but should not");
					start();
			 };
			 var f = function(error) {
					if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					else
						ok(false, "Wrong exception was thrown");
					start(); 
			};
			fstestfile.deleteDirectory(w,f,true)

		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
    module('FILE_imp_getDefaultLocation')
	test("FileSystemManager.getDefaultLocation should be implemented correctly", function() {
         expect(9);
		 try{
			var location = bondi.filesystem.getDefaultLocation("images");
			ok(typeof location == "string", "images location is a string");
		 }
		 catch (e){
			ok (e.code == 10001, "images location is not supported");
		 }
		 
         try{
             location = bondi.filesystem.getDefaultLocation("sdcard");
             ok(typeof location == "string", "sdcard location is a string");
		 }
		 catch (e){
            ok (e.code == 10001, "sdcard location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("videos");
         ok(typeof location == "string", "video location is a string");
         }
         catch (e){
            ok (e.code == 10001, "video location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("temp");
         ok(typeof location == "string", "temp location is a string");
         }
         catch (e){
            ok (e.code == 10001, "temp location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("documents");
         ok(typeof location == "string", "documents location is a string");
         }
         catch (e){
            ok (e.code == 10001, "documents location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("wgt-package");
         ok(typeof location == "string", "wgt-package location is a string");
         }
         catch (e){
            ok (e.code == 10001, "wgt-package location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("wgt-private");
         ok(typeof location == "string", "wgt-private location is a string");
         }
         catch (e){
            ok (e.code == 10001, "wgt-private location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("wgt-public");
         ok(typeof location == "string", "wgt-public location is a string");
         }
         catch (e){
            ok (e.code == 10001, "wgt-public location is not supported");
		 }
         try{
         location = bondi.filesystem.getDefaultLocation("wgt-temp");
         ok(typeof location == "string", "wgt-temp location is a string");
         }
        catch (e){
            ok (e.code == 10001, "wgt-temp location is not supported");
		 }
        
     });
		module('FILE_imp_moveTo_1');
	test("Files should be moved correctly", function() {		 
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
			expect(5);		  		 
			if (!imageLocation){
				imageLocation = location;
			}
			else if (!documentsLocation){
				documentsLocation = location;
		 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");				
				 var moveSuccess =  function(movedFile) { 
					 ok(true, "Moving fswritetest was successful");
					 ok(typeof movedFile == 'object', "movedFile should be of type 'object'.");
                     
                     var moveSuccess =  function(movedFile) { 
                        ok(true, "Moving movedFile back was successful");
                        ok(typeof movedFile == 'object', "movedFile should be of type 'object'.");
                        start();
                     }
                     var moveFailure =  function(error) { 
                        ok(false, "Moving movedFile back was unsuccessful");
                        start();
                     }
                     
                     movedFile.moveTo(moveSuccess, moveFailure, imageLocation.absolutePath+"/fswritetest",true); //move back
				 }
				 var moveFailure =  function(error) { 
					 ok(false, "Moving fswritetest was unsuccessful");
					 start();
				 }
				 fswritetest.moveTo(moveSuccess, moveFailure, documentsLocation.absolutePath+"/fswritetest",true);

			}	
		 }
		 var fail = function() {
			expect(1);
			ok( false, "successCallback was expected");
			start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 
		 });
	module('FILE_imp_moveTo_2'); 
	test("Files should be moved correctly", function() {		 
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
			expect(6);		  		 
			if (!imageLocation){
				imageLocation = location;
			}
			else if (!documentsLocation){
				documentsLocation = location;
		 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");				
				 var copySuccess =  function(copiedFile) { 
					 ok(true, "Copying fswritetest was successful");
					 ok(typeof copiedFile == 'object', "copiedFile should be of type 'object'.");
                     
                     var moveSuccess =  function(movedFile) { 
                         ok(true, "Moving movedFile  was successful");
						 var movedFile = documentsLocation.resolve("fswritetest");		 
						 
						 var moveSuccess =  function(movedFile) { 
							 ok(true, "Moving movedFile back was successful");
							 ok(typeof movedFile == 'object', "movedFile should be of type 'object'.");
							 start();
						 }
						 var moveFailure =  function(error) { 
							 ok(false, "Moving movedFile back was unsuccessful");
							 start();
						 }
						 
						 movedFile.moveTo(moveSuccess, moveFailure, imageLocation.absolutePath+"/fswritetest",true); //move back
                        
                     }
                     var moveFailure =  function(error) { 
						ok(false, "Moving (overwriting) fswritetest was unsuccessful");
						start();
                        
                     }
                     
                     fswritetest.moveTo(moveSuccess, moveFailure, documentsLocation.absolutePath+"/fswritetest",true); //move now
				 }
				 var copyFailure =  function(error) { 
					 ok(false, "Copying fswritetest was unsuccessful");
					 start();
				 }
				 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",true); //first copy

			}	
		 }
		 var fail = function() {
			expect(1);
			ok( false, "successCallback was expected");
			start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 
		 });
	module('FILE_imp_moveTo_3');
	test("Files should be moved correctly", function() {		 
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
			expect(2);
			if (!imageLocation){
				imageLocation = location;
			}
			else if (!documentsLocation){
				documentsLocation = location;
		 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");				
				 var moveSuccess =  function(movedFile) { 
					 ok(false, "Moving fswritetest was successful but should not");
					 start();
				 }
				 var moveFailure =  function(error) { 
                    if (error.code == 10004)
                        ok(true, "Correct exception was thrown when file was moved");
                    else
                        ok(false, "Wrong exception was thrown");
					 start();
				 }
				 fswritetest.moveTo(moveSuccess, moveFailure, documentsLocation.absolutePath,true); //no filename

			}	
		 }
		 var fail = function() {
			expect(1);
			ok( false, "successCallback was expected");
			start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 
		 });
	module('FILE_imp_moveTo_4');
	test("Files should be moved correctly", function() {		 
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
		 expect(4);
			if (!imageLocation){
				imageLocation = location;
			}
			else if (!documentsLocation){
				documentsLocation = location;
		 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");				
				 var copySuccess =  function(copiedFile) { 
					 ok(true, "Copying fswritetest was successful");
	
                     var moveSuccess =  function(movedFile) { 
                        ok(false, "Moving fswritetest was successful but should not");
                        start();
                     }
                    var moveFailure =  function(error) { 
                        if (error.code == 10004)
                            ok(true, "Correct exception was thrown when file was moved");
                        else
                            ok(false, "Wrong exception was thrown");
                        
                        ok(copiedFile.deleteFile(), "Copied File was successfully deleted");
                        start();
                    }
				 
                    fswritetest.moveTo(moveSuccess, moveFailure, documentsLocation.absolutePath+"/fswritetest",false); //move the same original file
            
				 }
				 var copyFailure =  function(error) { 
					 ok(false, "Copying fswritetest was unsuccessful");
					 start();
				 }
				 fswritetest.copyTo(copySuccess, copyFailure, documentsLocation.absolutePath+"/fswritetest",true); //copy first
			}	
		 }
		 var fail = function() {
			expect(1);
			ok( false, "successCallback was expected");
			start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));

		 
		 });
	module('FILE_imp_moveTo_5');
	test("Files should be moved correctly", function() {		 
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
			expect(2);
			if (!imageLocation){
				imageLocation = location;
			}
			else if (!documentsLocation){
				documentsLocation = location;
		 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");				
				 var moveSuccess =  function(movedFile) { 
					 ok(false, "Moving fswritetest was successful but should not");
					 start();
				 }
				 var moveFailure =  function(error) { 
                    if (error.code == 10004)
                        ok(true, "Correct exception was thrown when file was moved");
                    else
                        ok(false, "Wrong exception was thrown");
					 start();
				 }
				 fswritetest.moveTo(moveSuccess, moveFailure, documentsLocation.absolutePath+"/fswr\0itetest\0",true); //invalid characters

			}	
		 }
		 var fail = function() {
			expect(1);
			ok( false, "successCallback was expected");
			start(); 
		 };		 
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("documents"));
		 
		 });
	module('FILE_imp_READfromFILE');
	test("Execution of a test cycle (open,read,close)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 //FILE_imp_WRITEtoFILE	
			 var noexception = true;
			 var fswritetest = null;
			 try{
				 try{
					 fswritetest = imageLocation.resolve("fswritetest");				 
				 } catch (e) {
					fswritetest = imageLocation.createFile("fswritetest");
				 }
				 var fs = fswritetest.open("r","UTF-8");
				 // read test has to be restricted to the first 10 chars because the write test fills the rest of the file with non-unicode base64 characters that will cause an exception
                 var text = fs.read(10); //fswritetest.fileSize
				 ok(typeof text == "string", "read output: "+ text + " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
				 var raw = fs.readBytes(0);
				 ok(raw.length > 0, "readBytes output: "+ raw.join(" ") + " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
				 var base64 = fs.readBase64(0);
				 ok(typeof base64 == "string", "readBas64 output: "+ base64+ " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
				 fs.close();
				 ok(fswritetest.deleteFile(), "file was successfully deleted");
			 } catch (e){
				 //alert(e.message);
				noexception = false;
			 }
			 ok(noexception, "test cycle should throw no exception");
			 start();
		 }
		 var fail = function() {
			 expect(1);
			 ok( false, "successCallback was expected of resolve");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
	module('FILE_imp_resolve_1');
	test("Tests if a conversion from path to file handle is successful", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
             expect(2);
             ok( true, "successCallback was expected of resolve");
             ok(typeof imageLocation == 'object' && typeof imageLocation.absolutePath == 'string', "location should be a file.");
             start();
		 }
		 var fail = function() {
             expect(1);
             fail( true, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
	module('FILE_imp_resolve_2');
	test("Tests if a conversion from path to file handle is successful", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 fail( true, "successCallback should not be called");
			 start();
		 }
		 var fail = function(error) {
			 expect(1);
			 if (error.code == 10001)
				ok(true, "Correct exception was thrown");
			 else
				ok(false, "Wrong exception was thrown");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,null);
		 });
	module('FILE_para_createDirectoryDeleteDirectory_1');
	test("Testing error cases for creating and deleting directories", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(3);
			 var noexception = true;
			 var fstest = null;
			 try{
                fstest = imageLocation.createDirectory("fstest");
			 } catch (e){
                noexception = false;
			 }
			 ok(noexception, "createDirectory should throw no exception");
             
             var exception = false;
			 try{
                imageLocation.createDirectory("fstest");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createDirectory again should throw an exception (IO_ERROR)");
		     
			 if (fstest){
				 var win = function(f) {
                     ok(true, "directory was successfully deleted");
                     start();
				 }
				 var fail = function() {
                     ok(false, "directory was successfully deleted");
                     start(); 
				 };
				 fstest.deleteDirectory(win,fail,true)
			 }
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
    module('FILE_para_createDirectoryDeleteDirectory_2');
    test("Testing error cases for creating and deleting directories", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 var exception = false;
			 var fstest = null;
			 try{
                fstest = imageLocation.createDirectory("fst\0est");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createDirectory should throw an exception (IO_ERROR)");

		     
			 if (fstest){
				 var win = function(f) {
                     ok(true, "directory was successfully deleted");
                     start();
				 }
				 var fail = function() {
                     ok(false, "directory was successfully deleted");
                     start(); 
				 };
				 fstest.deleteDirectory(win,fail,true)
			 }
			 else
				start();
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
    
	module('FILE_para_createDirectoryDeleteDirectory_3');
    test("Testing error cases for creating and deleting directories", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(2);
			 var noexception = true;
			 var fstest = null;
			 try{
                fstest = imageLocation.createDirectory("/fstest/fstest"); 
			 } catch (e){
				noexception = false;
			 }
			 ok(noexception, "createDirectory should not throw an exception (IO_ERROR)");

		     
			 if (fstest){
				 var win = function(f) {
                     ok(true, "directories were successfully deleted");
                     start();
				 }
				 var fail = function() {
                     ok(false, "directories were successfully deleted");
                     start(); 
				 };
				 fstest.parent.deleteDirectory(win,fail,true)
			 }
			 else
				start();
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
    module('FILE_para_createDirectoryDeleteDirectory_4');
	test("Testing error cases for creating and deleting directories", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(3);
			 var noexception = true;
			 var fstest = null;
			 try{
                fstest = imageLocation.createDirectory("/fstest");
			 } catch (e){
                noexception = false;
			 }
			 ok(noexception, "createDirectory should throw no exception");
             
             var exception = false;
			 try{
                imageLocation.createDirectory("/fstest");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createDirectory again should throw an exception (IO_ERROR)");
		 
			 if (fstest){
				 var win = function(f) {
					 ok(true, "directory was successfully deleted");
					 start();
				 }
				 var fail = function() {
					 ok(false, "directory was successfully deleted");
					 start(); 
				 };
				 fstest.deleteDirectory(win,fail,true)
			 }
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
		 });
	module('FILE_para_createFileDeleteFile_1');
	test("Testing error cases for creating and Deleting files", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(3);
			 var noexception = true;
			 var fstest = null;
			 try{
                fstest = imageLocation.createFile("fstest");
			 } catch (e){
			 noexception = false;
			 }
			 ok(noexception, "createFile should throw no exception");
			 
             var exception = false;
			 try{
                imageLocation.createFile("fstest");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createFile again should throw an exception (IO_ERROR)");
             
			 if (fstest){
				ok(fstest.deleteFile(), "file was successfully deleted");
			 }
			start();
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
	module('FILE_para_createFileDeleteFile_2');
	test("Testing error cases for creating and Deleting files", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 var exception = false;
			 var fstest = null;
			 try{
                fstest = imageLocation.createFile("fs/test");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createFile should throw an exception (IO_ERROR)");
             
			 if (fstest){
				ok(fstest.deleteFile(), "file was successfully deleted");
			 }
			 start();
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});	
	module('FILE_para_createFileDeleteFile_3');
	test("Testing error cases for creating and Deleting files", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 expect(1);
			 var exception = false;
			 var fstest = null;
			 try{
                fstest = imageLocation.createFile("/fstest/fstest");
			 } catch (e){
                if (e.code == 10004)
                    exception = true;
			 }
			 ok(exception, "createFile should throw an exception (IO_ERROR)");
             
			 if (fstest){
				ok(fstest.deleteFile(), "file was successfully deleted");
			 }
			start();
		 }
		 var fail = function() {
             expect(1);
             ok( false, "successCallback was expected of resolve");
             start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	});
    module('FILE_para_getDefaultLocation')
	test("Testing faulty parameters", function() {
		 expect(3);
		 var location;
		 try{
			location= bondi.filesystem.getDefaultLocation("music",1);
		 }
		 catch (e){
			ok (e.code == 10001, "Exception was thrown correctly (INVALID_ARGUMENT_ERROR)");
		 }		 
         try{
             location = bondi.filesystem.getDefaultLocation("images","size");
		 }
		 catch (e){
			 ok (e.code == 10001, "Exception was thrown correctly (INVALID_ARGUMENT_ERROR)");
		 }
         try{
			location = bondi.filesystem.getDefaultLocation("images");
         }
		 catch (e){}
		 ok(typeof location == "string", "images location is a string");       
     });
	
	module('FILE_para_open_1_2')
	test("Testing faulty parameters", function() {
	  stop(tests.TEST_TIMEOUT);
	  var win = function(imageLocation) {
		  expect(3);
		  fstest = imageLocation.createFile("fstest");
		  var noexception = true;
		  var fs;
		  try{
			fs = fstest.open("a","UTF-8"); //legitimate parameters
			fs.close();
		  }
		  catch (e){
			noexception = false;
		  }		 
		  ok(noexception, "open should throw no exception");
		 
		  var exception = false;
		  try{
			fs = fstest.open("a","xyz-123"); //unsupported encoding
			fs.close();
		  }
		  catch (e){
		    if (e.code == 10001)
				exception = true;
		  }
		  ok(exception, "open should throw an exception (INVALID_ARGUMENT_ERROR)");
		 
		  if (fstest){
			ok(fstest.deleteFile(), "file was successfully deleted");
		  }
		  start();
	  }
	  var fail = function() {
		  expect(1);
		  ok( false, "successCallback was expected of resolve");
		  start(); 
	  };
	  bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	  });
	module('FILE_para_open_3')
	test("Testing faulty parameters", function() {
	  stop(tests.TEST_TIMEOUT);
	  var win = function(imageLocation) {
		  expect(2);
		  fstest = imageLocation.createDirectory("fstest");
	 
		  var exception = false;
		  try{
			var fs = fstest.open("r","UTF-8"); //opening a directory
			fs.close();
		  }
		  catch (e){
		    if (e.code == 10004)
				exception = true;
		  }
		  ok(exception, "open should throw an exception (IO_ERROR)");
		 
		 if (fstest){
			 var win = function(f) {
				 ok(true, "directory was successfully deleted");
				 start();
			 }
			 var fail = function() {
				 ok(false, "directory was successfully deleted");
				 start(); 
			 };
			 fstest.deleteDirectory(win,fail,true)
		 } else
			start();
	  }
	  var fail = function() {
		  expect(1);
		  ok( false, "successCallback was expected of resolve");
		  start(); 
	  };
	  bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"));
	  });
	module('FILE_para_resolve_1');
	test("Testing faulty parameters", function() {
		 stop(tests.TEST_TIMEOUT);
		 expect(1);
		 var win = function(imageLocation) {			 
			 fail( true, "errorCallback was expected of resolve");
			 start();
		 }
		 var fail = function(e) {
			 ok(e.code==10001, "resolve should throw an exception (INVALID_ARGUMENT_ERROR) e=" + e.code);
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images")+"/data/resolvetest/resolve");
		 });
	module('FILE_para_resolve_2');
	test("Testing faulty parameters", function() {
		 stop(tests.TEST_TIMEOUT);
		 expect(1);
		 var win = function(imageLocation) {			 
			 fail( true, "errorCallback was expected of resolve");
			 start();
		 }
		 var fail = function(e) {
			 ok(e.code==10001, "resolve should throw an exception (INVALID_ARGUMENT_ERROR)");
			 start(); 
		 };
		 bondi.filesystem.resolve(win,fail,bondi.filesystem.getDefaultLocation("images"),"a");
		 });
	module('FILE_para_registerEventListener')
	test("Testing faulty parameters", function() {
		 if (typeof bondi.filesystem.registerEventListener != "undefined"){
			 expect(1)
			 try{
				bondi.filesystem.registerEventListener("parametertest")
			 }
			 catch (e) {
				ok(e.code==10001, "registerEventListener should throw an exception (INVALID_ARGUMENT_ERROR)");
			 }
		 }
		 });
	module('FILE_para_unregisterEventListener')
	test("Testing faulty parameters", function() {
		 if (typeof bondi.filesystem.unregisterEventListener != "undefined"){
			 expect(1)
			 try{
				bondi.filesystem.unregisterEventListener("parametertest")
			 }
			 catch (e) {
				ok(e.code==10001, "unregisterEventListener should throw an exception (INVALID_ARGUMENT_ERROR)");
			 }
		 }
		 });
	 
	};