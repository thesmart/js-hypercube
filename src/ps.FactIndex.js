/**
 * Copyright 2011, Prescreen, Inc. https://www.prescreen.com
 * @author John Smart <https://twitter.com/thesmart>
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
 * This index maps fact values (keys) to cell positions (array indices) using "slabs."
 * Each slab represents an array of array-index positions.  When a query is made on a set of fact values,
 * the index hits are intersected.
 *
 * @constructor
 */
ps.FactIndex = function() {
	/**
	 * A collection of slabs, keyed by fact-value
	 * @property {Object.<string, array>}
	 * @protected
	 */
	this._slabs			= ps.obj();

	/**
	 * The names of the fact values contained in this index
	 * @property {Array.<string>}
	 */
	this._factValues	= [];
};

/**
 * Get the values of the facts the make this FactIndex
 * @return {Array.<string>}
 */
ps.FactIndex.prototype.getFactValues = function() {
	if (!this._factValues.length) {
		// compile the fact values
		this._factValues	= ps.array.keys(this._slabs);
		this._factValues.sort();
	}

	return this._factValues;
};

/**
 * For a fact value, get the positions that match
 * @param {string} factValue
 * @return {Array.<number>}		An array of all the positions that match this fact value
 */
ps.FactIndex.prototype.get = function(factValue) {
	return this._slabs[factValue];
};

/**
* Push a piece of data
* @param {string} factValue		The fact value to index
* @param {number} position		The position of the cell
*/
ps.FactIndex.prototype.insert = function(factValue, position) {
	this._factValues	= [];

	var slab	= this._slabs[factValue];
	if (!ps.isDef(slab)) {
		slab	= [];
		this._slabs[factValue]	= slab;
	}

	slab.push(position);
};
