$(document).ready(function() {
  getWinner();  
})

function writeWinner(text) {
  $('#winner').text(text);
}

function getWinner() {
  writeWinner("I'm working on it");
  var members = firebase.database().ref("members");
  members.once('value').then(function(snapshot) {
    var i = 0;
    var rand = Math.floor(Math.random() * snapshot.numChildren());
    snapshot.forEach(function(snapshot) {
      if (i == rand) {
        console.log(snapshot.val())
      }
      i++;
    });
  }).catch(function(error) {
    writeWinner("Sorry, you don't have permission to do this."); 
  });

  console.log(name);
}

$('#signin').click(function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider)
});