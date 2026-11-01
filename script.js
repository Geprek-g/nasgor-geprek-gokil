let cart = [];
let orderNumber = "NGG-001";
let orderStatus = 1;

function rupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) {
    selectedScreen.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addItem(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.getElementById("cart-count").textContent =
    totalItems + " item · " + rupiah(totalPrice);
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function goCheckout() {
  if (cart.length === 0) {
    alert("Silakan pilih makanan terlebih dahulu.");
    return;
  }

  const itemContainer = document.getElementById("checkout-items");

  itemContainer.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.name} × ${item.quantity}</span>
      <span>${rupiah(item.price * item.quantity)}</span>
    </div>
  `).join("");

  document.getElementById("checkout-total").textContent = rupiah(getTotal());

  showScreen("checkout");
}

function payOrder() {
  if (cart.length === 0) {
    alert("Belum ada pesanan.");
    showScreen("menu");
    return;
  }

  // Simulasi pembayaran QRIS untuk prototype tugas.
  orderNumber = "NGG-" + Math.floor(100 + Math.random() * 900);
  orderStatus = 1;

  document.getElementById("success-number").textContent = orderNumber;
  document.getElementById("success-total").textContent = rupiah(getTotal());

  updateOrderStatus();
  showScreen("success");
}

function updateOrderStatus() {
  const numberElements = [
    "tracking-number",
    "processing-number",
    "ready-number",
    "completed-number"
  ];

  numberElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = orderNumber;
  });

  const labels = [
    "Pesanan diterima",
    "Diproses",
    "Siap diambil",
    "Selesai"
  ];

  const messages = [
    "Pesanan berhasil diterima oleh sistem.",
    "Pesananmu sedang diproses oleh dapur.",
    "Pesanan sudah siap. Silakan menuju kasir dan tunjukkan nomor pesanan.",
    "Pesanan telah diambil. Terima kasih sudah memesan!"
  ];

  const progressWidths = ["10%", "40%", "70%", "100%"];

  document.getElementById("status-pill").textContent = labels[orderStatus];
  document.getElementById("status-message").textContent = messages[orderStatus];
  document.getElementById("progress-fill").style.width = progressWidths[orderStatus];

  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById("step-" + i);
    step.classList.toggle("active", i <= orderStatus + 1);
  }

  const nextButton = document.getElementById("next-status");

  if (orderStatus === 3) {
    nextButton.textContent = "Pesanan sudah selesai";
    nextButton.disabled = true;
    nextButton.style.opacity = "0.6";
  } else {
    nextButton.textContent = "Simulasikan status berikutnya →";
    nextButton.disabled = false;
    nextButton.style.opacity = "1";
  }
}

function advanceStatus() {
  if (orderStatus < 3) {
    orderStatus++;
  }

  updateOrderStatus();

  if (orderStatus === 2) {
    showScreen("ready");
  } else if (orderStatus === 3) {
    showScreen("completed");
  }
}

// Memulai tampilan website.
updateCart();