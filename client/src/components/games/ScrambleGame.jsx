import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { playSound, fireConfetti } from '../../utils';

function ScrambleGame({ data, setId, onExit, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambleInputs, setScrambleInputs] = useState([]); // Array of objects
    const [pool, setPool] = useState([]); // Array of objects
    const [finished, setFinished] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const currentWord = data[currentIndex];
    const cleanWord = currentWord.word.replace(/[^a-zA-Z]/g, '').toLowerCase();

    useEffect(() => {
        // Init Round
        const chars = cleanWord.split('').map((c, i) => ({ char: c, id: i }));
        // Shuffle pool
        setPool([...chars].sort(() => Math.random() - 0.5).map(c => ({ ...c, used: false })));
        setScrambleInputs(new Array(chars.length).fill(null));
        setFeedback(null);
    }, [currentIndex]);

    const handleSelectChar = (charObj) => {
        const emptyIdx = scrambleInputs.findIndex(x => x === null);
        if (emptyIdx !== -1) {
            const newInputs = [...scrambleInputs];
            newInputs[emptyIdx] = charObj;
            setScrambleInputs(newInputs);

            const newPool = pool.map(p => p.id === charObj.id ? { ...p, used: true } : p);
            setPool(newPool);

            checkWin(newInputs);
        }
    };

    const handleRemoveChar = (idx) => {
        const charObj = scrambleInputs[idx];
        if (charObj) {
            const newInputs = [...scrambleInputs];
            newInputs[idx] = null;
            setScrambleInputs(newInputs);

            const newPool = pool.map(p => p.id === charObj.id ? { ...p, used: false } : p);
            setPool(newPool);
        }
    };

    const checkWin = (inputs) => {
        if (inputs.some(x => x === null)) return;

        const formed = inputs.map(x => x.char).join('');
        if (formed === cleanWord) {
            setFeedback({ type: 'success', msg: 'Chính xác! 🎉' });
            playSound('success');
            setTimeout(() => {
                if (currentIndex < data.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    finishGame();
                }
            }, 1000);
        } else {
            setFeedback({ type: 'error', msg: 'Chưa đúng, thử lại nhé!' });
            playSound('error');
        }
    };

    const finishGame = async () => {
        setFinished(true);
        fireConfetti();
        try {
            await api.saveResult({
                id: Date.now(),
                type: 'scramble',
                setName: 'Scramble Set',
                result: 'Hoàn thành',
                timestamp: new Date().toLocaleString('vi-VN')
            });
        } catch (e) { console.error(e); }
    };

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-pop text-center">
                <i className="fa-solid fa-puzzle-piece text-6xl text-purple-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
                <button onClick={onComplete} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Quay về
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto h-full flex flex-col animate-pop">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="bg-slate-100 px-3 py-1 rounded-lg text-slate-500 font-bold text-sm">
                    {currentIndex + 1} / {data.length}
                </div>
            </div>

            <div className="text-center mb-8">
                <p className="text-slate-400 text-sm font-bold uppercase mb-2">{currentWord.type}</p>
                <h3 className="text-xl text-slate-700 italic">"{currentWord.meaning}"</h3>
            </div>

            {/* Slots */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {scrambleInputs.map((val, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleRemoveChar(idx)}
                        className={`w-12 h-14 border-b-4 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all ${val ? 'border-purple-500 text-purple-600' : 'border-slate-200 bg-slate-50'}`}
                    >
                        {val ? val.char.toUpperCase() : ''}
                    </div>
                ))}
            </div>

            {/* Pool */}
            <div className="flex justify-center gap-3 flex-wrap">
                {pool.map((item) => (
                    !item.used && (
                        <button
                            key={item.id}
                            onClick={() => handleSelectChar(item)}
                            className="w-12 h-12 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-slate-600 text-xl hover:bg-purple-50 hover:text-purple-600 hover:scale-110 transition-all"
                        >
                            {item.char.toUpperCase()}
                        </button>
                    )
                ))}
            </div>

            <div className={`mt-8 text-center font-bold text-lg transition-opacity ${feedback ? 'opacity-100' : 'opacity-0'} ${feedback?.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {feedback?.msg}
            </div>
        </div>
    );
}

export default ScrambleGame;
