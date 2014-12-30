$(document).on('ready', function() {

	$('.picky').picky({

		disable: ['2015-01-08'],
		disablePast: true,
		disableDays: [],
		labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
		advance: 3

	});

});