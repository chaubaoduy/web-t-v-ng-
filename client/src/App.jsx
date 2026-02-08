import { useState, useEffect } from 'react';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/home/Home';
import Learn from './components/learn/Learn';
import Review from './components/review/Review';
import GamesDashboard from './components/games/GamesDashboard';
import Stats from './components/stats/Stats';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [refreshKey, setRefreshKey] = useState(0);
    const [gameLaunchParams, setGameLaunchParams] = useState(null);

    const handleNavigate = (tab) => {
        setActiveTab(tab);
        if (tab === 'review' || tab === 'stats') {
            setRefreshKey(prev => prev + 1);
        }
        if (tab !== 'games') {
            setGameLaunchParams(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation activeTab={activeTab} onNavigate={handleNavigate} />

            <main>
                {activeTab === 'home' && (
                    <Home onStart={() => handleNavigate('learn')} />
                )}

                {activeTab !== 'home' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {activeTab === 'learn' && (
                            <Learn
                                onSaveSuccess={() => {
                                    handleNavigate('review');
                                }}
                            />
                        )}

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
                )}
            </main>
        </div>
    );
}

export default App;
