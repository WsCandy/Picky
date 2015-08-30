;(function() {

	'use strict';

	var version = '1.4.2',
		name = 'Picky';

	$.fn.picky = function(settings, params) {
		
		var results = [],
			ins;

		for(var i = 0; i < this.length; i++) {

			var self = $(this[i]);

			if(!self.data('ins')) {

				if(typeof settings === 'string' && console) {

					console.error('['+ name +' '+ version +'] - not running, try firing methods after initialisation'); 
					continue;

				}

				ins = new PickyCore(self, settings);
				ins.init();

				self.data('ins', ins);

			} else {

				ins = self.data('ins');

				if(ins.publicF[settings]) {

					if(this.length > 1) {

						results.push(ins.publicF[settings](params));

					} else {

						return ins.publicF[settings](params);
						
					}

				} else {

					if(console) {
					
						console.error('['+ name +' '+ version +'] - "'+ settings +'" is not a public method here\'s a nice list:');
						return ins.publicF;

					}

				}

			}

		}

		if(results.length >= 1) {
		
			return results;

		}

	};

	var PickyCore = function(self, settings) {

		var ins = this,
			mod = {},
			defaults = {

			disablePast: true,
			disableFuture: false,
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
		
		if(options.disableFuture === false) {
			
			options.disableFuture = 100000;
			
		} else if(options.disableFuture === true) {
		
			options.disableFuture = 0;
				
		}

		today.setDate(today.getDate() + options.advance);

		var yesterday = options.disablePast === true ? new Date(today.getTime()) : 0;

		if(typeof yesterday === 'object') {
		
			yesterday.setDate(today.getDate() -1);

		}

		var setUp = {

			init: function() {

				setUp.defineModules();

				if(!setUp.checks()) {

					return;
					
				}

				mod.elements.construct();
				mod.dates.populate();
				setUp.bindings();

			},

			bindings: function() {

				self.on('click', mod.dates.show);
				cells.on('click', mod.dates.fillOut);
				nav.on('click', mod.dates.navigate);

			},

			defineModules: function() {

				var modules = ['misc', 'dates', 'elements'];

				for(var module in modules) {

					if(modules.hasOwnProperty(module)) {

						mod[modules[module]] = new ins[modules[module]]();						

					}

				}

			},

			checks: function() {

				if(!self.is('input[type="text"]')) {

					mod.misc.report('warn', 'Please fire the plugin on an input[type="text"] element! - Shutting down... :(');
					return false;
					
				}

				return true;

			}

		};

		ins.publicF = {

			getMonth: function(date) {

				mod.dates.populate(date[0], date[1]);

			},

			setStart: function(date) {

				today = new Date(date);
				yesterday = options.disablePast === true ? new Date(today.getTime()) : 0;
				if(typeof yesterday === 'object') {

					yesterday.setDate(today.getDate() -1);
					
				}
				
				mod.dates.populate(today.getMonth(), today.getFullYear());
			}

		};

		ins.misc = function() {

			this.report = function(type, message) {

				if(console) {

					console[type]('['+ name +' '+ version +'] - ' + message);

				}

			};

		};

		ins.dates = function() {

			this.show = function() {

				container.addClass('active');

			};

			this.fillOut = function() {

				var cell = $(this),
					date = cell.data('date');

				if(date > yesterday && (cell.hasClass('disabled') && date.getMonth() === currentMonth.getMonth())) {

					return;

				}
				
				if(cell.hasClass('disabled')) {

					mod.dates.populate(date.getMonth(), date.getFullYear());
					return;

				}				

				mod.dates.setValues(cell, date);
				mod.dates.linkedOptions(cell, date);

			};
			
			this.parseDouble = function(value) {
				
				if(value < 10) {
				
					return '0'+value;
						
				} else {
				
					return value;
						
				}
				
			};

			this.setValues = function(cell, date) {

				var dateValue = (mod.dates.parseDouble(date.getDate())) + '/' + (mod.dates.parseDouble(date.getMonth() + 1)) + '/' + date.getFullYear();
				
				self.val(dateValue);
				container.removeClass('active');
				
				if(typeof options.select_callback === 'function') {

					options.select_callback(self, cell, date);
					
				}

			};

			this.linkedOptions = function(cell, date) {

				if(typeof options.linked === 'object' && (options.linked && options.linked.length > 0) && options.linked.data('ins') !== ins && options.disableFuture !== true) {

					var startDate = new Date(date);
						startDate.setDate(date.getDate() +1);

					options.linked.picky('setStart', startDate);
					options.linked.val('');
					
				}

			};

			this.getDays = function(month, year) {

				month = (month === undefined ? today.getMonth() : month);
				year = (year === undefined ? today.getFullYear() : year);

				var date = new Date(year, month, 1),
					days = [];

				while(date.getMonth() === month) {

					days.push(new Date(date));
					date.setDate(date.getDate() + 1);

				}

				while(date.getMonth() === (month === 11 ? 0 : month + 1)) {

					days.push(new Date(date));
					date.setDate(date.getDate() + 1);

				}

				return days;

			};

			this.populate = function(month, year) {

				var days = mod.dates.getDays(month, year),
					firstDayOffset = days[0].getDay() - 1 === -1 ? 6 : days[0].getDay() - 1;

				month = month || days[0].getMonth();
				year = year || today.getFullYear();
				currentMonth = new Date(days[0].getTime());
				
				cells = table.find('.picky__table--cell');
				cells.addClass('disabled');
				cells.removeClass('active');

				header.text(options.monthNames[days[0].getMonth()] + ' ' + days[0].getFullYear());

				mod.dates.populateMonth(days, month, year, firstDayOffset);
				mod.dates.populateNextMonth(days, month, year, firstDayOffset);

				mod.dates.setNav();

			};

			this.populateMonth = function(days, month, year, firstDayOffset) {

				for(var i = 0, l = cells.length; i < l; i++) {

					var cell = $(cells[i + firstDayOffset]);

					mod.dates.activateDay({

						full: days[i],
						month: month,
						year: year

					}, cell);

					if(days[i].getMonth() === today.getMonth() && days[i].getDate() === today.getDate() && days[i].getYear() === today.getYear()) {

						cell.addClass('active');

					}

					cell.data('date', days[i]);
					cell.text(days[i].getDate());

				}

			};

			this.populateNextMonth = function(days, month, year, firstDayOffset) {

				for(var i = firstDayOffset -1; i >= 0; i--) {

					var cell = $(cells[i]);

					days.push(new Date(year, month, 1));
					days[days.length - 1].setDate(days[i].getDate() - firstDayOffset);

					cell.data('date', days[days.length - 1]);
					cell.text(days[days.length - 1].getDate());

				}

			};

			this.activateDay = function(date, cell) {

				var disableAfter = new Date();
					disableAfter.setDate(today.getDate() + options.disableFuture);

				if(date.full.getMonth() === date.month && date.full > yesterday && date.full < disableAfter) {

					cell.removeClass('disabled');

				}

				if(date.full.getTime() < today.getTime() && options.disableFuture === true) {

					cell.removeClass('disabled');

				}

				mod.dates.disableDates(date, cell);
				mod.dates.disableDOW(date, cell);				

			};

			this.disableDates = function(date, cell) {

				if(options.disable.length > 0) {

					for(var i = 0, l = options.disable.length; i < l; i++) {

						if(typeof options.disable[i] === 'string') {

							var split = options.disable[i].split('-', 3);
							
							if(date.full >= new Date(split[0], (split[1] -1), split[2]) && date.full <= new Date(split[0], (split[1] - 1), split[2])) {

								cell.addClass('disabled');

							}

						} else if(typeof options.disable[i] === 'object') {

							var start = options.disable[i][0].split('-', 3),
								end =  options.disable[i][1].split('-', 3);

							if(date.full >= new Date(start[0], (start[1] -1), start[2]) && date.full <= new Date(end[0], (end[1] -1), end[2])) {

								cell.addClass('disabled');

							}

						}

					}
					
				}

			};

			this.disableDOW = function(date, cell) {

				for(var i = 0, l = options.disableDays.length; i < l; i++) {

					if(date.full.getDay() === options.disableDays[i]) {

						cell.addClass('disabled');

					}

				}

			};

			this.setNav = function() {

				var next = new Date(currentMonth.getTime()),
					prev = new Date(currentMonth.getTime());

				next.setMonth(next.getMonth() + 1);
				prev.setMonth(prev.getMonth() - 1);

				container.find('.picky__nav--next').data('date', next);
				container.find('.picky__nav--prev').data('date', prev);

			};

			this.navigate = function(e) {

				var date = $(this).data('date');

				e.preventDefault();

				mod.dates.populate(date.getMonth(), date.getFullYear());

			};

		};

		ins.elements = function() {

			this.construct = function() {

				self.attr('readonly', true);
				mod.elements.createContainer().createHeader().createNav().createTable();

			};

			this.createContainer = function() {

				container = $('<div />', {

					'class' : 'picky__container'

				}).appendTo(self.parent());

				return mod.elements;

			};

			this.createNav = function() {

				for(var i = 0; i < 2; i++) {

					$('<a />', {

						'class' : 'picky__nav picky__nav' + (i === 0 ? '--prev' : '--next'),
						'href' : '#'

					}).prependTo(container);

				}

				nav = container.find('.picky__nav');

				return mod.elements;

			};

			this.createHeader = function() {

				header = $('<p />', {

					'class' : 'picky__header'

				}).prependTo(container);

				header.text(options.monthNames[today.getMonth()] + ' ' + today.getFullYear());

				return mod.elements;

			};

			this.createTable = function() {

				table = $('<table />', {

					'class' : 'picky__table'

				}).appendTo(container);

				for(var i = 0; i < 7; i++) {

					mod.elements.createRow(i);

				}

				return mod.elements;

			};

			this.createRow = function(rowIndex) {

				var row = $('<tr />').appendTo(table);

				for(var i = 0; i < 7; i++) {

					var cell = $('<td />', {

						'class' : 'picky__table--' + (rowIndex === 0 ? 'heading' : 'cell')

					}).appendTo(row);

					if(rowIndex === 0) {

						cell.text(options.labels[i]);

					}

				}

			};	

		};

		ins.init = function() {

			setUp.init();

		};

	};

})();