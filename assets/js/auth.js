/**
 * SISTEMA DE SEGURANÇA INFRASPHERE
 * Criptografia SHA-256 (Client-Side)
 */

const CONFIG = {
    // Cole aqui o HASH gerado no console (NÃO cole a senha em texto puro!)
    PASSWORD_HASH: "09c00cea6ecfdbfe28dffbdaf776ea9e2d52b5838935caab13a0e03b9acb9f24", 
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