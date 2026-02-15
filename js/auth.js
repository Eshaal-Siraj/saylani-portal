// js/auth.js

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
          alert("Signup Successful");
          window.location.href = "dashboard.html";
      })
      .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
      .then(() => {
          alert("Login Successful");
          window.location.href = "dashboard.html";
      })
      .catch(err => alert(err.message));
} 