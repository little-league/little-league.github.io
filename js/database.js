var database = firebase.database();

var training = firebase.database().ref('trainings');
training.on('value', function(data) {
  updateTrainingList(data.val());
});
