// Toggle menu
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('menu-button').addEventListener('click', function(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('dropdown-content');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Close menu when clicking outside
    window.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdown-content');
        const menuButton = document.getElementById('menu-button');
        if (dropdown && event.target !== menuButton && !menuButton.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Search products
    document.getElementById('search-button').addEventListener('click', function() {
        const query = document.getElementById('search-input').value;
        if (query) {
            searchProducts(query);
        }
    });
});

function displayResults(products) {
    const productGrid = document.getElementById('product-grid');
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
