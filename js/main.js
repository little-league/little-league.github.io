// var radarData;
// var dataset;
// var keyword;
$('#go-to-training').css('display', 'none');

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
  var relatedEx = [];
  for(var i = 0; i < ex.length; ++i) {
    ex[i] = ex[i].toLowerCase();
    if(ex[i].indexOf(elmt.toLowerCase()) != -1)
      relatedEx.push(ex[i]);
  }
  if(relatedEx.length == 0)
    return;

  $('#trainingListCont').hide();
  $('#treeCont').hide();
  $('#searchResultsCont').show();

  // data-attr: exercise or cf
  $('#search-results').empty();
  for(var i = 0; i < relatedEx.length; ++i) {
    var key = Object.keys(exercises)[ex.indexOf(relatedEx[i])];
    $('#search-results').append(
      $('<li>').append(
        $('<span>').attr('class', 'word').attr('data-id', key).text(relatedEx[i])
      )
    ) 
  }
  
  $('.word').click(function() {
    $('#searchResultsCont').hide();
    $('#treeCont').show();
    $('#go-to-training').css('display', 'block');

    populateTree($(this).attr('data-id'), $(this).text());
    drawRadarChart();
  });
}

function populateTree(rootId, rootText) {
  TreeGraph.clear();
  
  var cf = rel_cf_ex[rootId];
  cf = cf.split(',');
  var cf_children = [];
  for(var i = 0; i < cf.length; ++i) {
    cf_children[i] = {'name': cognFunc[cf[i]]};
  }

  var data = {'name': rootText, 'children': cf_children};

  TreeGraph.draw('#treeCont', 800, 500, data);
}

function drawRadarChart(data) {
  var radarData;
  if(!data) {
    var axes = Object.values(cognFunc);
    radarData = [];
    radarData[0] = [];
    for(var i = 0; i < axes.length; ++i) {
      // TODO: for all exercises
      radarData[0].push({axis: axes[i], value: 1});
    }
  } else {
    radarData = data;
  }

  var options = {
    w: 350,
    h: 350,
    maxValue: 5,
    levels: 5,
    TranslateX: 100,
    TranslateY: 45
  }

  RadarChart.draw("#training-chart", radarData, options);
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
