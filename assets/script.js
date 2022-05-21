const baseUrl = "http://localhost:3000/";
// const baseUrl = "https://api-elgeladon-danmazda.onrender.com/";
const flavorsSection = document.querySelector("#flavors");
const flavorsTitle = document.querySelector("h2");

//Cart Fuctionality
const cartLogo = document.querySelector(".cart");
const cartMenu = document.querySelector(".cartMenu");
const deleteOn = document.querySelector(".deleteOn");
const cartTotal = document.querySelector(".cartTotal");
const cartItems = document.querySelector(".cartItems");
const updateCounter = document.querySelector(".update");

//Search
const searchInput = document.querySelector("#search");

//Login
const loginBt = document.querySelector(".login");
const loginMenu = document.querySelector(".loginMenu");
const sendLoginCredential = document.querySelector(".sendLoginCredential");
const emailInput = document.querySelector("[type='email']");
const passwordInput = document.querySelector("[type='password']");

//Admin
const adminSection = document.querySelector("#admin");
const searchIdInput = document.querySelector(".searchIdInput");
const searchIdBt = document.querySelector("#searchIdBt");
const searchIdResult = document.querySelector(".searchIdResult");
let token = "";

loginBt.addEventListener("click", () => {
  loginMenu.classList.toggle("hidden");
});

sendLoginCredential.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  const response = await fetch(`${baseUrl}user/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const resObj = await response.json();
  if (resObj.log && resObj.role === "admin") {
    token = resObj.token;
    adminSection.classList.remove("hidden");
    loginMenu.classList.toggle("hidden");
  } else {
    Swal.fire({
      title: "Error!",
      text: "Email or password invalid!",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
});
fetchPaletas();
fetchPaletasAdmin();
updateCart();

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
  const response = await fetch(`${baseUrl}paletas/all`);
  const allPaletas = await response.json();
  allPaletas.forEach((paleta) => {
    const htmlString = `<div class="container">
    <img src="${paleta.image}" alt="Paleta Sabor ${paleta.flavor}">
    <h3>${paleta.flavor}</h3>
    <p>${paleta.description}</p>
    <div class="priceAndAdd">
      <p class="price">R$${paleta.price.toFixed(2)}</p>
      <button onclick="PaletaIDCart('${
        paleta._id
      }')"><i class="fa-solid fa-cart-plus"></i></button>
    </div>
    </div>`;
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    flavorsSection.insertAdjacentElement("beforeend", div);
  });
}

async function PaletaIDCart(id, del = false) {
  let response;
  del
    ? (response = await fetch(`${baseUrl}user/deleteOne/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "souza@hotmail.com" }),
      }))
    : (response = await axios.post(`${baseUrl}user/add/${id}`, {
        email: "souza@hotmail.com",
      }));
  if (response.status === 200) {
    updateCart();
  }
}

function showCounter(count) {
  updateCounter.innerText = `${count}`;
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

async function deleteAllCart(e, id) {
  e.parentElement.remove();
  const response = await fetch(`${baseUrl}user/deleteAll/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "souza@hotmail.com" }),
  });
  updateCart();
}

async function fetchUserCart() {
  const response = await fetch(`${baseUrl}user/all`);
  const user = await response.json();
  return user[0].list;
}

async function updateCart() {
  while (cartItems.lastChild) {
    cartItems.firstChild.remove();
  }

  let user = await fetchUserCart();
  if (user.length > 0) {
    deleteOn.remove();
  }
  const alreadyShownFlavors = [];
  let total = 0;
  user.forEach((paleta) => {
    if (!alreadyShownFlavors.includes(paleta.flavor)) {
      const quantity = user.filter((p) => p._id === paleta._id).length;
      const htmlString = `<div class="itemMenu">
      <img src="${paleta.image}" alt="Paleta Sabor ${paleta.flavor}">
      <h3>${paleta.flavor}</h3>
      <p class="price">R$${paleta.price.toFixed(2)}</p>
      <div class="counterHolder" key='${paleta._id}'>
        <i class="fa-solid fa-plus" onclick="PaletaIDCart('${paleta._id}')"></i>
        <p class="quantity">${quantity}</p>
        <i class="fa-solid fa-minus" onclick="PaletaIDCart('${
          paleta._id
        }', ${true})"></i>
      </div>
      <button onclick="deleteAllCart(this, '${
        paleta._id
      }')"><i class="fa-solid fa-trash-can"></i></button>
    </div>`;
      const div = document.createElement("div");
      div.innerHTML = htmlString;
      cartItems.insertAdjacentElement("afterbegin", div);
      cartItems.classList.remove("hidden");
      alreadyShownFlavors.push(paleta.flavor);
      total += paleta.price * quantity;
    }
  });
  showCounter(user.length);
  cartTotal.innerText = `Total: R$${total.toFixed(2)}`;
}

//admin
async function fetchPaletasAdmin() {
  while (document.querySelector(".container")) {
    document.querySelector(".container").remove();
  }
  const response = await fetch(`${baseUrl}paletas/all`);
  const allPaletas = await response.json();
  allPaletas.forEach((paleta) => {
    const htmlString = `<div class="container">
    <img src="${paleta.image}" alt="Paleta Sabor ${paleta.flavor}">
    <h3>${paleta.flavor}</h3>
    <p>${paleta.description}</p>
    <p class="price">R$${paleta.price.toFixed(2)}</p>
    <p>ID: ${paleta._id}</p>
    <div class="paletaControl">
      <button onclick="showUpdate(this)">Update</button>
      <button onclick="deletePaleta('${paleta._id}')">Delete</button>
    </div>
    </div>
    `;
    const paletaUpdateForm = `<form action="/" method="post" class="updateForm hidden">
    <h3>Update:</h3>
    <fieldset>
      <label for="flavor"> Flavor</label>
      <input type="text" name="flavor" required value="${paleta.flavor}"/>
    </fieldset>
    <fieldset>
      <label for="image"> Image</label>
      <input type="text" name="image" required value="${paleta.image}"/>
    </fieldset>
    <fieldset>
      <label for="description"> Description</label>
      <input type="text" name="description" required  value="${
        paleta.description
      }"/>
    </fieldset>
    <fieldset>
      <label for="price"> Price</label>
      <input type="number" name="price" min="1" max="100" step="0.1" required value="${Number(
        paleta.price
      )}"/>
    </fieldset>
    <input value="${paleta._id}" name="id" hidden>
    <button type="submit" >Send</button>
  </form>`;
    const divForm = document.createElement("div");
    divForm.innerHTML = paletaUpdateForm;
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    div.appendChild(divForm);
    adminSection.insertAdjacentElement("beforeend", div);
  });
  document.querySelectorAll(".updateForm").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const id = formData.get("id");
      const reqBody = {
        price: formData.get("price"),
        image: formData.get("image"),
        description: formData.get("description"),
        flavor: formData.get("flavor"),
      };
      const response = await fetch(`${baseUrl}paletas/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Paleta Updated!",
          icon: "success",
          confirmButtonText: "Cool",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update paleta",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
      form.classList.toggle("hidden");
      fetchPaletas();
      fetchPaletasAdmin();
    });
  });
}
async function logOut() {
  token = "";
  adminSection.classList.add("hidden");
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const reqBody = {
    price: formData.get("price"),
    image: formData.get("image"),
    description: formData.get("description"),
    flavor: formData.get("flavor"),
  };
  const response = await fetch(`${baseUrl}paletas/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify(reqBody),
  });
  const resObj = await response.json();
  if (response.status === 200 && resObj.message === "Paleta created!") {
    Swal.fire({
      title: "Paleta Created!",
      icon: "success",
      confirmButtonText: "Cool",
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Failed to create paleta",
      icon: "error",
      confirmButtonText: "Cool",
    });
  }
  fetchPaletas();
  fetchPaletasAdmin();
});

async function deletePaleta(id) {
  const modal = await Swal.fire({
    title: "This action cannot be undone!",
    text: "are you sure you want to delete?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (modal.isConfirmed) {
    const response = await fetch(`${baseUrl}paletas/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: ` bearer ${token}`,
      },
    });
    if (response.status === 200) {
      Swal.fire({
        title: "Paleta Deleted!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete paleta",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    fetchPaletas();
    fetchPaletasAdmin();
  }
}

function showUpdate(e) {
  const updateForm =
    e.parentElement.parentElement.nextElementSibling.firstChild;
  updateForm.classList.toggle("hidden");
}

async function fetchPaletaById(id) {
  const response = await fetch(`${baseUrl}paletas/${id}`);
  const paleta = await response.json();
  return paleta[0];
}
async function searchPaletaById() {
  const paleta = await fetchPaletaById(searchIdInput.value);
  console.log(paleta);
  searchIdResult.innerHTML = `<div class="container">
  <img src="${paleta.image}" alt="Paleta Sabor ${paleta.flavor}">
  <h3>${paleta.flavor}</h3>
  <p>${paleta.description}</p>
  <p class="price">R$${paleta.price.toFixed(2)}</p>
  <p>ID: ${paleta._id}</p>
  </div>`
  searchIdResult.classList.toggle("hidden");
}
searchIdBt.addEventListener("click", () => {
  searchPaletaById();
});
