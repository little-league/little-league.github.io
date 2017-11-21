var database = firebase.database();

var training = firebase.database().ref('trainings');
training.on('value', function(data) {
  console.log(data.val());
});
