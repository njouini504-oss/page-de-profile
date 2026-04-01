 // ---------- STORAGE KEYS ----------
    const STORAGE_KEYS = {
        USER: 'eduspace_user',
        TOPBAR_COLOR: 'topbarColor',
        DARK_MODE: 'darkModeEnabled'
    };

    // ---------- DONNÉES UTILISATEUR PAR DÉFAUT ----------
    let userData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@gmail.com",
        className: "esiClasse",
        photoUrl: null
    };

    // Sauvegarde locale
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
        // Appliquer aux champs
        firstNameInput.value = userData.firstName;
        lastNameInput.value = userData.lastName;
        emailInput.value = userData.email;
        classInput.value = userData.className;
        updateAllUI();
    }

    // Éléments DOM
    const topAvatar = document.getElementById('topAvatar');
    const topUserNameSpan = document.getElementById('topUserName');
    const mainAvatar = document.getElementById('mainAvatar');
    const displayFullName = document.getElementById('displayFullName');
    const displayUserEmail = document.getElementById('displayUserEmail');
    const displayUserClassSpan = document.getElementById('displayUserClass');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const emailInput = document.getElementById('emailInput');
    const classInput = document.getElementById('classInput');
    const welcomeMsgSpan = document.getElementById('welcomeMessage');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const inlineChangeClassBtn = document.getElementById('inlineChangeClassBtn');
    const footerChangeClassBtn = document.getElementById('footerChangeClassBtn');
    const validateBtn = document.getElementById('validateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Notifications
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Mise à jour UI complète
    function updateAllUI() {
        const fullName = `${userData.firstName} ${userData.lastName}`.trim() || "Utilisateur";
        topUserNameSpan.textContent = fullName;
        displayFullName.textContent = fullName;
        displayUserEmail.textContent = userData.email;
        displayUserClassSpan.textContent = `Classe: ${userData.className}`;
        welcomeMsgSpan.textContent = `Bienvenue, ${fullName} — votre classe ${userData.className}`;

        // Avatar
        if (userData.photoUrl) {
            topAvatar.style.backgroundImage = `url('${userData.photoUrl}')`;
            topAvatar.style.backgroundSize = "cover";
            topAvatar.textContent = "";
            mainAvatar.style.backgroundImage = `url('${userData.photoUrl}')`;
            mainAvatar.style.backgroundSize = "cover";
            mainAvatar.textContent = "";
        } else {
            topAvatar.style.backgroundImage = "";
            const initial = userData.firstName.charAt(0).toUpperCase() || "U";
            topAvatar.textContent = initial;
            topAvatar.style.backgroundColor = "#ffb347";
            mainAvatar.style.backgroundImage = "";
            mainAvatar.textContent = initial;
            mainAvatar.style.backgroundColor = "#ffb347";
        }
    }

    // Synchronisation des champs vers userData et sauvegarde
    function syncFromInputs() {
        userData.firstName = firstNameInput.value.trim() || "Prénom";
        userData.lastName = lastNameInput.value.trim() || "Nom";
        userData.email = emailInput.value.trim();
        userData.className = classInput.value.trim() || "Classe";
        updateAllUI();
        saveUserData();
    }

    // Validation email simple
    function isValidEmail(email) {
        return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
    }

    // Indicateur de force du mot de passe
    function evaluatePasswordStrength(pwd) {
        let score = 0;
        if (!pwd) return { score: 0, text: "Faible" };
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;
        if (score <= 1) return { score: 0, text: "Faible", color: "#e53e3e", width: "25%" };
        if (score === 2) return { score: 1, text: "Moyen", color: "#f39c12", width: "50%" };
        if (score === 3) return { score: 2, text: "Fort", color: "#2b9348", width: "75%" };
        return { score: 3, text: "Très fort", color: "#27ae60", width: "100%" };
    }

    newPasswordInput.addEventListener('input', () => {
        const strength = evaluatePasswordStrength(newPasswordInput.value);
        strengthFill.style.width = strength.width;
        strengthFill.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
    });

    // Événements en temps réel
    firstNameInput.addEventListener('input', syncFromInputs);
    lastNameInput.addEventListener('input', syncFromInputs);
    emailInput.addEventListener('input', syncFromInputs);
    classInput.addEventListener('input', syncFromInputs);

    // Changer la classe
    function updateClass() {
        let newClass = classInput.value.trim();
        if (newClass === "") newClass = "Classe par défaut";
        userData.className = newClass;
        classInput.value = newClass;
        updateAllUI();
        saveUserData();
        showToast(`Classe mise à jour : ${newClass}`, 'success');
    }
    inlineChangeClassBtn.addEventListener('click', updateClass);
    footerChangeClassBtn.addEventListener('click', updateClass);

    // Changer la photo (avec aperçu)
    changePhotoBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
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
        fileInput.click();
    });

    // Validation globale
    validateBtn.addEventListener('click', () => {
        const oldPwd = oldPasswordInput.value;
        const newPwd = newPasswordInput.value;
        const email = emailInput.value.trim();

        if (!oldPwd) {
            showToast("Veuillez entrer votre mot de passe actuel pour valider.", 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showToast("Veuillez entrer une adresse email valide.", 'error');
            return;
        }

        // Ici, normalement on enverrait les données à un serveur
        // Simulation de succès
        syncFromInputs(); // assure la sauvegarde
        if (newPwd) {
            // Simuler changement de mot de passe
            showToast("✅ Mot de passe modifié avec succès.", 'success');
            newPasswordInput.value = "";
            strengthFill.style.width = "0%";
            strengthText.textContent = "Force";
        }
        oldPasswordInput.value = "";
        showToast("Profil mis à jour avec succès !", 'success');
    });

    // Annuler : recharge les données sauvegardées depuis le localStorage
    resetBtn.addEventListener('click', () => {
        loadUserData();
        // Réinitialiser les champs de mot de passe
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        strengthFill.style.width = "0%";
        strengthText.textContent = "Force";
        showToast("Modifications annulées, données restaurées.", 'info');
    });

    // ---------- TOP BAR ET PARAMÈTRES ----------
    const topBarElement = document.getElementById('topBar');
    const colorPicker = document.getElementById('topbarColorPicker');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settingsBtn');
    const homeBtn = document.getElementById('homeBtn');

    homeBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("Retour en haut de page", 'info');
    });

    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!settingsPanel.contains(event.target) && event.target !== settingsBtn && !settingsBtn.contains(event.target)) {
            settingsPanel.classList.add('hidden');
        }
    });
    settingsPanel.addEventListener('click', (e) => e.stopPropagation());

    // Couleur top bar
    function setTopBarColor(color) {
        topBarElement.style.backgroundColor = color;
        localStorage.setItem(STORAGE_KEYS.TOPBAR_COLOR, color);
    }
    colorPicker.addEventListener('input', (e) => setTopBarColor(e.target.value));
    const savedColor = localStorage.getItem(STORAGE_KEYS.TOPBAR_COLOR);
    if (savedColor) {
        topBarElement.style.backgroundColor = savedColor;
        colorPicker.value = savedColor;
    }

    // Mode sombre
    function setDarkMode(enabled) {
        if (enabled) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, enabled);
        darkModeToggle.checked = enabled;
    }
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    setDarkMode(savedDarkMode);
    darkModeToggle.addEventListener('change', (e) => setDarkMode(e.target.checked));

    // Initialisation
    loadUserData();