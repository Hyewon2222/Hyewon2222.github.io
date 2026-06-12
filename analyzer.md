---
layout: page
title: 사용자 입력 분석기
permalink: /analyzer/
---

<h2>영어 텍스트 단어 빈도 분석기</h2>
<p>분석하고 싶은 영어 텍스트 단락을 아래에 붙여넣고 버튼을 눌러보세요.</p>

<textarea id="text-input" rows="10" style="width: 100%; font-family: monospace;" placeholder="여기 서 영어 텍스트를 입력하세요..."></textarea>
<br>
<button style="margin-top: 10px; padding: 10px 20px; font-size: 16px; cursor: pointer;">텍스트 분석하기</button>

<br><br>
<hr>
<br>

<h3>상위 20개 단어 빈도 결과</h3>
<div style="position: relative; height: 500px; width: 100%;">
  <canvas id="wordChart"></canvas>
</div>

{% include chartjs.html %}
<script src="/assets/js/analysis.js"></script>
<script src="/assets/js/analyzer.js"></script>