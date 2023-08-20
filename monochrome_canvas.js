
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

    text(text, _fontFamily = "default", fontSize = 60, isBold = true, isTate = true) {
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
            this.#tateText(text, font);
        }
        else {
            this.#yokoText(text, font);
        }
    }

    #tateText(text, font) {
        const margin = 4;

        // const tmpCanvas = document.createElement("canvas");
        const tmpCanvas = document.querySelector("#canvas");
        const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
        
        const {
            y: standardCharY,
            width: standardCharWidth,
            height: standardCharHeight
        } = (() => {
            tmpContext.font = font;
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            const measure = tmpContext.measureText("あ")
            tmpCanvas.width = Math.ceil(measure.width);
            tmpCanvas.height = Math.ceil(Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent);

            console.log("font:", font);
            console.log("あ measure w:", measure.width);
            console.log("あ measure box asc:", measure.actualBoundingBoxAscent);
            console.log("あ measure box dsc:", measure.actualBoundingBoxDescent);
            console.log("tmpCanvas w h:", tmpCanvas.width, tmpCanvas.height);

            tmpContext.font = font;
            tmpContext.fillStyle = "#fff";
            tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            tmpContext.fillStyle = "#000";
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            tmpContext.fillText("あ", tmpCanvas.width / 2, 0);
            const tmpPixels = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height)
            return this.#trimming(tmpPixels);
        })();

        console.log("standardChar y w h:", standardCharY, standardCharWidth, standardCharHeight);

        // 各文字の幅、高さの抽出とか
        let tmpCanvasWidth = 0;
        let tmpCanvasHeight = 0;
        const charList = [];
        for (const char of text) {
            // todo ここでthis.#contextを使ってはいけない！！
            this.#context.font = font;
            this.#context.textBaseline = "top";
            this.#context.textAlign = "center";
            const measure = this.#context.measureText(char)
            const width = measure.width;
            const height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;

            console.log("「 measure w:", measure.width);
            console.log("「 measure box asc:", measure.actualBoundingBoxAscent);
            console.log("「 measure box dsc:", measure.actualBoundingBoxDescent);

            charList.push({
                value: char,
                width: width,
                height: height
            });
            if (tmpCanvasWidth < width) {
                tmpCanvasWidth = width;
            }
            tmpCanvasHeight += height;
        }

        tmpCanvas.width = Math.ceil(tmpCanvasWidth);
        tmpCanvas.height = Math.ceil(tmpCanvasHeight) + margin * (charList.length - 1);
        tmpContext.fillStyle = "#fff";
        tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

        let dstY = 0;
        let maxWidth = 0;
        let totalHeight = margin * (charList.length - 1);
        for (const char of charList) {
            const isSmallChar = "、。っゃゅょぁぃぅぇぉッャュョァィゥェォ".includes(char.value);

            this.#canvas.width = Math.ceil(char.width);
            this.#canvas.height = Math.max(Math.ceil(char.height), standardCharY + standardCharHeight);

            console.log("canvas w h:", this.#canvas.width, this.#canvas.height);

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

            // 漢数字の「一」みたいな文字は必要な余白すら切り取られてしまうので対策
            if (!isSmallChar) {
                if (trimmed.height < standardCharHeight) {
                    trimmed.y = standardCharY;
                    trimmed.height = standardCharHeight;
                }
            }

            // 転写
            let dstX = (tmpCanvas.width - trimmed.width) / 2;

            if (isSmallChar) {
                dstX = (tmpCanvas.width - standardCharWidth) / 2 + standardCharWidth - trimmed.width;
            }

            tmpContext.putImageData(this.#context.getImageData(trimmed.x, trimmed.y, trimmed.width, trimmed.height), dstX, dstY);
            dstY += trimmed.height + margin;
            totalHeight += trimmed.height;
            if (maxWidth < trimmed.width) {
                maxWidth = trimmed.width;
            }

            console.log("trimmed:", trimmed);
        }

        let yokoMargin = margin;
        // 数字の「1」みたいな文字は必要な余白すら切り取られてしまうので対策
        if (maxWidth < standardCharWidth) {
            yokoMargin += (standardCharWidth - maxWidth) / 2;
        }
        this.#canvas.width = maxWidth + yokoMargin * 2;
        this.#canvas.height = totalHeight + margin * 2;
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        const srcX = (tmpCanvas.width - maxWidth) / 2;
        this.#context.putImageData(tmpContext.getImageData(srcX, 0, maxWidth, totalHeight), yokoMargin, margin);
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
