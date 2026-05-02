/* ═══════════════════════════════════════════════════════════════
   SmartMeal — Complete App Logic
   Features: Auth, LocalStorage, AI Chatbot, Riwayat, AR, Kalori
═══════════════════════════════════════════════════════════════ */

// ─── FOOD DATA ────────────────────────────────────────────────
const foodData = [
  // ═══════════════════════════════════════════
  // DIET — SARAPAN
  // ═══════════════════════════════════════════
  {
    name: "Bubur Ayam",
    calories: 320,
    protein: 15,
    fat: 10,
    carbs: 42,
    type: "diet",
    meal: "sarapan",
    img: "https://thumbs.dreamstime.com/b/bubur-ayam-indonesian-chicken-congee-bowl-bubur-ayam-popular-indonesian-rice-congee-presented-white-background-416167153.jpg",
    desc: "Bubur nasi lembut dengan suwiran ayam kampung, bawang goreng, daun bawang, dan kerupuk. Mudah dicerna dan cocok sebagai sarapan hangat yang ringan namun mengenyangkan.",
    labels: ["Light Meal", "Easy Digest", "Indonesian"],
  },
  {
    name: "Yogurt Buah",
    calories: 180,
    protein: 10,
    fat: 4,
    carbs: 26,
    type: "diet",
    meal: "sarapan",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvI9syG5WqxA-VORsyQJs5bZ84PjiT7UqdLA&s",
    desc: "Yogurt rendah lemak dengan topping buah segar seperti stroberi, pisang, dan kiwi. Kaya probiotik dan kalsium untuk mendukung kesehatan pencernaan.",
    labels: ["Low Calorie", "Probiotic", "High Calcium"],
  },
  {
    name: "Telur Rebus & Alpukat Toast",
    calories: 310,
    protein: 14,
    fat: 18,
    carbs: 22,
    type: "diet",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
    desc: "Toast gandum dengan irisan alpukat segar dan telur rebus. Kombinasi protein dan lemak sehat yang mengenyangkan tanpa berlebih kalori.",
    labels: ["High Protein", "Healthy Fat", "Clean Eat"],
  },
  {
    name: "Smoothie Hijau Bayam",
    calories: 210,
    protein: 7,
    fat: 4,
    carbs: 36,
    type: "diet",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
    desc: "Minuman segar dari bayam, pisang, apel hijau, dan susu almond tanpa gula. Kaya vitamin, mineral, dan serat yang mendukung program diet.",
    labels: ["Low Calorie", "High Vitamin", "Energy Boost"],
  },

  // ═══════════════════════════════════════════
  // DIET — SIANG
  // ═══════════════════════════════════════════
  {
    name: "Gado Gado",
    calories: 400,
    protein: 15,
    fat: 22,
    carbs: 38,
    type: "diet",
    meal: "siang",
    img: "https://png.pngtree.com/png-vector/20250706/ourlarge/pngtree-traditional-indonesian-gado-gado-with-peanut-sauce-png-image_16705806.webp",
    desc: "Sayuran rebus seperti kangkung, tauge, kentang, tahu, dan tempe disiram saus kacang khas Indonesia. Tinggi serat dan protein nabati, cocok untuk program diet.",
    labels: ["Plant Protein", "High Fiber", "Indonesian"],
  },
  {
    name: "Sup Sayuran Lentil",
    calories: 290,
    protein: 16,
    fat: 5,
    carbs: 45,
    type: "diet",
    meal: "siang",
    img: "https://png.pngtree.com/png-vector/20260212/ourmid/pngtree-hearty-lentil-soup-in-white-bowl-png-image_18632517.webp",
    desc: "Sup hangat dengan lentil merah, wortel, seledri, tomat, dan rempah pilihan. Rendah lemak namun tinggi protein nabati dan serat untuk menjaga kenyang lebih lama.",
    labels: ["Low Fat", "High Fiber", "Plant Protein"],
  },
  {
    name: "Salad Ayam Panggang",
    calories: 350,
    protein: 30,
    fat: 10,
    carbs: 24,
    type: "diet",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    desc: "Dada ayam panggang tanpa kulit di atas selada segar, tomat, mentimun, dan paprika, disiram dressing lemon rendah kalori. Tinggi protein dan rendah karbohidrat.",
    labels: ["High Protein", "Low Carb", "Low Calorie"],
  },
  {
    name: "Wrap Quinoa Tuna",
    calories: 400,
    protein: 32,
    fat: 9,
    carbs: 42,
    type: "diet",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    desc: "Tortilla gandum diisi quinoa, tuna kaleng, sayuran segar, dan saus mustard rendah lemak. Sumber omega-3 dan protein tinggi yang ideal untuk diet.",
    labels: ["Omega-3", "High Protein", "Low Fat"],
  },

  // ═══════════════════════════════════════════
  // DIET — MALAM
  // ═══════════════════════════════════════════
  {
    name: "Pecel Lele",
    calories: 320,
    protein: 25,
    fat: 15,
    carbs: 22,
    type: "diet",
    meal: "malam",
    img: "https://png.pngtree.com/png-vector/20250714/ourlarge/pngtree-pecel-lele---indonesian-fried-catfish-with-sambal-png-image_16767052.webp",
    desc: "Lele goreng bumbu rempah disajikan dengan sambal tomat, lalapan segar timun dan kemangi, tanpa nasi untuk versi diet. Tinggi protein dan omega-3 dari ikan lele.",
    labels: ["High Protein", "Omega-3", "Indonesian"],
  },
  {
    name: "Sup Ayam Jahe",
    calories: 240,
    protein: 22,
    fat: 6,
    carbs: 18,
    type: "diet",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    desc: "Sup bening ayam dengan jahe segar, daun bawang, wortel, dan seledri. Rendah kalori namun menghangatkan, cocok sebagai makan malam ringan untuk program diet.",
    labels: ["Low Calorie", "Anti Inflam", "Light Meal"],
  },

  // ═══════════════════════════════════════════
  // HEALTHY — SARAPAN
  // ═══════════════════════════════════════════
  {
    name: "Overnight Oats Chia",
    calories: 340,
    protein: 12,
    fat: 10,
    carbs: 50,
    type: "healthy",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1560008175-c2c6b069c1d8?w=400&q=80",
    desc: "Oats yang direndam semalam dengan chia seed, susu almond, dan buah-buahan segar. Kaya serat, omega-3, dan antioksidan untuk memulai hari dengan energi penuh.",
    labels: ["Balanced", "Omega-3", "High Fiber"],
  },
  {
    name: "Pancake Pisang Protein",
    calories: 370,
    protein: 16,
    fat: 8,
    carbs: 52,
    type: "healthy",
    meal: "sarapan",
    img: "https://png.pngtree.com/png-vector/20260402/ourlarge/pngtree-banana-cream-pancake-stack-png-image_18979197.webp",
    desc: "Pancake fluffy dari pisang matang, oat, telur, dan susu rendah lemak. Manis alami tanpa gula tambahan, tinggi protein dan karbohidrat kompleks untuk energi tahan lama.",
    labels: ["High Protein", "Natural Sweet", "Energizing"],
  },
  {
    name: "Telur Dadar Sayuran",
    calories: 290,
    protein: 15,
    fat: 13,
    carbs: 16,
    type: "healthy",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80",
    desc: "Telur dadar lembut dengan paprika, bayam, jamur, tomat, dan sedikit keju. Tinggi protein dan lemak sehat, rendah karbohidrat untuk sarapan bergizi.",
    labels: ["High Protein", "Low Carb", "Balanced"],
  },

  // ═══════════════════════════════════════════
  // HEALTHY — SIANG
  // ═══════════════════════════════════════════
  {
    name: "Ayam Penyet",
    calories: 520,
    protein: 35,
    fat: 25,
    carbs: 40,
    type: "healthy",
    meal: "siang",
    img: "https://png.pngtree.com/png-vector/20250808/ourmid/pngtree-delicious-chicken-penyet-featuring-crispy-chicken-spicy-sambal-refreshing-cucumber-slices-png-image_16862967.webp",
    desc: "Ayam goreng berbumbu rempah yang dipenyet lalu disajikan dengan sambal terasi pedas, nasi merah, tahu, tempe, dan lalapan segar. Tinggi protein khas Indonesia.",
    labels: ["High Protein", "Spicy", "Indonesian"],
  },
  {
    name: "Bowl Salmon Teriyaki",
    calories: 510,
    protein: 36,
    fat: 16,
    carbs: 46,
    type: "healthy",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    desc: "Nasi merah dengan salmon segar saus teriyaki rendah gula, edamame, wortel parut, dan taburan wijen. Kaya omega-3 dan nutrisi seimbang.",
    labels: ["Omega-3", "Balanced", "Premium"],
  },
  {
    name: "Pasta Gandum Pesto",
    calories: 450,
    protein: 20,
    fat: 15,
    carbs: 56,
    type: "healthy",
    meal: "siang",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD4e5HMiBkelEL8UM4dZziTMyZrVQ_m9kNTg&s",
    desc: "Pasta gandum utuh dengan saus pesto basil segar, cherry tomato, dan parmesan. Sumber karbohidrat kompleks dan lemak sehat dari minyak zaitun.",
    labels: ["Whole Grain", "Balanced", "Mediterranean"],
  },

  // ═══════════════════════════════════════════
  // HEALTHY — MALAM
  // ═══════════════════════════════════════════
  {
    name: "Grilled Chicken & Veggies",
    calories: 400,
    protein: 34,
    fat: 11,
    carbs: 32,
    type: "healthy",
    meal: "malam",
    img: "https://png.pngtree.com/png-clipart/20210711/original/pngtree-indonesian-grilled-chicken-png-image_6511872.jpg",
    desc: "Dada ayam panggang berbumbu dengan asparagus, paprika warna-warni, brokoli, dan ubi jalar panggang. Tinggi protein dan kaya antioksidan dari sayuran.",
    labels: ["High Protein", "Balanced", "Clean Eat"],
  },
  {
    name: "Stir-fry Sayur Tahu",
    calories: 340,
    protein: 18,
    fat: 12,
    carbs: 35,
    type: "healthy",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    desc: "Tahu crispy dengan pak choy, paprika merah, jamur shiitake, wortel, dan saus tiram rendah sodium. Protein nabati tinggi, rendah lemak, dan kaya serat.",
    labels: ["Plant Based", "Low Fat", "Vegetarian"],
  },

  // ═══════════════════════════════════════════
  // BULKING — SARAPAN
  // ═══════════════════════════════════════════
  {
    name: "Power Smoothie Protein",
    calories: 650,
    protein: 42,
    fat: 18,
    carbs: 72,
    type: "bulking",
    meal: "sarapan",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCx2UCuCY19lIa7ywufZxyzZft59IkuHR8CQ&s",
    desc: "Smoothie padat kalori dari whey protein, pisang, oat, selai kacang alami, susu full cream, dan madu. Ideal diminum setelah bangun tidur untuk muscle building.",
    labels: ["High Protein", "Mass Gainer", "Post Wake"],
  },
  {
    name: "Nasi Uduk Komplit",
    calories: 680,
    protein: 28,
    fat: 24,
    carbs: 88,
    type: "bulking",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
    desc: "Nasi uduk gurih santan dengan lauk lengkap: ayam goreng, tempe orek, telur balado, bihun goreng, dan kerupuk. Sarapan padat kalori khas Betawi untuk bulking.",
    labels: ["High Calorie", "Indonesian", "Complete"],
  },
  {
    name: "Granola Bowl Protein Susu",
    calories: 580,
    protein: 26,
    fat: 16,
    carbs: 78,
    type: "bulking",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    desc: "Granola kacang-kacangan renyah dengan susu murni, pisang irisan, madu, dan protein powder. Tinggi karbohidrat dan protein untuk mendukung fase bulking.",
    labels: ["High Carb", "Energy Dense", "Mass Build"],
  },

  // ═══════════════════════════════════════════
  // BULKING — SIANG
  // ═══════════════════════════════════════════
  {
    name: "Nasi Putih Ayam Goreng",
    calories: 750,
    protein: 40,
    fat: 26,
    carbs: 85,
    type: "bulking",
    meal: "siang",
    img: "https://png.pngtree.com/png-clipart/20230319/original/pngtree-fried-chicken-with-fresh-vegetables-and-rice-png-image_8995929.png",
    desc: "Nasi putih pulen dengan ayam goreng crispy berbumbu, tempe goreng, sambal terasi, dan lalapan. Menu makan siang padat kalori dan protein tinggi khas Indonesia.",
    labels: ["High Calorie", "High Protein", "Indonesian"],
  },
  {
    name: "Beef Steak & Sweet Potato",
    calories: 700,
    protein: 50,
    fat: 22,
    carbs: 60,
    type: "bulking",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    desc: "Steak sapi tenderloin medium rare dengan ubi jalar panggang, brokoli kukus, dan saus mushroom. Sumber protein premium dan karbohidrat kompleks untuk masa otot.",
    labels: ["High Protein", "Muscle Build", "Premium"],
  },
  {
    name: "Pasta Bolognese Daging",
    calories: 660,
    protein: 38,
    fat: 20,
    carbs: 76,
    type: "bulking",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
    desc: "Pasta spaghetti dengan saus bolognese daging sapi giling, saus tomat kaya rasa, bawang bombay, dan taburan parmesan. Tinggi kalori dan protein untuk bulking.",
    labels: ["High Calorie", "Protein Rich", "Classic"],
  },

  // ═══════════════════════════════════════════
  // BULKING — MALAM
  // ═══════════════════════════════════════════
  {
    name: "Nasi Goreng Telur Ayam",
    calories: 620,
    protein: 34,
    fat: 20,
    carbs: 76,
    type: "bulking",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    desc: "Nasi goreng spesial dengan suwiran ayam, telur ceplok, sayuran, kecap manis, dan bawang goreng. Cocok sebagai makan malam padat kalori untuk recovery otot.",
    labels: ["High Calorie", "Indonesian", "Recovery"],
  },
  {
    name: "Rendang Daging Nasi Merah",
    calories: 680,
    protein: 45,
    fat: 28,
    carbs: 58,
    type: "bulking",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
    desc: "Rendang daging sapi empuk kaya rempah dengan nasi merah bergizi. Sumber protein premium tinggi dari daging sapi dengan lemak sehat dari santan rempah.",
    labels: ["High Protein", "Indonesian", "Muscle Build"],
  },
];

// ─── MODEL 3D MAPPING ────────────────────────────────────────
// Tambahkan mapping nama makanan → file GLB di sini
const foodModels = {
  "Gado Gado": "assets/models/gado-gado.glb",
  "Bubur Ayam": "assets/models/Bubur_Ayam.glb",
  "Yogurt Buah": "assets/models/yogurt.glb",
  "Pecel Lele": "assets/models/Pecel-Lele.glb",
  "Ayam Penyet": "assets/models/ayam_penyet.glb",
  "Nasi Putih Ayam Goreng": "assets/models/nasi_lemak.glb",
  "Sup Sayuran Lentil": "assets/models/Sup_Lentil.glb",
  "Pancake Pisang Protein": "assets/models/Pancake.glb",
  "Pasta Gandum Pesto": "assets/models/pasta.glb",
  "Grilled Chicken & Veggies": "assets/models/Grilled_Chicken.glb",
  "Power Smoothie Protein": "assets/models/smoothie.glb",
};

// ─── APP STATE ─────────────────────────────────────────────────
const state = {
  goal: null,
  meal: null,
  weight: null,
  height: null,
  age: null,
  gender: null,
  activity: null,
  bmr: 0,
  tdee: 0,
  targetCalories: 0,
  mealCalories: 0,
  currentFood: null,
  history: ["home-section"],
  cameraStream: null,
  currentUser: null,
};

// ─── GLOBAL VARIABLES ─────────────────────────
let arRotation = 0;
let arScale = 1;
let isDragging = false;
let lastX = 0;

let lastTouchX = 0;
let lastTouchDist = 0;

let chatMessages = [];
let isBotTyping = false;
let chatInitialized = false;

let currentFilteredFoods = [];

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────
const LS = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
  remove(k) {
    localStorage.removeItem(k);
  },
};

function getUsers() {
  return LS.get("sm_users") || {};
}
function saveUsers(u) {
  LS.set("sm_users", u);
}
function getSession() {
  return LS.get("sm_session");
}
function saveSession(username) {
  LS.set("sm_session", username);
}
function clearSession() {
  LS.remove("sm_session");
}

function getUserData(username) {
  const users = getUsers();
  return users[username] || null;
}
function saveUserData(username, data) {
  const users = getUsers();
  users[username] = { ...users[username], ...data };
  saveUsers(users);
}

function getRiwayat(username) {
  return LS.get("sm_riwayat_" + username) || [];
}
function addRiwayat(username, entry) {
  const r = getRiwayat(username);
  r.unshift(entry);
  if (r.length > 50) r.pop();
  LS.set("sm_riwayat_" + username, r);
}

function getChatHistory(username) {
  return LS.get("sm_chat_" + username) || [];
}
function saveChatHistory(username, msgs) {
  LS.set("sm_chat_" + username, msgs.slice(-60));
}

// ─── TOAST ────────────────────────────────────────────────────
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast" + (type ? " " + type : "");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ─── AUTH ─────────────────────────────────────────────────────
function showAuth(screenId) {
  document
    .querySelectorAll(".auth-screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === "password") {
    inp.type = "text";
    btn.textContent = "🙈";
  } else {
    inp.type = "password";
    btn.textContent = "👁️";
  }
}

function doLogin() {
  const id = document.getElementById("login-identifier").value.trim();
  const pw = document.getElementById("login-password").value;
  if (!id || !pw) {
    showToast("Lengkapi semua field!", "error");
    return;
  }

  const users = getUsers();
  let found = null;
  for (const uname in users) {
    const u = users[uname];
    if ((uname === id || u.email === id) && u.password === pw) {
      found = uname;
      break;
    }
  }
  if (!found) {
    showToast("Username/email atau password salah!", "error");
    return;
  }

  saveSession(found);
  state.currentUser = found;
  loginSuccess(found);
}

function doRegister() {
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pw = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;

  if (!username || !email || !pw || !confirm) {
    showToast("Lengkapi semua field!", "error");
    return;
  }
  if (pw.length < 6) {
    showToast("Password minimal 6 karakter!", "error");
    return;
  }
  if (pw !== confirm) {
    showToast("Password tidak sama!", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Format email tidak valid!", "error");
    return;
  }

  const users = getUsers();
  if (users[username]) {
    showToast("Username sudah dipakai!", "error");
    return;
  }
  for (const u in users) {
    if (users[u].email === email) {
      showToast("Email sudah terdaftar!", "error");
      return;
    }
  }

  const joined = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  users[username] = { email, password: pw, avatar: "👤", joined };
  saveUsers(users);
  saveSession(username);
  state.currentUser = username;
  showToast("Akun berhasil dibuat! 🎉", "success");
  loginSuccess(username);
}

function loginSuccess(username) {
  const userData = getUserData(username);
  document.getElementById("auth-wrapper").style.display = "none";
  document.getElementById("app-wrapper").style.display = "block";
  updateProfileUI(username, userData);
  initChatForUser(username);
  showToast("Selamat datang, " + username + "! 👋", "success");
  switchTab("home");
}

function doLogout() {
  document.getElementById("logout-modal").style.display = "none";
  clearSession();
  state.currentUser = null;
  document.getElementById("app-wrapper").style.display = "none";
  document.getElementById("auth-wrapper").style.display = "block";
  showAuth("login-screen");
  document.getElementById("login-identifier").value = "";
  document.getElementById("login-password").value = "";
  showToast("Berhasil logout 👋");
}

function confirmLogout() {
  document.getElementById("logout-modal").style.display = "flex";
}

function updateProfileUI(username, userData) {
  const avatar = userData?.avatar || "👤";
  const email = userData?.email || "";
  document.getElementById("profile-avatar-display").textContent = avatar;
  document.getElementById("profile-username-display").textContent = username;
  document.getElementById("profile-email-display").textContent = email;
  document.getElementById("topbar-avatar").textContent = avatar;
  document.getElementById("nav-profile-icon").textContent = avatar;
  const greeting = document.getElementById("topbar-greeting");
  if (greeting) greeting.textContent = "Hi, " + username + "!";
}

// ─── PROFILE FUNCTIONS ────────────────────────────────────────
function showProfileSub(id) {
  document.getElementById("profile-main-view").style.display = "none";
  document
    .querySelectorAll(".profile-sub-view")
    .forEach((v) => (v.style.display = "none"));
  document.getElementById("sub-" + id).style.display = "block";
  const uname = state.currentUser;
  const userData = getUserData(uname);

  if (id === "info-akun") {
    document.getElementById("info-username").textContent = uname;
    document.getElementById("info-email").textContent = userData?.email || "-";
    document.getElementById("info-joined").textContent =
      userData?.joined || "-";
  }
  if (id === "edit-profile") {
    document.getElementById("edit-username").value = uname;
    document.getElementById("edit-email").value = userData?.email || "";
    document.getElementById("edit-avatar-preview").textContent =
      userData?.avatar || "👤";
    document.getElementById("edit-password").value = "";
  }
  if (id === "riwayat") {
    renderRiwayat();
  }
}

function hideProfileSub() {
  document
    .querySelectorAll(".profile-sub-view")
    .forEach((v) => (v.style.display = "none"));
  document.getElementById("profile-main-view").style.display = "block";
}

let tempAvatar = null;
function pickEmoji(emoji) {
  tempAvatar = emoji;
  document.getElementById("edit-avatar-preview").textContent = emoji;
}

function saveProfile() {
  const newUsername = document.getElementById("edit-username").value.trim();
  const newEmail = document.getElementById("edit-email").value.trim();
  const newPw = document.getElementById("edit-password").value;
  const oldUsername = state.currentUser;

  if (!newUsername || !newEmail) {
    showToast("Lengkapi field wajib!", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    showToast("Format email tidak valid!", "error");
    return;
  }
  if (newPw && newPw.length < 6) {
    showToast("Password minimal 6 karakter!", "error");
    return;
  }

  const users = getUsers();
  // Check if new username already taken by someone else
  if (newUsername !== oldUsername && users[newUsername]) {
    showToast("Username sudah dipakai!", "error");
    return;
  }
  // Check email
  for (const u in users) {
    if (u !== oldUsername && users[u].email === newEmail) {
      showToast("Email sudah dipakai!", "error");
      return;
    }
  }

  const oldData = users[oldUsername] || {};
  const newData = {
    ...oldData,
    email: newEmail,
    avatar: tempAvatar || oldData.avatar || "👤",
  };
  if (newPw) newData.password = newPw;

  // Handle username change
  if (newUsername !== oldUsername) {
    users[newUsername] = newData;
    delete users[oldUsername];
    // Migrate riwayat and chat
    const riwayat = getRiwayat(oldUsername);
    LS.set("sm_riwayat_" + newUsername, riwayat);
    LS.remove("sm_riwayat_" + oldUsername);
    const chat = getChatHistory(oldUsername);
    LS.set("sm_chat_" + newUsername, chat);
    LS.remove("sm_chat_" + oldUsername);
    state.currentUser = newUsername;
    saveSession(newUsername);
  } else {
    users[oldUsername] = newData;
  }
  saveUsers(users);
  tempAvatar = null;
  updateProfileUI(state.currentUser, newData);
  showToast("Profil berhasil disimpan! ✓", "success");
  hideProfileSub();
}

// ─── RIWAYAT ──────────────────────────────────────────────────
let riwayatFilter = "all";

function setRiwayatFilter(filter, btn) {
  riwayatFilter = filter;
  document.querySelectorAll(".riwayat-filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  filterRiwayat();
}

function filterRiwayat() {
  const query = (document.getElementById("riwayat-search")?.value || "").toLowerCase().trim();
  const allRiwayat = getRiwayat(state.currentUser);
  const now = new Date();

  const filtered = allRiwayat.filter((r) => {
    // Date filter
    if (riwayatFilter !== "all") {
      const rDate = new Date(r.rawTime || r.time);
      if (riwayatFilter === "today") {
        if (rDate.toDateString() !== now.toDateString()) return false;
      } else if (riwayatFilter === "week") {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        if (rDate < weekAgo) return false;
      } else if (riwayatFilter === "month") {
        if (rDate.getMonth() !== now.getMonth() || rDate.getFullYear() !== now.getFullYear()) return false;
      }
    }
    // Search filter
    if (query) {
      const searchable = ((r.name || "") + " " + (r.goal || "") + " " + (r.meal || "")).toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });

  renderRiwayatList(filtered);
}

function renderRiwayat() {
  riwayatFilter = "all";
  // Reset filter buttons
  document.querySelectorAll(".riwayat-filter-btn").forEach((b) => b.classList.remove("active"));
  const allBtn = document.getElementById("filter-all");
  if (allBtn) allBtn.classList.add("active");
  // Reset search
  const searchEl = document.getElementById("riwayat-search");
  if (searchEl) searchEl.value = "";

  const allRiwayat = getRiwayat(state.currentUser);
  renderStats(allRiwayat);
  renderRiwayatList(allRiwayat);
}

function renderStats(riwayat) {
  const total = riwayat.length;
  const kaloriEntries = riwayat.filter((r) => r.type === "kalori");
  const avgKalori = kaloriEntries.length
    ? Math.round(kaloriEntries.reduce((s, r) => s + (r.targetCalories || 0), 0) / kaloriEntries.length)
    : 0;

  // Goal terfavorit
  const goalCount = {};
  kaloriEntries.forEach((r) => {
    const g = (r.goal || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
    goalCount[g] = (goalCount[g] || 0) + 1;
  });
  const topGoal = Object.entries(goalCount).sort((a, b) => b[1] - a[1])[0];
  const goalEmoji = { diet: "🥗", healthy: "💚", bulking: "💪" };
  const goalLabel = topGoal ? (goalEmoji[topGoal[0]] || "") + " " + topGoal[0].charAt(0).toUpperCase() + topGoal[0].slice(1) : "-";

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-kalori").textContent = avgKalori ? avgKalori + " kcal" : "-";
  document.getElementById("stat-goal").textContent = goalLabel;
}

function renderRiwayatList(riwayat) {
  const list = document.getElementById("riwayat-list");
  if (!riwayat.length) {
    list.innerHTML = '<div class="riwayat-empty">Tidak ada riwayat yang cocok. 🔍<br>Coba ubah filter atau kata kunci pencarian.</div>';
    return;
  }

  // Kelompokkan per tanggal
  const groups = {};
  riwayat.forEach((r, idx) => {
    const dateKey = (() => {
      try {
        const d = new Date(r.rawTime || r.time);
        if (isNaN(d)) return r.time?.split(",")[0] || "Lainnya";
        const today = new Date();
        const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return "Hari Ini";
        if (d.toDateString() === yesterday.toDateString()) return "Kemarin";
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      } catch { return "Lainnya"; }
    })();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({ ...r, _idx: idx });
  });

  list.innerHTML = Object.entries(groups).map(([date, items]) => `
    <div class="riwayat-date-group">
      <div class="riwayat-date-header">
        <span>${date}</span>
        <div class="riwayat-date-line"></div>
        <span class="riwayat-date-count">${items.length}</span>
      </div>
      ${items.map((r) => renderRiwayatItem(r)).join("")}
    </div>
  `).join("");
}

function renderRiwayatItem(r) {
  const idxAttr = `data-idx="${r._idx}"`;
  if (r.type === "kalori") {
    return `<div class="riwayat-item riwayat-kalori" ${idxAttr}>
      <div class="riwayat-icon">🔥</div>
      <div class="riwayat-info">
        <div class="riwayat-name">${r.goal} · ${r.meal}</div>
        <div class="riwayat-detail">Target: ${r.targetCalories} kcal · TDEE: ${r.tdee} kcal</div>
        <div class="riwayat-time">${r.time}</div>
      </div>
      <button class="riwayat-del-btn" onclick="deleteRiwayatItem(${r._idx})" title="Hapus">✕</button>
    </div>`;
  }
  return `<div class="riwayat-item" ${idxAttr}>
    <img src="${r.img}" class="riwayat-img" alt="${r.name}" onerror="this.style.display='none'">
    <div class="riwayat-info">
      <div class="riwayat-name">${r.name}</div>
      <div class="riwayat-detail">🔥 ${r.calories} kcal · ${r.protein || 0}g protein</div>
      <div class="riwayat-time">${r.time}</div>
    </div>
    <button class="riwayat-del-btn" onclick="deleteRiwayatItem(${r._idx})" title="Hapus">✕</button>
  </div>`;
}

function deleteRiwayatItem(idx) {
  const riwayat = getRiwayat(state.currentUser);
  riwayat.splice(idx, 1);
  LS.set("sm_riwayat_" + state.currentUser, riwayat);
  renderStats(riwayat);
  filterRiwayat();
  showToast("Riwayat dihapus", "success");
}

function clearAllRiwayat() {
  if (!confirm("Hapus semua riwayat? Tidak bisa dikembalikan.")) return;
  LS.remove("sm_riwayat_" + state.currentUser);
  renderStats([]);
  renderRiwayatList([]);
  showToast("Semua riwayat dihapus 🗑️");
}

// ─── NAV / ROUTING ────────────────────────────────────────────
function navigate(target, from) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(target).classList.add("active");
  state.history.push(target);
  updateNavHighlight(target);
  const noNav = ["loading-section"];
  const bnav = document.getElementById("bottom-nav");
  bnav.style.transform = noNav.includes(target)
    ? "translateY(100%)"
    : "translateY(0)";
}

function updateNavHighlight(sectionId) {
  const map = {
    "home-section": "home",
    "input-section": "home",
    "loading-section": "home",
    "result-section": "home",
    "detail-section": "home",
    "chat-section": "chat",
    "profile-section": "profile",
  };
  const tab = map[sectionId] || "home";
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  const btn = document.getElementById("nav-" + tab);
  if (btn) btn.classList.add("active");
}

function switchTab(tab) {
  const map = {
    home: "home-section",
    chat: "chat-section",
    profile: "profile-section",
  };
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(map[tab]).classList.add("active");
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("nav-" + tab).classList.add("active");
  document.getElementById("bottom-nav").style.transform = "translateY(0)";
  if (tab === "profile") {
    hideProfileSub();
  }
  if (tab === "chat") {
    renderChatFromStorage();
  }
}

// ─── HOME STEP LOGIC ──────────────────────────────────────────
function selectGoal(goal, el) {
  state.goal = goal;
  document
    .querySelectorAll("#goal-grid .choice-card")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("next-step1").disabled = false;
}

function selectMeal(meal, el) {
  state.meal = meal;
  document
    .querySelectorAll("#meal-grid .choice-card")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("next-step2").disabled = false;
}

function goToStep2() {
  document.getElementById("home-step1").style.display = "none";
  const s2 = document.getElementById("home-step2");
  s2.style.display = "block";
  s2.className = "slide-up";
}

function backToStep1() {
  document.getElementById("home-step2").style.display = "none";
  document.getElementById("home-step1").style.display = "block";
}

function goToInput() {
  const mealMap = {
    sarapan: "Sarapan",
    siang: "Makan Siang",
    malam: "Makan Malam",
  };
  const goalMap = { diet: "Diet", healthy: "Healthy", bulking: "Bulking" };
  document.getElementById("input-breadcrumb").innerHTML =
    `<span>${goalMap[state.goal]}</span><span class="sep">›</span><span>${mealMap[state.meal]}</span>`;
  navigate("input-section", "home-section");
}

// ─── INPUT FORM ───────────────────────────────────────────────
function selectGender(g) {
  state.gender = g;
  document
    .getElementById("radio-pria")
    .classList.toggle("selected", g === "pria");
  document
    .getElementById("radio-wanita")
    .classList.toggle("selected", g === "wanita");
}

function selectActivity(a) {
  state.activity = a;
  ["ringan", "sedang", "berat"].forEach((x) =>
    document.getElementById("radio-" + x).classList.toggle("selected", x === a),
  );
}

function confirmInput() {
  const w = parseFloat(document.getElementById("weight").value);
  const h = parseFloat(document.getElementById("height").value);
  const a = parseFloat(document.getElementById("age").value);
  if (!w || !h || !a || !state.gender || !state.activity) {
    showToast("Mohon lengkapi semua data!", "error");
    return;
  }
  if (w < 30 || w > 300) {
    showToast("Berat badan tidak valid!", "error");
    return;
  }
  if (h < 100 || h > 250) {
    showToast("Tinggi badan tidak valid!", "error");
    return;
  }
  if (a < 10 || a > 100) {
    showToast("Usia tidak valid!", "error");
    return;
  }
  state.weight = w;
  state.height = h;
  state.age = a;
  navigate("loading-section", "input-section");
  setTimeout(calculateAndShow, 1800);
}

// ─── CALCULATION ──────────────────────────────────────────────
function calculateAndShow() {
  // Harris-Benedict
  let bmr;
  if (state.gender === "pria") {
    bmr = 88.36 + 13.4 * state.weight + 4.8 * state.height - 5.7 * state.age;
  } else {
    bmr = 447.6 + 9.2 * state.weight + 3.1 * state.height - 4.3 * state.age;
  }
  const actMult = { ringan: 1.375, sedang: 1.55, berat: 1.725 };
  const tdee = Math.round(bmr * actMult[state.activity]);
  const goalAdj = { diet: -400, healthy: 0, bulking: 450 };
  const target = Math.max(1200, tdee + goalAdj[state.goal]);
  const mealPct = { sarapan: 0.25, siang: 0.4, malam: 0.35 };
  const mealCal = Math.round(target * mealPct[state.meal]);

  state.bmr = Math.round(bmr);
  state.tdee = tdee;
  state.targetCalories = target;
  state.mealCalories = mealCal;

  // Save to riwayat
  const goalMap = {
    diet: "Diet 🥗",
    healthy: "Healthy 💚",
    bulking: "Bulking 💪",
  };
  const mealMap = {
    sarapan: "Sarapan 🌅",
    siang: "Makan Siang ☀️",
    malam: "Makan Malam 🌙",
  };
  addRiwayat(state.currentUser, {
    type: "kalori",
    goal: goalMap[state.goal],
    meal: mealMap[state.meal],
    tdee,
    targetCalories: target,
    mealCalories: mealCal,
    time: fmtTime(),
    rawTime: new Date().toISOString(),
  });

  buildResultPage(tdee, target, mealCal);
  navigate("result-section", "loading-section");
}

function getMealLabel(m) {
  return (
    { sarapan: "Sarapan", siang: "Makan Siang", malam: "Makan Malam" }[m] || m
  );
}
function getGoalLabel(g) {
  return { diet: "Diet", healthy: "Healthy", bulking: "Bulking" }[g] || g;
}

function buildResultPage(tdee, target, mealCal) {
  document.getElementById("result-breadcrumb").innerHTML =
    `<span>${getGoalLabel(state.goal)}</span><span class="sep">›</span><span>${getMealLabel(state.meal)}</span>`;
  document.getElementById("result-sub").textContent =
    `Berdasarkan data tubuhmu (${state.weight}kg · ${state.height}cm · ${state.age}thn · ${state.gender === "pria" ? "Pria" : "Wanita"})`;

  const bmi = (state.weight / (state.height / 100) ** 2).toFixed(1);
  const bmiLabel =
    bmi < 18.5
      ? "Kurus"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obesitas";

  document.getElementById("calorie-cards").innerHTML = `
    <div class="calorie-card"><div class="calorie-card-icon">⚙️</div><div class="calorie-card-val">${state.bmr}</div><div class="calorie-card-label">BMR (kcal/hari)</div></div>
    <div class="calorie-card highlight"><div class="calorie-card-icon">🔥</div><div class="calorie-card-val">${tdee}</div><div class="calorie-card-label">TDEE (kalori terbakar)</div></div>
    <div class="calorie-card highlight"><div class="calorie-card-icon">🎯</div><div class="calorie-card-val">${target}</div><div class="calorie-card-label">Target Harian</div></div>
    <div class="calorie-card"><div class="calorie-card-icon">🍽️</div><div class="calorie-card-val">${mealCal}</div><div class="calorie-card-label">Kalori ${getMealLabel(state.meal)}</div></div>
  `;

  const goalMsg = {
    diet: "Defisit 400 kcal dari TDEE untuk penurunan berat badan optimal.",
    healthy: "Kalori seimbang dengan TDEE untuk menjaga berat badan ideal.",
    bulking: "Surplus 450 kcal dari TDEE untuk mendukung pertumbuhan otot.",
  };
  document.getElementById("target-banner").innerHTML =
    `💡 <strong>Target ${getGoalLabel(state.goal)}:</strong> ${goalMsg[state.goal]} BMI kamu saat ini <strong>${bmi} (${bmiLabel})</strong>.`;

  const reasonTxt = {
    diet: "Makanan-makanan di bawah dipilih untuk mendukung defisit kalori sambil tetap memberikan nutrisi cukup.",
    healthy:
      "Rekomendasi seimbang antara karbohidrat, protein, dan lemak sehat.",
    bulking:
      "Makanan padat kalori dan protein tinggi untuk mendukung program bulking.",
  };
  document.getElementById("reason-box-result").innerHTML =
    `<div class="reason-box">${reasonTxt[state.goal]}</div>`;

  currentFilteredFoods = foodData.filter(
    (f) => f.type === state.goal && f.meal === state.meal,
  );
  document.getElementById("food-count-badge").textContent =
    currentFilteredFoods.length + " makanan";
  document.getElementById("food-grid").innerHTML = currentFilteredFoods
    .map(
      (f, i) => `
    <div class="food-card" onclick="openDetail(${i})">
      <img class="food-img" src="${f.img}" alt="${f.name}" loading="lazy">
      <div class="food-body">
        <div class="food-name">${f.name}</div>
        <div class="food-cal">🔥 ${f.calories} kcal</div>
        <div class="food-macros">
          <span class="macro-tag protein">P: ${f.protein}g</span>
          <span class="macro-tag fat">L: ${f.fat}g</span>
          <span class="macro-tag">K: ${f.carbs}g</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ─── DETAIL PAGE ──────────────────────────────────────────────

function openDetail(idx) {
  if (!currentFilteredFoods || !currentFilteredFoods[idx]) {
    console.error("Food tidak ditemukan:", idx);
    return;
  }

  const f = currentFilteredFoods[idx];
  state.currentFood = f;

  document.getElementById("detail-breadcrumb").innerHTML =
    `<span>${getMealLabel(state.meal)}</span><span class="sep">›</span><span>${f.name.length > 22 ? f.name.slice(0, 22) + "…" : f.name}</span>`;
  document.getElementById("detail-name").textContent = f.name;
  document.getElementById("detail-cal-big").textContent =
    `🔥 ${f.calories} kcal per sajian`;
  document.getElementById("ar-food-img").src = f.img;
  document.getElementById("ar-label1").textContent = f.labels[0] || "";
  document.getElementById("ar-label2").textContent = f.labels[1] || "";
  document.getElementById("ar-label3").textContent = f.labels[2] || "";

  const total = f.protein * 4 + f.fat * 9 + f.carbs * 4;
  const macros = [
    {
      icon: "🥩",
      label: "Protein",
      val: f.protein,
      cls: "fill-protein",
      pct: Math.round(((f.protein * 4) / total) * 100),
    },
    {
      icon: "🧈",
      label: "Lemak",
      val: f.fat,
      cls: "fill-fat",
      pct: Math.round(((f.fat * 9) / total) * 100),
    },
    {
      icon: "🍚",
      label: "Karbo",
      val: f.carbs,
      cls: "fill-carbs",
      pct: Math.round(((f.carbs * 4) / total) * 100),
    },
  ];

  document.getElementById("macro-grid").innerHTML = macros
    .map(
      (m) =>
        `<div class="macro-card"><div class="macro-card-icon">${m.icon}</div><div class="macro-card-val">${m.val}g</div><div class="macro-card-label">${m.label}</div></div>`,
    )
    .join("");

  document.getElementById("macro-progress").innerHTML = macros
    .map(
      (m) =>
        `<div class="progress-macro-row"><div class="progress-macro-label">${m.label}</div><div class="progress-macro-bar"><div class="progress-macro-fill ${m.cls}" data-width="${m.pct}" style="width:0%"></div></div><div class="progress-macro-val">${m.pct}%</div></div>`,
    )
    .join("");

  const reasons = {
    diet: "🥗 Rendah kalori & tinggi serat — ideal untuk program diet.",
    bulking: "💪 Tinggi protein & kalori padat — optimal untuk bulking.",
    healthy: "💚 Seimbang antara makronutrien untuk pola hidup sehat.",
  };
  document.getElementById("detail-reason").innerHTML =
    `<strong>Mengapa ini?</strong> ${reasons[state.goal]}`;
  document.getElementById("detail-desc").textContent = f.desc;

  navigate("detail-section", "result-section");
  setTimeout(() => {
    document
      .querySelectorAll("#macro-progress .progress-macro-fill")
      .forEach((el) => {
        el.style.width = el.dataset.width + "%";
      });
  }, 300);

  // Reset AR state saat buka detail baru
  stopCamera();
  arActive = false;
  document.getElementById("ar-video").style.display = "none";
  document.getElementById("ar-overlay").style.display = "flex";
  document.getElementById("model-3d").style.display = "none";
  document.getElementById("model-3d").removeAttribute("src");
  document.getElementById("model-3d").src = "";
  document.getElementById("ar-hint").textContent = "🤚 Drag untuk putar • Scroll untuk zoom";
  // Destroy model-viewer container
  const container = document.getElementById("model-3d-container");
  if (container) {
    container.innerHTML = "";
    container.style.display = "none";
  }

  const btnToggle = document.getElementById("btn-ar-toggle");
  if (btnToggle) {
    btnToggle.textContent = "📷 Aktifkan AR";
    btnToggle.style.background = "";
  }

  // Save to riwayat
  addRiwayat(state.currentUser, {
    type: "food",
    name: f.name,
    calories: f.calories,
    protein: f.protein,
    img: f.img,
    time: fmtTime(),
    rawTime: new Date().toISOString(),
  });
}

// ─── CAMERA / AR ──────────────────────────────────────────────
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    state.cameraStream = stream;
    const vid = document.getElementById("ar-video");
    vid.srcObject = stream;
    vid.style.display = "block";
    document.getElementById("camera-off").style.display = "none";
  } catch (e) {
    document
      .getElementById("camera-off")
      .querySelector(".camera-off-text").textContent =
      "Izin kamera ditolak atau tidak tersedia.";
  }
}

let arActive = false;

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((t) => t.stop());
    state.cameraStream = null;
  }
  arActive = false;
}

// ─── TOGGLE AR + MODEL 3D ─────────────────────────────────────
async function toggleAR() {
  const btn = document.getElementById("btn-ar-toggle");

  if (!arActive) {
    // === AKTIFKAN AR ===
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      state.cameraStream = stream;
      const vid = document.getElementById("ar-video");
      vid.srcObject = stream;
      vid.style.display = "block";

      // Sembunyikan overlay gambar
      document.getElementById("ar-overlay").style.display = "none";

      const container = document.getElementById("model-3d-container");
      const foodName = state.currentFood?.name;
      const modelPath = foodModels[foodName];

      if (modelPath && container) {
        // Recreate model-viewer setiap kali agar rotate/zoom selalu aktif
        container.innerHTML = "";

        // Buat model-viewer
        const mv = document.createElement("model-viewer");
        mv.id = "model-3d";
        mv.setAttribute("src", modelPath);
        mv.setAttribute("alt", "Model 3D Makanan");
        mv.setAttribute("auto-rotate", "");
        mv.setAttribute("camera-controls", "");
        mv.setAttribute("shadow-intensity", "1");
        mv.style.cssText = "width:100%;height:100%;background:transparent;position:absolute;top:0;left:0;z-index:10;";
        container.appendChild(mv);

        // Buat label DILUAR model-viewer tapi di dalam container
        // agar position:absolute bekerja dengan benar
        const f = state.currentFood;
        if (f) {
          const labelStyles = [
            { top: "20%",  right: "10%", delay: "0.3s",  bg: "rgba(0,229,160,0.9)",  shadow: "rgba(0,229,160,0.5)"  },
            { top: "60%",  left:  "8%",  delay: "0.8s",  bg: "rgba(0,180,245,0.9)",  shadow: "rgba(0,180,245,0.5)"  },
            { bottom:"15%",right: "12%", delay: "1.3s",  bg: "rgba(255,107,107,0.9)",shadow: "rgba(255,107,107,0.5)"},
          ];
          f.labels.forEach((label, i) => {
            if (!label) return;
            const el = document.createElement("div");
            el.className = "ar-label";
            el.textContent = label;
            const s = labelStyles[i];
            el.style.cssText = [
              s.top    ? `top:${s.top};`    : "",
              s.bottom ? `bottom:${s.bottom};` : "",
              s.left   ? `left:${s.left};`  : "",
              s.right  ? `right:${s.right};`: "",
              `background:${s.bg};`,
              `box-shadow:0 2px 12px ${s.shadow};`,
              `animation-delay:${s.delay};`,
              "z-index:20;",
            ].join("");
            container.appendChild(el);
          });
        }

        container.style.display = "block";
        document.getElementById("ar-hint").textContent =
          "🤚 Drag untuk putar model • Pinch untuk zoom";
      }

      btn.textContent = "⏹️ Matikan AR";
      btn.style.background = "linear-gradient(135deg, #ff6b6b, #ff4757)";
      arActive = true;
    } catch (e) {
      showToast("Izin kamera ditolak atau tidak tersedia", "error");
    }
  } else {
    // === MATIKAN AR ===
    stopCamera();

    document.getElementById("ar-video").style.display = "none";

    // Destroy model-viewer sepenuhnya
    const container = document.getElementById("model-3d-container");
    if (container) {
      container.innerHTML = "";
      container.style.display = "none";
    }

    // Tampilkan kembali overlay gambar
    document.getElementById("ar-overlay").style.display = "flex";
    document.getElementById("ar-hint").textContent =
      "🤚 Drag untuk putar • Scroll untuk zoom";

    btn.textContent = "📷 Aktifkan AR";
    btn.style.background = "";
    arActive = false;
  }
}

// ─── AR DRAG / ZOOM ───────────────────────────────────────────
const arImg = document.getElementById("ar-food-img");
arImg.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.clientX;
  e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  arRotation += (e.clientX - lastX) * 0.7;
  arImg.style.transform = `rotate(${arRotation}deg) scale(${arScale})`;
  lastX = e.clientX;
});
document.addEventListener("mouseup", () => (isDragging = false));
document.getElementById("ar-viewport").addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    arScale = Math.max(
      0.5,
      Math.min(2.5, arScale + (e.deltaY < 0 ? 0.08 : -0.08)),
    );
    arImg.style.transform = `rotate(${arRotation}deg) scale(${arScale})`;
  },
  { passive: false },
);

arImg.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastTouchX = e.touches[0].clientX;
    }
    if (e.touches.length === 2) {
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
    e.preventDefault();
  },
  { passive: false },
);
arImg.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length === 1 && isDragging) {
      arRotation += (e.touches[0].clientX - lastTouchX) * 0.7;
      arImg.style.transform = `rotate(${arRotation}deg) scale(${arScale})`;
      lastTouchX = e.touches[0].clientX;
    }
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      arScale = Math.max(0.5, Math.min(2.5, (arScale * dist) / lastTouchDist));
      arImg.style.transform = `rotate(${arRotation}deg) scale(${arScale})`;
      lastTouchDist = dist;
    }
    e.preventDefault();
  },
  { passive: false },
);
arImg.addEventListener("touchend", () => (isDragging = false));

// ─── CHATBOT AI ───────────────────────────────────────────────
function fmtTime() {
  return new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function nowTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initChatForUser(username) {
  chatInitialized = false;
  chatMessages = [];
  renderChatFromStorage();
}

function renderChatFromStorage() {
  const username = state.currentUser;
  if (!username) return;
  const stored = getChatHistory(username);
  const msgsEl = document.getElementById("chat-messages");

  if (!chatInitialized) {
    chatInitialized = true;
    msgsEl.innerHTML = "";

    // Date divider
    const div = document.createElement("div");
    div.className = "chat-date-divider";
    div.textContent = "Hari ini";
    msgsEl.appendChild(div);

    if (stored.length === 0) {
      appendMsgEl(
        "Halo! 👋 Aku **NutriBot AI**, partner kamu untuk hidup lebih sehat 🥗\n\n" +
          "Saat ini aku masih terus dikembangkan, jadi mungkin ada jawaban yang belum akurat. Tapi tenang, kamu tetap bisa pakai ini sebagai referensi awal ya! 💡",
        "bot",
        nowTime(),
      );
      appendMsgEl(
        'Coba tanya: _"Apa manfaat protein?"_ atau _"Berapa kalori nasi goreng?"_ 🥗',
        "bot",
        nowTime(),
      );
      const welcomeMsgs = [
        {
          role: "bot",
          text: "Halo! 👋 Aku NutriBot AI, asisten nutrisi pintarmu. Tanyakan apa saja tentang makanan, kalori, tips diet, atau rekomendasi meal plan!",
          time: nowTime(),
        },
        {
          role: "bot",
          text: 'Coba tanya: "Apa manfaat protein?" atau "Berapa kalori nasi goreng?" 🥗',
          time: nowTime(),
        },
      ];
      saveChatHistory(username, welcomeMsgs);
      chatMessages = welcomeMsgs;
    } else {
      chatMessages = stored;
      stored.forEach((m) => appendMsgEl(m.text, m.role, m.time));
    }

    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
}

function appendMsgEl(text, role, time) {
  const msgsEl = document.getElementById("chat-messages");
  const wrap = document.createElement("div");
  wrap.className = "chat-msg " + role;
  // Convert basic markdown
  const html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");
  wrap.innerHTML = `<div class="chat-bubble">${html}</div><div class="chat-time">${time}</div>`;
  msgsEl.appendChild(wrap);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return wrap;
}

function appendTypingIndicator() {
  const msgsEl = document.getElementById("chat-messages");
  const wrap = document.createElement("div");
  wrap.className = "chat-msg bot";
  wrap.id = "typing-indicator";
  wrap.innerHTML =
    '<div class="chat-bubble typing-bubble"><span></span><span></span><span></span></div>';
  msgsEl.appendChild(wrap);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

function removeTypingIndicator() {
  const t = document.getElementById("typing-indicator");
  if (t) t.remove();
}

// ─── KONFIGURASI BACKEND ──────────────────────────────────────
// Ganti URL ini jika backend kamu berjalan di port/host berbeda
const BACKEND_URL = "https://smart-meal-production.up.railway.app";

async function sendChat() {
  if (isBotTyping) return;
  const inp = document.getElementById("chat-input");
  const text = inp.value.trim();
  if (!text) return;
  inp.value = "";
  document.getElementById("chat-suggestions").style.display = "none";
  document.getElementById("chat-send-btn").disabled = true;

  const userTime = nowTime();
  appendMsgEl(text, "user", userTime);
  chatMessages.push({ role: "user", text, time: userTime });

  isBotTyping = true;
  appendTypingIndicator();

  // System prompt untuk NutriBot
  const systemPrompt = ``;

  // Ambil 10 pesan terakhir sebagai konteks percakapan
  const apiMessages = chatMessages.slice(-10).map((m) => ({
    role: m.role === "bot" ? "assistant" : "user",
    content: m.text,
  }));

  try {
    // Panggil backend proxy — API key aman di server, tidak terekspos ke browser
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: apiMessages,
        systemPrompt: systemPrompt,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.content || "Maaf, terjadi kesalahan. Coba lagi ya!";

    removeTypingIndicator();
    const botTime = nowTime();
    appendMsgEl(reply, "bot", botTime);
    chatMessages.push({ role: "bot", text: reply, time: botTime });
    saveChatHistory(state.currentUser, chatMessages);
  } catch (e) {
    removeTypingIndicator();
    const errTime = nowTime();
    let errMsg = "Maaf, koneksi AI bermasalah saat ini. Pastikan server backend sudah berjalan dan coba lagi! 🔄";
    // Tampilkan pesan lebih spesifik jika server tidak bisa dihubungi
    if (e.message.includes("Failed to fetch") || e.message.includes("NetworkError")) {
      errMsg = "Tidak bisa terhubung ke server. Pastikan `node server.js` sudah berjalan di terminal! 🖥️";
    }
    appendMsgEl(errMsg, "bot", errTime);
    chatMessages.push({ role: "bot", text: errMsg, time: errTime });
    saveChatHistory(state.currentUser, chatMessages);
  }

  isBotTyping = false;
  document.getElementById("chat-send-btn").disabled = false;
}

function sendChip(btn) {
  const text = btn.textContent.replace(/[🥗💪🌅💧]/g, "").trim();
  document.getElementById("chat-input").value = text;
  sendChat();
}

function clearChat() {
  if (!state.currentUser) return;
  LS.remove("sm_chat_" + state.currentUser);
  chatMessages = [];
  chatInitialized = false;
  document.getElementById("chat-messages").innerHTML = "";
  document.getElementById("chat-suggestions").style.display = "flex";
  renderChatFromStorage();
}

// ─── APP INIT ─────────────────────────────────────────────────
function initApp() {
  const session = getSession();
  if (session) {
    const userData = getUserData(session);
    if (userData) {
      state.currentUser = session;
      document.getElementById("auth-wrapper").style.display = "none";
      document.getElementById("app-wrapper").style.display = "block";
      updateProfileUI(session, userData);
      initChatForUser(session);
      switchTab("home");
      return;
    }
  }
  // Show auth
  document.getElementById("auth-wrapper").style.display = "block";
  document.getElementById("app-wrapper").style.display = "none";
}

document.addEventListener("DOMContentLoaded", initApp);