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

  $('.training').on('click', function(event) {
    createRadarData($(this).attr('data-id'));
    drawRadarChart();
    createRadarFilters($(this).attr('data-id'));

  	var options = {'animation':1, 'showPage': 1}
  	PageTransitions.nextPage( options );
    showBackButton();
    $('#sidebar').removeClass('right').addClass('left').css('display', 'block');
  });
}
