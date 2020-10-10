
    <div class="right">
    <button disabled id="quickstart-sign-in" name="signin">Sign in</button>
    <div class="quickstart-user-details-container">
      Firebase sign-in status: <span id="quickstart-sign-in-status">Unknown</span>
      <div>Firebase auth <code>currentUser</code> object value:</div>
      <pre><code id="quickstart-account-details">null</code></pre>
    </div>
  </div>


firebase.initializeApp(firebaseConfig);

// Auth
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDT-SNLlbf28ZLMa562KFtI4ZTKHKoFuaA",
    authDomain: "diagramation.firebaseapp.com",
    databaseURL: "https://diagramation.firebaseio.com",
    projectId: "diagramation",
    storageBucket: "diagramation.appspot.com",
    messagingSenderId: "470242689527",
    appId: "1:470242689527:web:d28669fb3368120bb1aef2"
};

  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
    document.getElementById('quickstart-sign-in').textContent = 'Sign out';
    document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    // [END_EXCLUDE]
  } else {
    // User is signed out.
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
    document.getElementById('quickstart-sign-in').textContent = 'Sign in';
    document.getElementById('quickstart-account-details').textContent = 'null';
    // [END_EXCLUDE]
  }
  // [START_EXCLUDE]
  document.getElementById('quickstart-sign-in').disabled = false;
  // [END_EXCLUDE]
  });
  // [END authstatelistener]
  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
if (firebase.auth().currentUser) {
  // [START signout]
  firebase.auth().signOut();
  // [END signout]
} else {
  // [START authanon]
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode === 'auth/operation-not-allowed') {
      alert('You must enable Anonymous auth in the Firebase Console.');
    } else {
      console.error(error);
    }
    // [END_EXCLUDE]
  });
  // [END authanon]
}
document.getElementById('quickstart-sign-in').disabled = true;
}
