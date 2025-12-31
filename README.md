# AAA Stentgraft Sizing Application

Aplikacja webowa do wymiarowania stentgraftów AAA systemu Medtronic Endurant II/IIs z integracją Claude API.

## Nowe funkcje (v2.0)

- **Pełna baza produktów** - wszystkie kody Endurant II/IIs z dokładnymi wymiarami
- **Walidacja IFU** - automatyczna weryfikacja zgodności z instrukcją użycia
- **Checklist z obliczeniami** - szczegółowa lista kontrolna z kalkulacjami przewymiarowania
- **Formularze do druku** - generowanie HTML formularzy gotowych do wydruku
- **Ulepszone AI** - rozszerzony system prompt z pełnymi regułami IFU

## Struktura projektu

```
stentgraft-sizing-app/
├── app.js                    # Główna aplikacja Node.js (serwer + frontend)
├── ai-integration.js         # Moduł integracji AI z rozszerzonym promptem
├── ifu-endurant-rules.js     # Reguły IFU do walidacji
├── endurant-products.js      # Kompletna baza produktów z wymiarami
├── sizing-checklist.js       # Generator checklisty z obliczeniami
├── printable-form.js         # Generator formularzy do druku
├── demo-generate-form.js     # Skrypt demonstracyjny
├── backend/                  # Stary backend (deprecated)
├── frontend/                 # Stary frontend React (deprecated)
└── docs/                     # Dokumentacja
```

## Moduły

### 1. ifu-endurant-rules.js

Zawiera wszystkie reguły IFU:

```javascript
const { IFU_RULES, SIZING_GUIDELINES, IFU_VALIDATION } = require('./ifu-endurant-rules');

// Walidacja szyi aorty
const result = IFU_VALIDATION.validateNeck(neckDiameter, neckLength, neckAngle);
// result.valid, result.errors[], result.warnings[]

// Obliczanie przewymiarowania
const oversize = IFU_VALIDATION.calculateOversizing(25, 28, 'aortic');
// oversize.oversizingPercent = "12.0"
// oversize.status = "optimal" | "acceptable" | "high" | "dangerous"

// Rekomendowany rozmiar graftu
const graft = IFU_VALIDATION.getRecommendedGraft(25, 'aortic'); // 28
```

**Kluczowe reguły:**
- Szyja: 19-32mm średnica, ≥10mm długość, ≤60° kąt
- Przewymiarowanie: 10-20% (opt. 15%), max 25% safe
- Zakładka: min 30mm
- CIA: 8-25mm, seal zone ≥15mm

### 2. endurant-products.js

Pełna baza produktów z wymiarami:

```javascript
const { ENDURANT_PRODUCTS, PRODUCT_HELPERS } = require('./endurant-products');

// Znajdź bifurkację
const bifurcations = PRODUCT_HELPERS.findBifurcation(28, 16, 145);

// Znajdź limb
const limbs = PRODUCT_HELPERS.findLimb(16, 95);

// Wymiary: A, B, C, D, E, F
// ETBF2816C145E: A=28, B=16, C=80, D=93, E=145, F=65
```

**Produkty:**
- ETBF: Endurant II Bifurcations (124, 145, 166mm)
- ESBF: Endurant IIs Short (103mm)
- ETLW: Contralateral Limbs (82-199mm)
- ETEW: Iliac Extensions (82mm)
- ETUF: Aorto-Uni-Iliac
- ETCF/ETTF: Aortic Extensions

### 3. sizing-checklist.js

Generator checklisty z obliczeniami:

```javascript
const { generateSizingChecklist, formatChecklistForDisplay, generateHTMLChecklist } = require('./sizing-checklist');

const checklist = generateSizingChecklist(measurements, selectedConfig);
console.log(formatChecklistForDisplay(checklist));
const html = generateHTMLChecklist(checklist);
```

### 4. printable-form.js

Generator formularzy do druku:

```javascript
const { generatePrintableForm, generateSizingCard } = require('./printable-form');

const formHTML = generatePrintableForm(measurements, config, checklist, {
  patientName: 'Jan Kowalski',
  patientId: '12345678901',
  ctaDate: '2024-12-30'
});
```

### 5. ai-integration.js

Moduł integracji z Claude AI:

```javascript
const { generateSystemPrompt, generateSizingPrompt, processWithChecklist } = require('./ai-integration');

const systemPrompt = generateSystemPrompt();
const userPrompt = generateSizingPrompt(measurements);
const preCheck = processWithChecklist(measurements);
```

## Uruchomienie

### 1. Demo (bez serwera)

```bash
cd ~/downloads/stentgraft-sizing-app
node demo-generate-form.js
# Generuje: output-form.html, output-checklist.html, output-card.html
```

### 2. Pełna aplikacja

```bash
cd ~/downloads/stentgraft-sizing-app
npm install
export ANTHROPIC_API_KEY="sk-ant-..."
node app.js
# Otwórz http://localhost:3030
```

## Reguły wymiarowania IFU

### Przewymiarowanie proksymalne
| Naczynie (mm) | Graft (mm) | Oversize |
|---------------|------------|----------|
| 19-20 | 23 | 15-21% |
| 21-22 | 25 | 14-19% |
| 23-25 | 28 | 12-22% |
| 26-28 | 32 | 14-23% |
| 29-32 | 36 | 12-24% |

### Przewymiarowanie biodrowe
| Naczynie (mm) | Graft (mm) | Oversize |
|---------------|------------|----------|
| 8-9 | 10 | 11-25% |
| 10-11 | 13 | 18-30% |
| 12-14 | 16 | 14-33% |
| 15-18 | 20 | 11-33% |
| 19-22 | 24 | 9-26% |
| 23-25 | 28 | 12-22% |

### Wzory obliczeń
```
Oversize% = (GraftDiameter - VesselDiameter) / VesselDiameter × 100

Długość kontralateralna = D (wewn. kontra) + ETLW - 30mm overlap

Minimalny dostęp = FrenchSize / 3
```

## Przykład checklisty

```
═══════════════════════════════════════════════════════════════
    CHECKLIST WYMIAROWANIA STENTGRAFTU ENDURANT II/IIs
═══════════════════════════════════════════════════════════════
Status ogólny: ✓ PASS

▌ 1. SZYJA AORTY (Proximal Neck)
├─────────────────────────────────────────────────────────────
│ ✓ Średnica szyi aorty
│   Wymaganie: 19-32 mm
│   Zmierzono: 25 mm
│
│ ✓ Przewymiarowanie proksymalne
│   Wymaganie: 10-20% (opt. 15%)
│   Zmierzono: 12.0%
│   Obliczenie:
│     Naczynie: 25mm → Graft: 28mm
│     Oversize = (28 - 25) / 25 × 100% = 12.0%
```

## API Endpoints

### POST /api/sizing
Rekomendacja wymiarowania z walidacją IFU.

### POST /api/chat
Chat z AI o wymiarowaniu i technikach EVAR.

## Disclaimer

**Narzędzie pomocnicze - nie zastępuje oceny klinicznej specjalisty.**

Zawsze weryfikuj z aktualnym IFU producenta przed podjęciem decyzji klinicznych.

## Licencja

Do użytku edukacyjnego.
