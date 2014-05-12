;(function() {
	"use strict";

	$.ready = function() {

		window.App = {
			panes: {
				javascript: $('#javascript')[0],
				test: $('#test')[0],
				json: $('#json')[0],
				results: $('#results')[0],
				status: $('#status')[0],
				loginError: $('#loginError')[0],
				overlay: $('#overlay')[0],
				projects: $('#projects')[0]
			},

			editors: {
				javascript: null,
				test: null,
				json: null,
				name: null,
				username: null,
				password: null
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
				} else {
					className = 'class="' + className + '"';
				}

				message = message + '<span>' + this.getTimeStamp() + '</span> ';
				message = '<blockquote ' + className + '>' + message + '</blockquote>';

				logContainer.append(message);
				logContainer.scrollTop(logContainer.prop("scrollHeight"));
			},

			error: function(message) {
				this.log(message, 'error');
			},

			warn: function(message) {
				this.log(message, 'warn');
			},

			setStatus: function(message) {
				this.panes.status.innerHTML = message;
			},

			login: function() {
				var username = App.editors.username.value,
					password = App.editors.password.value,
					self = this;

				App.panes.loginError.innerHTML= '';

				if(username, password) {
					$.ajax({
						type: "POST",
						url: 'api/login',
						data: {
							username: username,
							password: password
						},
						dataType: 'JSON'
					}).success(function(data){
						if(data.status) {
							var newProjects = '';

							for(var index in data.projects) {
								newProjects += '<span class="link">' + data.projects[index] + '</span>';
							}

							App.panes.projects.innerHTML = newProjects;
							$('#projects span').on('click', App.loadAll);

							App.loadProjects();
						} else {
							App.editors.password.value = '';
							App.panes.loginError.innerHTML= data.message;
						}
					}).fail(function(data, response){
						self.panes.loginError.innerHTML(data.message);
					});
				} else {
					this.setStatus('ERROR: Cannot save unnamed project ');
				}
				return false;
			},

			loadProjects: function() {
				$(this.panes.overlay).fadeOut();
			},

			saveAll: function() {
				if(App.editors.name.value) {
					$.ajax({
						type: "POST",
						url: 'api/save',
						data: {
							username: App.editors.username.value,
							project: App.editors.name.value,
							files: {
								'javascript.js': App.editors.javascript.getValue(),
								'test.js': App.editors.test.getValue(),
								'data.json': App.editors.json.getValue()
							}
						},
						dataType: 'JSON'
					});
				} else {
					App.setStatus('ERROR: Cannot save unnamed project ');
				}
			},

			loadAll: function(event) {
				App.editors.name.value = event.target.innerHTML;
				$('#projects').slideUp();

				if(App.editors.name.value) {
					$.ajax({
						type: "POST",
						url: 'api/load',
						data: {
							username: App.editors.username.value,
							project: App.editors.name.value
						},
						success: function(data){
							if(data.status) {
								App.editors.name.value = data.name;
								App.editors.javascript.setValue(data.files['javascript.js']);
								App.editors.test.setValue(data.files['test.js']);
								App.editors.json.setValue(data.files['data.json']);
								App.log('[LOAD] ' + data.message);
								App.setStatus('Project loaded!');
							} else {
								App.setStatus('ERROR: ' + data.message + ' [' + App.editors.name.value + '].');
							}
						},
						dataType: 'JSON'
					}).fail(function(data) {
						App.setStatus('ERROR: Cannot open project [' + App.editors.name.value + '].');
					});
				} else {
					App.setStatus('ERROR: Cannot open an empty project.');
				}
			},

			runJS: function() {
				$.ajax({
					type: "POST",
					url: 'api/execute',
					data: {
						username: App.editors.username.value,
						project: App.editors.name.value
					},
					success: function(data){
						var log = '';
						App.editors.name.value = data.name;

						for(var key in data.response) {
							if (data.response.hasOwnProperty(key)) {
								var output = data.response[key].output,
									profiling = data.response[key].profiling,
									exitCode = data.response[key].exit?'error':'';

								log += '<br />[EXEC] ' + key;
								log += '<div class="code ' + exitCode + '">';

								if(typeof output === 'string' && output.length) {
									log += output;
								}

								log += '</div>';
							}
						}

						App.log(log);
					},
					dataType: 'JSON'
				});
			},

			testRun: function() {
				var source = App.editors.test.getValue();

				try {
					App.log('[JSON] ' + JSON.stringify(source));
				} catch (e) {
					App.error('[TEST] ' + e.message);
				}
			},

			validateJSON: function() {
				var source = App.editors.json.getValue();

				try {
					App.log('[JSON] ' + JSON.stringify(JSON.parse(source)));
				} catch (e) {
					App.error('[JSON] ' + e.message);
				}
			},

			clearResults: function() {
				App.panes.results.innerHTML = '';
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
				this.editors.name = $('#project')[0];
				this.editors.username = $('#username')[0];
				this.editors.password = $('#password')[0];
				this.panes.loginError = $('#loginError')[0];

				this.editors.username.focus();

				$('#loginForm').on('submit', App.login);
				$('#projectsButton').on('click', function(){
					$('#projects').slideToggle();
				});

				this.editors.javascript = CodeMirror.fromTextArea(this.panes.javascript, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'phoenix'
				});

				this.editors.json = CodeMirror.fromTextArea(this.panes.json, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'phoenix'
				});

				this.editors.test = CodeMirror.fromTextArea(this.panes.test, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'phoenix'
				});
			}
		};

		App.init();
	};
}());
