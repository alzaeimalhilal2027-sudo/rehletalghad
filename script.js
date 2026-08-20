document.addEventListener("DOMContentLoaded", function() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".content-section");

    navButtons.forEach(button => {
        button.addEventListener("click", function() {
            // إزالة الأنشطة من كل الأزرار والأقسام
            navButtons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active-section"));

            // تفعيل الزر المضغوط
            this.classList.add("active");

            // إظهار القسم المستهدف فقط
            const targetId = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add("active-section");
            }
        });
    });
});
