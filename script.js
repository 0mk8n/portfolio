let currentPage = 0;

// Function to display the correct page
function showPage(index) {
    const pages = document.querySelectorAll('.page'); // Select all elements with class "page"
    pages.forEach((page, i) => {
        page.classList.remove('active'); // Hide all pages
        if (i === index) {
            page.classList.add('active'); // Show only the page that matches the index
        }
    });
}

// Function to navigate to the previous page
function prevPage() {
    const pages = document.querySelectorAll('.page'); // Select all pages
    if (currentPage > 0) {
        currentPage--; // Move to the previous page
        showPage(currentPage); // Update the displayed page
    }
}

// Function to navigate to the next page
function nextPage() {
    const pages = document.querySelectorAll('.page'); // Select all pages
    if (currentPage < pages.length - 1) {
        currentPage++; // Move to the next page
        showPage(currentPage); // Update the displayed page
    }
}

// Initialize by showing the first page
showPage(currentPage);


let currentPage2 = 0;

// Function to display the correct page
function showPageTwo(index) {
    const pages = document.querySelectorAll('.page2'); // Select all elements with class "page"
    pages.forEach((page, i) => {
        page.classList.remove('active'); // Hide all pages
        if (i === index) {
            page.classList.add('active'); // Show only the page that matches the index
        }
    });
}

// Function to navigate to the previous page
function prevPageTwo() {
    const pages = document.querySelectorAll('.page2'); // Select all pages
    if (currentPage > 0) {
        currentPage--; // Move to the previous page
        showPageTwo(currentPage); // Update the displayed page
    }
}

// Function to navigate to the next page
function nextPageTwo() {
    const pages = document.querySelectorAll('.page2'); // Select all pages
    if (currentPage < pages.length - 1) {
        currentPage++; // Move to the next page
        showPageTwo(currentPage); // Update the displayed page
    }
}



// Initialize by showing the first page
showPageTwo(currentPage);
