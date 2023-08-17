
class MonochromeCanvas {
    #canvas = null;
    #context = null;
    #isProcessing = false;

    get pixels() {
        return this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
    }

    constructor(canvas) {
        this.#canvas = canvas;
        this.#context = canvas.getContext("2d", { willReadFrequently: true });
    }

    text(text) {
        this.#context.font = '600 80px "ＭＳ Ｐゴシック", "游ゴシック", YuGothic, "メイリオ", Meiryo, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", Verdana, Roboto, "Droid Sans", sans-serif';
        this.#context.fillStyle = "#000";
        this.#context.textBaseline = "top";
        const measure = this.#context.measureText(text)
        this.#canvas.width = measure.width;
        this.#canvas.height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent + 20;
        this.#context.font = '600 80px "ＭＳ Ｐゴシック", "游ゴシック", YuGothic, "メイリオ", Meiryo, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", Verdana, Roboto, "Droid Sans", sans-serif';
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.fillStyle = "#000";
        this.#context.textBaseline = "middle";
        this.#context.textAlign = "center"
        this.#context.fillText(text, this.#canvas.width / 2, this.#canvas.height / 2);
    }

    image(src, resizeImageWidth, resizeImageHeight, baseAverageColor = 90, needOutline = true, baseColorDistance = 50) {
        return new Promise((resolve, reject) => {
            if (this.#isProcessing) {
                return reject(new Error("まだ前の処理をしている最中"));
            }
            this.#isProcessing = true;

            const img = new Image();
            img.src = src;

            img.onload = () => {
                // キャンバスに画像を貼る
                if (resizeImageWidth == null || resizeImageHeight == null) {
                    resizeImageWidth = img.width;
                    resizeImageHeight = img.height;
                }
                this.#canvas.width = resizeImageWidth;
                this.#canvas.height = resizeImageHeight;
                this.#context.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizeImageWidth, resizeImageHeight);

                // 画像の各ピクセルをグレースケールに変換する
                const pixels = this.pixels;
                for (let row = 0; row < pixels.height; row++) {
                    for (let col = 0; col < pixels.width; col++) {
                        const i = row * pixels.width * 4 + col * 4;

                        if (needOutline) {
                            this.#outline(pixels, i, baseColorDistance);
                        }
                        this.#image(pixels, i, baseAverageColor);
                    }
                }
                this.#context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
                this.#isProcessing = false;
                resolve();
            };
            img.onerror = e => {
                this.#isProcessing = false;
                reject(e);
            };
        });
    }

    #image(pixels, i, baseAverageColor) {
        const data = pixels.data;
        const avgColor = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
    
        let newColor = avgColor < baseAverageColor ? 0 : 255;
    
        data[i] = data[i + 1] = data[i + 2] = newColor;
    };
    
    #outline(pixels, i, baseColorDistance) {
        const data = pixels.data;
        const rightIdx = i + 4;
        const underIdx = i + pixels.width * 4;
    
        const existsRight = (i / 4 + 1) % pixels.width !== 0;
        const existsUnder = i <= pixels.width * 4 * (pixels.height - 1);
    
        let didChangeColor = false;
        if (existsRight) {
            if (this.#colorDistance(data, i, rightIdx) > baseColorDistance) {
                data[i] = data[i + 1] = data[i + 2] = 0;
                didChangeColor = true;
            }
        }
        if (!didChangeColor && existsUnder) {
            if (this.#colorDistance(data, i, underIdx) > baseColorDistance) {
                data[i] = data[i + 1] = data[i + 2] = 0;
            }
        }
    };
    
    // 3次元空間の距離を求める
    // ちなみに最大値は441.6729559300637
    #colorDistance(data, oriIdx, dstIdx) {
        return Math.sqrt(
            Math.pow((data[oriIdx] - data[dstIdx]), 2) +
            Math.pow((data[oriIdx + 1] - data[dstIdx + 1]), 2) +
            Math.pow((data[oriIdx + 2] - data[dstIdx + 2]), 2)
        );
    };
}
