// 1. Project Gutenberg 
function extractBody(text) {
    const startMark = "*** START OF THE PROJECT GUTENBERG EBOOK";
    const endMark   = "*** END OF THE PROJECT GUTENBERG EBOOK";

    const startIdx = text.indexOf(startMark);
    const endIdx   = text.indexOf(endMark);

    // 시작 표시 다음 줄부터 끝 표시 직전까지
    return text.slice(startIdx, endIdx);
}

// 종합: text --> 상위 n개 단어의 배열
function analyze(text, stopwords) {
    const body = extractBody(text);
    const words = getWords(body);
    const cleaned = removeStopwords(words, stopwords);
    const counts = countWords(cleaned);
    return topN(counts, 30);
}

// 파일 읽고 처리하기
Promise.all([
    fetch("/data/scarlet.txt").then(r => r.text()),
    fetch("/data/hound.txt").then(r => r.text()),
    fetch("/data/stopwords-en.txt").then(r => r.text()),
]).then(
    ([scarletText, houndText, stopwordsText]) => {
        const stopwords = stopwordsText.split(/\s+/).filter(w => w.length > 0);
        const scarletTop = analyze(houndText, stopwords);
        const houndTop = analyze(houndText, stopwords);
        drawChart("#chart-scarlet", scarletTop, "rgba(220, 53, 69, 0.6)");
        drawChart("#chart-hound", houndTop, "rgba(54, 162, 235, 0.6)")
    }
)
