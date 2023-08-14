
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

            outline(pixels, i);
            monochrome(pixels, i);
        }
    }
    context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
};

function monochrome(pixels, i) {
    const data = pixels.data;
    const avgRgb = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);

    //let newColor = avgRgb < 128 ? 0 : 255;
    let newColor = avgRgb < 90 ? 0 : 255;

    data[i] = data[i + 1] = data[i + 2] = newColor;
};

function outline(pixels, i) {
    const baseColorDistance = 27;
    const data = pixels.data;
    const rightIdx = i + 4;
    const underIdx = i + pixels.width * 4;

    const existsRight = (i / 4 + 1) % pixels.width !== 0;
    const existsUnder = i <= pixels.width * 4 * (pixels.height - 1);

    let didChangeColor = false;
    if (existsRight) {
        if (colorDistance(data, i, rightIdx) > baseColorDistance) {
            data[i] = data[i + 1] = data[i + 2] = 0;
            didChangeColor = true;
        }
    }
    if (!didChangeColor && existsUnder) {
        if (colorDistance(data, i, underIdx) > baseColorDistance) {
            data[i] = data[i + 1] = data[i + 2] = 0;
        }
    }
};

// 3次元空間の距離を求める
function colorDistance(data, oriIdx, dstIdx) {
    return Math.sqrt(
        Math.pow((data[oriIdx] - data[dstIdx]), 2) +
        Math.pow((data[oriIdx + 1] - data[dstIdx + 1]), 2) +
        Math.pow((data[oriIdx + 2] - data[dstIdx + 2]), 2)
    );
};

