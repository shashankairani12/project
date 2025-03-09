 const API_URL = "http://localhost:5000/api/inventory"; // Backend URL

// Function to add item to inventory
function addItem() {
    let name = document.getElementById("itemName").value.trim();
    let quantity = parseInt(document.getElementById("itemQuantity").value);
    let price = parseFloat(document.getElementById("itemPrice").value);
    let unit = document.getElementById("weightType").value;

    if (!name || quantity <= 0 || price <= 0) return alert("Invalid input!");

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, unit, price }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload(); // Refresh to update UI
    })
    .catch(error => console.error("Error:", error));
}

// Function to update quantity on + button click
function changeQuantity(id, currentQuantity, price, change) {
    let newQuantity = currentQuantity + change;
    if (newQuantity <= 0) return;

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity, price }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => console.error("Error:", error));
}

// Function to delete item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => console.error("Error:", error));
}

// Function to load inventory data from backend
function loadInventory() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        let table = document.getElementById("inventoryTable");
        table.innerHTML = ""; // Clear table before reloading
        
        data.forEach(item => {
            let row = table.insertRow();
            row.insertCell(0).textContent = item.name;
            
            let qtyCell = row.insertCell(1);
            let qtyDisplay = document.createElement("span");
            qtyDisplay.textContent = `${item.quantity} ${item.unit}`;
            qtyCell.appendChild(qtyDisplay);
            
            let priceCell = row.insertCell(2);
            let priceInput = document.createElement("input");
            priceInput.type = "number";
            priceInput.value = item.price;
            priceInput.disabled = true; // Disable price input
            priceCell.appendChild(priceInput);

            let totalCell = row.insertCell(3);
            totalCell.textContent = (item.quantity * item.price).toFixed(2);
            
            let actionCell = row.insertCell(4);
            let increaseBtn = document.createElement("button");
            increaseBtn.textContent = "+";
            increaseBtn.classList.add("btn", "increase");
            increaseBtn.onclick = () => changeQuantity(item.id, item.quantity, item.price, 1);
            actionCell.appendChild(increaseBtn);
            
            let decreaseBtn = document.createElement("button");
            decreaseBtn.textContent = "-";
            decreaseBtn.classList.add("btn", "decrease");
            decreaseBtn.onclick = () => changeQuantity(item.id, item.quantity, item.price, -1);
            actionCell.appendChild(decreaseBtn);
            
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("btn", "delete");
            deleteBtn.onclick = () => deleteItem(item.id);
            actionCell.appendChild(deleteBtn);
        });
    })
    .catch(error => console.error("Error:", error));
}

// Load inventory on page load
document.addEventListener("DOMContentLoaded", loadInventory);
