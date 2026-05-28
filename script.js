document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIGURACIÓN DE TU EMAILJS 
    // ==========================================
    emailjs.init("STHfQ-GkPJpsPyH9L"); 


    // ==========================================
    // VALIDADOR DE FORMULARIO & ENVÍO DE EMAIL
    // ==========================================
    const formRegistro = document.getElementById('form-registro');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const passwordError = document.getElementById('password-error');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Validar contraseñas coincidentes
            if (passwordInput.value !== confirmPasswordInput.value) {
                passwordError.classList.remove('hidden');
                confirmPasswordInput.focus();
                return;
            }
            passwordError.classList.add('hidden');

            // 2. Mapear parámetros idénticos a los tags {{}} de tu imagen de EmailJS
            const templateParams = {
                user_name: document.getElementById('reg-name').value,
                user_email: document.getElementById('reg-email').value,
                user_age: document.getElementById('reg-age').value,
                user_phone: document.getElementById('reg-phone').value
            };

            const btnSubmit = formRegistro.querySelector('button[type="submit"]');
            btnSubmit.textContent = "ENVIANDO CORREO...";
            btnSubmit.disabled = true;

            // 3. Lanzar la petición de EmailJS
            
            emailjs.send("service_sij29bm", "template_29dyeer", templateParams)
                .then((response) => {
                    alert(`¡Registro exitoso!\nBienvenido a FLUX STORES. Se envió un correo de confirmación a: ${templateParams.user_email}`);
                    formRegistro.reset();
                    switchSection('section-home');
                })
                .catch((error) => {
                    console.error('Error al enviar el correo:', error);
                    alert('Tu registro fue exitoso, pero ocurrió un problema al conectar con el servidor de correos.');
                })
                .finally(() => {
                    btnSubmit.textContent = "CONFIRMAR";
                    btnSubmit.disabled = false;
                });
        });

        confirmPasswordInput.addEventListener('input', () => {
            if (passwordInput.value === confirmPasswordInput.value) {
                passwordError.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // CARRETILLA DE COMPRAS INTELIGENTE
    // ==========================================
    let cart = [];
    const btnCart = document.getElementById('btn-cart');
    const btnCloseCart = document.getElementById('btn-close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    if (btnCart) btnCart.addEventListener('click', () => cartSidebar.classList.remove('translate-x-full'));
    if (btnCloseCart) btnCloseCart.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

    const updateCartDOM = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-400 text-center py-8">Tu carrito está vacío.</p>';
            cartTotalElement.textContent = '$0';
            cartCountElement.textContent = '0';
            cartCountElement.classList.add('hidden');
            return;
        }
        cartCountElement.classList.remove('hidden');
        let totalItems = 0, totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = "flex items-center justify-between bg-[#262626] p-3 rounded-lg border border-gray-800";
            div.innerHTML = `
                <div class="grow pr-2">
                    <h4 class="font-bold text-sm text-white truncate w-36">${item.name}</h4>
                    <p class="text-xs text-[#C5A880] font-semibold">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    <span class="text-[11px] text-gray-400">Cant: ${item.quantity}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button class="btn-decrease bg-black px-2 py-0.5 rounded text-xs text-white font-bold cursor-pointer" data-name="${item.name}">-</button>
                    <button class="btn-increase bg-black px-2 py-0.5 rounded text-xs text-white font-bold cursor-pointer" data-name="${item.name}">+</button>
                </div>`;
            cartItemsContainer.appendChild(div);
        });
        cartCountElement.textContent = totalItems;
        cartTotalElement.textContent = `$${totalPrice.toLocaleString('es-CO')}`;
    };

    cartItemsContainer.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-name');
        if (!productName) return;
        const product = cart.find(item => item.name === productName);
        if (e.target.classList.contains('btn-increase')) product.quantity++;
        else if (e.target.classList.contains('btn-decrease')) {
            product.quantity--;
            if (product.quantity === 0) cart = cart.filter(item => item.name !== productName);
        }
        updateCartDOM();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const card = e.target.closest('div');
            const name = card.querySelector('.product-name').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
            const exist = cart.find(item => item.name === name);
            if (exist) exist.quantity++; else cart.push({ name, price, quantity: 1 });
            updateCartDOM();
            const prev = e.target.textContent;
            e.target.textContent = "¡Añadido! ✓";
            setTimeout(() => e.target.textContent = prev, 800);
        }
    });

    document.getElementById('btn-empty-cart').addEventListener('click', () => { cart = []; updateCartDOM(); });
    document.getElementById('btn-checkout').addEventListener('click', () => {
        if (cart.length === 0) return alert("Tu carrito está vacío.");
        alert("¡Pedido completado con éxito!");
        cart = []; updateCartDOM(); cartSidebar.classList.add('translate-x-full');
    });

    // ==========================================
    // SISTEMA DE FILTRADO DE COMPONENTES
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const filterStatus = document.getElementById('filter-status');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.target.getAttribute('data-filter');
            filterStatus.textContent = `Filtro: ${e.target.textContent.replace('⚡ ', '')}`;
            productItems.forEach(item => {
                const brand = item.getAttribute('data-brand');
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || brand === filterValue || category === filterValue) item.style.display = 'flex';
                else item.style.display = 'none';
            });
        });
    });

    // ==========================================
    // INTERFACES Y MENÚ SINGLE PAGE APPLICATION (SPA)
    // ==========================================
    const sidebar = document.getElementById('sidebar');
    document.getElementById('btn-menu').addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    document.getElementById('btn-close-menu').addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');
    const switchSection = (targetId) => {
        sections.forEach(sec => {
            if (sec.id === targetId) { sec.classList.remove('hidden'); sec.classList.add('block'); }
            else { sec.classList.remove('block'); sec.classList.add('hidden'); }
        });
    };
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            switchSection(e.target.getAttribute('data-target'));
            sidebar.classList.add('-translate-x-full');
        });
    });

    // BARRA DE BÚSQUEDA
    const searchBar = document.getElementById('search-bar');
    document.getElementById('btn-search').addEventListener('click', () => {
        searchBar.classList.toggle('max-h-0');
        searchBar.classList.toggle('max-h-24');
    });

    // CARRUSEL COMPORTAMIENTO
    const track = document.getElementById('carousel-track');
    if (track) {
        document.getElementById('next-slide').addEventListener('click', () => track.scrollBy({ left: 340, behavior: 'smooth' }));
        document.getElementById('prev-slide').addEventListener('click', () => track.scrollBy({ left: -340, behavior: 'smooth' }));
    }
});