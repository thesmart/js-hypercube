/**
 * Copyright 2012, Prescreen, Inc. https://www.prescreen.com
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

var example = (function() {
	var _start	= ps.time() - (3600 * 24); // 24-hours ago;
	var _time	= _start;

	var resetTime = function() {
		_time	= _start;
	};

	var getTimeNext = function() {
		_time += 3600;
		return getTime();
	};

	var getTime = function() {
		return _time;
	};

	var getMeasures = function() {
		var rentals	= Math.floor(Math.random() * (100 - 30) + 30);
		var sales	= Math.round(12.9 * (rentals / 100));
		var revenue	= parseFloat((sales * 39.99).toFixed(2), 10);

		return {
			rentals: rentals,
			sales: sales,
			revenue: revenue
		}
	};

	var getSales = function() {
		return Math.floor(Math.random() * 1000000);
	};

	var getRevenue = function() {
		return Math.floor(Math.random() * 40000000);
	};

	return {
		resetTime: resetTime,
		getTimeNext: getTimeNext,
		getTime: getTime,
		getMeasures: getMeasures,
		data: []
	};
})();

//['Super-Mario-Bros-2', 'Metroid', 'Legend-of-Zelda', 'Star-Tropics', 'Final-Fantasy-3', 'Altered-Beast'],

for (var i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Super Mario Bros. 2',
			platform: 'Nintendo',
			staring: 'Mario'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

for (i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Super Mario',
			platform: 'Super Nintendo',
			staring: 'Mario'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

for (i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Legend of Zelda',
			platform: 'Nintendo',
			staring: 'Link'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

for (i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Legend of Zelda: A Link to the Past',
			platform: 'Super Nintendo',
			staring: 'Link'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

for (i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Metroid',
			platform: 'Nintendo',
			staring: 'Samus'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

for (i = 0; i < 24; ++i) {
	example.data.push({
		time: example.getTime(),
		facts: {
			name: 'Super Metroid',
			platform: 'Super Nintendo',
			staring: 'Samus'
		},
		measures: example.getMeasures()
	});

	// inc
	example.getTimeNext();
}
example.resetTime();

console.info(example.data);
console.log(JSON.stringify(example.data));