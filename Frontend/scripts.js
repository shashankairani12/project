// Function to format card number input
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    input.value = value;
}

// Mock Data for sessionStorage if not set
if (!sessionStorage.getItem("cart")) {
    const mockCart = {
        "Burger": { price: 120, quantity: 2 },
        "Pizza": { price: 300, quantity: 1 },
        "Cold Coffee": { price: 150, quantity: 2 }
    };

    const mockOrderSummary = {
        subtotal: 720,
        tax: 129.6, // 18% GST
        discount: 72, // 10% discount
        total: 777.6
    };

    const mockUserDetails = {
        name: "John Doe",
        email: "johndoe@example.com",
        address: "123, Baker Street, London"
    };

    sessionStorage.setItem("cart", JSON.stringify(mockCart));
    sessionStorage.setItem("orderSummary", JSON.stringify(mockOrderSummary));
    sessionStorage.setItem("userDetails", JSON.stringify(mockUserDetails));
}

// Retrieve data from sessionStorage
const cart = JSON.parse(sessionStorage.getItem("cart")) || {};
const orderSummary = JSON.parse(sessionStorage.getItem("orderSummary")) || {};
const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};

// Function to generate and display receipt
function generateReceipt() {
    const receiptSection = document.getElementById("receipt-container");
    receiptSection.innerHTML = "" || null; // Clear previous data

    if (Object.keys(cart).length === 0) {
        alert("No items in the cart to generate a receipt.");
        return;
    }

    // Create receipt card
    const summaryCard = document.createElement("div");
    summaryCard.classList.add("summary-card");

    summaryCard.innerHTML = `
        <h3>Receipt Summary</h3>
        <p><strong>Name:</strong> ${userDetails.name}</p>
        <p><strong>Email:</strong> ${userDetails.email}</p>
        <p><strong>Address:</strong> ${userDetails.address}</p>
        <hr>
        <p><strong>Subtotal:</strong> ₹${orderSummary.subtotal.toFixed(2)}</p>
        <p><strong>Tax (18%):</strong> ₹${orderSummary.tax.toFixed(2)}</p>
        <p><strong>Discount (10%):</strong> ₹${orderSummary.discount.toFixed(2)}</p>
        <p><strong>Total:</strong> ₹${orderSummary.total.toFixed(2)}</p>
        <h4>Order Items:</h4>
    `;

    // Add each item in a card format
    for (let item in cart) {
        const itemTotal = cart[item].price * cart[item].quantity;
        const itemCard = document.createElement("div");
        itemCard.classList.add("cart-card");
        itemCard.innerHTML = `
            <h4>${item}</h4>
            <p>Price: ₹${cart[item].price.toFixed(2)}</p>
            <p>Quantity: ${cart[item].quantity}</p>
            <p>Total: ₹${itemTotal.toFixed(2)}</p>
        `;
        summaryCard.appendChild(itemCard);
    }

    receiptSection.appendChild(summaryCard);
}

// Function to validate and process payment
function processPayment() {
    const paymentMethod = document.getElementById("payment-method").value;

    if (paymentMethod === "card") {
        const cardNumber = document.getElementById("cardNumber").value;
        const cardExpiry = document.getElementById("cardExpiry").value;
        const cardCVV = document.getElementById("cardCVV").value;

        if (!validateCardDetails(cardNumber, cardExpiry, cardCVV)) return;
    } else {
        const upiId = document.getElementById("upiId").value;
        if (!upiId) {
            alert("Please enter your UPI ID.");
            return;
        }
    }

    alert("Payment successful! Generating receipt...");
    generateReceipt();
}

// Function to validate card details
function validateCardDetails(cardNumber, expiryDate, cvv) {
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvPattern = /^\d{3}$/;

    if (!cardNumberPattern.test(cardNumber)) {
        alert("Invalid card number. Format: #### #### #### ####");
        return false;
    }
    if (!expiryPattern.test(expiryDate)) {
        alert("Invalid expiry date. Format: MM/YY");
        return false;
    }
    if (!cvvPattern.test(cvv)) {
        alert("Invalid CVV. Must be 3 digits.");
        return false;
    }
    return true;
}

// Toggle payment fields
function togglePaymentFields() {
    const method = document.getElementById("payment-method").value;
    document.getElementById("card-payment").style.display = method === "card" ? "block" : "none";
    document.getElementById("upi-payment").style.display = method === "upi" ? "block" : "none";
}
