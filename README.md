js-hypercube
============

HyperCube for short.

An n-dimensional database, written in JavaScript, useful for aggregation and charting analytics. Datasets can be "sliced and diced" in real-time, with low-latency.  Plot data on a graph. Amaze your boss.

Example
-----------

A hypercube is useful for expressing n-dimensional analytics.  Spreadsheets work great for 2-dimensional data expressed w/ rows and columns.  A hypercube is  similar to a spreadsheet, but it can represent data using more than just 2-dimensions.  The HyperCube library uses a standard data-model to represent this feature. 

Each data set contains n-number of _fact-records_.  A fact-record represents a specific combination of _facts_ at specific _time_.  These attributes are used like a coordinate system.  For example, consider the "Super Mario Bros. 2" video game for the Nintendo gaming system. During a 1-hour time interval, this game may have been sold 6 times, rented 43 times, and made $239.94 in revenue:

    // this data is fake, but represents the standard HyperCube data format
    var data = [{"time":1331773202,"facts":{"name":"Super Mario Bros. 2","platform":"Nintendo","staring":"Mario"},"measures":{"rentals":73,"sales":9,"revenue":359.91}}, {"time":1331841602,"facts":{"name":"Metroid","platform":"Nintendo","staring":"Samus"},"measures":{"rentals":43,"sales":6,"revenue":239.94}}]; // ... etc

You can see that each fact-record has _time_, _facts_, and _measures_ fields.  The _time_ field can be converted to local time:

    // each fact record in the data-set has a unix-time. add standardized local-time facts
    ps.Cube.transforms.dateLocal(data);

Deserializing the JSON data-set will turn it into a query-able hypercube:

    // turn our fact records into a cube
    var cube    = ps.Cube.deserialize(data, ['rentals', 'sales', 'revenue'])

You can then do some interesting stuff:

    // run some interesting queries
    console.info('Total Rentals', cube.sum().rentals);
    console.info('Revenue at 6pm for Super Nintendo games', '$' + cube.slice({hour: 18, platform: 'Super Nintendo'}).sum(2).revenue);
    console.info('Avg rentals per hour for games staring Mario', cube.slice({staring: 'Mario'}).avg(24, 2).rentals + ' units');
    
Source Structure
-----------

There are four major parts to this library:

 * ps - the Prescreen namespace and small base library
 * ps.Cube - maintains a set of cells, an index, query methods, and aggregation methods
 * ps.Cell - a discrete record in the database, maintains a "fact set", a "measure set" and a unix-time code.
 * ps.FactIndex - internal, and can be ignored. Its an indexing mechanism used by the query engine to drastically improve performance
 * ps.Cube.transforms - filters hyper.Cell instances unix-time code

Requirements
-----------

This library requires jQuery, but you could easily replace jQuery if you create $.each, $.map, $.extend, $.isArray, $.isPlainObject, $.isFunction.  This will likely be done in a future release.  If you would like to take this project on, please contact me.

*Highly Recommended:* encourage users to use Google Chrome. IE can be slow for large datasets.

Dedication
-----------

I'd like to dedicate this library to Ralph Kimball.  This book is an excellent read:
http://www.amazon.com/The-Data-Warehouse-Toolki