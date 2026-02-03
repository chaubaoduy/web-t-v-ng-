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
const localData = {
    "hello": { mean: "Xin chào", ex: "Hello, it is nice to meet you.", type: "Thán từ", ipa: "/həˈləʊ/" },
    "apple": { mean: "Quả táo", ex: "She eats a fresh apple every morning.", type: "Danh từ", ipa: "/ˈæp.l̩/" },
    "make sense": { mean: "Có lý, dễ hiểu", ex: "His explanation didn't make sense to me.", type: "Cụm động từ", ipa: "/meɪk sens/" },
    "look for": { mean: "Tìm kiếm", ex: "I am looking for my lost keys.", type: "Cụm động từ", ipa: "/lʊk fɔːr/" },
    "give up": { mean: "Từ bỏ", ex: "Never give up on your dreams.", type: "Cụm động từ", ipa: "/ɡɪv ʌp/" },
    "run out of": { mean: "Hết, cạn kiệt", ex: "We have run out of milk.", type: "Cụm động từ", ipa: "/rʌn aʊt əv/" },
    "take care of": { mean: "Chăm sóc", ex: "Please take care of my cat while I am away.", type: "Cụm động từ", ipa: "/teɪk keər əv/" },
    "communication": { mean: "Sự giao tiếp", ex: "Good communication is the key to a successful relationship.", ipa: "/kəˌmjuː.nɪˈkeɪ.ʃən/" },
    "information": { mean: "Thông tin", ex: "You can find more information on our website.", ipa: "/ˌɪn.fəˈmeɪ.ʃən/" },
    "education": { mean: "Giáo dục", ex: "Education is essential for personal development.", ipa: "/ˌedʒ.ʊˈkeɪ.ʃən/" },
    "family": { mean: "Gia đình", ex: "He loves spending time with his family on weekends.", ipa: "/ˈfæm.əl.i/" },
    "happiness": { mean: "Hạnh phúc", ex: "Money cannot buy true happiness.", ipa: "/ˈhæp.i.nəs/" },
    "technology": { mean: "Công nghệ", ex: "Modern technology has changed the way we live.", ipa: "/tekˈnɒl.ə.dʒi/" },
    "environment": { mean: "Môi trường", ex: "We must protect the environment for future generations.", ipa: "/ɪnˈvaɪ.rən.mənt/" },
    "society": { mean: "Xã hội", ex: "Every individual plays a role in society.", ipa: "/səˈsaɪ.ə.ti/" },
    "government": { mean: "Chính phủ", ex: "The government is implementing new policies.", ipa: "/ˈɡʌv.ən.mənt/" },
    "health": { mean: "Sức khỏe", ex: "Eating vegetables is good for your health.", ipa: "/helθ/" }
};

const AI = {
    async predict(word) {
        const cleanWord = word.trim().toLowerCase();

        // 1. Check Local Data First (Best for Phrases & Common Words)
        if (localData[cleanWord]) {
            return {
                ipa: localData[cleanWord].ipa || "/.../",
                type: localData[cleanWord].type || "Danh từ",
                meaning: localData[cleanWord].mean,
                example: localData[cleanWord].ex
            };
        }

        try {
            // 2. Fetch Real Data from Dictionary API
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
            if (!response.ok) throw new Error('Not found');

            const data = await response.json();
            const entry = data[0];

            // Extract best data
            const ipa = entry.phonetic || (entry.phonetics.find(p => p.text)?.text) || "/.../";
            const type = entry.meanings[0].partOfSpeech || "noun";

            // Logic to find the BEST example (longest sentence)
            let bestExample = "";
            for (const meaning of entry.meanings) {
                for (const def of meaning.definitions) {
                    if (def.example && def.example.length > bestExample.length) {
                        bestExample = def.example;
                    }
                }
            }

            // Fallback example template
            if (!bestExample) {
                bestExample = generateFallbackExample(cleanWord, type);
            }

            // Meaning (English def as fallback)
            const meaning = entry.meanings[0].definitions[0].definition;

            return {
                ipa: ipa,
                type: translateType(type),
                meaning: meaning,
                example: capitalizeFirstLetter(bestExample)
            };

        } catch (error) {
            // Offline/Not Found fallback
            return {
                ipa: "/.../",
                type: "...",
                meaning: "...",
                example: generateFallbackExample(word, 'noun')
            };
        }
    }
};

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

        // Load API Key to Input if exists
        const key = localStorage.getItem('gemini_api_key');
        if (key) document.getElementById('api-key-input').value = key;
    }

    toggleSettings() {
        const modal = document.getElementById('settings-modal');
        modal.classList.toggle('hidden');
    }

    saveApiKey() {
        const key = document.getElementById('api-key-input').value.trim();
        if (!key) {
            alert('Vui lòng nhập Key!');
            return;
        }
        localStorage.setItem('gemini_api_key', key);
        this.toggleSettings();
        alert('Đã lưu API Key! Giờ bạn có thể nhập từ vựng.');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                const maps = ['learn', 'review', 'games', 'stats'];
                this.navigate(maps[index]);
            });
        });
    }

    navigate(viewId) {
        // Update Sidebar UI
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        const map = { 'learn': 0, 'review': 1, 'games': 2, 'stats': 3 };
        const idx = map[viewId];
        if (document.querySelectorAll('.nav-item')[idx]) {
            document.querySelectorAll('.nav-item')[idx].classList.add('active');
        }

        // Update View
        document.querySelectorAll('section').forEach(el => el.classList.remove('active'));
        const targetSection = document.getElementById(`view-${viewId}`);
        if (targetSection) targetSection.classList.add('active');

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
        });
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

    async handleWordInput(input, idx) {
        const word = input.value.trim();
        if (!word) return;

        // Auto add next row if this is the last row
        const tbody = document.getElementById('input-rows');
        if (tbody.children.length === idx + 1) {
            this.addRow();
        }

        // Add loading state
        input.parentElement.classList.add('animate-pulse');

        // AI prediction logic reuse existing AI object
        // NOTE: The original code removed AI autofill in previous version of script.js?
        // Ah, lines 247-248 say "AI AUTOFILL REMOVED - Manual input only".
        // BUT the user prompt 68 says "Nhập từ tiếng Anh, hệ thống sẽ tự động điền".
        // I should probably restore it if I want it to work like my app.js did. 
        // My app.js had: `const prediction = await AI.predict(word);`
        // Let's restore AI functionality as that seems to be the intent of "upgrading".

        const prediction = await AI.predict(word);

        const setAndResize = (id, value) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = value || '';
                this.autoResize(el);
            }
        };

        setAndResize(`ipa-${idx}`, prediction.ipa);
        setAndResize(`type-${idx}`, prediction.type);
        setAndResize(`meaning-${idx}`, prediction.meaning);
        setAndResize(`example-${idx}`, prediction.example);

        input.parentElement.classList.remove('animate-pulse');
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
            alert('Chưa có từ vựng nào để lưu!');
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
        alert('Đã lưu thành công! Bạn có thể xem trong "Kho lưu trữ".');

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
            card.className = 'bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative';
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
                tr.className = 'border-b border-slate-50 hover:bg-slate-50/50 transition-colors';

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
    }

    prepareGame(gameType) {
        // 1. Show Set Selection
        const sets = Store.getSets();
        if (sets.length === 0) {
            alert('Bạn chưa có bộ từ vựng nào! Hãy vào phần "Học từ" để tạo trước nhé.');
            return;
        }

        document.getElementById('game-dashboard').classList.add('hidden');
        document.getElementById('game-setup').classList.remove('hidden');

        const list = document.getElementById('game-set-list');
        list.innerHTML = '';

        sets.forEach(set => {
            const btn = document.createElement('div');
            btn.className = 'bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 cursor-pointer transition-all flex justify-between items-center group';
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
            alert('Đã hết bộ từ! Chúc mừng bạn đã hoàn thành ôn tập.');
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
                alert(`Kết thúc! Bạn đạt ${this.gameState.score} điểm.`);
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
            // Pick max 8 words for 16 cards (or fewer if set is small)
            const words = state.words.slice(0, 8);
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

        // Adjust grid cols based on card count if needed, but 4 is good standard

        state.memoryCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            // If matched, invisible or disabled style
            if (card.matched) {
                cardEl.className = 'h-32 bg-transparent border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 select-none';
                cardEl.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
                // Check if currently flipped
                const isFlipped = state.flippedCards.includes(index);
                cardEl.className = `h-32 rounded-xl cursor-pointer transition-all duration-300 perspective-1000 relative group`;
                cardEl.onclick = () => this.handleMemoryClick(index);

                // Front (Hidden)
                const front = document.createElement('div');
                front.className = `absolute inset-0 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-3xl shadow-md group-hover:bg-emerald-600 transition-colors ${isFlipped ? 'rotate-y-180 backface-hidden' : ''}`;
                front.innerHTML = '<i class="fa-solid fa-question"></i>';

                // Back (Content)
                const back = document.createElement('div');
                back.className = `absolute inset-0 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-center p-2 text-center shadow-md rotate-y-180 backface-hidden ${isFlipped ? 'rotate-0' : ''}`;
                // Keep 'rotate-y-180' on back initially, but logic here is flip class applies to CONTAINER usually or we swap Opacity/Transform
                // Let's use simpler logic: Class 'flipped' on container rotates it 180.

                // REVISION: Simplify 3D flip for grid items
                cardEl.className = `h-32 relative transform-style-3d transition-transform duration-500 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`;

                const face = `absolute inset-0 backface-hidden rounded-xl flex items-center justify-center shadow-md select-none p-3 text-center text-sm font-bold`;
                const frontFace = `${face} bg-emerald-100 text-emerald-600 border-2 border-emerald-200`; // The "Face Down" state in code logic is actually visible info? No.
                // Wait, "Flip" means reveal. 
                // Default state (not flipped) -> colorful back.
                // Flipped state -> Content.

                const coverStyle = `${face} bg-emerald-500 text-white text-3xl z-10`; // Visible when NOT rotated
                const contentStyle = `${face} bg-white border-2 border-emerald-500 text-slate-700 rotate-y-180`; // Visible when rotated

                cardEl.innerHTML = `
            <div class="${coverStyle}">
                <i class="fa-solid fa-leaf"></i>
            </div>
            <div class="${contentStyle}">
                ${card.content}
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
                        alert("Xuất sắc! Bạn đã ghép đúng tất cả.");
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
                alert('Hoàn thành! (Một số từ không có ví dụ đã bị bỏ qua)');
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
                alert('Bạn đã hoàn thành bài tập điền từ!');
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
                    alert('Chúc mừng! Bạn đã hoàn thành trò chơi sắp xếp từ.');
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
}

// Init App Globally
window.app = new App();
