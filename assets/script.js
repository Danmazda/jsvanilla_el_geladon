const baseUrl = "http://localhost:3000/paletas";
const flavorsSection = document.querySelector("#flavors");
const flavorsTitle = document.querySelector("h2");

//Cart Fuctionality
const userCart = [];
const cartLogo = document.querySelector(".cart");
const cartMenu = document.querySelector(".cartMenu");
const deleteOn = document.querySelector(".deleteOn");
const cartTotal = document.querySelector(".cartTotal");
const cartItems = document.querySelector(".cartItems");
const updateCounter = document.querySelector(".update");
let total = 0;

//Search
const searchInput = document.querySelector("#search");

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
  if (!value) {
    flavorsTitle.innerText = "All Flavors";
  } else {
    flavorsTitle.innerText = "Search Results";
  }
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
      <button onclick="fetchPaletaID(${
        paleta.id
      })"><i class="fa-solid fa-cart-plus"></i></button>
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
  // if(userCart.includes(paleta)){
  //   const quantity = userCart.reduce()
  // }
  userCart.push(paleta);
  const quantity = userCart.filter((p) => p === paleta).length;
  if (deleteOn) {
    deleteOn.remove();
  }
  total += paleta.preco;
  const htmlString = `<div class="itemMenu">
      <img src="${paleta.foto}" alt="Paleta Sabor ${paleta.sabor}">
      <h3>${paleta.sabor}</h3>
      <p class="price">R$${paleta.preco.toFixed(2)}</p>
      <div class="counterHolder" key='${paleta.id}'>
        <i class="fa-solid fa-plus" onclick="oneMore(this)"></i>
        <p class="quantity">${quantity}</p>
        <i class="fa-solid fa-minus" onclick="oneLess(this)"></i>
      </div>
      <button onclick="deleteElement(this, ${
        paleta.id
      })"><i class="fa-solid fa-trash-can"></i></button>
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

function searchFor(query) {
  const paletas = document.querySelectorAll(".container");
  const searchQuery = new RegExp(`${query}`, "i");
  paletas.forEach((paleta) => {
    const result = searchQuery.test(paleta.children[1].textContent);
    paleta.classList.toggle("hidden", !result);
  });
}

function deleteElement(e, id) {
  e.parentElement.remove();
  const deletePaleta = userCart.find((p) => p.id === id);
  total -= deletePaleta.preco;
  cartTotal.innerText = `Total: R$${total.toFixed(2)}`;
  userCart.splice(userCart.indexOf(deletePaleta), 1);
}

function oneMore(e) {
  const div = e.parentElement;
  const p = div.children[1];
  const count = Number(p.innerText);
  const id = Number(div.getAttribute("key"));
  const plus = userCart.find((p) => p.id === Number(id));
  userCart.push(plus);
  p.innerText = `${count + 1}`;
  updateTotal();
}
function oneLess(e) {
  const div = e.parentElement;
  const p = div.children[1];
  const count = Number(p.innerText);
  const id = Number(div.getAttribute("key"));
  if (count - 1 === 0) {
    deleteElement(div, id);
  } else {
    const less = userCart.find((p) => p.id === Number(id));
    userCart.splice(userCart.indexOf(less), 1);
    p.innerText = `${count - 1}`;
  }
  updateTotal();
}
function updateTotal() {
  total = 0;
  userCart.forEach((p) => {
    total += p.preco;
  });
  cartTotal.innerText = `Total: R$${total.toFixed(2)}`;
}
function updateQuatity(num) {
  const quantityP = document.querySelector(".quantity");
  quantityP.innerText = `${num}`;
}
