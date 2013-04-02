var cheerio = require('cheerio');
var rss = require('rss');
var months = {
	1: 'January',
	2: 'February',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'August',
	9: 'September',
	10: 'October',
	11: 'November',
	12: 'December'
};
var feed = new rss({
	title: 'Discrete Math, NTUA',
	description: 'Feed for the Discrete Math class of the National Technical University of Athens',
	feed_url: 'http://therat.gr/discrete',
	site_url: 'http://www.discrete.gr',
	author: 'Paris Kasidiaris'
});
var spawn = require('child_process').spawn;
var php = spawn('php', ['-f', 'leecher.php']);
var page = '';
php.stdout.on('data', function (body){
	page += body;
});
php.on('close', function () {
	var $ = cheerio.load(page.toString(),{
		lowerCaseTags: true, 
		ignoreWhitespace: true
	});
	$('#table11 tr').each(function () {
		var row = this;
		$(row).find('img').each(function(){
			var src = $(this).attr('src');
			if (typeof src == 'undefined')
				src = $(this).attr('SRC');
			if (typeof src == 'undefined')
				return;
			if (src.indexOf('http://') == 0)
				return;
			$(this).attr('src', 'http://www.softlab.ntua.gr/~fotakis/discrete_math/' + src);
			$(this).removeAttr('SRC');
		});
		$(row).find('a').each(function(){
			var href = $(this).attr('href');
			if (typeof href == 'undefined')
				href = $(this).attr('HREF');
			if (typeof href == 'undefined')
				return;
			if (href.indexOf('http://') == 0)
				return;
			$(this).attr('href', 'http://www.softlab.ntua.gr/~fotakis/discrete_math/' + href);
			$(this).removeAttr('HREF');
		});
		var date = $(row).find('td').first().find('strong, b font').first().text(), content = $(row).find('td').last().html(); 
		if (date == '')
			return;
		date = date.split('/');
		date = months[parseInt(date[1])] + ' ' + date[0] + ', ' + date[2];
		feed.item({
			title: 'Post of ' + date,
			description: content,
			url: 'http://www.discrete.gr',
			author: 'Dimitris Fotakis',
			date: date
		});
	});
	console.log(feed.xml());
});
