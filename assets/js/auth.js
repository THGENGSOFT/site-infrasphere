/**
 * SISTEMA DE SEGURANÇA INFRASPHERE
 * Criptografia SHA-256 (Client-Side)
 */

const CONFIG = {
    // Hash CORRETO capturado do seu navegador para a senha "admin2026"
    PASSWORD_HASH: "6051fc84a7a0d74c225fb18a496b09952da5642e60723ecae543298edd7d82d6",
    SESSION_KEY: "infrasphere_auth_token"
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function tryLogin(inputPassword) {
    try {
        const inputHash = await sha256(inputPassword);
        
        if (inputHash === CONFIG.PASSWORD_HASH) {
            // Sucesso: Salva sessão e redireciona
            sessionStorage.setItem(CONFIG.SESSION_KEY, "active");
            window.location.href = "sistema-interno.html";
        } else {
            alert("⛔ Acesso Negado: Senha incorreta.");
            document.getElementById('password').value = ''; // Limpa o campo
        }
    } catch (error) {
        console.error(error);
        alert("Erro de segurança no navegador. Tente usar Chrome ou Edge atualizados.");
    }
}

// Gatekeeper: Protege as páginas internas
function checkAuth() {
    const session = sessionStorage.getItem(CONFIG.SESSION_KEY);
    if (session !== "active") {
        // Se não tiver logado, manda pro login
        window.location.href = "login.html";
    }
}

function logout() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = "login.html";
}