$(document).on('ready', function() {

	$('.picky').picky({

		disablePast: true,
		advance: 0,
		disable: ['2015-01-02', '2015-01-07', '2015-01-10', '2015-01-12', '2015-01-20', '2015-01-23']

	});

});