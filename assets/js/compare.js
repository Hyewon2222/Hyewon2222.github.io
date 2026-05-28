// 1. Project Gutenberg 
function extractBody(text) {
    const startMark = "*** START OF THE PROJECT GUTENBERG EBOOK";
    const endMark   = "*** END OF THE PROJECT GUTENBERG EBOOK";

    const startIdx = text.indexOf(startMark);
    const endIdx   = text.indexOf(endMark);

    // 시작 표시 다음 줄부터 끝 표시 직전까지
    return text.slice(startIdx, endIdx);
}

// 2. 가져온 본문에서 단어들의 배열을 얻기
function getWords(text) {
    return text
        .toLowerCase()
        .replace(/[.,!?;:'"‘’“”()\[\]_*]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 0);
}

// 3. 단어들의 배열에서 불용어를 제거한 배열 얻기
function removeStopwords(words, stopwords) {
    return words.filter(w=> !stopwords.includes(w));
}

// 4. 단어들의 배열을 {단어:빈도} 꼴의 객체로 만들기
function countWords(words) { // words: 단어들의 배열
    const counts = {}; // 빈 배열 초기화
    for (const word in words) {
        counts[word] = (counts[word] || 0) + 1;
    }
    return counts;
}

// 5. {단어: 빈도} 객체에서 상위 n개의 배열 얻기
function topN(counts, n) {
    return Object.entries(counts) // 객체 --> 배열로 변환
        .sort((a, b) => b[1] - a[1]) // 빈도가 높은 순서대로 정렬
        .slice(0, n);
}

// 종합: text --> 상위 n개 단어의 배열
function analyze(text, stopwords) {
    const body = extractBody(text);
    const words = getWords(body);
    const cleaned = removeStopwords(words, stopwords);
    const counts = countWords(cleaned);
    return topN(counts, 30);
}
