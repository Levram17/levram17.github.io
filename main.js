// We need to respect the checkbox mechanism but provide additional functionality
document.addEventListener('DOMContentLoaded', function() {
    // The menu is controlled by the checkbox, but we need to handle clicks outside
    window.addEventListener('click', function(event) {
        const menuToggle = document.getElementById('menu-toggle');
        const menuButton = document.getElementById('menu-button');
        const dropdownContent = document.querySelector('.dropdown-content');
        
        // If clicking outside the menu area and menu is open, close it
        if (menuToggle.checked && 
            event.target !== menuToggle && 
            event.target !== menuButton && 
            !dropdownContent.contains(event.target)) {
            menuToggle.checked = false;
        }
    });

    // Prevent form submission and handle search
    document.getElementById('search-button').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        const query = document.getElementById('search-input').value;
        if (query) {
            searchProducts(query);
        }
    });

    // Search function implementation
    function searchProducts(query) {
        console.log('Searching for:', query);
        // Placeholder for actual search functionality
        
        // Sample data for demonstration
        const products = [
            {
                name: 'Example Product for ' + query,
                price: '$19.99',
                store: 'Store A',
                image: '/api/placeholder/150/150'
            },
            {
                name: 'Another Product for ' + query,
                price: '$24.99',
                store: 'Store B',
                image: '/api/placeholder/150/150'
            }
        ];
        
        displayResults(products);
    }

    function displayResults(products) {
        // Create product grid if it doesn't exist
        let productGrid = document.getElementById('product-grid');
        
        if (!productGrid) {
            productGrid = document.createElement('div');
            productGrid.id = 'product-grid';
            productGrid.className = 'product-grid';
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
});
