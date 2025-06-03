document.addEventListener('DOMContentLoaded', () => {
    // --- CART FUNCTIONALITY ---

    // Initialize cart from local storage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count in navigation
    const updateCartCount = () => {
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) { // Check if element exists
            // If your cart logic counts unique items, use cart.length
            // If your cart logic counts total quantity of items (if you implement quantity), adjust this
            cartCountEl.textContent = cart.length; // Assuming cart.length represents the number of distinct items or total if each add is a new item
        }
    };

    // Update cart display
    const updateCartDisplay = () => {
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');

        if (!cartItemsEl || !cartTotalEl) return; // Exit if cart elements don't exist

        cartItemsEl.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>';
            cartTotalEl.textContent = `Total: $0.00`;
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            // Ensure price is a number
            const itemPrice = parseFloat(item.price);
            if (!isNaN(itemPrice)) {
                total += itemPrice; // Assuming each item added is a single quantity
            }

            const cartItemDiv = document.createElement('div');
            // Tailwind classes for styling, adjust as needed to match your previous cart item style
            cartItemDiv.className = 'cart-item flex justify-between items-center bg-white p-3 my-2 rounded-lg shadow';
            cartItemDiv.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <h3 class="text-lg font-semibold">${item.name}</h3>
                        <p class="text-gray-600">$${itemPrice.toFixed(2)}</p>
                    </div>
                </div>
                <button class="remove-from-cart text-red-500 hover:text-red-700" data-index="${index}">Remove</button>
            `;
            cartItemsEl.appendChild(cartItemDiv);
        });

        cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners for new remove buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index, 10); // Ensure index is an integer
                if (!isNaN(index) && index >= 0 && index < cart.length) {
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    updateCartDisplay(); // Refresh display
                }
            });
        });
    };

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: e.target.dataset.price, // Price will be parsed in updateCartDisplay
                image: e.target.dataset.image
            };
            cart.push(item);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay(); // Refresh display, especially if user is on cart page
            alert(`${item.name} has been added to your cart!`); // Optional: give user feedback
        });
    });

    // Initial cart update on page load
    updateCartCount();
    updateCartDisplay();

    // --- BANNER SLIDER FUNCTIONALITY ---
    const slidesContainer = document.querySelector('.slider-container .slides');
    const slides = document.querySelectorAll('.slider-container .slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.querySelector('.dots-container');

    let currentIndex = 0;
    let autoSlideInterval;

    if (slides.length > 0 && slidesContainer && prevBtn && nextBtn) { // Check if slider elements exist
        const totalSlides = slides.length;

        function showSlide(index) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
        }

        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot', 'w-3', 'h-3', 'bg-white', 'bg-opacity-50', 'rounded-full', 'focus:outline-none', 'hover:bg-opacity-75', 'mx-1');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots(index) {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval); // Clear existing interval before starting a new one
            autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        if (dotsContainer) {
            createDots();
        }
        showSlide(0); // Show the first slide initially
        startAutoSlide(); // Start auto-sliding

        // Optional: Pause on hover
        const sliderElement = document.querySelector('.slider-container');
        if (sliderElement) {
            sliderElement.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderElement.addEventListener('mouseleave', startAutoSlide);
        }
    }

    // --- SMOOTH SCROLLING FOR NAVIGATION LINKS ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's a valid internal link and not just "#"
            if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                const targetId = hrefAttribute.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});