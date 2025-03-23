// Close menu when clicking outside
window.addEventListener('click', function(event) {
    const menuToggle = document.getElementById('menu-toggle');
    const menuButton = document.getElementById('menu-button');
    
    // If click is outside the menu and the menu button, and the menu is open
    if (!event.target.closest('.dropdown-content') && 
        event.target !== menuButton && 
        event.target !== menuToggle && 
        menuToggle.checked) {
        
        menuToggle.checked = false;
    }
});

// Search products
document.getElementById('search-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    const query = document.getElementById('search-input').value;
    if (query) {
        searchProducts(query);
    }
});

// This function should be implemented or removed if not needed
function searchProducts(query) {
    console.log('Searching for:', query);
    // Placeholder for actual search functionality
    
    // Mock data for testing
    const products = [
        {
            name: 'Example Product 1',
            price: '$19.99',
            store: 'Store A',
            image: '/api/placeholder/100/100'
        },
        {
            name: 'Example Product 2',
            price: '$24.99',
            store: 'Store B',
            image: '/api/placeholder/100/100'
        }
    ];
    
    displayResults(products);
}

function displayResults(products) {
    // Check if product-grid exists, create it if it doesn't
    let productGrid = document.getElementById('product-grid');
    
    if (!productGrid) {
        productGrid = document.createElement('div');
        productGrid.id = 'product-grid';
        document.body.appendChild(productGrid);
    }
    
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p>Available at: ${product.store}</p>
        `;

        productGrid.appendChild(productCard);
    });
}
