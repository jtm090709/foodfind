// server/index.js
// 실행: npm init -y
// npm i express axios cheerio cors
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const MELON_URL = 'https://www.melon.com/chart/index.htm'; // 멜론 실시간/차트 페이지
const PORT = process.env.PORT || 4000;

// 간단한 메모리 캐시
let cache = { ts: 0, data: null };
const CACHE_TTL_MS = 30 * 1000; // 30초

async function fetchMelonChart() {
  // 캐시 확인
  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_TTL_MS) {
    return cache.data;
  }

  // 요청 헤더에 브라우저처럼 보이게 User-Agent를 설정 (멜론이 요청 필터링하는 경우가 있음)
  const res = await axios.get(MELON_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
      Referer: 'https://www.melon.com/',
    },
    // 필요 시 timeout 등 추가
    timeout: 10000,
  });

  const html = res.data;
  const $ = cheerio.load(html);

  // 멜론 차트 HTML 구조는 변경될 수 있으니, 아래 선택자는 튜토리얼/관찰 기반으로 작성된 예시입니다.
  // 만약 구조가 달라지면 개발자 도구로 실제 클래스/선택자를 확인해야 합니다.
  const rows = [];

  // 예: TOP100 list가 #tb_list tbody tr 또는 #lst50 / #lst100 등으로 나눠 있음
  // 여기서는 ".lst50, .lst100" 의 tr을 순회하는 흐름으로 처리 (안정성 위해 두 셀렉터 모두 사용)
  $('tr[data-song-no]').each((i, el) => {
    const rank = i + 1;
    // 곡 제목
    const title = $(el).find('div.ellipsis.rank01 > span > a').text().trim() ||
                  $(el).find('.service_list_song .wrap_song_info .rank01 a').text().trim();
    // 아티스트
    const artist = $(el).find('div.ellipsis.rank02 > a').text().trim() ||
                   $(el).find('.rank02 a').first().text().trim();
    // 앨범
    const album = $(el).find('div.ellipsis.rank03 > a').text().trim();
    // 곡 고유 id (data-song-no 등)
    const songId = $(el).attr('data-song-no') || null;

    // 추가: 좋아요/재생수 등 수집 가능하면 추출
    rows.push({
      rank,
      title,
      artist,
      album,
      songId,
    });
  });

  // 캐시에 저장
  cache = { ts: Date.now(), data: rows };
  return rows;
}

app.get('/api/melon/realtime', async (req, res) => {
  try {
    const chart = await fetchMelonChart();
    res.json({ success: true, updated: cache.ts, chart });
  } catch (err) {
    console.error('meloncrawl err', err.message || err);
    res.status(500).json({ success: false, error: 'Failed to fetch melon chart' });
  }
});

app.listen(PORT, () => {
  console.log(`Melon chart proxy listening on ${PORT}`);
});
