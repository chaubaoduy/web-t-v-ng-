import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GAME_TYPES } from '../../utils';

// Import Game Components (will be created next)
import FlashcardGame from './FlashcardGame';
import QuizGame from './QuizGame';
import MemoryGame from './MemoryGame';
import SentenceGame from './SentenceGame';
import ScrambleGame from './ScrambleGame';

function GamesDashboard({ initialGame, initialSetId }) {
    const [sets, setSets] = useState([]);
    const [view, setView] = useState('dashboard'); // dashboard, setup, playing
    const [selectedGameType, setSelectedGameType] = useState(null);
    const [activeSetId, setActiveSetId] = useState(null);
    const [activeSet, setActiveSet] = useState(null);

    useEffect(() => {
        api.getSets().then(data => {
            setSets(data);
            // Auto-launch if props provided
            if (initialGame && initialSetId) {
                const targetSet = data.find(s => s.id === initialSetId);
                if (targetSet) {
                    setSelectedGameType(initialGame);
                    setActiveSetId(initialSetId);
                    setActiveSet(targetSet);
                    setView('playing');
                }
            }
        }).catch(console.error);
    }, [initialGame, initialSetId]);

    const handleSelectGame = (type) => {
        if (sets.length === 0) {
            alert("Bạn chưa có bộ từ vựng nào! Hãy vào phần 'Học từ' để tạo trước nhé.");
            return;
        }
        setSelectedGameType(type);
        setView('setup');
    };

    const handleLaunchGame = (setId) => {
        const set = sets.find(s => s.id === setId);
        if (set) {
            setActiveSetId(setId);
            setActiveSet(set);
            setView('playing');
        }
    };

    const handleBack = () => {
        setView('dashboard');
        setSelectedGameType(null);
        setActiveSetId(null);
        setActiveSet(null);
    };

    const handleGameComplete = () => {
        // Could show a summary screen here, for now just back to dashboard
        setView('dashboard');
    };

    // --- PLAYING VIEW ---
    if (view === 'playing' && activeSet) {
        const commonProps = {
            data: activeSet.words,
            setId: activeSetId,
            onExit: handleBack,
            onComplete: handleGameComplete
        };

        switch (selectedGameType) {
            case 'flashcard': return <FlashcardGame {...commonProps} />;
            case 'quiz': return <QuizGame {...commonProps} />;
            case 'memory': return <MemoryGame {...commonProps} />;
            case 'sentence': return <SentenceGame {...commonProps} />;
            case 'scramble': return <ScrambleGame {...commonProps} />;
            default: return <div>Game not found</div>;
        }
    }

    // --- SETUP VIEW (Select Set) ---
    if (view === 'setup') {
        const meta = GAME_TYPES[selectedGameType];
        return (
            <div className="max-w-4xl mx-auto animate-pop">
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 dark:text-white dark:hover:text-indigo-200 dark:drop-shadow-sm transition-colors">
                        <i className="fa-solid fa-arrow-left text-xl"></i>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-white dark:drop-shadow-md">Chọn bộ từ để ôn tập</h2>
                        <p className={`text-sm font-bold ${meta.color} uppercase`}>{meta.label}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sets.map(set => (
                        <div
                            key={set.id}
                            onClick={() => handleLaunchGame(set.id)}
                            className="glass-card p-6 cursor-pointer hover:bg-white/80 group flex justify-between items-center transition-all"
                        >
                            <div>
                                <h4 className="font-bold text-slate-700 text-lg">Bộ từ {set.timestamp}</h4>
                                <p className="text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
                                    <i className="fa-solid fa-layer-group mr-1"></i> {set.wordCount} từ
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-all">
                                <i className="fa-solid fa-play"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- DASHBOARD VIEW ---
    return (
        <div className="animate-pop grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                onClick={() => handleSelectGame('flashcard')}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border-l-4 border-l-orange-500"
            >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-2xl mb-4">
                    <i className="fa-solid fa-layer-group"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Lật Thẻ (Flashcard)</h3>
                <p className="text-slate-500 text-sm mt-2">Ôn tập cơ bản với 2 mặt thẻ: Từ vựng và Nghĩa/Ví dụ.</p>
            </div>

            <div
                onClick={() => handleSelectGame('quiz')}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border-l-4 border-l-indigo-500"
            >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl mb-4">
                    <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Trắc Nghiệm (Quiz)</h3>
                <p className="text-slate-500 text-sm mt-2">Chọn đáp án đúng từ 4 lựa chọn cho trước.</p>
            </div>

            <div
                onClick={() => handleSelectGame('memory')}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border-l-4 border-l-emerald-500"
            >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-4">
                    <i className="fa-solid fa-table-cells"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Cặp Thẻ (Memory)</h3>
                <p className="text-slate-500 text-sm mt-2">Lật tìm các cặp Từ vựng - Nghĩa tương ứng.</p>
            </div>

            <div
                onClick={() => handleSelectGame('sentence')}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border-l-4 border-l-blue-500"
            >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-4">
                    <i className="fa-solid fa-pen-nib"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Điền Từ (Sentence)</h3>
                <p className="text-slate-500 text-sm mt-2">Điền từ còn thiếu vào câu ví dụ cho sẵn.</p>
            </div>

            <div
                onClick={() => handleSelectGame('scramble')}
                className="glass-card p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all border-l-4 border-l-purple-500"
            >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-4">
                    <i className="fa-solid fa-spell-check"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Sắp Xếp (Scramble)</h3>
                <p className="text-slate-500 text-sm mt-2">Sắp xếp các ký tự lộn xộn thành từ đúng.</p>
            </div>
        </div>
    );
}

export default GamesDashboard;
