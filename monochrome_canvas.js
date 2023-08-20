
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

    text(text, _fontFamily = "default", fontSize = 60, isBold = true, isTate = true, negativeMargin = 0) {
        const fontWeight = isBold ? 700 : 400;
        let fontFamily = "";
        switch (_fontFamily) {
            case "default":
                fontFamily = "'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif";
                break;
            case "sans":
                fontFamily = "'Noto Sans JP', sans-serif";
                break;
            case "serif":
                fontFamily = "'Noto Serif JP', serif";
                break;
            default: throw new Error(`引数が不正：${_fontFamily}`);
        }
        const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        if (isTate) {
            //this.#tateText(text, font, negativeMargin);
            this.#debugTateText(text, font);
        }
        else {
            this.#yokoText(text, font);
        }
    }

    #debugTateText(text, font) {
        const dstCanvas = document.querySelector("#canvas");
        const dstContext = dstCanvas.getContext("2d", { willReadFrequently: true });
        
        dstCanvas.width = 0;
        dstCanvas.height = 0;
        const charList = [];
        for (const char of text) {
            this.#context.font = font;
            const measure = this.#context.measureText(char)
            const width = measure.width;
            const height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;
            charList.push({
                value: char,
                width: width,
                height: height
            });
            if (dstCanvas.width < width) {
                dstCanvas.width = width;
            }
            dstCanvas.height += height;
        }

        let pasteY = 0;
        for (const char of charList) {
            this.#canvas.width = char.width;
            this.#canvas.height = char.height;
            // テキスト反映
            this.#context.font = font;
            this.#context.fillStyle = "#fff";
            this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.#context.fillStyle = "#000";
            this.#context.textBaseline = "top";
            this.#context.textAlign = "center";
            this.#context.fillText(char.value, this.#canvas.width / 2, 0);
            // トリミング
            const trimmed = this.#trimming(this.pixels);
    
            // 転写
            // dstCanvas.width = this.#canvas.width;
            // dstCanvas.height = this.#canvas.height;
            // dstCanvas.width = 100; // todo 仮 maxにする
            // dstCanvas.height += this.#canvas.height; // todo 最初に全部足す
            dstContext.putImageData(this.#context.getImageData(trimmed.x, trimmed.y, trimmed.width, trimmed.height), 0, pasteY);
            pasteY += trimmed.height;
        }
    }

    #trimming(pixels) {
        const data = pixels.data;
        let targetLeftX = -1;
        let targetRightX = -1;
        let targetTopY = -1;
        let targetBottomY = -1;

        // left-xを求める
        for (let col = 0; col < pixels.width; col++) {
            for (let row = 0; row < pixels.height; row++) {
                const i = row * pixels.width * 4 + col * 4;
                if (data[i] === 0) {
                    targetLeftX = col;
                    break;
                }
            }
            if (targetLeftX !== -1) {
                break;
            }
        }

        if (targetLeftX === -1) {
            throw new Error("文字がない！！真っ白！！");
        }

        // right-xを求める
        for (let col = pixels.width - 1; col >= 0; col--) {
            for (let row = 0; row < pixels.height; row++) {
                const i = row * pixels.width * 4 + col * 4;
                if (data[i] === 0) {
                    targetRightX = col;
                    break;
                }
            }
            if (targetRightX !== -1) {
                break;
            }
        }

        // top-yを求める
        for (let row = 0; row < pixels.height; row++) {
            for (let col = targetLeftX; col <= targetRightX; col++) {
                const i = row * pixels.width * 4 + col * 4;
                if (data[i] === 0) {
                    targetTopY = row;
                    break;
                }
            }
            if (targetTopY !== -1) {
                break;
            }
        }

        // bottom-yを求める
        for (let row = pixels.height - 1; row >= 0; row--) {
            for (let col = targetLeftX; col <= targetRightX; col++) {
                const i = row * pixels.width * 4 + col * 4;
                if (data[i] === 0) {
                    targetBottomY = row;
                    break;
                }
            }
            if (targetBottomY !== -1) {
                break;
            }
        }

        return {
            x: targetLeftX, y: targetTopY,
            width: targetRightX - targetLeftX + 1,
            height: targetBottomY - targetTopY + 1
        };
    }

    #tateText(text, font, negativeMargin) {
        this.#context.font = font;
        this.#context.textBaseline = "top";
        const charList = [];
        let maxWidth = 0;
        let totalHeihgt = 0;
        for (const char of text) {
            const measure = this.#context.measureText(char);
            const width = measure.width;
            let height = measure.actualBoundingBoxDescent;
            if ("、。".includes(char)) {
                height = Math.round(height / 3);
            }
            else if ("っゃゅょぁぃぅぇぉッャュョァィゥェォ".includes(char)) {
                height += Math.abs(measure.actualBoundingBoxAscent);
                height = Math.round(height * 4 / 5);
            }
            else {
                height += Math.abs(measure.actualBoundingBoxAscent);
            }
            if (maxWidth < width) {
                maxWidth = width;
            }
            totalHeihgt += height;
            charList.push({ char: char, height: height });
        }
        // キャンバスのサイズ設定
        this.#canvas.width = maxWidth;
        this.#canvas.height = totalHeihgt - negativeMargin * (charList.length - 1);
        // テキスト反映
        this.#context.font = font;
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.fillStyle = "#000";
        let top = 0;

        for (let i = 0; i < charList.length; i++) {
            const char = charList[i];
            if (i > 0) {
                top -= negativeMargin;
            }
            if ("、。".includes(char.char)) {
                this.#context.textBaseline = "top";
                this.#context.textAlign = "left";
                top -=  char.height * 2;
                this.#context.fillText(char.char, this.#canvas.width * 4 / 7, top);
            }
            else if ("っゃゅょぁぃぅぇぉッャュョァィゥェォ".includes(char.char)) {
                this.#context.textBaseline = "top";
                this.#context.textAlign = "center";
                top -=  char.height / 3.8;
                this.#context.fillText(char.char, this.#canvas.width * 4 / 7, top);
            }
            else {
                this.#context.textAlign = "center";
                if (charList.length === 1) {
                    this.#context.textBaseline = "middle";
                    this.#context.fillText(char.char, this.#canvas.width / 2, top + char.height / 2);
                }
                else {
                    this.#context.textBaseline = "top";
                    this.#context.fillText(char.char, this.#canvas.width / 2, top);
                }
            }
            top += char.height;
        }
    }

    #yokoText(text, font) {
        this.#context.font = font;
        this.#context.textBaseline = "top";
        const measure = this.#context.measureText(text)
        // キャンバスのサイズ設定
        this.#canvas.width = measure.width;
        this.#canvas.height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;
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
