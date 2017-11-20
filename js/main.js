var radarData;
var dataset;

function getColor (d) {
  if (d == "1990-1994" )
    return "#9366bd";
  else if (d == "1995-1999" )
    return "#d62728";
  else if (d == "2000-2004" )
    return "#2ca02c";
  else if (d == "2005-2009" )
    return "#ff7f0e";
  else if (d == "2010-2014" )
    return "#1e77b4";
  else
    return "steelblue";
}


/******* Radar Charts *******/
// function getRadarData(d) {
//   var data = [];
//   var groups = [];
//   d.forEach(function(record) {
//     var group = record.group;
//     if (groups.indexOf(group) < 0) {
//       groups.push(group);
//       data.push({
//         group: group,
//         axes: []
//       });
//     };
//     data.forEach(function(d) {
//       if (d.group === record.group) {
//         d.axes.push({
//           axis: record.axis,
//           value: parseInt(record.value),
//           description: record.description
//         });
//       }
//     });
//   });
//   return data;
// }

//TODO: change data file
d3.csv('radar.csv', function(data) {

  for (var element in countryArry) {
    var fdata = data.filter(function(d) { return d.country.match(element) })
    if ( fdata.length == 0 )
      continue;
    radarData = getRadarData( fdata );

    d3.select("#training-chart")
      .append("div")
      .attr("id", element)
      .attr("class", "c-box")
      .append("h3")
      .text(element);

    RadarChart.draw("#" + element, radarData);
  }

  // $(".c-box").hover(
  //   function() {
  //     var id = $(this).attr("id");
  //     var fdata = dataset.filter(function(d) {
  //       return d.Years.match(currentYear) && d.Country.match(id)
  //     });
  //     graph.highlight(fdata);
  //   }, function() {
  //     graph.unhighlight();
  //   }
  // );
});
