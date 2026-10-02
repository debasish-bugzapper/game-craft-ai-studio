import React, { useState, useEffect } from 'react';
import { getDeviceLayoutConfig, getUserDevicePreference, saveUserDevicePreference, DeviceMode } from './lib/deviceSelector';
import { startVoiceRecognition } from './lib/voiceController';
import { createMultiplayerSession } from './lib/multiplayerSync';
import { saveProjectToCloud } from './lib/cloudSync';
import { analyzeAndFixGameBug } from './lib/aiDebugger';
import { generateGameNPC } from './lib/npcGenerator';
import { checkForAppUpdates } from './lib/forceUpdate';

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');
  const [gameTitle, setGameTitle] = useState('My Awesome 3D Game');
  const [promptText, setPromptText] = useState('');
  const [activeTab, setActiveTab] = useState<'studio' | 'multiplayer' | 'npcs' | 'debug'>('studio');
  const [logs, setLogs] = useState<string[]>(['System initialized successfully. Ready to build!']);
  const [npcs, setNpcs] = useState<any[]>([]);

  useEffect(() => {
    // Check user preference and auto-updates on mount
    const savedMode = getUserDevicePreference();
    setDeviceMode(savedMode);
    checkForAppUpdates('2.0.0');
  }, []);

  const layout = getDeviceLayoutConfig(deviceMode);

  const handleVoiceInput = () => {
    startVoiceRecognition((result) => {
      setPromptText(result.transcript);
      addLog(`Voice detected: "${result.transcript}"`);
    });
  };

  const handleCreateGame = () => {
    addLog(`Generating game from prompt: "${promptText || gameTitle}"...`);
    // Run AI debugger check simulation
    const debugRes = analyzeAndFixGameBug('', promptText);
    if (debugRes.hasError) {
      addLog(`AI Debugger: ${debugRes.fixDescription}`);
    } else {
      addLog('Game compiled successfully with High Graphics & Physics!');
    }
  };

  const handleMultiplayerShare = () => {
    const session = createMultiplayerSession(gameTitle, 'Creator');
    addLog(`Multiplayer room created! Share link: ${session.shareableLink}`);
    alert(`Multiplayer Link Generated:\n${session.shareableLink}`);
  };

  const handleCloudBackup = async () => {
    const success = await saveProjectToCloud('user_101', gameTitle, { promptText, npcs });
    if (success) {
      addLog('Project safely synced and backed up to Cloud storage!');
      alert('Cloud Backup Successful!');
    }
  };

  const handleAddNpc = (role: 'enemy' | 'merchant' | 'quest-giver' | 'companion') => {
    const newNpc = generateGameNPC(role, 'cyberpunk');
    setNpcs([...npcs, newNpc]);
    addLog(`Added new NPC: ${newNpc.name} (${newNpc.role})`);
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 15)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
            🎮
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI Game Studio Pro
            </h1>
            <p className="text-xs text-slate-400">Ultra-Realistic Web Gaming Engine</p>
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <span className="text-xs px-2 text-slate-400">View:</span>
          <button
            onClick={() => { setDeviceMode('desktop'); saveUserDevicePreference('desktop'); }}
            className={`px-3 py-1 rounded text-xs font-medium transition ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            💻 PC/Laptop
          </button>
          <button
            onClick={() => { setDeviceMode('mobile'); saveUserDevicePreference('mobile'); }}
            className={`px-3 py-1 rounded text-xs font-medium transition ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            📱 Mobile
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-6 flex justify-center items-center">
        <div 
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
          style={{ width: layout.canvasWidth, height: layout.canvasHeight, maxWidth: '100%' }}
        >
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950 px-4 py-2 space-x-2">
            <button onClick={() => setActiveTab('studio')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'studio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>🛠️ Studio</button>
            <button onClick={() => setActiveTab('multiplayer')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'multiplayer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>🌐 Multiplayer</button>
            <button onClick={() => setActiveTab('npcs')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'npcs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>👾 NPCs</button>
            <button onClick={() => setActiveTab('debug')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'debug' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>⚡ AI Logs</button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'studio' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Game Title</label>
                  <input
                    type="text"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-300">Describe Your Game Idea (AI Prompt)</label>
                    <button
                      onClick={handleVoiceInput}
                      className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-red-500/30 transition"
                    >
                      <span>🎙️ Speak Prompt</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="E.g., Create a high-graphics open-world cyber racing game with zombie enemies..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCreateGame}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:opacity-95 transition"
                  >
                    🚀 Generate High-Graphics Game
                  </button>
                  <button
                    onClick={handleCloudBackup}
                    className="bg-slate-800 border border-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl hover:bg-slate-700 transition"
                  >
                    ☁️ Cloud Backup
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'multiplayer' && (
              <div className="text-center py-12 space-y-6">
                <div className="text-5xl">🌐</div>
                <h3 className="text-xl font-bold">Real-Time Multiplayer Server</h3>
                <p className="text-slate-400 max-w-md mx-auto text-sm">
                  Generate a live shareable room link instantly so friends can join your game session from anywhere in the world!
                </p>
                <button
                  onClick={handleMultiplayerShare}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition"
                >
                  🔗 Create & Copy Live Room Link
                </button>
              </div>
            )}

            {activeTab === 'npcs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Smart NPC & AI Characters</h3>
                  <div className="space-x-2">
                    <button onClick={() => handleAddNpc('enemy')} className="bg-red-600 hover:bg-red-500 text-xs px-3 py-2 rounded-lg font-semibold">+ Add Enemy</button>
                    <button onClick={() => handleAddNpc('merchant')} className="bg-amber-600 hover:bg-amber-500 text-xs px-3 py-2 rounded-lg font-semibold">+ Add Merchant</button>
                    <button onClick={() => handleAddNpc('quest-giver')} className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-2 rounded-lg font-semibold">+ Add Quest NPC</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {npcs.length === 0 ? (
                    <p className="text-slate-500 text-sm italic col-span-2 text-center py-8">No NPCs added yet. Click above to spawn characters into your game.</p>
                  ) : (
                    npcs.map((npc, idx) => (
                      <div key={idx} className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between font-bold">
                          <span>{npc.name}</span>
                          <span className="text-xs uppercase bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">{npc.role}</span>
                        </div>
                        <p className="text-xs text-slate-400">Behavior: {npc.behavior}</p>
                        <p className="text-xs italic text-slate-300">"{npc.dialogueLines[0]}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'debug' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">AI Auto-Debugger & System Console</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-2 text-emerald-400">
                  {logs.map((log, index) => (
                    <div key={index}>> {log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
