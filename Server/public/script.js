let cart = [];

const products = [
  {name:"Witbrood", price:2.5, img:"https://images.unsplash.com/photo-1608198093002-ad4e005484ec"},
  {name:"Croissant", price:1.5, img:"https://www.ahealthylife.nl/wp-content/uploads/2021/03/Croissant_voedingswaarde.jpg"}
];

function toggleMenu(){
  document.getElementById("menu").classList.toggle("active");
}

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.getElementById("menu").classList.remove("active");
  window.scrollTo(0,0);
}

function loadProducts(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach((p,i)=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>€${p.price.toFixed(2)}</p>
          <button class="primary" onclick="add(${i})">Toevoegen</button>
        </div>
      </div>
    `;
  });
}

function add(i){
  cart.push(products[i]);
  updateCart();
}

function updateCart(){
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    list.innerHTML += `<li>${item.name} - €${item.price.toFixed(2)} <button onclick="remove(${index})">❌</button></li>`;
  });
  document.getElementById("total").innerText = total.toFixed(2);
}

function remove(i){
  cart.splice(i,1);
  updateCart();
}

// Stripe checkout
async function checkout() {
  if (cart.length === 0) return alert("Winkelwagen leeg!");

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart })
    });
    const data = await res.json();
    window.location.href = data.url; // redirect naar Stripe checkout
  } catch (err) {
    console.error(err);
    alert("Er ging iets mis bij de betaling");
  }
}

function share(){
  if(navigator.share){
    navigator.share({title:"Bakkerij De Goude Korst", url:window.location.href});
  }else{
    prompt("Kopieer deze link om te delen:", window.location.href);
  }
}

window.onload = loadProducts;