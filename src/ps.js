/**
 * Parts of this file are modified from "The Closure Library"
 * Copyright 2006 The Closure Library Authors. All Rights Reserved.
 *
 * Copyright 2011, Prescreen, Inc. https://www.prescreen.com
 * @author John Smart <https://twitter.com/thesmart>
 * @author Tyler Seymour
 * @author Dan Rummel
 * @author Dave Marr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Setup the Prescreen namespace. It contains utility functions that are commonly needed.
 * @type {Object}
 */
var ps	= Object.create ? Object.create(null) : {};

/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 * @param {!Function} ctor The constructor for the class to add the static method to.
 */
ps.addSingletonGetter = function(ctor) {
	ctor.getInstance = function() {
		return ctor.instance_ || ctor.setInstance.apply(this, arguments);
	};
	ctor.hasInstance = function() {
		return !!ctor.instance_;
	};
	ctor.setInstance = function() {
		return ctor.instance_ = new ctor(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7]);
	};
	ctor.deleteInstance = function() {
		ctor.instance_ = null;
	};
};

/**
 * Add ".clone" to all instances
 * NOTE: this does NOT make a deep copy of object prototypes!
 *
 * @param ctor
 */
ps.addCloning = function(ctor) {
	ctor.prototype.clone = function() {
		var clone		= $.extend(true, new ctor(), this);
		var subClone	= function(obj) {
			var target;
			for (name in obj) {
				target = obj[name];
				if (!target instanceof Object) {
					// only consider objects
					continue;
				} else if (target === obj) {
					// Prevent never-ending loop
					continue;
				} else if (target['clone']) {
					// base-case
					obj[name]	= target.clone();
					continue;
				}

				// inductive-step
				subClone(target);
			}
		};
		subClone(clone);
		return clone;
	};
};

/**
 * Have one constructor inherit from another.
 *
 * @param {!Function} childCtor
 * @param {!Function} parentCtor
 */
ps.inherits = function(childCtor, parentCtor) {
	/** @constructor */
	function tempCtor() {};
	tempCtor.prototype = parentCtor.prototype;
	childCtor.superClass_ = parentCtor.prototype;
	childCtor.prototype = new tempCtor();
	childCtor.prototype.constructor = childCtor;
};

//==============================================================================
// Utility Functions
//==============================================================================

/**
 * @return {number} An integer value representing the number of seconds
 *     between midnight, January 1, 1970 and the current time.
 */
ps.time = function() {
	// Unary plus operator converts its operand to a number which in the case of
	// a date is done by calling getTime().
	return Math.floor(ps.microTime() / 1000);
};

/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
ps.microTime = Date.now || (function() {
	return +new Date();
});

/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
ps.timezone = function() {
	return Math.floor((new Date()).getTimezoneOffset() / 60) * -1;
};

//==============================================================================
// Language Enhancements
//==============================================================================

/**
 * Create an object primitive
 * @return {Object}
 */
ps.obj = function() {
	return Object.create ? Object.create(null) : {};
};

/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
ps.isDef = function(val) {
	return val !== undefined;
};


/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
ps.isNull = function(val) {
	return val === null;
};

/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
ps.isDefAndNotNull = function(val) {
	// Note that undefined == null.
	return val != null;
};

/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
ps.isString = function(val) {
	return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
ps.isBoolean = function(val) {
	return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
ps.isNumber = function(val) {
	return (typeof val == 'number') && !isNaN(val) && isFinite(val);
};

/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
ps.isFunction = function(val) {
	return $.isFunction(val);
};

/**
 * Returns true if the specified value is an object of some kind
 * WARNING: if you want be test "IFF val is a plain object", use ps.isPlainObject.
 *
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
ps.isObject = function(val) {
	return typeof val === 'object';
};

/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * WARNING: slightly more expensive than ps.isObject
 *
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
ps.isPlainObject = function(val) {
	return $.isPlainObject(val);
};

/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
ps.isArray = function(val) {
	return $.isArray(val);
};

/**
 * Detect if value is an Element
 * @param {*} val Variable to test.
 * @return {boolean}
 */
ps.isElement = function(val) {
	return ps.isObject(val) && val.nodeType === 1;
};

/**
 * Generate a unique id
 * @static
 * @return {!number}
 */
ps.uid = function() {
	return ps._uidCounter++;
};

/**
 * Unique id counter
 * @type {!number}
 * @static
 */
ps._uidCounter = 1000;

/**
 * Get a unique id for an Element
 * @static
 * @return {!number}
 */
ps.uniqueElementId = function() {
	return '_idgen_' + ps.uid();
};

//==============================================================================
// Window Enhancements
//==============================================================================

/**
 * Redirect the user without adding to history
 * @param {string=} opt_url		The url to redirect to. If not passed, will refresh current url.
 */
ps.redirect = function(opt_url) {
	if (opt_url) {
		window.document.location.replace(opt_url);
	} else {
		window.document.location.reload(true);
	}
};

/**
 * Redirect the user with history
 * NOTE: this is useful because Internet Explorer will throw exception if onbeforeunload has fired.
 *
 * @param {!string} url		The url to redirect to.
 */
ps.navigateTo = function(url) {
	try {
		window.document.location.href = url;
	} catch (exception) {
		// do nothing
	}
};
