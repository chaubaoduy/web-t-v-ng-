/**
 * VISUAL VOCAB MASTER - MAIN SCRIPT
 * Consolidated for file:// protocol compatibility (No Modules)
 */

// --- 1. STORE SERVICE ---
const Store = {
    KEYS: {
        VOCAB: 'visual_vocab_sets',
        GAMES: 'visual_vocab_games'
    },

    getSets() {
        const data = localStorage.getItem(this.KEYS.VOCAB);
        return data ? JSON.parse(data) : [];
    },

    saveSet(newSet) {
        const sets = this.getSets();
        sets.unshift(newSet); // Add to top
        localStorage.setItem(this.KEYS.VOCAB, JSON.stringify(sets));
        return true;
    },

    updateSet(updatedSet) {
        const sets = this.getSets();
        const index = sets.findIndex(s => s.id === updatedSet.id);
        if (index !== -1) {
            sets[index] = updatedSet;
            localStorage.setItem(this.KEYS.VOCAB, JSON.stringify(sets));
            return true;
        }
        return false;
    },

    deleteSet(id) {
        const sets = this.getSets().filter(s => s.id !== id);
        localStorage.setItem(this.KEYS.VOCAB, JSON.stringify(sets));
    },

    getResults() {
        const data = localStorage.getItem(this.KEYS.GAMES);
        return data ? JSON.parse(data) : [];
    },

    saveResult(result) {
        const results = this.getResults();
        results.unshift(result);
        localStorage.setItem(this.KEYS.GAMES, JSON.stringify(results));
    }
};

// --- 2. INTELLIGENT VOCAB SERVICE ---
// Expanded Dictionary with Manual High-Quality Examples & Phrase Support
// AI Logic Removed - Manual Input Only

function generateFallbackExample(word, type) {
    if (type.includes('noun')) return `The ${word} is very important.`;
    if (type.includes('verb')) return `I like to ${word} every day.`;
    if (type.includes('adj')) return `This looks very ${word}.`;
    return `This is a sentence about ${word}.`;
}

function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function translateType(type) {
    const map = {
        'noun': 'Danh từ',
        'verb': 'Động từ',
        'adjective': 'Tính từ',
        'adverb': 'Trạng từ',
        'preposition': 'Giới từ',
        'pronoun': 'Đại từ',
        'interjection': 'Thán từ',
        'conjunction': 'Liên từ'
    };
    return map[type] || type;
}

// --- 3. APP CONTROLLER ---
class App {
    constructor() {
        this.init();
    }

    init() {
        this.addRow();
        this.renderSets();
        this.setupNavigation();
        this.loadAvatar();
    }

    // --- AVATAR LOGIC ---
    loadAvatar() {
        const stored = localStorage.getItem('user_avatar');
        const img = document.getElementById('current-avatar');
        if (stored && img) {
            img.src = stored;
        }
    }

    openAvatarModal() {
        document.getElementById('avatar-modal').classList.remove('hidden');
    }

    closeAvatarModal() {
        document.getElementById('avatar-modal').classList.add('hidden');
    }

    selectAvatar(seed) {
        let url;
        if (seed === 'monkey-fluent') {
            url = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Monkey%20Face.png';
        } else {
            url = `https://img.icons8.com/fluency/96/${seed}.png`;
        }
        this.saveAndApplyAvatar(url);
    }

    handleAvatarUpload(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.saveAndApplyAvatar(e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    saveAndApplyAvatar(url) {
        localStorage.setItem('user_avatar', url);
        const img = document.getElementById('current-avatar');
        if (img) img.src = url;
        this.closeAvatarModal();
        this.showToast('Đã cập nhật hình đại diện!', 'success');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                const maps = ['learn', 'review', 'games', 'stats'];
                this.navigate(maps[index]);
            });
        });

        // Global Input Listener for "Filled" state
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('vocab-input')) {
                e.target.classList.toggle('filled', e.target.value.trim() !== '');
            }
        });

        // Global Keydown Listener for Enter Key (Add New Row)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('vocab-input')) {
                e.preventDefault();
                this.addRow(null, true); // true = focus new row
            }
        });

        // Auto-focus first input on load
        setTimeout(() => {
            const firstRowInput = document.querySelector('#input-rows tr:first-child .vocab-input');
            if (firstRowInput) {
                firstRowInput.focus();
                // Ensure the highlight style is applied by triggering a focus event if needed (browsers usually handle this)
            }
        }, 500);
    }

    navigate(viewId) {
        // Update Sidebar UI
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        const map = { 'learn': 0, 'review': 1, 'games': 2, 'stats': 3 };
        const idx = map[viewId];
        if (document.querySelectorAll('.nav-item')[idx]) {
            document.querySelectorAll('.nav-item')[idx].classList.add('active');
        }

        // Scroll to Section
        const targetSection = document.getElementById(`view-${viewId}`);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (viewId === 'review') {
            this.renderSets();
        } else if (viewId === 'stats') {
            this.renderStats();
        }
    }

    // --- INPUT TABLE LOGIC ---
    addRow(data = null) {
        const tbody = document.getElementById('input-rows');
        if (!tbody) return;

        const idx = tbody.children.length;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><input type="text" class="vocab-input font-medium text-slate-700" placeholder="" onblur="app.handleWordInput(this, ${idx})"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="" id="ipa-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="" id="type-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="" id="meaning-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500 italic" placeholder="" id="example-${idx}"></td>
            <td class="text-center">
                <button class="text-slate-300 hover:text-red-500" onclick="this.closest('tr').remove()"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);

        // Add auto-resize listeners to all new inputs
        const inputs = tr.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.autoResize(input));
            input.addEventListener('keydown', (e) => this.handleInputKeydown(e, idx));
        });
    }

    handleInputKeydown(e, currentRowIdx) {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Check if we need to add a new row (if this is the last row)
            const tbody = document.getElementById('input-rows');
            if (currentRowIdx === tbody.children.length - 1) {
                this.addRow();
            }

            // Focus on the first input of the next row
            // Small timeout to allow DOM update
            setTimeout(() => {
                // Find all first inputs in the table rows
                const rows = tbody.querySelectorAll('tr');
                if (rows[currentRowIdx + 1]) {
                    const firstInput = rows[currentRowIdx + 1].querySelector('input');
                    if (firstInput) firstInput.focus();
                }
            }, 10);
        }
    }

    autoResize(input) {
        const defaultSize = 14;
        const minSize = 10;

        input.style.fontSize = `${defaultSize}px`;

        let currentSize = defaultSize;
        while (input.scrollWidth > input.clientWidth && currentSize > minSize) {
            currentSize--;
            input.style.fontSize = `${currentSize}px`;
        }
    }

    // Manual input only - No auto-fill
    handleWordInput(input, idx) {
        // This function is called on blur, but we don't auto-fill anymore
        // Users manually enter all vocabulary data
        const word = input.value.trim();
        if (!word) return;

        // Just resize the input if needed
        this.autoResize(input);
    }

    saveSession() {
        const rows = document.querySelectorAll('#input-rows tr');
        const words = [];

        rows.forEach((tr, idx) => {
            const wordInput = tr.querySelector('input:first-child');
            if (wordInput && wordInput.value.trim()) {
                words.push({
                    word: wordInput.value.trim(),
                    ipa: document.getElementById(`ipa-${idx}`).value,
                    type: document.getElementById(`type-${idx}`).value,
                    meaning: document.getElementById(`meaning-${idx}`).value,
                    example: document.getElementById(`example-${idx}`).value
                });
            }
        });

        if (words.length === 0) {
            this.showToast('Chưa có từ vựng nào để lưu!', 'error');
            return;
        }

        // Prompt for set name
        let setName = prompt("Đặt tên cho bộ từ vựng này:", `Bộ từ vựng ${new Date().toLocaleDateString('vi-VN')}`);
        if (setName === null) return;
        if (!setName.trim()) {
            setName = `Bộ từ vựng ${new Date().toLocaleDateString('vi-VN')}`;
        }

        const newSet = {
            id: `set_${Date.now()}`,
            name: setName,
            timestamp: new Date().toLocaleString('vi-VN'),
            wordCount: words.length,
            words: words
        };

        Store.saveSet(newSet);
        this.showToast('Đã lưu thành công! Bạn có thể xem trong "Kho lưu trữ".', 'success');

        // Clear inputs
        document.getElementById('input-rows').innerHTML = '';
        this.addRow();
        this.navigate('review');
    }

    // --- REVIEW LOGIC ---
    renderSets() {
        const sets = Store.getSets();
        const grid = document.getElementById('sets-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (sets.length === 0) {
            grid.innerHTML = `<p class="col-span-3 text-center text-slate-400 py-10">Chưa có dữ liệu.</p>`;
            return;
        }

        sets.forEach(set => {
            const card = document.createElement('div');
            card.className = 'glass-card p-5 group relative';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 font-bold text-lg">
                        ${set.wordCount}
                    </div>
                    <div class="flex gap-2">
                         <button class="text-slate-300 hover:text-sky-500 transition-colors" title="Đổi tên" onclick="app.renameSet('${set.id}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="text-slate-300 hover:text-red-500 transition-colors" title="Xóa" onclick="app.deleteSet('${set.id}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <h3 class="font-bold text-slate-800 text-lg mb-1">${set.name || set.timestamp.split(' ')[0]}</h3>
                <p class="text-slate-400 text-sm mb-4">${set.timestamp}</p>
                <button class="w-full py-2 rounded-lg bg-slate-50 text-slate-600 font-medium border border-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors" onclick="app.viewSet('${set.id}')">Xem chi tiết</button>
            `;
            grid.appendChild(card);
        });
    }

    renameSet(id) {
        const sets = Store.getSets();
        const set = sets.find(s => s.id === id);
        if (!set) return;

        const currentName = set.name || set.timestamp.split(' ')[0];
        const newName = prompt("Nhập tên mới cho bộ từ vựng:", currentName);

        if (newName !== null && newName.trim() !== "") {
            set.name = newName.trim();
            Store.updateSet(set);
            this.renderSets();
        }
    }

    viewSet(id) {
        const sets = Store.getSets();
        const set = sets.find(s => s.id === id);
        if (!set) return;

        // Switch view manually
        document.querySelectorAll('section').forEach(el => el.classList.remove('active'));
        document.getElementById('view-set-detail').classList.add('active');

        // Populate Data
        document.getElementById('detail-title').textContent = `Bộ từ vựng ${set.timestamp.split(' ')[0]}`;
        document.getElementById('detail-time').textContent = set.timestamp.split(' ')[1];

        const tbody = document.getElementById('detail-rows');
        tbody.innerHTML = '';

        set.words.forEach(word => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="font-bold text-slate-700">${word.word}</td>
                <td class="text-slate-500 font-mono text-sm">${word.ipa || '...'}</td>
                <td class="text-slate-600"><span class="px-2 py-1 bg-slate-100 rounded text-xs">${word.type || '?'}</span></td>
                <td class="text-slate-700">${word.meaning || ''}</td>
                <td class="text-slate-500 italic text-sm">${word.example || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    deleteSet(id) {
        if (confirm('Xóa bộ từ vựng này?')) {
            Store.deleteSet(id);
            this.renderSets();
        }
    }

    // --- STATS LOGIC ---
    renderStats() {
        try {
            const sets = Store.getSets() || [];
            const results = Store.getResults() || [];

            // 1. Summary Cards
            const totalWords = (sets || []).reduce((sum, set) => sum + (set.wordCount || 0), 0);
            document.getElementById('stat-total-words').textContent = totalWords;
            document.getElementById('stat-total-sets').textContent = sets.length;
            document.getElementById('stat-total-games').textContent = results.length;

            // 2. History Table
            const tbody = document.getElementById('stat-history-rows');
            tbody.innerHTML = '';

            if (results.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-slate-400">Chưa có dữ liệu.</td></tr>`;
                return;
            }

            // Show last 10 results
            results.slice(0, 10).forEach(res => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-slate-200 hover:bg-white/30 transition-colors';

                // Format Game Name
                let gameName = res.type;
                let icon = 'fa-gamepad';
                let color = 'text-slate-500';

                if (res.type === 'quiz') { gameName = 'Trắc nghiệm'; icon = 'fa-circle-question'; color = 'text-indigo-500'; }
                if (res.type === 'memory') { gameName = 'Ghép thẻ'; icon = 'fa-table-cells'; color = 'text-emerald-500'; }
                if (res.type === 'sentence') { gameName = 'Điền từ'; icon = 'fa-pen-nib'; color = 'text-blue-500'; }
                if (res.type === 'scramble') { gameName = 'Sắp xếp từ'; icon = 'fa-spell-check'; color = 'text-purple-500'; }

                tr.innerHTML = `
        <td class="p-4 font-medium text-slate-700">
            <i class="fa-solid ${icon} ${color} mr-2"></i> ${gameName}
        </td>
        <td class="p-4 text-slate-500 text-sm">${res.setName}</td>
        <td class="p-4 font-bold text-slate-700">${res.result}</td>
        <td class="p-4 text-slate-400 text-sm">${res.timestamp}</td>
    `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error(e);
            alert('Lỗi hiển thị thống kê: ' + e.message);
        }
    }

    saveGameResult(type, setId, resultText) {
        const sets = Store.getSets();
        const set = sets.find(s => s.id === setId);
        const setName = set ? (set.name || set.timestamp) : 'Unknown Set';

        const result = {
            id: Date.now(),
            type: type,
            setName: setName,
            result: resultText,
            timestamp: new Date().toLocaleString('vi-VN')
        };
        Store.saveResult(result);
    }

    // --- GAME LOGIC ---
    showGameDashboard() {
        document.getElementById('game-dashboard').classList.remove('hidden');
        document.getElementById('game-setup').classList.add('hidden');
        document.getElementById('game-flashcard').classList.add('hidden');
        document.getElementById('game-quiz').classList.add('hidden');
        document.getElementById('game-memory').classList.add('hidden');
        document.getElementById('game-sentence').classList.add('hidden');
        document.getElementById('game-scramble').classList.add('hidden');
        // Restore main scrollbar
        document.querySelector('main').style.overflow = 'auto';
    }

    prepareGame(gameType) {
        // 1. Show Set Selection
        const sets = Store.getSets();
        if (sets.length === 0) {
            this.showToast('Bạn chưa có bộ từ vựng nào! Hãy vào phần "Học từ" để tạo trước nhé.', 'info');
            return;
        }

        document.getElementById('game-dashboard').classList.add('hidden');
        document.getElementById('game-setup').classList.remove('hidden');

        const list = document.getElementById('game-set-list');
        list.innerHTML = '';

        sets.forEach(set => {
            const btn = document.createElement('div');
            btn.className = 'glass-card p-4 cursor-pointer transition-all flex justify-between items-center group';
            btn.onclick = () => this.launchGame(gameType, set.id);
            btn.innerHTML = `
        <div>
            <h4 class="font-bold text-slate-700">${set.timestamp}</h4>
            <p class="text-sm text-slate-400">${set.wordCount} từ</p>
        </div>
        <i class="fa-solid fa-play text-slate-300 group-hover:text-sky-500 text-xl"></i>
    `;
            list.appendChild(btn);
        });
    }

    launchGame(gameType, setId) {
        const sets = Store.getSets();
        const set = sets.find(s => s.id === setId);
        if (!set) return;

        this.gameState = {
            type: gameType,
            setId: setId, // Store ID for results
            words: set.words,
            currentIndex: 0,
            score: 0,
            // Game specific state
            flippedCards: [],
            matchedPairs: 0
        };

        document.getElementById('game-setup').classList.add('hidden');

        if (gameType === 'flashcard') {
            document.getElementById('game-flashcard').classList.remove('hidden');
            this.renderFlashcard();
        } else if (gameType === 'quiz') {
            document.getElementById('game-quiz').classList.remove('hidden');
            this.renderQuiz();
        } else if (gameType === 'memory') {
            document.getElementById('game-memory').classList.remove('hidden');
            // Hide main scrollbar for memory game
            document.querySelector('main').style.overflow = 'hidden';
            this.renderMemoryGame();
        } else if (gameType === 'sentence') {
            document.getElementById('game-sentence').classList.remove('hidden');
            this.renderSentenceGame();
        } else if (gameType === 'scramble') {
            document.getElementById('game-scramble').classList.remove('hidden');
            this.renderScrambleGame();
        }
    }

    // FLASHCARD SPECIFIC
    renderFlashcard() {
        const state = this.gameState;
        const word = state.words[state.currentIndex];

        // Reset Flip
        const card = document.getElementById('flashcard');
        card.classList.remove('rotate-y-180');
        state.isFlipped = false;

        // Update UI Text
        setTimeout(() => { // Update text after flip reset starts to avoid spoiler (if going back)
            document.getElementById('fc-current').textContent = state.currentIndex + 1;
            document.getElementById('fc-total').textContent = state.words.length;

            document.getElementById('fc-front-word').textContent = word.word;

            document.getElementById('fc-back-word').textContent = word.word;
            document.getElementById('fc-back-ipa').textContent = word.ipa;
            document.getElementById('fc-back-type').textContent = word.type || '';
            document.getElementById('fc-back-mean').textContent = word.meaning;
            document.getElementById('fc-back-ex').textContent = word.example || '';
        }, 150);
    }

    flipCard() {
        const card = document.getElementById('flashcard');
        this.gameState.isFlipped = !this.gameState.isFlipped;

        if (this.gameState.isFlipped) {
            card.classList.add('rotate-y-180');
        } else {
            card.classList.remove('rotate-y-180');
        }
    }

    nextCard() {
        if (this.gameState.currentIndex < this.gameState.words.length - 1) {
            this.gameState.currentIndex++;
            this.renderFlashcard();
        } else {
            this.showToast('Đã hết bộ từ!', 'info');
            this.showGameDashboard();
        }
    }

    prevCard() {
        if (this.gameState.currentIndex > 0) {
            this.gameState.currentIndex--;
            this.renderFlashcard();
        }
    }

    // QUIZ SPECIFIC
    renderQuiz() {
        const state = this.gameState;
        const word = state.words[state.currentIndex];

        // Reset Feedback
        const fb = document.getElementById('quiz-feedback');
        fb.classList.add('opacity-0');
        fb.textContent = '';

        document.getElementById('quiz-score').textContent = state.score;
        document.getElementById('quiz-current').textContent = state.currentIndex + 1;
        document.getElementById('quiz-total').textContent = state.words.length;
        document.getElementById('quiz-question').textContent = word.word;

        // Generate Answers
        const answers = [word];
        const allWords = state.words;

        // Pick 3 unique distractors
        let attempts = 0;
        while (answers.length < 4 && attempts < 50) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!answers.find(w => w.word === randomWord.word)) {
                answers.push(randomWord);
            }
            attempts++;
        }

        // Shuffle
        answers.sort(() => Math.random() - 0.5);

        const grid = document.getElementById('quiz-answers');
        grid.innerHTML = '';

        answers.forEach(ans => {
            const btn = document.createElement('button');
            btn.className = 'bg-white border-2 border-indigo-100 py-4 px-6 rounded-2xl text-slate-600 font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left shadow-sm active:scale-95';
            btn.textContent = ans.meaning;
            btn.onclick = () => this.handleQuizAnswer(btn, ans.word === word.word);
            grid.appendChild(btn);
        });
    }

    handleQuizAnswer(btn, isCorrect) {
        // Disable all buttons
        const grid = document.getElementById('quiz-answers');
        Array.from(grid.children).forEach(b => b.disabled = true);

        const fb = document.getElementById('quiz-feedback');
        fb.classList.remove('opacity-0');

        if (isCorrect) {
            this.gameState.score += 10;
            btn.classList.remove('border-indigo-100', 'bg-white');
            btn.classList.add('border-green-500', 'bg-green-100', 'text-green-700');
            fb.textContent = '🎉 Chính xác!';
            fb.className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 text-green-500 animate-pop';
        } else {
            btn.classList.remove('border-indigo-100', 'bg-white');
            btn.classList.add('border-red-500', 'bg-red-100', 'text-red-700');
            fb.textContent = '😅 Sai rồi!';
            fb.className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 text-red-500 animate-shake';
        }

        document.getElementById('quiz-score').textContent = this.gameState.score;

        // Next Question
        setTimeout(() => {
            if (this.gameState.currentIndex < this.gameState.words.length - 1) {
                this.gameState.currentIndex++;
                this.renderQuiz();
            } else {
                this.showToast(`Kết thúc! Bạn đạt ${this.gameState.score} điểm.`, 'success');
                this.fireConfetti();
                this.saveGameResult('quiz', this.gameState.setId, `${this.gameState.score} điểm`);
                this.showGameDashboard();
            }
        }, 1500);
    }

    // --- MEMORY MATCH GAME ---
    renderMemoryGame() {
        const state = this.gameState;

        // Setup initial grid if first run
        if (state.currentIndex === 0 && !state.memoryCards) {
            // Use all words in the set (no limit)
            const words = state.words;
            let cards = [];
            words.forEach(w => {
                cards.push({ id: w.word, type: 'word', content: w.word, matched: false });
                cards.push({ id: w.word, type: 'meaning', content: w.meaning, matched: false });
            });
            // Shuffle
            cards.sort(() => Math.random() - 0.5);
            state.memoryCards = cards;
            state.matchedPairs = 0;
            state.totalPairs = words.length;
        }

        document.getElementById('memory-pairs').textContent = state.totalPairs - state.matchedPairs;
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';

        // Calculate optimal grid layout based on card count
        const cardCount = state.memoryCards.length;
        let cols, rows;

        // Determine best column count for the number of cards to fit in rectangular grid
        if (cardCount <= 4) {
            cols = 2;
        } else if (cardCount <= 6) {
            cols = 3;
        } else if (cardCount <= 12) {
            cols = 4;
        } else if (cardCount <= 20) {
            cols = 5;
        } else if (cardCount <= 30) {
            cols = 6;
        } else if (cardCount <= 42) {
            cols = 7;
        } else if (cardCount <= 56) {
            cols = 8;
        } else if (cardCount <= 72) {
            cols = 9;
        } else {
            cols = 10;
        }

        rows = Math.ceil(cardCount / cols);

        // Get actual container dimensions
        const container = grid.parentElement;
        const containerHeight = container.clientHeight || 550;
        const containerWidth = container.clientWidth || 850;

        const gap = 4; // gap-1 = 4px

        // Calculate card dimensions to fit exactly within available space
        const cardHeight = Math.floor((containerHeight - (rows - 1) * gap - 10) / rows);
        const cardWidth = Math.floor((containerWidth - (cols - 1) * gap - 10) / cols);

        // Use smaller dimension to ensure cards fit (make them more square-ish)
        const finalCardHeight = Math.max(30, Math.min(cardHeight, 100));

        // Determine font size based on card size
        let fontSize = 'text-sm';
        let iconSize = 'text-lg';
        if (finalCardHeight < 50) {
            fontSize = 'text-[10px]';
            iconSize = 'text-sm';
        } else if (finalCardHeight < 70) {
            fontSize = 'text-xs';
            iconSize = 'text-base';
        } else if (finalCardHeight >= 90) {
            fontSize = 'text-base';
            iconSize = 'text-xl';
        }

        // Update grid columns and rows dynamically
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows}, ${finalCardHeight}px)`;
        grid.style.gap = `${gap}px`;
        grid.style.maxHeight = `${containerHeight}px`;

        state.memoryCards.forEach((card, index) => {
            const cardEl = document.createElement('div');

            // If matched, invisible or disabled style
            if (card.matched) {
                cardEl.className = `bg-transparent border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 select-none ${fontSize}`;
                cardEl.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
                // Check if currently flipped
                const isFlipped = state.flippedCards.includes(index);

                cardEl.className = `relative transform-style-3d transition-transform duration-500 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`;
                cardEl.onclick = () => this.handleMemoryClick(index);

                const face = `absolute inset-0 backface-hidden rounded-lg flex items-center justify-center shadow-sm select-none p-0.5 text-center ${fontSize} font-bold overflow-hidden leading-tight`;
                const coverStyle = `${face} bg-emerald-500 text-white ${iconSize} z-10`;
                const contentStyle = `${face} bg-white border border-emerald-500 text-slate-700 rotate-y-180`;

                // Truncate long content for small cards
                let displayContent = card.content || '';
                const maxChars = finalCardHeight < 50 ? 12 : (finalCardHeight < 70 ? 18 : 25);
                if (displayContent.length > maxChars) {
                    displayContent = displayContent.substring(0, maxChars - 2) + '..';
                }

                cardEl.innerHTML = `
                    <div class="${coverStyle}">
                        <i class="fa-solid fa-leaf"></i>
                    </div>
                    <div class="${contentStyle}">
                        ${displayContent}
                    </div>
                `;
            }
            grid.appendChild(cardEl);
        });
    }

    handleMemoryClick(index) {
        const state = this.gameState;
        if (state.flippedCards.length >= 2 || state.flippedCards.includes(index)) return;

        state.flippedCards.push(index);
        this.renderMemoryGame();

        if (state.flippedCards.length === 2) {
            const idx1 = state.flippedCards[0];
            const idx2 = state.flippedCards[1];
            const card1 = state.memoryCards[idx1];
            const card2 = state.memoryCards[idx2];

            if (card1.id === card2.id) {
                // Match!
                setTimeout(() => {
                    card1.matched = true;
                    card2.matched = true;
                    state.flippedCards = [];
                    state.matchedPairs++;
                    this.renderMemoryGame();

                    if (state.matchedPairs === state.totalPairs) {
                        this.showToast("Xuất sắc! Bạn đã ghép đúng tất cả.", 'success');
                        this.fireConfetti();
                        this.saveGameResult('memory', this.gameState.setId, 'Hoàn thành');
                        this.showGameDashboard();
                    }
                }, 800);
            } else {
                // No Match
                setTimeout(() => {
                    state.flippedCards = [];
                    this.renderMemoryGame();
                }, 1000);
            }
        }
    }

    // --- SENTENCE BUILDER GAME ---
    renderSentenceGame() {
        const state = this.gameState;
        const word = state.words[state.currentIndex];

        // Ensure example exists
        if (!word.example || word.example.trim() === '') {
            // Skip invalid words or auto-win them
            if (this.gameState.currentIndex < this.gameState.words.length - 1) {
                this.gameState.currentIndex++;
                this.renderSentenceGame();
                return;
            } else {
                this.showToast('Hoàn thành! (Một số từ không có ví dụ đã bị bỏ qua)', 'success');
                this.showGameDashboard();
                return;
            }
        }

        const sentence = word.example;
        // Regex to finding the word (case insensitive)
        const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
        const hiddenSentence = sentence.replace(regex, '<span class="border-b-2 border-blue-400 text-blue-600 font-bold px-2 inline-block min-w-[50px] text-center">______</span>');

        document.getElementById('sentence-current').textContent = state.currentIndex + 1;
        document.getElementById('sentence-total').textContent = state.words.length;

        document.getElementById('sentence-display').innerHTML = hiddenSentence;
        document.getElementById('sentence-meaning').textContent = word.meaning;

        // Generate Options
        const options = [word.word];
        const allWords = state.words;
        let attempts = 0;
        while (options.length < 4 && attempts < 50) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)].word;
            if (!options.includes(randomWord)) options.push(randomWord);
            attempts++;
        }
        options.sort(() => Math.random() - 0.5);

        const grid = document.getElementById('sentence-options');
        grid.innerHTML = '';
        document.getElementById('sentence-feedback').className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 opacity-0';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'w-full py-3 px-4 bg-white border border-blue-200 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm';
            btn.textContent = opt;
            btn.onclick = () => this.handleSentenceGuess(btn, opt, word.word);
            grid.appendChild(btn);
        });
    }

    handleSentenceGuess(btn, guess, actual) {
        const grid = document.getElementById('sentence-options');
        Array.from(grid.children).forEach(b => b.disabled = true);
        const fb = document.getElementById('sentence-feedback');
        fb.classList.remove('opacity-0');

        if (guess.toLowerCase() === actual.toLowerCase()) {
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
            fb.textContent = "Chính xác!";
            fb.classList.add('text-green-500', 'animate-pop');
        } else {
            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
            fb.textContent = `Sai rồi! Đáp án: ${actual}`;
            fb.classList.add('text-red-500', 'animate-shake');
        }

        setTimeout(() => {
            if (this.gameState.currentIndex < this.gameState.words.length - 1) {
                this.gameState.currentIndex++;
                this.renderSentenceGame();
            } else {
                this.showToast('Bạn đã hoàn thành bài tập điền từ!', 'success');
                this.fireConfetti();
                this.saveGameResult('sentence', this.gameState.setId, 'Hoàn thành');
                this.showGameDashboard();
            }
        }, 1500);
    }

    // --- WORD SCRAMBLE GAME ---
    renderScrambleGame() {
        const state = this.gameState;
        const word = state.words[state.currentIndex];

        document.getElementById('scramble-current').textContent = state.currentIndex + 1;
        document.getElementById('scramble-total').textContent = state.words.length;
        document.getElementById('scramble-type').textContent = word.type || 'Word';
        document.getElementById('scramble-meaning').textContent = word.meaning;

        // Setup State
        if (!state.currentScramble) {
            const cleanWord = word.word.replace(/[^a-zA-Z]/g, '').toLowerCase(); // Remove spaces/symbols for simplicity? Or keep them? 
            // Let's stick to simple words or phrases. If phrase, maybe just Scramble letters but keep spacing? 
            // For simplicity, let's just scramble everything and assume single consecutive string.
            const chars = cleanWord.split('');
            state.scrambleTarget = cleanWord;
            state.scrambleInputs = new Array(chars.length).fill(null);
            state.scramblePool = [...chars].sort(() => Math.random() - 0.5).map((c, i) => ({ char: c, id: i, used: false }));
            state.currentScramble = true;
        }

        // Render Slots
        const slotsDiv = document.getElementById('scramble-slots');
        slotsDiv.innerHTML = '';
        state.scrambleInputs.forEach((val, idx) => {
            const slot = document.createElement('div');
            slot.className = `w-10 h-12 border-b-4 ${val ? 'border-purple-500 text-purple-600' : 'border-slate-200'} flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors`;
            slot.textContent = val ? val.char : '';
            slot.onclick = () => {
                if (val) {
                    // Return letter to pool
                    const poolItem = state.scramblePool.find(p => p.id === val.id);
                    if (poolItem) poolItem.used = false;
                    state.scrambleInputs[idx] = null;
                    this.renderScrambleGame(); // Re-render
                }
            };
            slotsDiv.appendChild(slot);
        });

        // Render Letters
        const poolDiv = document.getElementById('scramble-letters');
        poolDiv.innerHTML = '';
        state.scramblePool.forEach(item => {
            if (item.used) return; // Don't show used letters

            const letter = document.createElement('button');
            letter.className = 'w-10 h-10 bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-600 active:scale-95 transition-all';
            letter.textContent = item.char.toUpperCase();
            letter.onclick = () => {
                // Find first empty slot
                const emptyIdx = state.scrambleInputs.findIndex(x => x === null);
                if (emptyIdx !== -1) {
                    state.scrambleInputs[emptyIdx] = item;
                    item.used = true;
                    this.renderScrambleGame();
                    this.checkScrambleWin();
                }
            };
            poolDiv.appendChild(letter);
        });

        // Reset feedback
        const fb = document.getElementById('scramble-feedback');
        fb.className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 opacity-0';
    }

    checkScrambleWin() {
        const state = this.gameState;
        // Check if full
        if (state.scrambleInputs.some(x => x === null)) return;

        const formedWord = state.scrambleInputs.map(x => x.char).join('');
        const fb = document.getElementById('scramble-feedback');
        fb.classList.remove('opacity-0');

        if (formedWord === state.scrambleTarget) {
            fb.textContent = "Chính xác!";
            fb.classList.add('text-green-500', 'animate-pop');

            setTimeout(() => {
                state.currentScramble = false; // Reset for next word
                if (this.gameState.currentIndex < this.gameState.words.length - 1) {
                    this.gameState.currentIndex++;
                    this.renderScrambleGame();
                } else {
                    this.showToast('Chúc mừng! Bạn đã hoàn thành trò chơi sắp xếp từ.', 'success');
                    this.fireConfetti();
                    this.saveGameResult('scramble', this.gameState.setId, 'Hoàn thành');
                    this.showGameDashboard();
                }
            }, 1000);
        } else {
            fb.textContent = "Chưa đúng, thử lại nhé!";
            fb.classList.add('text-red-500', 'animate-shake');
            // Auto clear? Or let user fix? Let user fix.
        }
    }

    // --- UTILS ---
    showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `toast ${type}`;
        div.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i> <span>${msg}</span>`;
        container.appendChild(div);

        // Play sound
        this.playSound(type);

        setTimeout(() => {
            div.style.animation = 'toastSlideOut 0.4s forwards';
            setTimeout(() => div.remove(), 400);
        }, 3000);
    }

    playSound(type) {
        // Simple Web Audio
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'success') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'info') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch (e) { console.error(e); }
    }

    fireConfetti() {
        // Simple Canvas Confetti
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: canvas.width / 2, y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10 - 5,
                c: `hsl(${Math.random() * 360}, 100%, 50%)`,
                size: Math.random() * 5 + 2
            });
        }

        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.x += p.vx; p.y += p.vy; p.vy += 0.2; // gravity
                ctx.fillStyle = p.c;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            frame++;
            if (frame < 100) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
        this.playSound('success'); // Extra chime
    }

}

// Init App Globally
window.app = new App();
