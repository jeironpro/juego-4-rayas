import { useState } from 'react';
import HomeScreen from '@/features/menu/HomeScreen.jsx';
import GameScreen from '@/features/game/GameScreen.jsx';
import './App.css';

// Aplicación raíz: alterna entre la pantalla de inicio y la partida configurada
function App() {
  const [settings, setSettings] = useState(null);

  if (settings === null) {
    return <HomeScreen onStart={(mode, difficulty) => setSettings({ mode, difficulty })} />;
  }

  return (
    <GameScreen
      mode={settings.mode}
      difficulty={settings.difficulty}
      onMenu={() => setSettings(null)}
    />
  );
}

export default App;
