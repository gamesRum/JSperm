;(function() {
	"use strict";

	$.ready = function() {

		window.App = {
			panes: {
				javascript: $('#javascript')[0],
				test: $('#test')[0],
				json: $('#json')[0],
				results: $('#results')[0]
			},
			editors: {
				javascript: null,
				test: null,
				json: null,
				name: null
			},
			getTimeStamp: function() {
				return new Date().toLocaleString();
			},
			log: function(message, className) {
				var logContainer = $(this.panes.results);

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
			saveAll: function() {
				var self = this;

				$.ajax({
					type: "POST",
					url: 'api/save',
					data: {
						project: self.editors.name.value,
						files: {
							'javascript.js': self.editors.javascript.getValue(),
							'test.js': self.editors.test.getValue(),
							'data.json': self.editors.json.getValue()
						}
					},
					success: function(data){
						console.log(data);
					},
					dataType: 'JSON'
				});
			},
			loadAll: function() {
				var self = this;

				$.ajax({
					type: "POST",
					url: 'api/load',
					data: {
						project: self.editors.name.value
					},
					success: function(data){
						self.editors.name.value = data.name;
						self.editors.javascript.setValue(data.files['javascript.js']);
						self.editors.test.setValue(data.files['test.js']);
						self.editors.json.setValue(data.files['data.json']);
					},
					error: function(data) {
						console.log(JSON.Parse(data.responseText));
					},
					dataType: 'JSON'
				});
			},
			runJS: function() {
				var source = this.editors.javascript.getValue();

				this.saveAll();

				try {
					this.log('[EXEC] ' + JSON.stringify(eval(source)));
				} catch (e) {
					this.error('[EXEC] ' + e.message);
				}
			},
			runBenchmark: function() {
				var source = this.editors.javascript.getValue();

				try {
					this.log('[BNCH] run!.');
				} catch (e) {
					this.error('[BNCH] ' + e.message);
				}
			},
			testRun: function() {
				var source = this.editors.test.getValue();

				try {
					this.log('[JSON] ' + JSON.stringify(source));
				} catch (e) {
					this.error('[TEST] ' + e.message);
				}
			},
			validateJSON: function() {
				var source = this.editors.json.getValue();

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
			init: function() {
				this.editors.name = $('#projectName')[0];
				console.log(this.editors.name);

				this.editors.javascript = CodeMirror.fromTextArea(this.panes.javascript, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'mbo'
				});

				this.editors.json = CodeMirror.fromTextArea(this.panes.json, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'mbo'
				});

				this.editors.test = CodeMirror.fromTextArea(this.panes.test, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'mbo'
				});

				this.loadAll();
			}
		};

		App.init();
	};
}());
