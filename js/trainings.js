function updateTrainingList(data){
  for (var key in data)
    addListItem($('#trainings-list'), key, data[key]);
}

// TODO move to common
function addListItem(parent, link, text){
  parent.append(
    $('<li>').append(
      $('<a>').attr('href','#' + link).text(text)
    )
  );
}
