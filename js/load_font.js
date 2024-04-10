
/*
参考元
https://zenn.dev/cococig/articles/1d494847985263
https://style01.net/3037/
*/

/*
以前はHTMLのヘッダー部でGoogleFontのCDNを書いても
Canvasで使うときに反映されなかった。
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
