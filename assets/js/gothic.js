// [숙제14] gothic.js
// 2025-26179 조혜원

// 1. 본문 추출 함수 (Gutenberg 서지정보 및 라이선스 제거)
function extractBody(text) {
    // 두 파일 모두에 공통으로 존재하는 표준 시작/끝 표시 문자열 사용
    const startMarker = "*** START OF THE PROJECT GUTENBERG EBOOK";
    const endMarker = "*** END OF THE PROJECT GUTENBERG EBOOK";
    
    const startIdx = text.indexOf(startMarker);
    const endIdx = text.indexOf(endMarker);
    
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

// 7. 분석 파이프라인 통합 함수
function analyze(text, stopwords) {
    const body = extractBody(text);
    const words = getWords(body);
    const cleaned = removeStopwords(words, stopwords);
    const counts = countWords(cleaned);
    return topN(counts, 30);
}

// 메인 실행: 4개 파일을 동시에 fetch하여 처리
Promise.all([
    fetch("/assets/data/frankenstein.txt").then(r => {
        if (!r.ok) throw new Error("frankenstein.txt 로드 실패");
        return r.text();
    }),
    fetch("/data/dracula.txt").then(r => {
        if (!r.ok) throw new Error("dracula.txt 로드 실패");
        return r.text();
    }),
    fetch("/data/stopwords-en.txt").then(r => {
        if (!r.ok) throw new Error("stopwords-en.txt 로드 실패");
        return r.text();
    }),
    fetch("/data/stopwords-custom.txt").then(r => {
        if (!r.ok) throw new Error("stopwords-custom.txt 로드 실패 (파일이 올바르게 생성되었는지 확인하세요)");
        return r.text();
    })
]).then(([frankText, dracText, baseStop, customStop]) => {
    // 기본 불용어와 커스텀 불용어 텍스트를 합쳐 배열로 생성
    const stopwords = (baseStop + "\n" + customStop)
        .split(/\s+/)
        .filter(w => w.length > 0);

    // 두 작품 분석 실행 (상위 30개 단어 추출)
    const frankTop = analyze(frankText, stopwords);
    const dracTop = analyze(dracText, stopwords);

    // 그래프 그리기 (Frankenstein: 녹색, Dracula: 빨간색)
    drawChart("#chart-frankenstein", frankTop, "rgba(40, 167, 69, 0.6)");
    drawChart("#chart-dracula", dracTop, "rgba(220, 53, 69, 0.6)");

}).catch(err => {
    console.error("에러 발생:", err);
});