;(function() {
	"use strict";

	$.ready = function() {
		window.App = {
			values: {
				javascript: $('#javascript')[0],
				test: $('#test')[0],
				json: $('#json')[0],
				results: $('#results')[0]
			},
			log: function(message) {
				if(!message) {
					message = "\n";
				}
				this.values.results.value = this.values.results.value + message + "\n";
			},
			runJS: function() {
				var source = this.values.javascript.value,
					results = 'executed!';

				try {
					eval(source);
				} catch (e) {
					results = 'failed!';
					this.log('[RUN ] ' + e.message);
				}

				this.log('[RUN ] ' + results);
			},
			testRun: function() {
				var source = this.values.test.value,
					results = 'executed!';

				try {
					eval(source);
				} catch (e) {
					results = 'failed!';
					this.log('[TEST] ' + e.message);
				}

				this.log('[TEST] ' + results);
			},
			validateJSON: function() {
				var source = this.values.json.value,
					results = 'valid!';

				try {
					JSON.parse(source);
				} catch (e) {
					results = 'not valid!';
					this.log('[JSON] ' + e.message);
				}

				this.log('[JSON] ' + results);
			},
			clearResults: function() {
				$('#results')[0].value = '';
			},
			runTest: function(testFunction, silent) {
			    for(var index = 0; index < testCases.length; index++) {
			        var ip = testCases[index],
			            response = null;

			        try{
			            response = testFunction(ip);
			        } catch(err) {
			            response = 'ERROR';
			        }

			        if(!silent) {
			            console.log('    [', response, ']', ip);
			        }
			    }
			},
			benchmark: function(method) {
			  var author = null,
			      start = +(new Date);

			  method && method(function (callback) {
			    var end = +(new Date);
			    var difference = end - start;

			    callback && callback(start, end, { ms: difference });
			  });
			},
			clock: function(start, end, difference) {
			    console.log('[' + author + '] ' + difference.ms + 'ms!');
			},
			init: function() {
				console.log('loading...');
			}
		};

		App.init();
	};
}());
