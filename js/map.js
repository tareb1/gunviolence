// Wait until your document is ready
$(function() {

    // Function to draw your map
    var drawMap = function() {
      // Create map and set view
      var map = L.map('map-container').setView([37.697948, -98.4842], 4);
      // Create a tile layer variable using the appropriate url
      var tileLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png');
      // Add the layer to your map
      tileLayer.addTo(map);
      // Execute your function to get data
      getData(map);
  };

    var getData = function(map) {

      // Execute an AJAX request to get the data in data/data.csv file
      var data = $.get('data/data.csv', function (data, error) {
      // Use the PapaParse library to parse the information returned by your request
          var parsedData = Papa.parse(data, {
              header: true
          }).data;
          // data parsed as strings; convert strings into integers
          for (var i = 0; i < parsedData.length; i++) {
              parsedData[i].killed = parseInt(parsedData[i].killed);
              parsedData[i].injured = parseInt(parsedData[i].injured);
          }
          customBuild(parsedData, map);
      });

  };

    // Loop through your data and add the appropriate layers and points
    var customBuild = function(parsedData, map) {
        
      // Be sure to add each layer to the map
      
      // Arrays that hold the markers; get pushed to layergroups later
      var moreKillings = []; // array for markers with more killings
      var moreInjuries = []; // array for markers with more injuries

      for (var i = 0; i < parsedData.length; i++) {
          if (parsedData[i].killed > parsedData[i].injured) {
              var mark = L.circleMarker([parsedData[i].lat, parsedData[i].lng], {radius: parsedData[i].killed, color: '#ff0000'});              
              mark.bindPopup('There were ' + "<b>"+ parsedData[i].injured + "</b>" + ' people injured and ' + 
                    "<span style='color:#ff0000'><b>" + parsedData[i].killed+ "</span></b>" + 
                    ' killed in ' + parsedData[i].city + ', ' + parsedData[i].state + '.');
              moreKillings.push(mark);
          } else { // number of injured is greater than number of people killed
              var mark = L.circleMarker([parsedData[i].lat, parsedData[i].lng], {radius: parsedData[i].injured, color: '#000000'});
              mark.bindPopup('There were ' + "<b>"+ parsedData[i].injured + "</b>" + ' people injured and ' + 
                    "<span style='color:#ff0000'><b>" + parsedData[i].killed+ "</span></b>" + 
                    ' killed in ' + parsedData[i].city + ', ' + parsedData[i].state + '.');
              moreInjuries.push(mark);
          }
      }
      
      var moreKilled = L.layerGroup(moreKillings);
      var moreInjured = L.layerGroup(moreInjuries);
      var overlayMaps = {
          " More Killed": moreKilled,
          " More Injured": moreInjured
      };
      
      moreKilled.addTo(map);
      moreInjured.addTo(map);
      
      // Once layers are on the map, add a leaflet controller that shows/hides layers
      
      L.control.layers(null, overlayMaps).addTo(map);
      
      // Build a table showing calculated aggregate values
      var table = $('<table></table>');
      table.addClass('table');
  
      // construct table headers
      table.append('<th>State</th>');
      table.append('<th>Injured</th>');
      table.append('<th>Killed</th>');
      
      // initialize array of states, the number killed, and the number injured
      var stateArray = [
          {
              state: parsedData[0].state,
              killed: parsedData[0].killed,
              injured: parsedData[0].injured
          }
      ];
      
      // loop through data, sum number of killed and injured for each state
      for (var i = 1; i < parsedData.length; i++) {
          var found = false;
          for (var j = 0; j < stateArray.length; j++) {
              if (stateArray[j].state == parsedData[i].state) {
                  stateArray[j].killed += parsedData[i].killed;
                  stateArray[j].injured += parsedData[i].injured;
                  found = true;
              } 
          }
          if (found == false) {
              stateArray.push({
                  state: parsedData[i].state,
                  killed: parsedData[i].killed,
                  injured: parsedData[i].injured
              });
          }
      }
      
      // add states and their killed/injured numbers to the table
      for (var i = 0; i < stateArray.length; i++) {
          var tr = $('<tr>');
          tr.append('<td><span style= opacity:.7>' + stateArray[i].state + '</td></span');
          tr.append('<td><span style= opacity:.7>' + stateArray[i].injured + '</td></span');
          tr.append('<td><span style= opacity:.7>' + stateArray[i].killed + '</td></span');
          table.append(tr);
      }
      
      $('#table-container').append(table);
  };

  // Execute your drawMap function
  drawMap();
});
