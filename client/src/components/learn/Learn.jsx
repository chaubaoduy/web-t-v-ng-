import { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';

function Learn({ onSaveSuccess }) {
    const [rows, setRows] = useState([createNewRow()]);
    const [saving, setSaving] = useState(false);

    // Refs for focus management
    const tableBodyRef = useRef(null);

    function createNewRow() {
        return { id: Date.now() + Math.random(), word: '', ipa: '', type: '', meaning: '', example: '' };
    }

    const handleChange = (id, field, value) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // If it's the last row, add new
            if (index === rows.length - 1) {
                addRow();
            }
            // Logic to focus next row could go here, but simple add is fine for now
        }
    };

    const addRow = () => {
        setRows([...rows, createNewRow()]);
        // Focus will be handled by Effect or auto-focus attribute logic if needed
    };

    const deleteRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const handleSave = async () => {
        // Filter empty rows
        const validWords = rows.filter(r => r.word.trim() !== '' && r.meaning.trim() !== '');

        if (validWords.length === 0) {
            alert("Vui lòng nhập ít nhất một từ vựng (Từ và Nghĩa là bắt buộc).");
            return;
        }

        setSaving(true);
        try {
            const newSet = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleString('vi-VN'),
                words: validWords
            };

            await api.createSet(newSet);

            // Reset
            setRows([createNewRow()]);
            alert("Đã lưu bộ từ vựng thành công!");
            if (onSaveSuccess) onSaveSuccess();

        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-pop">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700">Thêm từ vựng mới</h2>
                    <p className="text-slate-500">Nhập danh sách từ cần học bên dưới</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addRow}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> Thêm dòng
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:translate-y-[-2px] transition-all font-medium disabled:opacity-50"
                    >
                        {saving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-save mr-2"></i>}
                        Lưu bộ từ
                    </button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-12">#</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-48">Từ vựng *</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-32">IPA</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-32">Loại từ</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-64">Nghĩa *</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ví dụ</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase w-16"></th>
                            </tr>
                        </thead>
                        <tbody ref={tableBodyRef} className="divide-y divide-slate-100">
                            {rows.map((row, index) => (
                                <tr key={row.id} className="group hover:bg-white transition-colors">
                                    <td className="p-4 text-slate-300 font-mono text-sm align-middle">{index + 1}</td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all font-bold text-slate-700"
                                            placeholder="Hello"
                                            value={row.word}
                                            onChange={(e) => handleChange(row.id, 'word', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all text-slate-500 font-mono text-sm"
                                            placeholder="/həˈləʊ/"
                                            value={row.ipa}
                                            onChange={(e) => handleChange(row.id, 'ipa', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all text-sm text-slate-600"
                                            value={row.type}
                                            onChange={(e) => handleChange(row.id, 'type', e.target.value)}
                                        >
                                            <option value="">-- Loại --</option>
                                            <option value="noun">Danh từ</option>
                                            <option value="verb">Động từ</option>
                                            <option value="adjective">Tính từ</option>
                                            <option value="adverb">Trạng từ</option>
                                            <option value="preposition">Giới từ</option>
                                            <option value="phrase">Cụm từ</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all text-slate-700"
                                            placeholder="Xin chào"
                                            value={row.meaning}
                                            onChange={(e) => handleChange(row.id, 'meaning', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-400 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all text-slate-500 italic"
                                            placeholder="Hello world!"
                                            value={row.example}
                                            onChange={(e) => handleChange(row.id, 'example', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => deleteRow(row.id)}
                                            className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            tabIndex="-1"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State Hint if only 1 row */}
                {rows.length === 1 && !rows[0].word && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        <i className="fa-regular fa-lightbulb mb-2 text-yellow-400 text-xl block"></i>
                        Nhập từ vựng, IPA, và nghĩa. Nhấn <b>Enter</b> để xuống dòng nhanh.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Learn;
