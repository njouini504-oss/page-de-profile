// STORAGE
const STORAGE_KEYS = { USER: 'studyhub_user' };
let userData = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@gmail.com",
    className: "esiClasse",
    photoUrl: null
};

// DOM elements
const headerAvatar = document.getElementById('headerAvatar');
const headerUserName = document.getElementById('headerUserName');
const profileLargeAvatar = document.getElementById('profileLargeAvatar');
const avatarInitialSpan = document.getElementById('avatarInitial');
const profileFullName = document.getElementById('profileFullName');
const profileEmail = document.getElementById('profileEmail');
const profileClassBadge = document.getElementById('profileClassBadge');
const displayFirstName = document.getElementById('displayFirstName');
const displayLastName = document.getElementById('displayLastName');
const displayEmail = document.getElementById('displayEmail');
const displayClass = document.getElementById('displayClass');
const welcomeMessageDiv = document.getElementById('welcomeMessage');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const editClassBtn = document.getElementById('editClassBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const oldPasswordInput = document.getElementById('oldPassword');
const newPasswordInput = document.getElementById('newPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const logoutBtn = document.getElementById('logoutBtn');

function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function saveUserData() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            userData = { ...userData, ...parsed };
        } catch(e) {}
    }
    updateAllUI();
}

function updateAllUI() {
    const fullName = `${userData.firstName} ${userData.lastName}`.trim() || "Utilisateur";
    headerUserName.textContent = fullName;
    profileFullName.textContent = fullName;
    profileEmail.textContent = userData.email;
    profileClassBadge.textContent = `Classe: ${userData.className}`;
    displayFirstName.textContent = userData.firstName;
    displayLastName.textContent = userData.lastName;
    displayEmail.textContent = userData.email;
    displayClass.textContent = userData.className;
    welcomeMessageDiv.innerHTML = `<i class="fas fa-smile-wink"></i> Bienvenue, ${fullName} — votre classe ${userData.className}`;

    if (userData.photoUrl) {
        headerAvatar.style.backgroundImage = `url('${userData.photoUrl}')`;
        headerAvatar.style.backgroundSize = "cover";
        headerAvatar.textContent = "";
        profileLargeAvatar.style.backgroundImage = `url('${userData.photoUrl}')`;
        profileLargeAvatar.style.backgroundSize = "cover";
        avatarInitialSpan.style.display = "none";
    } else {
        headerAvatar.style.backgroundImage = "";
        const initial = userData.firstName.charAt(0).toUpperCase() || "U";
        headerAvatar.textContent = initial;
        headerAvatar.style.backgroundColor = "#2bb3b3";
        profileLargeAvatar.style.backgroundImage = "";
        avatarInitialSpan.textContent = initial;
        avatarInitialSpan.style.display = "flex";
        profileLargeAvatar.style.backgroundColor = "#2bb3b3";
    }
}

function updateClass() {
    let newClass = prompt("Entrez votre nouvelle classe / filière :", userData.className);
    if (newClass && newClass.trim() !== "") {
        userData.className = newClass.trim();
        saveUserData();
        updateAllUI();
        showToast(`Classe mise à jour : ${userData.className}`, 'success');
    } else if (newClass === "") {
        showToast("La classe ne peut pas être vide.", 'error');
    }
}

changePhotoBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                userData.photoUrl = ev.target.result;
                updateAllUI();
                saveUserData();
                showToast("Photo de profil mise à jour", 'success');
            };
            reader.readAsDataURL(file);
        } else {
            showToast("Veuillez sélectionner une image valide", 'error');
        }
    };
    input.click();
});

editClassBtn.addEventListener('click', updateClass);

function evaluateStrength(pwd) {
    if (!pwd) return { text: "Faible", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 1) return { text: "Faible", width: "25%" };
    if (score === 2) return { text: "Moyen", width: "50%" };
    if (score === 3) return { text: "Fort", width: "75%" };
    return { text: "Très fort", width: "100%" };
}

newPasswordInput.addEventListener('input', () => {
    const s = evaluateStrength(newPasswordInput.value);
    strengthFill.style.width = s.width;
    strengthText.textContent = s.text;
});

changePasswordBtn.addEventListener('click', () => {
    const oldPwd = oldPasswordInput.value;
    const newPwd = newPasswordInput.value;
    if (!oldPwd) {
        showToast("Veuillez entrer votre mot de passe actuel.", 'error');
        return;
    }
    if (!newPwd) {
        showToast("Veuillez entrer un nouveau mot de passe.", 'error');
        return;
    }
    // Simulation de validation (dans une vraie app, vérification côté serveur)
    showToast("✅ Mot de passe modifié avec succès.", 'success');
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    strengthFill.style.width = "0%";
    strengthText.textContent = "Force";
});

logoutBtn.addEventListener('click', () => {
    showToast("Déconnexion (simulation)", 'info');
    // window.location.href = "login.html";
});

loadUserData();