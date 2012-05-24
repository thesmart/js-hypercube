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
 * Construct a Cube Cell
 * @param {Object} facts
 * @param {Object} measures
 * @param {number=} opt_time		The unix-time (milliseconds) for this cell
 */
ps.Cell = function(facts, measures, opt_time) {

	/**
	 * The time code for this cell, in unix-time (milliseconds)
	 * @property {number}
	 */
	this.time		= opt_time ? opt_time : null;

	/**
	 * The coordinates that address a cell within a ps.Cube
	 * @property {Object.<string,string>}
	 */
	this.facts		= facts;

	/**
	 * The value set that the facts converge to
	 * @property {Object.<string,number>}
	 */
	this.measures	= measures;
};
ps.addCloning(ps.Cell); // ATTAX OF THE CLONES! Gives it the .clone() method

/**
 * Get the value of this cell
 * @param {string} name		The name of the measure to get
 */
ps.Cell.prototype.value = function(name) {
	return ps.isNumber(this.measures[name]) ? this.measures[name] : 0;
};

/**
 * Aggregate one or more measures in all the cells against a function
 *
 * @static
 * @param {Array.<ps.Cell>} cells
 * @param {Function(number, number)} fn			The aggregation function. Takes two args: aggregateValue, incomingValue
 * @return {Object}		The aggregated measure set
 */
ps.Cell.aggregate = function(cells, fn) {
	var measures	= ps.obj();
	if (!cells || !cells.length) {
		return measures;
	}

	for (var i = 0, il = cells.length; i < il; ++i) {
		$.each(cells[i].measures, function(key, val) {
			measures[key] = fn(measures[key], val);
		});
	}

	return measures;
};

/**
 * Create a comparison function for the sort function
 * @param {!string} measureName		The measure to sort by (ascending)
 * @param {boolean=} opt_isDesc		Optional. Set true to sort in descending order.
 * @return {Function(ps.Cell, ps.Cell)}
 */
ps.Cell.getComparisonFn = function(measureName, opt_isDesc) {
	return function(a, b) {
		var diff = a.value(measureName) - b.value(measureName);
		return opt_isDesc ? diff * -1 : diff;
	};
};
