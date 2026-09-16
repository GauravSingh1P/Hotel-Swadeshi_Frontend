let foodData = [];


  





// ===== Sample Reviews Data =====
const reviewsData = [
    { id: 1, username: "Rajesh Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh", text: "Absolutely delicious! The flavors remind me of my grandmother's cooking. Will order again!" },
    { id: 2, username: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", text: "Perfect spice level and authentic taste. This is what real Indian food should taste like." },
    { id: 3, username: "Amit Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit", text: "Fresh ingredients and excellent portion size. My whole family loved it!" },
    { id: 4, username: "Sneha Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha", text: "The aroma itself was enough to make my mouth water. Truly a Swadeshi masterpiece!" },
    { id: 5, username: "Vikram Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram", text: "Been ordering for months now. Consistency in quality is what keeps me coming back." },
    { id: 6, username: "Ananya Reddy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya", text: "Restaurant quality food delivered to my doorstep. Can't ask for more!" },
    { id: 7, username: "Rohit Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit", text: "The perfect blend of traditional recipes with modern presentation. Loved every bite!" },
    { id: 8, username: "Kavitha Nair", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavitha", text: "This takes me back to my hometown. Authentic flavors that warm the soul." },
    { id: 9, username: "Sanjay Joshi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sanjay", text: "My go-to for special occasions. Never disappoints!" },
    { id: 10, username: "Meera Iyer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera", text: "The attention to detail in every dish is remarkable. True Swadeshi pride!" }
];

// ===== Application State =====
let cart = JSON.parse(localStorage.getItem('swadeshi_cart')) || [];
let orders = JSON.parse(localStorage.getItem('swadeshi_orders')) || [];
let profile = JSON.parse(localStorage.getItem('swadeshi_profile')) || {
    name: 'Swadeshi User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=swadeshi'
};
const panelHideTimers = new Map();
let panelOverlayHideTimer = null;
let currentFilters = {
    type: 'all',
    price: 'all',
    sort: 'default',
    search: ''
};
let currentFoodId = null;
let cartIntroToastShown = false;

// ===== DOM Elements =====
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const panelOverlay = document.getElementById('panel-overlay');
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const foodGrid = document.getElementById('food-grid');
const foodModal = document.getElementById('food-modal');
const searchInput = document.getElementById('search-input');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');


// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('api/food.json');
        if (response.ok) {
            foodData = await response.json();
        } else {
            console.error('Failed to load food data');
            throw new Error('Fallback to local data');
        }
    } catch (error) {
        console.error('Error fetching food data:', error);
        // Fallback for when opened via file:// protocol
        foodData = [
            { "id": 1, "name": "Masala Dosa", "price": 120, "type": "veg", "description": "Crispy rice crepe filled with spiced potato curry.", "ingredients": "Rice batter, potatoes, onions, spices, ghee.", "image": "public/images/masala_dosa.png", "popular": true, "popularity": 95 },
            { "id": 2, "name": "Butter Chicken", "price": 350, "type": "non-veg", "description": "Tender chicken cooked in a rich and creamy tomato-butter sauce.", "ingredients": "Chicken, tomatoes, butter, cream, Indian spices.", "image": "public/images/butter_chicken.png", "popular": true, "popularity": 98 },
            { "id": 3, "name": "Paneer Tikka", "price": 220, "type": "veg", "description": "Marinated cottage cheese cubes grilled to perfection.", "ingredients": "Paneer, yogurt, bell peppers, onions, tikka spices.", "image": "public/images/paneer_tikka.png", "popular": false, "popularity": 85 },
            { "id": 4, "name": "Hyderabadi Biryani", "price": 280, "type": "non-veg", "description": "Fragrant basmati rice slow-cooked with marinated chicken and aromatic spices.", "ingredients": "Basmati rice, chicken, yogurt, saffron, biryani spices.", "image": "public/images/hyderabadi_biryani.png", "popular": true, "popularity": 99 },
            { "id": 5, "name": "Dal Makhani", "price": 180, "type": "veg", "description": "Slow-cooked black lentils and kidney beans enriched with butter and cream.", "ingredients": "Black lentils, kidney beans, butter, cream, spices.", "image": "public/images/dal_makhani.png", "popular": false, "popularity": 88 },
            { "id": 6, "name": "Mutton Rogan Josh", "price": 450, "type": "non-veg", "description": "Aromatic lamb dish of Persian origin.", "ingredients": "Mutton, yogurt, Kashmiri chilies, spices.", "image": "public/images/mutton_rogan_josh.png", "popular": false, "popularity": 80 },
            { "id": 7, "name": "Chole Bhature", "price": 150, "type": "veg", "description": "Spicy chickpea curry served with fried bread.", "ingredients": "Chickpeas, spices, maida flour, onions, tomatoes.", "image": "public/images/chole_bhature.png", "popular": true, "popularity": 90 },
            { "id": 8, "name": "Tandoori Roti", "price": 30, "type": "veg", "description": "Traditional Indian flatbread.", "ingredients": "Whole wheat flour, water, salt.", "image": "public/images/tandoori_roti.png", "popular": false, "popularity": 70 },
            { "id": 9, "name": "Chicken Tikka Masala", "price": 380, "type": "non-veg", "description": "Roasted chicken chunks in a spicy curry sauce.", "ingredients": "Chicken, yogurt, spices, tomato puree, cream.", "image": "public/images/chicken_tikka_masala.png", "popular": true, "popularity": 92 },
            { "id": 10, "name": "Gulab Jamun", "price": 80, "type": "veg", "description": "Deep-fried milk dumplings soaked in rose-scented sugar syrup.", "ingredients": "Milk solids, flour, sugar, rose water, cardamom.", "image": "public/images/gulab_jamun.png", "popular": true, "popularity": 96 }
        ];
    }
    renderFoodCards();
    updateCartCount();
    loadProfile();
    setupEventListeners();
    checkOrderSuccess();
});


// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Sidebar toggle
    menuToggle.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarFn);
    sidebarOverlay.addEventListener('click', closeSidebarFn);

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            openPanel(section);
        });
    });

    // Close panels
    document.querySelectorAll('.close-panel').forEach(btn => {
        btn.addEventListener('click', closeAllPanels);
    });
    panelOverlay.addEventListener('click', closeAllPanels);

    // Food modal
    document.getElementById('close-modal').addEventListener('click', closeFoodModal);
    foodModal.addEventListener('click', function(e) {
        if (e.target === this) closeFoodModal();
    });

    // Search
    searchInput.addEventListener('input', function() {
        currentFilters.search = this.value.toLowerCase();
        renderFoodCards();
    });

    // Type filter buttons
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilters.type = this.dataset.filter;
            renderFoodCards();
        });
    });

    // Price filter
    document.getElementById('price-filter').addEventListener('change', function() {
        currentFilters.price = this.value;
        renderFoodCards();
    });

    // Popularity/Sort filter
    document.getElementById('popularity-filter').addEventListener('change', function() {
        currentFilters.sort = this.value;
        renderFoodCards();
    });

    // Modal add to cart
    document.getElementById('modal-add-cart').addEventListener('click', function() {
        if (currentFoodId) {
            addToCart(currentFoodId);
        }
    });

    // Refresh reviews
    document.getElementById('refresh-reviews').addEventListener('click', function() {
        if (currentFoodId) {
            loadReviews(currentFoodId, true);
        }
    });

    // Profile
    document.getElementById('edit-profile-btn').addEventListener('click', showProfileEdit);
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);

    // Header cart
    document.getElementById('header-cart').addEventListener('click', function() {
        openPanel('cart', { delayMs: 0 });
    });

    // Place order
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);

    // Clear Orders
    const clearOrdersBtn = document.getElementById('clear-orders-btn');
    if (clearOrdersBtn) {
        clearOrdersBtn.addEventListener('click', function() {
            orders = [];
            localStorage.setItem('swadeshi_orders', JSON.stringify([]));
            renderOrders();
            showToast('Order history cleared successfully!');
        });
    }
}

// ===== Sidebar Functions =====
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    sidebarOverlay.classList.remove('hidden');
}

function closeSidebarFn() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
}

// ===== Panel Functions =====
function openPanel(section, options = {}) {
    const delayMs = typeof options.delayMs === 'number' ? options.delayMs : 300;

    closeAllPanels();
    if (sidebar.classList.contains('open')) {
        closeSidebarFn();
    }
    
    const panel = document.getElementById(`${section}-panel`);
    if (panel) {
        const prevTimer = panelHideTimers.get(panel);
        if (prevTimer) clearTimeout(prevTimer);

        setTimeout(() => {
            const prevTimerInner = panelHideTimers.get(panel);
            if (prevTimerInner) clearTimeout(prevTimerInner);

            if (panelOverlayHideTimer) {
                clearTimeout(panelOverlayHideTimer);
                panelOverlayHideTimer = null;
            }

            // Unhide first, then apply the transform class next frame
            panel.classList.remove('hidden');
            panelOverlay.classList.remove('hidden');
            // Force a reflow so the transition can run (display:none -> transform)
            void panel.offsetWidth;
            void panelOverlay.offsetWidth;

            requestAnimationFrame(() => {
                panel.classList.add('show');
                panelOverlay.classList.add('show');
            });
            
            if (section === 'cart') renderCart();
            if (section === 'orders') renderOrders();
        }, delayMs);
    }
}

function closeAllPanels() {
    document.querySelectorAll('.content-panel').forEach(panel => {
        const prevTimer = panelHideTimers.get(panel);
        if (prevTimer) clearTimeout(prevTimer);

        panel.classList.remove('show');

        const t = setTimeout(() => {
            // Only hide if it wasn't reopened in the meantime
            if (!panel.classList.contains('show')) {
                panel.classList.add('hidden');
            }
            panelHideTimers.delete(panel);
        }, 300);
        panelHideTimers.set(panel, t);
    });
    panelOverlay.classList.remove('show');
    if (panelOverlayHideTimer) clearTimeout(panelOverlayHideTimer);
    panelOverlayHideTimer = setTimeout(() => {
        if (!panelOverlay.classList.contains('show')) {
            panelOverlay.classList.add('hidden');
        }
        panelOverlayHideTimer = null;
    }, 300);
}

// ===== Food Cards Rendering =====
function renderFoodCards() {
    const filteredFoods = filterFoods();
    console.log("rendering", filteredFoods);
    const noResults = document.getElementById('no-results');
    
    if (filteredFoods.length === 0) {
        foodGrid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    console.log(filteredFoods);

    foodGrid.innerHTML = filteredFoods.map(food => createFoodCard(food)).join('');
    console.log(foodGrid.innerHTML);
    
    // Add event listeners to cards
    document.querySelectorAll('.food-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('food-card-add-btn')) {
                openFoodModal(parseInt(this.dataset.id));
            }
        });
    });
    
    // Add event listeners to add buttons
    document.querySelectorAll('.food-card-add-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(parseInt(this.dataset.id));
        });
    });
}

function createFoodCard(food) {
    return `
        <div class="food-card" data-id="${food.id}">
            <div class="food-card-image">
                <img src="${food.image}" alt="${food.name}">
                <div class="food-type-indicator ${food.type}"></div>
                ${food.popular ? '<span class="popularity-badge">Popular</span>' : ''}
            </div>
            <div class="food-card-content">
                <h3 class="food-card-name">${food.name}</h3>
                <p class="food-card-type">${food.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                <div class="food-card-footer">
                    <span class="food-card-price">&#8377;${food.price}</span>
                    <button class="food-card-add-btn" data-id="${food.id}">Add</button>
                </div>
            </div>
        </div>
    `;
}

function filterFoods() {
    let filtered = [...foodData];
    
    // Type filter
    if (currentFilters.type !== 'all') {
        filtered = filtered.filter(f => f.type === currentFilters.type);
    }
    
    // Price filter
    if (currentFilters.price !== 'all') {
        const [min, max] = currentFilters.price.split('-').map(v => v === '+' ? Infinity : parseInt(v) || 0);
        filtered = filtered.filter(f => {
            if (currentFilters.price === '500+') return f.price > 500;
            return f.price >= min && f.price <= (max || Infinity);
        });
    }
    
    // Search filter
    if (currentFilters.search) {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(currentFilters.search));
    }
    
    // Sort
    switch (currentFilters.sort) {
        case 'popular':
            filtered.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
    }
    
    return filtered;
}

// ===== Food Modal Functions =====
function openFoodModal(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;
    
    currentFoodId = foodId;
    
    document.getElementById('modal-food-image').src = food.image;
    document.getElementById('modal-food-name').textContent = food.name;
    document.getElementById('modal-food-type').textContent = food.type === 'veg' ? 'Veg' : 'Non-Veg';
    document.getElementById('modal-food-type').className = `food-type-badge ${food.type}`;
    document.getElementById('modal-food-price').innerHTML = `&#8377;${food.price}`;
    document.getElementById('modal-food-description').textContent = food.description;
    document.getElementById('modal-food-ingredients').textContent = food.ingredients;
    
    loadReviews(foodId);
    
    foodModal.classList.add('show');
    foodModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeFoodModal() {
    foodModal.classList.remove('show');
    setTimeout(() => foodModal.classList.add('hidden'), 300);
    document.body.style.overflow = '';
    currentFoodId = null;
}

// ===== Reviews Functions =====
function loadReviews(foodId, refresh = false) {
    const container = document.getElementById('reviews-container');
    const refreshBtn = document.getElementById('refresh-reviews');
    
    if (refresh) {
        refreshBtn.classList.add('loading');
    }
    
    // Simulate API call with random delay
    const delay = refresh ? 800 : 300;
    
    setTimeout(() => {
        // Get random subset of reviews
        const shuffled = [...reviewsData].sort(() => Math.random() - 0.5);
        const reviews = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));
        
        container.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar-wrap">
                        <img src="${review.avatar}" alt="${review.username}" class="review-avatar">
                    </div>
                    <p class="review-username">${review.username} <span class="review-says">says</span></p>
                </div>
                <p class="review-text">"${review.text}"</p>
            </div>
        `).join('');
        
        refreshBtn.classList.remove('loading');
    }, delay);
}

// ===== Cart Functions =====
function addToCart(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;
    
    const existingItem = cart.find(item => item.id === foodId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();

    if (!cartIntroToastShown) {
        cartIntroToastShown = true;
        showToastHtml(
            'Item added to cart successfully. Please proceed to order section to place order. You can also manage selected items anytime in <strong>My Cart</strong> and <strong>My Orders</strong>.'
        );
    }
}

function removeFromCart(foodId) {
    cart = cart.filter(item => item.id !== foodId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(foodId, change) {
    const item = cart.find(i => i.id === foodId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(foodId);
        return;
    }
    
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('swadeshi_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = [
        document.getElementById('cart-count'),
        document.getElementById('header-cart-count')
    ];
    
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = count;
            if (count > 0) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const cartFooter = document.getElementById('cart-footer');
    
    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon" aria-hidden="true">
                    <svg class="icon icon-lg"><use href="#i-bag" /></svg>
                </span>
                <p>Cart is empty.</p>
            </div>
        `;
        cartFooter.classList.add('hidden');
        return;
    }
    
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">&#8377;${item.price * item.quantity}</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-amount').innerHTML = `&#8377;${total}`;
    cartFooter.classList.remove('hidden');
}

// ===== Orders Functions =====
function placeOrder() {
    if (cart.length === 0) return;
    window.location.href = "checkout.html";
}

function checkOrderSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('orderSuccess') === 'true') {
        // Clear parameters from URL without reloading
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Open the My Orders panel
        setTimeout(() => {
            openPanel('orders', { delayMs: 100 });
            showToastHtml('🎉 <strong>Order Placed Successfully!</strong> Your authentic Swadeshi meal is being prepared with love.');
        }, 500);
    }
}

function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    const clearBtn = document.getElementById('clear-orders-btn');
    
    if (orders.length === 0) {
        if (clearBtn) clearBtn.classList.add('hidden');
        ordersList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon" aria-hidden="true">
                    <svg class="icon icon-lg"><use href="#i-package" /></svg>
                </span>
                <p>Place an order to see it here.</p>
            </div>
        `;
        return;
    }
    
    if (clearBtn) clearBtn.classList.remove('hidden');
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-food-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>&#8377;${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span>Total</span>
                <span>&#8377;${order.total}</span>
            </div>
        </div>
    `).join('');
}

// ===== Profile Functions =====
function loadProfile() {
    document.getElementById('display-name').textContent = profile.name;
    document.getElementById('swadeshi-name').value = profile.name;
    document.getElementById('profile-avatar').src = profile.avatar;
}

function showProfileEdit() {
    document.getElementById('name-display').classList.add('hidden');
    document.getElementById('name-edit').classList.remove('hidden');
}

function saveProfile() {
    const newName = document.getElementById('swadeshi-name').value.trim();
    
    if (newName) {
        profile.name = newName;
        localStorage.setItem('swadeshi_profile', JSON.stringify(profile));
        document.getElementById('display-name').textContent = newName;
    }
    
    document.getElementById('name-edit').classList.add('hidden');
    document.getElementById('name-display').classList.remove('hidden');
    showToast('Username Updated successfully!');
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        profile.avatar = event.target.result;
        localStorage.setItem('swadeshi_profile', JSON.stringify(profile));
        document.getElementById('profile-avatar').src = profile.avatar;
        showToast('Profile picture updated!');
    };
    reader.readAsDataURL(file);
}

// ===== Toast Function =====
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 4000);
}

function showToastHtml(html) {
    toastMessage.innerHTML = html;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 5000);
}

// Make functions globally available for inline onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
