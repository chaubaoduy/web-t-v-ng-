export const GAME_TYPES = {
    quiz: { label: 'Trắc nghiệm', icon: 'fa-circle-question', color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-500' },
    memory: { label: 'Ghép thẻ', icon: 'fa-table-cells', color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-500' },
    sentence: { label: 'Điền từ', icon: 'fa-pen-nib', color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-500' },
    scramble: { label: 'Sắp xếp từ', icon: 'fa-spell-check', color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-500' },
    flashcard: { label: 'Lật thẻ', icon: 'fa-layer-group', color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-500' }
};

export const getGameMeta = (type) => {
    return GAME_TYPES[type] || { label: type, icon: 'fa-gamepad', color: 'text-slate-500' };
};
