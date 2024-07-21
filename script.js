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

    figure.dataset.id = work.id; //this allows its deletion when the modal is used to delete works

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
// write jsdoc

//this handles the changes based on the token in storage, document further later
const filters = document.querySelector(".filters");
const loginLink = document.querySelector(".login-link");
const logoutOption = document.querySelector(".logout-option");

function editMode() {
  filters.classList.add("no-display");
  loginLink.classList.add("no-display");
  logoutOption.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    filters.classList.remove("no-display");
    loginLink.classList.remove("no-display");
    document.querySelectorAll(".edit-mode").forEach((element) => {
      element.classList.add("no-display");
    });
    logoutOption.classList.add("no-display");
  });
}

function userTokenHandler() {
  if (sessionStorage.getItem("token")) {
    editMode();
  } else {
    logoutOption.classList.add("no-display");
    filters.classList.remove("no-display");
    document.querySelectorAll(".edit-mode").forEach((element) => {
      element.classList.add("no-display");
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
  modal = document.querySelector(e.currentTarget.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(":focus");
  modal.classList.remove("no-display");
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
    modal.classList.add("no-display");
    modal.removeEventListener("animationend", hideModal);

    //makes sure that the first view is always shown when reopening the modal by having it be the default on close
    if (mainView.classList.contains("no-display")) {
      backBtn.classList.add("no-display");
      secondaryView.classList.add("no-display");
      mainView.classList.remove("no-display");
    }

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

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//decide on above or alternative (since there is only one link)
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
secondaryView.classList.add("no-display");
//the button on the second view that leads back (and needs hiding too)
const backBtn = document.querySelector(".js-modal-switch-view");
backBtn.classList.add("no-display");
//note the mainView is the visible one on first load

forwardBtn.addEventListener("click", () => {
  mainView.classList.add("no-display");
  backBtn.classList.remove("no-display");
  secondaryView.classList.add("slideUp");
  secondaryView.classList.remove("no-display");
});

backBtn.addEventListener("click", () => {
  backBtn.classList.add("no-display");
  secondaryView.classList.add("no-display");
  mainView.classList.add("slideUp");
  mainView.classList.remove("no-display");
});

//revamping gallery-bin from existing gallery works <= rethink!

const binGallery = document.querySelector(".bin-gallery");
/**
 * Displays the array of works through creation and insertion of html elements
 * @param {Array} works
 */
function createBinGallery(works) {
  works.forEach((work) => {
    const binnedItem = document.createElement("div");
    binnedItem.classList.add("binned-item");
    binnedItem.dataset.id = work.id;
    binnedItem.addEventListener("click", deleteWork);

    const galleryImg = document.createElement("img");
    const galleryImgSrc = work.imageUrl;
    galleryImg.src = galleryImgSrc;

    const elementTitle = work.title;
    galleryImg.alt = elementTitle;

    const binButton = document.createElement("button");
    binButton.classList.add("bin-btn");

    const galleryBinIcon = document.createElement("i");
    galleryBinIcon.classList.add("fa-solid", "fa-trash-can", "fa-xs");

    binGallery.appendChild(binnedItem);
    binnedItem.appendChild(galleryImg);
    binnedItem.appendChild(binButton);
    binButton.appendChild(galleryBinIcon);
  });
}

const displayBinWorks = async () => {
  try {
    const works = await fetchWorks();
    createBinGallery(works);
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

displayBinWorks();

const deleteWork = async (event) => {
  try {
    const id = event.currentTarget.dataset.id;
    if (window.confirm("Supprimer cet élément définitivement ?")) {
      const token = window.sessionStorage.getItem("token");

      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      const worksToDelete = document.querySelectorAll(`[data-id="${id}"]`);

      switch (response.status) {
        case 200:
        case 204:
          worksToDelete.forEach((work) => work.remove());
          document.querySelector(".gallery").innerHTML = "";
          document.querySelector(".bin-gallery").innerHTML = "";
          displayFetchWorks();
          displayBinWorks();
          alert("L'élément a bien été supprimé");
          break;
        case 401:
          alert("Cette suppression n'est pas autorisée");
          break;
        default:
          alert("Une erreur est survenue, veuillez réessayer ultérieurement");
      }
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};
