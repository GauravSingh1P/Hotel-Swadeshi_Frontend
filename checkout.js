// ===== Secure Checkout Logic =====

// Global Variables
let cart = [];
let orders = [];
let profile = { name: "Swadeshi User" };
let selectedMethod = "card";

// DOM Elements
const checkoutForm = document.getElementById("checkout-form");
const fullNameInput = document.getElementById("fullName");
const phoneNumberInput = document.getElementById("phoneNumber");
const deliveryAddressInput = document.getElementById("deliveryAddress");

// Pricing Summary Elements
const summaryItemsContainer = document.getElementById("summary-items");
const subtotalEl = document.getElementById("summary-subtotal");
const cgstEl = document.getElementById("summary-cgst");
const sgstEl = document.getElementById("summary-sgst");
const grandTotalEl = document.getElementById("summary-total");
const submitBtn = document.getElementById("submit-btn");

// Processing Modal Elements
const processingModal = document.getElementById("processing-modal");
const processingTitle = document.getElementById("processing-title");
const progressFill = document.getElementById("progress-fill");

// Toast Notification Elements
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

// Interactive Credit Card Elements
const cardView = document.getElementById("credit-card-view");
const cardNumInput = document.getElementById("cardNumber");
const cardNameInput = document.getElementById("cardName");
const cardExpiryInput = document.getElementById("cardExpiry");
const cardCvvInput = document.getElementById("cardCvv");

const cardNumDisp = document.getElementById("card-num-disp");
const cardNameDisp = document.getElementById("card-name-disp");
const cardExpiryDisp = document.getElementById("card-exp-disp");
const cardCvvDisp = document.getElementById("card-cvv-disp");

// UPI Elements
const upiIdInput = document.getElementById("upiId");

// ===== Initialize Page =====
document.addEventListener("DOMContentLoaded", () => {
    loadLocalData();
    renderOrderSummary();
    setupPaymentSelector();
    setupCreditCardSimulator();
    setupInputFilters();
});

// Load data from LocalStorage
function loadLocalData() {
    cart = JSON.parse(localStorage.getItem("swadeshi_cart")) || [];
    orders = JSON.parse(localStorage.getItem("swadeshi_orders")) || [];
    profile = JSON.parse(localStorage.getItem("swadeshi_profile")) || { name: "Swadeshi User" };
    
    // Check if cart is empty
    if (cart.length === 0) {
        showToast("Your cart is empty! Redirecting back to menu...", "error");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 2500);
        return;
    }

    // Prefill user details from profile if available
    if (profile.name) {
        fullNameInput.value = profile.name;
    }
}

// Calculate and render order details
function renderOrderSummary() {
    if (cart.length === 0) return;

    // Render items list
    summaryItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item-row">
            <div class="summary-item-info">
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-qty">Qty: ${item.quantity} × ₹${item.price}</span>
            </div>
            <span class="summary-item-price">₹${item.price * item.quantity}</span>
        </div>
    `).join("");

    // Calculate Costs
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cgst = Math.round(subtotal * 0.05); // 5% CGST
    const sgst = Math.round(subtotal * 0.05); // 5% SGST
    const delivery = 30; // Flat Delivery Partner Fee
    const grandTotal = subtotal + cgst + sgst + delivery;

    // Populate Fields
    subtotalEl.textContent = `₹${subtotal}`;
    cgstEl.textContent = `₹${cgst}`;
    sgstEl.textContent = `₹${sgst}`;
    grandTotalEl.textContent = `₹${grandTotal}`;
}

// ===== Payment Tab Handling =====
function setupPaymentSelector() {
    const tabs = document.querySelectorAll(".pay-tab");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            selectedMethod = tab.dataset.method;
            
            // Hide all sub-panels
            document.querySelectorAll(".payment-panel").forEach(panel => {
                panel.classList.remove("active");
            });
            
            // Show selected sub-panel
            const activePanel = document.getElementById(`panel-${selectedMethod}`);
            if (activePanel) {
                activePanel.classList.add("active");
            }

            // Adjust submit button text based on method
            if (selectedMethod === "cod") {
                submitBtn.innerHTML = `<span class="lock-icon">💵</span> Confirm COD Order`;
            } else {
                submitBtn.innerHTML = `<span class="lock-icon">🔒</span> Pay & Place Order`;
            }
        });
    });
}

// ===== Credit Card Live Simulator =====
function setupCreditCardSimulator() {
    // Card Number Formatting & Live Projection
    cardNumInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
        // Cap at 16 digits
        val = val.substring(0, 16);
        
        // Add spaces every 4 characters
        let formatted = "";
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += " ";
            }
            formatted += val[i];
        }
        e.target.value = formatted;
        
        // Project to visual card
        cardNumDisp.textContent = formatted || "•••• •••• •••• ••••";
    });

    // Cardholder Name Live Projection
    cardNameInput.addEventListener("input", (e) => {
        const val = e.target.value.toUpperCase();
        cardNameDisp.textContent = val || "SWADESHI GUEST";
    });

    // Expiry Date Formatting & Live Projection
    cardExpiryInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
        val = val.substring(0, 4);
        
        let formatted = "";
        if (val.length > 2) {
            formatted = val.substring(0, 2) + "/" + val.substring(2);
        } else {
            formatted = val;
        }
        e.target.value = formatted;
        
        // Project to card
        cardExpiryDisp.textContent = formatted || "MM/YY";
    });

    // CVV Live Projection & Auto Flip Action
    cardCvvInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
        val = val.substring(0, 3);
        e.target.value = val;
        
        // Project
        let masked = "";
        for (let i = 0; i < val.length; i++) {
            masked += "•";
        }
        cardCvvDisp.textContent = masked || "•••";
    });

    // Flip Card on CVV Focus
    cardCvvInput.addEventListener("focus", () => {
        cardView.classList.add("flipped");
    });

    cardCvvInput.addEventListener("blur", () => {
        cardView.classList.remove("flipped");
    });
}

// Ensure proper input filtering (numbers only where needed)
function setupInputFilters() {
    // Phone Number filter (digits only)
    phoneNumberInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
}

// ===== Form Validation =====
function validateForm() {
    // 1. Validate Core Details
    const name = fullNameInput.value.trim();
    const phone = phoneNumberInput.value.trim();
    const address = deliveryAddressInput.value.trim();

    if (!name) {
        showToast("Please enter your full name.", "error");
        fullNameInput.focus();
        return false;
    }

    if (phone.length !== 10) {
        showToast("Please enter a valid 10-digit phone number.", "error");
        phoneNumberInput.focus();
        return false;
    }

    if (!address) {
        showToast("Please enter your complete delivery address.", "error");
        deliveryAddressInput.focus();
        return false;
    }

    // 2. Validate Payment Specific Fields
    if (selectedMethod === "card") {
        const cardNum = cardNumInput.value.replace(/\s/g, "");
        const cardName = cardNameInput.value.trim();
        const cardExpiry = cardExpiryInput.value.trim();
        const cardCvv = cardCvvInput.value.trim();

        if (cardNum.length !== 16) {
            showToast("Please enter a valid 16-digit card number.", "error");
            cardNumInput.focus();
            return false;
        }

        if (!cardName) {
            showToast("Please enter the cardholder's name.", "error");
            cardNameInput.focus();
            return false;
        }

        if (cardExpiry.length !== 5 || !cardExpiry.includes("/")) {
            showToast("Please enter expiration date in MM/YY format.", "error");
            cardExpiryInput.focus();
            return false;
        }

        // Quick month validation
        const [month] = cardExpiry.split("/").map(v => parseInt(v) || 0);
        if (month < 1 || month > 12) {
            showToast("Please enter a valid month (01-12).", "error");
            cardExpiryInput.focus();
            return false;
        }

        if (cardCvv.length !== 3) {
            showToast("Please enter a valid 3-digit CVV number.", "error");
            cardCvvInput.focus();
            return false;
        }
    } else if (selectedMethod === "upi") {
        const upiId = upiIdInput.value.trim();
        if (!upiId || !upiId.includes("@")) {
            showToast("Please enter a valid UPI ID (e.g. user@okaxis).", "error");
            upiIdInput.focus();
            return false;
        }
    }

    return true;
}

// ===== Place Order & Simulated Processing =====
function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    // Open simulated processing gateway modal
    processingModal.classList.remove("hidden");
    
    // Animate progress and status text
    const statusMessages = [
        { time: 0, title: "Connecting to secure payment gateway...", progress: 20 },
        { time: 1200, title: "Authorizing transaction amount...", progress: 50 },
        { time: 2500, title: "Confirming order with Hotel Swadeshi backend...", progress: 75 },
        { time: 3700, title: "Finishing payment verification...", progress: 95 }
    ];

    statusMessages.forEach(msg => {
        setTimeout(() => {
            processingTitle.textContent = msg.title;
            progressFill.style.width = `${msg.progress}%`;
        }, msg.time);
    });

    // Complete transaction at 4500ms
    setTimeout(async () => {
        progressFill.style.width = "100%";
        
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cgst = Math.round(subtotal * 0.05);
        const sgst = Math.round(subtotal * 0.05);
        const delivery = 30;
        const total = subtotal + cgst + sgst + delivery;

        // Generate Placed Order Object
        const orderId = "ORD" + Date.now();
        const orderDate = new Date().toLocaleDateString("en-IN", { 
            day: "numeric", 
            month: "short", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        const newOrder = {
            id: orderId,
            date: orderDate,
            items: [...cart],
            total: total,
            deliveryAddress: deliveryAddressInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            paymentMethod: selectedMethod.toUpperCase(),
            customerName: fullNameInput.value.trim()
        };

        // 1. Save locally to local storage
        orders.unshift(newOrder);
        localStorage.setItem("swadeshi_orders", JSON.stringify(orders));

        // 2. Clear Cart locally
        localStorage.setItem("swadeshi_cart", JSON.stringify([]));

        // 3. Attempt async backend post for db persistence
        await saveOrdersToBackend(newOrder);

        // Hide processing card
        processingModal.classList.add("hidden");

        // Redirect back to menu dashboard with orderSuccess query
        window.location.href = "home.html?orderSuccess=true&showSection=orders";
    }, 4500);
}

// Asynchronously dispatch orders to Flask MySQL Backend for full-stack integration
async function saveOrdersToBackend(orderObj) {
    console.log("Saving order locally (static frontend mode)...", orderObj);
    // Backend API fetch has been temporarily disabled until backend is deployed
    return Promise.resolve();
}

// ===== Toast Alert helper =====
function showToast(message, type = "error") {
    toastMessage.textContent = message;
    
    // Toggle success class
    if (type === "success") {
        toast.classList.add("success");
        document.getElementById("toast-icon").innerHTML = "&#10003;"; // checkmark
    } else {
        toast.classList.remove("success");
        document.getElementById("toast-icon").innerHTML = "&#10007;"; // crossmark
    }

    toast.classList.remove("hidden");
    
    // Auto-dismiss
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 4000);
}

// Make globally accessible
window.handleFormSubmit = handleFormSubmit;
