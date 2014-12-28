;(function() {

	'use strict';

	var version = '1.0a',
		name = 'Picky',
		mod = {};

	$.fn.picky = function(settings, params) {
		
		var results = [];

		for(var i = 0; i < this.length; i++) {

			var self = $(this[i]);

			if(!self.data('ins')) {

				if(typeof settings == 'string' && console) {

					console.error('['+ name +' '+ version +'] - not running, try firing methods after initialisation'); 
					continue;

				}

				var ins = new picky_core(self, settings);

				ins.init();

				self.data('ins', ins);

			} else {

				var ins = self.data('ins');

				if(ins['publicF'][settings]) {

					if(this.length > 1) {

						results.push(ins['publicF'][settings](params));

					} else {

						return ins['publicF'][settings](params);
						
					}

				} else {

					if(console) {
					
						console.error('['+ name +' '+ version +'] - "'+ settings +'" is not a public method here\'s a nice list:');
						return ins['publicF'];

					}

				}

			}

		}

		if(results.length >= 1) return results;

	}

	var picky_core = function(self, settings) {

		var ins = this,
			container,
			table,
			cells,
			today = new Date();

		var setUp = {

			init: function() {

				setUp.defineModules();

				if(!setUp.checks()) return;

				mod['elements'].construct();


				mod['dates'].populate();
				setUp.bindings();

			},

			bindings: function() {

				cells.on('click', mod['dates'].show);

			},

			defineModules: function() {

				var modules = ['misc', 'dates', 'elements'];

				for(var module in modules) {

					mod[modules[module]] = new ins[modules[module]]();

					if(mod[modules[module]].setUp) mod[modules[module]].setUp();

				}

			},

			checks: function() {

				if(!self.is('input[type="text"]')) {

					mod['misc'].report('warn', 'Please fire the plugin on an input[type="text"] element! - Shutting down... :(');
					return false;
					
				}

				return true;

			}

		}

		ins.publicF = {

			getMonth : function(date) {

				mod['dates'].populate(date[0], date[1]);

			}

		}

		ins.misc = function() {

			this.report = function(type, message) {

				if(console)	console[type]('['+ name +' '+ version +'] - ' + message);

			}

		}

		ins.dates = function() {

			this.show = function(month) {

				var cell = $(this),
					date = cell.data('date');

				if(cell.hasClass('disabled')) return;

				self.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());

			}

			this.getDays = function(month, year) {

				month = month === undefined ? today.getMonth() : month;
				year = year === undefined ? today.getFullYear() : year;

				var date = new Date(year, month, 1),
					days = [];

				while(date.getMonth() === month) {

					days.push(new Date(date));
					date.setDate(date.getDate() + 1);

				}

				month = month == 11 ? 0 : month + 1;

				while(date.getMonth() === month) {

					days.push(new Date(date));
					date.setDate(date.getDate() + 1);

				}

				return days;

			}

			this.populate = function(month, year) {

				var days = mod['dates'].getDays(month, year),
					firstDayOffset = days[0].getDay() - 1 === -1 ? 6 : days[0].getDay() - 1;

					month = !month ? days[0].getMonth() : month;
					year = year === undefined ? today.getFullYear() : year;
					
					cells = table.find('.picky__table--cell');
					cells.addClass('disabled');
					cells.removeClass('active');

				for(var i = 0; i < cells.length; i++) {

					var cell = $(cells[i + firstDayOffset]),
						yesterday = new Date();
						yesterday.setDate(today.getDate() -1);

					if(days[i].getMonth() === month && days[i] > yesterday) {

						cell.removeClass('disabled');

					};

					if(days[i].getMonth() === today.getMonth() && days[i].getDate() === today.getDate() && days[i].getYear() === today.getYear()) cell.addClass('active');

					cell.data('date', days[i]);
					cell.text(days[i].getDate());

				}

				for(var i = firstDayOffset -1; i >= 0; i--) {

					var cell = $(cells[i]);

					days.push(new Date(year, month, 1));

					days[days.length - 1].setDate(days[i].getDate() - firstDayOffset);

					cell.data('date', days[days.length - 1]);
					cell.text(days[days.length - 1].getDate());

				}

			}

		}

		ins.elements = function() {

			this.construct = function() {

				self.attr('readonly', true);

				mod['elements'].createContainer();
				mod['elements'].createTable();

			}

			this.createContainer = function() {

				container = $('<div />', {

					'class' : 'picky__container'

				}).appendTo(self.parent());				

			}

			this.createTable = function() {

				table = $('<table />', {

					'class' : 'picky__table'

				}).appendTo(container);

				for(var i = 0; i < 7; i++) {

					mod['elements'].createRow(i);

				}

			}

			this.createRow = function(rowIndex) {

				var row = $('<tr />').appendTo(table),
					days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

				for(var i = 0; i < 7; i++) {

					var cell = $('<td />', {

						'class' : 'picky__table--' + (rowIndex === 0 ? 'heading' : 'cell')

					}).appendTo(row);

					if(rowIndex === 0) {

						cell.text(days[i]);

					}

				}

			}			

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();