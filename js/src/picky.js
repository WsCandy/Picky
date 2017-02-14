;(function() {

	'use strict';

	var version = '1.6.1',
		name = 'Picky';

	$.fn.picky = function(settings, params) {

		var results = [],
			ins;

		for(var i = 0; i < this.length; i++) {

			var self = $(this[i]);

			if(!self.data('ins')) {

				if(typeof settings === 'string' && console) {

					console.error('[' + name + ' ' + version + '] - not running, try firing methods after initialisation');
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

						console.error('[' + name + ' ' + version + '] - "' + settings + '" is not a public method here\'s a nice list:');
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
				enable: [],
				disable: [],
				disableDays: [],
				format: 'd/m/Y',
				labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				advance: 0,
				startDay: null,
				select_callback: null,
				linked: null,
				visibleMonths: 1

			},
			options = $.extend(defaults, settings), container = {}, header = {}, nav = {}, table = {}, cells = {},
			today = options.startDay ? new Date(options.startDay) : new Date(),
			currentMonth = 0,
			dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		if(options.disableFuture === false) {

			options.disableFuture = 100000;

		} else if(options.disableFuture === true) {

			options.disableFuture = 0;

		}

		today.setDate(today.getDate() + options.advance);

		var yesterday = options.disablePast === true ? new Date(today.getTime()) : 0;

		if(typeof yesterday === 'object') {

			yesterday.setDate(today.getDate() - 1);

		}

		var setUp = {

			init: function() {

				setUp.defineModules();

				if(!setUp.checks()) {

					return;

				}

				mod.elements.construct();

				for(var i = 0; i < options.visibleMonths; i++) {

					mod.dates.populate(undefined, undefined, i);

				}

				setUp.bindings();

			},

			bindings: function() {

				self.on('click', mod.dates.show);

				for(var i = 0; i < options.visibleMonths; i++) {

					cells[i].on('click', mod.dates.fillOut);
					nav[i].on('click', mod.dates.navigate);
				}

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

				for(var i = 0; i < options.visibleMonths; i++) {

					mod.dates.populate(date[0] + i, date[1], i);

				}

			},

			setStart: function(date) {

				today = new Date(date);
				yesterday = options.disablePast === true ? new Date(today.getTime()) : 0;
				if(typeof yesterday === 'object') {

					yesterday.setDate(today.getDate() - 1);

				}

				for(var i = 0; i < options.visibleMonths; i++) {

					mod.dates.populate(today.getMonth(), today.getFullYear(), i);

				}

			}

		};

		ins.misc = function() {

			this.report = function(type, message) {

				if(console) {

					console[type]('[' + name + ' ' + version + '] - ' + message);

				}

			};

		};

		ins.dates = function() {

			this.show = function() {

				for(var i = 0; i < options.visibleMonths; i++) {

					if(!container[i].hasClass('active')) {
						container[i].addClass('active');
						$('input').blur();
					}
					else {
						container[i].removeClass('active');
					}

				}

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

					return '0' + value;

				} else {

					return value;

				}

			};

			this.parseCharacter = function(character, date) {

				switch(character) {

					case 'd' :

						return mod.dates.parseDouble(date.getDate());

						break;

					case 'j' :

						return date.getDate();

						break;

					case 'D' :

						return dayShort[date.getDay()];

						break;

					case 'l' :

						return dayFull[date.getDay()];

						break;

					case 'w' :

						return date.getDay();

						break;

					case 'S' :

						var dateString = String(date.getDate()).length === 1 ? String(date.getDate()) : String(date.getDate()).substr(1);

						switch(dateString) {

							case '1' :

								return 'st';

								break;

							case '2' :

								return 'nd';

								break;

							case '3' :

								return 'rd';

								break;

							default :

								return 'th';

								break;

						}

						break;

					case 'F' :

						return monthFull[date.getMonth()];

						break;

					case 'm' :

						return mod.dates.parseDouble(date.getMonth() + 1);

						break;

					case 'M' :

						return monthShort[date.getMonth()];

						break;

					case 'n' :

						return date.getMonth() + 1;

						break;

					case 'Y' :

						return date.getFullYear();

						break;

					case 'y' :

						return String(date.getFullYear()).substr(2);

						break;

					default :

						return character;

						break;

				}

			};

			this.formatDate = function(format, date) {

				var finalString = '';

				for(var i = 0, l = format.length; i < l; i++) {

					finalString += mod.dates.parseCharacter(format[i], date);

				}

				return finalString;

			};

			this.setValues = function(cell, date) {

				var dateValue = this.formatDate(options.format, date);

				self.val(dateValue);

				for(var i = 0; i < options.visibleMonths; i++) {

					container[i].removeClass('active');

				}

				if(typeof options.select_callback === 'function') {

					options.select_callback(self, cell, date);

				}

				self.trigger('change');

			};

			this.linkedOptions = function(cell, date) {

				if(typeof options.linked === 'object' && (options.linked && options.linked.length > 0) && options.linked.data('ins') !== ins && options.disableFuture !== true) {

					var startDate = new Date(date);
					startDate.setDate(date.getDate() + 1);

					options.linked.picky('setStart', startDate);
					options.linked.val('');

				}

			};

			this.getDays = function(month, year, index) {

				var initial = month;

				month = (month === undefined ? today.getMonth() : month);
				year = (year === undefined ? today.getFullYear() : year);

				if(initial === undefined) {

					month = month + index;

				}

				if(month >= 12) {

					month = month - 12;
					year += 1;

				}

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

			this.populate = function(month, year, index) {

				var days = mod.dates.getDays(month, year, index),
					firstDayOffset = days[0].getDay() - 1 === -1 ? 6 : days[0].getDay() - 1;

				month = month || days[0].getMonth();
				year = year || today.getFullYear();

				if(index === 0) {

					currentMonth = new Date(days[0].getTime());

				}

				cells[index] = table[index].find('.picky__table--cell');
				cells[index].addClass('disabled');
				cells[index].removeClass('active');

				header[index].text(options.monthNames[days[0].getMonth()] + ' ' + days[0].getFullYear());

				mod.dates.populateMonth({

					days: days,
					month: month,
					year: year,
					firstDayOffset: firstDayOffset,
					index: index

				});

				mod.dates.populateNextMonth({

					days: days,
					month: month,
					year: year,
					firstDayOffset: firstDayOffset,
					index: index

				});

				mod.dates.setNav(index);

			};

			this.populateMonth = function(data) {

				for(var i = 0, l = cells[data.index].length; i < l; i++) {

					var cell = $(cells[data.index][i + data.firstDayOffset]);

					mod.dates.activateDay({

						full: data.days[i],
						month: data.month,
						year: data.year

					}, cell);

					if(data.days[i].getMonth() === today.getMonth() && data.days[i].getDate() === today.getDate() && data.days[i].getYear() === today.getYear()) {

						cell.addClass('active');

					}
					
					cell.data('date', data.days[i]);
					cell.text(data.days[i].getDate());

				}

			};

			this.populateNextMonth = function(data) {

				for(var i = data.firstDayOffset - 1; i >= 0; i--) {

					var cell = $(cells[data.index][i]);

					data.days.push(new Date(data.year, data.month, 1));
					data.days[data.days.length - 1].setDate(data.days[i].getDate() - data.firstDayOffset);

					cell.data('date', data.days[data.days.length - 1]);
					cell.text(data.days[data.days.length - 1].getDate());

				}

			};

			this.activateDay = function(date, cell) {

				var disableAfter = new Date();
				disableAfter.setDate(today.getDate() + options.disableFuture);

				if(options.enable.length > 0) {

					mod.dates.manageDates(date, cell, 'enable');

				} else {

					if(date.full.getMonth() === date.month && date.full > yesterday && date.full < disableAfter) {

						cell.removeClass('disabled');

					}

					if(date.full.getTime() < today.getTime() && options.disableFuture === true) {

						cell.removeClass('disabled');

					}

				}

				if(options.disable.length > 0) {

					mod.dates.manageDates(date, cell, 'disable');

				}

				mod.dates.disableDOW(date, cell);

			};

			this.manageDates = function(date, cell, func) {

				var array = func === 'disable' ? options.disable : options.enable;

				for(var i = 0, l = array.length; i < l; i++) {

					if(typeof array[i] === 'string') {

						var split = array[i].split('-', 3);

						if(date.full >= new Date(split[0], (split[1] - 1), split[2]) && date.full <= new Date(split[0], (split[1] - 1), split[2])) {

							if(func === 'disable') {

								cell.addClass('disabled');

							} else {

								cell.removeClass('disabled');

							}

						}

					} else if(typeof array === 'object') {

						var start = array[i][0].split('-', 3),
							end = array[i][1].split('-', 3);

						if(date.full >= new Date(start[0], (start[1] - 1), start[2]) && date.full <= new Date(end[0], (end[1] - 1), end[2])) {

							if(func === 'disable') {

								cell.addClass('disabled');

							} else {

								cell.removeClass('disabled');

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

			this.setNav = function(index) {

				var next = new Date(currentMonth.getTime()),
					prev = new Date(currentMonth.getTime());

				next.setMonth(next.getMonth() + 1);
				prev.setMonth(prev.getMonth() - 1);

				container[index].find('.picky__nav--next').data('date', next);
				container[index].find('.picky__nav--prev').data('date', prev);

			};

			this.navigate = function(e) {

				var date = $(this).data('date'),
					dates = {};

				e.preventDefault();

				for(var i = 0; i < options.visibleMonths; i++) {

					var month = new Date(date);

					month.setMonth(month.getMonth() + i);

					dates[i] = month;

					mod.dates.populate(month.getMonth(), month.getFullYear(), i);

				}

				self.trigger('navigateMonth', dates);

			};

		};

		ins.elements = function() {

			this.construct = function() {

				self.attr('readonly', true);

				for(var i = 0; i < options.visibleMonths; i++) {

					mod.elements.createContainer(i).createHeader(i).createNav(i).createTable(i);

				}

			};

			this.createContainer = function(index) {

				container[index] = $('<div />', {

					'class': 'picky__container  picky__container--' + index

				}).appendTo(self.parent());

				return mod.elements;

			};

			this.createNav = function(index) {

				if(index === 0) {

					$('<a />', {

						'class': 'picky__nav picky__nav--prev',
						'href': '#'

					}).prependTo(container[index]);

				}

				if(index === options.visibleMonths - 1) {

					$('<a />', {

						'class': 'picky__nav picky__nav--next',
						'href': '#'

					}).prependTo(container[index]);

				}

				nav[index] = container[index].find('.picky__nav');

				return mod.elements;

			};

			this.createHeader = function(index) {

				header[index] = $('<p />', {

					'class': 'picky__header'

				}).prependTo(container[index]);

				header[index].text(options.monthNames[today.getMonth()] + ' ' + today.getFullYear());

				return mod.elements;

			};

			this.createTable = function(index) {

				table[index] = $('<table />', {

					'class': 'picky__table'

				}).appendTo(container[index]);

				for(var i = 0; i < 7; i++) {

					mod.elements.createRow(i, index);

				}

				return mod.elements;

			};

			this.createRow = function(rowIndex, index) {

				var row = $('<tr />').appendTo(table[index]);

				for(var i = 0; i < 7; i++) {

					var cell = $('<td />', {

						'class': 'picky__table--' + (rowIndex === 0 ? 'heading' : 'cell')

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