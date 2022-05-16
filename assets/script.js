const baseUrl = "http://localhost:3000/paletas";
const flavorsSection = document.querySelector("#flavors");
//Cart Fuctionality
const userCart = [];
const cartLogo = document.querySelector(".cart");
const cartMenu = document.querySelector(".cartMenu");
const deleteOn = document.querySelector(".deleteOn");
const cartTotal = document.querySelector(".cartTotal");
const cartItems = document.querySelector(".cartItems");
const updateCounter = document.querySelector(".update");
let total = 0;
let totalPaletas = 0;

//Search
const searchInput = document.querySelector("#search");
const searchResults = document.querySelector(".searchResults");

fetchPaletas();

cartLogo.addEventListener("click", () => {
  if (cartMenu.classList.contains("hidden")) {
    cartMenu.classList.remove("hidden");
  } else {
    cartMenu.classList.add("hidden");
  }
});


searchInput.addEventListener("input", (e) => {
  let value = e.target.value;

  searchFor(value);
});

//Functions
async function fetchPaletas() {
  const response = await fetch(`${baseUrl}/all`);
  const allPaletas = await response.json();
  allPaletas.forEach((paleta) => {
    const htmlString = `<div class="container">
    <img src="${paleta.foto}" alt="Paleta Sabor ${paleta.sabor}">
    <h3>${paleta.sabor}</h3>
    <p>${paleta.descricao}</p>
    <div class="priceAndAdd">
      <p class="price">R$${paleta.preco.toFixed(2)}</p>
      <button onclick="fetchPaletaID(${paleta.id})">Add to cart</button>
    </div>
    </div>`;
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    flavorsSection.insertAdjacentElement("beforeend", div);
  });
}

async function fetchPaletaID(id) {
  const response = await fetch(`${baseUrl}/${id}`);
  const paleta = await response.json();
  userCart.push(paleta);
  if (deleteOn) {
    deleteOn.remove();
  }
  total += paleta.preco;
  const htmlString = `<div class="itemMenu" key='${paleta.id}'>
      <img src="${paleta.foto}" alt="Paleta Sabor ${paleta.sabor}">
      <h3>${paleta.sabor}</h3>
      <p class="price">R$${paleta.preco.toFixed(2)}</p>
      <button>delete</button>
    </div>`;
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  cartItems.classList.remove("hidden");
  cartItems.insertAdjacentElement("afterbegin", div);
  cartTotal.innerText = `Total: R$${total.toFixed(2)}`;
  updateCounter.innerText = `${userCart.length}`;
  updateCounter.classList.remove("hidden");
  setTimeout(() => {
    updateCounter.classList.add("hidden");
  }, 1000);
}

async function searchFor(query) {
  const paletas = document.querySelectorAll(".container");
  const searchQuery = new RegExp(`${query}`, "i");
  paletas.forEach((paleta) => {
    const result = searchQuery.test(paleta.children[1].textContent);
    paleta.classList.toggle("hidden", !result);
  });
}
