// 既定の賞品リスト（ブラウザに保存データが無いときだけ使う）
// 出典：Googleスプレッドシート「クイズ大会賞品リスト」タブ 20261031（2026/10/15 取得）
// 更新するときはアプリの「スプレッドシートから取り込む」で取り込み直すか、このファイルを作り直す
window.MAGNA_DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1r6CgACphjmes-pbKV6Aw2zf55LxQJhWIHKgHDW4yZ50/edit#gid=20261031";
window.MAGNA_DEFAULT_PRIZES = [
{
"no": 1,
"name": "3000 モンド",
"note": "参加者全員に！",
"rarity": "MEGA",
"enabled": true,
"all": true,
"imageFile": "LD_0001.png"
},
{
"no": 2,
"name": "2000 モンド",
"note": "参加者全員に！",
"rarity": "MEGA",
"enabled": true,
"all": true,
"imageFile": "LD_0002.png"
},
{
"no": 3,
"name": "1000 モンド",
"note": "参加者全員に！",
"rarity": "MEGA",
"enabled": true,
"all": true,
"imageFile": "LD_0003.png"
},
{
"no": 4,
"name": "3200 モンド",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0004.png"
},
{
"no": 5,
"name": "3200 モンド",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0005.png"
},
{
"no": 6,
"name": "3200 モンド",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0006.png"
},
{
"no": 7,
"name": "（特賞）\n好きなレジェンズを選んで当たる宝箱",
"note": "当選者が好きなレジェンズを１体選んでね！\nそれが参加者全員に届きます",
"rarity": "MEGA",
"enabled": true,
"all": true,
"imageFile": "LD_0007.jpg"
},
{
"no": 8,
"name": "限定マグナ・ぷくぷく＆キラキラシールセット",
"note": "各１枚・計２枚のセット案。在庫あり（10/15片山さん確認）。",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0008.png"
},
{
"no": 9,
"name": "限定マグナ・ぷくぷく＆キラキラシールセット",
"note": "各１枚・計２枚のセット案。在庫あり（10/15片山さん確認）。",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0009.png"
},
{
"no": 10,
"name": "限定マグナ・ぷくぷく＆キラキラシールセット",
"note": "各１枚・計２枚のセット案。在庫あり（10/15片山さん確認）。",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0010.png"
},
{
"no": 11,
"name": "タオル好きなの1つ",
"note": "補充案。種類・在庫確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0046.png"
},
{
"no": 12,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0024.png"
},
{
"no": 13,
"name": "タオル好きなの1つ",
"note": "補充案。種類・在庫確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0047.png"
},
{
"no": 14,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0032.png"
},
{
"no": 15,
"name": "連続学習日数チケット 10枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0026.png"
},
{
"no": 16,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0031.png"
},
{
"no": 17,
"name": "タオル好きなの1つ",
"note": "補充案。種類・在庫確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0048.png"
},
{
"no": 18,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0034.jpg"
},
{
"no": 19,
"name": "連続学習日数チケット 10枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0027.png"
},
{
"no": 20,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0033.png"
},
{
"no": 21,
"name": "タオル好きなの1つ",
"note": "補充案。種類・在庫確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0049.png"
},
{
"no": 22,
"name": "名シーン・キーホルダー",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0011.png"
},
{
"no": 23,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0042.png"
},
{
"no": 24,
"name": "連続学習日数チケット 10枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0028.png"
},
{
"no": 25,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0041.png"
},
{
"no": 26,
"name": "マナ４倍チケット 100 枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0036.jpg"
},
{
"no": 27,
"name": "タオル好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0051.png"
},
{
"no": 28,
"name": "ハンカチ好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0056.png"
},
{
"no": 29,
"name": "レジェンズ・ドラキュラ",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0071.png"
},
{
"no": 30,
"name": "名シーン・キーホルダー",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0012.png"
},
{
"no": 31,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0044.png"
},
{
"no": 32,
"name": "ボーかたやまコレクション（中古品）",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0025.png"
},
{
"no": 33,
"name": "連続学習日数チケット 10枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0029.png"
},
{
"no": 34,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0043.png"
},
{
"no": 35,
"name": "マナ４倍チケット 100 枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0037.png"
},
{
"no": 36,
"name": "タオル好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0052.png"
},
{
"no": 37,
"name": "ハンカチ好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0057.jpg"
},
{
"no": 38,
"name": "レジェンズ・ドラキュラ",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0072.png"
},
{
"no": 39,
"name": "名シーン・キーホルダー",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0013.jpg"
},
{
"no": 40,
"name": "マグナ・オリジナルTシャツ",
"note": "※好きなデザインを選ぼう",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0015.png"
},
{
"no": 41,
"name": "限定マグナ・ぷくぷくシール",
"note": "１枚の単品案。在庫あり（10/15片山さん確認）。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0016.png"
},
{
"no": 42,
"name": "限定マグナ・キラキラシール",
"note": "１枚の単品案。在庫あり（10/15片山さん確認）。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0018.png"
},
{
"no": 43,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0062.png"
},
{
"no": 44,
"name": "ボーかたやまコレクション（中古品）",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0060.png"
},
{
"no": 45,
"name": "連続学習日数チケット 10枚",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0066.png"
},
{
"no": 46,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0061.png"
},
{
"no": 47,
"name": "マナ４倍チケット 100 枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0038.png"
},
{
"no": 48,
"name": "タオル好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0053.png"
},
{
"no": 49,
"name": "ハンカチ好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0058.png"
},
{
"no": 50,
"name": "レジェンズ・ドラキュラ",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0073.png"
},
{
"no": 51,
"name": "名シーン・キーホルダー",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0014.png"
},
{
"no": 52,
"name": "マグナ・オリジナルTシャツ",
"note": "※好きなデザインを選ぼう",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0020.png"
},
{
"no": 53,
"name": "限定マグナ・ぷくぷくシール",
"note": "１枚の単品案。在庫あり（10/15片山さん確認）。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0017.png"
},
{
"no": 54,
"name": "限定マグナ・キラキラシール",
"note": "１枚の単品案。在庫あり（10/15片山さん確認）。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0019.png"
},
{
"no": 55,
"name": "マグナ・新デザインマグカップ",
"note": "新デザイン制作予定。数量・制作費・納期は確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0021.png"
},
{
"no": 56,
"name": "クオの歯ブラシ（スタンド付き）",
"note": "クオの歯ブラシ＋スタンド　※画像は制作中のもので変更する可能性があります",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0022.png"
},
{
"no": 57,
"name": "ミントの歯ブラシ（スタンド付き）",
"note": "ミントの歯ブラシ＋スタンド　※画像は制作中のもので変更する可能性があります",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0023.png"
},
{
"no": 58,
"name": "500 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0064.png"
},
{
"no": 59,
"name": "ボーかたやまコレクション（中古品）",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0070.png"
},
{
"no": 60,
"name": "連続学習日数チケット 10枚",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0067.png"
},
{
"no": 61,
"name": "レジェンズ・ハンニバル",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0030.png"
},
{
"no": 62,
"name": "1000 モンド",
"note": "当選者本人に付与。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0063.png"
},
{
"no": 63,
"name": "レジェンズ・クフ王",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0035.png"
},
{
"no": 64,
"name": "マナ４倍チケット 100 枚",
"note": "補充案。付与可否確認待ち。",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0039.png"
},
{
"no": 65,
"name": "レジェンズ・夏目漱石",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0040.png"
},
{
"no": 66,
"name": "レジェンズ・テスラ",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0045.png"
},
{
"no": 67,
"name": "タオル好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0054.png"
},
{
"no": 68,
"name": "レジェンズ・ネイスミス",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0050.png"
},
{
"no": 69,
"name": "レジェンズ・天下人家康",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0055.png"
},
{
"no": 70,
"name": "ハンカチ好きなの1つ",
"note": "",
"rarity": "NORMAL",
"enabled": true,
"all": false,
"imageFile": "LD_0059.jpg"
},
{
"no": 71,
"name": "豪華声優サイン入り台本 1冊",
"note": "※どの声優のサインかは選べません",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0065.png"
},
{
"no": 72,
"name": "マグナの英検チャレンジ講座 １回無料",
"note": "対象講座・受講対象者・利用期限・予約方法・既存受講生の利用可否は確認待ち。",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0068.png"
},
{
"no": 73,
"name": "SR限定宝箱",
"note": "候補：対象SR・排出数・重複時の扱い・付与可否を確認。",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0069.png"
},
{
"no": 74,
"name": "レジェンズ・ドラキュラ",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0074.png"
},
{
"no": 75,
"name": "レジェンズ1体 好きなの1体",
"note": "",
"rarity": "BIG",
"enabled": true,
"all": false,
"imageFile": "LD_0075.png"
}
];
