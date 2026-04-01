// theme.js – Sauvegarde couleur barre + mode sombre
const topBar = document.querySelector('.top-bar');
const colorPicker = document.getElementById('topbarColorPicker');
const darkModeToggle = document.getElementById('darkModeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');

// Charger la couleur de la barre
const savedColor = localStorage.getItem('studyhub_topbarColor');
if (savedColor && topBar) {
    topBar.style.backgroundColor = savedColor;
    if (colorPicker) colorPicker.value = savedColor;
}

// Sauvegarder la couleur
if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
        const newColor = e.target.value;
        topBar.style.backgroundColor = newColor;
        localStorage.setItem('studyhub_topbarColor', newColor);
    });
}

// Charger le mode sombre
const savedDarkMode = localStorage.getItem('studyhub_darkMode') === 'true';
if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.checked = true;
}

// Sauvegarder le mode sombre
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('studyhub_darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('studyhub_darkMode', 'false');
        }
    });
}

// Ouvrir/fermer le panneau paramètres
if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.toggle('hidden');
    });
    document.addEventListener('click', (event) => {
        if (!settingsPanel.contains(event.target) && event.target !== settingsBtn) {
            settingsPanel.classList.add('hidden');
        }
    });
}