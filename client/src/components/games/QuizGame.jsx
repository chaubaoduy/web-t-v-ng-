import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { playSound, fireConfetti } from '../../utils';

function QuizGame({ data, setId, onExit, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg: '' }
    const [answered, setAnswered] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        generateQuestion();
    }, [currentIndex]);

    const generateQuestion = () => {
        const correctWord = data[currentIndex];
        const deck = [correctWord];

        // Pick 3 random distractors
        let attempts = 0;
        while (deck.length < 4 && attempts < 50) {
            const random = data[Math.floor(Math.random() * data.length)];
            if (!deck.find(w => w.word === random.word)) {
                deck.push(random);
            }
            attempts++;
        }

        // Shuffle
        setAnswers(deck.sort(() => Math.random() - 0.5));
        setFeedback(null);
        setAnswered(false);
    };

    const handleAnswer = (word) => {
        if (answered) return;
        setAnswered(true);

        const correctWord = data[currentIndex];
        if (word.word === correctWord.word) {
            setScore(score + 10);
            setFeedback({ type: 'success', msg: 'Chính xác! 🎉' });
            playSound('success');
        } else {
            setFeedback({ type: 'error', msg: 'Sai rồi! 😅' });
            playSound('error');
        }

        setTimeout(() => {
            if (currentIndex < data.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                finishGame();
            }
        }, 1200);
    };

    const finishGame = async () => {
        setFinished(true);
        fireConfetti();
        try {
            await api.saveResult({
                id: Date.now(),
                type: 'quiz',
                setName: 'Quiz Set',
                result: `${score} điểm`,
                timestamp: new Date().toLocaleString('vi-VN')
            });
        } catch (e) { console.error(e); }
    };

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-pop text-center">
                <i className="fa-solid fa-trophy text-6xl text-yellow-500 mb-4 h-20 w-20 flex items-center justify-center bg-yellow-100 rounded-full shadow-lg"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
                <div className="text-5xl font-black text-indigo-600 mb-4">{score} <span className="text-lg text-slate-400 font-medium">điểm</span></div>
                <button onClick={onComplete} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Quay về Dashboard
                </button>
            </div>
        );
    }

    const currentWord = data[currentIndex];

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col animate-pop">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="flex gap-4 font-mono text-sm font-bold">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg">Score: {score}</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">{currentIndex + 1}/{data.length}</span>
                </div>
            </div>

            {/* Question */}
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-slate-800 mb-2">{currentWord.word}</h2>
                <p className="text-slate-400">Chọn nghĩa đúng của từ này:</p>
            </div>

            {/* Answer Grid */}
            <div className="grid grid-cols-1 gap-4">
                {answers.map((ans, idx) => {
                    let btnClass = "bg-white border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600";
                    if (answered) {
                        if (ans.word === currentWord.word) {
                            btnClass = "bg-green-100 border-green-500 text-green-700 font-bold";
                        } else if (feedback?.type === 'error' && ans === currentWord) {
                            // Correct answer shown
                            btnClass = "bg-green-100 border-green-500 text-green-700";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={answered}
                            onClick={() => handleAnswer(ans)}
                            className={`p-6 rounded-2xl text-left font-medium transition-all shadow-sm active:scale-95 ${btnClass}`}
                        >
                            <span className="opacity-50 mr-4 font-mono">{String.fromCharCode(65 + idx)}.</span>
                            {ans.meaning}
                        </button>
                    );
                })}
            </div>

            <div className={`mt-8 text-center h-8 font-bold text-lg transition-opacity duration-300 ${feedback ? 'opacity-100' : 'opacity-0'} ${feedback?.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {feedback?.msg}
            </div>
        </div>
    );
}

export default QuizGame;
