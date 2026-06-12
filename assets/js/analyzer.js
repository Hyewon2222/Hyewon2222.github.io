// assets/js/analyzer.js

// 1. 전역 변수 선언 (이전 차트 객체와 fetch한 불용어를 보관)
let resultChart = null; 
let cachedStopwords = []; 

// 2. 페이지가 열릴 때 기본 불용어(stopwords-en.txt)를 미리 fetch하여 저장
fetch('/assets/data/stopwords-en.txt')
    .then(response => {
        if (!response.ok) throw new Error("불용어 파일을 불러오지 못했습니다.");
        return response.text();
    })
    .then(text => {
        // [지침서 조건] 텍스트를 단어 배열로 변환하여 미리 보관 (재사용)
        cachedStopwords = getWords(text); 
        console.log("기본 불용어 로드 완료!");
    })
    .catch(error => console.error("불용어 로드 중 에러:", error));

// 3. DOM 요소 가져오기 (analyzer.md의 HTML 요소들과 매칭)
const textInput = document.querySelector("textarea");
const analyzeBtn = document.querySelector("button");
const chartCanvasSelector = "#wordChart"; // 마크다운에 작성할 canvas의 ID (아래 md 확인)

// 4. 분석 버튼 클릭 이벤트 리스너 설정
analyzeBtn.addEventListener("click", () => {
    const rawText = textInput.value.trim();

    // 입력값이 없을 때의 예외 처리
    if (!rawText) {
        alert("분석할 영어 텍스트를 입력해주세요!");
        return;
    }

    // [지침서 조건] 다시 버튼을 눌렀을 때 "Canvas is already in use" 에러 방지를 위해 이전 차트 파괴
    if (resultChart) {
        resultChart.destroy();
    }

    // [지침서 조건] 파이프라인 연속 실행
    // getWords -> removeStopwords -> countWords -> topN(..., 20)
    const allWords = getWords(rawText);
    const filteredWords = removeStopwords(allWords, cachedStopwords);
    const wordCounts = countWords(filteredWords);
    const top20Data = topN(wordCounts, 20); // 분석기는 상위 20개 단어 추출

    // analysis.js의 공통 함수를 사용해 차트 그리기
    // [지침서 조건] 리턴된 차트 객체를 resultChart에 할당해야 다음 클릭 때 destroy()가 가능합니다.
    resultChart = drawChart(chartCanvasSelector, top20Data, "rgba(75, 192, 192, 0.6)"); 
});