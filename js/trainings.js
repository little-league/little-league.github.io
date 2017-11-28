function updateTrainingList(data){
  for (var key in data)
    addListItem($('#trainings-list'), key, data[key]);
}

// TODO move to common
function addListItem(parent, link, text){
  parent.append(
    $('<li>').append(
      $('<a>').attr('class', 'training').attr('data-id', link).text(text)
    )
  );

  $('.training').on('click', function() {
  	animcursor = 1;
  	PageTransitions.nextPage( animcursor );

  	var relEx = rel_tr_ex[$(this).attr('data-id')];
  	relEx = relEx.split(',');

  	var cfVal = [];
  	for(var i = 0; i < relEx.length; ++i) {
  		var cf = rel_cf_ex[relEx[i]];
  		cf = cf.split(',');
  		for(var j = 0; j < cf.length; ++j) {
  			if(cfVal[cf[j]])
  				cfVal[cf[j]] += 1;
  			else
  				cfVal[cf[j]] = 1;
  		}
  	}
  	
  	var axes = Object.values(cognFunc);
  	var axesKey = Object.keys(cognFunc);
  	var radarData = [];
	  radarData[0] = [];
	  for(var i = 0; i < axes.length; ++i) {
	  	var val = cfVal[axesKey[i]] ? cfVal[axesKey[i]] : 0;
	    radarData[0].push({axis: axes[i], value: val});
	  }

  	drawRadarChart(radarData);
  });
}
