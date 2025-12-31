// AAA Stentgraft Sizing App - Single Node.js Application
import Anthropic from '@anthropic-ai/sdk';
import http from 'http';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3030;

// Anthropic client will be created per-request with user's API key

// Load RAG Knowledge Base
let ragKnowledge = '';
function loadRAG() {
  const ragPath = join(__dirname, '..', 'aaa-stentgraft-rag');
  function readDir(dir) {
    try {
      const files = readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const path = join(dir, f.name);
        if (f.isDirectory()) readDir(path);
        else if (f.name.endsWith('.md')) {
          ragKnowledge += `\n\n=== ${f.name} ===\n` + readFileSync(path, 'utf-8');
        }
      }
    } catch (e) { }
  }
  readDir(ragPath);
  console.log(`RAG loaded: ${(ragKnowledge.length / 1024).toFixed(1)} KB`);
}
loadRAG();

// Endurant Database
const DB = {
  ETBF: [
    { code: "ETBF-23-13-C-124-EE", aortic: 23, ipsi: 13, len: 124, gate: 12 },
    { code: "ETBF-23-13-C-145-EE", aortic: 23, ipsi: 13, len: 145, gate: 12 },
    { code: "ETBF-23-13-C-166-EE", aortic: 23, ipsi: 13, len: 166, gate: 12 },
    { code: "ETBF-23-16-C-124-EE", aortic: 23, ipsi: 16, len: 124, gate: 12 },
    { code: "ETBF-23-16-C-145-EE", aortic: 23, ipsi: 16, len: 145, gate: 12 },
    { code: "ETBF-23-16-C-166-EE", aortic: 23, ipsi: 16, len: 166, gate: 12 },
    { code: "ETBF-25-13-C-124-EE", aortic: 25, ipsi: 13, len: 124, gate: 14 },
    { code: "ETBF-25-13-C-145-EE", aortic: 25, ipsi: 13, len: 145, gate: 14 },
    { code: "ETBF-25-13-C-166-EE", aortic: 25, ipsi: 13, len: 166, gate: 14 },
    { code: "ETBF-25-16-C-124-EE", aortic: 25, ipsi: 16, len: 124, gate: 14 },
    { code: "ETBF-25-16-C-145-EE", aortic: 25, ipsi: 16, len: 145, gate: 14 },
    { code: "ETBF-25-16-C-166-EE", aortic: 25, ipsi: 16, len: 166, gate: 14 },
    { code: "ETBF-28-13-C-124-EE", aortic: 28, ipsi: 13, len: 124, gate: 14 },
    { code: "ETBF-28-13-C-145-EE", aortic: 28, ipsi: 13, len: 145, gate: 14 },
    { code: "ETBF-28-13-C-166-EE", aortic: 28, ipsi: 13, len: 166, gate: 14 },
    { code: "ETBF-28-16-C-124-EE", aortic: 28, ipsi: 16, len: 124, gate: 14 },
    { code: "ETBF-28-16-C-145-EE", aortic: 28, ipsi: 16, len: 145, gate: 14 },
    { code: "ETBF-28-16-C-166-EE", aortic: 28, ipsi: 16, len: 166, gate: 14 },
    { code: "ETBF-28-20-C-124-EE", aortic: 28, ipsi: 20, len: 124, gate: 14 },
    { code: "ETBF-28-20-C-145-EE", aortic: 28, ipsi: 20, len: 145, gate: 14 },
    { code: "ETBF-28-20-C-166-EE", aortic: 28, ipsi: 20, len: 166, gate: 14 },
    { code: "ETBF-32-16-C-124-EE", aortic: 32, ipsi: 16, len: 124, gate: 14 },
    { code: "ETBF-32-16-C-145-EE", aortic: 32, ipsi: 16, len: 145, gate: 14 },
    { code: "ETBF-32-16-C-166-EE", aortic: 32, ipsi: 16, len: 166, gate: 14 },
    { code: "ETBF-32-20-C-124-EE", aortic: 32, ipsi: 20, len: 124, gate: 14 },
    { code: "ETBF-32-20-C-145-EE", aortic: 32, ipsi: 20, len: 145, gate: 14 },
    { code: "ETBF-32-20-C-166-EE", aortic: 32, ipsi: 20, len: 166, gate: 14 },
    { code: "ETBF-36-16-C-145-EE", aortic: 36, ipsi: 16, len: 145, gate: 14 },
    { code: "ETBF-36-16-C-166-EE", aortic: 36, ipsi: 16, len: 166, gate: 14 },
    { code: "ETBF-36-20-C-145-EE", aortic: 36, ipsi: 20, len: 145, gate: 14 },
    { code: "ETBF-36-20-C-166-EE", aortic: 36, ipsi: 20, len: 166, gate: 14 },
  ],
  ESBF: [
    { code: "ESBF-23-14-C-103-EE", aortic: 23, ipsi: 14, len: 103, gate: 14 },
    { code: "ESBF-25-14-C-103-EE", aortic: 25, ipsi: 14, len: 103, gate: 14 },
    { code: "ESBF-28-14-C-103-EE", aortic: 28, ipsi: 14, len: 103, gate: 14 },
    { code: "ESBF-32-14-C-103-EE", aortic: 32, ipsi: 14, len: 103, gate: 14 },
    { code: "ESBF-36-14-C-103-EE", aortic: 36, ipsi: 14, len: 103, gate: 14 },
  ],
  ETLW: [
    { code: "ETLW-16-10-C-82-EE", prox: 16, dist: 10, len: 82 },
    { code: "ETLW-16-10-C-93-EE", prox: 16, dist: 10, len: 93 },
    { code: "ETLW-16-10-C-124-EE", prox: 16, dist: 10, len: 124 },
    { code: "ETLW-16-10-C-146-EE", prox: 16, dist: 10, len: 146 },
    { code: "ETLW-16-13-C-82-EE", prox: 16, dist: 13, len: 82 },
    { code: "ETLW-16-13-C-93-EE", prox: 16, dist: 13, len: 93 },
    { code: "ETLW-16-13-C-124-EE", prox: 16, dist: 13, len: 124 },
    { code: "ETLW-16-13-C-146-EE", prox: 16, dist: 13, len: 146 },
    { code: "ETLW-16-16-C-82-EE", prox: 16, dist: 16, len: 82 },
    { code: "ETLW-16-16-C-93-EE", prox: 16, dist: 16, len: 93 },
    { code: "ETLW-16-16-C-124-EE", prox: 16, dist: 16, len: 124 },
    { code: "ETLW-16-20-C-82-EE", prox: 16, dist: 20, len: 82 },
    { code: "ETLW-16-20-C-93-EE", prox: 16, dist: 20, len: 93 },
    { code: "ETLW-16-24-C-82-EE", prox: 16, dist: 24, len: 82 },
    { code: "ETLW-16-24-C-93-EE", prox: 16, dist: 24, len: 93 },
    { code: "ETLW-16-28-C-82-EE", prox: 16, dist: 28, len: 82 },
  ],
  ETEW: [
    { code: "ETEW-10-C-82-EE", diam: 10, len: 82 },
    { code: "ETEW-13-C-82-EE", diam: 13, len: 82 },
    { code: "ETEW-20-C-82-EE", diam: 20, len: 82 },
    { code: "ETEW-24-C-82-EE", diam: 24, len: 82 },
    { code: "ETEW-28-C-82-EE", diam: 28, len: 82 },
  ]
};

// System prompt
const SYSTEM = `Jesteś ekspertem w wymiarowaniu stentgraftów AAA (Medtronic Endurant II/IIs).

ZASADY:
- Przewymiarowanie: 10-25% (optymalnie 15%)
- Minimalna zakładka: 30mm
- ETLW: zawsze 16mm proksymalnie, różne dystalne (10-28mm)
- ETEW: proste, ta sama średnica (10,13,20,24,28mm)
- Gate: 12mm (aortic 23mm) lub 14mm (aortic 25-36mm)
- ETLW można po obu stronach jeśli ipsi leg ≥16mm

PRODUKTY:
${JSON.stringify(DB, null, 2)}

BAZA WIEDZY:
${ragKnowledge.substring(0, 50000)}

Odpowiadaj po polsku. Podawaj kody produktów i uzasadnienie.`;

// HTML Frontend
const HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wymiarowanie Stentgraftów AAA</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; color: #333; line-height: 1.5; }
    .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 1.5rem; text-align: center; }
    .header h1 { font-size: 1.5rem; }
    .header p { opacity: 0.9; font-size: 0.9rem; }
    .container { max-width: 1200px; margin: 0 auto; padding: 1rem; display: grid; grid-template-columns: 400px 1fr; gap: 1rem; }
    @media (max-width: 900px) { .container { grid-template-columns: 1fr; } }
    .panel { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #1e40af; }
    h3 { font-size: 0.95rem; margin: 1rem 0 0.5rem; color: #555; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    label { display: flex; flex-direction: column; font-size: 0.85rem; color: #666; }
    input, select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; margin-top: 0.3rem; }
    input:focus, select:focus { outline: none; border-color: #2563eb; }
    .btn { width: 100%; padding: 0.8rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-top: 1rem; transition: background 0.2s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1e40af; }
    .btn-secondary { background: #10b981; color: white; }
    .btn-secondary:hover { background: #059669; }
    .btn:disabled { opacity: 0.6; cursor: wait; }
    .result { background: #f8fafc; border-radius: 8px; padding: 1rem; margin-top: 1rem; white-space: pre-wrap; font-size: 0.9rem; max-height: 500px; overflow-y: auto; }
    .svg-container { text-align: center; }
    svg { max-width: 100%; }
    .chat-box { border: 1px solid #ddd; border-radius: 8px; height: 300px; overflow-y: auto; padding: 1rem; margin-bottom: 1rem; background: #fafafa; }
    .chat-msg { margin-bottom: 0.8rem; padding: 0.6rem; border-radius: 8px; }
    .chat-msg.user { background: #dbeafe; margin-left: 2rem; }
    .chat-msg.ai { background: white; margin-right: 2rem; border: 1px solid #e5e7eb; }
    .chat-input { display: flex; gap: 0.5rem; }
    .chat-input input { flex: 1; }
    .chat-input button { padding: 0.6rem 1.2rem; }
    .tabs { display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 1rem; }
    .tab { padding: 0.8rem 1.2rem; border: none; background: none; cursor: pointer; font-size: 0.95rem; color: #666; }
    .tab.active { color: #2563eb; border-bottom: 2px solid #2563eb; margin-bottom: -2px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .loading { text-align: center; padding: 2rem; color: #666; }
    .footer { text-align: center; padding: 1rem; color: #888; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Wymiarowanie Stentgraftów AAA</h1>
    <p>System Medtronic Endurant II/IIs</p>
    <div style="margin-top:0.8rem;">
      <input type="password" id="apiKey" placeholder="Wklej klucz API Anthropic (sk-ant-...)"
        style="padding:0.5rem 1rem; width:350px; border-radius:6px; border:none; font-size:0.9rem;">
    </div>
  </div>

  <div class="container">
    <div class="panel">
      <h2>Pomiary Anatomiczne</h2>

      <h3>Szyja Aorty</h3>
      <div class="form-grid">
        <label>Średnica (mm)<input type="number" id="neckDiam" value="25" min="15" max="40"></label>
        <label>Długość (mm)<input type="number" id="neckLen" value="36" min="0" max="100"></label>
        <label>Kąt (°)<input type="number" id="neckAngle" value="45" min="0" max="120"></label>
      </div>

      <h3>Tętnice Biodrowe (CIA)</h3>
      <div class="form-grid">
        <label>Prawa (mm)<input type="number" id="rightCIA" value="10" min="5" max="30"></label>
        <label>Lewa (mm)<input type="number" id="leftCIA" value="12" min="5" max="30"></label>
      </div>

      <h3>Długości</h3>
      <div class="form-grid">
        <label>Nerkowe→Rozwidlenie (mm)<input type="number" id="renalBif" value="117" min="50" max="250"></label>
        <label>CIA (mm)<input type="number" id="ciaLen" value="83" min="20" max="150"></label>
      </div>

      <h3>Dostęp Naczyniowy</h3>
      <div class="form-grid">
        <label>Prawy (mm)<input type="number" id="accessR" value="7" min="3" max="15"></label>
        <label>Lewy (mm)<input type="number" id="accessL" value="7" min="3" max="15"></label>
        <label>Wprowadzenie
          <select id="introSide">
            <option value="right">Prawa</option>
            <option value="left">Lewa</option>
          </select>
        </label>
      </div>

      <button class="btn btn-primary" onclick="getSizing()" id="btnSizing">Dobierz Stentgraft (AI)</button>

      <div class="svg-container" style="margin-top:1rem;">
        <svg viewBox="0 0 300 400" width="280">
          <defs>
            <linearGradient id="vessel" x1="0%" x2="100%"><stop offset="0%" stop-color="#ffcccb"/><stop offset="50%" stop-color="#ffe4e4"/><stop offset="100%" stop-color="#ffcccb"/></linearGradient>
            <linearGradient id="graft" x1="0%" x2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="50%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient>
          </defs>
          <!-- Renal markers -->
          <line x1="100" y1="30" x2="120" y2="30" stroke="#8b0000" stroke-width="3"/>
          <line x1="180" y1="30" x2="200" y2="30" stroke="#8b0000" stroke-width="3"/>
          <text x="80" y="34" font-size="10" fill="#666">Tt.nerkowe</text>
          <!-- Aortic neck -->
          <rect id="neck" x="125" y="30" width="50" height="40" fill="url(#vessel)" stroke="#8b0000"/>
          <!-- Aneurysm -->
          <ellipse cx="150" cy="120" rx="60" ry="50" fill="url(#vessel)" stroke="#8b0000" stroke-dasharray="4"/>
          <text x="220" y="120" font-size="10" fill="#666">Tętniak</text>
          <!-- Bifurcation -->
          <path d="M130 170 Q150 200 120 280 L140 280 Q150 210 160 280 L180 280 Q150 200 170 170 Z" fill="url(#vessel)" stroke="#8b0000"/>
          <text x="100" y="290" font-size="9" fill="#666">L.CIA</text>
          <text x="165" y="290" font-size="9" fill="#666">P.CIA</text>
          <!-- Stentgraft overlay -->
          <g id="stentgraft" opacity="0.85">
            <rect x="130" y="35" width="40" height="100" fill="url(#graft)" stroke="#1e40af" stroke-width="2" rx="3"/>
            <path d="M135 135 L125 250 L138 250 L145 145 Z" fill="#22c55e" stroke="#166534" stroke-width="1.5"/>
            <path d="M165 135 L175 250 L162 250 L155 145 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
          </g>
          <!-- Legend -->
          <rect x="10" y="320" width="12" height="12" fill="url(#graft)" stroke="#1e40af"/>
          <text x="26" y="330" font-size="9">Main Body</text>
          <rect x="10" y="340" width="12" height="12" fill="#22c55e" stroke="#166534"/>
          <text x="26" y="350" font-size="9">ETLW (kontra)</text>
          <rect x="10" y="360" width="12" height="12" fill="#f59e0b" stroke="#b45309"/>
          <text x="26" y="370" font-size="9">Przedłużka (ipsi)</text>
        </svg>
      </div>
    </div>

    <div class="panel">
      <div class="tabs">
        <button class="tab active" onclick="showTab('result')">Wynik</button>
        <button class="tab" onclick="showTab('chat')">Chat</button>
      </div>

      <div id="tab-result" class="tab-content active">
        <h2>Rekomendacja AI</h2>
        <div id="result" class="result">
          Wprowadź pomiary i kliknij "Dobierz Stentgraft"
        </div>
      </div>

      <div id="tab-chat" class="tab-content">
        <h2>Konsultacja z AI</h2>
        <div id="chatBox" class="chat-box">
          <div class="chat-msg ai">Cześć! Jestem ekspertem od wymiarowania stentgraftów. Zadaj pytanie o EVAR, IFU lub dobór komponentów.</div>
        </div>
        <div class="chat-input">
          <input type="text" id="chatInput" placeholder="Zadaj pytanie..." onkeypress="if(event.key==='Enter')sendChat()">
          <button class="btn btn-secondary" onclick="sendChat()" style="width:auto;margin:0">Wyślij</button>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    Narzędzie pomocnicze - zawsze weryfikuj z aktualnym IFU producenta
  </div>

<script>
function getMeasurements() {
  return {
    neckDiameter: +document.getElementById('neckDiam').value,
    neckLength: +document.getElementById('neckLen').value,
    neckAngle: +document.getElementById('neckAngle').value,
    rightCIA: +document.getElementById('rightCIA').value,
    leftCIA: +document.getElementById('leftCIA').value,
    renalToBifurcation: +document.getElementById('renalBif').value,
    ciaLength: +document.getElementById('ciaLen').value,
    accessRight: +document.getElementById('accessR').value,
    accessLeft: +document.getElementById('accessL').value,
    introSide: document.getElementById('introSide').value
  };
}

function getApiKey() {
  return document.getElementById('apiKey').value.trim();
}

async function getSizing() {
  const btn = document.getElementById('btnSizing');
  const result = document.getElementById('result');
  const apiKey = getApiKey();

  if (!apiKey) {
    result.textContent = 'Wpisz klucz API Anthropic w polu na górze strony';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Analizuję...';
  result.textContent = 'Proszę czekać, Claude analizuje anatomię...';

  try {
    const res = await fetch('/api/sizing', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...getMeasurements(), apiKey})
    });
    const data = await res.json();
    result.textContent = data.response || data.error || 'Błąd';
  } catch(e) {
    result.textContent = 'Błąd: ' + e.message;
  }

  btn.disabled = false;
  btn.textContent = 'Dobierz Stentgraft (AI)';
}

let chatHistory = [];
async function sendChat() {
  const input = document.getElementById('chatInput');
  const box = document.getElementById('chatBox');
  const msg = input.value.trim();
  const apiKey = getApiKey();

  if (!apiKey) {
    box.innerHTML += '<div class="chat-msg ai">Wpisz klucz API Anthropic w polu na górze strony</div>';
    return;
  }
  if (!msg) return;

  box.innerHTML += '<div class="chat-msg user">' + msg + '</div>';
  input.value = '';
  box.scrollTop = box.scrollHeight;

  chatHistory.push({role: 'user', content: msg});

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: msg, history: chatHistory.slice(-10), apiKey})
    });
    const data = await res.json();
    const reply = data.response || data.error || 'Błąd';
    chatHistory.push({role: 'assistant', content: reply});
    box.innerHTML += '<div class="chat-msg ai">' + reply + '</div>';
  } catch(e) {
    box.innerHTML += '<div class="chat-msg ai">Błąd: ' + e.message + '</div>';
  }
  box.scrollTop = box.scrollHeight;
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('.tab[onclick*="'+name+'"]').classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
}
</script>
</body>
</html>`;

// HTTP Server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Serve HTML
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  // API: Sizing
  if (url.pathname === '/api/sizing' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { apiKey, ...m } = data;

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak klucza API' }));
          return;
        }

        const anthropic = new Anthropic({ apiKey });
        const prompt = `Pacjent z pomiarami:
- Średnica szyi: ${m.neckDiameter}mm
- Długość szyi: ${m.neckLength}mm
- Kąt szyi: ${m.neckAngle}°
- Prawa CIA: ${m.rightCIA}mm
- Lewa CIA: ${m.leftCIA}mm
- Nerkowe→Rozwidlenie: ${m.renalToBifurcation}mm
- Długość CIA: ${m.ciaLength}mm
- Dostęp: ${m.accessRight}mm (P) / ${m.accessLeft}mm (L)
- Wprowadzenie: ${m.introSide === 'right' ? 'prawa' : 'lewa'} strona

Dobierz optymalną konfigurację Endurant II/IIs.
Podaj 2 warianty z:
1. Kodami produktów (main body, ETLW/ETEW)
2. Obliczeniami przewymiarowania dla każdego komponentu
3. Uzasadnieniem klinicznym
4. Uwagami o zakładkach (overlap min 30mm)`;

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM,
          messages: [{ role: 'user', content: prompt }]
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response: response.content[0].text }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Chat
  if (url.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message, history = [], apiKey } = JSON.parse(body);

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Brak klucza API' }));
          return;
        }

        const anthropic = new Anthropic({ apiKey });
        const messages = [
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: message }
        ];

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: SYSTEM,
          messages
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response: response.content[0].text }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   AAA Stentgraft Sizing Application               ║
║   http://localhost:${PORT}                           ║
╠═══════════════════════════════════════════════════╣
║   Otwórz przeglądarkę i wejdź na powyższy adres   ║
║   Ctrl+C aby zatrzymać                            ║
╚═══════════════════════════════════════════════════╝
`);
});
