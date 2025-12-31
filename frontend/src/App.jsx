// AAA Stentgraft Sizing Application - Main Component
import React, { useState, useCallback } from 'react';
import AortaVisualization from './components/AortaVisualization';
import { calculateOptimalConfigurations, formatConfigurationSummary } from './utils/sizingAlgorithm';
import './App.css';

const API_URL = 'http://localhost:3001/api';

// Initial measurements state
const initialMeasurements = {
  neckDiameter: 25,
  neckLength: 36,
  neckAngle: 45,
  rightCIA: 10,
  leftCIA: 12,
  renalToBifurcation: 117,
  ciaLength: 83,
  accessRight: 7,
  accessLeft: 7,
  introSide: 'right'
};

function App() {
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [configurations, setConfigurations] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [highlightSegment, setHighlightSegment] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState('');

  // Handle measurement input change
  const handleMeasurementChange = useCallback((field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: field === 'introSide' ? value : parseFloat(value) || 0
    }));
  }, []);

  // Calculate configurations locally
  const handleLocalCalculation = useCallback(() => {
    const result = calculateOptimalConfigurations(measurements);
    setConfigurations(result);
    setSelectedConfig(0);
    setActiveTab('results');
  }, [measurements]);

  // Get AI recommendation from Claude API
  const handleAIRecommendation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sizing/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements })
      });
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.recommendation);
        setActiveTab('ai');
      } else {
        setAiResponse('Błąd: ' + data.error);
      }
    } catch (error) {
      setAiResponse('Błąd połączenia z serwerem: ' + error.message);
    }
    setLoading(false);
  }, [measurements]);

  // Send chat message
  const handleChatSend = useCallback(async () => {
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage, history: chatHistory })
      });
      const data = await response.json();
      if (data.success) {
        setChatHistory([...newHistory, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setChatHistory([...newHistory, { role: 'assistant', content: 'Błąd: ' + error.message }]);
    }
    setLoading(false);
  }, [chatMessage, chatHistory]);

  const currentConfig = configurations?.configurations?.[selectedConfig];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Wymiarowanie Stentgraftów AAA</h1>
        <p className="subtitle">System Medtronic Endurant II/IIs</p>
      </header>

      <div className="main-container">
        {/* Left Panel - Visualization */}
        <div className="visualization-panel">
          <AortaVisualization
            measurements={measurements}
            configuration={currentConfig}
            highlightSegment={highlightSegment}
          />
        </div>

        {/* Right Panel - Controls & Results */}
        <div className="control-panel">
          {/* Tab Navigation */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'input' ? 'active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              Pomiary
            </button>
            <button
              className={`tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Wyniki
            </button>
            <button
              className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI
            </button>
            <button
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>

          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="tab-content input-tab">
              <h3>Pomiary Anatomiczne</h3>

              <div className="input-section">
                <h4>Szyja Aorty</h4>
                <div className="input-group">
                  <label
                    onMouseEnter={() => setHighlightSegment('neck')}
                    onMouseLeave={() => setHighlightSegment(null)}
                  >
                    Średnica szyi (mm):
                    <input
                      type="number"
                      value={measurements.neckDiameter}
                      onChange={(e) => handleMeasurementChange('neckDiameter', e.target.value)}
                      min="15" max="40"
                    />
                  </label>
                  <label>
                    Długość szyi (mm):
                    <input
                      type="number"
                      value={measurements.neckLength}
                      onChange={(e) => handleMeasurementChange('neckLength', e.target.value)}
                      min="0" max="100"
                    />
                  </label>
                  <label>
                    Kąt szyi (°):
                    <input
                      type="number"
                      value={measurements.neckAngle}
                      onChange={(e) => handleMeasurementChange('neckAngle', e.target.value)}
                      min="0" max="120"
                    />
                  </label>
                </div>
              </div>

              <div className="input-section">
                <h4>Tętnice Biodrowe</h4>
                <div className="input-group">
                  <label
                    onMouseEnter={() => setHighlightSegment('rightCIA')}
                    onMouseLeave={() => setHighlightSegment(null)}
                  >
                    Prawa CIA (mm):
                    <input
                      type="number"
                      value={measurements.rightCIA}
                      onChange={(e) => handleMeasurementChange('rightCIA', e.target.value)}
                      min="5" max="30"
                    />
                  </label>
                  <label
                    onMouseEnter={() => setHighlightSegment('leftCIA')}
                    onMouseLeave={() => setHighlightSegment(null)}
                  >
                    Lewa CIA (mm):
                    <input
                      type="number"
                      value={measurements.leftCIA}
                      onChange={(e) => handleMeasurementChange('leftCIA', e.target.value)}
                      min="5" max="30"
                    />
                  </label>
                </div>
              </div>

              <div className="input-section">
                <h4>Długości</h4>
                <div className="input-group">
                  <label>
                    Nerkowe → Rozwidlenie (mm):
                    <input
                      type="number"
                      value={measurements.renalToBifurcation}
                      onChange={(e) => handleMeasurementChange('renalToBifurcation', e.target.value)}
                      min="50" max="250"
                    />
                  </label>
                  <label>
                    Długość CIA (mm):
                    <input
                      type="number"
                      value={measurements.ciaLength}
                      onChange={(e) => handleMeasurementChange('ciaLength', e.target.value)}
                      min="20" max="150"
                    />
                  </label>
                </div>
              </div>

              <div className="input-section">
                <h4>Dostęp Naczyniowy</h4>
                <div className="input-group">
                  <label>
                    Dostęp prawy (mm):
                    <input
                      type="number"
                      value={measurements.accessRight}
                      onChange={(e) => handleMeasurementChange('accessRight', e.target.value)}
                      min="3" max="15"
                    />
                  </label>
                  <label>
                    Dostęp lewy (mm):
                    <input
                      type="number"
                      value={measurements.accessLeft}
                      onChange={(e) => handleMeasurementChange('accessLeft', e.target.value)}
                      min="3" max="15"
                    />
                  </label>
                </div>
                <div className="input-group">
                  <label>
                    Strona wprowadzenia:
                    <select
                      value={measurements.introSide}
                      onChange={(e) => handleMeasurementChange('introSide', e.target.value)}
                    >
                      <option value="right">Prawa</option>
                      <option value="left">Lewa</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn primary" onClick={handleLocalCalculation}>
                  Oblicz Konfiguracje
                </button>
                <button className="btn secondary" onClick={handleAIRecommendation} disabled={loading}>
                  {loading ? 'Ładowanie...' : 'Rekomendacja AI'}
                </button>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="tab-content results-tab">
              <h3>Wyniki Doboru</h3>

              {configurations?.validation && (
                <div className={`validation-box ${configurations.validation.valid ? 'valid' : 'invalid'}`}>
                  <h4>Walidacja IFU</h4>
                  {configurations.validation.issues.length > 0 && (
                    <ul className="issues">
                      {configurations.validation.issues.map((issue, i) => (
                        <li key={i} className="issue">{issue}</li>
                      ))}
                    </ul>
                  )}
                  {configurations.validation.warnings.length > 0 && (
                    <ul className="warnings">
                      {configurations.validation.warnings.map((warn, i) => (
                        <li key={i} className="warning">{warn}</li>
                      ))}
                    </ul>
                  )}
                  {configurations.validation.valid && configurations.validation.warnings.length === 0 && (
                    <p className="success">Anatomia w granicach IFU</p>
                  )}
                </div>
              )}

              {configurations?.configurations?.length > 0 ? (
                <>
                  <div className="config-selector">
                    <h4>Wybierz konfigurację:</h4>
                    <div className="config-buttons">
                      {configurations.configurations.map((config, index) => (
                        <button
                          key={index}
                          className={`config-btn ${selectedConfig === index ? 'selected' : ''}`}
                          onClick={() => setSelectedConfig(index)}
                        >
                          Opcja {index + 1}
                          <span className="score">Score: {config.totalScore?.toFixed(0)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentConfig && (
                    <div className="config-details">
                      <div className="component-card">
                        <h4>Main Body</h4>
                        <p className="code">{currentConfig.mainBody.code}</p>
                        <ul>
                          <li>Aortalna: {currentConfig.mainBody.aorticDiam}mm</li>
                          <li>Ipsilateralna: {currentConfig.mainBody.ipsiLegDiam}mm</li>
                          <li>Długość: {currentConfig.mainBody.length}mm</li>
                          <li>Przewymiarowanie: {currentConfig.mainBody.oversizing}%</li>
                        </ul>
                      </div>

                      <div className="component-card contra">
                        <h4>Odnoga Kontralateralna</h4>
                        <p className="code">{currentConfig.contralateralLimb.code}</p>
                        <ul>
                          <li>Proksymalna: {currentConfig.contralateralLimb.proximalDiam}mm</li>
                          <li>Dystalna: {currentConfig.contralateralLimb.distalDiam}mm</li>
                          <li>Długość: {currentConfig.contralateralLimb.length}mm</li>
                          <li>Przewymiarowanie: {currentConfig.contralateralLimb.distalOversizing}%</li>
                        </ul>
                      </div>

                      <div className="component-card ipsi">
                        <h4>Przedłużenie Ipsilateralne</h4>
                        <p className="code">{currentConfig.ipsilateralExtension.code}</p>
                        <ul>
                          <li>Typ: {currentConfig.ipsilateralExtension.type}</li>
                          <li>Dystalna: {currentConfig.ipsilateralExtension.distalDiam || currentConfig.ipsilateralExtension.diameter}mm</li>
                          <li>Długość: {currentConfig.ipsilateralExtension.length}mm</li>
                        </ul>
                      </div>

                      {currentConfig.comments?.length > 0 && (
                        <div className="comments">
                          <h4>Komentarze</h4>
                          <ul>
                            {currentConfig.comments.map((comment, i) => (
                              <li key={i}>{comment}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="no-results">Kliknij "Oblicz Konfiguracje" aby zobaczyć wyniki</p>
              )}
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="tab-content ai-tab">
              <h3>Rekomendacja AI (Claude)</h3>
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Analizuję anatomię...</p>
                </div>
              ) : aiResponse ? (
                <div className="ai-response">
                  <pre>{aiResponse}</pre>
                </div>
              ) : (
                <div className="ai-placeholder">
                  <p>Kliknij "Rekomendacja AI" w zakładce Pomiary</p>
                  <p className="hint">AI przeanalizuje Twoje pomiary i zaproponuje optymalne konfiguracje z uzasadnieniem klinicznym.</p>
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="tab-content chat-tab">
              <h3>Konsultacja z AI</h3>
              <div className="chat-messages">
                {chatHistory.length === 0 ? (
                  <p className="chat-placeholder">
                    Zadaj pytanie o wymiarowanie stentgraftów, IFU, lub techniki EVAR...
                  </p>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role}`}>
                      <strong>{msg.role === 'user' ? 'Ty' : 'AI'}:</strong>
                      <p>{msg.content}</p>
                    </div>
                  ))
                )}
                {loading && <div className="typing">AI pisze...</div>}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Zadaj pytanie..."
                  disabled={loading}
                />
                <button onClick={handleChatSend} disabled={loading || !chatMessage.trim()}>
                  Wyślij
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>Narzędzie pomocnicze - zawsze weryfikuj z aktualnym IFU producenta</p>
        <p className="disclaimer">Nie zastępuje oceny klinicznej specjalisty</p>
      </footer>
    </div>
  );
}

export default App;
