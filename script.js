// Toggle menu
document.getElementById('menu-button').addEventListener('click', function() {
    const dropdown = document.getElementById('dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close menu
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdown-content');
    const menuButton = document.getElementById('menu-button');
    if (event.target !== menuButton && !menuButton.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Handle search form submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-container form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const query = document.getElementById('search-input').value.trim();
            if (query) {
                window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Check if we're on the browse page and there's a search parameter
    if (window.location.pathname.includes('browse.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            loadSearchResults(searchQuery);
        } else {
            loadAllProducts();
        }
    }
});

// Load search results
function loadSearchResults(query) {
    // Update the page title to show search query
    const titleElement = document.querySelector('.browse-container h2');
    if (titleElement) {
        titleElement.textContent = `Search Results: ${query}`;
    }
    
    // Hide the "under construction" section if it exists
    const constructionSection = document.querySelector('.under-construction');
    if (constructionSection) {
        constructionSection.style.display = 'none';
    }
    
    // Create results container if it doesn't exist
    let resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'results-container';
        document.querySelector('.browse-container').appendChild(resultsContainer);
    }
    
    // Show loading indicator
    resultsContainer.innerHTML = '<div class="loading">Searching across platforms... This may take a moment</div>';
    
    // First, trigger a scraper run for fresh results
    fetch('http://localhost:5000/api/run-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Scraper response:', data);
        // Now fetch the results
        fetchProductData(query)
            .then(products => displayProducts(products, resultsContainer))
            .catch(error => {
                resultsContainer.innerHTML = `<div class="error">Error fetching results: ${error.message}</div>`;
            });
    })
    .catch(error => {
        console.error('Error triggering scraper:', error);
        // Still try to fetch existing results even if scraper fails
        fetchProductData(query)
            .then(products => displayProducts(products, resultsContainer))
            .catch(error => {
                resultsContainer.innerHTML = `<div class="error">Error fetching results: ${error.message}</div>`;
            });
    });
}

// Load all products for browsing
function loadAllProducts() {
    // Hide the "under construction" section if it exists
    const constructionSection = document.querySelector('.under-construction');
    if (constructionSection) {
        constructionSection.style.display = 'none';
    }
    
    // Create product container
    let productContainer = document.getElementById('product-container');
    if (!productContainer) {
        productContainer = document.createElement('div');
        productContainer.id = 'product-container';
        
        // Find where to insert the container
        const categorySection = document.querySelector('.category-section');
        if (categorySection) {
            categorySection.insertAdjacentElement('afterend', productContainer);
        } else {
            // If category section is removed, add to browse container
            document.querySelector('.browse-container').appendChild(productContainer);
        }
    }
    
    // Show loading indicator
    productContainer.innerHTML = '<div class="loading">Loading products... This may take a moment</div>';
    
    // Fetch all products
    fetchProductData()
        .then(products => {
            if (products.length === 0) {
                productContainer.innerHTML = '<div class="no-results">No products found. Try searching for a specific product.</div>';
                return;
            }
            displayProducts(products, productContainer);
            
            // Update category buttons if they exist
            const categories = document.querySelectorAll('.category');
            if (categories.length > 0) {
                updateCategoryButtons(products);
            }
        })
        .catch(error => {
            productContainer.innerHTML = `<div class="error">Error loading products: ${error.message}</div>`;
        });
}

// Fetch product data from our backend API
function fetchProductData(query = null) {
    let url = 'http://localhost:5000/api/search';
    
    if (query) {
        url += `?query=${encodeURIComponent(query)}`;
    }
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            // Return fallback data if API is not available
            return getFallbackProducts(query);
        });
}

// Display products in the container
function displayProducts(products, container) {
    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">No products found. Try a different search term.</div>';
        return;
    }
    
    // Create product grid
    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';
    
    // Add each product
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Use placeholder image if the image URL starts with /api/placeholder
        let imageUrl = product.image;
        if (imageUrl && imageUrl.startsWith('/api/placeholder')) {
            const parts = imageUrl.split('/');
            if (parts.length >= 4) {
                const width = parts[2];
                const height = parts[3];
                imageUrl = `https://via.placeholder.com/${width}x${height}`;
            }
        }
        
        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="source">From: ${product.source}</p>
            <a href="${product.link}" class="view-button" target="_blank">View Deal</a>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    container.innerHTML = '';
    container.appendChild(productGrid);
}
