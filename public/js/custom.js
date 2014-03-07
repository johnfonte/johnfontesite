$(document).ready(function() {
	var page = $(document).find("title").text();
	var first = page.indexOf('|');
	page = page.substr(0, first - 1);
	mixpanel.track(page + " Page Loaded");
});