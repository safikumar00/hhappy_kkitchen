let cartCount = 0;
let totalCost = 0;
let cartItems = [];

function toggleAccordion(id) {
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion) => {
    if (accordion.classList.contains("flex")) {
      accordion.classList.replace("flex", "hidden");
    }
  });
  const element = document.getElementById(id);
  if (element.classList.contains("flex")) {
    element.classList.replace("flex", "hidden");
  } else {
    element.classList.replace("hidden", "flex");
  }
}

const menuContainer = document.querySelector(".menu-container");

var html = "";
// Create an object that maps category names to their corresponding HTML elements
const categories = {
  specials: document.getElementById("specials"),
  biryani: document.getElementById("biryani"),
  starters: document.getElementById("starters"),
  curries: document.getElementById("curries"),
  "fired-rice": document.getElementById("fired-rice"),
  meals: document.getElementById("meals"),
};

// Iterate through the foodItems array and append each item to its corresponding category element
foodItems.forEach((item) => {
  if (item.category in categories) {
    const categoryElement = categories[item.category.toLowerCase()];
    // console.log(categoryElement);
    categoryElement.innerHTML += `
            <div class="p-2 flex justify-center w-full items-center gap-2 menu-item border-b border-gray-300">
                <div class="w-full flex flex-col px-2">
                <div class="flex text-sm ${item.color}"><img src="${item.typeof}" width="10%" alt=""><p class="capitalize">&nbsp;${item.category}</p></div>
                <h3 class="text-xl font-semibold">${item.name}</h3>
                <p class="text-base">Rs. ${item.price}/-</p>
                </div>
                <div class="w-full flex flex-col items-center">
                <img src="${item.image}" alt="${item.name}"
                    class="w-full object-cover rounded-lg">
                <div style="margin-top: -20px;" class="" data-item-id="${item.id}">
                    <button
                    class="add-to-cart bg-blue-500 text-white px-4 py-2 w-fit rounded hover:bg-blue-600 transition">Add
                    to Cart</button>
                    <div class="flex items-center hidden bg-white rounded-lg shadow-md overflow-hidden p-1">
                    <button
                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition remove-from-cart">-</button>
                    <span class="mx-2 text-xl">0</span>
                    <button
                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition increment-quantity">+</button>
                    </div>
                </div>
                </div>
            </div>
            `;
  }
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentElement = button.parentElement;

    const itemId = parentElement.getAttribute("data-item-id");

    const hiddenDiv = button.nextElementSibling;

    hiddenDiv.classList.remove("hidden");

    button.classList.add("hidden");

    const countSpan = hiddenDiv.querySelector("span");

    const count = parseInt(countSpan.textContent) + 1;
    countSpan.textContent = count;

    addToCart(itemId);

    if (count <= 0) {
      hiddenDiv.classList.add("hidden");
      button.classList.remove("hidden");
    }
  });
});

const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");

removeFromCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentElement = button.parentElement.parentElement;
    const countparentElement = button.parentElement;

    const itemId = parentElement.getAttribute("data-item-id");

    const countSpan = countparentElement.querySelector("span");

    const count = parseInt(countSpan.textContent) - 1;
    countSpan.textContent = count;

    removefromcart(itemId);

    if (count <= 0) {
      button.parentElement.classList.add("hidden");
      button.parentElement.previousElementSibling.classList.remove("hidden");
    }
  });
});

const incrementQuantityButtons = document.querySelectorAll(
  ".increment-quantity"
);

incrementQuantityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parentElement = button.parentElement.parentElement;
    const countparentElement = button.parentElement;

    const itemId = parentElement.getAttribute("data-item-id");

    const countSpan = countparentElement.querySelector("span");

    const count = parseInt(countSpan.textContent) + 1;
    countSpan.textContent = count;

    addToCart(itemId);
  });
});

function addToCart(itemId) {
  totalCost += parseInt(itemId);
  cartCount++;
  document.getElementById("cart-count").textContent = `${cartCount} Item${
    cartCount > 1 ? "s" : ""
  }`;
  document.getElementById("total-cost").textContent = `Rs. ${totalCost}`;

  let item = cartItems.find((cartItem) => cartItem.id === itemId);
  if (item) {
    item.quantity += 1;
  } else {
    cartItems.push({ id: itemId, quantity: 1 });
  }
  updateCart(itemId);
  // cartItems.forEach((item) => console.log(item));
}

function removefromcart(itemId) {
  totalCost -= parseInt(itemId);
  cartCount--;
  document.getElementById("cart-count").textContent = `${cartCount} Item${
    cartCount > 1 ? "s" : ""
  }`;
  document.getElementById("total-cost").textContent = `Rs. ${totalCost}`;

  let item = cartItems.find((cartItem) => cartItem.id === itemId);
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);
  }
  updateCart(itemId);
  // cartItems.forEach(item => console.log(item));
}

function updateCart() {
  const cartContainer = document.getElementById("cart-items");

  if (!cartContainer) {
    console.error("Cart container with id 'cart-items' not found.");
    return;
  }

  if (cartItems.length >= 1) {
    document.querySelector(".cart-section").classList.add("cart-success");
    document.querySelector(".checkout-btn").style.background = "white";
    document.querySelector(".checkout-btn").style.color = "black";
  }

  let cartHtml = "";
  let totalCost = 0;
  let cartCount = 0;

  cartItems.forEach((item) => {
    // Convert `item.id` to a number for comparison
    let food = foodItems.find((food) => food.id === Number(item.id));

    if (!food) {
      console.warn(`Food item with id ${item.id} not found in foodItems.`);
      return; // Skip this cart item
    }

    // Calculate the total cost for this item
    const itemCost = parseFloat(food.price) * item.quantity;
    totalCost += itemCost;
    cartCount += item.quantity;

    // Append to cartHtml
    cartHtml += `
                <li class="flex justify-between py-4 border-b border-gray-600 card-item" data-item-id="${
                  food.id
                }">
                    <img src="${food.cartImage || food.image}" alt="${
      food.name
    }" class="object-cover w-16 h-16">
                    <div class="w-full ml-4">
                    <h4 class="text-lg font-semibold">${food.name}</h4>
                    <span class="text-lg font-bold text-gray-400">${
                      food.price
                    }</span>
                    </div>
                    <div class="flex flex-col items-end justify-between">
                    <span class="text-2xl font-bold text-blue-500">${itemCost}</span>
                    <div class="flex items-center">
                        <button class="px-2 py-1 text-white transition bg-blue-500 rounded hover:bg-blue-600 remove-from-cart">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="px-2 py-1 text-white transition bg-blue-500 rounded hover:bg-blue-600 increment-quantity">+</button>
                    </div>
                    </div>
                </li>
                `;
  });

  // Update cart container HTML
  cartContainer.innerHTML = cartHtml;

  // Update total cost and cart count
  document.getElementById("cart-count").textContent = `${cartCount} Item${
    cartCount > 1 ? "s" : ""
  }`;
  document.getElementById("total-cost").textContent = `Rs. ${totalCost}`;

  // Debugging log
  console.log("Cart updated successfully:", cartHtml);
}

window.addEventListener("popstate", function (event) {
  if (isCartOpen) {
    event.preventDefault();
    closeCart();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Backspace" && isCartOpen) {
    closeCart();
  }
});

// Get the cart container element
const cartContainer = document.getElementById("cart-items");

// Add an event listener to the cart container
cartContainer.addEventListener("click", (event) => {
  // Check if the clicked element is a remove-from-cart button
  if (event.target.classList.contains("remove-from-cart")) {
    // Get the item ID from the button's parent element
    const itemId = event.target
      .closest(".card-item")
      .getAttribute("data-item-id");
    removefromcart(itemId);
  }

  // Check if the clicked element is an increment-quantity button
  if (event.target.classList.contains("increment-quantity")) {
    // Get the item ID from the button's parent element
    const itemId = event.target
      .closest(".card-item")
      .getAttribute("data-item-id");
    console.log(itemId);
    // Increment the quantity
    const item = cartItems.find((item) => item.id === itemId);
    item.quantity++;
    updateCart();
  }

  // Check if the clicked element is a decrement-quantity button
  if (event.target.classList.contains("decrement-quantity")) {
    // Get the item ID from the button's parent element
    const itemId = event.target
      .closest(".card-item")
      .getAttribute("data-item-id"); // Decrement the quantity
    const item = cartItems.find((item) => item.id === itemId);
    item.quantity--;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter((item) => item.id !== itemId);
    }
    updateCart();
  }
});

function checkout() {
  if (cartItems.length === 0) {
    alert("Your cart is empty. Please add items to your cart.");
    document.querySelector(".cart-section").classList.add("cart-error");
    setTimeout(() => {
      document.querySelector(".cart-section").classList.remove("cart-error");
    }, 3000);
    closeCart();
    return;
  } else {
    alert("Proceeding to checkout...");
    const params = new URLSearchParams();
    params.append("cartItems", JSON.stringify(cartItems));
    window.location.href = `checkout.html?${params.toString()}`;
  }
}

function openCart() {
  if (cartItems.length !== 0) {
    document.getElementById("cart-expanded").classList.remove("hidden");
    document.querySelector(".cart-section").style.height = "80vh";
    document.getElementById("menu").style.filter = "blur(10px)";
    document.getElementById("cart-expanded").classList.add("h-full");
    isCartOpen = true;
  }
}

document.getElementById("menu").addEventListener("click", () => {
  closeCart();
});

document.getElementById("closecartbtn").addEventListener("click", () => {
  closeCart();
});

function closeCart() {
  document.getElementById("cart-expanded").classList.add("hidden");
  document.querySelector(".cart-section").style.height = "";
  document.getElementById("menu").style.filter = "";
  document.getElementById("cart-expanded").classList.remove("h-full");
  isCartOpen = false;
}
