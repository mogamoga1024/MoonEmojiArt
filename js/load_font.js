
/*
参考元
https://zenn.dev/cococig/articles/1d494847985263
https://style01.net/3037/
*/

/*
以前はHTMLのヘッダー部で
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
と読み込んでいたが、Canvasで使うときに反映されなかった。
ロードされていないためだと思われる。
*/

async function loadFont(name, url) {
    const response = await fetch(url);
    if (response.ok) {
        // url()の中身のURLだけ抽出
        const cssFontFace = await response.text();
        const matchUrls = cssFontFace.match(/url\(.+?\)/g);
        if (!matchUrls) {
            throw new Error("フォントが見つかりませんでした");
        }

        for (const url of matchUrls) {
            // 後は普通にFontFaceを追加
            const font = new FontFace(name, url);
            await font.load();
            document.fonts.add(font);
        }
    }
}

loadFont("Noto Serif JP", "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700");
loadFont("Noto Sans JP", "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700");
