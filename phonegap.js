if (typeof(DeviceInfo) != 'object')
    DeviceInfo = {};

/**
 * This represents the PhoneGap API itself, and provides a global namespace for accessing
 * information about the state of PhoneGap.
 * @class
 */
PhoneGap = {
    queue: {
        ready: true,
        commands: [],
        timer: null
    },
    _constructors: []
};

/**
 * Boolean flag indicating if the PhoneGap API is available and initialized.
 */ // TODO: Remove this, it is unused here ... -jm
PhoneGap.available = DeviceInfo.uuid != undefined;

/**
 * Add an initialization function to a queue that ensures it will run and initialize
 * application constructors only once PhoneGap has been initialized.
 * @param {Function} func The function callback you want run once PhoneGap is initialized
 */
PhoneGap.addConstructor = function(func) {
    var state = document.readyState;
    if ( ( state == 'loaded' || state == 'complete' ) && DeviceInfo.uuid != null )
	{
		func();
	}
    else
	{
        PhoneGap._constructors.push(func);
	}
};

(function() 
 {
    var timer = setInterval(function()
	{
							
		var state = document.readyState;
							
        if ( ( state == 'loaded' || state == 'complete' ) && DeviceInfo.uuid != null )
		{
			clearInterval(timer); // stop looking
			// run our constructors list
			while (PhoneGap._constructors.length > 0) 
			{
				var constructor = PhoneGap._constructors.shift();
				try 
				{
					constructor();
				} 
				catch(e) 
				{
					if (typeof(debug['log']) == 'function')
					{
						debug.log("Failed to run constructor: " + debug.processMessage(e));
					}
					else
					{
						alert("Failed to run constructor: " + e.message);
					}
				}
            }
			// all constructors run, now fire the deviceready event
			var e = document.createEvent('Events'); 
			e.initEvent('deviceready');
			document.dispatchEvent(e);
		}
    }, 1);
})();


/**
 * Execute a PhoneGap command in a queued fashion, to ensure commands do not
 * execute with any race conditions, and only run when PhoneGap is ready to
 * recieve them.
 * @param {String} command Command to be run in PhoneGap, e.g. "ClassName.method"
 * @param {String[]} [args] Zero or more arguments to pass to the method
 */
PhoneGap.exec = function() {
    PhoneGap.queue.commands.push(arguments);
    if (PhoneGap.queue.timer == null)
        PhoneGap.queue.timer = setInterval(PhoneGap.run_command, 10);
};

/**
 * Internal function used to dispatch the request to PhoneGap.  It processes the
 * command queue and executes the next command on the list.  If one of the
 * arguments is a JavaScript object, it will be passed on the QueryString of the
 * url, which will be turned into a dictionary on the other end.
 * @private
 */
PhoneGap.run_command = function() {
    if (!PhoneGap.available || !PhoneGap.queue.ready)
        return;

    PhoneGap.queue.ready = false;

    var args = PhoneGap.queue.commands.shift();
    if (PhoneGap.queue.commands.length == 0) {
        clearInterval(PhoneGap.queue.timer);
        PhoneGap.queue.timer = null;
    }

    var uri = [];
    var dict = null;
    for (var i = 1; i < args.length; i++) {
        var arg = args[i];
        if (arg == undefined || arg == null)
            arg = '';
        if (typeof(arg) == 'object')
            dict = arg;
        else
            uri.push(encodeURIComponent(arg));
    }
    var url = "gap://" + args[0] + "/" + uri.join("/");
    if (dict != null) {
        var query_args = [];
        for (var name in dict) {
            if (typeof(name) != 'string')
                continue;
            query_args.push(encodeURIComponent(name) + "=" + encodeURIComponent(dict[name]));
        }
        if (query_args.length > 0)
            url += "?" + query_args.join("&");
    }
    document.location = url;

};
/**
 * This class contains acceleration information
 * @constructor
 * @param {Number} x The force applied by the device in the x-axis.
 * @param {Number} y The force applied by the device in the y-axis.
 * @param {Number} z The force applied by the device in the z-axis.
 */
function Acceleration(x, y, z) {
	/**
	 * The force applied by the device in the x-axis.
	 */
	this.x = x;
	/**
	 * The force applied by the device in the y-axis.
	 */
	this.y = y;
	/**
	 * The force applied by the device in the z-axis.
	 */
	this.z = z;
	/**
	 * The time that the acceleration was obtained.
	 */
	this.timestamp = new Date().getTime();
}

/**
 * This class specifies the options for requesting acceleration data.
 * @constructor
 */
function AccelerationOptions() {
	/**
	 * The timeout after which if acceleration data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}
/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
function Accelerometer() {
	/**
	 * The last known acceleration.
	 */
	this.lastAcceleration = null;
}

/**
 * Asynchronously aquires the current acceleration.
 * @param {Function} successCallback The function to call when the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.
 */
Accelerometer.prototype.getCurrentAcceleration = function(successCallback, errorCallback, options) {
	// If the acceleration is available then call success
	// If the acceleration is not available then call error
	
	// Created for iPhone, Iphone passes back _accel obj litteral
	if (typeof successCallback == "function") {
		var accel = new Acceleration(_accel.x,_accel.y,_accel.z);
		Accelerometer.lastAcceleration = accel;
		successCallback(accel);
	}
}

/**
 * Asynchronously aquires the acceleration repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the acceleration
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the acceleration data.
 * @param {AccelerationOptions} options The options for getting the accelerometer data
 * such as timeout.
 */

Accelerometer.prototype.watchAcceleration = function(successCallback, errorCallback, options) {
	//this.getCurrentAcceleration(successCallback, errorCallback, options);
	// TODO: add the interval id to a list so we can clear all watches
 	var frequency = (options != undefined && options.frequency != undefined) ? options.frequency : 10000;
	var updatedOptions = {
		desiredFrequency:frequency 
	}
	PhoneGap.exec("Accelerometer.start",options);

	return setInterval(function() {
		navigator.accelerometer.getCurrentAcceleration(successCallback, errorCallback, options);
	}, frequency);
}

/**
 * Clears the specified accelerometer watch.
 * @param {String} watchId The ID of the watch returned from #watchAcceleration.
 */
Accelerometer.prototype.clearWatch = function(watchId) {
	PhoneGap.exec("Accelerometer.stop");
	clearInterval(watchId);
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.accelerometer == "undefined") navigator.accelerometer = new Accelerometer();
});
// Gets the function name of a Function object, else uses "alert" if anonymous
function GetFunctionName(fn)
{
  if (fn) {
      var m = fn.toString().match(/^\s*function\s+([^\s\(]+)/);
      return m ? m[1] : "alert";
  } else {
    return null;
  }
}

/**
 * This class provides access to the device camera.
 * @constructor
 */
function Camera() {
	
}

/**
 * 
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
Camera.prototype.getPicture = function(successCallback, errorCallback, options) {
	PhoneGap.exec("Camera.getPicture", GetFunctionName(successCallback), GetFunctionName(errorCallback), options);
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.camera == "undefined") navigator.camera = new Camera();
});
// Gets the function name of a Function object, else uses "alert" if anonymous
function GetFunctionName(fn)
{
  if (fn) {
      var m = fn.toString().match(/^\s*function\s+([^\s\(]+)/);
      return m ? m[1] : "alert";
  } else {
    return null;
  }
}

/**
 * This class provides access to the device contacts.
 * @constructor
 */

function Contact(jsonObject) {
	this.firstName = "";
	this.lastName = "";
    this.name = "";
    this.phones = {};
    this.emails = {};
	this.address = "";
}

Contact.prototype.displayName = function()
{
    // TODO: can be tuned according to prefs
	return this.name;
}

function ContactManager() {
	// Dummy object to hold array of contacts
	this.contacts = [];
	this.timestamp = new Date().getTime();
}

ContactManager.prototype.getAllContacts = function(successCallback, errorCallback, options) {
	PhoneGap.exec("Contacts.allContacts", GetFunctionName(successCallback), options);
}

// THE FUNCTIONS BELOW ARE iPHONE ONLY FOR NOW

ContactManager.prototype.newContact = function(contact, successCallback, options) {
    if (!options) options = {};
    options.successCallback = GetFunctionName(successCallback);
    
    PhoneGap.exec("Contacts.newContact", contact.firstName, contact.lastName, contact.phoneNumber,
        options);
}

ContactManager.prototype.chooseContact = function(successCallback, options) {
    PhoneGap.exec("Contacts.chooseContact", GetFunctionName(successCallback), options);
}

ContactManager.prototype.displayContact = function(contactID, errorCallback, options) {
    PhoneGap.exec("Contacts.displayContact", contactID, GetFunctionName(errorCallback), options);
}

ContactManager.prototype.removeContact = function(contactID, successCallback, options) {
    PhoneGap.exec("Contacts.removeContact", contactID, GetFunctionName(successCallback), options);
}

ContactManager.prototype.contactsCount = function(successCallback, errorCallback) {
	PhoneGap.exec("Contacts.contactsCount", GetFunctionName(successCallback));
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.contacts == "undefined") navigator.contacts = new ContactManager();
});
/**
 * This class provides access to the debugging console.
 * @constructor
 */
function DebugConsole() {
}

/**
 * Utility function for rendering and indenting strings, or serializing
 * objects to a string capable of being printed to the console.
 * @param {Object|String} message The string or object to convert to an indented string
 * @private
 */
DebugConsole.prototype.processMessage = function(message) {
    if (typeof(message) != 'object') {
        return message;
    } else {
        /**
         * @function
         * @ignore
         */
        function indent(str) {
            return str.replace(/^/mg, "    ");
        }
        /**
         * @function
         * @ignore
         */
        function makeStructured(obj) {
            var str = "";
            for (var i in obj) {
                try {
                    if (typeof(obj[i]) == 'object') {
                        str += i + ":\n" + indent(makeStructured(obj[i])) + "\n";
                    } else {
                        str += i + " = " + indent(String(obj[i])).replace(/^    /, "") + "\n";
                    }
                } catch(e) {
                    str += i + " = EXCEPTION: " + e.message + "\n";
                }
            }
            return str;
        }
        return "Object:\n" + makeStructured(message);
    }
};

/**
 * Print a normal log message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.log = function(message) {
    if (PhoneGap.available)
        PhoneGap.exec('DebugConsole.log',
            this.processMessage(message),
            { logLevel: 'INFO' }
        );
    else
        console.log(message);
};

/**
 * Print a warning message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.warn = function(message) {
    if (PhoneGap.available)
        PhoneGap.exec('DebugConsole.log',
            this.processMessage(message),
            { logLevel: 'WARN' }
        );
    else
        console.error(message);
};

/**
 * Print an error message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.error = function(message) {
    if (PhoneGap.available)
        PhoneGap.exec('DebugConsole.log',
            this.processMessage(message),
            { logLevel: 'ERROR' }
        );
    else
        console.error(message);
};

PhoneGap.addConstructor(function() {
    window.debug = new DebugConsole();
});
/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() 
{
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.gap      = null;
    this.uuid     = null;
    try 
	{      
		this.platform = DeviceInfo.platform;
		this.version  = DeviceInfo.version;
		this.name     = DeviceInfo.name;
		this.gap      = DeviceInfo.gap;
		this.uuid     = DeviceInfo.uuid;

    } 
	catch(e) 
	{
        // TODO: 
    }
	this.available = PhoneGap.available = this.uuid != null;
}

PhoneGap.addConstructor(function() {
    navigator.device = window.device = new Device();
});



PhoneGap.addConstructor(function() { if (typeof navigator.fileMgr == "undefined") navigator.fileMgr = new FileMgr();});


/**
 * This class provides iPhone read and write access to the mobile device file system.
 * Based loosely on http://www.w3.org/TR/2009/WD-FileAPI-20091117/#dfn-empty
 */
function FileMgr() 
{
	this.fileWriters = {}; // empty maps
	this.fileReaders = {};

	this.docsFolderPath = "../../Documents";
	this.tempFolderPath = "../../tmp";
	this.freeDiskSpace = -1;
	this.getFileBasePaths();
	this.getFreeDiskSpace();
}

// private, called from Native Code
FileMgr.prototype._setPaths = function(docs,temp)
{
	this.docsFolderPath = docs;
	this.tempFolderPath = temp;
}

// private, called from Native Code
FileMgr.prototype._setFreeDiskSpace = function(val)
{
	this.freeDiskSpace = val;
}


// FileWriters add/remove
// called internally by writers
FileMgr.prototype.addFileWriter = function(filePath,fileWriter)
{
	this.fileWriters[filePath] = fileWriter;
}

FileMgr.prototype.removeFileWriter = function(filePath)
{
	this.fileWriters[filePath] = null;
}

// File readers add/remove
// called internally by readers
FileMgr.prototype.addFileReader = function(filePath,fileReader)
{
	this.fileReaders[filePath] = fileReader;
}

FileMgr.prototype.removeFileReader = function(filePath)
{
	this.fileReaders[filePath] = null;
}

/*******************************************
 *
 *	private reader callback delegation
 *	called from native code
 */
FileMgr.prototype.reader_onloadstart = function(filePath,result)
{
	this.fileReaders[filePath].onloadstart(result);
}

FileMgr.prototype.reader_onprogress = function(filePath,result)
{
	this.fileReaders[filePath].onprogress(result);
}

FileMgr.prototype.reader_onload = function(filePath,result)
{
	this.fileReaders[filePath].result = unescape(result);
	this.fileReaders[filePath].onload(this.fileReaders[filePath].result);
}

FileMgr.prototype.reader_onerror = function(filePath,err)
{
	this.fileReaders[filePath].result = err;
	this.fileReaders[filePath].onerror(err);
}

FileMgr.prototype.reader_onloadend = function(filePath,result)
{
	this.fileReaders[filePath].onloadend(result);
}

/*******************************************
 *
 *	private writer callback delegation
 *	called from native code
*/
FileMgr.prototype.writer_onerror = function(filePath,err)
{
	this.fileWriters[filePath].onerror(err);
}

FileMgr.prototype.writer_oncomplete = function(filePath,result)
{
	this.fileWriters[filePath].oncomplete(result); // result contains bytes written
}


FileMgr.prototype.getFileBasePaths = function()
{
	PhoneGap.exec("File.getFileBasePaths");
}

FileMgr.prototype.testFileExists = function(fileName, successCallback, errorCallback)
{
	PhoneGap.exec("File.testFileExists",fileName);
}

FileMgr.prototype.testDirectoryExists = function(dirName, successCallback, errorCallback)
{
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;
	PhoneGap.exec("File.testDirectoryExists",dirName);
}

FileMgr.prototype.createDirectory = function(dirName, successCallback, errorCallback)
{
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;
	PhoneGap.exec("File.createDirectory",dirName);
}

FileMgr.prototype.deleteDirectory = function(dirName, successCallback, errorCallback)
{
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;
	PhoneGap.exec("File.deleteDirectory",dirName);
}

FileMgr.prototype.deleteFile = function(fileName, successCallback, errorCallback)
{
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;
	PhoneGap.exec("File.deleteFile",fileName);
}

FileMgr.prototype.getFreeDiskSpace = function(successCallback, errorCallback)
{
	if(this.freeDiskSpace > 0)
	{
		return this.freeDiskSpace;
	}
	else
	{
		this.successCallback = successCallback;
		this.errorCallback = errorCallback;
		PhoneGap.exec("File.getFreeDiskSpace");
	}
}

File.prototype.hasRead = function(data)
{
	// null, this is part of the Android implementation interface
}

// File Reader


function FileReader()
{
	this.fileName = "";
	this.result = null;
	this.onloadstart = null;
	this.onprogress = null;
	this.onload = null;
	this.onerror = null;
	this.onloadend = null;
}


FileReader.prototype.abort = function()
{
	// Not Implemented
}

FileReader.prototype.readAsText = function(file)
{
	if(this.fileName && this.fileName.length > 0)
	{
		navigator.fileMgr.removeFileReader(this.fileName,this);
	}
	this.fileName = file;
	navigator.fileMgr.addFileReader(this.fileName,this);
	//alert("Calling File.read : " + this.fileName);
	//window.location = "gap://File.readFile/"+ file;
	PhoneGap.exec("File.readFile",this.fileName);
}

// File Writer

function FileWriter()
{
	this.fileName = "";
	this.result = null;
	this.readyState = 0; // EMPTY
	this.result = null;
	this.onerror = null;
	this.oncomplete = null;
}

FileWriter.prototype.writeAsText = function(file,text,bAppend)
{
	if(this.fileName && this.fileName.length > 0)
	{
		navigator.fileMgr.removeFileWriter(this.fileName,this);
	}
	this.fileName = file;
	if(bAppend != true)
	{
		bAppend = false; // for null values
	}
	navigator.fileMgr.addFileWriter(file,this);
	this.readyState = 0; // EMPTY
	this.result = null;
	PhoneGap.exec("File.write",file,text,bAppend);
}





/**
 * This class provides access to device GPS data.
 * @constructor
 */
function Geolocation() {
    /**
     * The last known GPS position.
     */
    this.lastPosition = null;
    this.lastError = null;
};

/**
 * Asynchronously aquires the current position.
 * @param {Function} successCallback The function to call when the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout.
 */
Geolocation.prototype.getCurrentPosition = function(successCallback, errorCallback, options) 
{
    var referenceTime = 0;
	
	if(this.lastError != null)
	{
		if(typeof(errorCallback) == 'function')
		{
			errorCallback.call(null,this.lastError);
			
		}
		this.stop();
		return;
	}

	this.start(options);

    var timeout = 20000; // defaults
    var interval = 500;
	
    if (typeof(options) == 'object' && options.interval)
        interval = options.interval;

    if (typeof(successCallback) != 'function')
        successCallback = function() {};
    if (typeof(errorCallback) != 'function')
        errorCallback = function() {};

    var dis = this;
    var delay = 0;
    var timer = setInterval(function() {
        delay += interval;

        if (typeof(dis.lastPosition) == 'object' && dis.lastPosition.timestamp > referenceTime) 
		{
			clearInterval(timer);
            successCallback(dis.lastPosition);
            
        } 
		else if (delay > timeout) 
		{
			clearInterval(timer);
            errorCallback("Error Timeout");
        }
		else if(dis.lastError != null)
		{
			clearInterval(timer);
			errorCallback(dis.lastError);
		}
    }, interval);
};

/**
 * Asynchronously aquires the position repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the position
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the position data.
 * @param {PositionOptions} options The options for getting the position data
 * such as timeout and the frequency of the watch.
 */
Geolocation.prototype.watchPosition = function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	
	this.getCurrentPosition(successCallback, errorCallback, options);
	var frequency = 10000;
        if (typeof(options) == 'object' && options.frequency)
            frequency = options.frequency;
	
	var that = this;
	return setInterval(function() 
	{
		that.getCurrentPosition(successCallback, errorCallback, options);
	}, frequency);

};


/**
 * Clears the specified position watch.
 * @param {String} watchId The ID of the watch returned from #watchPosition.
 */
Geolocation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

/**
 * Called by the geolocation framework when the current location is found.
 * @param {PositionOptions} position The current position.
 */
Geolocation.prototype.setLocation = function(position) 
{
	this.lastError = null;
    this.lastPosition = position;

};

/**
 * Called by the geolocation framework when an error occurs while looking up the current position.
 * @param {String} message The text of the error message.
 */
Geolocation.prototype.setError = function(message) {
	alert("Error set :: " + message);
    this.lastError = message;
};

Geolocation.prototype.start = function(args) {
    PhoneGap.exec("Location.startLocation", args);
};

Geolocation.prototype.stop = function() {
    PhoneGap.exec("Location.stopLocation");
};

 // replace origObj's functions ( listed in funkList ) with the same method name on proxyObj
function __proxyObj(origObj,proxyObj,funkList)
{
    var replaceFunk = function(org,proxy,fName)
    { 
        org[fName] = function()
        { 
           return proxy[fName].apply(proxy,arguments); 
        }; 
    };

    for(var v in funkList) { replaceFunk(origObj,proxyObj,funkList[v]);}
}


PhoneGap.addConstructor(function() 
{
    if (typeof navigator._geo == "undefined") 
    {
        navigator._geo = new Geolocation();
        __proxyObj(navigator.geolocation, navigator._geo,
                 ["setLocation","getCurrentPosition","watchPosition",
                  "clearWatch","setError","start","stop"]);

    }

});
/**
 * This class provides access to device Compass data.
 * @constructor
 */
function Compass() {
    /**
     * The last known Compass position.
     */
	this.lastHeading = null;
    this.lastError = null;
	this.callbacks = {
		onHeadingChanged: [],
        onError:           []
    };
};

/**
 * Asynchronously aquires the current heading.
 * @param {Function} successCallback The function to call when the heading
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the heading data.
 * @param {PositionOptions} options The options for getting the heading data
 * such as timeout.
 */
Compass.prototype.getCurrentHeading = function(successCallback, errorCallback, options) {
	if (this.lastHeading == null) {
		this.start(options);
	}
	else 
	if (typeof successCallback == "function") {
		successCallback(this.lastHeading);
	}
};

/**
 * Asynchronously aquires the heading repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the heading
 * data is available
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the heading data.
 * @param {HeadingOptions} options The options for getting the heading data
 * such as timeout and the frequency of the watch.
 */
Compass.prototype.watchHeading= function(successCallback, errorCallback, options) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	
	this.getCurrentHeading(successCallback, errorCallback, options);
	var frequency = 100;
    if (typeof(options) == 'object' && options.frequency)
        frequency = options.frequency;

	var self = this;
	return setInterval(function() {
		self.getCurrentHeading(successCallback, errorCallback, options);
	}, frequency);
};


/**
 * Clears the specified heading watch.
 * @param {String} watchId The ID of the watch returned from #watchHeading.
 */
Compass.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};


/**
 * Called by the geolocation framework when the current heading is found.
 * @param {HeadingOptions} position The current heading.
 */
Compass.prototype.setHeading = function(heading) {
    this.lastHeading = heading;
    for (var i = 0; i < this.callbacks.onHeadingChanged.length; i++) {
        var f = this.callbacks.onHeadingChanged.shift();
        f(heading);
    }
};

/**
 * Called by the geolocation framework when an error occurs while looking up the current position.
 * @param {String} message The text of the error message.
 */
Compass.prototype.setError = function(message) {
    this.lastError = message;
    for (var i = 0; i < this.callbacks.onError.length; i++) {
        var f = this.callbacks.onError.shift();
        f(message);
    }
};

Compass.prototype.start = function(args) {
    PhoneGap.exec("Location.startHeading", args);
};

Compass.prototype.stop = function() {
    PhoneGap.exec("Location.stopHeading");
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.compass == "undefined") navigator.compass = new Compass();
});
/**
 * This class provides access to native mapping applications on the device.
 */
function Map() {
	
}

/**
 * Shows a native map on the device with pins at the given positions.
 * @param {Array} positions
 */
Map.prototype.show = function(positions) {
	
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.map == "undefined") navigator.map = new Map();
});

/**
 * Media/Audio override.
 *
 */
 
function Media(src, successCallback, errorCallback) {
	
	if (!src) {
		src = "documents://" + String((new Date()).getTime()).replace(/\D/gi,''); // random
	}
	this.src = src;
	this.successCallback = successCallback;
	this.errorCallback = errorCallback;	
    
	if (this.src != null) {
		PhoneGap.exec("Sound.prepare", this.src, this.successCallback, this.errorCallback);
	}
}
 
Media.prototype.play = function(options) {
	if (this.src != null) {
		PhoneGap.exec("Sound.play", this.src, options);
	}
}

Media.prototype.pause = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.pause", this.src);
	}
}

Media.prototype.stop = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.stop", this.src);
	}
}

Media.prototype.startAudioRecord = function(options) {
	if (this.src != null) {
		PhoneGap.exec("Sound.startAudioRecord", this.src, options);
	}
}

Media.prototype.stopAudioRecord = function() {
	if (this.src != null) {
		PhoneGap.exec("Sound.stopAudioRecord", this.src);
	}
}

/**
 * This class contains information about any Media errors.
 * @constructor
 */
function MediaError() {
	this.code = null,
	this.message = "";
}

MediaError.MEDIA_ERR_ABORTED 		= 1;
MediaError.MEDIA_ERR_NETWORK 		= 2;
MediaError.MEDIA_ERR_DECODE 		= 3;
MediaError.MEDIA_ERR_NONE_SUPPORTED = 4;


//if (typeof navigator.audio == "undefined") navigator.audio = new Media(src);
/**
 * This class provides access to notifications on the device.
 */
function Notification() {
	
}

/**
 * Causes the device to blink a status LED.
 * @param {Integer} count The number of blinks.
 * @param {String} colour The colour of the light.
 */
Notification.prototype.blink = function(count, colour) {
	
};

Notification.prototype.vibrate = function(mills) {
	PhoneGap.exec("Notification.vibrate");
};

Notification.prototype.beep = function(count, volume) {
	// No Volume yet for the iphone interface
	// We can use a canned beep sound and call that
	new Media('beep.wav').play();
};

/**
 * Open a native alert dialog, with a customizable title and button text.
 * @param {String} message Message to print in the body of the alert
 * @param {String} [title="Alert"] Title of the alert dialog (default: Alert)
 * @param {String} [buttonLabel="OK"] Label of the close button (default: OK)
 */
Notification.prototype.alert = function(message, title, buttonLabel) {
    var options = {};
    if (title) options.title = title;
    if (buttonLabel) options.buttonLabel = buttonLabel;

    if (PhoneGap.available)
        PhoneGap.exec('Notification.alert', message, options);
    else
        alert(message);
};

Notification.prototype.activityStart = function() {
    PhoneGap.exec("Notification.activityStart");
};
Notification.prototype.activityStop = function() {
    PhoneGap.exec("Notification.activityStop");
};

Notification.prototype.loadingStart = function(options) {
    PhoneGap.exec("Notification.loadingStart", options);
};
Notification.prototype.loadingStop = function() {
    PhoneGap.exec("Notification.loadingStop");
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.notification == "undefined") navigator.notification = new Notification();
});

/**
 * This class provides access to the device orientation.
 * @constructor
 */
function Orientation() {
	/**
	 * The current orientation, or null if the orientation hasn't changed yet.
	 */
	this.currentOrientation = null;
}

/**
 * Set the current orientation of the phone.  This is called from the device automatically.
 * 
 * When the orientation is changed, the DOMEvent \c orientationChanged is dispatched against
 * the document element.  The event has the property \c orientation which can be used to retrieve
 * the device's current orientation, in addition to the \c Orientation.currentOrientation class property.
 *
 * @param {Number} orientation The orientation to be set
 */
Orientation.prototype.setOrientation = function(orientation) {
    Orientation.currentOrientation = orientation;
    var e = document.createEvent('Events');
    e.initEvent('orientationChanged', 'false', 'false');
    e.orientation = orientation;
    document.dispatchEvent(e);
};

/**
 * Asynchronously aquires the current orientation.
 * @param {Function} successCallback The function to call when the orientation
 * is known.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation.
 */
Orientation.prototype.getCurrentOrientation = function(successCallback, errorCallback) {
	// If the position is available then call success
	// If the position is not available then call error
};

/**
 * Asynchronously aquires the orientation repeatedly at a given interval.
 * @param {Function} successCallback The function to call each time the orientation
 * data is available.
 * @param {Function} errorCallback The function to call when there is an error 
 * getting the orientation data.
 */
Orientation.prototype.watchOrientation = function(successCallback, errorCallback) {
	// Invoke the appropriate callback with a new Position object every time the implementation 
	// determines that the position of the hosting device has changed. 
	this.getCurrentPosition(successCallback, errorCallback);
	return setInterval(function() {
		navigator.orientation.getCurrentOrientation(successCallback, errorCallback);
	}, 10000);
};

/**
 * Clears the specified orientation watch.
 * @param {String} watchId The ID of the watch returned from #watchOrientation.
 */
Orientation.prototype.clearWatch = function(watchId) {
	clearInterval(watchId);
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.orientation == "undefined") navigator.orientation = new Orientation();
});
/**
 * This class contains position information.
 * @param {Object} lat
 * @param {Object} lng
 * @param {Object} acc
 * @param {Object} alt
 * @param {Object} altacc
 * @param {Object} head
 * @param {Object} vel
 * @constructor
 */
function Position(coords, timestamp) {
	this.coords = coords;
        this.timestamp = new Date().getTime();
}

function Coordinates(lat, lng, alt, acc, head, vel) {
	/**
	 * The latitude of the position.
	 */
	this.latitude = lat;
	/**
	 * The longitude of the position,
	 */
	this.longitude = lng;
	/**
	 * The accuracy of the position.
	 */
	this.accuracy = acc;
	/**
	 * The altitude of the position.
	 */
	this.altitude = alt;
	/**
	 * The direction the device is moving at the position.
	 */
	this.heading = head;
	/**
	 * The velocity with which the device is moving at the position.
	 */
	this.speed = vel;
}

/**
 * This class specifies the options for requesting position data.
 * @constructor
 */
function PositionOptions() {
	/**
	 * Specifies the desired position accuracy.
	 */
	this.enableHighAccuracy = true;
	/**
	 * The timeout after which if position data cannot be obtained the errorCallback
	 * is called.
	 */
	this.timeout = 10000;
}

/**
 * This class contains information about any GSP errors.
 * @constructor
 */
function PositionError() {
	this.code = null;
	this.message = "";
}

PositionError.UNKNOWN_ERROR = 0;
PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;
/**
 * This class provides access to the device SMS functionality.
 * @constructor
 */
function Sms() {

}

/**
 * Sends an SMS message.
 * @param {Integer} number The phone number to send the message to.
 * @param {String} message The contents of the SMS message to send.
 * @param {Function} successCallback The function to call when the SMS message is sent.
 * @param {Function} errorCallback The function to call when there is an error sending the SMS message.
 * @param {PositionOptions} options The options for accessing the GPS location such as timeout and accuracy.
 */
Sms.prototype.send = function(number, message, successCallback, errorCallback, options) {
	
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.sms == "undefined") navigator.sms = new Sms();
});
/**
 * This class provides access to the telephony features of the device.
 * @constructor
 */
function Telephony() {
	
}

/**
 * Calls the specifed number.
 * @param {Integer} number The number to be called.
 */
Telephony.prototype.call = function(number) {
	
}

PhoneGap.addConstructor(function() {
    if (typeof navigator.telephony == "undefined") navigator.telephony = new Telephony();
});
/**
 * This class exposes mobile phone interface controls to JavaScript, such as
 * native tab and tool bars, etc.
 * @constructor
 */
function UIControls() {
    this.tabBarTag = 0;
    this.tabBarCallbacks = {};
}

/**
 * Create a native tab bar that can have tab buttons added to it which can respond to events.
 */
UIControls.prototype.createTabBar = function() {
    PhoneGap.exec("UIControls.createTabBar");
};

/**
 * Show a tab bar.  The tab bar has to be created first.
 * @param {Object} [options] Options indicating how the tab bar should be shown:
 * - \c height integer indicating the height of the tab bar (default: \c 49)
 * - \c position specifies whether the tab bar will be placed at the \c top or \c bottom of the screen (default: \c bottom)
 */
UIControls.prototype.showTabBar = function(options) {
    if (!options) options = {};
    PhoneGap.exec("UIControls.showTabBar", options);
};

/**
 * Hide a tab bar.  The tab bar has to be created first.
 */
UIControls.prototype.hideTabBar = function(animate) {
    if (animate == undefined || animate == null)
        animate = true;
    PhoneGap.exec("UIControls.hideTabBar", { animate: animate });
};

/**
 * Create a new tab bar item for use on a previously created tab bar.  Use ::showTabBarItems to show the new item on the tab bar.
 *
 * If the supplied image name is one of the labels listed below, then this method will construct a tab button
 * using the standard system buttons.  Note that if you use one of the system images, that the \c title you supply will be ignored.
 *
 * <b>Tab Buttons</b>
 *   - tabButton:More
 *   - tabButton:Favorites
 *   - tabButton:Featured
 *   - tabButton:TopRated
 *   - tabButton:Recents
 *   - tabButton:Contacts
 *   - tabButton:History
 *   - tabButton:Bookmarks
 *   - tabButton:Search
 *   - tabButton:Downloads
 *   - tabButton:MostRecent
 *   - tabButton:MostViewed
 * @param {String} name internal name to refer to this tab by
 * @param {String} [title] title text to show on the tab, or null if no text should be shown
 * @param {String} [image] image filename or internal identifier to show, or null if now image should be shown
 * @param {Object} [options] Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
 */
UIControls.prototype.createTabBarItem = function(name, label, image, options) {
    var tag = this.tabBarTag++;
    if (options && 'onSelect' in options && typeof(options['onSelect']) == 'function') {
        this.tabBarCallbacks[tag] = options.onSelect;
        delete options.onSelect;
    }
    PhoneGap.exec("UIControls.createTabBarItem", name, label, image, tag, options);
};

/**
 * Update an existing tab bar item to change its badge value.
 * @param {String} name internal name used to represent this item when it was created
 * @param {Object} options Options for customizing the individual tab item
 *  - \c badge value to display in the optional circular badge on the item; if null or unspecified, the badge will be hidden
 */
UIControls.prototype.updateTabBarItem = function(name, options) {
    if (!options) options = {};
    PhoneGap.exec("UIControls.updateTabBarItem", name, options);
};

/**
 * Show previously created items on the tab bar
 * @param {String} arguments... the item names to be shown
 * @param {Object} [options] dictionary of options, notable options including:
 *  - \c animate indicates that the items should animate onto the tab bar
 * @see createTabBarItem
 * @see createTabBar
 */
UIControls.prototype.showTabBarItems = function() {
    var parameters = [ "UIControls.showTabBarItems" ];
    for (var i = 0; i < arguments.length; i++) {
        parameters.push(arguments[i]);
    }
    PhoneGap.exec.apply(this, parameters);
};

/**
 * Manually select an individual tab bar item, or nil for deselecting a currently selected tab bar item.
 * @param {String} tabName the name of the tab to select, or null if all tabs should be deselected
 * @see createTabBarItem
 * @see showTabBarItems
 */
UIControls.prototype.selectTabBarItem = function(tab) {
    PhoneGap.exec("UIControls.selectTabBarItem", tab);
};

/**
 * Function called when a tab bar item has been selected.
 * @param {Number} tag the tag number for the item that has been selected
 */
UIControls.prototype.tabBarItemSelected = function(tag) {
    if (typeof(this.tabBarCallbacks[tag]) == 'function')
        this.tabBarCallbacks[tag]();
};

/**
 * Create a toolbar.
 */
UIControls.prototype.createToolBar = function() {
    PhoneGap.exec("UIControls.createToolBar");
};

/**
 * Function called when a tab bar item has been selected.
 * @param {String} title the title to set within the toolbar
 */
UIControls.prototype.setToolBarTitle = function(title) {
    PhoneGap.exec("UIControls.setToolBarTitle", title);
};

PhoneGap.addConstructor(function() {
    window.uicontrols = new UIControls();
});
// Gets the function name of a Function object, else uses "alert" if anonymous
function GetFunctionName(fn)
{
  if (fn) {
      var m = fn.toString().match(/^\s*function\s+([^\s\(]+)/);
      return m ? m[1] : "alert";
  } else {
    return null;
  }
}

/**
 * This class contains information about any NetworkStatus.
 * @constructor
 */
function NetworkStatus() {
	this.code = null;
	this.message = "";
}

NetworkStatus.NOT_REACHABLE = 0;
NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK = 1;
NetworkStatus.REACHABLE_VIA_WIFI_NETWORK = 2;

/**
 * This class provides access to device Network data (reachability).
 * @constructor
 */
function Network() {
    /**
     * The last known Network status.
	 * { hostName: string, ipAddress: string, 
		remoteHostStatus: int(0/1/2), internetConnectionStatus: int(0/1/2), localWiFiConnectionStatus: int (0/2) }
     */
	this.lastReachability = null;
};

/**
 * 
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options (isIpAddress:boolean)
 */
Network.prototype.isReachable = function(hostName, successCallback, options) {
	PhoneGap.exec("Network.isReachable", hostName, GetFunctionName(successCallback), options);
}

/**
 * Called by the geolocation framework when the reachability status has changed.
 * @param {Reachibility} reachability The current reachability status.
 */
Network.prototype.updateReachability = function(reachability) {
    this.lastReachability = reachability;
};

PhoneGap.addConstructor(function() {
    if (typeof navigator.network == "undefined") navigator.network = new Network();
});
//TODO: P2 characters like '#' in parameters cause problems with HTTP URL (see PhoneGapResponse) - parameters could be sent in HTTP body
//Helper methods
//XHR
//example:  http://localhost:8080/<className>/<methodName>;arg1;arg2?option1=something&option2=other
var HTTP = {
	get: function (url,headerValue) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false); //synchronous
		xhr.setRequestHeader('X-BONDI', headerValue);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					success(xhr);
				} else {
					failure(xhr);
				}
			}
		};
		xhr.send(null);
		return xhr.responseText;
	}
};

function arrayToObjectLiteral(a)
{
	var o = {};
	for(var i=0;i<a.length;i++)
	{
		o[a[i]]='';
	}
	return o;
}

//converts JSON string to BondiFile recursively to properly include parent (another BondiFile) attribute
function JSONtoBondiFile(JSONFile)
{
	var bondiFile = new BondiFile();
	for (var key in JSONFile) {
		if (key == "parent" && JSONFile[key] != "(null)")
			bondiFile[key] = JSONtoBondiFile(JSONFile[key]);
		else if ((key == "modified" || key == "created") && JSONFile[key] != "(null)"){
			bondiFile[key] = new Date(bondiFile[key]);
		}
		else
			bondiFile[key] = JSONFile[key];
	}
	return bondiFile;
}

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

// bondi
if (typeof(bondi) != 'object')
    bondi = {};

bondi.requestFeature = function ( successCallback,  errorCallback,  name){
	if (name.startsWith('http://bondi.omtp.org/api/filesystem'))
		successCallback(new FileSystemManager());
	else if(name.startsWith('http://bondi.omtp.org/api/devicestatus'))
		successCallback(new DeviceStatusManager());
	else if(name.startsWith('http://bondi.omtp.org/api/camera'))
		successCallback(new CameraManager());
	else if(name.startsWith('http://bondi.omtp.org/api/geolocation'))
		successCallback(bondi.geolocation);
	else
		errorCallback(new GenericError(SecurityError.PERMISSION_DENIED_ERROR));
	return new PendingOperation();
}; 

GenericError = function(code) {
	this.code = code;
}

function DeviceAPIError() {
}
DeviceAPIError.UNKNOWN_ERROR = 10000;
DeviceAPIError.INVALID_ARGUMENT_ERROR = 10001;
DeviceAPIError.NOT_FOUND_ERROR = 10002;
DeviceAPIError.PENDING_OPERATION_ERROR = 10003;
DeviceAPIError.IO_ERROR = 10004;
DeviceAPIError.NOT_SUPPORTED_ERROR = 10005;

function SecurityError() {
}
SecurityError.PERMISSION_DENIED_ERROR = 20000;

PendingOperation = function() {
}
PendingOperation.prototype.cancel = function() {
	return false;
}

// bondi camera
function CameraError() {
}
CameraError.CAMERA_ALREADY_IN_USE_ERROR = 0;
CameraError.CAMERA_CAPTURE_ERROR = 1;
CameraError.CAMERA_LIVEVIDEO_ERROR = 2;

function BondiCamera() {
    this.ZOOM = 0;
    this.ZOOM_NOZOOM = 1;
    this.CONTRAST = 2;
    this.BRIGHTNESS = 3;
    this.COLORTEMPERATURE = 4;
    this.NIGHTMODE = 5;
    this.NIGHTMODE_OFF = 0;
    this.NIGHTMODE_ON = 1;
    this.MANUALFOCUS = 6;
    this.MANUALFOCUS_ON = 1;
    this.MANUALFOCUS_OFF = 0;
    this.FOCUS = 7;
    this.LIGHT = 8;
    this.FLASH = 9;
    this.FLASH_NO_FLASH = 0;
    this.FLASH_AUTOFLASH = 1;
    this.FLASH_FORCEDFLASH = 2;
    this.description = 'iphonecam';
}


BondiCamera.prototype.takePicture = function(successCallback, errorCallback, options) {
	bondi.camera.successCallback = successCallback;
	bondi.camera.errorCallback = errorCallback;
	HTTP.get('http://localhost:8080/BONDICamera/takePicture',JSON.stringify(options));
    return new PendingOperation();
}

BondiCamera.prototype.getSupportedFeatures = function() {
	return [];
}
BondiCamera.prototype.setFeature = function(featureID, valueID) {
	throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);
}
BondiCamera.prototype.requestLiveVideo = function(successCallback, errorCallback) {
	throw new Error("Not implemented");
}
BondiCamera.prototype.startVideo = function(successCallback, errorCallback, options) {
	throw new Error("Not implemented");
}
BondiCamera.prototype.stopVideo = function(successCallback, errorCallback) {
	throw new Error("Not implemented");
}

function CameraManager() {
	this._cams = [];
	this._cams.push(new BondiCamera());
}

CameraManager.prototype.cameraSuccess = function(path){
	this.successCallback(path);
}

CameraManager.prototype.cameraError = function(error){
	this.errorCallback(error);
}

CameraManager.prototype.getCameras = function(successCallback, errorCallback) {
	var cams = this._cams;
	setTimeout(function() {
		successCallback(cams);
	}, 1);
	return new PendingOperation();
}


PhoneGap.addConstructor(function() {
    if (typeof bondi.camera == "undefined") bondi.camera = new CameraManager();
});

// bondi geolocation
PhoneGap.addConstructor(function() {
    if (typeof bondi.geolocation == "undefined") bondi.geolocation = navigator.geolocation; //equals W3C Geolocation API
});

// bondi filesystem
function FileSystemManager(){
    this.maxPathLength = 9999; //should be unlimited (HFS+ or FAT32 depending on OS)	
	this.rootLocations = ["wgt-private", "documents", "images"];
}

FileSystemManager.prototype.fileSystemSuccess = function(file){
	this.successCallback(file);
}

FileSystemManager.prototype.fileSystemError = function(error){
	this.errorCallback(error);
}

FileSystemManager.prototype.getDefaultLocation = function(specifier) {
    if (specifier in arrayToObjectLiteral(this.rootLocations)) {
		var defaultLocation = HTTP.get('http://localhost:8080/BONDIFilesystem/getDefaultLocation',specifier);
		return defaultLocation;
    }
    else{		 
        throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);    
		return null;
	}
}
FileSystemManager.prototype.getRootLocations = function() {
	return this.rootLocations;
}

FileSystemManager.prototype.resolve = function(location) {
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/resolve',location);
	if (returnString == DeviceAPIError.INVALID_ARGUMENT_ERROR){
		throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);
		return null;
	}
	else if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	else{
		var tempFile = eval("(" + returnString + ")"); //JSON string
		return JSONtoBondiFile(tempFile);
	}	
}
FileSystemManager.prototype.registerEventListener = function(listener) {
	throw new Error("Not implemented");
}
FileSystemManager.prototype.unregisterEventListener = function(listener) {
	throw new Error("Not implemented");
}

function FileSystemListener(){
}
FileSystemListener.prototype.mountEvent = function(location) {
	throw new Error("Not implemented");
}
FileSystemListener.prototype.unmountEvent = function(location) {
	throw new Error("Not implemented");
}

function BondiFile(){
    this.parent = null;
    this.readOnly = false;
    this.isFile = false;
    this.isDirectory = false;
    this.created = new Date();
    this.modified = new Date();
    this.path = "";
    this.name = "";
    this.absolutePath = "";
    this.fileSize = 0;
	
	this.supportedModes = ["r", "a", "w"];
	this.supportedEncodings = ["UTF-8", "ISO8859-1"];
}

BondiFile.prototype.listFiles = function() {
    if (this.isFile)
		throw new GenericError(DeviceAPIError.IO_ERROR);
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/listFiles',this.absolutePath);
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	var fileArray = eval(returnString);
	for (var i=0;i<fileArray.length;i++){
		fileArray[i] = JSONtoBondiFile(fileArray[i]);
	}
    return fileArray;
}

BondiFile.prototype.open = function(mode, encoding) {
    if (this.isDirectory)
		throw new GenericError(DeviceAPIError.IO_ERROR);
	if ( !(mode in arrayToObjectLiteral(this.supportedModes)) || !(encoding in arrayToObjectLiteral(this.supportedEncodings)) )
		throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/open',this.absolutePath+';'+mode+';'+encoding);
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	var fileStream = new FileStream();
	//assign initial values
	fileStream.eof = false;
	fileStream._position = 0;
	fileStream.bytesAvailable = this.fileSize;
	fileStream.absolutePath = this.absolutePath;
	fileStream.mode = mode;
	fileStream.encoding = encoding;	
	
    return fileStream;
}
BondiFile.prototype.copyTo = function(successCallback, errorCallback, filePath, overwrite) {
	if(this.isDirectory)
		throw new GenericError(DeviceAPIError.IO_ERROR);
	bondi.filesystem.successCallback = successCallback;
	bondi.filesystem.errorCallback = errorCallback;
	HTTP.get('http://localhost:8080/BONDIFilesystem/copyTo',this.absolutePath+';'+formatPath(filePath)+';'+overwrite);
	return new PendingOperation();
}
BondiFile.prototype.moveTo = function(successCallback, errorCallback, filePath, overwrite) {
	if(this.isDirectory)
		throw new GenericError(DeviceAPIError.IO_ERROR);
	bondi.filesystem.successCallback = successCallback;
	bondi.filesystem.errorCallback = errorCallback;
	HTTP.get('http://localhost:8080/BONDIFilesystem/moveTo',this.absolutePath+';'+formatPath(filePath)+';'+overwrite);
	return new PendingOperation();
}

function formatPath(path){
	if (path.indexOf("/") == 0)
		return path;
	else
		return "/"+path;
}

BondiFile.prototype.createDirectory = function(dirPath) {
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/createDirectory',this.absolutePath+formatPath(dirPath));
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return null;
	}
	
	var tempFile = eval("(" + returnString + ")"); //JSON string
	return JSONtoBondiFile(tempFile);
}


BondiFile.prototype.createFile = function(filePath) {
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/createFile',this.absolutePath+formatPath(filePath));
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return null;
	}
	var tempFile = eval("(" + returnString + ")"); //JSON string
	return JSONtoBondiFile(tempFile);
}

BondiFile.prototype.resolve = function(filePath) {
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/resolve',this.absolutePath+formatPath(filePath));
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return null;
	}
	if (returnString == DeviceAPIError.INVALID_ARGUMENT_ERROR){ //remap exception, since same method is used as in FileSystemManager.resolve
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return null;
	}
	var tempFile = eval("(" + returnString + ")"); //JSON string
	return JSONtoBondiFile(tempFile);
}

BondiFile.prototype.deleteDirectory = function(recursive) {
	if(this.isFile){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return false;
	}
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/deleteDirectory',this.absolutePath+';'+recursive);
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return false;
	}else if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return false;
	} else
		return true;
}

BondiFile.prototype.deleteFile = function() {
	if(this.isDirectory){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return false;
	}
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/deleteFile',this.absolutePath);
	if (returnString == SecurityError.PERMISSION_DENIED_ERROR){
		throw new GenericError(SecurityError.PERMISSION_DENIED_ERROR);
		return false;
	}else if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
		return false;
	} else
		return true;
}

function FileStream(){
    this.eof = true;
    this._position = 0;
	FileStream.prototype.__defineGetter__("position", function() { return this._position });
	FileStream.prototype.__defineSetter__("position", function(position) {
										  var i = HTTP.get('http://localhost:8080/BONDIFilesystem/seek',this.absolutePath+';'+this.mode+';'+position);
										  if (i == DeviceAPIError.IO_ERROR)
											throw new DeviceAPIError(DeviceAPIError.IO_ERROR);
										  this._position = i;
										  });
    this.bytesAvailable = -1; 
	
	//attributes transferred from BondiFile - not part of specification
	this.absolutePath = "";
	this.mode = "";
	this.encoding = "";
}
FileStream.prototype.close = function close(){
	HTTP.get('http://localhost:8080/BONDIFilesystem/close',this.absolutePath+';'+this.mode+';'+this.encoding);
	//reset attributes
	this.eof = true;
    this._position = 0;
    this.bytesAvailable = -1;
}
FileStream.prototype.read = function read(charCount){
	//charCount can be > than bytesAvailable (NSFileHandle.read)
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/read',charCount+';'+this.absolutePath+';'+this.mode+';'+this.encoding);

	if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else { //update FileStream attributes
		var fileInfo = eval("(" + returnString + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
		return fileInfo.data;
	}
}
FileStream.prototype.readBytes = function readBytes(byteCount){
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/readBytes',byteCount+';'+this.absolutePath+';'+this.mode+';'+this.encoding);
	if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else { //update FileStream attributes
		var fileInfo = eval("(" + returnString + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
		return fileInfo.data;
	}
}
FileStream.prototype.readBase64 = function readBase64(byteCount){
	var returnString = HTTP.get('http://localhost:8080/BONDIFilesystem/readBase64',byteCount+';'+this.absolutePath+';'+this.mode+';'+this.encoding);
	if (returnString == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else { //update FileStream attributes
		var fileInfo = eval("(" + returnString + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
		return fileInfo.data;
	}
}
FileStream.prototype.write = function write(stringData){
	var stringResult = HTTP.get('http://localhost:8080/BONDIFilesystem/write',stringData +';'+this.absolutePath+';'+this.mode+';'+this.encoding);
	if (stringResult == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else { //update FileStream attributes
		var fileInfo = eval("(" + stringResult + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
	}
}

FileStream.prototype.writeBytes = function writeBytes(byteData){
	var stringResult = HTTP.get('http://localhost:8080/BONDIFilesystem/writeBytes',byteData +';'+this.absolutePath+';'+this.mode+';'+this.encoding);
	if (stringResult == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else {
		var fileInfo = eval("(" + stringResult + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
	}
}
FileStream.prototype.writeBase64 = function writeBase64(base64data){
	var stringResult = HTTP.get('http://localhost:8080/BONDIFilesystem/writeBase64',base64data +';'+this.absolutePath+';'+this.mode+';'+this.encoding);
	if (stringResult == DeviceAPIError.IO_ERROR){
		throw new GenericError(DeviceAPIError.IO_ERROR);
	} else {
		var fileInfo = eval("(" + stringResult + ")"); //JSON string
		this._position = fileInfo.position;
		this.bytesAvailable = fileInfo.filesize - this._position;
		this.eof = (this.bytesAvailable == 0);
	}
}

PhoneGap.addConstructor(function() {
    if (typeof bondi.filesystem == "undefined") bondi.filesystem = new FileSystemManager();
});


// bondi devicestatus

function DeviceStatusManager() {
}

function DeviceStatusError() {
}
DeviceStatusError.READ_ONLY_PROPERTY_ERROR = 1;

DeviceStatusManager.prototype.propertyChangeSuccess = function(property,newValue) {
	this.listener(property,newValue);
}

DeviceStatusManager.prototype.listVocabularies = function() {
	throw new Error("Not implemented");
}

DeviceStatusManager.prototype.setDefaultVocabulary = function(vocabulary) {
	throw new Error("Not implemented");
}

DeviceStatusManager.prototype.listAspects = function() {
	return ["Battery", "OperatingSystem"];
}

DeviceStatusManager.prototype.getComponents = function(aspect) {
	throw new Error("Not implemented");
}

DeviceStatusManager.prototype.listProperties = function(aspect) {
	if (typeof aspect == "object" && aspect.aspect == "Battery")
		return ["batteryLevel", "batteryTechnology", "batteryBeingCharged"];
	
	if (typeof aspect == "object" && aspect.aspect == "OperatingSystem")
		return ["language", "version", "name", "vendor"];
	
	throw new GenericError(DeviceAPIError.NOT_FOUND_ERROR);
}

DeviceStatusManager.prototype.propertyExists = function(property){
	var aspects = this.listAspects();
	var propertyFound = false;
	for (var i in aspects) {
		var properties = arrayToObjectLiteral(this.listProperties({aspect:aspects[i]}));
		if (property in properties){
			propertyFound = true;
			continue;
		}
	}
	return propertyFound;
}


DeviceStatusManager.prototype.setPropertyValue = function(pref, value) {
	if (typeof pref == "object" && this.propertyExists(pref.property)) //only currentOrientation (Display) is not readonly
		throw new GenericError(DeviceStatusError.READ_ONLY_PROPERTY_ERROR);
	else
		throw new GenericError(DeviceAPIError.NOT_FOUND_ERROR);
}

DeviceStatusManager.prototype.getPropertyValue = function(pref) {
	var returnValue = 'undefined';
	if (typeof pref == "object" && this.propertyExists(pref.property)){
		returnValue =  HTTP.get('http://localhost:8080/BONDIDeviceStatus/getPropertyValue',pref.aspect+";"+ pref.property);
		if (returnValue == DeviceAPIError.INVALID_ARGUMENT_ERROR)
			throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);
		else
			return returnValue;
	}	
	throw new GenericError(DeviceAPIError.NOT_FOUND_ERROR);
}

DeviceStatusManager.prototype.watchPropertyChange = function(pref, listener, options) {
	var isBatteryProperty = pref.property in arrayToObjectLiteral(this.listProperties({aspect:"Battery"}));
	if ( !(typeof pref == "object" && isBatteryProperty) ) //only Battery properties can be  watched currently
		throw new GenericError(DeviceAPIError.NOT_FOUND_ERROR);
	bondi.devicestatus.listener = listener;
	var id = HTTP.get('http://localhost:8080/BONDIDeviceStatus/watchPropertyChange',JSON.stringify(pref)+';'+JSON.stringify(options));
    return id;
}
DeviceStatusManager.prototype.clearPropertyChange = function(watchHandler) {
	var stringResult = HTTP.get('http://localhost:8080/BONDIDeviceStatus/clearPropertyChange',watchHandler);
	if (stringResult == DeviceAPIError.INVALID_ARGUMENT_ERROR)
		throw new GenericError(DeviceAPIError.INVALID_ARGUMENT_ERROR);
}

PhoneGap.addConstructor(function() {
	if (typeof bondi.devicestatus == "undefined") bondi.devicestatus = new DeviceStatusManager();
});

/*
    http://www.JSON.org/json2.js
    2009-09-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
