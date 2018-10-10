/* add your script methods and logic here */

'use strict';
//centering the map when it loads
var map = L.map('map-container').setView([39.50 , -98.35], 4);

var layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');

layer.addTo(map);

//creating layer and variables for the stats
var Unknown = L.layerGroup([]);
var male = L.layerGroup([]);
var female = L.layerGroup([]);
var stats = 0;
var femalecount = 0;
var malecount = 0;
var unknowncount = 0;

//listener that accounts for the statistics function being run everytime a layer is removed or added.
map.addEventListener('overlayadd overlayremove', statsfunction);

//loop to go through the data
function setCircle(data){
	for (var i = 0; i < data.length; i++) {
		var lat = data[i].lat;
		var lon = data[i].lng;

		var locator = new L.circle([lat,lon]);

	if(data[i].victim.gender == 'Male'){
		var circle = new L.circleMarker([lat,lon],{color:"blue"});
		circle.addTo(male);
		circle.bindPopup(data[i].victim.name+": "+data[i].summary + "("+"link".link(data["sourceUrl"])+")");
		malecount++;
	} else if (data[i].victim.gender == 'Female'){
		var circle = new L.circleMarker([lat,lon],{color:"red"});
		circle.addTo(female);
		circle.bindPopup(data[i].victim.name+": "+data[i].summary + "("+"link".link(data["sourceUrl"])+")");
		femalecount++;

	 } else{
		var circle = new L.circleMarker([lat,lon],{color:"green"});
		circle.addTo(Unknown);
		circle.bindPopup(data[i].victim.name+": "+data[i].summary + "("+"link".link(data["sourceUrl"])+")");
		unknowncount++;
	}
	stats++;
}
}
//adds layers to the map
male.addTo(map);
female.addTo(map);
Unknown.addTo(map);

var myLayerGroups = {
	'Unknown' : Unknown,
	'Male': male,
	'Female' : female,
}

L.control.layers(null, myLayerGroups).addTo(map);

//stats function which calculates the statistics displayed

function statsfunction(){
	var m = 0;
	var f = 0;
	var u = 0;

	if(map.hasLayer(female)){
		f=Math.round((femalecount/stats)*100);
	}
	if(map.hasLayer(male)){
		m=Math.round((malecount/stats)*100);
	}
	if(map.hasLayer(Unknown)){
		u=Math.round((unknowncount/stats)*100);
	}

   $("#statsFemale").html(f);
   $("#statsMale").html(m);
   $("#statsUnknown").html(u);
}

//callback function to process the data
$.getJSON('data/data.min.json').then(setCircle);

//ajaxfunction
$(document).ajaxComplete(function(){
	statsfunction()
});
