// [숙제13] 텍스트 분석 도구 구현
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

// 2. 텍스트를 단어 배열로 분리 (소문자화 및 문장부호 제거)
function getWords(text) {
    // 모든 문장부호를 공백 한 칸(" ")으로 치환하여 단어가 붙는 것을 방지
    const cleanedText = text.toLowerCase().replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@\[\]^_`{|}~]/g, " "); 
    // 공백 기준으로 단축 분리 후 빈 문자열 필터링
    return cleanedText.split(/\s+/).filter(w => w.length > 0);
}

// 3. 불용어 제거 함수
function removeStopwords(words, stopwords) {
    const stopSet = new Set(stopwords);
    return words.filter(w => !stopSet.has(w));
}

// 4. 단어 빈도 계산 함수
function countWords(words) {
    const counts = {};
    for (const w of words) {
        counts[w] = (counts[w] || 0) + 1;
    }
    return counts;
}

// 5. 상위 N개 단어 추출 함수
function topN(counts, n) {
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // 빈도 내림차순 정렬
        .slice(0, n)
        .map(([word, count]) => ({ word, count }));
}

// 6. Chart.js 막대그래프 그리기 함수
function drawChart(selector, topData, color) {
    const ctx = document.querySelector(selector);
    if (!ctx) return;

    const labels = topData.map(item => item.word);
    const dataValues = topData.map(item => item.count);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '단어 빈도수',
                data: dataValues,
                backgroundColor: color,
                borderColor: color.replace("0.6", "1"),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', 
            maintainAspectRatio: false, 
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    ticks: {
                        autoSkip: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false 
                }
            }
        }
    });
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
    fetch("/data/frankenstein.txt").then(r => {
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