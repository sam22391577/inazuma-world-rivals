/* Verified screen appearances. A different cast is a separate historical version. */
(() => {
  'use strict';
  const rows=[
    ['inazuma-1','閃電一號','イナズマ１号','射門',['圓堂','豪炎寺'],'動畫《閃電十一人》','Inazuma_1gou','圓堂與豪炎寺同時起跳，以倒掛踢擊把兩人的力量集中到同一顆球，形成帶有雷光的射門。'],
    ['inazuma-otoshi','閃電落雷','イナズマ落とし','射門',['壁山','豪炎寺'],'動畫《閃電十一人》','Inazuma_Otoshi','壁山把豪炎寺送上高空，豪炎寺利用高度與旋轉向下踢出強力射門。'],
    ['inazuma-1-otoshi','閃電一號落雷','イナズマ１号落とし','射門',['圓堂','豪炎寺','壁山'],'動畫《閃電十一人》','Inazuma_1gou_Otoshi','壁山協助抬高起跳位置，再由圓堂與豪炎寺合踢；把閃電一號與閃電落雷串成一招。'],
    ['inazuma-break','閃電爆破','イナズマブレイク','射門',['鬼道','圓堂','豪炎寺'],'動畫《閃電十一人》／電影《GO VS 紙箱戰機 W》','Inazuma_Break','鬼道起球，圓堂與豪炎寺一同躍起，三人把雷電般的力量匯入球中，同步踢向球門。'],
    ['inazuma-break-cg','閃電爆破CG','イナズマブレイクＣＧ','射門',['鬼道','圓堂','豪炎寺'],'動畫《獵戶座》','Inazuma_Break_CG','圓堂以超級百萬噸頭槌起球，再與鬼道、豪炎寺會合，用三人同步踢擊完成強化的閃電爆破。'],
    ['twin-boost-teikoku','雙重噴射','ツインブースト','射門',['鬼道','佐久間'],'動畫《閃電十一人》・帝國搭配','Twin_Boost','鬼道把球踢向空中，佐久間用頭槌送回，鬼道再以最後一腳加速射門。'],
    ['twin-boost-raimon','雙重噴射','ツインブースト','射門',['鬼道','一之瀨'],'動畫《閃電十一人》・雷門搭配','Twin_Boost','一之瀨接下鬼道挑起的球並回送，鬼道接續重踢，以兩段配合增加球速與力量。'],
    ['twin-boost-ares','雙重噴射','ツインブースト','射門',['不動','佐久間'],'動畫《阿瑞斯》・帝國搭配','Twin_Boost','佐久間與不動接力處理同一顆球，以空中回傳配合最後踢擊，完成帝國的雙人射門。'],
    ['twin-boost-f','雙重噴射F','ツインブーストＦ','射門',['鬼道','豪炎寺'],'動畫《閃電十一人》','Twin_Boost_F','豪炎寺先踢出烈焰龍捲風，鬼道再迎球追加雙重噴射的踢擊，將火焰射門接續加速。'],
    ['penguin-2-teikoku','皇帝企鵝2號','皇帝ペンギン２号','射門',['鬼道','佐久間','寺門'],'動畫《閃電十一人》・帝國搭配','Koutei_Penguin_2gou','鬼道喚出企鵝並挑球，佐久間與寺門在空中迎球合踢，讓企鵝群隨射門飛向球門。'],
    ['penguin-2-raimon','皇帝企鵝2號','皇帝ペンギン２号','射門',['鬼道','豪炎寺','一之瀨'],'動畫《閃電十一人》・雷門搭配','Koutei_Penguin_2gou','由鬼道發動企鵝群，豪炎寺與一之瀨接應合踢，保留原作雷門版本的三人分工。'],
    ['penguin-2-someoka','皇帝企鵝2號','皇帝ペンギン２号','射門',['鬼道','染岡','一之瀨'],'動畫《閃電十一人》・真帝國戰搭配','Koutei_Penguin_2gou','鬼道起球，染岡與一之瀨一同完成空中合踢；這是對真帝國學園時實際出現的組合。'],
    ['penguin-2-fubuki','皇帝企鵝2號','皇帝ペンギン２号','射門',['鬼道','吹雪','一之瀨'],'動畫《閃電十一人》・畢業賽搭配','Koutei_Penguin_2gou','鬼道召出企鵝群，吹雪與一之瀨負責空中射門，三人以原作畢業賽的搭配進攻。'],
    ['penguin-2-movie','皇帝企鵝2號','皇帝ペンギン２号','射門',['鬼道','風丸','不動'],'電影《GO 究極之絆獅鷲獸》','Koutei_Penguin_2gou','鬼道、風丸與不動合力射出企鵝群；電影中曾以這組搭配破壞囚室，協助救出葵。'],
    ['penguin-2-orion','皇帝企鵝2號','皇帝ペンギン２号','射門',['灰崎','風丸','水神矢'],'動畫《獵戶座》・日本隊搭配','Koutei_Penguin_2gou','灰崎、風丸與水神矢在隊內練習賽使出三人企鵝射門，將後續巨鯊版本的配合先建立起來。'],
    ['penguin-2-shark-japan','皇帝企鵝2號×巨鯊','皇帝ペンギン２号feat.シャーク','射門',['灰崎','風丸','水神矢'],'動畫《獵戶座》・對義大利','Koutei_Penguin_2gou_feat._Shark','灰崎的深海巨鯊與風丸、水神矢的企鵝配合交疊，讓企鵝群環繞鯊魚般的球勢，一起衝向球門。'],
    ['penguin-2-shark-zhao','皇帝企鵝2號×巨鯊','皇帝ペンギン２号feat.シャーク','射門',['灰崎','鬼道','不動'],'動畫《獵戶座》・對獵戶座之影','Koutei_Penguin_2gou_feat._Shark','灰崎與鬼道、不動使用同一招的另一組實際搭配，結合企鵝與巨鯊的連續推進攻門。'],
    ['penguin-3','皇帝企鵝3號','皇帝ペンギン３号','射門',['鬼道','不動','佐久間'],'動畫《閃電十一人》世界大賽篇','Koutei_Penguin_3gou','鬼道、不動與佐久間從不同位置連續處理球，三人的力量與企鵝旋流一同集中後射出。'],
    ['death-zone','死亡三角','デスゾーン','射門',['鬼道','佐久間','寺門'],'動畫《閃電十一人》・帝國搭配','Death_Zone','三人以三角形站位起跳，在空中持續旋轉並同時踢球，形成帶有紫色三角軌跡的射門。'],
    ['death-zone-orion','死亡三角','デスゾーン','射門',['鬼道','不動','灰崎'],'動畫《獵戶座》・日本隊搭配','Death_Zone','鬼道、不動與灰崎在空中形成旋轉三角陣，三人同踢；也作為死亡粉碎領域的組合基礎。'],
    ['death-zone-2','死亡三角2','デスゾーン２','射門',['鬼道','圓堂','土門'],'動畫《閃電十一人》','Death_Zone_2','圓堂、鬼道與土門在空中加速三角旋轉，以三人同步踢擊把力量集中，完成雷門的強化死亡三角。'],
    ['last-death-zone','終極死亡三角','ラスト・デスゾーン','射門',['鬼道','不動','佐久間'],'電影《GO VS 紙箱戰機 W》','Last_Death_Zone','鬼道、不動與佐久間以更大的空間組織三角旋轉射門，電影中與其他射門共同破壞敵方設施。'],
    ['death-crusher-zone','死亡粉碎領域','デスクラッシャーゾーン','射門',['冰浦','鬼道','不動','灰崎'],'動畫《獵戶座》・四人覆寫連攜','Death_Crusher_Zone','冰浦先踢出冰之槍，鬼道、不動與灰崎再用死亡三角包覆射門。這招是四人接力，保留完整原作人數。'],
    ['prime-legend','至尊傳說','プライムレジェンド','射門',['鬼道','豪炎寺'],'電影《最強軍團王牙來襲》','Prime_Legend','鬼道與豪炎寺從兩側起跳，合力踢出強烈光芒包覆的射門；電影中曾接續基山的流星刀刃。'],
    ['killer-fields','殺戮領域','キラーフィールズ','進攻',['鬼道','不動'],'動畫《閃電十一人》世界大賽篇','Killer_Fields','鬼道與不動從兩側交互控球，利用旋轉氣流擾亂對手，以雙人配合突破中場封鎖。'],
    ['fire-bird','火焰風向雞','炎の風見鶏','射門',['豪炎寺','風丸'],'動畫《閃電十一人》','Honoo_no_Kazamidori','風丸以速度與旋轉協助起球，豪炎寺接續空中踢擊，把風與火焰結合成向前衝擊的射門。'],
    ['dragon-tornado','翼龍龍捲風','ドラゴントルネード','射門',['豪炎寺','染岡'],'動畫《閃電十一人》','Dragon_Tornado','染岡先以翼龍射門帶球前進，豪炎寺再追加烈焰龍捲風，讓龍形球勢披上火焰。'],
    ['crossfire','交叉火焰','クロスファイア','射門',['豪炎寺','吹雪'],'動畫《閃電十一人》','Crossfire','豪炎寺與吹雪分別注入火焰與冰雪力量，兩人從交錯角度同步踢球，形成冰火合流射門。'],
    ['the-earth','地球之歌','ジ・アース','射門',['圓堂','豪炎寺','吹雪'],'動畫《閃電十一人》','The_Earth','全隊先以傳球凝聚心意，再由圓堂、豪炎寺與吹雪完成三人射門；使用時仍需要其餘隊員配合傳導。'],
    ['jet-stream','噴射氣流','ジェットストリーム','射門',['圓堂','豪炎寺','虎丸'],'動畫《閃電十一人》世界大賽決賽','Jet_Stream','三人圍繞球高速交錯奔跑，匯成強烈氣流，再把力量集中到同一顆球完成終結射門。'],
    ['grand-fire','烈焰爆破','グランドファイア','射門',['豪炎寺','基山','虎丸'],'動畫《閃電十一人》世界大賽篇','Grand_Fire','豪炎寺、基山與虎丸同步重踢，讓球披上猛烈火焰，以三名前鋒的合力正面攻門。'],
    ['tiger-storm','猛虎風暴','タイガーストーム','射門',['豪炎寺','虎丸'],'動畫《閃電十一人》世界大賽篇','Tiger_Storm','豪炎寺的爆熱風暴與虎丸的猛虎驅動互相疊加，讓猛虎般的球勢在火焰旋流中直衝球門。'],
    ['the-birth','創世紀','ザ・バース','射門',['基山','吹雪'],'動畫《閃電十一人》世界大賽篇','The_Birth','基山與吹雪從兩側合踢，把冰與火的力量交疊為螺旋般的球勢，形成雙人強力射門。'],
    ['hurricane','颶風合擊','ザ・ハリケーン','射門',['風丸','吹雪'],'動畫《閃電十一人》世界大賽篇','The_Hurricane','風丸與吹雪以速度同步切入，讓球被強烈旋風包覆，再將風勢集中射向球門。'],
    ['thunder-beast','雷獸射門','サンダービースト','射門',['吹雪','土方'],'動畫《閃電十一人》世界大賽篇','Thunder_Beast','土方的強力起球與吹雪的高速踢擊互相接續，讓雷獸般的球勢向前衝出。原作搭檔是土方。'],
    ['big-bang','宇宙大爆炸','ビッグバン','射門',['基山','吹雪','鬼道'],'動畫《閃電十一人》世界大賽篇','Big_Bang','三人在空中匯集力量，形成巨大的能量球，再以連續踢擊把能量集中成爆發式射門。'],
    ['supernova','超新星','スーパーノヴァ','射門',['基山','八神玲名','維茲'],'動畫《閃電十一人》・創世紀搭配','Supernova','基山以古蘭身分與烏爾碧妲、維茲配合，三人將球送入空中能量場後一同踢出。此為一般合體射門。'],
    ['space-penguin','宇宙企鵝','スペースペンギン','射門',['基山','八神玲名','維茲'],'動畫《閃電十一人》・創世紀搭配','Space_Penguin','烏爾碧妲、基山與維茲在空中接力，讓企鵝群環繞球體形成宇宙般的球勢，再合力射出。'],
    ['cosmic-blaster','宇宙爆破','コズミックブラスター','射門',['基山','吉良'],'動畫《阿瑞斯》・基山達也與吉良廣人','Cosmic_Blaster','基山達也與吉良廣人同步踢擊，把流星刀刃與大爆炸的意象交疊，形成雙人宇宙射門。'],
    ['god-devil','神魔企鵝','ペンギン・ザ・ゴッド＆デビル','射門',['灰崎','吉良'],'動畫《獵戶座》','Penguin_The_God_%26_Devil','灰崎與吉良分別帶出惡魔與神明意象的企鵝，兩種球勢交會後合力踢出。'],
    ['ggg-aria','GGG線上詠嘆調','ＧＧＧ線上のアリア','射門',['阿芙洛蒂','吉良','岩戶'],'動畫《獵戶座》','GGG_Senjou_no_Aria','岩戶建立起跳支點，阿芙洛蒂與吉良接力完成帶有舞台表演感的三人射門，利用獨特節奏進攻。'],
    ['perseus-orb','珀爾修斯之玉','ペルセウスオーブ','射門',['灰崎','一之瀨','可萊里昂'],'動畫《獵戶座》最終戰','Perseus_Orb','灰崎、一之瀨與可萊里昂在空中接力，讓球沿圓弧匯合，再以三人的配合集中攻向球門。'],
    ['last-resort','最終保留','ラストリゾート','射門',['明日人','灰崎','野坂'],'動畫《獵戶座》・三人繼承搭配','Last_Resort_(anime)','三人共同重現豪炎寺傳下的最終保留，依序把力量送入同一顆球。此處保留動畫實際使用的三人版本。'],
    ['last-resort-sigma','最終保留Σ','ラストリゾートΣ','射門',['明日人','灰崎','野坂','一星'],'動畫《獵戶座》・四人完成版','Last_Resort_%CE%A3','一星加入後補上原本三人配合的缺口，四人依序處理球並共同完成最終保留。這招需要四人，並非原創三人技。'],
    ['white-double','白色雙重衝擊','ホワイトダブルインパクト','射門',['吹雪','敦也'],'動畫《阿瑞斯》','White_Double_Impact','吹雪兄弟在空中互相配合，以雙人同踢形成冰雪包覆的射門，保留士郎與敦也的兄弟組合。'],
    ['triple-blizzard','三重暴風雪','トリプルブリザード','射門',['吹雪','敦也','白兔屋奈繪'],'動畫《阿瑞斯》','Triple_Blizzard','吹雪兄弟與奈繪三人合踢，以冰雪與旋轉交織成大型暴風雪，將球送向球門。'],
    ['glacial-gungnir','冰結永恆之槍','氷結のグングニル','射門',['吹雪','敦也'],'動畫《獵戶座》','Hyouketsu_no_Gungnir','士郎引出極光與冰雪，敦也在最後接力重踢，讓球如冰槍般直線貫向球門。'],
    ['polar-bear-2','北極熊2號','ポーラーベア２号','射門',['阿芙洛蒂','明日人','紀香'],'動畫《獵戶座》','Polar_Bear_No._2','三人依序把球送上高空，再同時完成踢擊；巨大的北極熊球勢隨冰雪旋轉衝向球門。'],
    ['wyvern-blizzard','翼龍暴風雪','ワイバーンブリザード','射門',['吹雪','染岡'],'動畫《閃電十一人》','Wyvern_Blizzard','染岡的翼龍球勢與吹雪的永恆暴風雪合流，冰雪環繞龍形射門，形成雙人連攜。'],
    ['tri-pegasus','三重天馬','トライペガサス','射門',['一之瀨','圓堂','土門'],'動畫《閃電十一人》','Tri-Pegasus','一之瀨、圓堂與土門以精準節奏交換位置，三人共同起跳合踢，重現三重天馬的連攜。'],
    ['phoenix-raimon','不死鳥','ザ・フェニックス','射門',['一之瀨','圓堂','土門'],'動畫《閃電十一人》／電影《最強軍團王牙來襲》','The_Phoenix','由一之瀨、圓堂與土門連續交換位置，再將力量集中成火鳥般的射門，是三重天馬延伸的配合。'],
    ['phoenix-reloaded','不死鳥','ザ・フェニックス','射門',['一之瀨','風丸','土門'],'動畫特別篇《Reloaded》','The_Phoenix','一之瀨、風丸與土門以雷門對巴塞隆納之珠時的搭配起跳，合力踢出火鳥球勢。'],
    ['phoenix-orion','不死鳥','ザ・フェニックス','射門',['一之瀨','馬克','土門'],'動畫《獵戶座》・美國隊搭配','The_Phoenix','一之瀨、馬克與土門在空中協作，把三人的力量匯成火鳥般的球勢，保留獵戶座美國隊版本。'],
    ['unicorn-boost','獨角獸增壓','ユニコーンブースト','射門',['馬克','迪蘭'],'動畫《閃電十一人》世界大賽篇','Unicorn_Boost','馬克與迪蘭以同步動作合力起球、射門，讓球帶著獨角獸般的力量向前衝擊。'],
    ['gran-fenrir','巨狼芬里爾','グランフェンリル','射門',['馬克','迪蘭','一之瀨'],'動畫《閃電十一人》世界大賽篇','Gran_Fenrir','一之瀨與迪蘭把球送向空中，馬克再躍起完成最後踢擊，讓巨狼般的力量伴隨球勢前進。'],
    ['icarus','伊卡洛斯','ジ・イカロス','進攻',['土門','馬克'],'動畫《閃電十一人》世界大賽篇','The_Icarus','土門與馬克以雙人空中配合改變行進路線，利用伊卡洛斯般的飛行意象突破對方防守。'],
    ['fire-blizzard','冰火暴風','ファイアブリザード','射門',['潘恩','加塞爾'],'動畫《閃電十一人》・混沌搭配','Fire_Blizzard','潘恩的火焰與加塞爾的冰雪同時注入球中，兩人合踢形成相互交織的冰火射門。'],
    ['omega-attack','最終攻擊','オメガアタック','射門',['阿爾法','貝塔','伽馬'],'動畫《閃電十一人GO 時空之石》・射門指令24','Omega_Attack','阿爾法、貝塔與伽馬從三個方向踢出性質不同的球勢，使三道射線在中央交會，形成歐米伽三人合體射門。'],
    ['chaos-break','混沌炸裂','カオスブレイク','射門',['阿芙洛蒂','潘恩','加塞爾'],'動畫《閃電十一人》・火焰神龍搭配','Chaos_Break','潘恩與加塞爾先完成冰火合流，阿芙洛蒂再從中央加入，三人共同完成混沌炸裂。'],
    ['asura','阿修羅','ザ・アシュラ','防守',['圓堂','西蔭','沙木沼治'],'動畫《獵戶座》亞洲區決賽','The_Asura','圓堂的風神雷神幽靈結合西蔭王家之盾與沙木沼治鑽頭粉碎，形成六臂守門防線；屬一般合體守門技。'],
    ['kamakura-d','鎌倉D','ＫＡＭＡＫＵＲＡ Ｄ','防守',['西蔭','水神矢','基山'],'動畫《獵戶座》・對巴西','KAMAKURA_D','西蔭、水神矢與基山達也在門前配合，組成冰屋般的守門結構，三人一同抵擋強力射門。'],
    ['perfect-tower','完美高塔','パーフェクト・タワー','防守',['綱海','塔子','小暮'],'動畫《閃電十一人》','Perfect_Tower','綱海、塔子與小暮依序疊出高塔般的防守構造，利用三人協作攔下來球。'],
    ['tatsumaki-otoshi','龍捲墜擊','たつまきおとし','射門',['壁山','風丸'],'動畫《閃電十一人》世界大賽篇','Tatsumaki_Otoshi','壁山把風丸送上高空，風丸以高速旋轉匯聚龍捲風，最後從高處把球踢向球門。'],
    ['deep-jungle','深層叢林','ディープジャングル','防守',['風丸','壁山','佐久間'],'電影《GO VS 紙箱戰機 W》','Deep_Jungle','風丸、壁山與佐久間合力構成叢林般的阻擋區域，以三人防線抵擋對方的強力攻擊。'],
    ['joker-rains','小丑之雨','ジョーカーレインズ','射門',['神童','劍城'],'電影《GO 究極之絆獅鷲獸》','Joker_Rains','神童與劍城在空中連續踢擊，讓光線與雨幕般的球勢交會，完成雙人射門。'],
    ['evolution','進化','エボリューション','射門',['天馬','神童','劍城'],'電影《GO 究極之絆獅鷲獸》','Evolution','神童與劍城的小丑之雨加入天馬的音速之風，三人在空中接續踢擊，形成新的三人合體射門。'],
    ['fire-tornado-dd','烈焰龍捲風DD','ファイアトルネードＤＤ','射門',['豪炎寺','劍城'],'電影《超次元夢幻比賽》・指定搭配','Fire_Tornado_DD','豪炎寺與劍城同時旋轉起跳，以完全同步的烈焰踢擊合射。本站採用電影中兩人實際使用的搭配。'],
    ['fire-tornado-tc','烈焰龍捲風TC','ファイアトルネードＴＣ','射門',['黃名子','天馬','劍城'],'電影《GO VS 紙箱戰機 W》','Fire_Tornado_TC','天馬與劍城同步完成雙人火焰旋踢，黃名子再從另一角度加入重踢，形成三人烈焰射門。'],
    ['zero-magnum','零式麥格農','ゼロマグナム','射門',['白龍','修'],'電影《GO 究極之絆獅鷲獸》','Zero_Magnum','白龍與修在空中同時蓄力，以光與暗交疊的雙人踢擊射門；不使用兩人的融合化身。'],
    ['earth-infinity','地球之歌∞','ジ・アース∞','射門',['天馬','神童','劍城'],'動畫《GO 銀河》最終戰','The_Earth_%E2%88%9E','天馬、神童與劍城承接眾人的心意，三人共同合踢，讓球以無限循環般的能量衝向球門。屬一般合體射門。'],
    ['kattobi-defense','飛躍防守','かっとびディフェンス','防守',['信助','狩屋'],'動畫《GO》第31話','Kattobi_Defense','狩屋協助信助向上彈跳，信助再以全身力量阻擋來球，用兩人的配合擴大攔截高度。'],
    ['black-dawn','黑暗黎明','ブラックドーン','射門',['天馬','瞬木'],'動畫《GO 銀河》第41話','Black_Dawn','天馬與瞬木利用兩人不同的動作節奏合踢，將黑暗與光芒交疊成強力射門；這裡保留動畫的天馬搭配。'],
    ['haru-inazuma-break','閃電爆破','イナズマブレイク','射門',['圓堂晴','月影蓮','星村ナオ'],'遊戲《英雄之路》劇情・另列遊戲搭配','Inazuma_Break','圓堂晴與月影蓮、星村ナオ在遊戲劇情中完成新世代閃電爆破。此版本明確列為遊戲資料，不冒充動畫或電影出場。','遊戲']
  ];
  const removedIds=new Set(['inazuma-1','inazuma-1-otoshi','inazuma-break-cg','wyvern-blizzard','tri-pegasus','phoenix-raimon','phoenix-reloaded','phoenix-orion','death-zone-2','the-earth','jet-stream']);
  const officialNames=Object.freeze({
    'white-double':'真白雙重衝擊','kamakura-d':'鐮倉維度','evolution':'進化射球',
    'earth-infinity':'永恆地球'
  });
  const all=rows.filter(([id])=>!removedIds.has(id)).map(([id,name,jp,type,members,work,page,desc,media])=>Object.freeze({id,name:officialNames[id]||name,jp,type,members:Object.freeze(members),work,source:'https://inazuma-eleven.fandom.com/wiki/'+page,desc,media:media||(/電影/.test(work)?'電影':'動畫'),group:'原作',origin:'原作'}));
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const forTeam=roster=>all.filter(c=>c.members.some(n=>roster.includes(n)));
  // Endou's active set prioritizes three-person cooperative goalkeeping.
  // Historical source records stay immutable; roster-specific displays use this plan.
  const endouCombos=Object.freeze([
  [
    "endou-royal-ring",
    "神掌王環",
    "防守",
    [
      "圓堂",
      "西蔭",
      "立向居"
    ],
    "神之手",
    "西蔭以王家之盾的紋章穩住兩側，立向居把無限之手的層疊掌影注入中央，圓堂展開神之手。三人同步向前合推，將護盾與掌影連成同一面巨掌，一起承受並收住射門。"
  ],
  [
    "endou-frost-shield",
    "神掌霜盾",
    "防守",
    [
      "圓堂",
      "西蔭",
      "吹雪"
    ],
    "神之手",
    "吹雪將冰晶凝成掌面的稜線，西蔭用王家之盾固定掌根，圓堂展開神之手與兩人同時向前推進。三股力量在同一接球面匯合，冰霜卸去旋轉，王盾分散衝擊，巨掌共同合攏接球。"
  ],
  [
    "endou-frost-arms",
    "魔神霜臂",
    "防守",
    [
      "圓堂",
      "立向居",
      "吹雪"
    ],
    "魔神",
    "吹雪以冰雪狼影包住球路，立向居將魔王之手的掌力送向中央，圓堂展開魔神雙臂。三人在同一拍合攏，讓霜流、掌力與臂影共同壓住來球，避免力量集中在單一守門員身上。"
  ],
  [
    "endou-star-ring",
    "神掌星環",
    "防守",
    [
      "圓堂",
      "西蔭",
      "水神矢"
    ],
    "神之手",
    "水神矢以五芒星領域圈定接球點，西蔭把王家紋章連接星角，圓堂在中央展開神之手。三人同時收緊星環，從五個方向分擔球勢，再以巨掌、王盾和星域共同鎖住來球。"
  ],
  [
    "endou-vacuum-wall",
    "魔神空壁",
    "防守",
    [
      "圓堂",
      "立向居",
      "飛鷹"
    ],
    "魔神",
    "飛鷹以真空魔牽引來球，立向居展開無限之手的層疊掌影，與圓堂的魔神雙臂同時向內合攏。三人的力量集中在同一接球點，以真空降低球勢，層疊掌影與雙臂合力承受殘餘衝擊。"
  ],
  [
    "endou-wind-ring",
    "神掌風輪",
    "防守",
    [
      "圓堂",
      "立向居",
      "風丸"
    ],
    "神之手",
    "風丸捲起疾風環繞球路，立向居把無限之手的掌影鋪在風輪內側，圓堂將神之手推向中央。三人同步收攏，氣流分散側旋，掌影補住邊緣，合力將偏轉球路帶入巨掌接球面。"
  ],
  [
    "endou-star-wall",
    "魔神星壁",
    "防守",
    [
      "圓堂",
      "水神矢",
      "飛鷹"
    ],
    "魔神",
    "水神矢將五芒星領域連成護臂框架，飛鷹以真空魔推動向內的氣流，圓堂展開魔神雙臂。三人共同把射門壓在星形交點，讓星域、真空與臂影同時分擔正面衝擊，合力封住強力直射。"
  ],
  [
    "endou-snow-gale",
    "神掌雪嵐",
    "防守",
    [
      "圓堂",
      "吹雪",
      "風丸"
    ],
    "神之手",
    "吹雪將冰雪繞成球體外環，風丸用疾風固定雪流方向，圓堂展開神之手。三人同步推進，冰雪與風環把球勢導入掌面，最後一同向內收攏，合力處理高速旋轉與變向射門。"
  ],
  [
    "endou-raimon-blast",
    "雷門閃爆",
    "射門",
    [
      "圓堂",
      "鬼道",
      "豪炎寺"
    ],
    "雷門",
    "鬼道以雷門式三角進攻挑球，圓堂前插後只用一次觸球把球回送至中央，豪炎寺沿閃電形跑位注入赤炎。三人在交會點同步合踢，將傳球節奏、火焰推力與雷門全隊向前的氣勢匯成金藍色閃光射門。"
  ],
  [
    "endou-penguin-flare",
    "炎陣企鵝",
    "射門",
    [
      "圓堂",
      "鬼道",
      "豪炎寺"
    ],
    "企鵝與火焰",
    "鬼道召出企鵝群引導球的逆旋，豪炎寺從外側疊上爆熱火焰，圓堂在兩人之間負責空中接力與改變落點。三人追上重新落下的球後同步踢擊，讓企鵝旋流包住炎陣並向球門集中突進。"
  ],
  [
    "endou-triangle-drive",
    "三角爆熱",
    "射門",
    [
      "圓堂",
      "鬼道",
      "豪炎寺"
    ],
    "三角與爆熱",
    "鬼道設計三段三角換位，以連續回傳拉開防線；圓堂只負責中間接應，將球送到豪炎寺的爆熱射線上。豪炎寺先提供火焰推力，三人再從三個方向共同踢擊，使球在門前收緊旋轉並高速急墜。"
  ]
].map(([id,name,type,members,themeElement,desc])=>Object.freeze({id,name,type,members:Object.freeze(members),themeElement,desc,origin:'原創',group:type==='防守'?'守門合體':'主角群',keeperPlan:true,endouSupport:type==='射門'})));
  // Aphrodi has one two-person shot per forward and exactly two three-person shots.
  const aphrodiCombos=Object.freeze([
    ['aphrodi-flame-ring','聖翼炎環',['阿芙洛蒂','豪炎寺'],'神光與火焰','阿芙洛蒂以神之真知的光翼圈住球體，豪炎寺將烈焰龍捲風的赤炎注入環內。兩人同步旋身合踢，光環約束火焰的擴散，將炎流收成沿直線推進的雙翼射門。'],
    ['aphrodi-shark-fang','天罰鯊牙',['阿芙洛蒂','灰崎'],'神光與巨鯊','灰崎以深海巨鯊的鯊牙旋流壓住球心，阿芙洛蒂從外側展開金色光翼。兩人交錯起跳後同踢，鯊影沿光翼形成的軌道突進，以明暗交替的球勢攻擊防守接合處。'],
    ['aphrodi-dark-blade','光翼魔刃',['阿芙洛蒂','劍城'],'神光與魔劍','阿芙洛蒂將神之突破的光芒壓成兩片羽翼，劍城以死亡之劍的斬擊把球送入中央。兩人同時出腳，讓光翼穩定暗色劍鋒的方向，將合力集中於狹窄的切入面。'],
    ['aphrodi-dragon-wheel','神龍天輪',['阿芙洛蒂','白龍'],'神光與白龍','白龍以巨龍爆射的龍形氣流托起足球，阿芙洛蒂把神之真知的光翼接在龍身兩側。兩人迎球合踢，使龍流繞成天輪後收緊前衝，在門前由弧線轉為集中直射。'],
    ['aphrodi-star-burst','神諭星爆',['阿芙洛蒂','吉良'],'神光與星爆','吉良把大爆炸的星核壓入球心，阿芙洛蒂以光翼包住外層。兩人同步踢出，羽翼先引導球路切向死角，再於接近守門技時收攏，讓星核與神光在同一點爆發。'],
    ['aphrodi-flame-dragon','炎翼聖龍',['阿芙洛蒂','豪炎寺','白龍'],'神光、火焰與白龍','白龍以龍形氣流建立射線，豪炎寺用赤炎包覆龍身，阿芙洛蒂以光翼穩定旋轉。三人同時躍起合踢，把龍流、火焰與神光匯成同一股推力，形成正面突破的炎龍射門。'],
    ['aphrodi-star-blade','星刃神諭',['阿芙洛蒂','吉良','劍城'],'神光、星爆與魔劍','吉良以大爆炸凝聚星核，劍城用死亡之劍的暗刃切出前進軸線，阿芙洛蒂把光翼覆在兩側。三人從不同角度同步合踢，光翼維持方向、劍鋒切入防線，星核在接合處集中爆發。']
  ].map(([id,name,members,themeElement,desc])=>Object.freeze({id,name,type:'射門',members:Object.freeze(members),themeElement,desc,origin:'原創',group:'前鋒群',aphrodiPlan:true})));
  const worldPlanACombos=Object.freeze([
    ['original-infinite-dimension','三界神門','防守',['圓堂','西蔭','立向居'],'三重光門','西蔭將金色守門能量送入圓堂左肩，立向居把層疊掌力注入圓堂右肩；圓堂的守護意志則成為中央核心。三股力量在他身前誕生三道嶄新的光門，射門每穿過一層便被削去速度、旋轉與威力，最後由圓堂在第三道門前將球封住。'],
    ['original-justice-vacuum-wall','雷霆鎮界','防守',['圓堂','西蔭','立向居'],'三色雷霆','西蔭與立向居分別把防守力量集中到圓堂雙臂，與圓堂自身的雷電氣息融合成金、紫、藍三色雷霆。圓堂踏前一步將雙拳同時轟向地面，三色電流沿球門區升起弧形衝擊壁，把射門定在半空後反向震離球門。'],
    ['original-aurora-god-catch','永恆聖域','防守',['圓堂','西蔭','立向居'],'三重守護領域','西蔭提供穩固外層，立向居提供連續增幅，兩股力量在圓堂體內與守護意志完全融合。圓堂張開雙臂後，一座覆蓋整個球門的球形聖域由他向外展開；進入領域的射門被固定在空中，圓堂收攏雙掌便能將球連同衝擊一併封印。'],
    ['original-royal-giant-shield','王者巨盾','防守',['西蔭','壁山'],'王盾與巨山','壁山以巨山般的身軀建立第一道牆，西蔭在牆後張開王者之盾。前層把射門導向中央，後層將剩餘衝擊擴散到整面盾上。'],
    ['original-pentagram-vacuum','五角真空','防守',['水神矢','飛鷹'],'五芒星與真空','水神矢用五芒星領域鎖定持球者的五條出路，飛鷹沿唯一留下的球路踢出真空斬。星形封鎖與氣壓衝擊同時收合，乾淨切斷控球。'],
    ['original-aurora-gale','極光疾風','射門',['吹雪','風丸'],'冰雪與疾風','風丸高速繞行拉出青色旋風，吹雪讓冰晶沿氣流凝成極光。兩人從相反方向交叉踢擊，球在極光風帶中高速轉彎攻向遠角。'],
    ['original-emperor-concerto','皇帝協奏曲','射門',['鬼道','神童','灰崎'],'企鵝與音律','鬼道以企鵝群引導逆旋，神童用三段節拍控制加速，灰崎在終拍加入兇猛重踢。三人的球勢像協奏曲般逐拍增強，最後集中貫穿球門。'],
    ['original-royal-shark-fang','王者鯊牙','射門',['野坂','灰崎'],'王者與巨鯊','野坂先以月牙弧線引開守門員重心，灰崎讓深海巨鯊沿弧線內側追上足球。兩人同步補上最後一腳，使王冠般的外旋包住鯊牙直擊死角。'],
    ['original-wind-god-mach','風神馬赫','射門',['風丸','天馬'],'雙重疾風','風丸從外側拉出高速風道，天馬在中央疊上馬赫級上升氣流。兩人沿不同高度同時踢球，雙重旋風先拉升、再突然下墜。'],
    ['original-stardust-meteor','星塵流星','射門',['一星','基山'],'星塵與流星','一星以藍色星塵標定最難防守的飛行軌道，基山用流星般的重踢把力量灌入球心。星塵外環持續修正方向，讓射門在門前收束成直線。'],
    ['original-divine-star-judgment','神星裁決','射門',['阿芙洛蒂','一星','吉良'],'神光與星爆','一星先計算三道星軌的交會點，吉良將爆發力壓入球心，阿芙洛蒂由上方展開神聖光翼。三人同踢後，星核沿光翼引導的軌道在球門前集中爆發。'],
    ['original-celestial-starburst','天界星爆','射門',['吉良','阿芙洛蒂'],'星核與光翼','吉良將爆發力壓縮成星核，阿芙洛蒂用金色光翼包覆球體並穩定旋轉。兩人交叉起跳後同步合踢，使足球化為帶翼流星；光翼將飛行力量收束到球心，在球門前形成集中的星光爆發。'],
    ['original-polar-twin-fangs','極地雙牙','射門',['敦也','灰崎'],'冰熊利爪與深海鯊牙','敦也以熊之殺手般的斬擊捲起冰雪，凝成冰熊利爪；灰崎從另一側帶出深海巨鯊的暗色鯊牙。兩人交叉起跳並同時重踢，讓冰爪與鯊牙沿球體兩側交錯突進，以雙重咬擊集中突破防守。'],
    ['original-explosive-flame-shark','爆炎巨鯊','射門',['灰崎','豪炎寺'],'深海巨鯊與爆熱火焰','灰崎先踢出深海巨鯊般的暗色旋流，豪炎寺從反方向注入爆熱火焰。兩人追上旋轉中的足球同步重踢，使巨鯊披上赤紅烈焰；鯊牙球勢先壓住防守接觸面，火焰再向同一點集中爆發。'],
    ['original-bipolar-blizzard-spear','雙極暴雪之槍','射門',['吹雪','敦也'],'暴雪與冰雪長槍','吹雪以純白雪流塑造長槍的槍身，敦也用高速斬擊凝結出深藍色槍尖。兄弟兩人從左右交叉踢球，讓兩股暴雪旋轉纏繞，融合成白藍相間的巨大冰雪長槍；外層雪流擾動守門技的接觸面，內層槍尖將兩人的力量集中於單一突破點。'],
    ['original-blazing-white-hurricane','爆熱白颶風','射門',['豪炎寺','白龍'],'爆熱與白龍','白龍以白色颶風建立龍形主軸，豪炎寺從外側纏上爆熱火焰。兩人追上旋轉中的足球同步合踢，讓赤白炎龍以持續加速的球勢正面突進。'],
    ['original-ice-fang-demon-sword','冰牙魔劍','射門',['吹雪','劍城'],'冰狼與魔劍','吹雪把暴風雪凝成冰狼獠牙，劍城從中央斬入暗色劍鋒。兩人交叉合踢後，冰牙先凍住阻擋面，魔劍再從裂縫集中突破。'],
    ['original-white-dark-twin-blades','白暗雙刃','射門',['劍城','白龍'],'光與暗雙刃','白龍將白色颶風壓成光刃，劍城從反方向劈出暗色劍鋒。兩人同時斬向球心，雙刃交錯後合成不斷收窄的直進射門。'],
    ['original-aurora-bear-slash','極光熊斬','射門',['吹雪','敦也','白龍'],'冰雪、熊斬與白龍','吹雪捲起極光暴風雪，敦也以熊之殺手的斬擊把冰流切成利爪，白龍在中央固定飛行軸。三人同步重踢，極光、熊爪與龍流在門前合而為一。'],
    ['original-obsidian-dawn','黑曜曙光','射門',['黑瀨','豪炎寺'],'黑曜核心與曙光烈焰','黑瀨先把足球的旋轉與飛行軸壓縮成黑曜般的核心，豪炎寺再從外層注入爆發性烈焰。兩人交錯起跳後，黑瀨主動把最後的力量控制交給豪炎寺；黑色球核在赤紅曙光中破裂，化為由暗轉明的直進射門。'],
    ['original-obsidian-final-star','黑曜終星','射門',['黑瀨','基山','一星'],'軌道加速與中心貫穿','黑瀨將足球垂直挑起，基山與一星分別從左右踢中球體邊緣，使足球沿預定的橢圓軌道高速繞行。黑瀨站在軌道中央等待力量平衡，在最後一圈正面踢穿中心，將環繞力量全部轉為直線推進；黑色星體的雙重光環在門前向內崩塌，令射門再次加速。'],
    ['original-triple-severance','三重斷界','防守',['黑瀨','壁山','飛鷹'],'三段接觸卸力','黑瀨預先指出三個連續接觸位置。壁山在第一點撞擊足球下方，把直線衝擊轉向上方；飛鷹在第二點以側向踢擊消除旋轉；黑瀨最後沿殘餘力量的反方向踢中球側，使衝力向左右分散。射門每穿過一道黑色斷層便減速一次，再交由守門員處理。'],
    ['original-silent-hunting-ground','無聲獵場','防守',['黑瀨','水神矢','風丸'],'假出口與集體換位','黑瀨故意讓出中央通道，引導持球者進入預定區域；水神矢與風丸則在左右後方交叉換位，不斷改變傳球與突破出口。當所有路線在中央閉合，水神矢封住傳球、風丸切斷退路，黑瀨完成最後奪球並立刻帶動反擊。'],
    ['original-frozen-ambush','極寒伏獵','防守',['黑瀨','敦也'],'冰面封路與交叉奪球','黑瀨刻意退開並留下假突破口，再以手勢指定敦也的衝刺位置。敦也從側前方高速切入，踏地掀起向內收縮的冰層，使足球逐漸偏向黑瀨。兩人從球的兩側交叉而過，敦也壓迫持球者重心，黑瀨則在錯身瞬間勾走足球；黑色軌跡與冰藍裂紋隨即閉合成伏擊圖案。'],
    ['original-triple-commanders','三重司令塔','進攻',['鬼道','野坂','神童'],'三司令連攜','鬼道設計傳球陷阱，神童控制推進節拍，野坂即時計算防線反應。三名司令塔輪流成為持球核心，讓對手無法判斷真正的發動點。']
  ].map(([id,name,type,members,themeElement,desc])=>Object.freeze({id,name,type,members:Object.freeze(members),themeElement,group:'原創合體',desc,origin:'原創'})));
  const preferredVersion=Object.freeze({
    world:Object.freeze({'雙重噴射':'twin-boost-world','皇帝企鵝2號':'penguin-2-orion','皇帝企鵝2號×巨鯊':'penguin-2-shark-japan'}),
    rival:Object.freeze({'雙重噴射':'twin-boost-ares','皇帝企鵝2號':'penguin-2-movie','不死鳥':'phoenix-orion'})
  });
  function uniqueMoveNames(items,names){
    const team=names.includes('鬼道')?'world':names.includes('不動')?'rival':null;
    const preferred=team?preferredVersion[team]:{};
    const selected=new Map();
    for(const item of items){
      const current=selected.get(item.name),wanted=preferred[item.name];
      if(!current||item.id===wanted&&current.id!==wanted||current.unresolved?.length&&!item.unresolved?.length)selected.set(item.name,item);
    }
    return items.filter(item=>selected.get(item.name)===item);
  }
  const worldRoster=Object.freeze(['圓堂','西蔭','立向居','吹雪','水神矢','飛鷹','風丸','壁山','野坂','鬼道','神童','天馬','基山','阿芙洛蒂','一星','黑瀨','豪炎寺','灰崎','劍城','白龍','吉良','敦也']);
  const isWorldRoster=roster=>worldRoster.every(name=>roster.includes(name))&&roster.length===worldRoster.length;
  function worldPlayable(roster){
    const specs=[
      ['inazuma-otoshi',null,null,['壁山','豪炎寺']],
      ['inazuma-break',null,null,['鬼道','風丸','豪炎寺']],
      ['twin-boost-f',null,null,['鬼道','豪炎寺']],
      ['penguin-2-fubuki','penguin-2-world-kidou','皇帝企鵝2號（鬼道版）',['鬼道','灰崎','豪炎寺']],
      ['penguin-2-shark-japan',null,null,['灰崎','風丸','水神矢']],
      ['penguin-3',null,null,['鬼道','野坂','神童']],
      ['last-death-zone',null,null,['鬼道','野坂','神童']],
      ['death-crusher-zone',null,null,['鬼道','灰崎','水神矢','神童']],
      ['prime-legend',null,null,['鬼道','豪炎寺']],
      ['killer-fields',null,null,['鬼道','野坂']],
      ['fire-bird',null,null,['豪炎寺','風丸']],
      ['dragon-tornado',null,null,['豪炎寺','白龍']],
      ['crossfire',null,null,['豪炎寺','吹雪']],
      ['grand-fire',null,null,['豪炎寺','基山','敦也']],
      ['tiger-storm',null,null,['豪炎寺','敦也']],
      ['the-birth',null,null,['吹雪','基山']],
      ['hurricane',null,null,['吹雪','風丸']],
      ['thunder-beast',null,null,['吹雪','壁山']],
      ['big-bang',null,null,['吹雪','基山','鬼道']],
      ['cosmic-blaster',null,null,['基山','吉良']],
      ['god-devil',null,null,['灰崎','吉良']],
      ['ggg-aria',null,null,['阿芙洛蒂','吉良','壁山']],
      ['perseus-orb',null,null,['灰崎','神童','白龍']],
      ['last-resort-sigma',null,null,['野坂','灰崎','一星','天馬']],
      ['white-double',null,null,['吹雪','敦也']],
      ['triple-blizzard',null,null,['吹雪','敦也','白龍']],
      ['glacial-gungnir',null,null,['吹雪','敦也']],
      ['polar-bear-2',null,null,['阿芙洛蒂','天馬','西蔭']],
      ['chaos-break',null,null,['阿芙洛蒂','豪炎寺','吹雪']],
      ['kamakura-d',null,null,['西蔭','水神矢','基山']],
      ['tatsumaki-otoshi',null,null,['壁山','風丸']],
      ['deep-jungle',null,null,['風丸','壁山','飛鷹']],
      ['joker-rains',null,null,['神童','劍城']],
      ['evolution',null,null,['天馬','神童','劍城']],
      ['fire-tornado-dd',null,null,['豪炎寺','劍城']],
      ['fire-tornado-tc',null,null,['天馬','劍城','白龍']],
      ['zero-magnum',null,null,['白龍','劍城']],
      ['earth-infinity',null,null,['天馬','神童','劍城']],
      ['black-dawn',null,null,['劍城','灰崎']]
    ];
    const worldDescriptions={
      'inazuma-break':'鬼道將足球挑向空中，鬼道、風丸與豪炎寺全身纏繞雷電並同時躍起。三人從不同方向同步踢中球心，將力量集中成一道強烈雷光射向球門；招式動作與雷電演出維持動畫原有的閃電爆破。',
      'penguin-2-world-kidou':'鬼道召出企鵝群並完成起球，灰崎與豪炎寺從左右兩側同步凌空合踢，讓企鵝群沿雙重旋流加速攻向球門。',
      'penguin-3':'鬼道安排起球路線，野坂校準攻門角度，神童統一三人的踢擊節拍；企鵝旋流在三次接力後集中射出。',
      'last-death-zone':'鬼道負責起球，野坂與神童沿外側擴大三角旋轉；三人在最高速時同步合踢，完成終極死亡三角。',
      'death-crusher-zone':'水神矢先以五角星領域固定射線，鬼道、灰崎與神童再從三個方向形成旋轉三角陣；四人接力把球勢層層壓縮後射向球門。',
      'killer-fields':'鬼道與野坂交互控球並同步改變節奏，利用旋轉氣流與假動作擾亂對手，在兩人設計的空隙中突破中場。',
      'dragon-tornado':'白龍以白色颶風托起龍形氣流，豪炎寺再從外側注入烈焰龍捲風；兩人迎球合踢，讓白色龍流披上火焰。',
      'grand-fire':'豪炎寺建立火焰主軸，基山以流星般的踢擊加速，敦也從第三角度補上重擊；三股力量匯成烈焰爆破。',
      'tiger-storm':'豪炎寺以爆熱火焰包覆足球，敦也用熊之殺手的斬擊從另一側加入；兩人同步合踢，使火焰與冰冷斬流交疊成猛虎般的衝擊。',
      'thunder-beast':'壁山以強壯身軀把球送上高空，吹雪沿球路高速起跳並注入冰狼力量；兩人接力重踢，形成雷獸般的球勢。',
      'ggg-aria':'壁山建立穩固的起跳支點，阿芙洛蒂與吉良依節奏接力踢擊；三人的動作如舞台詠嘆調般連成一體。',
      'perseus-orb':'灰崎先賦予球暗色旋轉，神童用節拍控制空中接力，白龍從最後一角度收束力量；三道弧線匯成珀爾修斯之玉。',
      'last-resort-sigma':'野坂、灰崎、一星與天馬分別從四個方向依序注入力量，再於最後一拍同步完成踢擊，形成四人完整版的最終保留Σ。',
      'triple-blizzard':'吹雪與敦也從兩側注入冰雪旋流，白龍以白色颶風穩定中央軸線；三人同步合踢，形成大型三重暴風雪。',
      'glacial-gungnir':'吹雪引出極光與冰雪，敦也以熊之殺手般的重踢接力；兩股寒流沿同一軸線收束，化成冰槍直貫球門。',
      'polar-bear-2':'阿芙洛蒂以神光起球，天馬用旋風抬高球路，西蔭從後方補上最後推力；三人同步踢擊，讓巨大北極熊球勢隨冰雪衝向球門。',
      'chaos-break':'豪炎寺與吹雪士郎分別以火焰和冰雪力量將足球送上空中，阿芙洛蒂從中央加入。三人同時躍起踢中足球，使火焰、冰雪與神聖力量在球心碰撞，化為混沌能量直衝球門；三人合體結構與動畫原有演出保持一致。',
      'deep-jungle':'風丸以速度封住外圍，壁山建立中央屏障，飛鷹用真空魔切斷最後出路；三層防線收攏成深層叢林。',
      'fire-tornado-tc':'天馬以旋風抬高足球，劍城與白龍從兩側加入火焰斬擊與白色颶風；三人在同一拍合踢，完成烈焰龍捲風TC。',
      'zero-magnum':'白龍以白色光流托住球體，劍城以死亡斬擊的暗色劍鋒壓入另一側；兩人同步合踢，讓光與暗交疊成零式麥格農。',
      'evolution':'神童與劍城先以小丑之雨建立雙人球勢，天馬再以馬赫暴風加入；三人在空中接續踢擊，完成進化射球。',
      'black-dawn':'劍城以倒掛之劍拉出明亮的上升軌跡，灰崎用深海巨鯊的暗色旋流從另一側合流；兩人同步踢出黑暗黎明。'
    };
    const result=specs.map(([sourceId,id,name,members])=>{
      const source=all.find(move=>move.id===sourceId);
      if(!source)return null;
      const changed=source.members.some((member,index)=>member!==members[index]);
      const replacements=changed?source.members.map((from,index)=>from===members[index]?null:{from,to:members[index],pos:positions[from]}).filter(Boolean):[];
      return Object.freeze({...source,id:id||source.id,name:name||source.name,members:Object.freeze(members),
        ...(changed?{originalMembers:source.members,replacements:Object.freeze(replacements),simulation:true,origin:'原作改編',group:'動畫招式・指定搭配',work:'原作動畫招式・世界代表隊指定搭配'}:{group:'動畫原作'}),
        desc:worldDescriptions[id||source.id]||assignedDescription(source,members)});
    }).filter(Boolean).filter(move=>move.members.every(name=>roster.includes(name)));
    return Object.freeze(result);
  }
  function reviseAll(items,roster){
    const names=roster||[...new Set(items.flatMap(c=>c.members))];
    let revised=items;
    if(names.includes('圓堂'))revised=revised.filter(c=>!c.members.includes('圓堂')||c.id==='asura')
      .concat(endouCombos.filter(c=>c.members.every(n=>names.includes(n))));
    if(names.includes('阿芙洛蒂'))revised=revised.filter(c=>c.type!=='射門'||!c.members.includes('阿芙洛蒂'))
      .concat(aphrodiCombos.filter(c=>c.members.every(n=>names.includes(n))));
    // Keep the Orion Death Zone; its older same-title version is redundant for Kidou.
    if(names.includes('鬼道'))revised=revised.filter(c=>c.id!=='death-zone');
    // One active entry per move title in each team. Historical variants stay in `all`.
    return uniqueMoveNames(revised,names);
  }
  // Use the site's assigned roles for its players; guests use their original role.
  // Shinsuke is a defender in the GO appearance used by Kattobi Defense.
  const positions=Object.freeze({圓堂:'GK',西蔭:'GK',立向居:'GK',吹雪:'DF',水神矢:'DF',飛鷹:'DF',風丸:'DF',野坂:'MF',鬼道:'MF',神童:'MF',天馬:'MF',基山:'MF',阿芙洛蒂:'MF',一星:'MF',黑瀨:'MF',豪炎寺:'FW',灰崎:'FW',劍城:'FW',白龍:'FW',吉良:'FW',敦也:'FW',洛可可:'GK',沙木沼治:'GK',特雷斯:'DF',壁山:'DF',天城:'DF',黃名子:'DF',狩屋:'DF',綱海:'DF',不動:'MF',一之瀨:'MF',崔昌秀:'MF',馬克:'MF',雨宮太陽:'MF',圓堂晴:'FW',菲迪歐:'FW',潘恩:'FW',加塞爾:'FW',虎丸:'FW',雪村:'FW',阿爾法:'FW',貝塔:'FW',伽馬:'FW',佐久間:'FW',寺門:'FW',染岡:'FW',土門:'DF',冰浦:'MF',土方:'DF',八神玲名:'MF',維茲:'FW',岩戶:'DF',可萊里昂:'MF',明日人:'MF',白兔屋奈繪:'FW',迪蘭:'FW',栗松:'DF',塔子:'MF',小暮:'DF',修:'FW',信助:'DF',瞬木:'FW',月影蓮:'MF','星村ナオ':'MF'});
  // These are thematic substitutions for this simulation, not claims that a player
  // used the source move. Required signature elements cannot be supplied at random.
  const themes={
    fire:['豪炎寺','潘恩','圓堂晴','劍城'],ice:['吹雪','加塞爾','雪村','馬克'],
    tiger:['虎丸'],dragon:['白龍','崔昌秀'],dark:['劍城','灰崎'],shark:['灰崎'],
    cosmic:['基山','一星','吉良','圓堂晴','馬克','雨宮太陽'],
    light:['阿芙洛蒂','白龍','雨宮太陽'],
    strategy:['鬼道','不動','野坂','神童','一星','一之瀨','崔昌秀','馬克'],
    launcher:['飛鷹','壁山','天城','特雷斯','綱海'],rotation:['風丸','黃名子','綱海'],
    aerial:['天馬','一之瀨','雨宮太陽'],heir:['天馬'],myth:['菲迪歐','虎丸']
  };
  const shotRules={
    'inazuma-otoshi':{壁山:'launcher',豪炎寺:'fire'},
    'inazuma-1-otoshi':{豪炎寺:'fire',壁山:'launcher'},
    'dragon-tornado':{染岡:'dragon',豪炎寺:'fire'},
    'wyvern-blizzard':{染岡:'dragon',吹雪:'ice'},
    'crossfire':{豪炎寺:'fire',吹雪:'ice'},
    'twin-boost-f':{豪炎寺:'fire',鬼道:'strategy'},
    'grand-fire':{豪炎寺:'fire',基山:'cosmic',虎丸:'fire'},
    'tiger-storm':{豪炎寺:'fire',虎丸:'tiger'},
    'white-double':{吹雪:'ice',敦也:'ice'},
    'triple-blizzard':{吹雪:'ice',敦也:'ice',白兔屋奈繪:'ice'},
    'glacial-gungnir':{吹雪:'ice',敦也:'ice'},
    'death-crusher-zone':{冰浦:'ice',鬼道:'strategy',不動:'strategy'},
    'penguin-2-shark-zhao':{灰崎:'shark',鬼道:'strategy',不動:'strategy'},
    'supernova':{八神玲名:'cosmic',維茲:'cosmic'},
    'space-penguin':{八神玲名:'cosmic',維茲:'cosmic'},
    'chaos-break':{阿芙洛蒂:'light',潘恩:'fire',加塞爾:'ice'},
    'fire-blizzard':{潘恩:'fire',加塞爾:'ice'},
    'zero-magnum':{白龍:'light',修:'dark'},
    'black-dawn':{天馬:'aerial',瞬木:'dark'},
    'thunder-beast':{土方:'launcher'},
    'tatsumaki-otoshi':{壁山:'launcher',風丸:'rotation'},
    'fire-tornado-tc':{黃名子:'rotation',天馬:'aerial',劍城:'fire'},
    'last-resort':{明日人:'heir'},'last-resort-sigma':{明日人:'heir'},
    'unicorn-boost':{迪蘭:'myth'},'gran-fenrir':{迪蘭:'myth'},
    'perseus-orb':{一之瀨:'strategy',可萊里昂:'strategy'}
  };
  function partnerOptions(c,name,roster,used){
    const theme=shotRules[c.id]?.[name]||(c.type==='射門'&&['鬼道','不動'].includes(name)?'strategy':null);
    return roster.filter(n=>positions[n]===positions[name]&&!used.has(n)
      &&(!theme||themes[theme].includes(n))
      // Aphrodi's shots use the explicit seven-move plan, never a random cameo.
      &&!(c.type==='射門'&&n==='阿芙洛蒂'&&roster.includes('阿芙洛蒂')));
  }
  const seedKey='inazuma-canon-partner-seed-v1',cache=new Map();
  let seed;
  function getSeed(){
    if(seed!==undefined)return seed;
    try{seed=localStorage.getItem(seedKey)}catch(_){}
    if(typeof seed!=='string'||!seed||seed.length>128){
      seed=String(Math.floor(Math.random()*4294967296));
      try{localStorage.setItem(seedKey,seed)}catch(_){}
    }
    return seed;
  }
  function randomFor(key){
    let value=2166136261;
    for(const char of getSeed()+'|'+key)value=Math.imul(value^char.charCodeAt(0),16777619)>>>0;
    return ()=>{value^=value<<13;value^=value>>>17;value^=value<<5;return (value>>>0)/4294967296};
  }
  function assignedDescription(c,members){
    if(c.id==='asura'&&members.includes('立向居'))return '圓堂居中接應，西蔭展開環形護盾，立向居以層疊掌影分散衝擊。三人同步封住正面與兩側，以多層防線收住強力射門。';
    if(c.id==='haru-inazuma-break')return members.join('、')+'同步合踢，將雷電般的力量集中在球心，完成新世代閃電爆破。';
    if(c.members.some((n,i)=>n!==members[i])){
      const [a,b,d,e]=members;
      const fire=n=>({豪炎寺:'爆熱風暴的赤炎',潘恩:'原子烈焰的火流',圓堂晴:'隕星烈焰龍捲風的炎流',劍城:'烈焰旋踢的火流'}[n]||'火焰推力');
      const ice=n=>({吹雪:'永恆暴風雪的冰流',加塞爾:'北方衝擊的寒氣',雪村:'豹牙暴風雪的霜流',馬克:'豹牙暴風雪的霜流'}[n]||'冰雪旋流');
      const dark=n=>n==='劍城'?'死亡之劍的暗刃':'深海巨鯊的暗色旋流';
      const adapted={
        'tiger-storm':()=>a+'以'+fire(a)+'包覆球體，'+b+'以猛虎驅動的虎形球勢接力。兩人同步踢出，讓火焰與猛虎交疊，在旋流中集中攻向球門。',
        'dragon-tornado':()=>b+'以巨龍爆射的龍形氣流帶球，'+a+'再注入'+fire(a)+'。兩人迎球合踢，使龍流披上火焰，在同一條射線持續推進。',
        'wyvern-blizzard':()=>b+'將巨龍爆射的龍形氣流送向前方，'+a+'把'+ice(a)+'纏上龍身。兩人同步出腳，以龍流維持方向、冰雪加強旋轉，合力完成冰龍射門。',
        'white-double':()=>a+'與'+b+'分別注入'+ice(a)+'、'+ice(b)+'。兩人交錯起跳後同步合踢，讓兩層寒流匯成同一股冰雪球勢。',
        'triple-blizzard':()=>a+'、'+b+'與'+d+'從三個方向接力注入冰雪旋流，再同時踢向中央。三股寒流相互牽引，形成包住球體的大型暴風雪後直攻球門。',
        'glacial-gungnir':()=>a+'先將'+ice(a)+'凝在球上，'+b+'再用'+ice(b)+'接力重踢。兩股寒流沿同一軸線收束，形成冰槍般直線貫出的雙人射門。',
        'death-crusher-zone':()=>a+'先以'+ice(a)+'送出冰雪射門，'+[b,d,e].join('、')+'再以旋轉三角陣包覆來球。四人接續踢擊，將寒流與三角球勢疊在同一射線上攻門。',
        'supernova':()=>a+'凝聚流星般的球核，'+b+'穩住星軌節奏，'+d+'注入星爆推力。三人同步躍起合踢，將天體意象匯成同一能量場，壓縮後集中射出。',
        'space-penguin':()=>a+'引出宇宙企鵝般的旋流，'+b+'引導星軌，'+d+'把爆發力送入球心。三人接力起跳合踢，讓企鵝群與星光沿同一軸線前進。',
        'chaos-break':()=>b+'以'+fire(b)+'與'+d+'的'+ice(d)+'先完成冰火合流，'+a+'再從上方注入'+(a==='雨宮太陽'?'日光':'神光')+'。三人同步合踢，以光芒收束冷熱旋流並集中攻門。',
        'zero-magnum':()=>a+'以白龍的光芒托住球體，'+b+'將'+dark(b)+'壓入另一側。兩人同時出腳，讓光與暗交疊成雙重球勢，以一般合體射門向前推進。',
        'black-dawn':()=>a+'以空中踢擊拉出明亮的上升軌跡，'+b+'用'+dark(b)+'從另一側合流。兩人同步踢出，明暗球勢在同一落點匯合，形成急速前衝的射門。',
        'fire-tornado-tc':()=>b+'與'+d+'先以同步旋踢帶起火焰球勢，'+a+'從側上方加入迴旋踢擊。三人在同一拍合踢，側向旋轉協助收束炎流，合力把射門集中向前推進。',
        'thunder-beast':()=>b+'以強力起球建立高空支點，'+a+'沿球路高速起跳。兩人接續重踢，把起球的衝力與狼影般的突進匯合，讓球以雷獸般的輪廓向前衝出。'
      };
      if(adapted[c.id])return adapted[c.id]();
    }
    let desc=c.desc.replace(/原作搭檔是[^。]*。/g,'')
      .replace('保留原作雷門版本的三人分工','三人從不同方向集中踢力')
      .replace('三人以原作畢業賽的搭配進攻','三人以空中連攜集中進攻')
      .replace(/；電影中[^。]*。/g,'。').replace(/，電影中[^。]*。/g,'。')
      .replace('保留完整原作人數','以連續加速疊加力量')
      .replace('本站採用電影中兩人實際使用的搭配。','')
      .replace('；這裡保留動畫的天馬搭配','');
    if(c.id==='penguin-2-movie')desc+='企鵝群以交錯球路前進，再將踢力集中到同一目標。';
    const mapping=Object.fromEntries(c.members.map((name,i)=>[name,members[i]]));
    const names=[...c.members].sort((a,b)=>b.length-a.length).map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    return desc.replace(new RegExp(names.join('|'),'g'),name=>mapping[name]);
  }
  function resolve(roster){
    const key=roster.join('|');if(cache.has(key))return cache.get(key);
    if(isWorldRoster(roster)){
      const result=worldPlayable(roster);cache.set(key,result);return result;
    }
    const result=forTeam(roster).map(c=>{
      const used=new Set(c.members.filter(n=>roster.includes(n))),replacements=[],unresolved=[],random=randomFor(key+'|'+c.id);
      const members=c.members.map(name=>{
        if(roster.includes(name))return name;
        const pos=positions[name],pool=partnerOptions(c,name,roster,used);
        if(!pool.length){
          const hasRole=roster.some(n=>positions[n]===pos&&!used.has(n));
          unresolved.push({name,pos,reason:hasRole?'element':'position'});return name;
        }
        const selected=pool[Math.floor(random()*pool.length)];used.add(selected);replacements.push({from:name,to:selected,pos});return selected;
      });
      if(!replacements.length&&!unresolved.length)return Object.freeze({...c,desc:assignedDescription(c,members)});
      return Object.freeze({...c,members:Object.freeze(members),originalMembers:c.members,originalDesc:c.desc,replacements:Object.freeze(replacements),unresolved:Object.freeze(unresolved),simulation:true,origin:'原作改編',desc:assignedDescription(c,members)});
    });
    cache.set(key,Object.freeze(reviseAll(result,roster)));return cache.get(key);
  }
  const playable=roster=>resolve(roster).filter(c=>!c.unresolved?.length&&c.members.every(n=>roster.includes(n)));
  const note=()=>'';
  function render(roster,lines,player){
    const items=playable(roster).filter(c=>!player||c.members.includes(player)).map(move=>isWorldRoster(roster)?move:{...move,desc:window.OpponentTechniqueDetails?.describe(move)||move.desc}),field=new Set(lines.flat());
    const content=items.map(c=>{
      const bench=c.members.filter(n=>roster.includes(n)&&!field.has(n)),unresolved=c.unresolved||[];
      const status=unresolved.length?'同位置人數不足：'+unresolved.map(r=>r.name+'（'+(r.pos||'位置待確認')+'）').join('、'):bench.length?'待上場：'+bench.join('、'):'成員齊備，可使用';
      const origin=c.themeElement?'本隊原創・'+c.themeElement+'系':c.simulation?'原作招式・本隊模擬搭配':'原作'+esc(c.media);
      const body='<p class="technique-meta">'+origin+' · '+c.members.length+'人 · '+esc(c.members.join('＋'))+'</p>'+note(c)+(c.jp?'<p class="technique-meta" lang="ja">'+esc(c.jp)+'</p>':'')+(c.work?'<p class="technique-meta">'+esc(c.work)+'</p>':'')+'<p class="technique-desc">'+esc(c.desc)+'</p><p class="technique-status '+(unresolved.length||bench.length?'unavailable':'available')+'">'+esc(status)+'</p>'+(c.source?'<a class="technique-source" href="'+esc(c.source)+'" target="_blank" rel="noopener noreferrer">出場資料 ↗</a>':'');
      const heading='<strong>'+esc(c.name)+'</strong><span class="'+(player?'skill-kind ':'technique-kind ')+esc(c.type)+'">'+esc(c.type)+'</span>';
      return '<article class="technique-item" data-canon-id="'+esc(c.id)+'">'+(player?'<details class="skill-move"><summary>'+heading+'</summary><div class="skill-move-content">'+body+'</div></details>':'<div class="technique-head">'+heading+'</div>'+body)+'</article>';
    }).join('');
    const uncovered=player?[]:roster.filter(n=>!all.some(c=>c.members.includes(n)&&c.media!=='遊戲'));
    const incompatible=player?[]:resolve(roster).filter(c=>c.unresolved?.some(r=>r.reason==='element'));
    const strict=isWorldRoster(roster);
    return (items.length?content:'<p class="skill-card-empty">'+(strict?'目前沒有符合條件的原作合體技。':'目前沒有分配到這位球員的原作改編搭配；仍可使用本隊原創合體技。')+'</p>')
      +(incompatible.length?'<p class="reference-note">招式元素缺少合適的同位置搭檔，未列入本隊可用技：'+esc(incompatible.map(c=>c.name).join('、'))+'。</p>':'')
      +(uncovered.length?'<p class="reference-note">'+esc(uncovered.join('、'))+'：'+(strict?'目前未查得本人於動畫／電影使用、且現有隊員能完整組成的合體技。':'目前未查得本人於動畫／電影使用的合規一般合體技；仍可參與本隊模擬與原創搭配。'+(roster.includes('圓堂晴')?'圓堂晴的遊戲合體另有標示。':''))+'</p>':'');
  }
  window.CanonCombos=Object.freeze({all:Object.freeze(all),positions,forTeam,resolve,playable,worldPlayable,worldPlanACombos,isWorldRoster,endouCombos,aphrodiCombos,reviseAll,note,render});
})();
