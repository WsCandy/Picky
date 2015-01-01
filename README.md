Picky - v1.1.0
=====

#####8.7kb, (4.9kb min)

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
	startDay: null,
	select_callback: null,
	linked: null

All of the options are self explanatory, I'll go into more detail about disabling specific dates below!

Disabling Dates
---

There are numerous ways to disable specific dates with Picky, I'll explain each method with examples below.

##### Disable Past

	disablePast: true/false

Disable all the dates before today's date.

##### Disable

	disable: ['2015-01-08', ['2015-01-16', '2015-01-18'], '2015-01-14']

Disable accepts an array of dates to disable, this can handle an unlimited amount of dates so feel free to add as many as you like. The above example will disable 8th Jan 2015  and then 16th Jan 2015 to 18th Jan 2015 and then disable the 14th Jan 2015. 

Passing an array through to the option will disable the dates between the two you specify.

To disable multiple single days simply do the following: 

	disable: ['2015-01-08', '2015-01-20', '2015-01-25']

##### Disable Days

	disableDays: [0, 2]

Disable Days will disable specific days of the week, 0 is Sunday and 6 is Saturday, the above example will disable EVERY Sunday and Tuesday on the calendar.

##### Advance

	advance: 2

The advance option will not let you set the date that is anything before x amount of days after today. Using the above example, if today were 1st January 2015, you would not be able to book anything before 3rd January 2015.

##### Start Day

	startDay: '2015-01-01'

Specify a date where you would like the calendar start from

Public Methods
---

Currently picky has two public methods they are as follows:

##### Get Month

	$('.picky').picky('getMonth', [0, 2016])

This will jump to the specified month, in this example January 2016. The months range from 0 - 11, with 0 being January.

##### Set Start

	$('.picky').picky('setStart', '2015-04-13');

Set start will set the start of the date picker to be the date you specified, this method is useful if you want to pair date pickers, as it will allow you to use the date entered from the first to determine where the second one starts.

Linking
---

Picky allows you to link two different date pickers with one an other, the date picker specified in the option will update depending on what you enter in the first one, this is useful for booking rooms at a hotel for example as it will not allow the user to enter a date before the one they selected in the first date picker.

To invoke just simply use: 

	linked: $('.your_selector')

Callbacks
---

The following callback will fire when you select a date in the calendar:

	select_callback: function(input, cell, date) {

		console.log(input, cell, date);

	}

Various data is provided, the date parameter that is passed is a JavaScript date object and can be manipulated as you like!