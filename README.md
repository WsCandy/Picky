Picky - v1.0.0
=====

#####7.7kb, (4.4kb min)

A lightweight jQuery plug in that creates a date picker on any input[type="text"]. Picky has a wide range of options to disable specific dates and change the appearance.

Initialisation
---

To initialise the plug in simply use the following code:

	$('.picky').picky();

Options
---

Here's a list of all the options with their default values:

	disablePast: true,
	disable: [],
	disableDays: [],
	labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	advance: 0,
	startDay: null

All of the options are self explanatory, I'll go into more detail about disabling specific dates below!

Disabling Dates
---

There are numerous ways to disable specific dates with Picky, I'll explain each method with examples below.

	disablePast: true/false

Disable all the dates before today's date.

	disable: ['2015-01-08', ['2015-01-16', '2015-01-18'], '2015-01-14']

Disable accepts an array of dates to disable, this can handle an unlimited amount of dates so feel free to add as many as you like. The above example will disable 8th Jan 2015  and then 16th Jan 2015 to 18th Jan 2015 and then disable the 14th Jan 2015. 

Passing an array through to the option will disable the dates between the two you specify.

To disable multiple single days simply do the following: 

	disable: ['2015-01-08', '2015-01-20', '2015-01-25']

The disable option works in pairs and will disable the dates between the odd and even iterations of the array. If you specify one date so the array's length === 1 then it'll just disable that specific day.

	disableDays: [0, 2]

Disable Days will disable specific days of the week, 0 is Sunday and 6 is Saturday, the above example will disable EVERY Sunday and Tuesday on the calendar.

	advance: 2

The advance option will not let you set the date that is anything before x amount of days after today. Using the above example, if today were 1st January 2015, you would not be able to book anything before 3rd January 2015.

	startDay: '2015-01-01'

Specify a date where you would like the calendar start from

Public Methods
---

Currently picky has one public method it is as follows:

	$('.picky').picky('getMonth', [0, 2016])

This will jump to the specified month, in this example January 2016. The months range from 0 - 11, with 0 being January.

I plan to add callbacks at sometime in the near future, it'll come in a future update!