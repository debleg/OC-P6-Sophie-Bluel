const fetchWorks = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        return works;
    } catch (error) {
        console.log("An error occurred:", error);
    };
}

//creates the container for the works to be displayed
const gallery = document.querySelector(".gallery")

//generates the works by iterating through the array
const displayWorks = async () => {
    try {
        //the function needs to be called for the works to be returned
        //works has to be stored in a variable as it doesn't exist outside of the function that generates it
        const works = await fetchWorks();

        works.forEach ((work)  =>  {
            //creation of the 3 components for each work
            const figure = document.createElement("figure");
            const galleryImg = document.createElement("img");
            const figcaption = document.createElement("figcaption");
        
            //retrieves img url to use as source
            const galleryImgSrc = work.imageUrl;
            galleryImg.src= galleryImgSrc;

            //retrieves title to use as img alt and figcaption
            const elementTitle = work.title;
            galleryImg.alt= elementTitle;
            figcaption.innerText= elementTitle;

            //appends all elements, figure being the sub-container
            gallery.appendChild(figure);
            figure.appendChild(galleryImg);
            figure.appendChild(figcaption);
        })
    } catch (error) {
        console.log("An error occurred:", error)
    }
}

displayWorks();
