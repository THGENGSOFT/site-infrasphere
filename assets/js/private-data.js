/**
 * 🔒 DADOS COMERCIAIS & LÓGICA DO SISTEMA
 * Versão ASCII SAFE - Compatibilidade 100% com WhatsApp
 */

// --- 1. TABELA DE PREÇOS ---
const rawData = [
    // 1. WEB EXPERIENCE
    { cat: "01. Web Experience", ref: "WEB-01", desc: "Landing Page High-End (One Page)", price: 900.00, monthly: false },
    { cat: "01. Web Experience", ref: "WEB-02", desc: "Site Institucional (Até 5 Pág)", price: 1800.00, monthly: false },
    { cat: "01. Web Experience", ref: "WEB-03", desc: "Portal de Conteúdo / Blog (CMS)", price: 2200.00, monthly: false },
    
    // 2. SISTEMAS SAAS
    { cat: "02. Sistemas & SaaS", ref: "SYS-01", desc: "Dashboard Administrativo (MVP)", price: 3500.00, monthly: false },
    { cat: "02. Sistemas & SaaS", ref: "SYS-02", desc: "Calculadora de Orçamentos", price: 1500.00, monthly: false },
    { cat: "02. Sistemas & SaaS", ref: "SYS-03", desc: "Sistema de Agendamento Online", price: 2000.00, monthly: false },

    // 3. E-COMMERCE
    { cat: "03. E-Commerce", ref: "ECO-01", desc: "Setup Nuvemshop (Visual + Domínio)", price: 800.00, monthly: false },
    { cat: "03. E-Commerce", ref: "ECO-02", desc: "Woocommerce Pro (Requer Manutenção)", price: 3200.00, monthly: false },

    // 4. INFRA & BOTS
    { cat: "04. Infra & Automação", ref: "API-01", desc: "Integração API (Pagamento/Whats)", price: 600.00, monthly: false },
    { cat: "04. Infra & Automação", ref: "BOT-01", desc: "Bot Python (Dev + Setup)", price: 900.00, monthly: false },
    { cat: "04. Infra & Automação", ref: "INF-01", desc: "Setup VPS Linux + Docker", price: 450.00, monthly: false },

    // 5. RECORRÊNCIA (MRR)
    { cat: "05. Recorrência & Suporte", ref: "REC-01", desc: "Hospedagem Premium + Cuidados Web", price: 129.00, monthly: true },
    { cat: "05. Recorrência & Suporte", ref: "REC-02", desc: "Manutenção Sistemas/VPS (SLA 24h)", price: 250.00, monthly: true }
];

let cart = {};

// --- 2. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) renderTable();
});

// --- 3. FUNÇÕES AUXILIARES ---
function groupBy(xs, key) {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

function renderTable() {
    const app = document.getElementById('app');
    const groups = groupBy(rawData, 'cat');
    let html = '';
    
    for (const [category, items] of Object.entries(groups)) {
        const isRecurring = category.includes("Recorrência");
        const headerClass = isRecurring ? 'category-header recurring-header' : 'category-header';
        
        html += `<div class="category-block">
                    <div class="${headerClass}">
                        ${category} 
                        ${isRecurring ? '<span style="font-size:0.7em; opacity:0.8">⭐ Recomendado</span>' : ''}
                    </div>
                    <table><tbody>`;
        
        items.forEach((item, index) => {
            const safeId = item.ref.replace(/[^a-zA-Z0-9]/g, '') + index;
            const priceFormatted = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const suffix = item.monthly ? '<small>/mês</small>' : '';
            
            html += `<tr id="row-${safeId}" data-price="${item.price}" data-monthly="${item.monthly}" data-desc="${item.desc}">
                        <td class="col-desc">
                            ${item.desc}
                            ${item.monthly ? '<div class="recurrence-tag">Renovação Mensal</div>' : ''}
                        </td>
                        <td class="col-price">
                            ${priceFormatted}${suffix}
                        </td>
                        <td style="width:70px; text-align:right;">
                            <input type="number" min="0" placeholder="0" 
                                   oninput="updateItem('${safeId}', '${category}', ${item.price}, this.value, ${item.monthly})">
                        </td>
                     </tr>`;
        });
        html += `</tbody></table></div>`;
    }
    app.innerHTML = html;
}

function updateItem(id, cat, price, qty, isMonthly) {
    const row = document.getElementById(`row-${id}`);
    const desc = row.getAttribute('data-desc');
    qty = parseInt(qty) || 0;
    if (qty < 0) qty = 0; 

    if (qty > 0) {
        row.classList.add('active-row');
        cart[id] = { desc, cat, price, qty, isMonthly, total: price * qty };
    } else {
        row.classList.remove('active-row');
        delete cart[id];
    }
    recalculate();
}

function recalculate() {
    let totalSetup = 0;
    let totalMonthly = 0;

    Object.values(cart).forEach(item => {
        if (item.isMonthly) totalMonthly += item.total;
        else totalSetup += item.total;
    });
    
    document.getElementById('ui-total-setup').innerText = totalSetup.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const monthlyEl = document.getElementById('ui-total-monthly');
    if(totalMonthly > 0) {
        monthlyEl.style.display = 'block';
        monthlyEl.innerText = "+ " + totalMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " /mês";
    } else {
        monthlyEl.style.display = 'none';
    }
}

function resetForm() {
    if(Object.keys(cart).length === 0) return;
    if(confirm("Deseja limpar todo o orçamento atual?")) {
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        document.querySelectorAll('tr').forEach(row => row.classList.remove('active-row'));
        cart = {};
        recalculate();
    }
}

// --- 4. GERAÇÃO DE SAÍDA WHATSAPP (ESTILO TERMINAL/ASCII) ---
// Sem emojis, sem bugs de encoding. Pura confiabilidade.

function generateWhatsApp() {
    if (Object.keys(cart).length === 0) {
        alert("⚠️ Selecione pelo menos um serviço.");
        return;
    }

    // Header Estilo Terminal
    let text = `=== INFRASPHERE PROPOSAL ===\n`;
    text += `DATE: ${new Date().toLocaleDateString('pt-BR')}\n`;
    text += `--------------------------------\n\n`;

    const itemsByCat = groupBy(Object.values(cart), 'cat');
    let hasSetup = false;
    let hasMonthly = false;

    // Loop de Categorias
    for(const [cat, items] of Object.entries(itemsByCat)) {
        const setupItems = items.filter(i => !i.isMonthly);
        const monthlyItemsInCat = items.filter(i => i.isMonthly);

        // Itens de Setup
        if(setupItems.length > 0) {
            hasSetup = true;
            text += `[ ${cat.toUpperCase()} ]\n`;
            setupItems.forEach(item => {
                text += `+ ${item.desc}`;
                if(item.qty > 1) text += ` (x${item.qty})`;
                text += `\n`;
            });
            text += `\n`;
        }
        
        if(monthlyItemsInCat.length > 0) hasMonthly = true;
    }

    // Itens de Recorrência (Separados)
    const allMonthly = Object.values(cart).filter(i => i.isMonthly);
    if(allMonthly.length > 0) {
        text += `[ RECORRENCIA E SUPORTE ]\n`;
        allMonthly.forEach(item => {
             text += `>> ${item.desc}\n`;
        });
        text += `\n`;
    }

    const totalSetup = document.getElementById('ui-total-setup').innerText;
    const totalMonthly = document.getElementById('ui-total-monthly').innerText;

    // Resumo Financeiro
    text += `--------------------------------\n`;
    text += `TOTAL INVESTMENT:\n`;
    if(hasSetup) text += `> SETUP: ${totalSetup}\n`;
    if(hasMonthly) text += `> MENSAL: ${totalMonthly.replace('+ ', '')}\n`;
    text += `================================\n`;
    
    text += `\n(Validade: 7 dias)`;

    // Codifica para URL
    const url = `https://wa.me/5541996826409?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function printOrder() {
    if (Object.keys(cart).length === 0) {
        alert("O orçamento está vazio. Selecione itens antes de gerar o PDF.");
        return;
    }

    const tbody = document.getElementById('print-tbody');
    tbody.innerHTML = '';
    
    let totalSetup = 0;
    let totalMonthly = 0;

    const sortedItems = Object.values(cart).sort((a, b) => a.isMonthly - b.isMonthly);

    sortedItems.forEach(item => {
        if(item.isMonthly) totalMonthly += item.total;
        else totalSetup += item.total;

        const typeLabel = item.isMonthly ? ' (Mensal)' : '';
        const rowStyle = item.isMonthly ? 'font-weight:bold;' : '';

        tbody.innerHTML += `
            <tr>
                <td style="${rowStyle}">${item.desc}${typeLabel}</td>
                <td style="text-align:center">${item.qty}</td>
                <td style="text-align:right">${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style="text-align:right">${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
        `;
    });

    document.getElementById('print-setup-val').innerText = totalSetup.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const monthlyRow = document.getElementById('print-monthly-row');
    if(totalMonthly > 0) {
        monthlyRow.style.display = 'flex';
        document.getElementById('print-monthly-val').innerText = totalMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " /mês";
    } else {
        monthlyRow.style.display = 'none';
    }

    document.getElementById('print-date').innerText = "Data: " + new Date().toLocaleDateString('pt-BR');
    window.print();
}