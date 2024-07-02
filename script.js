const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

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

//creates the container for the works to be displayed
const gallery = document.querySelector(".gallery");

const displayFetchWorks = async () => {
  try {
    //works has to be stored in a variable as it doesn't exist outside of the function that generates it
    const works = await fetchWorks();
    displayWorks(works);
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

displayFetchWorks();

const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

const mapCategories = async () => {
  try {
    const works = await fetchWorks();
    const categoryNames = works.map((work) => {
      return work.category.name;
    });
    console.log(new Set(categoryNames));
  } catch (error) {
    console.log("An error occurred: ", error);
  }
};
mapCategories(); //<= does this need an await to be used?

//creates the container for the category filters to be displayed
const categoryFilters = document.querySelector(".filters");

//creates the category buttons
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

    //creates a button for each category with its name
    categories.forEach((category) => {
      const buttonCategory = document.createElement("button");
      const categoryName = category.name;
      buttonCategory.innerText = categoryName;
      buttonCategory.dataFilter = categoryName;
      buttonCategory.classList.add("category-button");
      categoryFilters.appendChild(buttonCategory);
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

categoryButtons();

const filterCategory = async () => {
  try {
    const works = await fetchWorks();
    const buttons = document.querySelectorAll(".category-button");

    Array.from(buttons).forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.remove("active-button"); //unsure this works // not working, needs to be removed globally

        const buttonDataFilter = button.dataFilter;
        if (buttonDataFilter === "Tous") {
          button.classList.add("active-button");
          document.querySelector(".gallery").innerHTML = "";
          displayFetchWorks();
        } else {
          button.classList.add("active-button");
          const worksFiltered = works.filter(
            (work) => work.category.name === buttonDataFilter
          );
          document.querySelector(".gallery").innerHTML = "";
          //displayWorksFiltered(worksFiltered)
          displayWorks(worksFiltered);
        }
      });
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

filterCategory();
