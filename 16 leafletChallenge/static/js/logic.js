// Creating map object
var myMap = L.map("map", {
  center: [36.1127805, -114.0048244],
  zoom: 7
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

finalUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// Grab the data with d3
d3.json(finalUrl).then(data=>{

  let response = data.features
  console.log(response)

  response.forEach(data => {
    let location = data.geometry

    let color = 'red'
    if(data.properties.mag <= 1){
      color = '#80ff00'
    } else if (data.properties.mag <= 2){
      color = '#bfff00'
    } else if (data.properties.mag <= 3){
      color = '#ffff00'
    } else if (data.properties.mag <= 4){
      color = '#ffbf00'
    } else if (data.properties.mag <= 5){
      color = '#ff8000'
    } else if (data.properties.mag > 5){
      color = '#ff4000'
    }

    myMap.addLayer(L.circle(
      [location.coordinates[1],location.coordinates[0]],
      {
        fillOpacity: 0.5,
        color: '',
        fillColor: color,
        radius: data.properties.mag *4000
      }).bindPopup(`<h3>This earthquake magnitude was: ${data.properties.mag}</h3> <hr> <h4>Place of ocurrence: ${data.properties.place}</h4>`).addTo(myMap)
    )  

  })

  function getColor(d) {
    return d > 1000 ? '#ff4000' :
           d > 5  ? '#ff4000' :
           d > 4  ? '#ff8000' :
           d > 3  ? '#ffbf00' :
           d > 2  ? '#ffff00' :
           d > 1  ? '#bfff00' :
           d > 0  ? '#80ff00' :
                      '#FFEDA0';
  }

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'), 
          grades = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + 
              getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
})

  