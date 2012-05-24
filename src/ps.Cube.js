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
 * A simple implementation of an OLAP hypercube.
 * @see http://www.olapcouncil.org/research/glossaryly.htm
 *
 * @param {Array.<string>=} opt_measureNames		Optional. The measure names to expect.
 */
ps.Cube = function(opt_measureNames) {
	/**
	 * A collection of indexes, keyed by index-name
	 * @property {Object.<string, ps.FactIndex>}
	 * @protected
	 */
	this._indecies	= ps.obj();

	/**
	 * A collection of all cells
	 * @property {Array.<ps.Cube>}
	 * @protected
	 */
	this._cells		= [];

	/**
	 * The names of the facts contained in this cube
	 * @property {Array.<string>}
	 * @protected
	 */
	this._factNames	= [];

	/**
	 * The names of measures we should expect
	 * @property {Array.<string>}
	 * @protected
	 */
	this._measureNames = ps.isArray(opt_measureNames) ? opt_measureNames : null;
};

/**
 * @return {!number}		The size of the cube
 */
ps.Cube.prototype.count = function() {
	return this._cells.length;
};

/**
 * Get the names of the facts the make this Cube
 * @return {Array.<string>}
*/
ps.Cube.prototype.getFactNames = function() {
	if (!this._factNames.length) {
		// compile the fact names
		this._factNames	= ps.array.keys(this._indecies);
		this._factNames.sort();
	}

	return this._factNames;
};

/**
 * Get the unique fact values for a specific fact name
 * i.e. 'title' would retrieve ['Terminator 2: Judgement Day', 'Alien']
 * @param {string} factName
 * @return {Array.<string>}		Get a list of fact values from the cube
 */
ps.Cube.prototype.getValues = function(factName) {
	var values 		= [];

	for (var i = 0, il = this._cells.length; i < il; ++i) {
		value	= this._cells[i].facts[factName];
		if (value) {
			values.push(value);
		}
	}

	return ps.array.unique(values);
};

/**
 * Insert a cell
 * @param {!ps.Cell} cell
 */
ps.Cube.prototype.insert = function(cell) {
	this._factNames	= [];

	var position	= this._cells.length,
		index;

	$.each(cell.facts, $.proxy(function(factName, factValue) {
		index	= this._indecies[factName];
		if (!ps.isDef(index)) {
			// build a new fact index where non-existed
			index		= new ps.FactIndex();
			this._indecies[factName]	= index;
		}
		index.insert(factValue, position);
	}, this));

	this._cells.push(cell);
};

/**
 * Get the position of every cell that matches the fact set
 * @param {!Object<string, string>} facts
 * @return {Array.<number>}		The positions in this._cells that match the fact set
 * @protected
 */
ps.Cube.prototype._getPos = function(facts) {
	var hits,
		factPositions,
		index;

	$.each(facts, $.proxy(function(factName, factValue) {
		index		= this._indecies[factName];
		if (!ps.isDef(index)) {
			// this fact is not in this cube
			hits	= [];
			return false;
		}

		factPositions	= index.get(factValue);
		if (!ps.isDef(factPositions)) {
			// this fact is not in this cube
			hits	= [];
			return false;
		}

		if (hits) {
			// get hits that match across all fact sets
			hits	= ps.array.intersect(hits, factPositions);
		} else {
			// initialize hits
			hits	= factPositions;
		}

		if (!hits.length) {
			// this fact is not in the cube
			hits	= [];
			return false;
		}

	}, this));

	return hits;
};

/**
 * Slice off and return the cells the align with specific facts
 * @param {!Object<string, string>} facts
*/
ps.Cube.prototype.slice = function(facts) {
	var slice			= new ps.Cube(this._measureNames),
	 	hits			= this._getPos(facts);

	for (var i = 0, il = hits.length; i < il; ++i) {
		slice.insert(this._cells[hits[i]]);
	}

	return slice;
};

/**
 * Slice the cube between two dates
 * 
 * @param {number} fromTime
 * @param {number} toTime
 */
ps.Cube.prototype.sliceDates = function(fromTime, toTime) {
	var cube	= new ps.Cube(this._measureNames),
		cells	= this._cells,
		facts;

	for (var i = 0, il = cells.length; i < il; ++i) {
		if (cells[i].time >= fromTime && cells[i].time < toTime) {
			// match!
			cube.insert(cells[i]);
		}
	}

	return cube;
};

/**
 * Dice out a cube, removing the data that matches a set of facts
 * @param {!Object<string, string>} facts
 */
ps.Cube.prototype.dice = function(facts) {
	var dice			= new ps.Cube(this._measureNames),
	 	hits			= this._getPos(facts);

	// invert the hits
	hits	= ps.array.diff(ps.array.keys(this._cells), hits);
	for (var i = 0, il = hits.length; i < il; ++i) {
		dice.insert(this._cells[hits[i]]);
	}

	return dice;
};

/**
 * Merge a cube with this cube
 * @param {!ps.Cube} cube
 */
ps.Cube.prototype.merge = function(cube) {
	for (var i = 0, il = cube._cells.length; i < il; ++i) {
		this.insert(cube._cells[i]);
	}
};

/**
* Sum the measures in the cube
*
* @static
* @param {number=} opt_precision					Optional. The number of significant figures to allow
* @return {Object}		The summed measure set
*/
ps.Cube.prototype.sum = function(opt_precision) {
	if (!this._cells.length) {
		if (this._measureNames) {
			return ps.object.fill(this._measureNames, 0);
		}
		return ps.obj();
	}

	return ps.Cell.aggregate(this._cells, function(agg, inc) {
		if (ps.isNumber(opt_precision)) {
			// sig figs
			inc		= parseFloat(inc.toPrecision(opt_precision), 10);
		}

		if (ps.isDef(agg)) {
			agg += inc;
		} else {
			// first iteration, aggregate is undefined
			agg = inc;
		}

		return agg;
	});
};

/**
 * Average the measures in the cube
 *
 * @static
 * @param {number} count							Based on the grain, this count is the maximum number of cells in the set.
 * @param {number=} opt_precision					Optional. The number of significant figures to allow
 * @return {Object}		The summed measure set
*/
ps.Cube.prototype.avg = function(count, opt_precision) {
	var sums	= this.sum(opt_precision),
		avgs	= ps.obj(),
		hasMeasures = false;

	$.each(sums, function(key, value) {
		hasMeasures	= true;
		value		= value ? value / count : value;
		if (ps.isNumber(opt_precision)) {
			// sig figs
			value	= parseFloat(value.toPrecision(opt_precision), 10);
		}
		avgs[key]	= value;
	});

	if (!hasMeasures && this._measureNames) {
		return ps.object.fill(this._measureNames, 0);
	}

	return avgs;
};

/**
 * Get the top measure values by sum
 * @param {string} factName					The name of the fact to get the top results
 * @param {string} measureName				The name of the measure to return
 * @param {number=} opt_limit				Optional. A limit to the number of results to return
 * @return {Object.<string, number>}		An object, in descending order, where key is a factValue and value is a summed measure
 */
ps.Cube.prototype.topSum = function(factName, measureName, opt_limit) {
	var allValues		= this.getValues(factName),
		workingValues	= [],
		limit			= ps.isNumber(opt_limit) ? opt_limit : undefined;

	for (var i = 0, l = allValues.length; i < l; ++i) {
		// make a query
		var query	= {};
		query[factName] = allValues[i];

		// extract a value
		workingValues.push([allValues[i], this.slice(query).sum()[measureName]]);
	}

	// sort descending
	workingValues.sort(function(a, b) {
		return b[1] - a[1];
	});

	// collate into a result
	var result	= ps.obj();
	for (var i = 0, l = workingValues.length; i < l; ++i) {
		result[workingValues[i][0]]	= workingValues[i][1];

		if (limit && i >= limit) {
			break;
		}
	}
	return result;
};

/**
* Turn the cube into a simple array of objects
* @return {Array}
*/
ps.Cube.prototype.serialize = function() {
	var data	= [],
		obj,
		cell;

	for (var i = 0, il = this._cells.length; i < il; ++i) {
		cell			= this._cells[i];
		obj				= ps.obj();
		obj['facts']	= cell.facts;
		obj['measures']	= cell.measures;
		data.push(obj);
	}

	return data;
};

/**
 * Create a new cube using data from a simple array of objects
 * @param {Array} data
 * @param {Array.<string>=} opt_measureNames		Optional. The measure names to expect.
 * @return {!ps.Cube}
*/
ps.Cube.deserialize = function(data, opt_measureNames) {
	var cube = new ps.Cube(opt_measureNames),
		cellData;

	for (var i = 0, il = data.length; i < il; ++i) {
		cellData = data[i];
		cube.insert(new ps.Cell(cellData['facts'], cellData['measures'], cellData['time'] * 1000));
	}

	return cube;
};
