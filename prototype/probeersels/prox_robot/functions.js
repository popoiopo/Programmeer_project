function dataMaker(callback) {
 
    // load in data
    d3.csv("proxOut-MC2.csv", function(error, csv) {
        if (error) {
            throw error;
            return alert("Error loading data!");
        }
 
        // format for parsing date data
        var formatDate = d3.time.format("%Y-%m-%d%H:%M:%S");
        var formatDate_2 = d3.time.format("%Y-%m-%d %H:00:00");
 
        var floor_1 = {};
        var floor_2 = {};
        var floor_3 = {};
 
        var zones_floor_1 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_7", "zone_8"];
        var zones_floor_2 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_7"];
        var zones_floor_3 = ["zone_1", "zone_2", "zone_3", "zone_4", "zone_5", "zone_6", "zone_ServerRoom"];
 
        var floors = [floor_1, floor_2, floor_3];
        var zones = [zones_floor_1, zones_floor_2, zones_floor_3];
 
        console.log(csv[0]);
 
 
        for (i = 0; i < floors.length; i++) {
 
            csv.forEach(function(d){
 
                // get date and time of detection
                var datetime = formatDate.parse(d.timestamp);
 
                var date = formatDate_2(datetime);
 
                if(i + 1 == d.floor) {
                    if (!floors[i].hasOwnProperty(date)) {
                        floors[i][date] = {};
                    };
 
                    for (j = 0; j < zones[i].length; j++) {
                        if (!floors[i][date].hasOwnProperty(zones[i][j])) {
                            floors[i][date][zones[i][j]] = [];
                        };
 
                        if (j + 1 == d.zone) {
                            floors[i][date][zones[i][j]].push(d)
                        }
                        else if ("ServerRoom" == d.zone) {
                            floors[i][date]["zone_ServerRoom"].push(d)
                        };
 
                    };
 
 
                };
            });
        };
 
        var data = {floor_1: floor_1, floor_2: floor_2, floor_3: floor_3};
        callback(data);
 
    });
};

function brushed() {
    var value = brush.extent()[0];
    if (d3.event.sourceEvent) { // not a programmatic event
        value = timeScale.invert(d3.mouse(this)[0]);
        brush.extent([value, value]);
    } 
    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    handle.select('text').text(formatDate(value));
    //console.log(value)
    placePerson(data, value);
}

function placePerson(data, timestamp) {
    removePersons();
    timestamp.setMilliseconds(0);
    timestamp.setSeconds(0);
    timestamp.setMinutes(0);
    for (var i = data.length - 1; i >= 0; i--) {
        data_timestamp = new Date(data[i]["timestamp"]);
        data_timestamp.setMilliseconds(0);
        data_timestamp.setSeconds(0);
        data_timestamp.setMinutes(0);
        if (data[i]["floor"] == 1 && data_timestamp.getTime() === timestamp.getTime()) {
            console.log("er zit een persoon hier nu")
            person_x = parseInt(data[i]["x"]);
            person_y = parseInt(data[i]["y"]);
            person_canvas_loc_x = floor_x + ((floor_width / floor_max_x) * person_x);
            person_canvas_loc_y = (floor_y + floor_height) - ((floor_height / floor_max_y) * person_y);
            d3.select("svg").append("circle")
                .attr("class", "person")
                .attr("cx", person_canvas_loc_x)
                .attr("cy", person_canvas_loc_y)
                .attr("r", 5)
                .style("fill", "purple")
        };
    };
}

function removePersons() {
    d3.select(".person").remove();
}
