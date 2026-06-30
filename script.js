const authStorageKey = 'chitrabazzi-admin-session';
const dataStorageKey = 'chitrabazzi-admin-data';
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const roleBadge = document.getElementById('roleBadge');
const welcomeTitle = document.getElementById('welcomeTitle');
const profileName = document.getElementById('profileName');
const superAdminBanner = document.getElementById('superAdminBanner');
const loginForm = document.getElementById('loginForm');
const roleSelect = document.getElementById('roleSelect');

const defaultData = {
  products: [
    { id: 1, name: 'Resin Sunset Vase', category: 'Resin Art', price: 1299, description: 'Handmade resin artwork with gold detailing.', stock: 24, images: 'sunset-vase.jpg' },
    { id: 2, name: 'Crochet Bloom Throw', category: 'Crochet', price: 1899, description: 'Soft pastel throw for cozy spaces.', stock: 12, images: 'bloom-throw.jpg' },
    { id: 3, name: 'Personalized Gift Box', category: 'Personalized Gifts', price: 999, description: 'Customized keepsake gift set.', stock: 32, images: 'gift-box.jpg' }
  ],
  orders: [
    { id: 'ORD-1001', customer: 'Asha D.', status: 'Delivered', total: 2499 },
    { id: 'ORD-1002', customer: 'Ritika M.', status: 'Pending', total: 1299 },
    { id: 'ORD-1003', customer: 'Neeraj B.', status: 'Processing', total: 1899 }
  ],
  customers: [
    { id: 1, name: 'Asha D.', email: 'asha@example.com', city: 'Mumbai', orders: 3 },
    { id: 2, name: 'Ritika M.', email: 'ritika@example.com', city: 'Delhi', orders: 2 },
    { id: 3, name: 'Neeraj B.', email: 'neeraj@example.com', city: 'Bengaluru', orders: 4 }
  ],
  categories: ['Resin Art', 'Crochet', 'Home Decor', 'Personalized Gifts'],
  reviews: [
    { id: 1, customer: 'Isha', product: 'Resin Sunset Vase', rating: 5, status: 'Pending' },
    { id: 2, customer: 'Aman', product: 'Crochet Bloom Throw', rating: 4, status: 'Approved' }
  ],
  banners: [
    { id: 1, title: 'Festive Collection', subtitle: 'New arrivals this season', image: 'Festive Banner' },
    { id: 2, title: 'Handmade Gifts', subtitle: 'Custom gifts for every celebration', image: 'Gift Banner' }
  ],
  coupons: [
    { id: 1, code: 'WELCOME10', discount: 10, expiry: '2026-12-31' }
  ],
  settings: {
    logo: 'ChitraBazzi',
    phone: '+91 98765 43210',
    email: 'hello@chitrabazzi.com',
    instagram: '@chitrabazzi',
    facebook: 'ChitraBazzi'
  }
};

let currentUser = JSON.parse(localStorage.getItem(authStorageKey) || 'null');
let data = JSON.parse(localStorage.getItem(dataStorageKey) || 'null') || defaultData;
let activeSection = 'dashboard';
let editingProductId = null;
let editingCategoryId = null;
let editingCouponId = null;
let selectedProductId = data.products[0]?.id || null;
let selectedOrderId = data.orders[0]?.id || null;
let selectedCustomerId = data.customers[0]?.id || null;

function saveData() {
  localStorage.setItem(dataStorageKey, JSON.stringify(data));
}

function renderSession() {
  const isLoggedIn = Boolean(currentUser);
  document.body.classList.toggle('is-logged-in', isLoggedIn);
  document.body.classList.toggle('is-logged-out', !isLoggedIn);

  authModal.classList.toggle('hidden', isLoggedIn);
  loginBtn.classList.toggle('hidden', isLoggedIn);
  logoutBtn.classList.toggle('hidden', !isLoggedIn);

  if (isLoggedIn) {
    const displayName = currentUser.name || 'Admin';
    const roleLabel = currentUser.role === 'super' ? 'Super Admin' : 'Admin';
    welcomeTitle.textContent = `Welcome back, ${displayName}`;
    profileName.textContent = displayName;
    roleBadge.textContent = roleLabel;
    roleBadge.classList.toggle('super', currentUser.role === 'super');
    superAdminBanner.classList.toggle('hidden', currentUser.role !== 'super');
  } else {
    welcomeTitle.textContent = 'Welcome back, Admin';
    profileName.textContent = 'Guest';
    roleBadge.textContent = 'Guest';
    roleBadge.classList.remove('super');
    superAdminBanner.classList.add('hidden');
  }
}

function renderDashboard() {
  document.getElementById('productsCount').textContent = data.products.length;
  document.getElementById('ordersCount').textContent = data.orders.length;
  document.getElementById('customersCount').textContent = data.customers.length;
  document.getElementById('revenueCount').textContent = `₹${data.orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`;
}

function renderProducts() {
  const body = document.getElementById('productsTableBody');
  body.innerHTML = data.products.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>₹${product.price}</td>
      <td>${product.stock}</td>
      <td>
        <button class="action-btn" data-action="view-product" data-id="${product.id}">View</button>
        <button class="action-btn" data-action="edit-product" data-id="${product.id}">Edit</button>
        <button class="action-btn" data-action="delete-product" data-id="${product.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  const detail = data.products.find((product) => product.id === selectedProductId) || data.products[0];
  if (detail) {
    document.getElementById('productDetail').innerHTML = `
      <h4>${detail.name}</h4>
      <p>${detail.description}</p>
      <p><strong>Category:</strong> ${detail.category}</p>
      <p><strong>Price:</strong> ₹${detail.price}</p>
      <p><strong>Stock:</strong> ${detail.stock}</p>
      <p><strong>Images:</strong> ${detail.images}</p>
    `;
  }
}

function renderCategories() {
  document.getElementById('categoriesList').innerHTML = data.categories.map((category) => `
    <div class="chip">
      <span>${category}</span>
      <div>
        <button class="action-btn" data-action="edit-category" data-name="${category}">Edit</button>
        <button class="action-btn" data-action="delete-category" data-name="${category}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderOrders() {
  const body = document.getElementById('ordersTableBody');
  body.innerHTML = data.orders.map((order) => `
    <tr>
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>
        <select data-action="update-order-status" data-id="${order.id}">
          ${['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </td>
      <td>₹${order.total}</td>
    </tr>
  `).join('');

  const detail = data.orders.find((order) => order.id === selectedOrderId) || data.orders[0];
  if (detail) {
    document.getElementById('orderDetail').innerHTML = `
      <h4>${detail.id}</h4>
      <p><strong>Customer:</strong> ${detail.customer}</p>
      <p><strong>Status:</strong> <span class="status-badge ${detail.status.toLowerCase()}">${detail.status}</span></p>
      <p><strong>Total:</strong> ₹${detail.total}</p>
    `;
  }
}

function renderCustomers() {
  const list = document.getElementById('customersList');
  list.innerHTML = data.customers.map((customer) => `
    <div class="customer-card">
      <div>
        <strong>${customer.name}</strong>
        <p>${customer.email}</p>
      </div>
      <div>
        <button class="action-btn" data-action="view-customer" data-id="${customer.id}">View</button>
      </div>
    </div>
  `).join('');

  const detail = data.customers.find((customer) => customer.id === selectedCustomerId) || data.customers[0];
  if (detail) {
    document.getElementById('customerDetail').innerHTML = `
      <h4>${detail.name}</h4>
      <p><strong>Email:</strong> ${detail.email}</p>
      <p><strong>City:</strong> ${detail.city}</p>
      <p><strong>Orders:</strong> ${detail.orders}</p>
      <p><strong>Order History:</strong> ${detail.orders} recent orders</p>
    `;
  }
}

function renderReviews() {
  document.getElementById('reviewsList').innerHTML = data.reviews.map((review) => `
    <div class="review-card">
      <div class="panel-header">
        <div>
          <strong>${review.customer}</strong>
          <p>${review.product}</p>
        </div>
        <span class="status-badge ${review.status.toLowerCase() === 'approved' ? 'delivered' : 'pending'}">${review.status}</span>
      </div>
      <p>Rating: ${'★'.repeat(review.rating)}</p>
      <div class="actions">
        <button class="primary-btn" data-action="approve-review" data-id="${review.id}">Approve</button>
        <button class="ghost-btn" data-action="delete-review" data-id="${review.id}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderBanners() {
  document.getElementById('bannersList').innerHTML = data.banners.map((banner) => `
    <div class="banner-card">
      <div class="banner-thumb">${banner.image}</div>
      <h4>${banner.title}</h4>
      <p>${banner.subtitle}</p>
      <div class="actions">
        <button class="action-btn" data-action="delete-banner" data-id="${banner.id}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderCoupons() {
  document.getElementById('couponsList').innerHTML = data.coupons.map((coupon) => `
    <div class="coupon-card">
      <strong>${coupon.code}</strong>
      <p>${coupon.discount}% off • Expires ${coupon.expiry}</p>
      <div class="actions">
        <button class="action-btn" data-action="edit-coupon" data-id="${coupon.id}">Edit</button>
        <button class="action-btn" data-action="delete-coupon" data-id="${coupon.id}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderSettings() {
  const settings = data.settings;
  document.getElementById('logoInput').value = settings.logo || '';
  document.getElementById('phoneInput').value = settings.phone || '';
  document.getElementById('emailInput').value = settings.email || '';
  document.getElementById('instagramInput').value = settings.instagram || '';
  document.getElementById('facebookInput').value = settings.facebook || '';
}

function renderAll() {
  renderDashboard();
  renderProducts();
  renderCategories();
  renderOrders();
  renderCustomers();
  renderReviews();
  renderBanners();
  renderCoupons();
  renderSettings();
}

function switchSection(section) {
  activeSection = section;
  document.querySelectorAll('.content-section').forEach((sectionEl) => {
    sectionEl.classList.toggle('active', sectionEl.id === `${section}Section`);
  });
  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });
}

function resetProductForm() {
  editingProductId = null;
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
}

function resetCategoryForm() {
  editingCategoryId = null;
  document.getElementById('categoryForm').reset();
  document.getElementById('categoryId').value = '';
}

function resetCouponForm() {
  editingCouponId = null;
  document.getElementById('couponForm').reset();
  document.getElementById('couponId').value = '';
}

loginBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(authStorageKey);
  currentUser = null;
  renderSession();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  if (!emailInput.value || !passwordInput.value) return;
  const name = emailInput.value.split('@')[0].replace(/\./g, ' ');
  currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), role: roleSelect.value };
  localStorage.setItem(authStorageKey, JSON.stringify(currentUser));
  renderSession();
});

document.querySelectorAll('.nav-link, .module-card').forEach((btn) => {
  btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

document.getElementById('productForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const product = {
    id: editingProductId || Date.now(),
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: Number(document.getElementById('productPrice').value),
    description: document.getElementById('productDescription').value,
    stock: Number(document.getElementById('productStock').value),
    images: document.getElementById('productImages').value
  };

  if (editingProductId) {
    data.products = data.products.map((item) => item.id === editingProductId ? product : item);
  } else {
    data.products.push(product);
  }

  saveData();
  renderAll();
  resetProductForm();
});

document.getElementById('cancelProductBtn').addEventListener('click', resetProductForm);

document.getElementById('categoryForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = document.getElementById('categoryName').value.trim();
  if (!value) return;
  if (editingCategoryId) {
    data.categories = data.categories.map((category) => category === editingCategoryId ? value : category);
  } else {
    data.categories.push(value);
  }
  saveData();
  renderCategories();
  resetCategoryForm();
});

document.getElementById('cancelCategoryBtn').addEventListener('click', resetCategoryForm);

document.getElementById('bannerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  data.banners.unshift({
    id: Date.now(),
    title: document.getElementById('bannerTitle').value,
    subtitle: document.getElementById('bannerSubtitle').value,
    image: document.getElementById('bannerImage').value
  });
  saveData();
  renderBanners();
  event.target.reset();
});

document.getElementById('couponForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const coupon = {
    id: editingCouponId || Date.now(),
    code: document.getElementById('couponCode').value,
    discount: Number(document.getElementById('couponDiscount').value),
    expiry: document.getElementById('couponExpiry').value
  };

  if (editingCouponId) {
    data.coupons = data.coupons.map((item) => item.id === editingCouponId ? coupon : item);
  } else {
    data.coupons.push(coupon);
  }

  saveData();
  renderCoupons();
  resetCouponForm();
});

document.getElementById('cancelCouponBtn').addEventListener('click', resetCouponForm);

document.getElementById('settingsForm').addEventListener('submit', (event) => {
  event.preventDefault();
  data.settings = {
    logo: document.getElementById('logoInput').value,
    phone: document.getElementById('phoneInput').value,
    email: document.getElementById('emailInput').value,
    instagram: document.getElementById('instagramInput').value,
    facebook: document.getElementById('facebookInput').value
  };
  saveData();
  alert('Settings updated');
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  const name = button.dataset.name;

  if (action === 'view-product') {
    selectedProductId = Number(id);
    renderProducts();
  } else if (action === 'edit-product') {
    const product = data.products.find((item) => item.id === Number(id));
    if (product) {
      editingProductId = product.id;
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productStock').value = product.stock;
      document.getElementById('productImages').value = product.images;
      switchSection('products');
    }
  } else if (action === 'delete-product') {
    data.products = data.products.filter((item) => item.id !== Number(id));
    saveData();
    renderAll();
  } else if (action === 'edit-category') {
    editingCategoryId = name;
    document.getElementById('categoryId').value = name;
    document.getElementById('categoryName').value = name;
    switchSection('categories');
  } else if (action === 'delete-category') {
    data.categories = data.categories.filter((category) => category !== name);
    saveData();
    renderCategories();
  } else if (action === 'update-order-status') {
    const select = event.target;
    data.orders = data.orders.map((order) => order.id === select.dataset.id ? { ...order, status: select.value } : order);
    saveData();
    renderOrders();
  } else if (action === 'view-customer') {
    selectedCustomerId = Number(id);
    renderCustomers();
  } else if (action === 'approve-review') {
    data.reviews = data.reviews.map((review) => review.id === Number(id) ? { ...review, status: 'Approved' } : review);
    saveData();
    renderReviews();
  } else if (action === 'delete-review') {
    data.reviews = data.reviews.filter((review) => review.id !== Number(id));
    saveData();
    renderReviews();
  } else if (action === 'delete-banner') {
    data.banners = data.banners.filter((banner) => banner.id !== Number(id));
    saveData();
    renderBanners();
  } else if (action === 'edit-coupon') {
    const coupon = data.coupons.find((item) => item.id === Number(id));
    if (coupon) {
      editingCouponId = coupon.id;
      document.getElementById('couponId').value = coupon.id;
      document.getElementById('couponCode').value = coupon.code;
      document.getElementById('couponDiscount').value = coupon.discount;
      document.getElementById('couponExpiry').value = coupon.expiry;
      switchSection('coupons');
    }
  } else if (action === 'delete-coupon') {
    data.coupons = data.coupons.filter((coupon) => coupon.id !== Number(id));
    saveData();
    renderCoupons();
  }
});

renderSession();
renderAll();
