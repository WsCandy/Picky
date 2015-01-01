$(document).on('ready', function() {

	$('.picky').picky({

		disable: ['2015-01-08', ['2015-01-16', '2015-01-18'], '2015-01-14'],
		disablePast: true,
		disableDays: [],
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		advance: 0,
		select_callback: function(input, cell, date) {

			console.log(input, cell, date);

		},
		linked: $('.picky2')

	});

});