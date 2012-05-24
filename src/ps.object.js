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
 * Object utility functions
 */
ps.object = {
	/**
	 * @see ps.array.contains
	 */
	contains: ps.array.contains,

	/**
	 * @see ps.array.keys
	 */
	keys: ps.array.keys,

	/**
	 * @see ps.array.vals
	 */
	vals: ps.array.vals,

	/**
	 * @see ps.array.combine
	 */
	combine: ps.array.combine,

	/**
	 * Fill an array with a value
	 * @param {Array} keys
	 * @param {*} value
	 * @return {Array}
	 */
	fill: function(keys, value) {
		var obj	= ps.obj();
		for (var i = 0, il = keys.length; i < il; ++i) {
			obj[keys[i]]	= value;
		}
		return obj;
	}
};