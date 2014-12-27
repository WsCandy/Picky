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


				mod['dates'].populate(11, 2014);
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

		ins.misc = function() {

			this.report = function(type, message) {

				if(console)	console[type]('['+ name +' '+ version +'] - ' + message);

			}

		}

		ins.dates = function() {

			this.show = function(month) {

				console.log($(this).data('date'));

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

				return days;

			}

			this.populate = function(month, year) {

				var days = mod['dates'].getDays(month, year),
					firstDayOffset = days[0].getDay() - 1 === -1 ? 6 : days[0].getDay() - 1;
					
					cells = table.find('.picky__table--cell');
					cells.addClass('disabled');

				for(var i = 0; i < cells.length; i++) {

					var cell = $(cells[i + firstDayOffset]);

					if(days[i]) cell.removeClass('disabled');

					if(!days[i]) continue;

					if(days[i].getMonth() === today.getMonth() && days[i].getDate() === today.getDate() && days[i].getYear() === today.getYear()) cell.addClass('active');

					cell.data('date', days[i]);
					cell.text(days[i].getDate());

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

				var row = $('<tr />').appendTo(table);

				for(var i = 0; i < 7; i++) {

					$('<td />', {

						'class' : 'picky__table--' + (rowIndex === 0 ? 'heading' : 'cell')

					}).appendTo(row);

				}

			}			

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();