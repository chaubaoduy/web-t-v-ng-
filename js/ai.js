// Dictionary for mock predictions
const dictionary = {
    "hello": { ipa: "/həˈləʊ/", type: "thán từ", meaning: "Xin chào", example: "Hello, how are you?" },
    "apple": { ipa: "/ˈæp.l̩/", type: "danh từ", meaning: "Quả táo", example: "She eats an apple every day." },
    "book": { ipa: "/bʊk/", type: "danh từ", meaning: "Quyển sách", example: "I am reading a good book." },
    "computer": { ipa: "/kəmˈpjuː.tər/", type: "danh từ", meaning: "Máy tính", example: "Start the computer." },
    "run": { ipa: "/rʌn/", type: "động từ", meaning: "Chạy", example: "He can run very fast." },
    "beautiful": { ipa: "/ˈbjuː.tɪ.fəl/", type: "tính từ", meaning: "Xinh đẹp", example: "What a beautiful flower!" },
    "cat": { ipa: "/kæt/", type: "danh từ", meaning: "Con mèo", example: "The cat is sleeping." },
    "dog": { ipa: "/dɒɡ/", type: "danh từ", meaning: "Con chó", example: "The dog barked loudly." },
    "house": { ipa: "/haʊs/", type: "danh từ", meaning: "Ngôi nhà", example: "They bought a new house." },
    "school": { ipa: "/skuːl/", type: "danh từ", meaning: "Trường học", example: "Go to school on time." }
};

export const AI = {
    // Simulate API call delay
    async predict(word) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lowerWord = word.toLowerCase().trim();
                if (dictionary[lowerWord]) {
                    resolve(dictionary[lowerWord]);
                } else {
                    // Fallback for unknown words (simulation)
                    resolve({
                        ipa: "/.../",
                        type: "...",
                        meaning: "...",
                        example: `This is an example for '${word}'.`
                    });
                }
            }, 600); // 600ms simulated delay
        });
    }
};
