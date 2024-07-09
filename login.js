//this script handles the login of the user from the login.html page

//the following retrieves the form
const loginForm = document.getElementById("loginForm");

//the following retrieve the form elements and defines the patterns they need to match
const loginEmail = document.getElementById("loginEmail");
const loginEmailPattern = /^([\w\d\-_.]*)+@+([\w\d]*)+\.+([\w\d]){2,}$/;

const loginPassword = document.getElementById("loginPassword");
const loginPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

//the following are needed as an input to the API
const loginCredentials = {
  email: loginEmail.value,
  password: loginPassword.value,
};

const login = JSON.stringify(loginCredentials);

/**
 * Checks that the email value exists and matches the pattern defined previously
 */
function checkEmail() {
  loginEmail.addEventListener("input", () => {
    if (!loginEmail.value) {
      loginEmail.setCustomValidity("Veuillez remplir le champ Email");
    } else if (!loginEmailPattern.test(loginEmail)) {
      loginEmail.setCustomValidity("Veuillez entrer un email valide");
    } else {
      loginEmail.setCustomValidity("");
    }
    loginEmail.reportValidity();
  });
}

/**
 * Checks that the password value exists and matches the pattern defined previously
 */
function checkPassword() {
  loginPassword.addEventListener("input", () => {
    if (!loginPassword.value) {
      loginPassword.setCustomValidity("Veuillez remplir le champ Mot de passe");
    } else if (!loginPasswordPattern.test(loginPassword)) {
      loginPassword.setCustomValidity("Veuillez entrer un mot de passe valide");
    } else {
      loginPassword.setCustomValidity("");
      
    }
    loginPassword.reportValidity();
    console.log(loginPassword.reportValidity())
  });
}

/**
 * Sends the login information to the API and retrieves the user token if the login is successful
 */
const loginAPI = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: login,
    });

    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      sessionStorage.setItem("token", token);
      //above needs to be removed on logout click on main page (also switch names depending of token presence)

      //redirects the user after a successful login
      window.location.href = "index.html";
    } else {
      console.log(response.status);
      alert("La connexion a échoué, veuillez vérifier vos identifiants");
      window.location.href = "login.html"; //needed if the page keeps freezing
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

//this needs an export? 3.3

/**
 * Runs the form data checks and API login
 */
function userLogin() {
  try {
    loginForm.addEventListener("submit", (event) => {
      //prevents the page from reloading
      event.preventDefault();
      //ensures full validity
      loginEmail.reportValidity();
      loginPassword.reportValidity();
      if (loginEmail.checkValidity() && loginPassword.checkValidity()) {
        //communicates with the API
        loginAPI();
      } else {
        console.log("The form fields do not contain the required information");
      }
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

checkEmail();
checkPassword();

userLogin();
