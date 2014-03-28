$(document).ready(function() {
	mixpanel.track("Home Page Loaded");

	smoothScroll.init();

	var lastId;
	var nb = $('.nav.navbar-nav');
	var topHeight = nb.outerHeight()+15;
	var nItems = nb.find("a");//.slice(0,4)
	var scrollItems = nItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

	$(window).scroll(function () {
		var fromTop = $(window).scrollTop()+topHeight;
		var cur = scrollItems.map(function(){
			if ($(this).offset().top < fromTop)
				return this;
		});
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";

		if (lastId !== id) {
			lastId = id;
			// Set/remove active class
			nItems
			.parent().removeClass("active")
			.end().filter("[href=#"+id+"]").parent().addClass("active");
		}	
	});

	var options = {
		segmentShowStroke : true,
		segmentStrokeColor : "#fff",
		segmentStrokeWidth : 1,
		percentageInnerCutout : 90,
		animation : true,
		animationSteps : 100,
		animationEasing : "easeOutBounce",
		animateRotate : true,
		animateScale : false,
		onAnimationComplete : null
	};

	var charts = {
		"#jquery": [
		{
			value: 90,
			color:"#5cb85c"
		},{
			value: 10,
			color:"#ffffff"
		}],
		"#php": [
		{
			value: 90,
			color:"#5cb85c"
		},{
			value: 10,
			color:"#ffffff"
		}],
		"#java": [
		{
			value: 90,
			color:"#5cb85c"
		},{
			value: 10,
			color:"#ffffff"
		}],
		"#android": [
		{
			value: 80,
			color:"#5cb85c"
		},{
			value: 20,
			color:"#ffffff"
		}],
		"#ios": [
		{
			value: 70,
			color:"#5cb85c"
		},{
			value: 30,
			color:"#ffffff"
		}]
	};

	$.each(charts, function (index, chart) {
		var ctx = $(index).get(0);
		if(ctx != null) {
			ctx = ctx.getContext("2d");
			new Chart(ctx).Doughnut(chart, options);
		}
	});
});