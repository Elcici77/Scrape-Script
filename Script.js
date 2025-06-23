const stores = [
    "التميمي", "بندة", "كارفور", "نيستو", "المزرعة",
    "العثيم", "الراية", "لولو", "الدانوب", "بن داوود"
  ];
  
  const container = document.getElementById("store-container");
  const modal = document.getElementById("modal");
  const progressBar = document.getElementById("modal-progress-bar");
  const toast = document.getElementById("toast");
  
  // إنشاء البطاقات
  stores.forEach((store, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-store", store); // مهم للبحث
  
    card.innerHTML = `
      <h3>${store}</h3>
      <button class="run-btn" onclick="runScript('${store}')">تشغيل</button>
      <button class="export-btn" onclick="exportExcel('${store}')">تصدير إلى Excel</button>
    `;
    container.appendChild(card);
  });
  
  // تشغيل الاسكراب مع progress bar
  function runScript(store) {
    modal.style.display = "flex";
    progressBar.style.width = "0%";
    let progress = 0;
  
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += 2;
        progressBar.style.width = progress + "%";
      }
    }, 100);
  
    // محاكاة السكريبت الفعلي (يمكنك هنا إرسال طلب لـ backend)
    fetch('http://localhost:5000/run-scraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store })
    })
    .then(res => res.json())
    .then(data => {
      clearInterval(interval);
      progressBar.style.width = "100%";
      setTimeout(() => {
        modal.style.display = "none";
        showToast();
      }, 500);
    })
    .catch(err => {
      clearInterval(interval);
      modal.style.display = "none";
      alert("حدث خطأ أثناء تشغيل الاسكراب");
      console.error(err);
    });
  }
  
  // تحميل ملف Excel
  function exportExcel(store) {
    const fileName = `${store}.xlsx`;
    const link = document.createElement('a');
    link.href = `/exports/${fileName}`;
    link.download = fileName;
    link.click();
  }
  
  // إظهار إشعار النجاح
  function showToast() {
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }
  
  // فلترة المتاجر عند البحث
  document.getElementById('search').addEventListener('input', function () {
    const keyword = this.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
      const store = card.getAttribute('data-store').toLowerCase();
      if (store.includes(keyword)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
  