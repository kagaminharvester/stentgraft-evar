// Stentgraft Sizing Backend Server with Claude API
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic();

// Middleware
app.use(cors());
app.use(express.json());

// Load RAG knowledge base
let ragKnowledgeBase = '';

function loadKnowledgeBase() {
  const ragPath = join(__dirname, '../../..', 'aaa-stentgraft-rag');
  const loadedFiles = [];

  function readMarkdownFiles(dir) {
    try {
      const files = readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = join(dir, file.name);
        if (file.isDirectory()) {
          readMarkdownFiles(fullPath);
        } else if (file.name.endsWith('.md')) {
          const content = readFileSync(fullPath, 'utf-8');
          ragKnowledgeBase += `\n\n--- ${file.name} ---\n${content}`;
          loadedFiles.push(file.name);
        }
      }
    } catch (err) {
      console.error('Error loading knowledge base:', err);
    }
  }

  readMarkdownFiles(ragPath);
  console.log(`Loaded ${loadedFiles.length} knowledge base files:`, loadedFiles);
}

loadKnowledgeBase();

// Endurant II Product Database (inline for API)
const ENDURANT_DB = {
  mainBodies: {
    ETBF: [
      // 23mm
      { code: "ETBF-23-13-C-124-EE", aortic: 23, ipsi: 13, length: 124, gate: 12 },
      { code: "ETBF-23-13-C-145-EE", aortic: 23, ipsi: 13, length: 145, gate: 12 },
      { code: "ETBF-23-13-C-166-EE", aortic: 23, ipsi: 13, length: 166, gate: 12 },
      { code: "ETBF-23-16-C-124-EE", aortic: 23, ipsi: 16, length: 124, gate: 12 },
      { code: "ETBF-23-16-C-145-EE", aortic: 23, ipsi: 16, length: 145, gate: 12 },
      { code: "ETBF-23-16-C-166-EE", aortic: 23, ipsi: 16, length: 166, gate: 12 },
      // 25mm
      { code: "ETBF-25-13-C-124-EE", aortic: 25, ipsi: 13, length: 124, gate: 14 },
      { code: "ETBF-25-13-C-145-EE", aortic: 25, ipsi: 13, length: 145, gate: 14 },
      { code: "ETBF-25-13-C-166-EE", aortic: 25, ipsi: 13, length: 166, gate: 14 },
      { code: "ETBF-25-16-C-124-EE", aortic: 25, ipsi: 16, length: 124, gate: 14 },
      { code: "ETBF-25-16-C-145-EE", aortic: 25, ipsi: 16, length: 145, gate: 14 },
      { code: "ETBF-25-16-C-166-EE", aortic: 25, ipsi: 16, length: 166, gate: 14 },
      // 28mm
      { code: "ETBF-28-13-C-124-EE", aortic: 28, ipsi: 13, length: 124, gate: 14 },
      { code: "ETBF-28-13-C-145-EE", aortic: 28, ipsi: 13, length: 145, gate: 14 },
      { code: "ETBF-28-13-C-166-EE", aortic: 28, ipsi: 13, length: 166, gate: 14 },
      { code: "ETBF-28-16-C-124-EE", aortic: 28, ipsi: 16, length: 124, gate: 14 },
      { code: "ETBF-28-16-C-145-EE", aortic: 28, ipsi: 16, length: 145, gate: 14 },
      { code: "ETBF-28-16-C-166-EE", aortic: 28, ipsi: 16, length: 166, gate: 14 },
      { code: "ETBF-28-20-C-124-EE", aortic: 28, ipsi: 20, length: 124, gate: 14 },
      { code: "ETBF-28-20-C-145-EE", aortic: 28, ipsi: 20, length: 145, gate: 14 },
      { code: "ETBF-28-20-C-166-EE", aortic: 28, ipsi: 20, length: 166, gate: 14 },
      // 32mm
      { code: "ETBF-32-16-C-124-EE", aortic: 32, ipsi: 16, length: 124, gate: 14 },
      { code: "ETBF-32-16-C-145-EE", aortic: 32, ipsi: 16, length: 145, gate: 14 },
      { code: "ETBF-32-16-C-166-EE", aortic: 32, ipsi: 16, length: 166, gate: 14 },
      { code: "ETBF-32-20-C-124-EE", aortic: 32, ipsi: 20, length: 124, gate: 14 },
      { code: "ETBF-32-20-C-145-EE", aortic: 32, ipsi: 20, length: 145, gate: 14 },
      { code: "ETBF-32-20-C-166-EE", aortic: 32, ipsi: 20, length: 166, gate: 14 },
      // 36mm
      { code: "ETBF-36-16-C-145-EE", aortic: 36, ipsi: 16, length: 145, gate: 14 },
      { code: "ETBF-36-16-C-166-EE", aortic: 36, ipsi: 16, length: 166, gate: 14 },
      { code: "ETBF-36-20-C-145-EE", aortic: 36, ipsi: 20, length: 145, gate: 14 },
      { code: "ETBF-36-20-C-166-EE", aortic: 36, ipsi: 20, length: 166, gate: 14 },
    ],
    ESBF: [
      { code: "ESBF-23-14-C-103-EE", aortic: 23, ipsi: 14, length: 103, gate: 14 },
      { code: "ESBF-25-14-C-103-EE", aortic: 25, ipsi: 14, length: 103, gate: 14 },
      { code: "ESBF-28-14-C-103-EE", aortic: 28, ipsi: 14, length: 103, gate: 14 },
      { code: "ESBF-32-14-C-103-EE", aortic: 32, ipsi: 14, length: 103, gate: 14 },
      { code: "ESBF-36-14-C-103-EE", aortic: 36, ipsi: 14, length: 103, gate: 14 },
    ]
  },
  limbs: {
    ETLW: [
      { code: "ETLW-16-10-C-82-EE", prox: 16, dist: 10, length: 82 },
      { code: "ETLW-16-10-C-93-EE", prox: 16, dist: 10, length: 93 },
      { code: "ETLW-16-10-C-124-EE", prox: 16, dist: 10, length: 124 },
      { code: "ETLW-16-10-C-146-EE", prox: 16, dist: 10, length: 146 },
      { code: "ETLW-16-13-C-82-EE", prox: 16, dist: 13, length: 82 },
      { code: "ETLW-16-13-C-93-EE", prox: 16, dist: 13, length: 93 },
      { code: "ETLW-16-13-C-124-EE", prox: 16, dist: 13, length: 124 },
      { code: "ETLW-16-13-C-146-EE", prox: 16, dist: 13, length: 146 },
      { code: "ETLW-16-16-C-82-EE", prox: 16, dist: 16, length: 82 },
      { code: "ETLW-16-16-C-93-EE", prox: 16, dist: 16, length: 93 },
      { code: "ETLW-16-20-C-82-EE", prox: 16, dist: 20, length: 82 },
      { code: "ETLW-16-20-C-93-EE", prox: 16, dist: 20, length: 93 },
      { code: "ETLW-16-24-C-82-EE", prox: 16, dist: 24, length: 82 },
      { code: "ETLW-16-28-C-82-EE", prox: 16, dist: 28, length: 82 },
    ],
    ETEW: [
      { code: "ETEW-10-C-82-EE", diam: 10, length: 82 },
      { code: "ETEW-13-C-82-EE", diam: 13, length: 82 },
      { code: "ETEW-20-C-82-EE", diam: 20, length: 82 },
      { code: "ETEW-24-C-82-EE", diam: 24, length: 82 },
      { code: "ETEW-28-C-82-EE", diam: 28, length: 82 },
    ]
  },
  ifu: {
    neckLength: { min: 10, optimal: 15, withEndoAnchor: 4 },
    neckAngle: { max: 60, withLongNeck: 75 },
    neckDiameter: { min: 19, max: 32 },
    iliacDiameter: { min: 8, max: 25 },
    oversizing: { min: 10, optimal: 15, max: 25 },
    overlap: { min: 30 }
  }
};

// System prompt for Claude
const SYSTEM_PROMPT = `Jesteś ekspertem w wymiarowaniu stentgraftów do leczenia tętniaków aorty brzusznej (AAA) metodą EVAR.
Specjalizujesz się w systemie Medtronic Endurant II/IIs.

ZASADY WYMIAROWANIA:
1. Przewymiarowanie (oversizing) powinno wynosić 10-25%, optymalnie 15%
2. Minimalna zakładka (overlap) między komponentami: 30mm
3. ETLW ma zawsze 16mm proksymalnie i różne średnice dystalne (10-28mm)
4. ETEW to proste przedłużki o tej samej średnicy (10, 13, 20, 24, 28mm)
5. Gate main body ma średnicę 12mm (dla 23mm aortic) lub 14mm (dla 25-36mm aortic)
6. ETLW można używać po obu stronach jeśli noga ipsilateralna main body ma ≥16mm

DOSTĘPNE PRODUKTY:
${JSON.stringify(ENDURANT_DB, null, 2)}

BAZA WIEDZY:
${ragKnowledgeBase}

Odpowiadaj po polsku. Zawsze podawaj konkretne kody produktów i uzasadnienie wyboru.
Przy wymiarowaniu obliczaj procent przewymiarowania dla każdego komponentu.`;

// API Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', knowledgeBaseLoaded: ragKnowledgeBase.length > 0 });
});

// Get sizing recommendation from Claude
app.post('/api/sizing/recommend', async (req, res) => {
  try {
    const { measurements, question } = req.body;

    const userMessage = question || `
Pacjent z następującymi pomiarami anatomicznymi:
- Średnica szyi aorty: ${measurements.neckDiameter}mm
- Długość szyi: ${measurements.neckLength}mm
- Kąt szyi: ${measurements.neckAngle}°
- Prawa CIA: ${measurements.rightCIA}mm
- Lewa CIA: ${measurements.leftCIA}mm
- Długość od tętnic nerkowych do rozwidlenia: ${measurements.renalToBifurcation}mm
- Długość CIA: ${measurements.ciaLength}mm
- Dostęp naczyniowy: ${measurements.accessRight}mm (P) / ${measurements.accessLeft}mm (L)
- Strona wprowadzenia: ${measurements.introSide === 'right' ? 'prawa' : 'lewa'}

Dobierz optymalną konfigurację stentgraftu Endurant II/IIs.
Podaj 2 warianty konfiguracji z uzasadnieniem i obliczeniami przewymiarowania.
Dla każdego wariantu podaj:
1. Kod main body i uzasadnienie wyboru
2. Kody przedłużek biodrowych z obliczeniami
3. Komentarz kliniczny
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }]
    });

    const aiResponse = response.content[0].text;

    res.json({
      success: true,
      recommendation: aiResponse,
      measurements
    });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ask general question to Claude
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      ...history.map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages
    });

    res.json({
      success: true,
      response: response.content[0].text
    });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product database
app.get('/api/products', (req, res) => {
  res.json(ENDURANT_DB);
});

// Get IFU constraints
app.get('/api/ifu', (req, res) => {
  res.json(ENDURANT_DB.ifu);
});

// Start server
app.listen(PORT, () => {
  console.log(`Stentgraft Sizing Server running on port ${PORT}`);
  console.log(`Knowledge base loaded: ${ragKnowledgeBase.length} characters`);
});

export default app;
