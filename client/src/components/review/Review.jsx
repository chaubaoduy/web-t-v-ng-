import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GAME_TYPES } from '../../utils';

function Review({ onPlayGame }) {
    const [sets, setSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadSets = async () => {
        try {
            const data = await api.getSets();
            setSets(data);
        } catch (error) {
            console.error("Failed to load sets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSets();
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc muốn xóa bộ từ vựng này không?")) {
            try {
                await api.deleteSet(id);
                setSets(sets.filter(s => s.id !== id));
            } catch (error) {
                alert("Lỗi xóa: " + error.message);
            }
        }
    };

    // --- DETAIL VIEW ---
    if (selectedSet) {
        return (
            <div className="max-w-5xl mx-auto animate-pop">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => setSelectedSet(null)}
                        className="text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors dark:text-white dark:hover:text-indigo-200 dark:drop-shadow-sm"
                    >
                        <i className="fa-solid fa-arrow-left"></i> Quay lại
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPlayGame('flashcard', selectedSet.id)}
                            className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 font-medium transition-colors"
                        >
                            <i className="fa-solid fa-layer-group mr-2"></i> Ôn tập
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Bộ từ vựng {selectedSet.timestamp.split(' ')[0]}</h2>
                            <p className="text-slate-500 mt-1"><i className="fa-regular fa-clock mr-1"></i> {selectedSet.timestamp.split(' ')[1]}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-bold text-indigo-600">{selectedSet.words.length}</span>
                            <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Từ vựng</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase w-48 pl-8">Từ vựng</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase w-32">IPA</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase w-32">Loại</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase w-64">Nghĩa</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase pr-8">Ví dụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedSet.words.map((word, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 font-bold text-slate-700">{word.word}</td>
                                        <td className="p-4 text-slate-500 font-mono text-sm">{word.ipa || '...'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium border border-slate-200">
                                                {word.type || '?'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-700">{word.meaning}</td>
                                        <td className="p-4 pr-8 text-slate-500 italic text-sm">{word.example}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pop">
            {loading ? (
                <div className="col-span-full text-center p-12 text-slate-400">Đang tải dữ liệu...</div>
            ) : sets.length === 0 ? (
                <div className="col-span-full text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300 text-2xl">
                        <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Chưa có bộ từ vựng nào</h3>
                    <p className="text-slate-500 mt-1">Hãy chuyển sang mục "Học từ" để tạo bộ mới nhé!</p>
                </div>
            ) : (
                sets.map(set => (
                    <div
                        key={set.id}
                        onClick={() => setSelectedSet(set)}
                        className="glass-card hover:bg-white/90 group cursor-pointer relative overflow-hidden flex flex-col h-[200px]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={(e) => handleDelete(set.id, e)}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                title="Xóa bộ từ"
                            >
                                <i className="fa-solid fa-trash text-sm"></i>
                            </button>
                        </div>

                        <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                                    <i className="fa-solid fa-book text-sm"></i>
                                </div>
                                <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md font-bold border border-indigo-100">
                                    {set.wordCount} từ
                                </span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-1">Bộ từ vựng</h3>
                            <p className="text-slate-500 text-sm font-medium">{set.timestamp}</p>
                        </div>

                        <div className="bg-slate-50/80 p-3 border-t border-slate-100 flex gap-2 backdrop-blur-sm">
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlayGame('flashcard', set.id); }}
                                className="flex-1 py-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-layer-group"></i> Lật thẻ
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlayGame('quiz', set.id); }}
                                className="flex-1 py-1.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-circle-question"></i> Quiz
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Review;
