//[숙제14] compare.js

// 1. Project Gutenberg 
function extractBody(text) {
    const startMark = "*** START OF THE PROJECT GUTENBERG EBOOK";
    const endMark   = "*** END OF THE PROJECT GUTENBERG EBOOK";

    const startIdx = text.indexOf(startMark);
    const endIdx   = text.indexOf(endMark);

    // 시작 표시 다음 줄부터 끝 표시 직전까지
    let body = text;
    
    if (startIdx !== -1) {
        // 시작 마커 줄의 끝 다음부터 본문 시작
        const nextLineIdx = text.indexOf("\n", startIdx);
        body = body.substring(nextLineIdx !== -1 ? nextLineIdx + 1 : startIdx + startMarker.length);
    }
    if (endIdx !== -1) {
        body = body.substring(0, endIdx);
    }
    return body;
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
    fetch("/assets/data/scarlet.txt").then(r => r.text()),
    fetch("/assets/data/hound.txt").then(r => r.text()),
    fetch("/assets/data/stopwords-en.txt").then(r => r.text()),
]).then(
    ([scarletText, houndText, stopwordsText]) => {
        const stopwords = getWords(stopwordsText);
        const scarletTop = analyze(scarletText, stopwords);
        const houndTop = analyze(houndText, stopwords);
        drawChart("#chart-scarlet", scarletTop, "rgba(220, 53, 69, 0.6)");
        drawChart("#chart-hound", houndTop, "rgba(54, 162, 235, 0.6)")
    }
)
