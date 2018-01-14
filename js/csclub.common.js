// Redirect to https
var host = "csclub.org.au";
if ((host == window.location.host) && (window.location.protocol != "https:")) {
    window.location.protocol = "https:";
}
$(document).ready(function() {
    // Initiate mobile nav
    $(".button-collapse").sideNav();
});


// Initialise Firebase, if the firebase library has already been included.
if (typeof firebase != 'undefined') {
    var config = {
      apiKey: "AIzaSyCl2k_R5jYoBTSYoFjWaGgXKiSvUNg8MWk",
      authDomain: "registration-7e966.firebaseapp.com",
      databaseURL: "https://registration-7e966.firebaseio.com",
      storageBucket: "registration-7e966.appspot.com",
      messagingSenderId: "247117631911"
    };
    firebase.initializeApp(config);  

    firebase.auth().onAuthStateChanged(function(user) {
    var btn = $('#signin')
    if (user) {
      // User is signed in.
      btn.text("Sign Out");
      btn.click(signout);
    } else {
      // User is signed out.
      btn.text("Sign In");
      btn.click(signin);
    }
  });

  function signin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
  }

  function signout() {
    firebase.auth().signOut().then(function() {
      console.log('signed out');
    }, function(error) {
      console.error("signout error", error);
    });
  }     
}

/*
 * Determines if the element is within the viewport or not
 * @return {boolean} True if the element is within the viewport.
 */
function isElementInViewport(el) {
    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

/*
 * Converts form data to JSON object
 * @return {Object} An object containing data from form inputs.
 */
function formToJson(form) {
    var array = $(form).serializeArray();
    var json = {};

    $.each(array, function() {
        if (this.value !== 'other') {
            if (json[this.name] !== undefined) {
                if (!json[this.name].push) {
                    json[this.name] = [json[this.name]];
                }
                json[this.name].push(this.value || '');
            } else {
                json[this.name] = this.value || '';
            }
        }
    });

    $.each(json, function(index, value) {
        if (value.constructor === Array) {
            json[index] = value.join();
        }
    });

    return json;
}
