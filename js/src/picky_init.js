$(document).on('ready', function() {

	$('.picky').picky({

		disablePast: true,
		disable: ['2015-01-10', '2015-01-12'],
		disableDays: [],
		labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
		advance: 5

	});

});