var database = firebase.database();

var training = firebase.database().ref('trainings');
training.on('value', function(data) {
  updateTrainingList(data.val());
});

var cognFunc = firebase.database().ref('cognitive_functions').on('value', function(data) {
	cognFunc = data.val();
});

var exercises = firebase.database().ref('exercises').on('value', function(data) {
	exercises = data.val();
});

var rel_cf_ex = firebase.database().ref('rel_cf_ex').on('value', function(data) {
	rel_cf_ex = data.val();
});