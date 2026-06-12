//[숙제14]analysis.js

function getWords(text) {
    return text
        .toLowerCase()
        .replace(/[.,!?;:'"‘’“”()\[\]_*-]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 0);
}

function countWords(words) { // words: 단어들의 배열
    const counts = {}; // 빈 배열 초기화
    for (const word of words) {
        counts[word] = (counts[word] || 0) + 1;
    }
    return counts;
}

function topN(counts, n) {
    return Object.entries(counts) // 객체 --> 배열로 변환
        .sort((a, b) => b[1] - a[1]) // 빈도가 높은 순서대로 정렬
        .slice(0, n);
}

function removeStopwords(words, stopwords) {
    return words.filter(w=> !stopwords.includes(w));
}

function drawChart(selector, topData, color) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;

    const labels = topData.map(item => Array.isArray(item) ? item[0] : (item.word || item[0]));
    const dataValues = topData.map(item => Array.isArray(item) ? item[1] : (item.count || item[1]));

    return new Chart(canvas, {
        type: "bar", 
        data: {
            labels: labels, 
            datasets: [{
                label: "빈도", 
                data: dataValues, 
                backgroundColor: color,
                borderColor: typeof color === 'string' ? color.replace("0.6", "1") : color,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: { beginAtZero: true },
                y: { ticks: { autoSkip: false } }
            },
            plugins: {
                legend: {
                    display: false 
                }
            }
        },
    });
}