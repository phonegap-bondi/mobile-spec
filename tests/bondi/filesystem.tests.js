Tests.prototype.FilesystemTests = function() {	
	
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
				 fail(true, "directory was successfully deleted");
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
			 //FILE_imp_WRITEtoFILE	
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
	
	module('FILE_imp_copyTo_1');
	test("Files should be copied correctly", function() {		 
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
				 stop(tests.TEST_TIMEOUT);
				 var copySuccess =  function(copiedFile) { 
					 ok(true, "Copying fswritetest was successful");
					 ok(typeof copiedFile == 'object', "copiedFile should be of type 'object'.");
					 var correctPath = documentsLocation.absolutePath+"/fswritetest";
					 ok(copiedFile.absolutePath != null && copiedFile.absolutePath == correctPath, "copiedFile should be at correct path: " + copiedFile.absolutePath);
					 
					 ok(copiedFile.deleteFile(), "copiedFile was successfully deleted");
					 start();
				 }
				 var copyFailure =  function(error) { 
					 fail(true, "Copying fswritetest was unsuccessful");
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
		 var imageLocation = null, documentsLocation = null;
		 stop(tests.TEST_TIMEOUT);
		 var win = function(location) {
			 expect(8);		  		 
			 if (!imageLocation)
				imageLocation = location;
			 else if (!documentsLocation)
				documentsLocation = location;
			 
			 if (imageLocation && documentsLocation){
			 
				 var fswritetest = imageLocation.resolve("fswritetest");
				 ok(fswritetest != null, "fswritetest should not be null.");
				 var counter = 0;
				stop(tests.TEST_TIMEOUT); 
				var copySuccess =  function(copiedFile) {
					 counter++;
					 ok(true, "Copying fswritetest was successful");
					 ok(typeof copiedFile == 'object', "copiedFile should be of type 'object'.");
					 var correctPath = documentsLocation.absolutePath+"/fswritetest";
					 ok(copiedFile.absolutePath != null && copiedFile.absolutePath == correctPath, "copiedFile should be at correct path: " + copiedFile.absolutePath);
					 
					 if (counter == 2)
						 ok(copiedFile.deleteFile(), "copiedFile was successfully deleted");
					 start();
				 }
				var copyFailure =  function(error) { 
					fail(true, "Copying fswritetest was unsuccessful");
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
					fail(true, "directory was successfully deleted but should not");
					start();
				}
				var fail = function(error) {
					if (error.code == 10004)
						ok(true, "Correct exception was thrown");
					else
						fail(true, "Wrong exception was thrown");
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
					fail(true, "Exception was thrown but should not have");
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
                        fail(true, "Moving movedFile back was unsuccessful");
                        start();
                     }
                     
                     movedFile.moveTo(moveSuccess, moveFailure, imageLocation.absolutePath+"/fswritetest",true); //move back
				 }
				 var moveFailure =  function(error) { 
					 fail(true, "Moving fswritetest was unsuccessful");
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
	module('FILE_imp_READfromFILE');
	test("Execution of a test cycle (open,read,close)", function() {
		 stop(tests.TEST_TIMEOUT);
		 var win = function(imageLocation) {
			 //FILE_imp_WRITEtoFILE	
			 var noexception = true;
			 var fswritetest = null;
			 try{
                 fswritetest = imageLocation.resolve("fswritetest");				 
				 var fs = fswritetest.open("r","UTF-8");
                 var text = fs.read(fswritetest.fileSize);				 	 
				 ok(typeof text == "string", "read output: "+ text + " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
                 var raw = fs.readBytes(0);
                 ok(raw.length > 0, "readBytes output: "+ raw.join(" ") + " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
                 var base64 = fs.readBase64(0);
                 ok(typeof base64 == "string", "readBas64 output: "+ base64+ " bytesAvailable: "+fs.bytesAvailable + " position: "+fs.position + " eof: "+fs.eof)
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
				fail(true, "Wrong exception was thrown");
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
                     fail(true, "directory was successfully deleted");
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
                fstest = imageLocation.createDirectory("fstest:"); //TODO: any name limitations for folders??
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
                     fail(true, "directory was successfully deleted");
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
			 expect(1);
			 var exception = false;
			 var fstest = null;
			 try{
                fstest = imageLocation.createDirectory("/fstest/fstest"); 
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
                     fail(true, "directory was successfully deleted");
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
					 fail(true, "directory was successfully deleted");
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
			 expect(2);
			 var exception = false;
			 var fstest = null;
			 try{
                fstest = imageLocation.createFile("fstest:"); //TODO: any illegal characters for file names ?
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
	test("FileSystemManager.getDefaultLocation should be implemented correctly", function() {
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
		 catch (e){}
		 ok(typeof location == "string", "images location is a string");
         try{
		 location = bondi.filesystem.getDefaultLocation("images");
         }
		 catch (e){}
		 ok(typeof location == "string", "images location is a string");
         
       
     });
};