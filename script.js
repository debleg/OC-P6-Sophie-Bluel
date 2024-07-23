//stores the login token for API authorization use
const token = window.sessionStorage.getItem("token");
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
 * Creates figure element in the main gallery for each work entered as parameter
 * @param {Object} work
 */
function displayWorks(work) {
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
}

/**
 * Loops through works to create gallery elements in main page
 */
const displayFetchWorks = async () => {
  try {
    //works has to be stored in a variable as it doesn't exist outside of the function that generates it
    const works = await fetchWorks();
    works.forEach((work) => {
      displayWorks(work);
    });
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
          Array.from(worksFiltered).forEach((worksFiltered) => {
            displayWorks(worksFiltered);
          });
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

//specific sections whose display needs to be toggled
const filters = document.querySelector(".filters");
const loginLink = document.querySelector(".login-link");
const logoutOption = document.querySelector(".logout-option");

/**
 * Handles display of elements when token is present and logout option to go back to regular main page
 */
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

/**
 * Allows the switch between normal and edit mode on the front page by displaying the relevant elements based on the token being present in storage
 */
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

//Modal starts here

let modal = null;
const focusableSelector = "button, a, i, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

/**
 * Opens modal on click on the link, taking focus accessibility behaviour into account
 * @param {click} e
 */
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

/**
 * Closes the modal when the button has been clicked (or the outside of the modal)
 * @param {click} e
 * @returns
 */
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
  //allows the animation to work based on its length
  const hideModal = function () {
    modal.classList.add("no-display");
    modal.removeEventListener("animationend", hideModal);

    //ensures the first view is always shown when reopening the modal by having it be the default on close
    if (mainView.classList.contains("no-display")) {
      backBtn.classList.add("no-display");
      secondaryView.classList.add("no-display");
      mainView.classList.remove("no-display");
    }

    modal = null;
  };

  modal.addEventListener("animationend", hideModal);
};

/**
 * Stops modal from closing when clicking inside
 * @param {click} e
 */
const stopPropagation = function (e) {
  e.stopPropagation();
};

/**
 * Adjusts element focus base on user keyboard usage for accessibility reasons
 * @param {KeyboardEvent} e
 */
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

document.querySelector(".edit-link").addEventListener("click", openModal);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

//Modal view management starts here

//Note: The main view is visible on each modal opening

const mainView = document.querySelector(".remove-works-view");
const secondaryView = document.querySelector(".add-works-view");
const forwardBtn = document.querySelector(".add-works-redirect");
const backBtn = document.querySelector(".js-modal-switch-view");
backBtn.classList.add("no-display");

//Behaviour of the forward button
forwardBtn.addEventListener("click", () => {
  mainView.classList.add("no-display");
  backBtn.classList.remove("no-display");
  secondaryView.classList.add("slideUp");
  secondaryView.classList.remove("no-display");
});

//Behaviour of the back button
backBtn.addEventListener("click", () => {
  backBtn.classList.add("no-display");
  secondaryView.classList.add("no-display");
  mainView.classList.add("slideUp");
  mainView.classList.remove("no-display");
});

//First modal view starts here

const binGallery = document.querySelector(".bin-gallery");

/**
 * Creates gallery element in first modal with bin icon overlapped for later deletion for each work
 * @param {object} work
 */
function createBinGallery(work) {
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
}

/**
 * Loops through works to create the gallery elements in modal
 */
const displayBinWorks = async () => {
  try {
    const works = await fetchWorks();
    works.forEach((work) => {
      createBinGallery(work);
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

/**
 * Deletes selected work on click in the first modal gallery using API call and removes the work dynamically
 * @param {click} event
 */
const deleteWork = async (event) => {
  try {
    const id = event.currentTarget.dataset.id;
    if (window.confirm("Supprimer cet élément définitivement ?")) {
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

displayBinWorks();

// Second modal view starts here

// select input
const categoriesDropdownContainer =
  document.getElementById("add-works-category");
//image input section of the "Ajout Photo"
const addPictureArea = document.querySelector(".add-picture-area");
const addPictureBtn = document.createElement("button");
const addPictureInput = document.createElement("input");

/**
 * Creates the category dropdown dynamically (one empty field hardcoded in html to have empty value show by default)
 */
const categoriesDropdown = async () => {
  const categories = await fetchCategories();
  categories.forEach((category) => {
    const categoryName = category.name;
    const categoryId = category.id;
    const categoryOption = document.createElement("option");
    categoryOption.value = categoryId;
    categoryOption.innerText = categoryName;
    categoriesDropdownContainer.appendChild(categoryOption);
  });
};

/**
 * Creates the picture input part of the form dynamically
 */
function populateAddPictureArea() {
  //icon
  const pictureIcon = document.createElement("i");
  pictureIcon.classList.add("picture-icon", "fa-regular", "fa-image", "fa-5x");
  //button
  addPictureBtn.classList.add("add-picture");
  addPictureBtn.innerText = "+ Ajouter photo";
  //hidden input
  addPictureInput.classList.add("no-display", "add-picture-input");
  addPictureInput.setAttribute("id", "add-picture-input");
  addPictureInput.setAttribute("type", "file");
  addPictureInput.setAttribute("accept", "image/jpeg, image/png");
  //size/format description
  const pictureDetails = document.createElement("p");
  pictureDetails.classList.add("picture-details");
  pictureDetails.innerText = "jpg, png: 4mo max";
  //appending all
  addPictureArea.append(
    pictureIcon,
    addPictureBtn,
    addPictureInput,
    pictureDetails
  );
}

/**
 * Calls the two functions needed for the initial display of the second modal view
 */
function addWorksView() {
  populateAddPictureArea();
  categoriesDropdown();
}

addWorksView();

//Secondary modal input treatment starts here

//general form variables
const addWorksForm = document.querySelector(".add-works-form");
const addWorksBtn = document.querySelector(".add-works-btn");
//image related variables
const maxPictureSize = 4 * 1024 * 1024;
let selectedPicture = null;
let fileBuffer = null;
//other fields
let addWorksCategory = null;
let addWorksTitle = null;

/**
 * Displays a preview of the user input image file where the picture input form was
 * @param {ImageData} pictureInput
 */
function displayNewImage(pictureInput) {
  const displayImage = new FileReader();
  displayImage.onload = (e) => {
    fileBuffer = e.target.result;
    const picturePreview = document.createElement("img");
    picturePreview.classList.add("picture-preview");
    picturePreview.src = URL.createObjectURL(pictureInput);
    //clear area and preview image
    addPictureArea.innerHTML = "";
    addPictureArea.appendChild(picturePreview);
  };
  displayImage.readAsArrayBuffer(pictureInput);
}

/**
 * Handles form image input with checks for size and type
 */
function imageInput() {
  //clicking the button opens the input
  addPictureBtn.addEventListener("click", () => {
    addPictureInput.click();
  });

  addPictureInput.addEventListener("change", (event) => {
    const pictureInput = event.target.files[0];

    if (!pictureInput) return;

    if (
      pictureInput.type !== "image/jpeg" &&
      pictureInput.type !== "image.png"
    ) {
      alert("Veuillez sélectionner une image");
      return;
    }

    if (pictureInput.size > maxPictureSize) {
      alert("La taille de votre image dépasse la limite autorisée");
      return;
    }

    selectedPicture = pictureInput;

    displayNewImage(pictureInput);
  });
}

/**
 * Turns fileBuffer from picture input into binary string needed for the API POST checking selectedPicture type
 * returns blob for API POST
 */
function getPictureBlob() {
  if (!fileBuffer) return null;
  if (selectedPicture.type == "image/jpeg") {
    return new Blob([fileBuffer], { type: "image/jpeg" });
  } else {
    return new Blob([fileBuffer], { type: "image/png" });
  }
}

/**
 * Handles separate form input fields (picture is triggered first)
 */
function newWorksFormInput() {
  imageInput();

  document
    .getElementById("add-works-title")
    .addEventListener("input", (event) => {
      addWorksTitle = event.target.value.trim();
      if (!addWorksTitle) {
        alert("Veuillez choisir un titre pour ce nouvel élément");
      }
    });

  categoriesDropdownContainer.addEventListener("input", (event) => {
    addWorksCategory = event.target.value;
    if (!addWorksCategory) {
      alert("Veuillez choisir une catégorie pour ce nouvel élément");
    }
  });
}

/**
 * Checks that the form is fully completed before the button becomes clickable, alerts the user if the button is clicked before that
 */
function newWorksFormCheck() {
  // Bundles data together to be checked as one
  let formFields = {
    picture: false,
    title: false,
    category: false,
  };

  // Gets updated with every input
  const updateSubmitButton = () => {
    const formIsValid = Object.values(formFields).every(
      (field) => field === true
    );

    if (formIsValid) {
      addWorksBtn.classList.remove("disabled-btn");
      addWorksBtn.disabled = false;
    } else {
      addWorksBtn.classList.add("disabled-btn");
      addWorksBtn.disabled = true;
    }
  };

  addWorksForm.addEventListener("input", (event) => {
    // Updates the corresponding field in formFields
    if (event.target.id === "add-picture-input") {
      formFields.picture = event.target.files.length > 0;
    } else if (event.target.id === "add-works-title") {
      formFields.title = event.target.value.trim() !== "";
    } else if (event.target.id === "add-works-category") {
      formFields.category = event.target.value !== "";
    }

    updateSubmitButton();
  });

  addWorksBtn.addEventListener("click", (event) => {
    // Sends an alert to the user if the button is clicked before the form is fully filled
    if (!Object.values(formFields).every((field) => field === true)) {
      alert("Merci de remplir tous les champs de ce formulaire");
      event.preventDefault();
    }
  });
}

/**
 * Sends API POST request after the form inputs have been treated and checked and updates the galleries dynamically with the new work
 */
function newWorksFormSubmit() {
  newWorksFormInput();

  newWorksFormCheck();

  addWorksForm.addEventListener("submit", async function (event) {
    try {
      event.preventDefault;
      //the formData requires a binary string for the image
      const addWorksPicture = getPictureBlob();

      const formData = new FormData();
      formData.append("image", addWorksPicture);
      formData.append("title", addWorksTitle);
      formData.append("category", addWorksCategory);
      const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const newWork = await response.json();
      switch (response.status) {
        case 201:
          //clears each gallery and puts the new work through the function to create the respective elements
          document.querySelector(".gallery").innerHTML = "";

          displayWorks(newWork);
          document.querySelector(".bin-gallery").innerHTML = "";
          createBinGallery(newWork);

          alert("L'élément a bien été ajouté");
          //resetting the form and the picture input area
          addWorksForm.reset();
          populateAddPictureArea();

          break;
        case 400:
          alert(
            "Le formulaire n'a pas pu être traité, veuillez vérifier la validité des champs"
          );
          break;
        case 401:
          alert("Cet ajout n'est pas autorisé");
          break;
        default:
          alert("Une erreur est survenue, veuillez réessayer ultérieurement");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  });
}

newWorksFormSubmit();
