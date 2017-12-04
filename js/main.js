var selectedExList = [];
/******* Radar chart variables *******/
var radarData = [], cfVal = [];

$('#sidebar').css('display', 'none');
// $('#go-to-training').css('display', 'none');

// function getColor (d) {
//   if (d == "1990-1994" )
//     return "#9366bd";
//   else if (d == "1995-1999" )
//     return "#d62728";
//   else if (d == "2000-2004" )
//     return "#2ca02c";
//   else if (d == "2005-2009" )
//     return "#ff7f0e";
//   else if (d == "2010-2014" )
//     return "#1e77b4";
//   else
//     return "steelblue";
// }

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
    $('#sidebar').removeClass('left').addClass('right').css('display', 'block');

    exerciseId = $(this).attr('data-id');
    populateTree(exerciseId, $(this).text());
    createRadarData();
    drawRadarChart();
  });
}

function populateTree(rootId, rootText) {
  TreeGraph.clear();
  
  var cf = rel_cf_ex[rootId];
  cf = cf.split(',');
  var cf_children = [];
  for(var i = 0; i < cf.length; ++i) {
    cf_children[i] = {'name': cognFunc[cf[i]], 'id': cf[i]};
  }

  var data = {'name': rootText, 'id': rootId, 'children': cf_children};

  TreeGraph.draw('#treeCont', 800, 500, data);
}

function drawRadarChart() {
  var axes = Object.values(cognFunc);
  var axesKey = Object.keys(cognFunc);
  radarData[0] = [];

  var options = {
    w: 350,
    h: 350,
    maxValue: 5,
    levels: 5,
    TranslateX: 100,
    TranslateY: 45
  }

  for(var i = 0; i < axes.length; ++i) {
    var val = cfVal[axesKey[i]] ? cfVal[axesKey[i]] : 0;
    radarData[0].push({axis: axes[i], value: val});
  }

  RadarChart.draw("#training-chart", radarData, options);
}

function createRadarData(dataId) {
  cfVal = [];
  var relEx;

  // decide if get from training or saved list
  if(dataId)
    relEx = rel_tr_ex[dataId].split(',');
  else
    relEx = selectedExList;
  
  for(var i = 0; i < relEx.length; ++i) {
    // get all cognitive functions to each exercises
    var cf = rel_cf_ex[relEx[i]].split(',');
    // accumulate cognitive functions
    for(var j = 0; j < cf.length; ++j) {
      if(cfVal[cf[j]])
        cfVal[cf[j]] += 1;
      else
        cfVal[cf[j]] = 1;
    }
  }
}

function createRadarFilters(dataId) {
  $('#training-filters-list').empty();

  // get all exercises saved in training
  var relEx = rel_tr_ex[dataId].split(',');
  for(var i = 0; i < relEx.length; ++i) {
    $('#training-filters-list').append(
      $('<li>').append(
        $('<input>').attr('type', 'checkbox').attr('class', 'filterbox').attr('data-id', relEx[i]).prop('checked', true)
      ).append(
        $('<span>').attr('class', 'filtertext').attr('data-id', relEx[i]).text(exercises[relEx[i]])
      )
    );
  }

  $('.filterbox').click(function() {
    var id = $(this).attr('data-id');
    var cf = rel_cf_ex[id].split(',');

    for(var i = 0; i < cf.length; ++i) {
      cfVal[cf[i]] += $(this).prop('checked') ? 1 : -1;
    }

    // update radar chart depending on checked exercises
    drawRadarChart();
  });
}

function createExercisePage(exId) {
  $('.video-filters-list').empty();

  $('#exercise-name').text(exercises[exId]);

  // populate checkbox filters for videos
  var relCf = rel_cf_ex[exId].split(',');
  for(var i = 0; i < relCf.length; ++i) {
    $('.video-filters-list').append(
      $('<li>').append(
        $('<input>').attr('type', 'checkbox').attr('class', 'filterbox').attr('data-id', relCf[i]).prop('checked', true)
      ).append(
        $('<span>').attr('class', 'filtertext').attr('data-id', relCf[i]).text(cognFunc[relCf[i]])
      )
    );
  }
}

// NB: get cognitive functions for now
// TODO : fix with exercises when third level of tree
function addToSelectedExercises(exId) {
  selectedExList.push(exId);

  $('#selected-exercises').append(
    $('<li>').append(
      //TODO: replace cognFunc by exercises
      $('<span>').attr('class', 'filtertext').attr('data-id', exId).text(cognFunc[exId])
    )
  );
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
