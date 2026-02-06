import { useState, useEffect } from 'react';
import { api } from '../../services/api';

function MemoryGame({ data, setId, onExit, onComplete }) {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]); // [index1, index2]
    const [matched, setMatched] = useState([]); // [index1, index2, ...]
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        // Init Game
        let deck = [];
        data.forEach(w => {
            deck.push({ id: w.word, type: 'word', content: w.word });
            deck.push({ id: w.word, type: 'meaning', content: w.meaning });
        });
        // Shuffle
        deck = deck.sort(() => Math.random() - 0.5);
        setCards(deck);
    }, [data]);

    const handleCardClick = (index) => {
        if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const card1 = cards[newFlipped[0]];
            const card2 = cards[newFlipped[1]];

            if (card1.id === card2.id) {
                // Match
                setTimeout(() => {
                    const newMatched = [...matched, ...newFlipped];
                    setMatched(newMatched);
                    setFlipped([]);

                    if (newMatched.length === cards.length) {
                        finishGame();
                    }
                }, 500);
            } else {
                // No Match
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    const finishGame = async () => {
        setFinished(true);
        try {
            await api.saveResult({
                id: Date.now(),
                type: 'memory',
                setName: 'Memory Set',
                result: 'Hoàn thành',
                timestamp: new Date().toLocaleString('vi-VN')
            });
        } catch (e) { console.error(e); }
    };

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-pop text-center">
                <i className="fa-solid fa-gem text-6xl text-emerald-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Tuyệt vời!</h2>
                <p className="text-slate-500 mb-8">Bạn đã ghép đúng tất cả các cặp thẻ.</p>
                <button onClick={onComplete} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Quay về
                </button>
            </div>
        );
    }

    // Dynamic Grid Sizing
    const totalCards = cards.length;
    let cols = 4;
    if (totalCards <= 6) cols = 3;
    else if (totalCards <= 12) cols = 4;
    else if (totalCards <= 20) cols = 5;
    else cols = 6;

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col animate-pop">
            <div className="flex justify-between items-center mb-4">
                <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="text-sm font-bold text-slate-500">
                    Pairs: {matched.length / 2} / {totalCards / 2}
                </div>
            </div>

            <div
                className="grid gap-2 overflow-y-auto p-4 flex-1 content-center"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {cards.map((card, idx) => {
                    const isFlipped = flipped.includes(idx) || matched.includes(idx);
                    const isMatched = matched.includes(idx);

                    return (
                        <div
                            key={idx}
                            onClick={() => handleCardClick(idx)}
                            className={`aspect-square relative cursor-pointer perspective-1000 group ${isMatched ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className={`w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
                                {/* Front (Cover) */}
                                <div className="absolute inset-0 backface-hidden bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-400">
                                    <i className="fa-solid fa-leaf text-2xl"></i>
                                </div>
                                {/* Back (Content) */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-center p-2 text-center shadow-sm">
                                    <span className="text-xs sm:text-sm font-bold text-slate-700 break-words">{card.content}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MemoryGame;
