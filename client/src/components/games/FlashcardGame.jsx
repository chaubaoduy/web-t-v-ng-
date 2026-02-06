import { useState } from 'react';
import { api } from '../../services/api'; // Ensure this matches actual location

function FlashcardGame({ data, setId, onExit, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [finished, setFinished] = useState(false);

    const word = data[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < data.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                finishGame();
            }
        }, 150); // slight delay for animation
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
            }, 150);
        }
    };

    const finishGame = async () => {
        setFinished(true);
        try {
            await api.saveResult({
                id: Date.now(),
                type: 'flashcard',
                setName: 'Flashcard Set', // Ideally pass real setName
                result: 'Hoàn thành',
                timestamp: new Date().toLocaleString('vi-VN')
            });
        } catch (e) { console.error(e); }
    };

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-pop text-center">
                <i className="fa-solid fa-circle-check text-6xl text-green-500 mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
                <p className="text-slate-500 mb-8">Bạn đã ôn tập xong bộ từ này.</p>
                <button onClick={onComplete} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Quay về
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col">
            {/* Header / Controls */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onExit} className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <div className="bg-white/50 px-4 py-1 rounded-full text-slate-500 font-mono text-sm border border-slate-200">
                    {currentIndex + 1} / {data.length}
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Card Area */}
            <div className="flex-1 perspective-1000 relative">
                <div
                    onClick={handleFlip}
                    className={`w-full h-[400px] relative transform-style-3d transition-transform duration-500 cursor-pointer shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-slate-100 shadow-sm">
                        <span className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">Phiên âm: /{word.ipa || '... '}/</span>
                        <h2 className="text-5xl font-bold text-slate-800 text-center text-gradient leading-tight">{word.word}</h2>
                        <p className="text-slate-400 mt-8 text-sm animate-pulse">Chạm để lật</p>
                    </div>

                    {/* BACK */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex flex-col items-center justify-center p-8 rotate-y-180 text-white shadow-inner">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <i className="fa-solid fa-tag text-xs"></i>
                            <span className="uppercase text-xs font-bold tracking-widest">{word.type || 'N/A'}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-center mb-6">{word.meaning}</h3>

                        {word.example && (
                            <div className="bg-white/20 p-4 rounded-xl text-center backdrop-blur-sm">
                                <p className="italic text-lg">"{word.example}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="mt-8 flex justify-center gap-6">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="w-14 h-14 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 flex items-center justify-center text-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>

                <button
                    onClick={handleFlip}
                    className="h-14 px-8 rounded-full bg-indigo-100 text-indigo-600 font-bold hover:bg-indigo-200 transition-colors"
                >
                    <i className="fa-solid fa-rotate mr-2"></i> Lật thẻ
                </button>

                <button
                    onClick={handleNext}
                    className="w-14 h-14 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center text-xl hover:bg-slate-700 hover:scale-110 transition-all"
                >
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
}

export default FlashcardGame;
