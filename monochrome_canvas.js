
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

    text(text, fontSize = 60, isBold = true, isTate = true) {
        const fontWeight = isBold ? 600 : 400;
        const font = `${fontWeight} ${fontSize}px "ＭＳ Ｐゴシック", "游ゴシック", YuGothic, "メイリオ", Meiryo, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", Verdana, Roboto, "Droid Sans", sans-serif`;
        
        if (isTate) {
            this.#tateText(text, font);
        }
        else {
            this.#yokoText(text, font);
        }
    }

    #tateText(text, font) {
        this.#context.font = font;
        this.#context.textBaseline = "top";
        const charList = [];
        let maxWidth = 0;
        let totalHeihgt = 0;
        for (const char of text) {
            const measure = this.#context.measureText(char);
            const width = measure.width;
            const height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
            if (maxWidth < width) {
                maxWidth = width;
            }
            totalHeihgt += height;
            charList.push({ char: char, height: height });
        }
        // キャンバスのサイズ設定
        const firstChar = charList[0];
        const lastChar = charList[charList.length - 1];
        let missingTopMargin = 0;
        let missingBottomMargin = 0;
        if (firstChar === lastChar) {
            // 何もしない
        }
        else if (firstChar.height < lastChar.height) {
            missingTopMargin = Math.round((lastChar.height - firstChar.height) / 2);
        }
        else if (firstChar.height > lastChar.height) {
            missingBottomMargin = Math.round((firstChar.height - lastChar.height) / 2);
        }
        this.#canvas.width = maxWidth;
        this.#canvas.height = totalHeihgt + 10 * (charList.length + 1) + missingTopMargin + missingBottomMargin;
        // テキスト反映
        this.#context.font = font;
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.fillStyle = "#000";
        this.#context.textBaseline = "top";
        this.#context.textAlign = "center";
        let top = 10 + missingTopMargin;
        for (const char of charList) {
            this.#context.fillText(char.char, this.#canvas.width / 2, top);
            top += char.height + 10;
        }
    }

    #yokoText(text, font) {
        this.#context.font = font;
        this.#context.textBaseline = "top";
        const measure = this.#context.measureText(text)
        // キャンバスのサイズ設定
        this.#canvas.width = measure.width;
        this.#canvas.height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent + 20;
        // テキスト反映
        this.#context.font = font;
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.fillStyle = "#000";
        this.#context.textBaseline = "middle";
        this.#context.textAlign = "center";
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
                this.#context.fillStyle = "#fff"; // 透過画像対策
                this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
                this.#context.drawImage(img, 0, 0, img.width, img.height, 0, 0, resizeImageWidth, resizeImageHeight);

                // 画像の各ピクセルをグレースケールに変換する
                const pixels = this.pixels;
                for (let row = 0; row < pixels.height; row++) {
                    for (let col = 0; col < pixels.width; col++) {
                        const i = row * pixels.width * 4 + col * 4;

                        if (needOutline) {
                            this.#outline(pixels, i, baseColorDistance);
                        }
                        this.#monochrome(pixels, i, baseAverageColor);
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

    #monochrome(pixels, i, baseAverageColor) {
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
