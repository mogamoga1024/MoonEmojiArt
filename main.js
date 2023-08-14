
const img = new Image();
img.src = "野獣先輩.png";

img.onload = function() {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    // キャンバスに画像を貼る
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    // 画像の各ピクセルをグレースケールに変換する
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < pixels.height; y++) {
        for (let x = 0; x < pixels.width; x++) {
            const i = (y * 4) * pixels.width + x * 4;
            const avgRgb = Math.floor((pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3);

            // let newColor = avgRgb > 127 ? 255 : 0;
            let newColor = avgRgb > 90 ? 255 : 0;

            pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = newColor;
        }
    }
    context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
};



