var selectedExList = [], radarData = [], cfVal = [];
var listIndex = 0, homepage = true;

/*************************************************
* GLOBAL STATE
**************************************************/
function init() {
  homepage = true;
  hideSidebar();
  $('#go-to-planning').css('display', 'none');
  $('#go-to-training').css('display', 'none');

  $('#trainingListCont').show();
  $('#treeCont').hide();
  $('#searchResultsCont').hide();
}

function showBackButton() {
  showSidebar(true);
  $('#go-to-planning').css('display', 'block');
  $('#go-to-training').css('display', 'none');
  $('#go-to-planning').removeClass('right').addClass('left');
  $('#go-to-planning-icon').removeClass('icon-up').addClass('icon-left');
}

function showBackFromExercise() {
  showSidebar();
  $('#go-to-planning').css('display', 'block');
  $('#go-to-training').css('display', 'none');

  $('#go-to-planning').removeClass('left').addClass('right');
  $('#go-to-planning-icon').removeClass('icon-left').addClass('icon-up');
}

function showTrainingButton() {
  showSidebar();
  $('#go-to-planning').css('display', 'none');
  $('#go-to-training').css('display', 'block');
}

function showSidebar(isLeft = false){
  hideSidebar();
  var sidebar = $('#sidebar');
  sidebar.css('display', 'block');
  isLeft ? sidebar.addClass('left') : sidebar.addClass('right')
  isLeft ? $('#pt-main').addClass('sidebar-left') : $('#pt-main').addClass('sidebar-right');
}

function hideSidebar(){
  $('#sidebar').css('display', 'none').removeClass('right').removeClass('left');
  $('#pt-main').removeClass('sidebar-left').removeClass('sidebar-right');
}

$('.logo-img').click(function() {
  init();
});

/*************************************************
* SEARCH PAGE
**************************************************/
$('#searchbar').keypress(function(e) {
  if(e.keyCode === 13) {
    homepage = false;
    searchElement($('#searchbar').val());
  }
});

$('#searchBtn').click(function() {
  homepage = false;
  searchElement($('#searchbar').val());
});

function searchElement(elmt) {
  var data = Object.values(exercises);
  var dataKeys = Object.keys(exercises);
  data = data.concat(Object.values(tasks));
  dataKeys = dataKeys.concat(Object.keys(tasks));
  data = data.concat(Object.values(cognFunc));
  dataKeys = dataKeys.concat(Object.keys(cognFunc));

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
    var group = key.replace(/[0-9]/g, '');
    $('#search-results').append(
      $('<li>').attr('data-group', group).append(
        $('<span>').attr('class', 'word').attr('data-id', key).text(relatedData[i])
      )
    )
  }

  $('.word').click(function() {
    $('#searchResultsCont').hide();
    $('#treeCont').show();
    showTrainingButton();

    dataId = $(this).attr('data-id');
    populateTree(dataId, $(this).text());
  });
}

$("#go-to-mytrainings").click(function(){
  $('#trainingListCont').show();
  $('#treeCont').hide();
  $('#searchResultsCont').hide();
});

/*************************************************
* TREE PAGE
**************************************************/
function populateTree(rootId, rootText) {
  TreeGraph.clear();
  var children = [];

  if (rootId.indexOf("ts") == 0){ // Training
    var ex = rel_ex_ts[rootId].split(',');
    for(var i = 0; i < ex.length; ++i) {
      var cf = rel_cf_ex[ex[i]].split(',');
      children[i] = {'name': exercises[ex[i]], 'id': ex[i], 'children': getLeafs(cf, cognFunc, i)};
    }
  } else if(rootId.indexOf("ex") == 0) { // Exercise
    var cf = rel_cf_ex[rootId].split(',');
    children = getLeafs(cf, cognFunc);
  } else if (rootId.indexOf("cf") == 0) { // Cognitive Function
    var ex = [];
    for (var id in rel_cf_ex) {
      var cf = rel_cf_ex[id].split(',');
      for(var j = 0; j < cf.length; ++j) {
        if(cf[j].indexOf(rootId) == 0)
          children.push({'name': exercises[id], 'id': id} );
        }
    }
  }

  var data = {'name': rootText, 'id': rootId, 'children': children};
  TreeGraph.draw('#treeCont', 800, 500, data);
}

function getLeafs(ids, names, i = 0){
  var children = [];
  for(var j = 0; j < ids.length; ++j)
    children[j] = {'name': names[ids[j]], 'id': i + "-" + ids[j]};
  return children;
}

/*************************************************
* RADAR CHART PAGE
**************************************************/
$('#go-to-training').on( 'click', function() {
  createRadarData();
  drawRadarChart();
  createRadarFilters();
});

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
    relEx = Object.values(selectedExList);

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
  var relEx;
  // decide if get from training or saved list
  if(dataId) // get all exercises saved in training
    relEx = rel_tr_ex[dataId].split(',');
  else
    relEx = Object.values(selectedExList);

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
function addToSelectedExercises(exId) {
  selectedExList['index' + listIndex] = exId;

  $('#selected-exercises').append(
    $('<li>').attr('id', 'index' + listIndex++).append(
      $('<img>').attr('class', 'deleteicon').attr('src', 'img/delete_icon.png')
    ).append(
      $('<span>').attr('class', 'exerciseList').attr('data-id', exId).text(exercises[exId])
    )
  );

  $('.deleteicon').click(function() {
    $(this).parent().remove();
    var parentId = $(this).parent().attr('id');
    delete selectedExList[parentId];
  })
}

$('#saveBtn').click(function() {
  var sessionName = $('#training-name').val();
  var id = 'tr' + (Object.keys(training).length + 1);

  if(Object.keys(selectedExList).length === 0)
    return;
  if(sessionName === "") {
    alert('Please give a name to your session.');
    return;
  }

  saveTrainingSession(id, sessionName, Object.values(selectedExList));
});

init();
