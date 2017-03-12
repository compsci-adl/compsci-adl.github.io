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
        writeWinner(snapshot.val().first_name + " " + snapshot.val().last_name);
      }
      i++;
    });
  }).catch(function(error) {
    writeWinner("Sorry, you don't have permission to do this."); 
  });

  console.log(name);
}

firebase.auth().onAuthStateChanged(function(user) {
  var btn = $('#signin')
  if (user) {
    // User is signed in.
    btn.text("Sign Out");
    btn.click(signin);
  } else {
    // User is signed out.
    btn.text("Sign In");
    btn.click(signout);
  }
});

function signin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider)
}

function signout() {
  firebase.auth().signOut();
}