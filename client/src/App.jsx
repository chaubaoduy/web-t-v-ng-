import { useState } from 'react';
import Learn from './components/learn/Learn';
import Review from './components/review/Review';
import GamesDashboard from './components/games/GamesDashboard';
import Stats from './components/stats/Stats';

function App() {
    const [activeTab, setActiveTab] = useState('learn');
    // Hacky way to force re-render/reload when saving sets
    const [refreshKey, setRefreshKey] = useState(0);
    const [gameLaunchParams, setGameLaunchParams] = useState(null);

    const handleNavigate = (tab) => {
        setActiveTab(tab);
        if (tab === 'review' || tab === 'stats') {
            setRefreshKey(prev => prev + 1);
        }
        // Clear params when navigating away from games (optional but safer)
        if (tab !== 'games') {
            setGameLaunchParams(null);
        }
    };

    return (
        <div className="flex flex-col h-screen backdrop-blur-md">
            {/* Header */}
            <header className="glass-header px-8 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <i className="fa-solid fa-layer-group text-lg"></i>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-slate-800 tracking-tight">Visual Vocab <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Master</span></h1>
                        <p className="text-xs text-slate-500 font-medium">Full Stack Edition</p>
                    </div>
                </div>

                <nav className="flex gap-4">
                    {['learn', 'review', 'games', 'stats'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleNavigate(tab)}
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                        >
                            {tab === 'learn' && 'Học từ'}
                            {tab === 'review' && 'Kho từ vựng'}
                            {tab === 'games' && 'Trò chơi'}
                            {tab === 'stats' && 'Kết quả'}
                        </button>
                    ))}
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto relative bg-slate-50/60 scroll-smooth">
                <div className="max-w-7xl mx-auto h-full">
                    {activeTab === 'learn' && <Learn onSaveSuccess={() => handleNavigate('review')} />}

                    {activeTab === 'review' && (
                        <Review
                            key={refreshKey}
                            onPlayGame={(type, setId) => {
                                setGameLaunchParams({ initialGame: type, initialSetId: setId });
                                handleNavigate('games');
                            }}
                        />
                    )}

                    {activeTab === 'games' && (
                        <GamesDashboard
                            initialGame={gameLaunchParams?.initialGame}
                            initialSetId={gameLaunchParams?.initialSetId}
                        />
                    )}

                    {activeTab === 'stats' && <Stats key={refreshKey} />}
                </div>
            </main>
        </div>
    )
}

export default App;
