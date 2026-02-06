import { useState, useEffect } from 'react';
import { api } from '../../services/api';

function SentenceGame({ data, setId, onExit, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [finished, setFinished] = useState(false);

    const currentWord = data[currentIndex];

    // Skip words without examples? For now handle gracefully
    useEffect(() => {
        if (!currentWord.example) {
            handleNext(); // Skip if no example
        } else {
            generateLevel();
        }
    }, [currentIndex]);

    const generateLevel = () => {
        const correct = currentWord.word;
        const deck = [correct];

        let attempts = 0;
        while (deck.length < 4 && attempts < 50) {
            const random = data[Math.floor(Math.random() * data.length)].word;
            if (!deck.includes(random)) deck.push(random);
            attempts++;
        }

        setOptions(deck.sort(() => Math.random() - 0.5));
        setFeedback(null);
        setAnswered(false);
    };

    const handleAnswer = (word) => {
        if (answered) return;
        setAnswered(true);

        const correct = currentWord.word;
        if (word === correct) {
            setFeedback({ type: 'success', msg: 'Chính xác!' });
        } else {
            setFeedback({ type: 'error', msg: `Sai rồi! Đáp án: ${correct}` });
        }

        setTimeout(() => {
            handleNext();
        }, 1500);
    };

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        setFinished(true);
        try {
            await api.saveResult({
                id: Date.now(),
                type: 'sentence',
                setName: 'Sentence Set',
                result: 'Hoàn thành',
                timestamp: new Date().toLocaleString('vi-VN')
            });
        } catch (e) { console.error(e); }
    };

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-pop text-center">
                <i className="fa-solid fa-pen-nib text-6xl text-blue-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
                <button onClick={onComplete} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Quay về
                </button>
            </div>
        );
    }

    if (!currentWord || !currentWord.example) return <div>Skipping invalid word...</div>;

    // Mask the word in example
    const parts = currentWord.example.split(new RegExp(`(${currentWord.word})`, 'gi'));

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col animate-pop">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="bg-slate-100 px-3 py-1 rounded-lg text-slate-500 font-bold text-sm">
                    {currentIndex + 1} / {data.length}
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center mb-8">
                <p className="text-lg text-slate-600 mb-2">Điền từ vào chỗ trống:</p>
                <h3 className="text-2xl font-medium text-slate-800 leading-relaxed">
                    {parts.map((part, i) => (
                        part.toLowerCase() === currentWord.word.toLowerCase() ? (
                            <span key={i} className="border-b-4 border-blue-400 text-blue-600 font-bold px-2 inline-block min-w-[80px]">______</span>
                        ) : (
                            <span key={i}>{part}</span>
                        )
                    ))}
                </h3>
                <p className="mt-4 text-slate-400 italic text-sm">({currentWord.meaning})</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {options.map((opt, idx) => {
                    let btnClass = "bg-white border text-slate-600 border-blue-200 hover:bg-blue-50";
                    if (answered) {
                        if (opt === currentWord.word) btnClass = "bg-green-100 border-green-500 text-green-700";
                        else if (feedback?.type === 'error' && opt !== currentWord.word) btnClass = "bg-red-50 border-red-200 text-red-400 opacity-50";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={answered}
                            onClick={() => handleAnswer(opt)}
                            className={`w-full py-4 px-6 rounded-xl font-bold shadow-sm transition-all ${btnClass}`}
                        >
                            {opt}
                        </button>
                    )
                })}
            </div>

            <div className={`mt-6 text-center font-bold text-lg transition-opacity ${feedback ? 'opacity-100' : 'opacity-0'} ${feedback?.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {feedback?.msg}
            </div>
        </div>
    );
}

export default SentenceGame;
