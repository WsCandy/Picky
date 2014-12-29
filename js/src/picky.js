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
			defaults = {

			disablePast: true,
			disable: [],
			disableDays: [],
			labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			advance: 0

		}
		
		var options = $.extend(defaults, settings),
			container,
			header,
			table,
			cells,
			today = new Date(),
			currentMonth = 0;

		today.setDate(today.getDate() + options['advance']);

		var yesterday = options['disablePast'] === true ? new Date(today.getTime()) : 0;

		if(typeof yesterday === 'object') yesterday.setDate(today.getDate() -1);

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

			this.show = function() {

				var cell = $(this),
					date = cell.data('date');

				if(date > yesterday) {

					if(cell.hasClass('disabled') && date.getMonth() === currentMonth) return;

				}
				
				if(cell.hasClass('disabled')) {

					mod['dates'].populate(date.getMonth(), date.getFullYear());
					return;

				}
				
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
				currentMonth = month;
				
				cells = table.find('.picky__table--cell');
				cells.addClass('disabled');
				cells.removeClass('active');

				header.text(options['monthNames'][days[0].getMonth()] + ' ' + days[0].getFullYear());

				for(var i = 0; i < cells.length; i++) {

					var cell = $(cells[i + firstDayOffset]);

					mod['dates'].activateDay({

						full: days[i],
						month: month,
						year: year

					}, cell);

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

			this.activateDay = function(date, cell) {

				if(date['full'].getMonth() === date['month'] && date['full'] > yesterday) {

					cell.removeClass('disabled');

				};

				if(options['disable'].length > 0) {

					for(var i = 0; i < options['disable'].length; i++) {

						if(date['full'] >= new Date(options['disable'][(i % 2 === 0 ? i : i -1)]) && date['full'] <= new Date(options['disable'][i])) {

							cell.addClass('disabled');

						}

					}
					
				}

				for(var i = 0; i < options['disableDays'].length; i++) {

					if(date['full'].getDay() == options['disableDays'][i]) {

						cell.addClass('disabled');

					}

				}

			}

		}

		ins.elements = function() {

			this.construct = function() {

				self.attr('readonly', true);

				mod['elements'].createContainer();
				mod['elements'].createHeader();
				mod['elements'].createNav();
				mod['elements'].createTable();

			}

			this.createContainer = function() {

				container = $('<div />', {

					'class' : 'picky__container'

				}).appendTo(self.parent());				

			}

			this.createNav = function() {

				for(var i = 0; i < 2; i++) {

					$('<a />', {

						'class' : 'picky__nav picky__nav' + (i == 0 ? '--prev' : '--next'),
						'href' : 'javascript:void(0)'

					}).prependTo(container);

				}

			}

			this.createHeader = function() {

				header = $('<p />', {

					'class' : 'picky__header'

				}).prependTo(container);

				header.text(options['monthNames'][today.getMonth()] + ' ' + today.getFullYear());

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

					var cell = $('<td />', {

						'class' : 'picky__table--' + (rowIndex === 0 ? 'heading' : 'cell')

					}).appendTo(row);

					if(rowIndex === 0) {

						cell.text(options['labels'][i]);

					}

				}

			}			

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();