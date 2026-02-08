import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { getGameMeta } from '../../utils';

function Stats({ onNavigate }) {
    const [stats, setStats] = useState({
        totalWords: 0,
        totalSets: 0,
        totalGames: 0,
        history: []
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            const [sets, results] = await Promise.all([
                api.getSets(),
                api.getResults()
            ]);

            const totalWords = sets.reduce((sum, s) => sum + (s.wordCount || 0), 0);

            setStats({
                totalWords,
                totalSets: sets.length,
                totalGames: results.length,
                history: results.slice(0, 10) // Last 10
            });
        } catch (error) {
            console.error("Failed to load stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading stats...</div>;

    return (
        <div className="space-y-8 animate-pop">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                        <i className="fa-solid fa-book-open"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 font-medium">Tổng từ vựng</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.totalWords}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 font-medium">Bộ từ vựng</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.totalSets}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
                        <i className="fa-solid fa-gamepad"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 font-medium">Đã ôn tập</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.totalGames}</h3>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-lg">Hoạt động gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Trò chơi</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Bộ từ</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Kết quả</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">Chưa có dữ liệu nào.</td>
                                </tr>
                            ) : (
                                stats.history.map((row, idx) => {
                                    const meta = getGameMeta(row.type);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900">
                                                <i className={`fa-solid ${meta.icon} ${meta.color} mr-2`}></i> {meta.label}
                                            </td>
                                            <td className="p-4 text-slate-700 text-sm">{row.setName}</td>
                                            <td className="p-4 font-bold text-slate-900">{row.result}</td>
                                            <td className="p-4 text-slate-600 text-sm">{row.dateFormatted || row.timestamp}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stats;
