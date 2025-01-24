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
    // أكواد الخصم الثابتة (Fixed Discount)
    { code: "20CIMI", type: "fixed", value: 500, expiryDate: "2025-1-27T23:59:59" }, // خصم 500 ريال ينتهي في آخر ثانية من 31 ديسمبر 2025
    { code: "20EHSE", type: "fixed", value: 1000, expiryDate: "2025-06-30T23:59:59" }, // خصم 1000 ريال ينتهي في آخر ثانية من 30 يونيو 2025

    // أكواد الخصم النسبية (Percentage Discount)
    { code: "20XCGC", type: "percentage", value: 10, expiryDate: "2025-03-15T23:59:59" }, // خصم 10% ينتهي في آخر ثانية من 15 مارس 2025
    { code: "20LQCL", type: "percentage", value: 20, expiryDate: "2025-09-01T23:59:59" }, // خصم 20% ينتهي في آخر ثانية من 1 سبتمبر 2025
    { code: "20RXGA", type: "percentage", value: 30, expiryDate: "2025-12-01T23:59:59" }, // خصم 30% ينتهي في آخر ثانية من 1 ديسمبر 2025

    // أكواد الخصم المشروطة (Conditional Discount)
    { code: "20ZCII", type: "conditional-fixed", value: 500, condition: { minProducts: 2 }, expiryDate: "2025-01-24T11:48:50" }, // خصم 500 ريال عند شراء منتجين أو أكثر، ينتهي في آخر ثانية من 20 مايو 2025
    { code: "20ERYA", type: "conditional-fixed", value: 1000, condition: { minProducts: 3 }, expiryDate: "2025-07-10T23:59:59" }, // خصم 1000 ريال عند شراء 3 منتجات أو أكثر، ينتهي في آخر ثانية من 10 يوليو 2025
    { code: "20KVLO", type: "conditional-fixed", value: 500, condition: { minTotal: 3000 }, expiryDate: "2025-08-15T23:59:59" }, // خصم 500 ريال عند وصول السعر الإجمالي إلى 3000 ريال أو أكثر، ينتهي في آخر ثانية من 15 أغسطس 2025
    { code: "20PWYB", type: "conditional-fixed", value: 1000, condition: { minTotal: 5000 }, expiryDate: "2025-10-01T23:59:59" }, // خصم 1000 ريال عند وصول السعر الإجمالي إلى 5000 ريال أو أكثر، ينتهي في آخر ثانية من 1 أكتوبر 2025
    { code: "20KXXY%", type: "conditional-percentage", value: 20, condition: { minTotal: 7000 }, expiryDate: "2025-11-30T23:59:59" }, // خصم 20% عند وصول السعر الإجمالي إلى 7000 ريال أو أكثر، ينتهي في آخر ثانية من 30 نوفمبر 2025
    { code: "20QGZY%", type: "conditional-percentage", value: 30, condition: { minTotal: 10000 }, expiryDate: "2025-12-25T23:59:59" }, // خصم 30% عند وصول السعر الإجمالي إلى 10000 ريال أو أكثر، ينتهي في آخر ثانية من 25 ديسمبر 2025
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
    const totalPrice = parseFloat(document.getElementById('total-price').textContent);
    let finalPrice = totalPrice;

    // البحث عن كود الخصم
    const discount = discountCodes.find(dc => dc.code === discountCode);

    if (discount) {
        let isValid = true;
        let conditionMessage = "";

        // التحقق من تاريخ انتهاء الصلاحية
        const currentDate = new Date(); // التاريخ والوقت الحاليين
        const expiryDate = new Date(discount.expiryDate); // تحويل expiryDate إلى كائن Date

        if (currentDate > expiryDate) {
            isValid = false;
            conditionMessage = `عذرًا، كود الخصم "${discount.code}" انتهت صلاحيته في ${formatDate(expiryDate)}.`;
        }

        // التحقق من الشروط إذا كان الخصم مشروطًا
        if (discount.condition && isValid) {
            if (discount.condition.minProducts && cart.length < discount.condition.minProducts) {
                isValid = false;
                conditionMessage = `هذا الكود يتطلب شراء ${discount.condition.minProducts} منتجات أو أكثر.`;
            }
            if (discount.condition.minTotal && totalPrice < discount.condition.minTotal) {
                isValid = false;
                conditionMessage = `هذا الكود يتطلب أن يكون إجمالي السلة ${discount.condition.minTotal} ريال أو أكثر.`;
            }
        }

        // تطبيق الخصم إذا كان الكود صالحًا
        if (isValid) {
            if (discount.type === "percentage" || discount.type === "conditional-percentage") {
                finalPrice -= totalPrice * (discount.value / 100); // خصم نسبة مئوية
            } else if (discount.type === "fixed" || discount.type === "conditional-fixed") {
                finalPrice -= discount.value; // خصم ثابت
            }
            alert(`تم تطبيق كود الخصم "${discount.code}" بنجاح!\nتم تطبيق خصم بقيمة: ${discount.value}${discount.type.includes("percentage") ? "%" : " ريال"}`);
        } else {
            alert(`عذرًا، لا يمكن تطبيق كود الخصم "${discount.code}".\n${conditionMessage}`);
        }
    } else if (discountCode) {
        alert("عذرًا، كود الخصم غير صحيح.");
    }

    // تحديث السعر النهائي
    document.getElementById('final-price').textContent = finalPrice.toFixed(2);
}

// دالة مساعدة لتنسيق التاريخ
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('ar-SA', options);
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
        console.log('تم إرسال الطلب بنجاح:', data);
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
