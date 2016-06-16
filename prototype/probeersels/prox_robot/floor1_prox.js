$(".button").click(function() {
    window.location = this.value;
});
/*
var floor_1 = {}
var floor_2 = {}
var floor_3 = {}
 
dataMaker(function(data){
	console.log(data)
});
*/
d3.csv("proxMobileOut-MC2.csv", function(error, data) {
	if (error) throw error;
	d3.xml("VAST_ProxZones_F1.svg", "image/svg+xml", function(error, xml) {
	    if (error) throw error;
	    document.body.appendChild(xml.documentElement) 

	    canvas = d3.select("svg").attr("display", "block");

	    //timestamp info
	    var startdate = new Date(data[0]["timestamp"]);
	    var length = parseInt(data.length - 1);
	    var enddate = new Date(data[length]["timestamp"]);
	    var current_date = startdate;
		formatDate = d3.time.format("%b %d");

		//canvas info
		var floor_width = parseInt(d3.select("#canvas").attr("width"));
		var floor_height = parseInt(d3.select("#canvas").attr("height"));
		var floor_x = parseInt(d3.select("#canvas").attr("x"));	    		    	
		var floor_y = parseInt(d3.select("#canvas").attr("y"));
		var floor_max_x = 189;
		var floor_max_y = 111; 

		// parameters
		var margin = {
		    top: 10,
		    right: 50,
		    bottom: 10,
		    left: 50
		  },
		  width = 650 - margin.left - margin.right,
		  height = 80 - margin.bottom - margin.top;


		// scale function
		var timeScale = d3.time.scale()
		  .domain([startdate, enddate])
		  .range([0, width])
		  .clamp(true);


		// initial value
		var startValue = timeScale(startdate);
		startingValue = startdate;

		//////////

		// defines brush
		var brush = d3.svg.brush()
		  .x(timeScale)
		  .extent([startingValue, startingValue])
		  .on("brush", brushed);

		var svg = d3.select("body").append("svg")
		  .attr("id", "slider")
		  .attr("display", "block")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		  // classic transform to position g
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("g")
		  .attr("class", "x axis")
		// put in middle of screen
		.attr("transform", "translate(0," + height / 2 + ")")
		// inroduce axis
		.call(d3.svg.axis()
		  .scale(timeScale)
		  .orient("bottom")
		  .tickFormat(function(d) {
		    return formatDate(d);
		  })
		  .tickSize(0)
		  .tickPadding(12)
		  .tickValues([timeScale.domain()[0], timeScale.domain()[1]]))
		  .select(".domain")
		  .select(function() {
		    console.log(this);
		    return this.parentNode.appendChild(this.cloneNode(true));
		  })
		  .attr("class", "halo");

		var slider = svg.append("g")
		  .attr("class", "slider")
		  .call(brush);

		slider.selectAll(".extent,.resize")
		  .remove();

		slider.select(".background")
		  .attr("height", height);

		var handle = slider.append("g")
		  .attr("class", "handle")

		handle.append("path")
		  .attr("transform", "translate(0," + height / 2 + ")")
		  .attr("d", "M 0 -20 V 20")

		handle.append('text')
		  .text(startingValue)
		  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

		slider
		  .call(brush.event)

    });
});