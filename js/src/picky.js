;(function() {

	'use strict';

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

		var ins = this;

		var setUp = {

			init: function() {

				console.log('Init Test!');

			}

		}

		ins.init = function() {

			setUp.init();

		}

	}

})();