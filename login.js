//this script handles the login of the user from the login.html page

//the following retrieves the form
const loginForm = document.getElementById("loginForm");

//the following retrieve the form elements and defines the patterns they need to match
const loginEmail = document.getElementById("loginEmail");
const loginEmailPattern = /^([\w\d\-_.]*)+@+([\w\d]*)+\.+([\w\d]){2,}$/;

const loginPassword = document.getElementById("loginPassword");
const loginPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

/**
 * Checks that the email value exists and matches the pattern defined previously
 */
function checkEmail() {
  loginEmail.addEventListener("input", () => {
    if (!loginEmail.value) {
      loginEmail.setCustomValidity("Veuillez remplir le champ Email");
    } else if (!loginEmailPattern.test(loginEmail.value)) {
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
    } else if (!loginPasswordPattern.test(loginPassword.value)) {
      loginPassword.setCustomValidity("Veuillez entrer un mot de passe valide");
    } else {
      loginPassword.setCustomValidity("");
    }
    loginPassword.reportValidity();
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
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    });

    //allows token storage if token exists
    const data = await response.json();
    if (data && data.token) {
      sessionStorage.setItem("token", data.token);
    }
    //handles API response codes, redirects to index if ok, shows alert if not
    switch (response.status) {
      case 200:
        //redirects the user after a successful login
        window.location.href = "index.html";
        break;
      case 401:
        alert(
          "La connexion avec ces identifiants n'est pas autorisée, veuillez entrer d'autres identifiants"
        );
        break;
      case 404:
        alert(
          "Ces identifiants ne correspondent pas à un utilisateur existant, veuillez réessayer"
        );
        break;
      default:
        alert("Une erreur est survenue, veuillez réessayer ultérieurement");
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

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
        alert("Les champs ne correspondent pas à ceux attendus");
      }
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

checkEmail();
checkPassword();

userLogin();
