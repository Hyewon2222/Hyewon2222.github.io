// [숙제12] 인문학 데이터 시각화
// 2025-26179 조혜원

// Q1
fetch("/data/sillok.json")
.then(response => response.json())
.then(records => {
    const labels = records.map(r => r.king);
    const counts = records.map(r => r.volumes);

    const canvas = document.querySelector("#q1-chart");
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "권수",
          data: counts,
          backgroundColor: "rgba(54, 162, 235, 0.6)" 
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "조선왕조실록 왕대별 권수" 
          }
        },
        scales: {
          y: {
            beginAtZero: true 
          }
        }
      }
    });
  });

// Q2
fetch("/data/nobel-literature.csv")
.then(response => response.text())
.then(csv => {
    const rows = csv
      .split("\n")
      .slice(1) // 헤더 떼기
      .filter(line => line.trim() !== "") // 빈줄 떼기
      .map(line => {
        const cols = line.split(",");
        return {
          decade: Number(cols[0]), // 텍스트 데이터를 숫자로 명시적 변환
          count: Number(cols[1])
        };
      });

    const labels = rows.map(r => `${r.decade}년대`);
    const counts = rows.map(r => r.count);

    const canvas = document.querySelector("#q2-chart");
    new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "수상자 수",
          data: counts,
          borderColor: "rgba(54, 162, 235, 1)",      
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: false 
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "노벨문학상 수상자 수 추이 (10년 단위)" 
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "연대" 
            }
          },
          y: {
            title: {
              display: true,
              text: "수상자 수" 
            },
            beginAtZero: true 
          }
        }
      }
    });
  });
