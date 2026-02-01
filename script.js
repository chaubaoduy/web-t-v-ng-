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
        }
    }

    // --- INPUT TABLE LOGIC ---
    addRow(data = null) {
        const tbody = document.getElementById('input-rows');
        if (!tbody) return;

        const idx = tbody.children.length;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><input type="text" class="vocab-input font-medium text-slate-700" placeholder="Nhập từ..." onblur="app.handleWordInput(this, ${idx})"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="/.../" id="ipa-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="Loại từ..." id="type-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500" placeholder="Nghĩa..." id="meaning-${idx}"></td>
            <td><input type="text" class="vocab-input text-slate-500 italic" placeholder="Ví dụ..." id="example-${idx}"></td>
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

    // --- GAME LOGIC ---
    showGameDashboard() {
        document.getElementById('game-dashboard').classList.remove('hidden');
        document.getElementById('game-setup').classList.add('hidden');
        document.getElementById('game-flashcard').classList.add('hidden');
        document.getElementById('game-quiz').classList.add('hidden');
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
            words: set.words, // We can shuffle here if wanted
            currentIndex: 0,
            isFlipped: false
        };

        document.getElementById('game-setup').classList.add('hidden');

        if (gameType === 'flashcard') {
            document.getElementById('game-flashcard').classList.remove('hidden');
            this.renderFlashcard();
        } else if (gameType === 'quiz') {
            document.getElementById('game-quiz').classList.remove('hidden');
            this.gameState.score = 0;
            this.renderQuiz();
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
            fb.className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 text-green-500';
        } else {
            btn.classList.remove('border-indigo-100', 'bg-white');
            btn.classList.add('border-red-500', 'bg-red-100', 'text-red-700');
            fb.textContent = '😅 Sai rồi!';
            fb.className = 'mt-8 h-8 text-center font-bold text-lg transition-opacity duration-300 text-red-500';
        }

        document.getElementById('quiz-score').textContent = this.gameState.score;

        // Next Question
        setTimeout(() => {
            if (this.gameState.currentIndex < this.gameState.words.length - 1) {
                this.gameState.currentIndex++;
                this.renderQuiz();
            } else {
                alert(`Kết thúc! Bạn đạt ${this.gameState.score} điểm.`);
                this.showGameDashboard();
            }
        }, 1500);
    }

    // --- UTILS ---
}

// Init App Globally
window.app = new App();
