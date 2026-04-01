const form = document.getElementById("loginForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "EMAIL_EXISTS") {
            alert("Étudiant déjà existant ?");
        } else if (data.role === "admin") {
            if (data.status === "CODE_SENT") {
                localStorage.setItem("email", email);
                localStorage.setItem("role", data.role);
                alert("Code envoyé par email 📧");
                window.location.href = "code.html";
            }
        } else if (data.role === "etudiant") {
            window.location.href = "etudiant.html";
        } else {
            document.getElementById("erreur").innerHTML = "Email ou mot de passe incorrect ❌";
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        }
    });
});

document.getElementById("email").addEventListener("input", () => {
    document.getElementById("erreur").innerHTML = "";
});
document.getElementById("password").addEventListener("input", () => {
    document.getElementById("erreur").innerHTML = "";
});
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