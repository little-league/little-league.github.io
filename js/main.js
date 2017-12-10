var selectedExList = [], radarData = [], cfVal = [];



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
/*************************************************
* GLOBAL STATE
**************************************************/
function init() {
  $('#sidebar').css('display', 'none');
  $('#go-to-planning').css('display', 'none');
  $('#go-to-training').css('display', 'none');
}

function showBackButton() {
  $('#go-to-planning').css('display', 'block');
  $('#go-to-training').css('display', 'none');
}

function showTrainingButton() {
  $('#go-to-planning').css('display', 'none');
  $('#go-to-training').css('display', 'block');
}

/*************************************************
* SEARCH PAGE
**************************************************/
$('#searchbar').keypress(function(e) {
  if(e.keyCode === 13) {
    searchElement($('#searchbar').val());
  }
});

$('#searchBtn').click(function() {
  searchElement($('#searchbar').val());
});

function searchElement(elmt) {
  var data = Object.values(exercises);
  var dataKeys = Object.keys(exercises);
  //var data = Object.values(tasks);
  //var dataKeys = Object.keys(tasks);
  var relatedData = [];
  for(var i = 0; i < data.length; ++i) {
    data[i] = data[i].toLowerCase();
    if(data[i].indexOf(elmt.toLowerCase()) != -1)
      relatedData.push(data[i]);
  }
  if(relatedData.length == 0)
    return;

  $('#trainingListCont').hide();
  $('#treeCont').hide();
  $('#searchResultsCont').show();

  // data-attr: exercise or cf
  $('#search-results').empty();
  for(var i = 0; i < relatedData.length; ++i) {
    var key = dataKeys[data.indexOf(relatedData[i])];
    $('#search-results').append(
      $('<li>').append(
        $('<span>').attr('class', 'word').attr('data-id', key).text(relatedData[i])
      )
    )
  }

  $('.word').click(function() {
    $('#searchResultsCont').hide();
    $('#treeCont').show();
    showTrainingButton();
    $('#sidebar').removeClass('left').addClass('right').css('display', 'block');

    dataId = $(this).attr('data-id');
    populateTree(dataId, $(this).text());
    createRadarData();
    drawRadarChart();
  });
}

/*************************************************
* TREE PAGE
**************************************************/
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

/*************************************************
* RADAR CHART PAGE
**************************************************/
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

/*************************************************
* EXERCISE PAGE
**************************************************/
function createExercisePage(exId) {
  $('.video-filters-list').empty();

  $('#exercise-name').text(exercises[exId]);
  $('iframe').attr('src', srclink + videos[4].key + '/preview');

  // populate checkbox filters for videos
  var relCf = rel_cf_ex[exId].split(',');
  for(var i = 0; i < relCf.length; ++i) {
    $('.video-filters-list').append(
      $('<li>').append(
        $('<input>').attr('type', 'checkbox').attr('class', 'filterbox videofilter').attr('data-id', relCf[i]).prop('checked', true)
      ).append(
        $('<span>').attr('class', 'filtertext').attr('data-id', relCf[i]).text(cognFunc[relCf[i]])
      )
    );
  }

  $('.videofilter').click(function() {
    var listId = $(this).parent().parent().attr('id');
    updateVideo(listId);
  });
}

/* List videos keys from google drive:
  - Misread pass: 1kw1bAltFfYN6nxJ8XCoTxCTLhy4YZ8bF
  - Pass fail - decision: 1yMEsCBgJAaGd5vwU-EcFd5Fz1FJxXXS0
  - Pass fail - shitty pass: 1QI08B6eTO9AE4W8zpYqBFuJPYCYRZWa9
  - Pass fail - misreading sign: 1H7iJ_JL5X6pnCi9t3o_OtIJpJH9CAyAK
  - Pass success: 1TPjSpUkfgIpeiGEtoSlVkJ52LVrbK5aL
*/

// data structure hardcoded for ex3 in db
var srclink = "https://drive.google.com/file/d/";
var videos = [{
  'cf': [],
  'key': '1kw1bAltFfYN6nxJ8XCoTxCTLhy4YZ8bF'
}, {
  'cf': ['cf2', 'cf6'],
  'key': '1yMEsCBgJAaGd5vwU-EcFd5Fz1FJxXXS0'
}, {
  'cf': ['cf1', 'cf5'],
  'key': '1QI08B6eTO9AE4W8zpYqBFuJPYCYRZWa9'
}, {
  'cf': ['cf3', 'cf6'],
  'key': '1H7iJ_JL5X6pnCi9t3o_OtIJpJH9CAyAK'
}, {
  'cf': ['cf1', 'cf2', 'cf3', 'cf4', 'cf5', 'cf6'],
  'key': '1TPjSpUkfgIpeiGEtoSlVkJ52LVrbK5aL'
}];

//TODO: ugly code for proof of concept --> TO IMPROVE !!!!!
function updateVideo(listId) {
  var cf = [];
  $.each($('#' + listId).children('li').children('.videofilter'), function(key, obj) {
    if($(obj).prop('checked'))
      cf.push($(obj).attr('data-id'))
  });

  if(cf.length == $('#' + listId).children('li').length)
    $('#' + listId).parent().children('.video-frame').children('iframe').attr('src', srclink + videos[4].key + '/preview');
  else if(cf.length == 0)
    $('#' + listId).parent().children('.video-frame').children('iframe').attr('src', srclink + videos[0].key + '/preview');
  else // Random video for now
    $('#' + listId).parent().children('.video-frame').children('iframe').attr('src', srclink + videos[Math.round((Math.random()*2) + 1)].key + '/preview');
}

/*************************************************
* SIDEBAR
**************************************************/
// NB: get cognitive functions for now
// TODO : fix with exercises when third level of tree
function addToSelectedExercises(exId) {
  selectedExList.push(exId);

  $('#selected-exercises').append(
    $('<li>').append(
      //TODO: replace cognFunc by exercises
      $('<span>').attr('class', 'exerciseList').attr('data-id', exId).text(cognFunc[exId])
    )
  );

  $('.exerciseList').click(function() {
    $(this).parent().remove();
  })
}

init();

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
