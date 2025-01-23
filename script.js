// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "سيروم فيتامين C",
        price: 2500,
        images: ["img/1/1.jpg"],
        description: "يحمي الجلد من اضرار الشمس",
            
        sizes: ["حجم واحد"]
    },
    {
        id: 2,
        name: "صابونة الشوفان والعسل",
        price: 2200,
        images: ["img/2/1.jpg", "img/2/2.jpg","img/2/3.jpg"],
        description: "تعمل كضماد طبيعي لألتهابات البكتريا و الميكروبات"  ,
        sizes: ["M", "L"]
    },
    {
        id: 3,
        name: "صابونة الفحم النشط",
        price: 2100,
        images: ["img/3/1.jpg", "img/3/2.jpg"],
        description: "تعالج البشرة الدهنية لأن الفحم يمتص الزيوت الزائدة في البشرة"  ,
        sizes: ["حجم واحد"]
    },
    {
        id: 4,
        name: "مرطب ومقشر الشفاة",
        price: 3100,
        images: ["img/4/1.jpg", "img/4/2.jpg","img/4/3.jpg"],
        description: "تعالج البشرة الدهنية لأن الفحم يمتص الزيوت الزائدة في البشرة"  ,
        sizes: ["حجم واحد"]
    }
];

// أكواد الخصم
const discountCodes = [
    { code: "DISCOUNT10", type: "percentage", value: 10 }, // خصم 10%
    { code: "DISCOUNT20", type: "percentage", value: 20 }, // خصم 20%
    { code: "FIXED50", type: "fixed", value: 50 }, // خصم ثابت 50 ريال
    { code: "500h", type: "fixed", value: 500 },
];

// السلة
let cart = [];

// متغير لتخزين كود الخصم المستخدم
let appliedDiscountCode = null;

// عرض المنتجات
function displayProducts() {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return; // تأكد من وجود العنصر
    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product" onclick="openProductModal(${product.id})">
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} ريال</p>
            </div>
        `;
    });
}

// فتح نافذة تفاصيل المنتج
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return; // تأكد من وجود المنتج
    const modalContent = document.querySelector('.product-details');
    if (!modalContent) return; // تأكد من وجود العنصر
    modalContent.innerHTML = `
        <div class="main-image">
            <img id="main-product-image" src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="thumbnail-images">
            ${product.images.map((img, index) => `
                <img src="${img}" alt="صورة ${index + 1}" onclick="changeMainImage('${img}')" ${index === 0 ? 'class="active"' : ''}>
            `).join('')}
        </div>
        <h3 id="product-name">${product.name}</h3>
        <p id="product-description">${product.description}</p>
        <p id="product-price">${product.price} ريال</p>
        <select id="size">
            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
        <button onclick="addToCart(${product.id})">إضافة إلى السلة</button>
    `;
    document.getElementById('product-modal').style.display = 'flex';
}

// تغيير الصورة الرئيسية
function changeMainImage(src) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) mainImage.src = src; // تأكد من وجود العنصر
    document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
    event.target.classList.add('active');
}

// إضافة المنتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return; // تأكد من وجود المنتج
    const size = document.getElementById('size').value;
    const existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, size, quantity: 1 });
    }

    updateCartDisplay();
    closeModal();
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    const finalPriceElement = document.getElementById('final-price');
    const cartCountElement = document.getElementById('cart-count');
    if (!cartTableBody || !totalPriceElement || !finalPriceElement || !cartCountElement) return; // تأكد من وجود العناصر

    cartTableBody.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        cartTableBody.innerHTML += `
            <tr>
                <td>${item.name} (${item.size})</td>
                <td>${item.price} ريال</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>${itemTotal} ريال</td>
                <td><button onclick="removeFromCart(${index})">إزالة</button></td>
            </tr>
        `;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
    finalPriceElement.textContent = totalPrice.toFixed(2);
    cartCountElement.textContent = cart.length;
}

// تحديث الكمية
function updateQuantity(index, quantity) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = parseInt(quantity);
        updateCartDisplay();
    }
}

// حذف المنتج من السلة
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}

// فتح نافذة السلة
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'flex'; // تأكد من وجود العنصر
}

// إغلاق النوافذ المنبثقة
function closeModal() {
    const productModal = document.getElementById('product-modal');
    if (productModal) productModal.style.display = 'none'; // تأكد من وجود العنصر
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'none'; // تأكد من وجود العنصر
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'none'; // تأكد من وجود العنصر
}

// تطبيق الخصم
function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value.trim();
    const discount = discountCodes.find(dc => dc.code === discountCode);

    if (discount) {
        const totalPrice = parseFloat(document.getElementById('total-price').textContent);
        let finalPrice = totalPrice;

        if (discount.type === "percentage") {
            finalPrice = totalPrice - (totalPrice * (discount.value / 100));
        } else if (discount.type === "fixed") {
            finalPrice = totalPrice - discount.value;
        }

        document.getElementById('final-price').textContent = finalPrice.toFixed(2);
        appliedDiscountCode = discountCode; // تخزين كود الخصم المستخدم
        alert(`تم تطبيق الخصم بنجاح!`);
    } else {
        alert("عذرًا، كود الخصم غير صحيح.");
    }
}

// فتح نافذة إتمام الشراء
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("السلة فارغة. يرجى إضافة منتجات قبل إتمام الشراء.");
        return;
    }

    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'flex'; // تأكد من وجود العنصر
}

// إرسال الطلب إلى Telegram
function sendToTelegram(order) {
    const botToken = '7678780527:AAG6IthVqq-uDyoVoDiqStaF6n66-ODAEVE'; // استبدل ببوت توكن الخاص بك
    const chatId = '5950748299'; // استبدل بمعرف الدردشة الخاص بك

    const message = `
طلب جديد:

${order.products.map(p => `- ${p.name} (${p.size}) | السعر: ${p.price} ريال | الكمية: ${p.quantity}`).join('\n')}
الإجمالي: ${order.total} ريال
كود الخصم المستخدم: ${appliedDiscountCode || "لا يوجد"}
الإجمالي بعد الخصم: ${order.finalTotal} ريال
رقم التواصل: ${order.phone}
العنوان: ${order.address}
طريقة التواصل: ${order.contactMethod}
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('تم إرسال الرسالة بنجاح:', data);
        alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريبًا.");
        cart = []; // تفريغ السلة بعد إرسال الطلب
        updateCartDisplay(); // تحديث عرض السلة
        closeCheckoutModal(); // إغلاق نافذة إتمام الشراء
    })
    .catch(error => {
        console.error('حدث خطأ أثناء الإرسال:', error);
        alert("حدث خطأ أثناء إرسال الطلب. يرجى التأكد من اتصالك بالانترنت.");
    });
}

// إرسال الطلب
document.getElementById('checkout-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("السلة فارغة. يرجى إضافة منتجات قبل إتمام الشراء.");
        return;
    }

    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const contactMethod = document.querySelector('input[name="contact"]:checked')?.value;

    const order = {
        products: cart,
        total: document.getElementById('total-price').textContent,
        finalTotal: document.getElementById('final-price').textContent,
        phone,
        address,
        contactMethod
    };

    sendToTelegram(order);
});

// عرض المنتجات عند تحميل الصفحة
window.onload = displayProducts;
