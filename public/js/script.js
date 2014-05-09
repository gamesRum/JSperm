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
			getTimeStamp: function() {
				return new Date().toLocaleString();
			},
			log: function(message, className) {
				var logContainer = $(this.values.results);

				if(!message) {
					message = "\n";
				}

				if(!className) {
					className = '';
				}

				console.log(className);

				message = message + '<span>' + this.getTimeStamp() + '</span> ';
				message = '<blockquote class="' + className + '">' + message + '</blockquote>';

				logContainer.append(message);
				logContainer.scrollTop(logContainer.prop("scrollHeight"));
			},
			error: function(message) {
				this.log(message, 'error');
			},
			warn: function(message) {
				this.log(message, 'warn');
			},
			runJS: function() {
				var source = this.values.javascript.value;

				try {
					this.log('[EXEC] ' + JSON.stringify(eval(source)));
				} catch (e) {
					this.error('[EXEC] ' + e.message);
				}
			},
			runBenchmark: function() {
				var source = this.values.javascript.value;

				try {
					this.log('[BNCH] run!.');
				} catch (e) {
					this.error('[BNCH] ' + e.message);
				}
			},
			testRun: function() {
				var source = this.values.test.value;

				try {
					this.log('[JSON] ' + JSON.stringify(source));
				} catch (e) {
					this.error('[TEST] ' + e.message);
				}
			},
			validateJSON: function() {
				var source = this.values.json.value;

				try {
					this.log('[JSON] ' + JSON.stringify(JSON.parse(source)));
				} catch (e) {
					this.error('[JSON] ' + e.message);
				}
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
			load: function(name) {
				var self = this;

				$.ajax({
					url:'samples/' + name + '/javascript.js',
					dataType: 'html'
				})
					.success(function(data){
						self.values.javascript.value = data;
					})
					.fail(function() {
						self.log('Error loading javascript file!');
					});

				$.ajax({
					url:'samples/' + name + '/json.json',
					dataType: 'html'
				})
					.success(function(data){
						self.values.json.value = data;
					})
					.fail(function() {
						self.log('Error loading json file!');
					});

				$.ajax({
					url:'samples/' + name + '/test.js',
					dataType: 'html'
				})
					.success(function(data){
						self.values.test.value = data;
					})
					.fail(function() {
						self.log('Error loading test file!');
					});
			},
			init: function() {
				this.load('start');
			}
		};

		App.init();
	};
}());
