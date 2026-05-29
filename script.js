// ==========================================
// FLUX — SISTEMA INTEGRADO DE FRONTEND (2026)
// ==========================================

// 1. CREDENCIALES DE EMAILJS
// Inicializar EmailJS con tu Public Key (Asegúrate de cambiar esto con tus llaves)
(function() {
    emailjs.init({
      publicKey: "STHfQ-GkPJpsPyH9L", 
    });
})();

// 2. INVENTARIO INICIAL EXTENDIDO (Mock Data)
let products = [
  { id: 1, name: "Air Max 90 Premium", brand: "Nike", category: "Lifestyle", price: 420000, stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600", sizes: [38, 39, 40, 41, 42], color: "Rojo/Negro", gender: "Unisex" },
  { id: 2, name: "Ultraboost Light", brand: "Adidas", category: "Running", price: 580000, stock: 4, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600", sizes: [39, 40, 41, 42, 43], color: "Blanco", gender: "Hombre" },
  { id: 3, name: "Jordan 1 Retro High", brand: "Jordan", category: "Basketball", price: 750000, stock: 8, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600", sizes: [40, 41, 42, 43, 44], color: "Negro/Blanco/Rojo", gender: "Unisex" },
  { id: 4, name: "550 Vintage", brand: "New Balance", category: "Lifestyle", price: 390000, stock: 0, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=600", sizes: [38, 39, 40, 41], color: "Blanco/Verde", gender: "Unisex" },
  { id: 5, name: "RS-X Triple Black", brand: "Puma", category: "Lifestyle", price: 299000, stock: 22, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600", sizes: [39, 40, 41, 42, 43], color: "Negro", gender: "Hombre" },
  { id: 6, name: "Chuck Taylor 70", brand: "Converse", category: "Skate", price: 185000, stock: 12, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600", sizes: [36, 37, 38, 39, 40], color: "Negro/Blanco", gender: "Unisex" },
  { id: 7, name: "Old Skool Classic", brand: "Vans", category: "Skate", price: 165000, stock: 2, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600", sizes: [38, 39, 40, 41, 42], color: "Negro", gender: "Unisex" },
  { id: 8, name: "Superstar Bold", brand: "Adidas", category: "Lifestyle", price: 280000, stock: 10, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600", sizes: [36, 37, 38, 39], color: "Blanco/Negro", gender: "Mujer" }
];

// 3. ESTADOS DE LA APLICACIÓN
let cart = [];
let currentUser = null;
let activeFilters = { brand: "all", category: "all", priceRange: "all", search: "" };
let selectedSizeForDetail = null;

// ==========================================
// CONTROL DE NAVEGACIÓN Y MODALES
// ==========================================
function showSection(sectionId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openModal(modalId) {
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById(`modal-${modalId}`).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(`modal-${modalId}`).classList.add('hidden');
  if (modalId !== 'product' && modalId !== 'admin-product') {
    document.getElementById('overlay').classList.add('hidden');
  } else {
    // Si cerramos un modal secundario, verificar si quedan otros abiertos antes de ocultar el overlay
    const openModals = document.querySelectorAll('.modal:not(.hidden)');
    if (openModals.length === 0) document.getElementById('overlay').classList.add('hidden');
  }
}

function closeAll() {
  document.getElementById('overlay').classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  closeSidebar();
  closeCart();
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(() => openModal(openId), 100);
}

// Sidebars (Menú y Carrito)
function openSidebar() { document.getElementById('overlay').classList.remove('hidden'); document.getElementById('sidebar').classList.remove('-translate-x-full'); }
function closeSidebar() { document.getElementById('sidebar').classList.add('-translate-x-full'); if (!document.getElementById('cart-sidebar').classList.contains('translate-x-full')) return; }

function openCart() { document.getElementById('overlay').classList.remove('hidden'); document.getElementById('cart-sidebar').classList.remove('translate-x-full'); }
function closeCart() { document.getElementById('cart-sidebar').classList.add('translate-x-full'); if (!document.getElementById('sidebar').classList.contains('-translate-x-full')) return; }

// Toast Notification
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const msgSpan = document.getElementById('toast-msg');
  const iconSpan = document.getElementById('toast-icon');
  
  msgSpan.textContent = message;
  iconSpan.textContent = isSuccess ? "✓" : "✕";
  iconSpan.className = isSuccess ? "text-green-400 font-bold" : "text-red-400 font-bold";
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==========================================
// AUTENTICACIÓN Y ROLES (Simulado)
// ==========================================
document.getElementById('form-login').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');

  errorDiv.classList.add('hidden');

  // Validación básica de credenciales fijas
  if (email === "admin@flux.co" && password === "admin123") {
    currentUser = { email: email, role: "admin", name: "Administrador Flux" };
  } else if (email === "user@flux.co" && password === "user123") {
    currentUser = { email: email, role: "user", name: "Cliente VIP" };
  } else {
    errorDiv.textContent = "Credenciales incorrectas. Intenta con las cuentas de prueba.";
    errorDiv.classList.remove('hidden');
    return;
  }

  updateAuthUI();
  closeModal('login');
  showToast(`¡Bienvenido de vuelta, ${currentUser.name}!`);
});

document.getElementById('form-registro').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const confirmPass = document.getElementById('reg-confirm-password').value;
  const errDiv = document.getElementById('password-error');

  if (pass !== confirmPass) {
    errDiv.classList.remove('hidden');
    return;
  }
  errDiv.classList.add('hidden');

  // Integración de EmailJS para el registro
  const btnSubmit = document.getElementById('btn-register-submit');
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Procesando Registro...";

  const templateParams = {
    to_name: name,
    to_email: email,
    message: "Te has registrado exitosamente en la plataforma premium FLUX. Tu cuenta ha sido activada en menos de 1 minuto."
  };

  // REEMPLAZA CON TU SERVICE_ID Y TEMPLATE_ID DE EMAILJS
  emailjs.send('service_sij29bm', 'template_29dyeer', templateParams)
    .then(() => {
      showToast("Mensaje de bienvenida enviado al correo.");
      currentUser = { email: email, role: "user", name: name };
      updateAuthUI();
      closeModal('register');
      document.getElementById('form-registro').reset();
    })
    .catch((err) => {
      console.error("Error EmailJS:", err);
      showToast("Registro completado localmente (Error enviando correo de confirmación).", false);
      currentUser = { email: email, role: "user", name: name };
      updateAuthUI();
      closeModal('register');
    })
    .finally(() => {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Crear Cuenta";
    });
});

function logout() {
  currentUser = null;
  updateAuthUI();
  showSection('home');
  showToast("Sesión cerrada correctamente.");
}

function updateAuthUI() {
  const authNav = document.getElementById('nav-auth');
  const userNav = document.getElementById('nav-user');
  const adminBadge = document.getElementById('nav-admin-badge');
  const sidebarAdminBtn = document.getElementById('sidebar-admin-btn');
  const usernameSpan = document.getElementById('nav-username');

  if (currentUser) {
    authNav.classList.add('hidden');
    userNav.classList.remove('hidden');
    userNav.classList.add('flex');
    usernameSpan.textContent = currentUser.name.toUpperCase();

    if (currentUser.role === 'admin') {
      adminBadge.classList.remove('hidden');
      sidebarAdminBtn.classList.remove('hidden');
    } else {
      adminBadge.classList.add('hidden');
      sidebarAdminBtn.classList.add('hidden');
    }
  } else {
    authNav.classList.remove('hidden');
    userNav.classList.add('hidden');
    userNav.classList.remove('flex');
    sidebarAdminBtn.classList.add('hidden');
  }
  renderAdminTable(); // Refrescar permisos del CRUD en la tabla
}

// ==========================================
// RENDERIZADO DE CATÁLOGO Y FILTROS dinámicos
// ==========================================
function renderCatalog() {
  const catalogGrid = document.getElementById('catalog-grid');
  const featuredGrid = document.getElementById('featured-grid');
  const noResults = document.getElementById('no-results');
  const statusText = document.getElementById('catalog-status');

  // Filtrado de la lista completa
  let filtered = products.filter(p => {
    const matchBrand = activeFilters.brand === "all" || p.brand === activeFilters.brand;
    const matchCat = activeFilters.category === "all" || p.category === activeFilters.category;
    
    let matchPrice = true;
    if (activeFilters.priceRange !== "all") {
      const [min, max] = activeFilters.priceRange.split('-').map(Number);
      matchPrice = p.price >= min && p.price <= max;
    }

    const query = activeFilters.search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);

    return matchBrand && matchCat && matchPrice && matchSearch;
  });

  // Render en vista de Catálogo Principal
  catalogGrid.innerHTML = "";
  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    filtered.forEach(p => {
      catalogGrid.appendChild(createProductCard(p));
    });
  }
  statusText.textContent = `Mostrando ${filtered.length} de ${products.length} productos`;

  // Render en vista de Home (Primeros 4 Destacados)
  if(featuredGrid) {
    featuredGrid.innerHTML = "";
    products.slice(0, 4).forEach(p => {
        featuredGrid.appendChild(createProductCard(p));
    });
  }
}

function createProductCard(product) {
  const div = document.createElement('div');
  div.className = "product-card fade-up flex flex-col justify-between";
  div.onclick = () => openProductDetail(product.id);

  let stockBadge = "";
  if(product.stock === 0) stockBadge = `<span class="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Agotado</span>`;

  div.innerHTML = `
    <div class="relative img-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${stockBadge}
    </div>
    <div class="p-4 flex flex-col flex-1 justify-between">
      <div>
        <p class="mono text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">${product.brand}</p>
        <h3 class="text-white text-base tracking-wide line-clamp-1 mb-1">${product.name}</h3>
      </div>
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-[#1a1a1a]">
        <span class="mono text-sm text-var(--gold) font-medium">$${product.price.toLocaleString('es-CO')}</span>
        <span class="text-[10px] uppercase text-gray-400">${product.category}</span>
      </div>
    </div>
  `;
  return div;
}

// Lógica de Eventos en los Chips de Filtro
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    const brand = this.getAttribute('data-brand');
    const cat = this.getAttribute('data-cat');

    if (brand) {
      document.querySelectorAll('.filter-chip[data-brand]').forEach(c => c.classList.remove('active'));
      activeFilters.brand = brand;
    }
    if (cat) {
      // Toggle dinámico para categorías
      if(this.classList.contains('active')) {
         this.classList.remove('active');
         activeFilters.category = "all";
      } else {
         document.querySelectorAll('.filter-chip[data-cat]').forEach(c => c.classList.remove('active'));
         activeFilters.category = cat;
         this.classList.add('active');
         return;
      }
    }
    this.classList.add('active');
    renderCatalog();
  });
});

// Entradas de búsqueda y selectores
document.getElementById('catalog-search').addEventListener('input', function(e) {
  activeFilters.search = e.target.value;
  renderCatalog();
});

document.getElementById('filter-price').addEventListener('change', function(e) {
  activeFilters.priceRange = e.target.value;
  renderCatalog();
});

function resetFilters() {
  activeFilters = { brand: "all", category: "all", priceRange: "all", search: "" };
  document.getElementById('catalog-search').value = "";
  document.getElementById('filter-price').value = "all";
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.filter-chip[data-brand="all"]').classList.add('active');
  renderCatalog();
}

// Búsqueda Inteligente Global en el Header Navbar
const setupSearch = (inputId, dropdownId) => {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  input.addEventListener('input', function() {
    const val = this.value.trim().toLowerCase();
    if (val.length < 2) {
      dropdown.classList.add('hidden');
      return;
    }
    
    let items = products.filter(p => p.name.toLowerCase().includes(val) || p.brand.toLowerCase().includes(val));
    dropdown.innerHTML = "";
    
    if (items.length === 0) {
      dropdown.innerHTML = `<div class="p-3 text-xs text-gray-500 italic">No se encontraron modelos.</div>`;
    } else {
      items.slice(0, 5).forEach(p => {
        const item = document.createElement('div');
        item.className = "p-3 border-b border-[#1a1a1a] flex items-center gap-3 hover:bg-[var(--dark-4)] cursor-pointer transition-colors";
        item.onclick = () => {
          dropdown.classList.add('hidden');
          input.value = "";
          openProductDetail(p.id);
        };
        item.innerHTML = `
          <img src="${p.image}" class="w-8 h-8 object-cover rounded bg-neutral-800"/>
          <div>
            <p class="text-xs text-white font-medium">${p.name}</p>
            <p class="mono text-[9px] text-var(--gold)">$${p.price.toLocaleString('es-CO')}</p>
          </div>
        `;
        dropdown.appendChild(item);
      });
    }
    dropdown.classList.remove('hidden');
  });

  // Cerrar si se clickea afuera
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.add('hidden');
  });
};

setupSearch('search-input', 'search-dropdown');
setupSearch('search-input-mobile', 'search-dropdown-mobile');

// ==========================================
// VISTA DETALLE DE PRODUCTO
// ==========================================
function openProductDetail(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  selectedSizeForDetail = null;
  const content = document.getElementById('product-detail-content');

  let sizesHTML = product.sizes.map(s => `
    <button class="size-btn" onclick="selectSizeForDetail(this, ${s})">${s}</button>
  `).join('');

  if(product.sizes.length === 0) sizesHTML = `<p class="text-xs text-red-400 italic">No hay tallas configuradas</p>`;

  content.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <p class="mono text-xs text-var(--gold) uppercase tracking-widest">${product.brand} &nbsp;·&nbsp; ${product.category}</p>
        <h3 class="brand text-3xl text-white tracking-wide mt-0.5">${product.name}</h3>
      </div>
      <button onclick="closeModal('product')" class="text-gray-500 hover:text-white p-1">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="rounded-xl overflow-hidden aspect-square bg-neutral-900 border border-var(--border)">
        <img src="${product.image}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex flex-col gap-4">
          <div>
            <p class="mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Precio</p>
            <p class="brand text-4xl text-white font-medium">$${product.price.toLocaleString('es-CO')}</p>
          </div>
          <div>
            <p class="mono text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Especificaciones</p>
            <div class="text-xs text-gray-400 flex flex-col gap-1 bg-var(--dark-4) p-3 rounded-lg border border-var(--border)">
               <p><span class="text-gray-500">Color:</span> ${product.color || 'Estándar'}</p>
               <p><span class="text-gray-500">Género:</span> ${product.gender || 'Unisex'}</p>
               <p><span class="text-gray-500">Estado Stock:</span> ${product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</p>
            </div>
          </div>
          <div>
            <p class="mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">Selecciona tu talla Eur</p>
            <div class="flex flex-wrap gap-2">${sizesHTML}</div>
          </div>
        </div>
        <button onclick="addProductToCartFromDetail(${product.id})" class="btn-gold w-full mt-6 flex items-center justify-center gap-2" ${product.stock === 0 ? 'disabled' : ''}>
           🛒 Agregar Al Carrito
        </button>
      </div>
    </div>
  `;
  openModal('product');
}

function selectSizeForDetail(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSizeForDetail = size;
}

function addProductToCartFromDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  if (product.sizes.length > 0 && !selectedSizeForDetail) {
    showToast("Por favor selecciona una talla antes de agregar.", false);
    return;
  }

  // Verificar si ya existe en el carrito el mismo producto con la misma talla
  const existing = cart.find(item => item.product.id === productId && item.size === selectedSizeForDetail);
  
  if (existing) {
    if (existing.quantity >= product.stock) {
      showToast("Alcanzaste el límite del inventario disponible.", false);
      return;
    }
    existing.quantity++;
  } else {
    cart.push({ product, size: selectedSizeForDetail, quantity: 1 });
  }

  updateCartUI();
  closeModal('product');
  showToast(`Añadido: ${product.name} (Talla: ${selectedSizeForDetail || 'U'})`);
}

// ==========================================
// CONTROL DEL CARRITO DE COMPRAS
// ==========================================
function updateCartUI() {
  const itemsContainer = document.getElementById('cart-items');
  const countBadge = document.getElementById('cart-count');
  const totalSpan = document.getElementById('cart-total');

  itemsContainer.innerHTML = "";
  let total = 0;
  let itemsCount = 0;

  cart.forEach((item, index) => {
    total += item.product.price * item.quantity;
    itemsCount += item.quantity;

    const div = document.createElement('div');
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.product.image}" class="w-12 h-12 object-cover rounded bg-neutral-800 border border-var(--border)" />
      <div class="flex-1 min-w-0">
        <h4 class="text-white text-xs font-medium truncate">${item.product.name}</h4>
        <p class="mono text-[10px] text-gray-500 mt-0.5">Talla: ${item.size || 'U'} &nbsp;·&nbsp; $${item.product.price.toLocaleString('es-CO')}</p>
        <div class="flex items-center gap-2 mt-2">
           <button onclick="changeCartQty(${index}, -1)" class="w-5 h-5 bg-[#262626] rounded text-white text-xs hover:bg-neutral-700 font-bold">-</button>
           <span class="mono text-xs text-white">${item.quantity}</span>
           <button onclick="changeCartQty(${index}, 1)" class="w-5 h-5 bg-[#262626] rounded text-white text-xs hover:bg-neutral-700 font-bold">+</button>
        </div>
      </div>
      <button onclick="removeCartItem(${index})" class="text-gray-600 hover:text-red-400 p-1 transition-colors" aria-label="Eliminar">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    `;
    itemsContainer.appendChild(div);
  });

  totalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
  
  if (itemsCount > 0) {
    countBadge.textContent = itemsCount;
    countBadge.classList.remove('hidden');
  } else {
    countBadge.classList.add('hidden');
    itemsContainer.innerHTML = `<div class="text-center py-12 text-xs text-gray-600 uppercase tracking-widest italic">El carrito está vacío.</div>`;
  }
}

function changeCartQty(index, change) {
  const item = cart[index];
  const targetQty = item.quantity + change;

  if (targetQty <= 0) {
    removeCartItem(index);
    return;
  }

  if (change > 0 && targetQty > item.product.stock) {
    showToast("Máximo stock disponible alcanzado.", false);
    return;
  }

  item.quantity = targetQty;
  updateCartUI();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartUI();
  showToast("Producto removido del carrito.");
}

document.getElementById('btn-empty-cart').addEventListener('click', () => {
  if(cart.length === 0) return;
  cart = [];
  updateCartUI();
  showToast("Carrito vaciado.");
});

document.getElementById('btn-checkout').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Tu carrito está vacío.", false);
    return;
  }
  // Aquí reducirías el stock globalmente en una app real al procesar la compra
  cart.forEach(item => {
    const p = products.find(prod => prod.id === item.product.id);
    if(p) p.stock = Math.max(0, p.stock - item.quantity);
  });

  cart = [];
  updateCartUI();
  renderCatalog();
  renderAdminTable();
  closeCart();
  showToast("¡Pedido completado con éxito! Gracias por comprar en Flux.");
});

// ==========================================
// FORMULARIO DE CONTACTO (EmailJS)
// ==========================================
document.getElementById('form-contact').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-contact-submit');
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;

  btn.disabled = true;
  btn.textContent = "Enviando Mensaje...";

  const templateParams = {
    from_name: name,
    reply_to: email,
    subject: subject,
    message: message
  };

  // REEMPLAZA CON TU SERVICE_ID Y TU TEMPLATE_ID DE CONTACTO DE EMAILJS
  emailjs.send('service_sij29bm', 'template_29dyeer', templateParams)
    .then(() => {
       showToast("Mensaje enviado de forma segura.");
       document.getElementById('form-contact').reset();
    })
    .catch((err) => {
       console.error("Error al enviar mensaje:", err);
       showToast("Error en el servidor de EmailJS al enviar.", false);
    })
    .finally(() => {
       btn.disabled = false;
       btn.textContent = "Enviar Mensaje";
    });
});

// ==========================================
// CRUD ADMINISTRACIÓN — CONTROL DE INVENTARIO
// ==========================================
function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  const totalProducts = document.getElementById('admin-total-products');
  const totalStock = document.getElementById('admin-total-stock');
  const lowStock = document.getElementById('admin-low-stock');
  const outStock = document.getElementById('admin-out-stock');
  const countText = document.getElementById('admin-count');

  if (!tbody) return;

  // Si no está logueado el admin, bloquear la renderización de datos sensibles
  if (!currentUser || currentUser.role !== 'admin') {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-xs text-red-400 font-medium tracking-widest uppercase">⚠️ Acceso Restringido: Inicie sesión como Administrador</td></tr>`;
    totalProducts.textContent = "-"; totalStock.textContent = "-"; lowStock.textContent = "-"; outStock.textContent = "-"; countText.textContent = "";
    return;
  }

  const query = document.getElementById('admin-search').value.trim().toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));

  // Calcular métricas analíticas del inventario
  let tStock = 0; let lStock = 0; let oStock = 0;
  products.forEach(p => {
    tStock += Number(p.stock);
    if (p.stock === 0) oStock++;
    else if (p.stock <= 5) lStock++;
  });

  totalProducts.textContent = products.length;
  totalStock.textContent = tStock;
  lowStock.textContent = lStock;
  outStock.textContent = oStock;
  countText.textContent = `Filtrados: ${filtered.length} ítems`;

  tbody.innerHTML = "";
  filtered.forEach(p => {
    let badgeClass = "stock-ok";
    let badgeText = `${p.stock} uds`;
    if (p.stock === 0) { badgeClass = "stock-out"; badgeText = "Agotado"; }
    else if (p.stock <= 5) { badgeClass = "stock-low"; badgeText = `${p.stock} Bajo`; }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="flex items-center gap-3">
          <img src="${p.image}" class="w-8 h-8 object-cover rounded bg-neutral-800 border border-[#222]" />
          <span class="font-medium text-white">${p.name}</span>
        </div>
      </td>
      <td class="mono text-xs">${p.brand}</td>
      <td class="text-gray-400 text-xs">${p.category}</td>
      <td class="mono text-xs font-semibold text-(--gold)">$${p.price.toLocaleString('es-CO')}</td>
      <td class="text-xs text-gray-500 max-w-[120] truncate">${p.sizes.join(', ') || 'Ninguna'}</td>
      <td><span class="${badgeClass}">${badgeText}</span></td>
      <td>
        <div class="flex items-center gap-2">
          <button onclick="openProductModal(${p.id})" class="text-xs bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-2 py-1 rounded border border-var(--border) transition-colors">Editar</button>
          <button onclick="deleteProduct(${p.id})" class="text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-2 py-1 rounded border border-red-900/50 transition-colors">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('admin-search').addEventListener('input', renderAdminTable);

// Abrir Modal CRUD (Nuevo o Editar)
function openProductModal(id = null) {
  const form = document.getElementById('form-admin-product');
  form.reset();
  document.getElementById('ap-id').value = "";
  const title = document.getElementById('admin-form-title');

  if (id) {
    title.textContent = "EDITAR PRODUCTO";
    const p = products.find(prod => prod.id === id);
    if(p) {
      document.getElementById('ap-id').value = p.id;
      document.getElementById('ap-name').value = p.name;
      document.getElementById('ap-brand').value = p.brand;
      document.getElementById('ap-category').value = p.category;
      document.getElementById('ap-price').value = p.price;
      document.getElementById('ap-stock').value = p.stock;
      document.getElementById('ap-image').value = p.image;
      document.getElementById('ap-sizes').value = p.sizes.join(', ');
      document.getElementById('ap-color').value = p.color || "";
      document.getElementById('ap-gender').value = p.gender || "Unisex";
    }
  } else {
    title.textContent = "NUEVO PRODUCTO";
  }
  openModal('admin-product');
}

// Envío del Formulario CRUD (Creación y Modificación)
document.getElementById('form-admin-product').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('ap-id').value;
  const name = document.getElementById('ap-name').value.trim();
  const brand = document.getElementById('ap-brand').value;
  const category = document.getElementById('ap-category').value;
  const price = Number(document.getElementById('ap-price').value);
  const stock = Number(document.getElementById('ap-stock').value);
  let image = document.getElementById('ap-image').value.trim();
  const sizesRaw = document.getElementById('ap-sizes').value;
  const color = document.getElementById('ap-color').value.trim();
  const gender = document.getElementById('ap-gender').value;

  if(!image) image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"; // Fallback img
  
  // Procesar array de tallas
  const sizes = sizesRaw ? sizesRaw.split(',').map(s => Number(s.trim())).filter(s => !isNaN(s) && s > 0) : [];

  if (id) {
    // Editar
    const index = products.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], name, brand, category, price, stock, image, sizes, color, gender };
      showToast("Producto actualizado en el inventario.");
    }
  } else {
    // Crear
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({ id: newId, name, brand, category, price, stock, image, sizes, color, gender });
    showToast("Nuevo producto añadido correctamente.");
  }

  closeModal('admin-product');
  renderCatalog();
  renderAdminTable();
});

// Eliminar Producto del Inventario
function deleteProduct(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto permanentemente del catálogo?")) {
    products = products.filter(p => p.id !== id);
    // Limpiar del carrito si estaba agregado
    cart = cart.filter(item => item.product.id !== id);
    
    updateCartUI();
    renderCatalog();
    renderAdminTable();
    showToast("Producto eliminado de la base de datos.");
  }
}

// ==========================================
// ASIGNACIÓN DE BOTONES Y LISTENERS DEL DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Manejadores Navbar y Sidebars
  document.getElementById('btn-menu').addEventListener('click', openSidebar);
  document.getElementById('btn-close-menu').addEventListener('click', closeSidebar);
  document.getElementById('btn-cart').addEventListener('click', openCart);
  document.getElementById('btn-close-cart').addEventListener('click', closeCart);

  // Toggle Búsqueda Móvil
  document.getElementById('btn-mobile-search').addEventListener('click', () => {
    const bar = document.getElementById('mobile-search-bar');
    bar.classList.toggle('hidden');
  });

  // Carga Inicial del Catálogo y Estado
  renderCatalog();
  updateAuthUI();
});