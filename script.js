/* =====================================
   رحلة إلى الغد - النظام الرئيسي
   ===================================== */

const DEFAULT_LOGO =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <rect width="300" height="300" rx="50" fill="#ffffff"/>
    <text x="150" y="165"
      text-anchor="middle"
      font-size="45"
      font-family="Arial"
      font-weight="bold"
      fill="#063d27">رحلة إلى الغد</text>
  </svg>
`);

let settings = JSON.parse(
  localStorage.getItem("siteSettings") || "null"
);

let items = JSON.parse(
  localStorage.getItem("siteItems") || "[]"
);


/* الإعدادات الافتراضية */

if (!settings) {

  settings = {
    title: "رحلة إلى الغد",
    description:
      "موقع يجمع الألعاب والتطبيقات والمشاريع والتصاميم والرسومات وعدسات سناب في تجربة رقمية تجمع الإبداع والتقنية والمستقبل.",
    developerName: "حاتم الحويش",
    developerBio:
      "مطور وصاحب مشروع رحلة إلى الغد: عبر الزمن.",
    logo: DEFAULT_LOGO
  };

  saveData();
}


/* حفظ */

function saveData() {

  localStorage.setItem(
    "siteSettings",
    JSON.stringify(settings)
  );

  localStorage.setItem(
    "siteItems",
    JSON.stringify(items)
  );
}


/* التنقل بين الأقسام */

function showSection(id) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const section = document.getElementById(id);

  if (section) {
    section.classList.add("active");
  }

  document.getElementById("navMenu")
    ?.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (id !== "admin") {
    renderItems();
  }
}


/* القائمة */

function toggleMenu() {

  document
    .getElementById("navMenu")
    .classList.toggle("open");

}


/* فتح إدارة المطور */

function openAdmin() {

  const password = prompt(
    "أدخل كلمة مرور المطور:"
  );

  if (password === null) return;

  if (password !== "1234") {
    alert("كلمة المرور غير صحيحة.");
    return;
  }

  loadAdmin();

  showSection("admin");
}


/* تحميل بيانات الإدارة */

function loadAdmin() {

  document.getElementById("adminTitle").value =
    settings.title;

  document.getElementById("adminDescription").value =
    settings.description;

  document.getElementById("adminName").value =
    settings.developerName;

  document.getElementById("adminBio").value =
    settings.developerBio;

  renderAdminItems();
}


/* حفظ إعدادات الموقع */

function saveSiteSettings() {

  settings.title =
    document.getElementById("adminTitle").value.trim()
    || "رحلة إلى الغد";

  settings.description =
    document.getElementById("adminDescription").value.trim();

  settings.developerName =
    document.getElementById("adminName").value.trim();

  settings.developerBio =
    document.getElementById("adminBio").value.trim();


  const logoFile =
    document.getElementById("logoInput").files[0];

  if (logoFile) {

    const reader = new FileReader();

    reader.onload = function(e) {

      settings.logo = e.target.result;

      saveData();
      updateSite();

      alert("تم حفظ الموقع والشعار بنجاح.");
    };

    reader.readAsDataURL(logoFile);

  } else {

    saveData();
    updateSite();

    alert("تم حفظ إعدادات الموقع.");
  }

}


/* تحديث الموقع */

function updateSite() {

  document.title =
    settings.title + " | عبر الزمن";

  document.getElementById("homeTitle").textContent =
    settings.title;

  document.getElementById("homeDescription").textContent =
    settings.description;

  document.getElementById("developerName").textContent =
    settings.developerName;

  document.getElementById("developerBio").textContent =
    settings.developerBio;

  document.getElementById("siteLogo").src =
    settings.logo || DEFAULT_LOGO;
}


/* إضافة عنصر */

function addItem() {

  const category =
    document.getElementById("itemCategory").value;

  const title =
    document.getElementById("itemTitle").value.trim();

  const description =
    document.getElementById("itemDescription").value.trim();

  const link =
    document.getElementById("itemLink").value.trim();

  const imageFile =
    document.getElementById("itemImage").files[0];


  if (!title) {
    alert("اكتب اسم العنصر أولاً.");
    return;
  }


  function finish(image = "") {

    items.push({
      id: Date.now(),
      category,
      title,
      description,
      link,
      image
    });

    saveData();

    document.getElementById("itemTitle").value = "";
    document.getElementById("itemDescription").value = "";
    document.getElementById("itemLink").value = "";
    document.getElementById("itemImage").value = "";

    renderItems();
    renderAdminItems();

    alert("تمت إضافة المحتوى بنجاح.");
  }


  if (imageFile) {

    const reader = new FileReader();

    reader.onload = function(e) {
      finish(e.target.result);
    };

    reader.readAsDataURL(imageFile);

  } else {

    finish("");
  }

}


/* عرض المحتوى */

function renderItems() {

  const categories = [
    "games",
    "designs",
    "drawings",
    "apps",
    "projects",
    "lenses"
  ];

  categories.forEach(category => {

    const container =
      document.getElementById(
        category + "List"
      );

    if (!container) return;

    const data =
      items.filter(
        item => item.category === category
      );


    if (data.length === 0) {

      container.innerHTML = `
        <div class="item">
          <h3>لا يوجد محتوى حالياً</h3>
          <p>يمكن للمطور إضافة محتوى جديد من إدارة المطور.</p>
        </div>
      `;

      return;
    }


    container.innerHTML =
      data.map(item => `

        <article class="item">

          ${
            item.image
            ? `<img src="${item.image}" alt="${escapeHTML(item.title)}">`
            : ""
          }

          <h3>${escapeHTML(item.title)}</h3>

          <p>
            ${escapeHTML(item.description || "")}
          </p>

          ${
            item.link
            ? `
              <a
                href="${safeURL(item.link)}"
                target="_blank"
                rel="noopener noreferrer">
                فتح الرابط
              </a>
            `
            : ""
          }

        </article>

      `).join("");

  });

}


/* إدارة العناصر */

function renderAdminItems() {

  const box =
    document.getElementById("adminItems");

  if (!box) return;


  if (items.length === 0) {

    box.innerHTML =
      "<p>لا يوجد محتوى مضاف.</p>";

    return;
  }


  box.innerHTML =
    items.map(item => `

      <div class="admin-item">

        <span>
          ${escapeHTML(item.title)}
        </span>

        <button
          class="delete-btn"
          onclick="deleteItem(${item.id})">
          حذف
        </button>

      </div>

    `).join("");
}


/* حذف */

function deleteItem(id) {

  if (!confirm("هل تريد حذف هذا العنصر؟")) {
    return;
  }

  items =
    items.filter(item => item.id !== id);

  saveData();

  renderItems();
  renderAdminItems();
}


/* حماية النص */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* حماية الروابط */

function safeURL(url) {

  try {

    const parsed =
      new URL(url, window.location.href);

    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    ) {
      return parsed.href;
    }

  } catch (e) {}

  return "#";
}


/* تشغيل الموقع */

updateSite();
renderItems();