/* ═══════════════════════════════════════════════════════════════
   SmartMeal — Complete App Logic
   Features: Auth (Firebase), Firestore, AI Chatbot, Riwayat, AR
═══════════════════════════════════════════════════════════════ */

// ─── FIREBASE SETUP ───────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhlxjnGNxSrCntljvPRpCsHblkPmoRWN8",
  authDomain: "smart-meal-7b230.firebaseapp.com",
  projectId: "smart-meal-7b230",
  storageBucket: "smart-meal-7b230.firebasestorage.app",
  messagingSenderId: "1092059886876",
  appId: "1:1092059886876:web:ee455f889b9310ed51f6d9",
  measurementId: "G-HBFJHKTLVH"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ─── FOOD DATA ────────────────────────────────────────────────
const foodData = [
  // ═══════════════════════════════════════
  // DIET — SARAPAN
  // ═══════════════════════════════════════
  {
    name: "Bubur Ayam",
    calories: 320,
    protein: 15,
    fat: 10,
    carbs: 42,
    type: "diet",
    meal: "sarapan",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bubur_ayam_chicken_porridge.JPG/800px-Bubur_ayam_chicken_porridge.JPG",
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
    img: "https://images.pexels.com/photos/12042071/pexels-photo-12042071.jpeg?auto=compress&cs=tinysrgb&w=400",
    desc: "Yogurt rendah lemak dengan topping buah segar seperti stroberi, pisang, dan kiwi. Kaya probiotik dan kalsium untuk mendukung kesehatan pencernaan dan imunitas tubuh.",
    labels: ["Low Calorie", "Probiotic", "High Calcium"],
  },
  {
    name: "Salad Buah",
    calories: 190,
    protein: 3,
    fat: 2,
    carbs: 42,
    type: "diet",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
    desc: "Campuran buah segar seperti semangka, melon, anggur, kiwi, dan stroberi dengan taburan biji chia dan perasan lemon. Rendah kalori, tinggi vitamin C dan antioksidan, cocok untuk awali hari dengan ringan dan segar.",
    labels: ["Low Calorie", "High Vitamin", "Refreshing"],
  },

  // ═══════════════════════════════════════
  // DIET — SIANG
  // ═══════════════════════════════════════
  {
    name: "Sup Sayuran Lentil",
    calories: 290,
    protein: 16,
    fat: 5,
    carbs: 45,
    type: "diet",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    desc: "Sup hangat dengan lentil merah, wortel, seledri, tomat, dan rempah pilihan. Rendah lemak namun tinggi protein nabati dan serat larut untuk menjaga kenyang lebih lama.",
    labels: ["Low Fat", "High Fiber", "Plant Protein"],
  },
  {
    name: "Soto Ayam Bening",
    calories: 310,
    protein: 24,
    fat: 8,
    carbs: 30,
    type: "diet",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Soto_Ayam_Ambengan.jpg/800px-Soto_Ayam_Ambengan.jpg",
    desc: "Soto bening ayam kampung dengan bihun, kubis, tauge, dan telur rebus. Kuah bening rendah lemak namun kaya rempah, cocok untuk makan siang diet yang mengenyangkan.",
    labels: ["Low Fat", "Light Meal", "Indonesian"],
  },

  // ═══════════════════════════════════════
  // DIET — MALAM
  // ═══════════════════════════════════════
  {
    name: "Pecel Lele",
    calories: 320,
    protein: 25,
    fat: 15,
    carbs: 22,
    type: "diet",
    meal: "malam",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pecel_lele.jpg/800px-Pecel_lele.jpg",
    desc: "Lele goreng bumbu rempah disajikan dengan sambal tomat, lalapan segar timun dan kemangi, tanpa nasi untuk versi diet. Tinggi protein dan omega-3 dari ikan lele segar.",
    labels: ["High Protein", "Omega-3", "Indonesian"],
  },
  {
    name: "Capcay Kuah",
    calories: 200,
    protein: 10,
    fat: 6,
    carbs: 24,
    type: "diet",
    meal: "malam",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cap_cay.jpg/800px-Cap_cay.jpg",
    desc: "Tumis aneka sayuran seperti wortel, brokoli, bakso ayam, dan jamur dalam kuah ringan. Sangat rendah kalori dan kaya serat, ideal untuk makan malam diet yang ringan.",
    labels: ["Low Calorie", "High Fiber", "Light Meal"],
  },

  // ═══════════════════════════════════════
  // HEALTHY — SARAPAN
  // ═══════════════════════════════════════
  {
    name: "Pancake Pisang Protein",
    calories: 370,
    protein: 16,
    fat: 8,
    carbs: 52,
    type: "healthy",
    meal: "sarapan",
    img: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=80",
    desc: "Pancake fluffy dari pisang matang, oat, telur, dan susu rendah lemak. Manis alami tanpa gula tambahan, tinggi protein dan karbohidrat kompleks untuk energi tahan lama.",
    labels: ["High Protein", "Natural Sweet", "Energizing"],
  },

  // ═══════════════════════════════════════
  // HEALTHY — SIANG
  // ═══════════════════════════════════════
  {
    name: "Ayam Penyet",
    calories: 520,
    protein: 35,
    fat: 25,
    carbs: 40,
    type: "healthy",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Ayam_penyet.jpg/800px-Ayam_penyet.jpg",
    desc: "Ayam goreng berbumbu rempah yang dipenyet lalu disajikan dengan sambal terasi pedas, nasi merah, tahu, tempe, dan lalapan segar. Menu tinggi protein khas Indonesia.",
    labels: ["High Protein", "Spicy", "Indonesian"],
  },
  {
    name: "Ayam + Urap",
    calories: 480,
    protein: 34,
    fat: 16,
    carbs: 36,
    type: "healthy",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Ayam_betutu.jpg/800px-Ayam_betutu.jpg",
    desc: "Ayam berbumbu rempah khas disajikan dengan urap sayuran segar yang dilumuri kelapa parut dan bumbu. Perpaduan protein tinggi dari ayam dan serat dari sayuran yang menyegarkan.",
    labels: ["High Protein", "Balanced", "Indonesian"],
  },
  {
    name: "Sate Ayam",
    calories: 420,
    protein: 36,
    fat: 14,
    carbs: 30,
    type: "healthy",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sate_ayam_Madura.jpg/800px-Sate_ayam_Madura.jpg",
    desc: "Sate ayam bakar dengan saus kacang khas, lontong, irisan bawang merah, dan cabai rawit. Sumber protein tinggi dengan karbohidrat seimbang dari lontong.",
    labels: ["High Protein", "Balanced", "Indonesian"],
  },
  {
    name: "Pasta Gandum Pesto",
    calories: 450,
    protein: 20,
    fat: 15,
    carbs: 56,
    type: "healthy",
    meal: "siang",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
    desc: "Pasta gandum utuh dengan saus pesto basil segar, cherry tomato, dan parmesan. Sumber karbohidrat kompleks dan lemak sehat dari minyak zaitun pilihan.",
    labels: ["Whole Grain", "Balanced", "Mediterranean"],
  },

  // ═══════════════════════════════════════
  // HEALTHY — MALAM
  // ═══════════════════════════════════════
  {
    name: "Grilled Chicken & Veggies",
    calories: 400,
    protein: 34,
    fat: 11,
    carbs: 32,
    type: "healthy",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80",
    desc: "Dada ayam panggang berbumbu dengan asparagus, paprika warna-warni, brokoli, dan ubi jalar panggang. Tinggi protein dan kaya antioksidan dari beragam sayuran segar.",
    labels: ["High Protein", "Balanced", "Clean Eat"],
  },
  {
    name: "Bakso Kuah",
    calories: 350,
    protein: 22,
    fat: 12,
    carbs: 38,
    type: "healthy",
    meal: "malam",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bakso_Boedjangan%2C_Kemang%2C_Jakarta.jpg/800px-Bakso_Boedjangan%2C_Kemang%2C_Jakarta.jpg",
    desc: "Bakso sapi kenyal dalam kuah kaldu bening dengan mie, tahu, sayuran, dan taburan bawang goreng. Menu malam yang hangat, mengenyangkan, dan bergizi seimbang.",
    labels: ["Balanced", "Light Meal", "Indonesian"],
  },
  {
    name: "Sup Ayam Kampung",
    calories: 300,
    protein: 26,
    fat: 9,
    carbs: 22,
    type: "healthy",
    meal: "malam",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Sop_buntut.jpg/800px-Sop_buntut.jpg",
    desc: "Sup ayam kampung bening dengan wortel, kentang, seledri, dan daun bawang. Kuah gurih alami kaya kolagen dan protein, cocok untuk makan malam sehat dan hangat.",
    labels: ["High Protein", "Light Meal", "Indonesian"],
  },

  // ═══════════════════════════════════════
  // BULKING — SIANG
  // ═══════════════════════════════════════
  {
    name: "Nasi Putih Ayam Goreng",
    calories: 750,
    protein: 40,
    fat: 26,
    carbs: 85,
    type: "bulking",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ayam_goreng_with_rice.jpg/800px-Ayam_goreng_with_rice.jpg",
    desc: "Nasi putih pulen dengan ayam goreng crispy berbumbu, tempe goreng, sambal terasi, dan lalapan. Menu makan siang padat kalori dan protein tinggi khas Indonesia.",
    labels: ["High Calorie", "High Protein", "Indonesian"],
  },
  {
    name: "Rendang + Nasi",
    calories: 720,
    protein: 45,
    fat: 30,
    carbs: 62,
    type: "bulking",
    meal: "siang",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Rendang_daging.JPG/800px-Rendang_daging.JPG",
    desc: "Rendang daging sapi empuk kaya rempah santan dengan nasi putih hangat. Sumber protein premium dan kalori tinggi dari daging sapi dan santan, ideal untuk program bulking.",
    labels: ["High Protein", "High Calorie", "Indonesian"],
  },

  // ═══════════════════════════════════════
  // BULKING — MALAM
  // ═══════════════════════════════════════
  {
    name: "Power Smoothie Protein",
    calories: 480,
    protein: 32,
    fat: 10,
    carbs: 60,
    type: "bulking",
    meal: "malam",
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
    desc: "Smoothie tebal dari pisang, susu full cream, protein powder, selai kacang, dan oat. Minuman padat nutrisi untuk memenuhi kebutuhan kalori dan protein harian saat bulking.",
    labels: ["High Protein", "Mass Build", "Energy Dense"],
  },
];

// ─── MODEL 3D MAPPING ────────────────────────────────────────
const foodModels = {
  "Bubur Ayam":             "assets/models/Bubur_Ayam.glb",
  "Yogurt Buah":            "assets/models/yogurt.glb",
  "Pecel Lele":             "assets/models/Pecel-Lele.glb",
  "Ayam Penyet":            "assets/models/ayam_penyet.glb",
  "Nasi Putih Ayam Goreng": "assets/models/nasi_lemak.glb",
  "Sup Sayuran Lentil":     "assets/models/Sup_Lentil.glb",
  "Pancake Pisang Protein": "assets/models/Pancake.glb",
  "Pasta Gandum Pesto":     "assets/models/pasta.glb",
  "Grilled Chicken & Veggies": "assets/models/Grilled_Chicken.glb",
  "Power Smoothie Protein": "assets/models/smoothie.glb",
  "Bakso Kuah":             "assets/models/bakso.glb",
  "Capcay Kuah":            "assets/models/capcay.glb",
  "Rendang + Nasi":         "assets/models/makanan_rendang.glb",
  "Soto Ayam Bening":       "assets/models/soto_jawa.glb",
  "Ayam + Urap":            "assets/models/ayam_betutu.glb",
  "Sup Ayam Kampung":       "assets/models/sopbuntut.glb",
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
  cameraStream: null,
  currentUser: null,
  currentUsername: null,
};

// State khusus Analisis
const analisisState = {
  weight: null,
  height: null,
  age: null,
  gender: null,
  activity: null,
  goal: null,
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

let _chartVisible = false;

// ─── UTILITIES ────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── FIRESTORE HELPERS ────────────────────────────────────────
async function fsGetUser(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

async function fsSetUser(uid, data) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

async function fsGetRiwayat(uid) {
  try {
    const q = query(
      collection(db, "riwayat", uid, "entries"),
      orderBy("rawTime", "desc"),
      limit(50),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), _docId: d.id }));
  } catch {
    return [];
  }
}

async function fsAddRiwayat(uid, entry) {
  await addDoc(collection(db, "riwayat", uid, "entries"), entry);
}

async function fsDeleteRiwayat(uid, docId) {
  await deleteDoc(doc(db, "riwayat", uid, "entries", docId));
}

async function fsDeleteAllRiwayat(uid) {
  const snap = await getDocs(collection(db, "riwayat", uid, "entries"));
  const dels = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(dels);
}

// ─── FOOD LOG (Progress) ───────────────────────────────────────
async function fsAddFoodLog(uid, entry) {
  await addDoc(collection(db, "foodlog", uid, "entries"), entry);
}

async function fsGetFoodLog(uid) {
  try {
    const q = query(
      collection(db, "foodlog", uid, "entries"),
      orderBy("rawTime", "desc"),
      limit(100),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), _docId: d.id }));
  } catch {
    return [];
  }
}

async function fsDeleteAllFoodLog(uid) {
  const snap = await getDocs(collection(db, "foodlog", uid, "entries"));
  const dels = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(dels);
}

async function clearProgressData() {
  if (
    !confirm(
      "Hapus semua data progress? Riwayat makanan yang dikonfirmasi akan hilang permanen.",
    )
  )
    return;
  await fsDeleteAllFoodLog(state.currentUser);
  showToast("Semua data progress dihapus 🗑️", "success");
  renderProgressInProfile();
}
window.clearProgressData = clearProgressData;

async function fsGetChat(uid) {
  try {
    const q = query(
      collection(db, "chats", uid, "messages"),
      orderBy("rawTime", "asc"),
      limit(60),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), _docId: d.id }));
  } catch {
    return [];
  }
}

async function fsSaveChat(uid, msg) {
  await addDoc(collection(db, "chats", uid, "messages"), msg);
}

async function fsClearChat(uid) {
  const snap = await getDocs(collection(db, "chats", uid, "messages"));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
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

async function doLogin() {
  const id = document.getElementById("login-identifier").value.trim();
  const pw = document.getElementById("login-password").value;
  if (!id || !pw) {
    showToast("Lengkapi semua field!", "error");
    return;
  }

  const loginBtn = document.querySelector("#login-screen .btn-primary");
  if (loginBtn) {
    loginBtn.textContent = "Masuk...";
    loginBtn.disabled = true;
  }

  try {
    let email = id;
    if (!id.includes("@")) {
      const q = query(
        collection(db, "users"),
        where("username", "==", id),
        limit(1),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        showToast("Username tidak ditemukan!", "error");
        return;
      }
      email = snap.docs[0].data().email;
    }
    await signInWithEmailAndPassword(auth, email, pw);
  } catch (e) {
    const msg =
      e.code === "auth/invalid-credential"
        ? "Email/password salah!"
        : e.code === "auth/user-not-found"
          ? "Akun tidak ditemukan!"
          : e.code === "auth/too-many-requests"
            ? "Terlalu banyak percobaan. Coba lagi nanti!"
            : "Login gagal: " + e.message;
    showToast(msg, "error");
  } finally {
    if (loginBtn) {
      loginBtn.textContent = "Masuk →";
      loginBtn.disabled = false;
    }
  }
}

async function doRegister() {
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

  const regBtn = document.querySelector("#register-screen .btn-primary");
  if (regBtn) { regBtn.textContent = "Mendaftar..."; regBtn.disabled = true; }

  try {
    const q = query(collection(db, "users"), where("username", "==", username), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      showToast("Username sudah dipakai!", "error");
      return;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    const joined = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    await fsSetUser(cred.user.uid, { username, email, avatar: "👤", joined });

    showToast("Akun berhasil dibuat! 🎉", "success");
    // Tampilkan welcome popup yang mengarahkan ke panduan
    document.dispatchEvent(new CustomEvent("smartmeal:registered"));

  } catch (e) {
    const msg =
      e.code === "auth/email-already-in-use" ? "Email sudah terdaftar!" :
      e.code === "auth/weak-password" ? "Password terlalu lemah!" :
      "Registrasi gagal: " + e.message;
    showToast(msg, "error");
  } finally {
    if (regBtn) { regBtn.textContent = "Daftar"; regBtn.disabled = false; }
  }
}

async function loginSuccess(user) {
  const userData = await fsGetUser(user.uid);
  state.currentUser = user.uid;
  state.currentUsername = userData?.username || user.email;
  document.getElementById("auth-wrapper").style.display = "none";
  document.getElementById("app-wrapper").style.display = "block";
  updateProfileUI(state.currentUsername, userData);
  await initChatForUser(user.uid);

  const bdData = userData?.bodyData;
  if (
    bdData &&
    bdData.weight &&
    bdData.height &&
    bdData.age &&
    bdData.gender &&
    bdData.activity
  ) {
    let bmr =
      bdData.gender === "pria"
        ? 88.36 + 13.4 * bdData.weight + 4.8 * bdData.height - 5.7 * bdData.age
        : 447.6 + 9.2 * bdData.weight + 3.1 * bdData.height - 4.3 * bdData.age;
    const actMult = { ringan: 1.375, sedang: 1.55, berat: 1.725 };
    const tdee = Math.round(bmr * actMult[bdData.activity]);
    const goalAdj = { diet: -400, healthy: 0, bulking: 450 };
    const target = Math.max(1200, tdee + goalAdj[bdData.goal]);

    state.weight = bdData.weight;
    state.height = bdData.height;
    state.age = bdData.age;
    state.gender = bdData.gender;
    state.activity = bdData.activity;
    state.goal = bdData.goal;
    state.bmr = Math.round(bmr);
    state.tdee = tdee;
    state.targetCalories = target;
    state.mealCalories = Math.round(target * 0.35);
    Object.assign(analisisState, bdData);
  }
  showToast(
    "Selamat datang, " + (userData?.username || user.email) + "! 👋",
    "success",
  );
  if (window.setClockUsername) window.setClockUsername(state.currentUsername);
  switchTab("home");
}

async function doLogout() {
  stopCamera();
  document.getElementById("logout-modal").style.display = "none";
  await signOut(auth);
  state.currentUser = null;
  state.currentUsername = null;
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
async function showProfileSub(id) {
  document.getElementById("profile-main-view").style.display = "none";
  document
    .querySelectorAll(".profile-sub-view")
    .forEach((v) => (v.style.display = "none"));
  document.getElementById("sub-" + id).style.display = "block";
  const uname = state.currentUsername || state.currentUser;
  const userData = await fsGetUser(state.currentUser);

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
  if (id === "progress") {
    renderProgressInProfile();
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

async function saveProfile() {
  const newUsername = document.getElementById("edit-username").value.trim();
  const newEmail = document.getElementById("edit-email").value.trim();
  const newPw = document.getElementById("edit-password").value;

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

  try {
    const uid = state.currentUser;
    const avatar = tempAvatar || (await fsGetUser(uid))?.avatar || "👤";
    const emailChanged = newEmail !== auth.currentUser.email;

    if (emailChanged || newPw) {
      const pwField = document.getElementById("edit-current-password");
      const currentPw =
        pwField?.value ||
        prompt("Masukkan password saat ini untuk konfirmasi perubahan:");
      if (!currentPw) {
        showToast("Password lama diperlukan untuk perubahan akun!", "error");
        return;
      }
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPw,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
    }

    if (emailChanged) {
      await updateEmail(auth.currentUser, newEmail);
    }
    if (newPw) {
      await updatePassword(auth.currentUser, newPw);
    }

    await fsSetUser(uid, { username: newUsername, email: newEmail, avatar });

    state.currentUsername = newUsername;
    tempAvatar = null;
    updateProfileUI(newUsername, {
      username: newUsername,
      email: newEmail,
      avatar,
    });
    showToast("Profil berhasil disimpan! ✓", "success");
    hideProfileSub();
  } catch (e) {
    const msg =
      e.code === "auth/wrong-password"
        ? "Password lama salah!"
        : e.code === "auth/invalid-credential"
          ? "Password lama salah!"
          : e.code === "auth/requires-recent-login"
            ? "Silakan logout & login ulang dulu!"
            : e.code === "auth/email-already-in-use"
              ? "Email sudah dipakai akun lain!"
              : "Gagal simpan profil: " + e.message;
    showToast(msg, "error");
  }
}

// ─── RIWAYAT ──────────────────────────────────────────────────
let riwayatFilter = "all";
let _riwayatCache = [];
let _riwayatCacheDirty = true;

function setRiwayatFilter(filter, btn) {
  riwayatFilter = filter;
  document
    .querySelectorAll(".riwayat-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  filterRiwayat();
}

function filterRiwayat() {
  const query = (document.getElementById("riwayat-search")?.value || "")
    .toLowerCase()
    .trim();
  const now = new Date();
  const filtered = _riwayatCache.filter((r) => {
    if (riwayatFilter !== "all") {
      const rDate = new Date(r.rawTime || r.time);
      if (
        riwayatFilter === "today" &&
        rDate.toDateString() !== now.toDateString()
      )
        return false;
      if (riwayatFilter === "week") {
        const w = new Date(now);
        w.setDate(now.getDate() - 7);
        if (rDate < w) return false;
      }
      if (
        riwayatFilter === "month" &&
        (rDate.getMonth() !== now.getMonth() ||
          rDate.getFullYear() !== now.getFullYear())
      )
        return false;
    }
    if (query) {
      const s = (
        (r.name || "") +
        " " +
        (r.goal || "") +
        " " +
        (r.meal || "")
      ).toLowerCase();
      if (!s.includes(query)) return false;
    }
    return true;
  });
  renderRiwayatList(filtered);
}

async function renderRiwayat() {
  riwayatFilter = "all";
  document
    .querySelectorAll(".riwayat-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  const allBtn = document.getElementById("filter-all");
  if (allBtn) allBtn.classList.add("active");
  const searchEl = document.getElementById("riwayat-search");
  if (searchEl) searchEl.value = "";

  if (!_riwayatCacheDirty && _riwayatCache.length > 0) {
    renderStats(_riwayatCache);
    renderRiwayatList(_riwayatCache);
    return;
  }

  const list = document.getElementById("riwayat-list");
  list.innerHTML = '<div class="riwayat-empty">Memuat riwayat... ⏳</div>';

  _riwayatCache = await fsGetRiwayat(state.currentUser);
  _riwayatCacheDirty = false;
  renderStats(_riwayatCache);
  renderRiwayatList(_riwayatCache);
}

function renderStats(riwayat) {
  const total = riwayat.length;
  const foodEntries = riwayat.filter((r) => r.type === "food");
  const kaloriEntries = riwayat.filter((r) => r.type === "kalori");

  const avgKalori = foodEntries.length
    ? Math.round(
      foodEntries.reduce((s, r) => s + (r.calories || 0), 0) /
      foodEntries.length,
    )
    : kaloriEntries.length
      ? Math.round(
        kaloriEntries.reduce((s, r) => s + (r.targetCalories || 0), 0) /
        kaloriEntries.length,
      )
      : 0;

  const goalCount = {};
  foodEntries.forEach((r) => {
    const g = (r.goal || "").replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (g) goalCount[g] = (goalCount[g] || 0) + 1;
  });

  const topGoal = Object.entries(goalCount).sort((a, b) => b[1] - a[1])[0];
  const goalEmoji = { diet: "🥗", healthy: "💚", bulking: "💪" };
  const goalLabel = topGoal
    ? (goalEmoji[topGoal[0]] || "") +
    " " +
    topGoal[0].charAt(0).toUpperCase() +
    topGoal[0].slice(1)
    : "-";

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-kalori").textContent = avgKalori
    ? avgKalori + " kcal"
    : "-";
  document.getElementById("stat-goal").textContent = goalLabel;
}

function renderRiwayatList(riwayat) {
  const list = document.getElementById("riwayat-list");
  if (!riwayat.length) {
    list.innerHTML =
      '<div class="riwayat-empty">Tidak ada riwayat yang cocok. 🔍<br>Coba ubah filter atau kata kunci pencarian.</div>';
    return;
  }

  const groups = {};
  riwayat.forEach((r, idx) => {
    const dateKey = (() => {
      try {
        const d = new Date(r.rawTime || r.time);
        if (isNaN(d)) return r.time?.split(",")[0] || "Lainnya";
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return "Hari Ini";
        if (d.toDateString() === yesterday.toDateString()) return "Kemarin";
        return d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch {
        return "Lainnya";
      }
    })();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({ ...r, _idx: idx });
  });

  list.innerHTML = Object.entries(groups)
    .map(
      ([date, items]) => `
    <div class="riwayat-date-group">
      <div class="riwayat-date-header">
        <span>${date}</span>
        <div class="riwayat-date-line"></div>
        <span class="riwayat-date-count">${items.length}</span>
      </div>
      ${items.map((r) => renderRiwayatItem(r)).join("")}
    </div>
  `,
    )
    .join("");
}

function renderRiwayatItem(r) {
  const docId = r._docId || "";
  if (r.type === "kalori") {
    return `<div class="riwayat-item riwayat-kalori">
      <div class="riwayat-icon">🔥</div>
      <div class="riwayat-info">
        <div class="riwayat-name">${r.goal} · ${r.meal}</div>
        <div class="riwayat-detail">Target: ${r.targetCalories} kcal · TDEE: ${r.tdee} kcal</div>
        <div class="riwayat-time">${r.time}</div>
      </div>
      <button class="riwayat-del-btn" onclick="deleteRiwayatItem('${docId}')" title="Hapus">✕</button>
    </div>`;
  }
  return `<div class="riwayat-item">
    <img src="${r.img}" class="riwayat-img" alt="${r.name}" loading="lazy" decoding="async" onerror="this.style.display='none'">
    <div class="riwayat-info">
      <div class="riwayat-name">${r.name}</div>
      <div class="riwayat-detail">🔥 ${r.calories} kcal · ${r.protein || 0}g protein</div>
      <div class="riwayat-time">${r.time}</div>
    </div>
    <button class="riwayat-del-btn" onclick="deleteRiwayatItem('${docId}')" title="Hapus">✕</button>
  </div>`;
}

async function deleteRiwayatItem(docId) {
  await fsDeleteRiwayat(state.currentUser, docId);
  _riwayatCache = _riwayatCache.filter((r) => r._docId !== docId);
  _riwayatCacheDirty = false;
  renderStats(_riwayatCache);
  filterRiwayat();
  showToast("Riwayat dihapus", "success");
}

async function clearAllRiwayat() {
  if (!confirm("Hapus semua riwayat? Tidak bisa dikembalikan.")) return;
  await fsDeleteAllRiwayat(state.currentUser);
  _riwayatCache = [];
  _riwayatCacheDirty = false;
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
  updateNavHighlight(target);
  document.getElementById("bottom-nav").style.transform = "translateY(0)";
}

function updateNavHighlight(sectionId) {
  const map = {
    "home-section": "home",
    "result-section": "home",
    "detail-section": "home",
    "analisis-section": "analisis",
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
  stopCamera();
  const map = {
    home: "home-section",
    analisis: "analisis-section",
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
  document.getElementById("nav-" + tab)?.classList.add("active");
  document.getElementById("bottom-nav").style.transform = "translateY(0)";
  if (tab === "profile") hideProfileSub();
  if (tab === "chat") renderChatFromStorage();
  if (tab === "analisis") initAnalisisTab();
}

// ─── HOME STEP LOGIC ──────────────────────────────────────────
function selectGoal(goal, el) {
  state.goal = goal;
  analisisState.goal = goal;
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

  const h = new Date().getHours();
  // Sederhanakan: 4 zona waktu makan
  let autoMeal, autoLabel, autoIcon;
  if (h >= 4 && h < 10) {
    autoMeal = "sarapan"; autoLabel = "Sarapan"; autoIcon = "🌅";
  } else if (h >= 10 && h < 15) {
    autoMeal = "siang"; autoLabel = "Makan Siang"; autoIcon = "☀️";
  } else if (h >= 15 && h < 21) {
    autoMeal = "malam"; autoLabel = "Makan Malam"; autoIcon = "🌙";
  } else {
    autoMeal = "sarapan"; autoLabel = "Sarapan"; autoIcon = "🌅";
  }

  const badge = document.getElementById("meal-autodetect-text");
  if (badge) badge.textContent = autoIcon + " Terdeteksi: " + autoLabel;

  const cards = document.querySelectorAll("#meal-grid .choice-card");
  cards.forEach((c) => c.classList.remove("selected"));
  const mealIndex = { sarapan: 0, siang: 1, malam: 2 }[autoMeal];
  if (cards[mealIndex]) {
    cards[mealIndex].classList.add("selected");
    selectMeal(autoMeal, cards[mealIndex]);
  }
}

function backToStep1() {
  document.getElementById("home-step2").style.display = "none";
  document.getElementById("home-step1").style.display = "block";
}

function goToResult() {
  if (!state.goal || !state.meal) {
    showToast("Pilih goal dan waktu makan dulu!", "error");
    return;
  }

  const mealMap = {
    sarapan: "Sarapan",
    siang: "Makan Siang",
    malam: "Makan Malam",
  };
  const goalMap = { diet: "Diet", healthy: "Healthy", bulking: "Bulking" };

  document.getElementById("result-breadcrumb").innerHTML =
    "<span>" +
    goalMap[state.goal] +
    "</span><span class='sep'>›</span><span>" +
    mealMap[state.meal] +
    "</span>";

  const hasBodyData = state.targetCalories > 0;
  document.getElementById("result-sub").textContent = hasBodyData
    ? "Target kalorimu: " +
    state.targetCalories +
    " kcal/hari · " +
    mealMap[state.meal]
    : "Rekomendasi untuk " +
    goalMap[state.goal] +
    " · " +
    mealMap[state.meal] +
    " — Analisis tubuhmu untuk hasil lebih akurat";

  currentFilteredFoods = foodData.filter(
    (f) => f.type === state.goal && f.meal === state.meal,
  );
  document.getElementById("food-count-badge").textContent =
    currentFilteredFoods.length + " makanan";
  document.getElementById("food-grid").innerHTML = currentFilteredFoods
    .map(
      (f, i) => `
    <div class="food-card" onclick="openDetail(${i})">
      <img class="food-img" src="${f.img}" alt="${f.name}" loading="lazy" decoding="async">
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

  navigate("result-section", "home-section");

  setTimeout(() => {
    document.getElementById("home-step2").style.display = "none";
    document.getElementById("home-step1").style.display = "block";
    document
      .querySelectorAll("#goal-grid .choice-card")
      .forEach((c) => c.classList.remove("selected"));
    document.getElementById("next-step1").disabled = true;
  }, 500);
}

// ─── TAB ANALISIS ─────────────────────────────────────────────
function anSelectGender(g) {
  analisisState.gender = g;
  document
    .getElementById("an-radio-pria")
    .classList.toggle("selected", g === "pria");
  document
    .getElementById("an-radio-wanita")
    .classList.toggle("selected", g === "wanita");
}

function anSelectActivity(a) {
  analisisState.activity = a;
  ["ringan", "sedang", "berat"].forEach((x) =>
    document
      .getElementById("an-radio-" + x)
      .classList.toggle("selected", x === a),
  );
}

function showAnalisisForm() {
  document.getElementById("analisis-form-view").style.display = "block";
  document.getElementById("analisis-result-view").style.display = "none";
}

async function initAnalisisTab() {
  const uid = state.currentUser;
  if (!uid) return;
  const userData = await fsGetUser(uid);
  const bd = userData?.bodyData;
  if (!bd) return;

  if (bd.weight) document.getElementById("an-weight").value = bd.weight;
  if (bd.height) document.getElementById("an-height").value = bd.height;
  if (bd.age) document.getElementById("an-age").value = bd.age;
  if (bd.gender) anSelectGender(bd.gender);
  if (bd.activity) anSelectActivity(bd.activity);

  Object.assign(analisisState, bd);

  if (bd.weight && bd.height && bd.age && bd.gender && bd.activity) {
    showAnalisisResult(bd);
  }
}

async function runAnalisis() {
  const w = parseFloat(document.getElementById("an-weight").value);
  const h = parseFloat(document.getElementById("an-height").value);
  const a = parseFloat(document.getElementById("an-age").value);

  if (!w || !h || !a || !analisisState.gender || !analisisState.activity) {
    showToast("Lengkapi semua data!", "error");
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

  analisisState.weight = w;
  analisisState.height = h;
  analisisState.age = a;
  analisisState.goal = state.goal || "healthy";

  await fsSetUser(state.currentUser, { bodyData: { ...analisisState } });

  let bmr;
  if (analisisState.gender === "pria") {
    bmr = 88.36 + 13.4 * w + 4.8 * h - 5.7 * a;
  } else {
    bmr = 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
  }
  const actMult = { ringan: 1.375, sedang: 1.55, berat: 1.725 };
  const tdee = Math.round(bmr * actMult[analisisState.activity]);
  const goalAdj = { diet: -400, healthy: 0, bulking: 450 };
  const target = Math.max(1200, tdee + goalAdj[analisisState.goal]);

  state.weight = w;
  state.height = h;
  state.age = a;
  state.gender = analisisState.gender;
  state.activity = analisisState.activity;
  state.bmr = Math.round(bmr);
  state.tdee = tdee;
  state.targetCalories = target;
  state.mealCalories = Math.round(target * 0.35);

  showAnalisisResult({ ...analisisState, bmr: Math.round(bmr), tdee, target });
  showToast("Analisis berhasil disimpan! ✓", "success");
}

function showAnalisisResult(data) {
  const { weight, height, age, gender, activity, goal, bmr, tdee, target } =
    data;

  let _bmr = bmr,
    _tdee = tdee,
    _target = target;
  if (!_bmr && weight && height && age && gender && activity && goal) {
    _bmr =
      gender === "pria"
        ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
        : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
    const actMult = { ringan: 1.375, sedang: 1.55, berat: 1.725 };
    _tdee = Math.round(_bmr * actMult[activity]);
    const goalAdj = { diet: -400, healthy: 0, bulking: 450 };
    _target = Math.max(1200, _tdee + goalAdj[goal]);
    _bmr = Math.round(_bmr);
  }

  document.getElementById("analisis-form-view").style.display = "none";
  document.getElementById("analisis-result-view").style.display = "block";

  const bmi =
    weight && height ? (weight / (height / 100) ** 2).toFixed(1) : "-";
  const bmiNum = parseFloat(bmi);
  const bmiLabel =
    bmiNum < 18.5
      ? "Kurus"
      : bmiNum < 25
        ? "Normal"
        : bmiNum < 30
          ? "Overweight"
          : "Obesitas";
  const bmiColor =
    bmiNum < 18.5
      ? "#00b4f5"
      : bmiNum < 25
        ? "#00e5a0"
        : bmiNum < 30
          ? "#ffb347"
          : "#ff6b6b";

  document.getElementById("analisis-result-sub").textContent =
    (weight || "-") +
    "kg · " +
    (height || "-") +
    "cm · " +
    (age || "-") +
    " thn · " +
    (gender === "pria" ? "Pria" : "Wanita") +
    " · BMI " +
    bmi +
    " (" +
    bmiLabel +
    ")";

  document.getElementById("analisis-calorie-cards").innerHTML =
    '<div class="calorie-card"><div class="calorie-card-icon">⚙️</div>' +
    '<div class="calorie-card-val">' +
    (_bmr || "-") +
    "</div>" +
    '<div class="calorie-card-label">BMR (kcal/hari)</div></div>' +
    '<div class="calorie-card highlight"><div class="calorie-card-icon">🔥</div>' +
    '<div class="calorie-card-val">' +
    (_tdee || "-") +
    "</div>" +
    '<div class="calorie-card-label">TDEE</div></div>' +
    '<div class="calorie-card highlight"><div class="calorie-card-icon">🎯</div>' +
    '<div class="calorie-card-val">' +
    (_target || "-") +
    "</div>" +
    '<div class="calorie-card-label">Target Harian</div></div>' +
    '<div class="calorie-card"><div class="calorie-card-icon">📏</div>' +
    '<div class="calorie-card-val" style="color:' +
    bmiColor +
    '">' +
    bmi +
    "</div>" +
    '<div class="calorie-card-label">BMI · ' +
    bmiLabel +
    "</div></div>";

  const bmiPct = Math.min(100, Math.max(0, ((bmiNum - 10) / 30) * 100));
  document.getElementById("analisis-bmi-wrap").innerHTML =
    '<div class="bmi-visual-wrap" style="margin-bottom:16px">' +
    '<div class="bmi-visual-header">' +
    "<span>📏 Status Berat Badan</span>" +
    '<span class="bmi-value-badge" style="color:' +
    bmiColor +
    ";background:" +
    bmiColor +
    "15;border-color:" +
    bmiColor +
    '30">' +
    bmi +
    " · " +
    bmiLabel +
    "</span></div>" +
    '<div style="background:rgba(255,255,255,0.05);border-radius:10px;height:8px;overflow:hidden;margin-bottom:8px">' +
    '<div style="width:' +
    bmiPct +
    "%;height:100%;background:" +
    bmiColor +
    ';border-radius:10px;transition:width 1s ease"></div></div>' +
    '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted)">' +
    "<span>Kurus &lt;18.5</span><span>Normal 18.5–24.9</span><span>Overweight 25–29.9</span><span>Obesitas ≥30</span></div></div>";

  renderRekomendasiMakan(bmiNum, goal, _target, _tdee);
}

function renderRekomendasiMakan(bmiNum, goal, target, tdee) {
  const el = document.getElementById("analisis-rekomendasi");
  if (!el) return;

  const mealPct = { sarapan: 0.25, siang: 0.4, malam: 0.35 };
  const sarapanKal = Math.round((target || 0) * mealPct.sarapan);
  const siangKal = Math.round((target || 0) * mealPct.siang);
  const malamKal = Math.round((target || 0) * mealPct.malam);

  const rekomendasiMakanan = getRekomendasiMakanan(bmiNum, goal);

  el.innerHTML =
    '<div class="section-title" style="margin-top:8px"><span>🍽️ Jadwal Makan Harian</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">' +
    buildMealScheduleCard(
      "🌅",
      "Sarapan",
      "06.00 – 09.00",
      sarapanKal,
      "#00e5a0",
    ) +
    buildMealScheduleCard(
      "☀️",
      "Makan Siang",
      "12.00 – 14.00",
      siangKal,
      "#00b4f5",
    ) +
    buildMealScheduleCard(
      "🌙",
      "Makan Malam",
      "18.00 – 21.00",
      malamKal,
      "#ffb347",
    ) +
    buildMealScheduleCard(
      "🥤",
      "Snack (opsional)",
      "10.00 & 16.00",
      Math.round((target || 0) * 0.1),
      "rgba(255,255,255,0.3)",
    ) +
    "</div>" +
    '<div class="section-title"><span>✅ Makanan Dianjurkan</span></div>' +
    '<div class="tips-section" style="margin-bottom:16px">' +
    '<div class="tips-list">' +
    rekomendasiMakanan.anjurkan
      .map(
        (item) =>
          '<div class="tip-item"><span style="font-size:16px">' +
          item.icon +
          "</span>" +
          '<div><strong style="font-size:13px;color:var(--text)">' +
          item.nama +
          "</strong>" +
          '<div style="font-size:11px;color:var(--text-muted)">' +
          item.desc +
          "</div></div></div>",
      )
      .join("") +
    "</div></div>" +
    '<div class="section-title"><span>❌ Makanan Dihindari</span></div>' +
    '<div class="tips-section" style="margin-bottom:16px">' +
    '<div class="tips-list">' +
    rekomendasiMakanan.hindari
      .map(
        (item) =>
          '<div class="tip-item"><span style="font-size:16px">' +
          item.icon +
          "</span>" +
          '<div><strong style="font-size:13px;color:var(--text)">' +
          item.nama +
          "</strong>" +
          '<div style="font-size:11px;color:var(--text-muted)">' +
          item.desc +
          "</div></div></div>",
      )
      .join("") +
    "</div></div>" +
    '<div class="section-title"><span>💡 Tips Khusus</span></div>' +
    '<div class="tips-section">' +
    '<div class="tips-list">' +
    rekomendasiMakanan.tips
      .map(
        (tip) =>
          '<div class="tip-item"><span class="tip-dot"></span><span>' +
          tip +
          "</span></div>",
      )
      .join("") +
    "</div></div>";
}

function buildMealScheduleCard(icon, label, time, kal, color) {
  return (
    '<div style="display:flex;align-items:center;gap:12px;background:var(--surface);' +
    'border:1px solid var(--border);border-radius:14px;padding:12px 14px">' +
    '<div style="font-size:24px;flex-shrink:0">' +
    icon +
    "</div>" +
    '<div style="flex:1;min-width:0">' +
    "<div style=\"font-family:'Syne',sans-serif;font-size:13px;font-weight:700\">" +
    label +
    "</div>" +
    '<div style="font-size:11px;color:var(--text-muted)">' +
    time +
    "</div>" +
    "</div>" +
    '<div style="text-align:right;flex-shrink:0">' +
    "<div style=\"font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:" +
    color +
    '">' +
    kal +
    "</div>" +
    '<div style="font-size:10px;color:var(--text-muted)">kcal</div>' +
    "</div></div>"
  );
}

function getRekomendasiMakanan(bmiNum, goal) {
  const base = {
    diet: {
      anjurkan: [
        {
          icon: "🥗",
          nama: "Sayuran hijau",
          desc: "Bayam, kangkung, brokoli — tinggi serat, rendah kalori",
        },
        {
          icon: "🐟",
          nama: "Ikan & seafood",
          desc: "Salmon, tuna, udang — protein tinggi, lemak sehat",
        },
        {
          icon: "🍗",
          nama: "Dada ayam tanpa kulit",
          desc: "Protein tinggi, lemak sangat rendah",
        },
        {
          icon: "🥚",
          nama: "Telur rebus",
          desc: "Protein padat, mengenyangkan lebih lama",
        },
        {
          icon: "🍎",
          nama: "Buah segar",
          desc: "Apel, pir, stroberi — serat tinggi, gula alami rendah",
        },
      ],
      hindari: [
        {
          icon: "🍟",
          nama: "Makanan gorengan",
          desc: "Kalori sangat tinggi dari minyak berlebih",
        },
        {
          icon: "🥤",
          nama: "Minuman manis & soda",
          desc: "Gula cair tidak mengenyangkan, langsung masuk kalori",
        },
        {
          icon: "🍞",
          nama: "Karbohidrat olahan",
          desc: "Roti putih, nasi putih berlebih — cepat menaikkan gula darah",
        },
        {
          icon: "🍰",
          nama: "Dessert & kue manis",
          desc: "Kalori kosong tanpa nutrisi berarti",
        },
      ],
      tips: [
        "Makan 5–6 kali porsi kecil untuk jaga metabolisme tetap aktif",
        "Minum 2 gelas air sebelum makan untuk bantu rasa kenyang",
        "Prioritaskan protein di setiap waktu makan agar otot terjaga",
        "Batasi nasi putih, ganti dengan nasi merah atau quinoa",
        "Jangan skip sarapan — ini kunci kontrol nafsu makan sepanjang hari",
      ],
    },
    healthy: {
      anjurkan: [
        {
          icon: "🥩",
          nama: "Protein lean",
          desc: "Ayam, ikan, tahu, tempe — untuk regenerasi sel",
        },
        {
          icon: "🌾",
          nama: "Karbohidrat kompleks",
          desc: "Oat, nasi merah, ubi — energi stabil sepanjang hari",
        },
        {
          icon: "🥑",
          nama: "Lemak sehat",
          desc: "Alpukat, minyak zaitun, kacang-kacangan",
        },
        {
          icon: "🫐",
          nama: "Buah & sayur beragam",
          desc: "Penuhi vitamin, mineral, dan antioksidan harian",
        },
        {
          icon: "🥛",
          nama: "Susu & produk fermentasi",
          desc: "Yogurt, kefir — untuk kesehatan usus dan tulang",
        },
      ],
      hindari: [
        {
          icon: "🍔",
          nama: "Fast food & junk food",
          desc: "Tinggi sodium, lemak trans, dan kalori kosong",
        },
        {
          icon: "🧂",
          nama: "Makanan terlalu asin",
          desc: "Risiko hipertensi dan retensi cairan",
        },
        {
          icon: "🍭",
          nama: "Gula tambahan berlebih",
          desc: "Minuman manis, permen, sirup",
        },
        {
          icon: "🥓",
          nama: "Daging olahan",
          desc: "Sosis, nugget, kornet — tinggi pengawet dan sodium",
        },
      ],
      tips: [
        "Ikuti pola makan 3x sehari dengan 1–2 snack sehat",
        "Isi setengah piring dengan sayur dan buah di setiap makan",
        "Minum air putih minimal 8 gelas per hari",
        "Masak sendiri lebih sering agar tahu bahan yang dikonsumsi",
        "Variasikan sumber protein agar asupan amino acid lengkap",
      ],
    },
    bulking: {
      anjurkan: [
        {
          icon: "🥩",
          nama: "Daging merah tanpa lemak",
          desc: "Sapi, kambing — tinggi protein dan zinc untuk otot",
        },
        {
          icon: "🍚",
          nama: "Nasi putih & pasta",
          desc: "Karbohidrat padat untuk surplus kalori dan energi latihan",
        },
        {
          icon: "🥜",
          nama: "Selai kacang & kacang-kacangan",
          desc: "Kalori padat, protein, dan lemak sehat",
        },
        {
          icon: "🍳",
          nama: "Telur utuh (dengan kuning)",
          desc: "Protein + lemak + kalori — ideal untuk bulking",
        },
        {
          icon: "🍌",
          nama: "Pisang & buah kalori tinggi",
          desc: "Energi cepat untuk pre/post workout",
        },
      ],
      hindari: [
        {
          icon: "🥗",
          nama: "Sayuran terlalu banyak tanpa kalori",
          desc: "Bisa bikin kenyang tapi kalori tidak tercapai",
        },
        {
          icon: "🍵",
          nama: "Minuman diet/zero kalori",
          desc: "Tidak membantu surplus kalori yang dibutuhkan",
        },
        {
          icon: "🚫",
          nama: "Skip makan",
          desc: "Konsistensi surplus kalori sangat penting untuk bulking",
        },
        {
          icon: "🍺",
          nama: "Alkohol",
          desc: "Menghambat sintesis protein dan recovery otot",
        },
      ],
      tips: [
        "Makan setiap 2–3 jam untuk jaga surplus kalori sepanjang hari",
        "Konsumsi protein 30–60 menit setelah latihan untuk recovery optimal",
        "Tambahkan healthy calorie dense food: alpukat, kacang, minyak zaitun",
        "Jangan takut makan banyak karbohidrat — ini bahan bakar utama otot",
        "Tidur 7–9 jam per malam — hormon pertumbuhan dilepas saat tidur",
      ],
    },
  };

  const result = { ...base[goal || "healthy"] };
  if (bmiNum < 18.5) {
    result.tips = [
      "BMI kamu di bawah normal — prioritaskan penambahan berat badan secara sehat",
      "Tingkatkan asupan kalori 300–500 kcal di atas kebutuhan harian",
      "Konsumsi makanan padat nutrisi, bukan sekadar kalori kosong",
      ...result.tips.slice(0, 2),
    ];
  } else if (bmiNum >= 25 && bmiNum < 30) {
    result.tips = [
      "BMI kamu Overweight — kurangi 300–500 kcal dari TDEE secara bertahap",
      "Hindari crash diet — turunkan berat badan 0.5kg per minggu secara konsisten",
      "Perbanyak aktivitas fisik ringan seperti jalan kaki 30 menit/hari",
      ...result.tips.slice(0, 2),
    ];
  } else if (bmiNum >= 30) {
    result.tips = [
      "BMI kamu Obesitas — konsultasikan dengan dokter atau ahli gizi",
      "Kurangi porsi makan secara bertahap, jangan drastis",
      "Fokus pada perubahan kebiasaan jangka panjang, bukan diet instan",
      ...result.tips.slice(0, 2),
    ];
  }

  return result;
}

// ─── LABEL HELPERS ────────────────────────────────────────────
function getMealLabel(m) {
  return (
    { sarapan: "Sarapan", siang: "Makan Siang", malam: "Makan Malam" }[m] || m
  );
}

function getGoalLabel(g) {
  return { diet: "Diet", healthy: "Healthy", bulking: "Bulking" }[g] || g;
}

// ─── DETAIL PAGE ──────────────────────────────────────────────
function openDetail(idx) {
  if (!currentFilteredFoods || !currentFilteredFoods[idx]) {
    console.error("Food tidak ditemukan:", idx);
    return;
  }

  const f = currentFilteredFoods[idx];
  state.currentFood = f;

  arRotation = 0;
  arScale = 1;
  const arFoodImg = document.getElementById("ar-food-img");
  if (arFoodImg) arFoodImg.style.transform = "";

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
        `<div class="macro-card"><div class="macro-card-icon">${m.icon}</div><div class="macro-card-val">${m.val}g</div><div class="macro-card-kcal">${m.icon === "🥩" ? m.val * 4 : m.icon === "🧈" ? m.val * 9 : m.val * 4} kcal</div><div class="macro-card-label">${m.label}</div></div>`,
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

  const mealPct =
    state.mealCalories > 0
      ? Math.min(100, Math.round((f.calories / state.mealCalories) * 100))
      : 0;
  const fitColor =
    mealPct <= 80 ? "#00e5a0" : mealPct <= 100 ? "#ffb347" : "#ff6b6b";
  const fitLabel =
    mealPct <= 80
      ? "Sesuai target"
      : mealPct <= 100
        ? "Pas di target"
        : "Melebihi target";

  const portionTips = {
    diet: {
      icon: "⚖️",
      tip: "Kurangi porsi nasi/karbo, tambah porsi sayur. Makan perlahan agar cepat kenyang.",
    },
    healthy: {
      icon: "🍱",
      tip: "Ikuti porsi rekomendasi. Tambahkan salad atau buah sebagai pelengkap.",
    },
    bulking: {
      icon: "💪",
      tip: "Tambah 1–2 porsi jika masih di bawah target kalori harian. Konsumsi dalam 2 jam setelah latihan.",
    },
  }[state.goal];

  document.getElementById("detail-reason").innerHTML = `
    <div class="detail-fit-wrap">
      <div class="detail-fit-header">
        <span>🎯 Kesesuaian dengan Target Makan</span>
        <span class="detail-fit-badge" style="color:${fitColor};background:${fitColor}15;border-color:${fitColor}30">${fitLabel}</span>
      </div>
      <div class="detail-fit-bar-track">
        <div class="detail-fit-bar-fill" data-fit="${Math.min(mealPct, 100)}" style="width:0%;background:${fitColor}"></div>
      </div>
      <div class="detail-fit-note">${f.calories} kcal dari target ${state.mealCalories} kcal (${mealPct}%)</div>
    </div>
    <div class="detail-reason-box">
      <strong>Mengapa ini?</strong> ${reasons[state.goal]}
    </div>
    <div class="detail-labels-wrap">
      ${(f.labels || [])
      .map((l, i) => {
        const colors = ["#00e5a0", "#00b4f5", "#ff6b6b"];
        return `<span class="detail-label-tag" style="color:${colors[i % 3]};border-color:${colors[i % 3]}30;background:${colors[i % 3]}10">${l}</span>`;
      })
      .join("")}
    </div>
    <div class="detail-portion-tip">
      <span class="portion-tip-icon">${portionTips.icon}</span>
      <span>${portionTips.tip}</span>
    </div>
  `;
  document.getElementById("detail-desc").textContent = f.desc;

  navigate("detail-section", "result-section");
  setTimeout(() => {
    document
      .querySelectorAll("#macro-progress .progress-macro-fill")
      .forEach((el) => {
        el.style.width = el.dataset.width + "%";
      });
    const fitBar = document.querySelector(".detail-fit-bar-fill");
    if (fitBar) fitBar.style.width = fitBar.dataset.fit + "%";
  }, 300);

  stopCamera();
  arActive = false;
  const arVideo = document.getElementById("ar-video");
  if (arVideo) arVideo.style.display = "none";
  const arOverlay = document.getElementById("ar-overlay");
  if (arOverlay) arOverlay.style.display = "flex";
  const model3d = document.getElementById("model-3d");
  if (model3d) {
    model3d.style.display = "none";
    model3d.removeAttribute("src");
    model3d.src = "";
  }
  document.getElementById("ar-hint").textContent =
    "🤚 Drag untuk putar • Scroll untuk zoom";
  const container = document.getElementById("model-3d-container");
  if (container) {
    container.innerHTML = "";
    container.style.display = "none";
  }

  const btnKonfirmasi = document.getElementById("btn-konfirmasi-makan");
  if (btnKonfirmasi) {
    btnKonfirmasi.disabled = false;
    btnKonfirmasi.textContent = "✅ Konfirmasi Sudah Makan";
    btnKonfirmasi.dataset.confirmed = "0";
    btnKonfirmasi.style.background = "";
  }

  const btnToggle = document.getElementById("btn-ar-toggle");
  if (btnToggle) {
    btnToggle.textContent = "📷 Aktifkan AR";
    btnToggle.style.background = "";
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const sudahAda = _riwayatCache.some(
    (r) =>
      r.type === "food" &&
      r.name === f.name &&
      (r.rawTime || "").slice(0, 10) === todayStr,
  );
  if (!sudahAda) {
    _riwayatCacheDirty = true;
    fsAddRiwayat(state.currentUser, {
      type: "food",
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      img: f.img,
      goal: state.goal,
      time: fmtTime(),
      rawTime: new Date().toISOString(),
    });
  }
}

// ─── KONFIRMASI MAKAN ─────────────────────────────────────────
async function konfirmasiMakan() {
  const f = state.currentFood;
  if (!f) return;

  const btn = document.getElementById("btn-konfirmasi-makan");
  if (btn.dataset.confirmed === "1") {
    showToast("Makanan ini sudah ditambahkan hari ini! ✓", "success");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Menyimpan...";

  const mealLabel =
    { sarapan: "Sarapan", siang: "Makan Siang", malam: "Makan Malam" }[
    state.meal
    ] || state.meal;

  const entry = {
    name: f.name,
    calories: f.calories,
    protein: f.protein,
    fat: f.fat,
    carbs: f.carbs,
    img: f.img,
    goal: state.goal,
    meal: state.meal,
    mealLabel,
    targetCalories: state.targetCalories,
    mealCalories: state.mealCalories,
    time: fmtTime(),
    rawTime: new Date().toISOString(),
  };

  try {
    await fsAddFoodLog(state.currentUser, entry);
    btn.textContent = "✅ Sudah Ditambahkan!";
    btn.dataset.confirmed = "1";
    btn.style.background = "linear-gradient(135deg, #00b894, #00cec9)";
    showToast("🎉 " + f.name + " ditambahkan ke progress!", "success");
  } catch (e) {
    btn.disabled = false;
    btn.textContent = "✅ Konfirmasi Sudah Makan";
    showToast("Gagal menyimpan, coba lagi!", "error");
  }
}

// ─── CAMERA / AR ──────────────────────────────────────────────
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false,
  });
  state.cameraStream = stream;
  const vid = document.getElementById("ar-video");
  vid.srcObject = stream;
  vid.style.display = "block";
  document.getElementById("ar-overlay").style.display = "none";
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
    try {
      await startCamera();

      const container = document.getElementById("model-3d-container");
      const foodName = state.currentFood?.name;
      const modelPath = foodModels[foodName];

      if (modelPath && container) {
        container.innerHTML = "";

        const mv = document.createElement("model-viewer");
        mv.id = "model-3d";
        mv.setAttribute("alt", "Model 3D Makanan");
        mv.setAttribute("auto-rotate", "");
        mv.setAttribute("camera-controls", "");
        mv.setAttribute("shadow-intensity", "1");
        mv.setAttribute("loading", "eager");      // ← tambah ini
        mv.setAttribute("reveal", "auto");        // ← tambah ini
        mv.style.cssText =
          "width:100%;height:100%;background:transparent;position:absolute;top:0;left:0;z-index:10;";

        // Append dulu, tampilkan container dulu, BARU set src
        container.appendChild(mv);
        container.style.display = "block";        // visible dulu

        // Tunggu satu frame agar elemen masuk viewport
        requestAnimationFrame(() => {
          mv.setAttribute("src", modelPath);      // ← src diset BELAKANGAN
        });

        const f = state.currentFood;
        if (f) {
          const labelStyles = [
            {
              top: "20%",
              right: "10%",
              delay: "0.3s",
              bg: "rgba(0,229,160,0.9)",
              shadow: "rgba(0,229,160,0.5)",
            },
            {
              top: "60%",
              left: "8%",
              delay: "0.8s",
              bg: "rgba(0,180,245,0.9)",
              shadow: "rgba(0,180,245,0.5)",
            },
            {
              bottom: "15%",
              right: "12%",
              delay: "1.3s",
              bg: "rgba(255,107,107,0.9)",
              shadow: "rgba(255,107,107,0.5)",
            },
          ];
          f.labels.forEach((label, i) => {
            if (!label) return;
            const el = document.createElement("div");
            el.className = "ar-label";
            el.textContent = label;
            const s = labelStyles[i];
            el.style.cssText = [
              s.top ? `top:${s.top};` : "",
              s.bottom ? `bottom:${s.bottom};` : "",
              s.left ? `left:${s.left};` : "",
              s.right ? `right:${s.right};` : "",
              `background:${s.bg};`,
              `box-shadow:0 2px 12px ${s.shadow};`,
              `animation-delay:${s.delay};`,
              "z-index:20;",
            ].join("");
            container.appendChild(el);
          });
        }

        document.getElementById("ar-hint").textContent =
          "🤚 Drag untuk putar model • Pinch untuk zoom";
      }

      btn.textContent = "⏹️ Matikan AR";
      btn.style.background = "linear-gradient(135deg, #ff6b6b, #ff4757)";
      arActive = true;
    } catch (e) {
      // Berikan pesan error yang lebih spesifik
      if (e.name === "NotAllowedError") {
        showToast("Akses kamera ditolak. Izinkan kamera di pengaturan browser!", "error");
      } else if (e.name === "NotFoundError") {
        showToast("Kamera tidak ditemukan di perangkat ini!", "error");
      } else {
        showToast("AR tidak bisa diaktifkan. Pastikan browser mendukung kamera!", "error");
      }
    }
  } else {
    stopCamera();
    document.getElementById("ar-video").style.display = "none";

    const container = document.getElementById("model-3d-container");
    if (container) {
      container.innerHTML = "";
      container.style.display = "none";
    }

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

async function renderChatFromStorage() {
  const uid = state.currentUser;
  if (!uid) return;
  const stored = await fsGetChat(uid);
  chatMessages = stored;
  const msgsEl = document.getElementById("chat-messages");

  if (!chatInitialized) {
    chatInitialized = true;
    msgsEl.innerHTML = "";

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
    } else {
      stored.forEach((m) => appendMsgEl(m.text, m.role, m.time));
    }

    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
}

function appendMsgEl(text, role, time) {
  const msgsEl = document.getElementById("chat-messages");
  const wrap = document.createElement("div");
  wrap.className = "chat-msg " + role;
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

const BACKEND_URL = "https://smart-meal-lac.vercel.app";

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
  const userEntry = {
    role: "user",
    text,
    time: userTime,
    rawTime: new Date().toISOString(),
  };
  chatMessages.push(userEntry);
  fsSaveChat(state.currentUser, userEntry);

  isBotTyping = true;
  appendTypingIndicator();

  const systemPrompt = `Kamu adalah NutriBot, asisten nutrisi cerdas dari aplikasi SmartMeal berbasis AI.
Tugas kamu: membantu pengguna dengan pertanyaan seputar makanan, kalori, protein, lemak, karbohidrat, diet, bulking, dan gaya hidup sehat.
Bahasa: selalu gunakan Bahasa Indonesia yang ramah, santai, dan mudah dipahami.
Format: gunakan poin-poin pendek jika menjawab daftar. Jawaban maksimal 3-4 kalimat kecuali diminta detail.
Batasan: jangan berikan saran medis spesifik untuk kondisi penyakit — arahkan ke dokter atau ahli gizi. Jika pertanyaan di luar topik nutrisi dan kesehatan, tolak dengan sopan dan arahkan kembali.
Persona: antusias, supportif, dan berpengetahuan luas soal gizi.`;

  const apiMessages = chatMessages
    .slice(-10)
    .filter((m) => !m._isError)
    .map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, systemPrompt }),
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
    const botEntry = {
      role: "bot",
      text: reply,
      time: botTime,
      rawTime: new Date().toISOString(),
    };
    chatMessages.push(botEntry);
    fsSaveChat(state.currentUser, botEntry);
  } catch (e) {
    removeTypingIndicator();
    const errTime = nowTime();
    let errMsg = "Maaf, NutriBot tidak bisa dijangkau saat ini. Coba lagi dalam beberapa saat! 🔄";
    if (e.message.includes("Failed to fetch") || e.message.includes("NetworkError")) {
      errMsg = "Koneksi internet bermasalah. Pastikan kamu terhubung ke internet lalu coba lagi! 📶";
    }
    appendMsgEl(errMsg, "bot", errTime);
    const errEntry = {
      role: "bot",
      text: errMsg,
      time: errTime,
      rawTime: new Date().toISOString(),
      _isError: true,
    };
    chatMessages.push(errEntry);
    fsSaveChat(state.currentUser, errEntry);
  }

  isBotTyping = false;
  document.getElementById("chat-send-btn").disabled = false;
}

function sendChip(btn) {
  const text = btn.textContent.replace(/[🥗💪🌅💧]/g, "").trim();
  document.getElementById("chat-input").value = text;
  sendChat();
}

async function initChatForUser(uid) {
  chatMessages = await fsGetChat(uid);
  chatInitialized = false;
}

async function clearChat() {
  if (!state.currentUser) return;
  await fsClearChat(state.currentUser);
  chatMessages = [];
  chatInitialized = false;
  document.getElementById("chat-messages").innerHTML = "";
  document.getElementById("chat-suggestions").style.display = "flex";
  renderChatFromStorage();
}

// ─── PROGRESS SECTION ─────────────────────────────────────────
let _progressTimeFilter = "30";
let _progressGoalFilter = "all";

// Ganti fungsi calcStreakFiltered dengan ini:
function calcStreak(allEntries) {
  if (!allEntries.length) return 0;
  const dates = [
    ...new Set(allEntries.map((e) => new Date(e.rawTime).toDateString())),
  ]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  for (const d of dates) {
    const dc = new Date(d);
    dc.setHours(0, 0, 0, 0);
    if (dc.getTime() === check.getTime()) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else break;
  }
  return streak;
}

function calcKonsistensiFiltered(entries, days) {
  if (!entries.length) return 0;
  if (days === "today") {
    const todayHasEntry = entries.some(
      (e) => new Date(e.rawTime).toDateString() === new Date().toDateString(),
    );
    return todayHasEntry ? 100 : 0;
  }
  if (days === "all") {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.rawTime) - new Date(b.rawTime),
    );
    const firstDate = new Date(sorted[0].rawTime);
    firstDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = Math.max(
      1,
      Math.round((today - firstDate) / (1000 * 60 * 60 * 24)) + 1,
    );
    const uniqueDays = new Set(
      entries.map((e) => new Date(e.rawTime).toDateString()),
    ).size;
    return Math.round((uniqueDays / totalDays) * 100);
  }
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(days));
  const recent = entries.filter((e) => new Date(e.rawTime) >= cutoff);
  const uniqueDays = new Set(
    recent.map((e) => new Date(e.rawTime).toDateString()),
  ).size;
  return Math.round((uniqueDays / parseInt(days)) * 100);
}

function getFilteredFoodLog(foodLog, timeFilter, goalFilter) {
  let filtered = [...foodLog];
  if (goalFilter !== "all") {
    filtered = filtered.filter(
      (e) => (e.goal || "").toLowerCase() === goalFilter,
    );
  }
  if (timeFilter === "today") {
    const todayStr = new Date().toDateString();
    filtered = filtered.filter(
      (e) => new Date(e.rawTime).toDateString() === todayStr,
    );
  } else if (timeFilter !== "all") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(timeFilter));
    cutoff.setHours(0, 0, 0, 0);
    filtered = filtered.filter((e) => new Date(e.rawTime) >= cutoff);
  }
  return filtered;
}

function getTimeFilterLabel(timeFilter) {
  return {
    today: "hari ini",
    7: "7 hari terakhir",
    30: "30 hari terakhir",
    all: "semua waktu",
  }[timeFilter];
}

function getGoalFilterLabel(goalFilter) {
  return {
    all: "semua goal",
    diet: "diet 🥗",
    healthy: "healthy 💚",
    bulking: "bulking 💪",
  }[goalFilter];
}

async function renderProgressInProfile() {
  const container = document.getElementById("progress-content-profile");
  if (!container) return;
  container.innerHTML =
    '<div style="text-align:center;padding:20px;color:var(--text-muted)">Memuat... ⏳</div>';

  const foodLog = await fsGetFoodLog(state.currentUser);
  _renderProgressUI(foodLog);
}

function _renderProgressUI(foodLog) {
  const container = document.getElementById("progress-content-profile");
  if (!container) return;

  const filtered = getFilteredFoodLog(foodLog, _progressTimeFilter, _progressGoalFilter);

  // Progress hari ini tidak terpengaruh filter
  const todayLog = foodLog.filter(
    (e) => new Date(e.rawTime).toDateString() === new Date().toDateString()
  );
  const todayKcal = todayLog.reduce((s, e) => s + (e.calories || 0), 0);
  const todayTarget = state.targetCalories || 0;

  const totalMakanan = filtered.length;
  const konsistensi = calcKonsistensiFiltered(filtered, _progressTimeFilter);
  const streak = calcStreak(foodLog);

  const pct = todayTarget ? Math.min(100, Math.round((todayKcal / todayTarget) * 100)) : 0;
  const over = todayKcal > todayTarget && todayTarget > 0;
  const barColor = over ? "#ff6b6b" : pct >= 80 ? "#ffb347" : "#00e5a0";

  const goalOptions = [
    { val: "all", label: "Semua" },
    { val: "diet", label: "🥗 Diet" },
    { val: "healthy", label: "💚 Healthy" },
    { val: "bulking", label: "💪 Bulking" },
  ];
  const timeOptions = [
    { val: "today", label: "Hari Ini" },
    { val: "7", label: "7 Hari" },
    { val: "30", label: "30 Hari" },
    { val: "all", label: "Semua" },
  ];

  const INITIAL_SHOW = 10;
  const showAll = container._showAllFoods === true;
  const itemsToShow = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const hasMore = filtered.length > INITIAL_SHOW;

  // Label filter aktif yang ringkas
  const timeLabel = getTimeFilterLabel(_progressTimeFilter);
  const goalLabel = getGoalFilterLabel(_progressGoalFilter);
  const activeFilterLabel = _progressGoalFilter === "all"
    ? timeLabel
    : goalLabel + " · " + timeLabel;

  const foodListHTML = filtered.length > 0
    ? `<div class="prog-section-label">Makanan · ${activeFilterLabel}</div>
       <div style="display:flex;flex-direction:column;gap:8px">` +
      itemsToShow.map((e) =>
        `<div class="prog-food-item">
          <img src="${e.img}" class="prog-food-img" onerror="this.style.display='none'">
          <div class="prog-food-info">
            <div class="prog-food-name">${e.name}</div>
            <div class="prog-food-meta">${e.mealLabel || e.meal || "-"} · <span style="color:var(--accent)">${e.goal || ""}</span></div>
            <div class="prog-food-date">${new Date(e.rawTime).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
          <div class="prog-food-kcal">+${e.calories}</div>
        </div>`
      ).join("") +
      "</div>" +
      (hasMore
        ? `<button onclick="toggleShowAllFoods()" class="prog-show-more-btn">
            ${showAll ? "⬆️ Sembunyikan" : "📋 Tampilkan semua " + filtered.length + " makanan"}
           </button>`
        : "")
    : `<div class="progress-empty">Belum ada data untuk filter ini.<br>Coba ubah filter atau konfirmasi makanan dulu! 🔍</div>`;

  container.innerHTML =
    // ── Header ──
    `<div class="prog-header">
      <span style="font-family:'Syne',sans-serif;font-size:13px;font-weight:700">📊 Progress</span>
      <button onclick="clearProgressData()" class="prog-danger-btn">🗑️ Hapus</button>
    </div>` +

    // ── Filter Bar — ringkas ──
    `<div class="prog-filter-bar">
      <div class="prog-filter-row">
        <span class="prog-filter-label">⏱</span>` +
        timeOptions.map((o) =>
          `<button class="prog-pill${_progressTimeFilter === o.val ? " active" : ""}"
            onclick="setProgressFilterNew('${o.val}','time')">${o.label}</button>`
        ).join("") +
      `</div>
      <div class="prog-filter-row">
        <span class="prog-filter-label">🎯</span>` +
        goalOptions.map((o) =>
          `<button class="prog-pill${_progressGoalFilter === o.val ? " active" : ""}"
            onclick="setProgressFilterNew('${o.val}','goal')">${o.label}</button>`
        ).join("") +
      `</div>
    </div>` +

    // ── Summary Cards ──
    `<div class="prog-cards">
      <div class="prog-card highlight">
        <div class="prog-card-val">${totalMakanan}</div>
        <div class="prog-card-label">Makanan</div>
      </div>
      <div class="prog-card">
        <div class="prog-card-val">${konsistensi}%</div>
        <div class="prog-card-label">Konsistensi</div>
      </div>
      <div class="prog-card">
        <div class="prog-card-val">${streak} 🔥</div>
        <div class="prog-card-label">Streak</div>
      </div>
    </div>` +

    // ── Progress Hari Ini ──
    `<div class="prog-today-card">
      <div class="prog-today-top">
        <span class="prog-today-title">🍽️ Hari Ini</span>
        <span class="prog-today-badge" style="color:${barColor}">${pct}% tercapai</span>
      </div>
      <div class="prog-today-kcal" style="color:${barColor}">${todayKcal.toLocaleString()}</div>
      <div class="prog-today-sub">dari <strong>${todayTarget || "?"} kcal</strong> target harian</div>
      <div class="prog-today-bar-track">
        <div class="prog-today-bar-fill" style="width:${pct}%;background:${barColor}"></div>
      </div>
      ${todayTarget === 0
        ? `<div class="prog-today-hint">Isi data di tab Analisis untuk set target kalori</div>`
        : `<div class="prog-today-hint">📌 Tidak terpengaruh filter waktu/goal</div>`}
    </div>` +

    // ── Toggle Grafik ──
    `<button id="btn-toggle-chart" class="prog-chart-toggle-btn${_chartVisible ? " active" : ""}"
      onclick="toggleProgressChart()">
      ${_chartVisible ? "📉 Sembunyikan Grafik" : "📈 Lihat Tren Kalori"}
    </button>` +

    // ── Chart Wrap (hidden by default) ──
    `<div id="progress-chart-wrap" style="display:${_chartVisible ? "block" : "none"}">
      <div class="prog-chart-card">
        <div class="prog-chart-info">
          Tren kalori · ${activeFilterLabel} · <em>Tap titik untuk detail</em>
        </div>
        <div id="progress-line-chart" style="position:relative;width:100%;margin-top:4px"></div>
      </div>
    </div>` +

    // ── Daftar Makanan ──
    foodListHTML;

  container._foodLog = foodLog;

  // Render chart jika sedang terbuka
  if (_chartVisible) {
    requestAnimationFrame(() => {
      const chartData = buildChartData(foodLog, _progressTimeFilter, _progressGoalFilter);
      renderLineChart("progress-line-chart", chartData, todayTarget || null);
    });
  }
}

function setProgressFilterNew(val, type) {
  if (type === "time") _progressTimeFilter = val;
  if (type === "goal") _progressGoalFilter = val;

  const container = document.getElementById("progress-content-profile");
  if (container && container._foodLog) {
    _renderProgressUI(container._foodLog);
  }
}

function toggleShowAllFoods() {
  const container = document.getElementById("progress-content-profile");
  if (!container) return;
  container._showAllFoods = !container._showAllFoods;
  if (container._foodLog) {
    _renderProgressUI(container._foodLog);
  }
}

function buildChartData(foodLog, timeFilter, goalFilter) {
  const now = new Date();
  let days = [];

  if (timeFilter === "today") {
    days = [new Date(now)];
  } else if (timeFilter === "7") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d);
    }
  } else if (timeFilter === "30") {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d);
    }
  } else {
    // "all" — ambil dari tanggal pertama entry
    const sorted = [...foodLog].sort(
      (a, b) => new Date(a.rawTime) - new Date(b.rawTime)
    );
    if (!sorted.length) return { labels: [], values: [], hasData: false };
    const first = new Date(sorted[0].rawTime);
    first.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cur = new Date(first);
    while (cur <= today) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    // Batasi maksimal 60 hari agar chart tidak terlalu padat
    if (days.length > 60) days = days.slice(days.length - 60);
  }

  const labels = days.map((d) => {
    if (timeFilter === "today") return "Hari Ini";
    if (timeFilter === "7") {
      const isToday = d.toDateString() === now.toDateString();
      return isToday
        ? "Hari Ini"
        : d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
    }
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  const values = days.map((d) => {
    const dateStr = d.toDateString();
    return foodLog
      .filter((e) => {
        const match = new Date(e.rawTime).toDateString() === dateStr;
        if (!match) return false;
        if (goalFilter !== "all") {
          return (e.goal || "").toLowerCase() === goalFilter;
        }
        return true;
      })
      .reduce((s, e) => s + (e.calories || 0), 0);
  });

  return { labels, values, hasData: values.some((v) => v > 0) };
}

function renderLineChart(containerId, chartData, targetCalories) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { labels, values, hasData } = chartData;

  if (!hasData || labels.length === 0) {
    container.innerHTML =
      '<div class="chart-no-data">📭 Belum ada data untuk ditampilkan.<br>Mulai konfirmasi makanan agar grafik muncul!</div>';
    return;
  }

  // Jika hanya 1 titik (today), duplikasi agar ada garis
  const chartLabels = labels.length === 1 ? [labels[0], labels[0]] : labels;
  const chartValues = values.length === 1 ? [values[0], values[0]] : values;

  const W = container.clientWidth || 320;
  const H = 180;
  const PAD = { top: 20, right: 16, bottom: 40, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...chartValues, targetCalories || 0, 100);
  const yMax = Math.ceil((maxVal * 1.2) / 500) * 500;

  const xStep = plotW / (chartLabels.length - 1 || 1);
  const yScale = (v) => plotH - (v / yMax) * plotH;

  // Points
  const pts = chartValues.map((v, i) => ({
    x: PAD.left + i * xStep,
    y: PAD.top + yScale(v),
    v,
    label: chartLabels[i],
  }));

  // Area path
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${pts[0].x},${PAD.top + plotH} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pts[pts.length - 1].x},${PAD.top + plotH} Z`;

  // Y gridlines
  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = Math.round((yMax / yTicks) * i);
    const y = PAD.top + yScale(val);
    return { val, y };
  });

  // Target line Y
  const targetY = targetCalories
    ? PAD.top + yScale(Math.min(targetCalories, yMax))
    : null;

  // X labels — hanya tampilkan sebagian agar tidak overlap
  const maxLabels = Math.floor(plotW / 44);
  const labelStep = Math.max(1, Math.ceil(chartLabels.length / maxLabels));

  // Tentukan warna titik
  const dotColors = chartValues.map((v) => {
    if (!targetCalories) return "#00e5a0";
    const ratio = v / targetCalories;
    if (ratio === 0) return "rgba(255,255,255,0.15)";
    if (ratio <= 0.85) return "#00b4f5";
    if (ratio <= 1.05) return "#00e5a0";
    return "#ff6b6b";
  });

  const svgId = "chart-svg-" + containerId;

  container.innerHTML = `
    <svg id="${svgId}" width="100%" height="${H}" viewBox="0 0 ${W} ${H}" 
         xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
      <defs>
        <linearGradient id="areaGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00e5a0" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#00e5a0" stop-opacity="0.01"/>
        </linearGradient>
        <filter id="glow-${containerId}">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Grid lines -->
      ${gridLines
        .map(
          ({ val, y }) => `
        <line x1="${PAD.left}" y1="${y}" x2="${PAD.left + plotW}" y2="${y}"
              stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${PAD.left - 6}" y="${y + 4}" 
              font-size="9" fill="rgba(255,255,255,0.3)" 
              text-anchor="end" font-family="DM Sans,sans-serif">
          ${val >= 1000 ? (val / 1000).toFixed(1) + "k" : val}
        </text>
      `
        )
        .join("")}

      <!-- Target line -->
      ${
        targetY !== null
          ? `
        <line x1="${PAD.left}" y1="${targetY}" x2="${PAD.left + plotW}" y2="${targetY}"
              stroke="#ffb347" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
        <text x="${PAD.left + plotW + 4}" y="${targetY + 4}"
              font-size="9" fill="#ffb347" font-family="DM Sans,sans-serif" opacity="0.85">
          Target
        </text>
      `
          : ""
      }

      <!-- Area fill -->
      <path d="${areaPath}" fill="url(#areaGrad-${containerId})"/>

      <!-- Line -->
      <path d="${linePath}" fill="none" stroke="#00e5a0" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round"
            filter="url(#glow-${containerId})"/>

      <!-- Dots + tooltip trigger -->
      ${pts
        .map(
          (p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="4" 
                fill="${dotColors[i]}" stroke="var(--bg,#080c14)" stroke-width="2"
                class="chart-dot"
                data-label="${p.label}" data-val="${p.v}"
                style="cursor:pointer"/>
        <circle cx="${p.x}" cy="${p.y}" r="14" fill="transparent"
                class="chart-dot-hit"
                data-label="${p.label}" data-val="${p.v}" data-idx="${i}"
                style="cursor:pointer"/>
      `
        )
        .join("")}

      <!-- X Labels -->
      ${pts
        .map((p, i) => {
          if (i % labelStep !== 0 && i !== pts.length - 1) return "";
          return `
          <text x="${p.x}" y="${PAD.top + plotH + 18}"
                font-size="9" fill="rgba(255,255,255,0.35)"
                text-anchor="middle" font-family="DM Sans,sans-serif">
            ${chartLabels[i]}
          </text>
        `;
        })
        .join("")}
    </svg>
    <div class="chart-tooltip" id="tooltip-${containerId}" style="display:none"></div>
  `;

  // Tooltip interaktif
  const svg = document.getElementById(svgId);
  const tooltip = document.getElementById("tooltip-" + containerId);
  if (!svg || !tooltip) return;

  svg.querySelectorAll(".chart-dot-hit").forEach((el) => {
    el.addEventListener("mouseenter", (e) => showTooltipChart(e, tooltip, targetCalories));
    el.addEventListener("mouseleave", () => (tooltip.style.display = "none"));
    el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      showTooltipChart(e.touches[0], tooltip, targetCalories);
    }, { passive: false });
  });
}

function showTooltipChart(e, tooltip, targetCalories) {
  const label = e.target.dataset.label;
  const val = parseInt(e.target.dataset.val || 0);
  const pct = targetCalories ? Math.round((val / targetCalories) * 100) : null;
  const color =
    val === 0
      ? "rgba(255,255,255,0.3)"
      : !targetCalories
      ? "#00e5a0"
      : pct <= 85
      ? "#00b4f5"
      : pct <= 105
      ? "#00e5a0"
      : "#ff6b6b";

  tooltip.style.display = "block";
  tooltip.innerHTML = `
    <div style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;margin-bottom:2px">${label}</div>
    <div style="font-size:13px;font-weight:800;color:${color}">${val.toLocaleString()} kcal</div>
    ${pct !== null ? `<div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px">${pct}% dari target</div>` : ""}
  `;

  const rect = tooltip.parentElement.getBoundingClientRect();
  const ex = (e.clientX || e.pageX) - rect.left;
  const ey = (e.clientY || e.pageY) - rect.top;
  const tw = 130;
  tooltip.style.left = Math.min(ex - tw / 2, rect.width - tw - 4) + "px";
  tooltip.style.top = Math.max(0, ey - 70) + "px";
}

function toggleProgressChart() {
  _chartVisible = !_chartVisible;
  const chartWrap = document.getElementById("progress-chart-wrap");
  const btn = document.getElementById("btn-toggle-chart");
  if (!chartWrap || !btn) return;

  if (_chartVisible) {
    chartWrap.style.display = "block";
    chartWrap.classList.add("chart-animate-in");
    btn.textContent = "📉 Sembunyikan Grafik";
    btn.classList.add("active");

    // Render chart setelah elemen visible
    requestAnimationFrame(() => {
      const container = document.getElementById("progress-content-profile");
      const foodLog = container?._foodLog || [];
      const todayTarget = state.targetCalories || 0;
      const chartData = buildChartData(foodLog, _progressTimeFilter, _progressGoalFilter);
      renderLineChart("progress-line-chart", chartData, todayTarget || null);
    });
  } else {
    chartWrap.style.display = "none";
    chartWrap.classList.remove("chart-animate-in");
    btn.textContent = "📈 Lihat Tren Kalori";
    btn.classList.remove("active");
  }
}

// ─── APP INIT ─────────────────────────────────────────────────
window.showAuth = showAuth;
window.togglePw = togglePw;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.doLogout = doLogout;
window.confirmLogout = confirmLogout;
window.switchTab = switchTab;
window.navigate = navigate;
window.selectGoal = selectGoal;
window.selectMeal = selectMeal;
window.goToStep2 = goToStep2;
window.backToStep1 = backToStep1;
window.openDetail = openDetail;
window.toggleAR = toggleAR;
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.showProfileSub = showProfileSub;
window.hideProfileSub = hideProfileSub;
window.pickEmoji = pickEmoji;
window.saveProfile = saveProfile;
window.renderRiwayat = renderRiwayat;
window.setRiwayatFilter = setRiwayatFilter;
window.filterRiwayat = filterRiwayat;
window.deleteRiwayatItem = deleteRiwayatItem;
window.clearAllRiwayat = clearAllRiwayat;
window.sendChat = sendChat;
window.sendChip = sendChip;
window.clearChat = clearChat;
window.konfirmasiMakan = konfirmasiMakan;
window.goToResult = goToResult;
window.anSelectGender = anSelectGender;
window.anSelectActivity = anSelectActivity;
window.runAnalisis = runAnalisis;
window.showAnalisisForm = showAnalisisForm;
window.renderProgressInProfile = renderProgressInProfile;
window.toggleShowAllFoods = toggleShowAllFoods;
window.setProgressFilterNew = setProgressFilterNew;
window.toggleProgressChart = toggleProgressChart;

const filterRiwayatDebounced = debounce(filterRiwayat, 250);
window.filterRiwayatDebounced = filterRiwayatDebounced;

document.dispatchEvent(new Event("moduleready"));

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("auth-wrapper").style.display = "block";
  document.getElementById("app-wrapper").style.display = "none";

  // Helper untuk sembunyikan loading screen
  function hideAppLoading() {
    const el = document.getElementById("app-loading");
    if (!el) return;
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 400);
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loginSuccess(user);
    } else {
      state.currentUser = null;
      state.currentUsername = null;
      document.getElementById("auth-wrapper").style.display = "block";
      document.getElementById("app-wrapper").style.display = "none";
      showAuth("login-screen");
    }
    hideAppLoading();
  });
});