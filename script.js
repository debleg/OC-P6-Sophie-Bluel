//creates the container for the works to be displayed
const gallery = document.querySelector(".gallery");
//creates the container for the category filters to be displayed
const categoryFilters = document.querySelector(".filters");

/**
 * Sends API request to retrieve works
 * @returns works
 */
const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

/**
 * Displays the array of works through creation and insertion of html elements
 * @param {Array} works
 */
function displayWorks(works) {
  works.forEach((work) => {
    //creation of the 3 components for each work
    const figure = document.createElement("figure");
    const galleryImg = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    //retrieves img url to use as source
    const galleryImgSrc = work.imageUrl;
    galleryImg.src = galleryImgSrc;

    //retrieves title to use as img alt and figcaption
    const elementTitle = work.title;
    galleryImg.alt = elementTitle;
    figcaption.innerText = elementTitle;

    //appends all elements, figure being the sub-container
    gallery.appendChild(figure);
    figure.appendChild(galleryImg);
    figure.appendChild(figcaption);
  });
}

/** Displays works from the API fetch request */
const displayFetchWorks = async () => {
  try {
    //works has to be stored in a variable as it doesn't exist outside of the function that generates it
    const works = await fetchWorks();
    displayWorks(works);
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

/**
 * Sends API request to retrieve categories
 * @returns categories
 */
const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

/** Filters and displays works using category buttons */
const filterCategory = async () => {
  try {
    //Needed to manipulate works and buttons to filter correctly
    const works = await fetchWorks();
    const buttons = document.querySelectorAll(".category-button");

    Array.from(buttons).forEach((button) => {
      //Filtering works on click
      button.addEventListener("click", () => {
        //Removes the active style from all buttons before applying it to the clicked one
        buttons.forEach((element) => {
          element.classList.remove("active-button");
        });
        button.classList.add("active-button");

        //Needed to differenciate buttons and compare with works categories
        const buttonDataFilter = button.dataFilter;

        //Clearing the gallery to display the selected works
        document.querySelector(".gallery").innerHTML = "";

        //The Tous button resets the default (all works are displayed) or a filter is applied and only filtered works are displayed
        if (buttonDataFilter === "Tous") {
          displayFetchWorks();
        } else {
          const worksFiltered = works.filter(
            (work) => work.category.name === buttonDataFilter
          );
          displayWorks(worksFiltered);
        }
      });
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

/** Creates the category button, then applies the filtering function */
const categoryButtons = async () => {
  try {
    //Creates a "Tous" button that will allow the display of all categories
    const buttonAll = document.createElement("button");
    const buttonAllName = "Tous";
    buttonAll.innerText = buttonAllName;
    buttonAll.dataFilter = buttonAllName;
    buttonAll.classList.add("category-button");
    buttonAll.classList.add("active-button");
    categoryFilters.appendChild(buttonAll);

    //Allows the use of the return of the fetchCategories function
    const categories = await fetchCategories();

    //Creates a button for each category with its name
    categories.forEach((category) => {
      const buttonCategory = document.createElement("button");
      const categoryName = category.name;
      buttonCategory.innerText = categoryName;
      buttonCategory.dataFilter = categoryName;
      buttonCategory.classList.add("category-button");
      categoryFilters.appendChild(buttonCategory);
    });

    //allows filtering using the buttons
    filterCategory();
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

//displays all works fetched with the API
displayFetchWorks();

//creates the category filter buttons
categoryButtons();

//NEW MODAL WORK STARTS HERE

//TODO
//<i class="fa-solid fa-trash-can"></i>
//<i class="fa-solid fa-chevron-down"></i>
// write jsdoc

//QUESTIONS
//check if the image fits the requirements (probably the form-data thing)

//IDEAS (animations)
// possibly put a layer on top of the deleted that gets whiter, with bin overlap then fades (radial gradient from center??)


//this handles the changes based on the token in storage, document further later
const filters = document.querySelector(".filters");
const loginLink = document.querySelector(".nav-strong a");

function editMode() {
  filters.style.display = "none";
  loginLink.innerText = "logout";
  loginLink.addEventListener(
    "click",
    () => {
      event.preventDefault(); //if not redirects to login page!
      sessionStorage.removeItem("token");
      filters.style.display = null;
      document.querySelectorAll(".edit-mode").forEach((element) => {
        element.style.display = "none";
        loginLink.innerText = "login";
      });
    },
    { once: true } //after one click that triggers the above, clicking the login link will redirect to the login page
  );
}

function userTokenHandler() {
  if (sessionStorage.getItem("token")) {
    editMode();
  } else {
    loginLink.innerText = "login";
    filters.style.display = null;
    document.querySelectorAll(".edit-mode").forEach((element) => {
      element.style.display = "none";
    });
  }
}

userTokenHandler();

//modal opening starts here

let modal = null;
const focusableSelector = "button, a, i, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(":focus");
  modal.style.display = null;
  focusables[0].focus();
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  //this is for the animation to work based on its length
  const hideModal = function () {
    modal.style.display = "none";
    modal.removeEventListener("animationend", hideModal);
    modal = null;
  };
  modal.addEventListener("animationend", hideModal);
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault;
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));

  if (e.shiftkey === true) {
    index--;
  } else {
    index++;
  }

  if (index >= focusables.length) {
    index = 0;
  }

  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

//could be worth using edit-link

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//document.querySelector(".edit-link").addEventListener("click", openModal)

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

const mainView = document.querySelector(".remove-works-view");
//the button on the main view that leads to the other
const forwardBtn = document.querySelector(".add-works-redirect");
const secondaryView = document.querySelector(".add-works-view");
//the button on the second view that leads back (and needs hiding too)
const backBtn = document.querySelector(".js-modal-switch-view");
//note the mainView is the visible one on first load with the second having display:none


forwardBtn.addEventListener("click", () => {
  mainView.style.display = "none";
  backBtn.style.display = null;
  secondaryView.style.display = "none";
  secondaryView.classList.add("slideUp");
  setTimeout(() => {
    secondaryView.style.display = null;
  }, 300);
});

backBtn.addEventListener("click", () => {
  backBtn.style.display = "none";
  secondaryView.style.display = "none";
  mainView.style.display = "none";
  mainView.classList.add("slideUp");
  setTimeout(() => {
    mainView.style.display = null;
  }, 300);
});
