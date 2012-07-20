/**
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
 * Array utility functions
 */
ps.array = {
	/**
	 * The array contains a value
	 *
	 * @param {Array} array
	 * @param {*} value
	 * @return {boolean}
	 */
	contains: function(array, value) {
		for (var i = 0, il = array.length; i < il; ++i) {
			if (array[i] === value) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Get a new array with unique values only
	 *
	 * @param {Array} array
	 * @return {boolean}
	 */
	unique: function(array) {
		var results = [];
		for (var i = 0, il = array.length; i < il; ++i) {
			if (!ps.array.contains(results, array[i])) {
				results.push(array[i]);
			}
		}
		return results;
	},

	/**
	 * Array values that are present in array1 but not array2
	 *
	 * @param {Array} array1
	 * @param {Array} array2
	 * @return {Array}
	 */
	diff: function(array1, array2) {
		var results = [],
			val,
			pivot2	= ps.array.pivot(array2);

		for (var i = 0, il = array1.length; i < il; ++i) {
			val	= array1[i];
			if (!ps.isDef(pivot2[val])) {
				results.push(val);
			}
		}

		return results;
	},

	/**
	 * Array values that are present in all arrays
	 *
	 * Only works on sorted arrays.
	 *
	 * @param {Array} array1
	 * @param {Array} array2
	 * @return {Array}
	 */
	intersect: function(array1, array2) {
		var result = [];
		var a = array1.slice(0);
		var b = array2.slice(0);
		var aLast = a.length - 1;
		var bLast = b.length - 1;
		while (aLast >= 0 && bLast >= 0) {
			if (a[aLast] > b[bLast] ) {
				a.pop();
				aLast--;
			} else if (a[aLast] < b[bLast] ){
				b.pop();
				bLast--;
			} else /* they're equal */ {
				result.push(a.pop());
				b.pop();
				aLast--;
				bLast--;
			}
		}
		// keep intersection sorted
		result.reverse();
		return result;
	},

	/**
	 * Concatenate all arrays
	 *
	 * @param {Array} array1
	 * @param {Array...} arrays
	 * @return {Array}
	 */
	union: function(array1, arrays) {
		arrays	= Array.prototype.slice.apply(arguments).slice(1);
		return Array.prototype.concat.apply(array1, arrays);
	},

	/**
	 * Shallow-copies an array
	 *
	 * @param {Array} array
	 * @return {Array}
	 */
	clone: function(array) {
		return ps.array.union([], array);
	},

	/**
	 * Extract the keys from an array or object
	 *
	 * @param {Array|Object} data
	 * @return {Array}
	 */
	keys: function(data) {
		var keys = [];
		$.each(data, function (k, v) {
			keys.push(k);
		});
		return keys;
	},

	/**
	 * Extract the values from an array or object
	 *
	 * @param {Array|Object} data
	 * @return {Array}
	 */
	vals:  function(data) {
		var vals = [];
		$.each(data, function (k, v) {
			vals.push(v);
		});
		return vals;
	},

	/**
	 * Make two parallel arrays into a a simple Object
	 * @param {Array} keys
	 * @param {Array} values
	 * @return {Array}
	 */
	combine: function(keys, values) {
		var length	= (keys.length <= values.length ? keys.length : values.length),
			data	= ps.obj();
		for (var i = 0; i < length; ++i) {
			data[keys[i]] = values[i];
		}
		return data;
	},

	/**
	 * Pivot the keys/values in an array of Object
	 * e.g. ['a', 'b', 'c'] => {'a':0, 'b':1, 'c':2}
	 * e.g. {'a':0, 'b':1, 'c':2} => {0:'a', 1:'b', 2:'c'}
	 *
	 * @param {Array|Object} data
	 * @return {Object}
	 */
	pivot: function(data) {
		var pivot	= ps.obj();
		$.each(data, function (k, v) {
			pivot[v] = k;
		});
		return pivot;
	},

	/**
	 * Randomly sort the array
	 * @param {Array} arr
	 * @return {Array}
	 */
	randSort: function(arr) {
		arr.sort(function(a, b) {
			return 0.5 - Math.random();
		});
		return arr;
	}
};
