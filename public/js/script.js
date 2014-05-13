;(function() {
	"use strict";

	$.ready = function() {

		window.App = {
			panes: {
				javascript: $('#javascript')[0],
				test: $('#test')[0],
				json: $('#json')[0],
				results: $('#results')[0],
				status: $('#popup')[0],
				loginError: $('#loginError')[0],
				registerError: $('#registerError')[0],
				overlay: $('#overlay')[0],
				projects: $('#projects')[0],
				profileIcon: $('#profileIcon')[0]
			},

			editors: {
				javascript: null,
				test: null,
				json: null,
				name: $('#project')[0],
				username: $('#username')[0],
				password: $('#password')[0],
				newusername: $('#newusername')[0],
				newpassword: $('#newpassword')[0],
				newemail: $('#newemail')[0],
				newname: $('#newname')[0],
				newdescription: $('#newdescription')[0]
			},

			getTimeStamp: function() {
				return new Date().toLocaleString();
			},

			log: function(message, className) {
				var logContainer = $(App.panes.results);

				if(!message) {
					message = "\n";
				}

				if(!className) {
					className = '';
				} else {
					className = 'class="' + className + '"';
				}

				message = message + '<span>' + App.getTimeStamp() + '</span> ';
				message = '<blockquote ' + className + '>' + message + '</blockquote>';

				logContainer.append(message);
				logContainer.scrollTop(logContainer.prop("scrollHeight"));
			},

			error: function(message) {
				App.log(message, 'error');
			},

			warn: function(message) {
				App.log(message, 'warn');
			},

			setStatus: function(message) {
				App.panes.status.innerHTML = message;
				$(App.panes.status).fadeIn();
				setTimeout(function(){
					$(App.panes.status).fadeOut();
				}, 5000);
				App.log(message);
			},

			login: function() {
				var username = App.editors.username.value,
					password = App.editors.password.value;

				if(username, password) {
					App.panes.loginError.innerHTML= '';

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
							$(App.panes.profileIcon).css('background-image', 'url("' + data.avatar + '?s=18")');

							App.loadProjects();
						} else {
							App.editors.password.value = '';
							App.panes.loginError.innerHTML= data.message;
						}
					}).fail(function(data, response){
						App.panes.loginError.innerHTML(data.message);
					});
				} else {
					App.setStatus('ERROR: Cannot save unnamed project ');
				}

				return false;
			},

			register: function() {
				if(App.editors.newname.value) {
					$.ajax({
						type: "POST",
						url: 'api/register',
						data: {
							newusername: App.editors.newusername.value,
							newpassword: App.editors.newpassword.value,
							newemail: App.editors.newemail.value,
							newname: App.editors.newname.value,
							newdescription: App.editors.newdescription.value,
						},
						dataType: 'JSON'
					}).success(function(data){
						if(data.status){
							App.showDialog('#welcomeDialog');
							App.editors.username.value = newusername.value;
							App.editors.password.value = newpassword.value;
							App.login();
						} else {
							App.panes.registerError.innerHTML= data.message;
						}
					}).fail(function(data, response){
						App.panes.registerError.innerHTML= data.message;
					});
				} else {
					App.setStatus('ERROR: Cannot register this user');
				}

				return false;
			},

			loadProjects: function() {
				$(App.panes.overlay).fadeOut();
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
					}).success(function(data){
						if(data.status) {
								App.setStatus('Project saved!');
						} else {
								App.setStatus('ERROR: ' + data.message + ' [' + App.editors.name.value + '].');
						}
					}).fail(function(data) {
						App.setStatus('ERROR: Cannot save project [' + App.editors.name.value + '].');
					});;
				} else {
					App.setStatus('ERROR: Cannot save unnamed project ');
				}
			},

			loadAll: function(event) {
				$('#projects').slideUp();

				if(event) {
					App.editors.name.value = event.target.innerHTML;
				}

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
				if(App.editors.name.value) {
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
				} else {
					App.setStatus('ERROR: Nothing to be run here!');
				}
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

			closeDialog: function(selector) {
				if(selector) {
					$(selector).fadeOut();
				} else {
					$('.overlay').fadeOut();
				}
			},

			showDialog: function(selector) {
				$('.overlay .dialog:not('+selector+')').hide();
				$(selector).show();
			},

			init: function() {
				App.editors.username.focus();

				$('#loginForm').on('submit', App.login);
				$('#registerForm').on('submit', App.register);

				$('#popup').on('click', function(){
					$(App.panes.status).fadeOut();
				});

				$('#projectsButton').on('click', function(){
					$('#projects').slideToggle();
				});

				App.editors.javascript = CodeMirror.fromTextArea(App.panes.javascript, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'phoenix'
				});

				App.editors.json = CodeMirror.fromTextArea(App.panes.json, {
				    lineNumbers: true,
    				mode: "javascript",
					styleActiveLine: true,
					matchBrackets: true,
					theme: 'phoenix'
				});

				App.editors.test = CodeMirror.fromTextArea(App.panes.test, {
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
