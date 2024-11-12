const apiCategories = "https://opentdb.com/api_category.php";

const getCategories = () => {
    return fetch(apiCategories)
        .then(response => response.json())
        .then(data => data.trivia_categories)
        .catch(error => console.error("Error fetching categories:", error));
};

export default getCategories;