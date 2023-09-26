// cart.js

// Store cart items in an array
let cartItems = [];

// Listen for clicks on "Add to Cart" buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.getAttribute("data-product-id");
        const productName = event.target.parentElement.querySelector("h2").textContent;
        const productPrice = event.target.parentElement.querySelector(".price").textContent;

        // Add the selected product to the cartItems array
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
        });

        // You can also update the UI to reflect the added item to the cart
        // For example, you can display a message or update a cart icon.
    }
});
