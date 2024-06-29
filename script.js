const fetchWorks = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        return works;
    } catch (error) {
        console.log("An error occurred:", error);
    };
}
