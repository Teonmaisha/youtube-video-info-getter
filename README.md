# YouTube 動画情報取得

## 機能

ブックマークレットを実行することで、その YouTube 動画の動画情報を表示します。

- 基本的な情報 (タイトル・時間の長さ・サムネイル画像)
- フォーマットの情報 (形式・解像度など)

## 動作環境

- 確認済み
	- PC: Chrome 73
	- PC: Firefox 66
	- PC: Edge 44
- 非対応
	- PC: Internet Explorer

## 使い方

使用は自己責任でお願いします。

1. 以下のブックマークレットをブックマークに登録します。
```javascript
javascript:(()=>{const d=new Date();const s=document.createElement('script');s.src='https://kerupani129s.github.io/youtube-video-info-getter/display.js?'+[d.getFullYear(),d.getMonth()+1,d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()].map((x,i)=>(''+x).padStart(i?2:4,'0')).join('');document.head.appendChild(s);})();
```
2. YouTube の動画再生画面でブックマークレットを実行すると、新しいタブまたはウィンドウで動画情報を表示します。

※一部動画は正しく情報が取得できないことがあります。  
※ (既知のバグ) Edge では新しく開いたページのタイトルが「空白のページ」になります。  
※ (既知のバグ) Edge では新しく開いたページの表示に少し時間がかかります。

## License

[MIT License](/LICENSE)

## 免責事項

MIT ライセンスにある通り、作者は一切責任を負いません。
