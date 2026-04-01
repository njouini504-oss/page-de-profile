let nominput = document.getElementById("nom");
let emailinput = document.getElementById("email");
let idinput = document.getElementById("id");
let password = document.getElementById("password").value;
let confirm = document.getElementById("confirm").value;
let filiere = document.getElementById("filiere").value;

let ernom = document.getElementById("ernom");
let eremail = document.getElementById("eremail");
let erid = document.getElementById("erid");
let erfil = document.getElementById("erfil");
let erclasse = document.getElementById("erclasse");
let ermdp = document.getElementById("ermdp");
let ercmdp = document.getElementById("ercmdp");

function validerForm() {
    let nom = nominput.value.trim();
    let email = emailinput.value.trim();
    let id = idinput.value.trim();
    let filiere = document.getElementById("filiere").value;
    let classe = document.querySelector('input[name="classe"]:checked');
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;

    let nomRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nomRegex.test(nom)) {
        ernom.innerHTML = "Nom invalide (lettres seulement, max 50 caractères)";
        nominput.value = "";
        nominput.focus();
        nominput.style.border = "2px solid red";
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        eremail.innerHTML = "Email invalide";
        emailinput.value = "";
        emailinput.focus();
        emailinput.style.border = "2px solid red";
        return false;
    }

    if (id.length !== 8) {
        erid.innerHTML = "Identifiant invalide (8 chiffres)";
        idinput.value = "";
        idinput.focus();
        idinput.style.border = "2px solid red";
        return false;
    }

    if (!filiere) {
        erfil.innerHTML = "Veuillez choisir une filière";
        return false;
    }

    if (!classe) {
        erclasse.innerHTML = "Veuillez choisir une classe";
        return false;
    }

    let passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
        ermdp.innerHTML = "Mot de passe faible (min 6 caractères, majuscule, minuscule, chiffre)";
        return false;
    }

    if (password !== confirm) {
        ercmdp.innerHTML = "Les mots de passe ne correspondent pas";
        return false;
    }

    return true;
}

const form = document.getElementById("registerForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!validerForm()) return;

    let nom = nominput.value.trim();
    let email = emailinput.value.trim();
    let id = idinput.value.trim();
    let filiere = document.getElementById("filiere").value;
    let classe = document.querySelector('input[name="classe"]:checked');
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nom, email, id, password,
            filiere, classe: classe.value,
            role: "etudiant"
        })
    })
    .then(res => res.text())
    .then(data => {
        if (data === "OK") {
            alert("Inscription réussie !");
            window.location.href = "etudiant.html";
        } else if (data.includes("EMAIL_EXISTS")) {
            alert("Cet email est déjà utilisé.");
        }
    });
});

// Réinitialisation des erreurs en temps réel
nominput.addEventListener("input", () => {
    nominput.style.border = "";
    ernom.innerHTML = "";
});
emailinput.addEventListener("input", () => {
    emailinput.style.border = "";
    eremail.innerHTML = "";
});
idinput.addEventListener("input", () => {
    idinput.style.border = "";
    erid.innerHTML = "";
});
document.getElementById("password").addEventListener("input", () => {
    document.getElementById("password").style.border = "";
    ermdp.innerHTML = "";
});
document.getElementById("confirm").addEventListener("input", () => {
    document.getElementById("confirm").style.border = "";
    ercmdp.innerHTML = "";
});
document.getElementById("filiere").addEventListener("change", () => {
    erfil.textContent = "";
});
let radios = document.querySelectorAll('input[name="classe"]');
radios.forEach(radio => {
    radio.addEventListener("change", () => {
        erclasse.textContent = "";
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});