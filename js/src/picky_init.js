$('.picky').picky({

	disable: ['2015-01-08', ['2015-01-16', '2015-01-18'], '2015-01-14', '2015-08-02', ['2015-08-06', '2015-08-10']],
	disablePast: true,
	disableFuture: 10,
	disableDays: [],
	labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	advance: 0,
	select_callback: function(input, cell, date) {

		console.log(input, cell, date);

	},
	linked: $('.picky2')

});