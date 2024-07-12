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
