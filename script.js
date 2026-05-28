document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SISTEMA DE CARRITO DE COMPRAS
    // ==========================================
    let cart = [];
    const btnCart = document.getElementById('btn-cart');
    const btnCloseCart = document.getElementById('btn-close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const btnEmptyCart = document.getElementById('btn-empty-cart');
    const btnCheckout = document.getElementById('btn-checkout');

    btnCart.addEventListener('click', () => cartSidebar.classList.remove('translate-x-full'));
    btnCloseCart.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

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
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = "flex items-center justify-between bg-[#262626] p-3 rounded-lg border border-gray-800";
            itemElement.innerHTML = `
                <div class="grow pr-2">
                    <h4 class="font-bold text-sm text-white truncate w-36">${item.name}</h4>
                    <p class="text-xs text-[#C5A880] font-semibold">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    <span class="text-[11px] text-gray-400">Cant: ${item.quantity}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button class="btn-decrease bg-black px-2 py-0.5 rounded text-xs text-white hover:text-[#C5A880] font-bold cursor-pointer" data-name="${item.name}">-</button>
                    <button class="btn-increase bg-black px-2 py-0.5 rounded text-xs text-white hover:text-[#C5A880] font-bold cursor-pointer" data-name="${item.name}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartCountElement.textContent = totalItems;
        cartTotalElement.textContent = `$${totalPrice.toLocaleString('es-CO')}`;
    };

    cartItemsContainer.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-name');
        if (!productName) return;
        const product = cart.find(item => item.name === productName);

        if (e.target.classList.contains('btn-increase')) {
            product.quantity++;
        } else if (e.target.classList.contains('btn-decrease')) {
            product.quantity--;
            if (product.quantity === 0) {
                cart = cart.filter(item => item.name !== productName);
            }
        }
        updateCartDOM();
    });

    // Delegación de eventos para agregar productos (funciona en carrusel y catálogo filtrado)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const card = e.target.closest('div');
            const name = card.querySelector('.product-name').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

            const existingProduct = cart.find(item => item.name === name);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartDOM();

            const originalText = e.target.textContent;
            e.target.textContent = "¡Añadido! ✓";
            setTimeout(() => { e.target.textContent = originalText; }, 800);
        }
    });

    btnEmptyCart.addEventListener('click', () => { cart = []; updateCartDOM(); });
    btnCheckout.addEventListener('click', () => {
        if (cart.length === 0) return alert("Tu carrito está vacío.");
        alert("¡Pedido procesado con éxito en FLUX! Gracias por tu compra.");
        cart = []; updateCartDOM(); cartSidebar.classList.add('translate-x-full');
    });


    // ==========================================
    // 2. LÓGICA DE FILTRADO EN TIEMPO REAL
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const filterStatus = document.getElementById('filter-status');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterValue = e.target.getAttribute('data-filter');
            
            // Actualizar el tag visual de qué filtro está activo
            filterStatus.textContent = `Viendo: ${e.target.textContent.replace('⚡ ', '')}`;

            productItems.forEach(item => {
                const brand = item.getAttribute('data-brand');
                const category = item.getAttribute('data-category');

                // Si el filtro es "all", o coincide con la marca, o coincide con la categoría
                if (filterValue === 'all' || brand === filterValue || category === filterValue) {
                    item.style.display = 'flex'; // Mostrar
                } else {
                    item.style.display = 'none'; // Ocultar
                }
            });

            // En móviles, cerrar automáticamente el menú lateral de filtros tras tocar una opción
            if (window.innerWidth < 1024) {
                document.getElementById('filters-sidebar').classList.add('translate-x-full');
            }
        });
    });

    // Controladores abrir/cerrar filtros móvil
    const btnOpenFilters = document.getElementById('btn-open-filters');
    const btnCloseFilters = document.getElementById('btn-close-filters');
    if (btnOpenFilters && btnCloseFilters) {
        btnOpenFilters.addEventListener('click', () => document.getElementById('filters-sidebar').classList.remove('translate-x-full'));
        btnCloseFilters.addEventListener('click', () => document.getElementById('filters-sidebar').classList.add('translate-x-full'));
    }


    // ==========================================
    // 3. VALIDACIÓN COMPLETA DEL FORMULARIO DE REGISTRO
    // ==========================================
    const formRegistro = document.getElementById('form-registro');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const passwordError = document.getElementById('password-error');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault(); // Detener el envío por defecto

            // Validar que las contraseñas coincidan exactamente
            if (passwordInput.value !== confirmPasswordInput.value) {
                passwordError.classList.remove('hidden'); // Mostrar error
                confirmPasswordInput.focus();
                return; // Frenar ejecución
            }

            // Si pasa la validación
            passwordError.classList.add('hidden');
            alert(`¡Registro exitoso!\nBienvenido a la comunidad FLUX.`);
            formRegistro.reset();
            switchSection('section-home'); // Regresar a la tienda
        });

        // Ocultar el mensaje de error mientras el usuario vuelve a escribir
        confirmPasswordInput.addEventListener('input', () => {
            if (passwordInput.value === confirmPasswordInput.value) {
                passwordError.classList.add('hidden');
            }
        });
    }


    // ==========================================
    // 4. MENÚ LATERAL IZQUIERDO (PRINCIPAL)
    // ==========================================
    const btnMenu = document.getElementById('btn-menu');
    const btnCloseMenu = document.getElementById('btn-close-menu');
    const sidebar = document.getElementById('sidebar');

    btnMenu.addEventListener('click', () => sidebar.classList.remove('-translate-x-full'));
    btnCloseMenu.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));


    // ==========================================
    // 5. BARRA DE BÚSQUEDA DESPLEGABLE
    // ==========================================
    const btnSearch = document.getElementById('btn-search');
    const searchBar = document.getElementById('search-bar');
    const searchInput = searchBar.querySelector('input');
    const btnDoSearch = document.getElementById('btn-do-search');

    btnSearch.addEventListener('click', () => {
        if (searchBar.classList.contains('max-h-0')) {
            searchBar.classList.remove('max-h-0');
            searchBar.classList.add('max-h-24');
            setTimeout(() => searchInput.focus(), 150);
        } else {
            searchBar.classList.remove('max-h-24');
            searchBar.classList.add('max-h-0');
        }
    });

    const ejecutarBusqueda = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query !== "") {
            searchBar.classList.remove('max-h-24');
            searchBar.classList.add('max-h-0');
            switchSection('section-deportivos'); // Lleva al catálogo total

            // Filtrar el catálogo usando el texto escrito
            productItems.forEach(item => {
                const name = item.querySelector('.product-name').textContent.toLowerCase();
                if (name.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            filterStatus.textContent = `Búsqueda: "${query}"`;
            searchInput.value = "";
        }
    };
    btnDoSearch.addEventListener('click', ejecutarBusqueda);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') ejecutarBusqueda(); });


    // ==========================================
    // 6. NAV INTERNA (SPA)
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');

    const switchSection = (targetId) => {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
                section.classList.add('block');
            } else {
                section.classList.remove('block');
                section.classList.add('hidden');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('data-target');
            switchSection(targetSection);
            sidebar.classList.add('-translate-x-full');
        });
    });


    // ==========================================
    // 7. SCROLL DEL CARRUSEL
    // ==========================================
    const carouselTrack = document.getElementById('carousel-track');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');

    if (carouselTrack && prevSlideBtn && nextSlideBtn) {
        const scrollAmount = 340;
        nextSlideBtn.addEventListener('click', () => { carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
        prevSlideBtn.addEventListener('click', () => { carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
    }
});