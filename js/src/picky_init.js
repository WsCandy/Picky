$(document).on('ready', function() {

	$('.picky').picky({

		disable: ['2015-01-08'],
		disablePast: true,
		disableDays: [],
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		advance: 0

	});

});