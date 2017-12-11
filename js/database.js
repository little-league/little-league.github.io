var database = firebase.database();

var training = firebase.database().ref('trainings');
training.on('value', function(data) {
  updateTrainingList(data.val());
  training = data.val();
});

var cognFunc = firebase.database().ref('cognitive_functions').on('value', function(data) {
	cognFunc = data.val();
});

var cognFuncDesc = firebase.database().ref('cognitive_functions_desc').on('value', function(data) {
	cognFuncDesc = data.val();
});

var exercises = firebase.database().ref('exercises').on('value', function(data) {
	exercises = data.val();
});

var tasks = firebase.database().ref('tasks').on('value', function(data) {
	tasks = data.val();
});

var rel_cf_ex = firebase.database().ref('rel_cf_ex').on('value', function(data) {
	rel_cf_ex = data.val();
});

var rel_tr_ex = firebase.database().ref('rel_tr_ex').on('value', function(data) {
	rel_tr_ex = data.val();
});

var rel_ex_ts = firebase.database().ref('rel_ex_ts').on('value', function(data) {
	rel_ex_ts = data.val();
});

function saveTrainingSession(trainingId, trainingName, listExId) {
	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/trainings/' + trainingId] = trainingName;
	updates['/rel_tr_ex/' + trainingId] = listExId.toString();
	firebase.database().ref().update(updates);
}
