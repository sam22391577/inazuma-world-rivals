/* Portrait identities are locked to named entries in LEVEL5's official Inagle. */
(() => {
  'use strict';
  const records = [
  {
    "label": "圓堂",
    "officialName": "円堂 守",
    "file": "assets/portraits/endou-mamoru.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM7Oz8_Nz92igg%3D%3D",
    "officialId": "k/j/d/jdjpa1mcn1m"
  },
  {
    "label": "西蔭",
    "officialName": "西蔭 政也",
    "file": "assets/portraits/nishikage-seiya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Mz8_Nz92igg%3D%3D",
    "officialId": "k/g/r/graq5qx3ije"
  },
  {
    "label": "立向居",
    "officialName": "立向居 勇気",
    "file": "assets/portraits/tachimukai-yuuki.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzc_NzMfOz92igg%3D%3D",
    "officialId": "k/o/y/oy1sibyz7wc"
  },
  {
    "label": "吹雪",
    "officialName": "吹雪 士郎",
    "file": "assets/portraits/fubuki-shirou.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Gz8_Oz92igg%3D%3D",
    "officialId": "k/g/1/g1zm_1kbai8"
  },
  {
    "label": "敦也",
    "officialName": "吹雪 アツヤ",
    "file": "assets/portraits/fubuki-atsuya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?page=84",
    "officialId": "k/m/a/maq5sorjvom"
  },
  {
    "label": "水神矢",
    "officialName": "水神矢 成龍",
    "file": "assets/portraits/mizukamiya-seiryuu.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Nz8_Iz92igg%3D%3D",
    "officialId": "k/p/o/poj0tfsggps"
  },
  {
    "label": "飛鷹",
    "officialName": "飛鷹 征矢",
    "file": "assets/portraits/tobitaka-seiya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mz8_Nz92igg%3D%3D",
    "officialId": "k/p/7/p7cdsgjrbs0"
  },
  {
    "label": "風丸",
    "officialName": "風丸 一郎太",
    "file": "assets/portraits/kazemaru-ichirouta.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Iz87Nz92igg%3D%3D",
    "officialId": "k/6/l/6lz2zb_50q0"
  },
  {
    "label": "野坂",
    "officialName": "野坂 悠馬",
    "file": "assets/portraits/nosaka-yuuma.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Mz8_Oz92igg%3D%3D",
    "officialId": "k/m/-/m-5fq3i_xp0"
  },
  {
    "label": "鬼道",
    "officialName": "鬼道 有人",
    "file": "assets/portraits/kidou-yuuto.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Nz87Nz92igg%3D%3D",
    "officialId": "k/t/f/tfourotltau"
  },
  {
    "label": "神童",
    "officialName": "神童 拓人",
    "file": "assets/portraits/shindou-takuto.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_Pz8_Gz92igg%3D%3D",
    "officialId": "k/z/m/zmait0l-frk"
  },
  {
    "label": "天馬",
    "officialName": "松風 天馬",
    "file": "assets/portraits/matsukaze-tenma.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_Pz8_Hz92igg%3D%3D",
    "officialId": "k/o/o/ooxd-ldeoym"
  },
  {
    "label": "基山",
    "officialName": "基山 タツヤ",
    "file": "assets/portraits/kiyama-tatsuya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM7Pz8_Oz92igg%3D%3D",
    "officialId": "k/_/z/_zskpmplngm"
  },
  {
    "label": "阿芙洛蒂",
    "officialName": "亜風炉 照美",
    "file": "assets/portraits/afuro-terumi.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Hz8_Oz92igg%3D%3D",
    "officialId": "k/6/q/6q1af7euf9m"
  },
  {
    "label": "一星",
    "officialName": "一星 光",
    "file": "assets/portraits/ichihoshi-hikaru.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPx8_Oz8_Nz92igg%3D%3D",
    "officialId": "k/p/j/pjw-aty8hpc"
  },
  {
    "label": "豪炎寺",
    "officialName": "豪炎寺 修也",
    "file": "assets/portraits/gouenji-shuuya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Kz8_Oz92igg%3D%3D",
    "officialId": "k/5/h/5h_rz2fvtjm"
  },
  {
    "label": "灰崎",
    "officialName": "灰崎 凌兵",
    "file": "assets/portraits/haizaki-ryouhei.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM_Nz8_Oz92igg%3D%3D",
    "officialId": "k/a/h/ah_jq5yqice"
  },
  {
    "label": "劍城",
    "officialName": "剣城 京介",
    "file": "assets/portraits/tsurugi-kyousuke.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_Pz87Pz92igg%3D%3D",
    "officialId": "k/3/o/3obvj1s3khe"
  },
  {
    "label": "白龍",
    "officialName": "白竜",
    "file": "assets/portraits/hakuryuu.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_PzMrPz92igg%3D%3D",
    "officialId": "k/1/g/1g0broofgtu"
  },
  {
    "label": "吉良",
    "officialName": "吉良 ヒロト",
    "file": "assets/portraits/kira-hiroto.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM7Pz8_Nz92igg%3D%3D",
    "officialId": "k/f/c/fcp_67ctsa8"
  },
  {
    "label": "洛可可",
    "officialName": "ロココ・ウルパ",
    "file": "assets/portraits/rococo-ulpa.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mzc3Oz92igg%3D%3D",
    "officialId": "k/v/7/v7w7tryajw8"
  },
  {
    "label": "沙木沼治",
    "officialName": "砂木沼 治",
    "file": "assets/portraits/saginuma-osamu.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPyM7Pz8_Lz92igg%3D%3D",
    "officialId": "k/s/v/sv5c5do761u"
  },
  {
    "label": "特雷斯",
    "officialName": "テレス・トルーエ",
    "file": "assets/portraits/teres-tolue.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mzs3Nz92igg%3D%3D",
    "officialId": "k/_/s/_slgrn8fske"
  },
  {
    "label": "壁山",
    "officialName": "壁山 塀吾郎",
    "file": "assets/portraits/kabeyama-heigorou.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzs_Pz8_Mz92igg%3D%3D",
    "officialId": "k/m/r/mrvaa0xojh8"
  },
  {
    "label": "天城",
    "officialName": "天城 大地",
    "file": "assets/portraits/amagi-daichi.png",
    "source": "https://zukan.inazuma.jp/chara_param/?page=47",
    "officialId": "k/8/l/8ltucb1u6hu"
  },
  {
    "label": "黃名子",
    "officialName": "菜花 黄名子",
    "file": "assets/portraits/nanobana-kinako.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPys_Nz87Lz92igg%3D%3D",
    "officialId": "k/k/5/k579cnognde"
  },
  {
    "label": "狩屋",
    "officialName": "狩屋 マサキ",
    "file": "assets/portraits/kariya-masaki.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_Pz87Kz92igg%3D%3D",
    "officialId": "k/k/o/koonzotp5sc"
  },
  {
    "label": "綱海",
    "officialName": "綱海 条介",
    "file": "assets/portraits/tsunami-jousuke.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzc_Ny8_Lz92igg%3D%3D",
    "officialId": "k/i/0/i0spbukph8c"
  },
  {
    "label": "不動",
    "officialName": "不動 明王",
    "file": "assets/portraits/fudou-akio.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mz8_Kz92igg%3D%3D",
    "officialId": "k/n/a/nabfc5b9eq0"
  },
  {
    "label": "一之瀨",
    "officialName": "一之瀬 一哉",
    "file": "assets/portraits/ichinose-kazuya.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzs_Oz8bOz92igg%3D%3D",
    "officialId": "k/e/4/e4qtt3lwf_m"
  },
  {
    "label": "崔昌秀",
    "officialName": "チェ・チャンスウ",
    "file": "assets/portraits/choi-chang-soo.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mz8jPz92igg%3D%3D",
    "officialId": "k/l/h/lhrjdsednmc"
  },
  {
    "label": "馬克",
    "officialName": "マーク・クルーガー",
    "file": "assets/portraits/mark-kruger.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_MzsvGz92igg%3D%3D",
    "officialId": "k/7/e/7ezneqiabcm"
  },
  {
    "label": "雨宮太陽",
    "officialName": "雨宮 太陽",
    "file": "assets/portraits/amemiya-taiyou.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_PzcbPz92igg%3D%3D",
    "officialId": "k/b/b/bbdhqusqicm"
  },
  {
    "label": "圓堂晴",
    "officialName": "円堂 ハル",
    "file": "assets/portraits/endou-haru.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzOzs_Nz8_Oz92igg%3D%3D",
    "officialId": "k/m/v/mvcdbwn4zks"
  },
  {
    "label": "菲迪歐",
    "officialName": "フィディオ・アルデナ",
    "file": "assets/portraits/fidio-aldena.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_MzsjPz92igg%3D%3D",
    "officialId": "k/1/2/128gwjivkxk"
  },
  {
    "label": "潘恩",
    "officialName": "バーン",
    "file": "assets/portraits/burn.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzc_Nz8bPz92igg%3D%3D",
    "officialId": "k/m/d/mdglyf7jc3c"
  },
  {
    "label": "加塞爾",
    "officialName": "ガゼル",
    "file": "assets/portraits/gazel.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzc_Nz8fGz92igg%3D%3D",
    "officialId": "k/i/r/ir7gceyqjb8"
  },
  {
    "label": "虎丸",
    "officialName": "宇都宮 虎丸",
    "file": "assets/portraits/utsunomiya-toramaru.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzM_Mz8_Oz92igg%3D%3D",
    "officialId": "k/v/u/vu_2_98zume"
  },
  {
    "label": "雪村",
    "officialName": "雪村 豹牙",
    "file": "assets/portraits/yukimura-hyouga.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPy8_Pzc7Pz92igg%3D%3D",
    "officialId": "k/x/h/xhakvrbs3k0"
  },
  {
    "label": "阿爾法",
    "officialName": "アルファ",
    "file": "assets/portraits/alpha.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPys_Nz8rPz92igg%3D%3D",
    "officialId": "k/0/h/0hgoyfw7p9s"
  },
  {
    "label": "貝塔",
    "officialName": "ベータ",
    "file": "assets/portraits/beta.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzOzsbPys_Kz92igg%3D%3D",
    "officialId": "k/i/j/ijgn8lthcc8"
  },
  {
    "label": "伽馬",
    "officialName": "ガンマ",
    "file": "assets/portraits/gamma.png",
    "source": "https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPys_Nz8fPz92igg%3D%3D",
    "officialId": "k/5/g/5gofomcbgls"
  }
];
    const byName = new Map(records.map(record => [record.label, record]));
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function html(name) {
    const record = byName.get(name);
    if (!record) {
      const value=String(name).trim(),latin=value.split(/\s+/).map(part=>part.replace(/[^A-Za-z0-9]/g,'').slice(0,1)).filter(Boolean).slice(0,2).join('').toUpperCase();
      const initials=latin||[...value.replace(/[\s・]/g,'')].slice(0,2).join('')||'•';
      return '<span class="player-avatar original-player-avatar" title="'+escapeHtml(name+'｜原創選手')+'" data-portrait-name="'+escapeHtml(name)+'" aria-label="'+escapeHtml(name+' 原創選手識別圖示')+'">'+escapeHtml(initials)+'</span>';
    }
    return '<span class="player-avatar" title="' + escapeHtml(record.label + '｜' + record.officialName) + '" data-portrait-name="' + escapeHtml(name) + '" data-official-id="' + escapeHtml(record.officialId) + '"><img class="player-avatar-img" src="./' + record.file + '" width="46" height="46" alt="" decoding="async"></span>';
  }
  window.PlayerPortraits = Object.freeze({html, get: name => byName.get(name)});
  // Keep the player's name on screen if a local asset fails; never substitute another face.
  document.addEventListener('error', event => {
    const img = event.target;
    if (img.classList && img.classList.contains('player-avatar-img')) {
      img.hidden = true;
      img.parentElement.classList.add('portrait-unavailable');
      img.parentElement.setAttribute('aria-label', '頭像暫時無法顯示');
      img.parentElement.textContent = '·';
    }
  }, true);
  function addSources() {
    const app = document.querySelector('.app');
    if (!app) return;
    const path = window.location.pathname;
    const teamKeys = path.endsWith('/opponent.html') ? ['rival'] : path.endsWith('/match.html') ? ['world','rival'] : ['world'];
    const rosterNames = new Set(teamKeys.flatMap(key => (window.TEAM_DATA?.[key]?.roster || []).map(row => row[0])));
    const pageRecords = records.filter(record => rosterNames.has(record.label));
    app.insertAdjacentHTML('beforeend', '<details class="portrait-credits"><summary>角色頭像來源與姓名核對</summary><p>非官方同人戰術工具。角色圖像來源：LEVEL5 官方選手圖鑑 Inagle；角色與圖像著作權歸原權利人所有。圖片依完整姓名與角色ID一對一配對，不使用生成替代頭像。</p><div class="portrait-source-links">' + pageRecords.map(record => '<a href="' + escapeHtml(record.source) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(record.label + '｜' + record.officialName) + '</a>').join('') + '</div></details>');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addSources, {once:true});
  else addSources();
})();

