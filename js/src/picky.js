;(function() {

	'use strict';

	var version = '1.1.0',
		name = 'Picky';

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
			mod = {},
			defaults = {

			disablePast: true,
			disable: [],
			disableDays: [],
			labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			advance: 0,
			startDay: null,
			select_callback: null,
			linked: null

		},
		options = $.extend(defaults, settings), container, header, nav, table, cells,
		today = options.startDay ? new Date(options.startDay) : new Date(),
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

				self.on('click', mod['dates'].show)
				cells.on('click', mod['dates'].fillOut);
				nav.on('click', mod['dates'].navigate);

			},

			defineModules: function() {

				var modules = ['misc', 'dates', 'elements'];

				for(var module in modules) {

					mod[modules[module]] = new ins[modules[module]]();

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

			getMonth: function(date) {

				mod['dates'].populate(date[0], date[1]);

			},

			setStart: function(date) {

				today = new Date(date);
				yesterday = options['disablePast'] === true ? new Date(today.getTime()) : 0;
				if(typeof yesterday === 'object') yesterday.setDate(today.getDate() -1);
				
				mod['dates'].populate(today.getMonth(), today.getFullYear());
			}

		}

		ins.misc = function() {

			this.report = function(type, message) {

				if(console) console[type]('['+ name +' '+ version +'] - ' + message);

			}

		}

		ins.dates = function() {

			this.show = function() {

				container.addClass('active');

			}

			this.fillOut = function() {

				var cell = $(this),
					date = cell.data('date');

				if(date > yesterday) {

					if(cell.hasClass('disabled') && date.getMonth() === currentMonth.getMonth()) return;

				}
				
				if(cell.hasClass('disabled')) {

					mod['dates'].populate(date.getMonth(), date.getFullYear());
					return;

				}
				
				self.val(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());

				container.removeClass('active');
				
				if(typeof options['select_callback'] === 'function') options['select_callback'](self, cell, date);

				if(typeof options['linked'] === 'object' && options['linked'].size() > 0 && options['linked'].data('ins') !== ins) {

					date.setDate(date.getDate() + 1);
					options['linked'].picky('setStart', date);
					
				}

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

				while(date.getMonth() === (month == 11 ? 0 : month + 1)) {

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
				currentMonth = new Date(days[0].getTime());
				
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

				mod['dates'].setNav();

			}

			this.activateDay = function(date, cell) {

				if(date['full'].getMonth() === date['month'] && date['full'] > yesterday) cell.removeClass('disabled');
				if(options['disable'].length > 0) {

					for(var i = 0; i < options['disable'].length; i++) {

						if(typeof options['disable'][i] === 'string' && date['full'] >= new Date(options['disable'][i]) && date['full'] <= new Date(options['disable'][i])) {

							cell.addClass('disabled');

						} else if(typeof options['disable'][i] === 'object' && date['full'] >= new Date(options['disable'][i][0]) && date['full'] <= new Date(options['disable'][i][1])) {

							cell.addClass('disabled');

						}

					}
					
				}

				for(var i = 0; i < options['disableDays'].length; i++) {

					if(date['full'].getDay() == options['disableDays'][i]) cell.addClass('disabled');

				}

			}

			this.setNav = function() {

				var next = new Date(currentMonth.getTime()),
					prev = new Date(currentMonth.getTime());

				next.setMonth(next.getMonth() + 1);
				prev.setMonth(prev.getMonth() - 1);

				container.find('.picky__nav--next').data('date', next);
				container.find('.picky__nav--prev').data('date', prev);

			}

			this.navigate = function() {

				var date = $(this).data('date');

				mod['dates'].populate(date.getMonth(), date.getFullYear());

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

				nav = container.find('.picky__nav');

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

					if(rowIndex === 0) cell.text(options['labels'][i]);

				}

			}			

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();