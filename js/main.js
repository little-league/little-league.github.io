var radarData;
var dataset;
var keyword;

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

/******* Search page *******/

$('#searchbar').keypress(function(e) {
  if(e.keyCode === 13) {
    searchElement($('#searchbar').val()); 
  }
});

$('#searchBtn').click(function() {
  searchElement($('#searchbar').val()); 
});

function searchElement(elmt) {
  var ex = Object.values(exercises);
  var relatedEx;
  for(var i = 0; i < ex.length; ++i) {
    ex[i] = ex[i].toLowerCase();
  }
  if(ex.indexOf(elmt.toLowerCase()) == -1)
    return;

  relatedEx = Object.values(exercises)[ex.indexOf(elmt.toLowerCase())];
  relatedKey = Object.keys(exercises)[ex.indexOf(elmt.toLowerCase())];

  $('#trainingListCont').hide();
  $('#searchResultsCont').show();

  // data-attr: exercise or cf
  $('#search-results').append(
    $('<li>').append(
      $('<span>').attr('class', 'word').attr('data-id', relatedKey).text(relatedEx)
    )
  )

  $('.word').click(function() {
    $('#searchResultsCont').hide();
    $('#treeCont').show();

    populateTree($(this).attr('data-id'), $(this).text());
  });
}

function populateTree(rootId, rootText) {
  var cf = rel_cf_ex[rootId];
  cf = cf.split(',');
  var cf_children = [];
  for(var i = 0; i < cf.length; ++i) {
    cf_children[i] = {'name': cognFunc[cf[i]]};
  }

  var data = {'name': rootText, 'children': cf_children};

  TreeGraph.draw('#treeCont', 800, 500, data);
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
// d3.csv('radar.csv', function(data) {

//   for (var element in countryArry) {
//     var fdata = data.filter(function(d) { return d.country.match(element) })
//     if ( fdata.length == 0 )
//       continue;
//     radarData = getRadarData( fdata );

//     d3.select("#training-chart")
//       .append("div")
//       .attr("id", element)
//       .attr("class", "c-box")
//       .append("h3")
//       .text(element);

//     RadarChart.draw("#" + element, radarData);
//   }

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
// });
