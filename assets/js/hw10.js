// [숙제10] JavaScript 기초 연습
// 2025-26179 조혜원

// Q1
function classifyEra(year) {
    if (year < 1910) {
        return "개화기 이전"
    }
    else if (year >= 1910 && year < 1945){
        return "일제강점기"
    }
    else if (year >= 1945 && year <= 1990){
        return "해방 이후-현대"
    }
    else {
        return "동시대";
    }
}

const years = [1908, 1936, 1972, 2025];
for (const year of years) {
    console.log(`${year}년: ${classifyEra(year)}`);
}


// Q2
const works = ["날개", "오감도", "지주회시", "종생기", "권태"];

// 1.
console.log(works.length);
console.log(works[0]);
console.log(works[works.length -1]);

// 2.
const titled = works.map(work => `「${work}」`);
console.log(titled);

// 3.
const long = works.filter(w => w.length >= 3);
console.log(long);

// 4.
let count = 0; 
for (const title of long) {count++;
    console.log(`${count}번째 작품: ${title}`);
   
}

// Q3
function countChar(text, target) {
    let count = 0;
    for (const ch of text){
        if (ch === target) {
            count++;
        }
    }
    return count;
}

const text1 = "박씨는 이씨에게 시집간 김씨의 외사촌 동생이다.", target1 = "씨";
console.log(`"${text1}"에서 '${target1}'는 ${countChar(text1, target1)}번 등장합니다.`);

const text2 = "이상의 날개」는 1936년 작품이다.", target2 = "이";
console.log(`"${text2}"에서 '${target2}'는 ${countChar(text2, target2)}번 등장합니다.`);

const text3 = "banana", target3 = "a";
console.log(`"${text3}"에서 '${target3}'는 ${countChar(text3, target3)}번 등장합니다.`);


// Q4
// 1.
const text = "이상의 「날개」 는 1936년에 발표된 단편소설이다.";
const targets = ["이", "의", "날", "개", "소"];

// 2.
const counts = targets.map(t => countChar(text, t));
console.log(counts)

// 3.
for (let i = 0; i < targets.length; i++) {
    console.log(`'${targets[i]}' : ${counts[i]}번`);
} 

// 4.
const frequent = targets.filter(t => countChar(text, t) >= 2);
console.log(frequent);

// 5.
let maxIdx = 0;
for (let i = 1; i < counts.length; i++) {
    if (counts[i] > counts[maxIdx]) {
        maxIdx = i;
    } 
}
const topTarget = targets[maxIdx];
console.log(`가장 자주 나온 글자: '${topTarget}' (${counts[maxIdx]}번)`);
