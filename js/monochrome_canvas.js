
class MonochromeCanvas {
    #canvas = null;
    #context = null;

    get canvas() {
        return this.#canvas;
    }

    get imageData() {
        return this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
    }

    constructor() {
        this.#canvas = new OffscreenCanvas(300, 150);
        this.#context = this.#canvas.getContext("2d", { willReadFrequently: true });
    }

    static createTextImageBitmap(text, _fontFamily = "default", isBold = true, isTate = true, letterSpacing = 0, lineWidth = 0) {
        const fontWeight = isBold ? 700 : 400;
        let fontFamily = "";
        const fontSize = 80
        switch (_fontFamily) {
            case "default":
                fontFamily = "'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif";
                break;
            case "noto-sans":
                fontFamily = "'Noto Sans JP', sans-serif";
                break;
            case "noto-serif":
                fontFamily = "'Noto Serif JP', serif";
                break;
            case "sans":
                fontFamily = "sans-serif";
                break;
            case "serif":
                fontFamily = "serif";
                break;
            default: throw new Error(`引数が不正：${_fontFamily}`);
        }
        const font = `${fontWeight} ${fontSize}px ${fontFamily}`;

        let tateMargin = 8;
        if (_fontFamily === "noto-serif" || _fontFamily === "serif") {
            if (isTate || text.length == 1) {
                tateMargin = 14;
            }
        }

        if (isTate || text.length === 1) {
            letterSpacing += tateMargin;
            letterSpacing = Math.max(letterSpacing, 0);
            return this.#createTateTextImageBitmap(text, font, tateMargin, letterSpacing, lineWidth);
        }
        else {
            return this.#createYokoTextImageBitmap(text, font, letterSpacing, lineWidth);
        }
    }

    static #createTateTextImageBitmap(text, font, tateMargin, letterSpacing, lineWidth = 0) {
        const tmpCanvas = new OffscreenCanvas(300, 150);
        const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
        
        const smallCharList = "、。.,っゃゅょぁぃぅぇぉッャュョァィゥェォ 「」『』()（）【】";
        const rotateCharList = "「」『』()（）【】ー ～…-";
        const reverseCharList = "ー～";
        const centerJustifiedCharList = "()（）【】…";
        const leftJustifiedCharList = "」』";
        const topJustifiedCharList = "、。」』";
        const bottomJustifiedCharList = "「『";

        let minCanvasHeight = 0;
        const {
            width: standardCharWidth,
            height: standardCharHeight
        } = (() => {
            tmpContext.font = font;
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            const measure = tmpContext.measureText("あ")
            tmpCanvas.width = Math.ceil(measure.width);
            minCanvasHeight = Math.ceil(Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent);
            tmpCanvas.height = minCanvasHeight;

            tmpContext.font = font;
            tmpContext.fillStyle = "#fff";
            tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            tmpContext.fillStyle = "#000";
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            tmpContext.fillText("あ", tmpCanvas.width / 2, 0);
            const tmpPixels = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
            return CanvasUtils.trimming(tmpPixels);
        })();

        // 各文字の幅、高さの抽出とか
        let tmpCanvasWidth = 0;
        let tmpCanvasHeight = 0;
        const charList = [];
        for (const char of text) {
            tmpContext.font = font;
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            const measure = tmpContext.measureText(char);
            const width = measure.width;
            const height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;
            let canvasWidth = width;
            let canvasHeight = height;

            if (rotateCharList.includes(char)) {
                canvasWidth = height;
                canvasHeight = width;
            }

            charList.push({
                value: char,
                width: width,
                height: height,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
            });
            if (tmpCanvasWidth < canvasWidth) {
                tmpCanvasWidth = canvasWidth;
            }
            tmpCanvasHeight += Math.max(canvasHeight, standardCharHeight);
        }

        tmpCanvas.width = Math.ceil(tmpCanvasWidth);
        tmpCanvas.height = Math.ceil(tmpCanvasHeight) + letterSpacing * (charList.length - 1);

        const isValidCanvas = canvasSizeTest(tmpCanvas.width, tmpCanvas.height);
        if (!isValidCanvas) {
            throw new TooLargeCanvasError("キャンバスでかすぎ");
        }

        tmpContext.fillStyle = "#fff";
        tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

        const tmpCanvas2 = new OffscreenCanvas(1, 1);
        const tmpContext2 = tmpCanvas2.getContext("2d", { willReadFrequently: true });
        let dstY = 0;
        let maxWidth = standardCharWidth;
        let totalHeight = letterSpacing * (charList.length - 1);
        for (const char of charList) {
            const isSmallChar = smallCharList.includes(char.value);
            const isRotateCar = rotateCharList.includes(char.value);
            const isReverseChar = reverseCharList.includes(char.value);
            const isCenterJustifiedChar = centerJustifiedCharList.includes(char.value); 
            const isLeftJustifiedChar = leftJustifiedCharList.includes(char.value);
            const isTopJustifiedChar = topJustifiedCharList.includes(char.value);
            const isBottomJustifiedChar = bottomJustifiedCharList.includes(char.value);

            tmpCanvas2.width = Math.ceil(char.canvasWidth);
            tmpCanvas2.height = Math.max(Math.ceil(char.canvasHeight), minCanvasHeight);

            if (isRotateCar) {
                tmpCanvas2.width = tmpCanvas2.height = Math.max(tmpCanvas2.width, tmpCanvas2.height);
            }

            // テキスト反映
            tmpContext2.font = font;
            tmpContext2.fillStyle = "#fff";
            tmpContext2.fillRect(0, 0, tmpCanvas2.width, tmpCanvas2.height);
            tmpContext2.fillStyle = "#000";
            tmpContext2.textBaseline = "middle";
            tmpContext2.textAlign = "center";

            if (isRotateCar) {
                tmpContext2.translate(tmpCanvas2.width / 2, tmpCanvas2.height / 2);
                tmpContext2.rotate(Math.PI / 2);
                tmpContext2.translate(-tmpCanvas2.width / 2, -tmpCanvas2.height / 2);
            }
            if (isReverseChar) {
                tmpContext2.scale(1, -1);
                tmpContext2.translate(0, -tmpCanvas2.height);
            }

            if (lineWidth !== 0) {
                tmpContext2.lineWidth = lineWidth;
                tmpContext2.strokeText(char.value, tmpCanvas2.width / 2, tmpCanvas2.height / 2);
            }
            tmpContext2.fillText(char.value, tmpCanvas2.width / 2, tmpCanvas2.height / 2);
            // トリミング
            let trimmed = null;
            try {
                trimmed = CanvasUtils.trimming(tmpContext2.getImageData(0, 0, tmpCanvas2.width, tmpCanvas2.height));
            }
            catch (e) {
                trimmed = {
                    x: 0, y: 0,
                    width: standardCharWidth,
                    height: standardCharHeight
                };
                if (char.value === " ") {
                    trimmed.height /= 2;
                }
            }

            // 転写
            let dstX = (tmpCanvas.width - trimmed.width) / 2;

            if (isSmallChar && !isCenterJustifiedChar) {
                // 右寄せ
                dstX = (tmpCanvas.width - standardCharWidth) / 2 + standardCharWidth - trimmed.width;
            }
            if (isLeftJustifiedChar) {
                // 左寄せ
                dstX = (tmpCanvas.width - standardCharWidth) / 2;
            }
            
            // 漢数字の「一」みたいな文字は必要な余白すら切り取られてしまうので対策
            let isLargeMarginChar = !isSmallChar && trimmed.height < standardCharHeight;
            // ただし、これらは除外する
            if (isLargeMarginChar) {
                // ASCII ひらかな 全角カタカナ 半角カタカナ 半角数字 全角数字 全角英字大文字 全角英字小文字
                if (/[\x00-\x7F\u3040-\u309F\u30A0-\u30FF\uFF61-\uFF9F0-9０-９Ａ-Ｚａ-ｚ]/.test(char.value)) {
                    isLargeMarginChar = false;
                }
            }

            // 小さい文字も最低限の高さを与える
            const standardCharHalfHeight = standardCharHeight / 2;
            const isSmallMarginChar = isSmallChar && trimmed.height < standardCharHalfHeight;

            const prevDestY = dstY;
            if (isLargeMarginChar) {
                dstY += (standardCharHeight - trimmed.height) / 2;
            }
            else if (isSmallMarginChar) {
                if (isTopJustifiedChar) {
                    // 何もしない
                }
                else if (isBottomJustifiedChar) {
                    dstY += standardCharHalfHeight - trimmed.height;
                }
                else {
                    dstY += (standardCharHalfHeight - trimmed.height) / 2;
                }
            }

            tmpContext.putImageData(tmpContext2.getImageData(trimmed.x, trimmed.y, trimmed.width, trimmed.height), dstX, dstY);

            if (isLargeMarginChar) {
                dstY = prevDestY;
                dstY += standardCharHeight + letterSpacing;
                totalHeight += standardCharHeight;
            }
            else if (isSmallMarginChar) {
                dstY = prevDestY;
                dstY += standardCharHalfHeight + letterSpacing;
                totalHeight += standardCharHalfHeight;
            }
            else {
                dstY += trimmed.height + letterSpacing;
                totalHeight += trimmed.height;
            }

            if (maxWidth < trimmed.width) {
                maxWidth = trimmed.width;
            }
        }

        let yokoMargin = 0; // 現時点で0を代入しているので実質意味ない
        tmpCanvas2.width = maxWidth + yokoMargin * 2;
        tmpCanvas2.height = totalHeight + tateMargin * 2;
        tmpContext2.fillStyle = "#fff";
        tmpContext2.fillRect(0, 0, tmpCanvas2.width, tmpCanvas2.height);
        const dstX = (tmpCanvas2.width - tmpCanvas.width) / 2;
        tmpContext2.drawImage(tmpCanvas, dstX, tateMargin);

        return tmpCanvas2.transferToImageBitmap();
    }

    static #createYokoTextImageBitmap(text, font, letterSpacing, lineWidth = 0) {
        const tmpCanvas = new OffscreenCanvas(300, 150);
        const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
        tmpContext.font = font;
        tmpContext.textBaseline = "top";
        const measure = tmpContext.measureText(text);
        // キャンバスのサイズ設定
        tmpCanvas.width = measure.width + letterSpacing * ([...text].length - 1);
        tmpCanvas.height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;
        const isValidCanvas = canvasSizeTest(tmpCanvas.width, tmpCanvas.height);
        if (!isValidCanvas) {
            throw new TooLargeCanvasError("キャンバスでかすぎ");
        }
        // テキスト反映
        tmpContext.font = font;
        tmpContext.fillStyle = "#fff";
        tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpContext.fillStyle = "#000";
        tmpContext.textBaseline = "top";
        tmpContext.letterSpacing = letterSpacing + "px";
        if (lineWidth !== 0) {
            tmpContext.lineWidth = lineWidth;
            tmpContext.strokeText(text, 0, 0);
        }
        tmpContext.fillText(text, 0, 0);

        const trimmed = CanvasUtils.trimming(tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height));
        const imageData = tmpContext.getImageData(0, trimmed.y, tmpCanvas.width, trimmed.height);

        const tateMargin = 4;
        const tmpCanvas2 = new OffscreenCanvas(tmpCanvas.width, trimmed.height + tateMargin * 2);
        const tmpContext2 = tmpCanvas2.getContext("2d", { willReadFrequently: true });
        tmpContext2.fillStyle = "#fff";
        tmpContext2.fillRect(0, 0, tmpCanvas2.width, tmpCanvas2.height);
        tmpContext2.putImageData(imageData, 0, tateMargin);

        return tmpCanvas2.transferToImageBitmap();
    }

    text(imageBitmap, tukiCount, isTate) {
        const pixelCount = TUKI_SIDE_PIXEL_COUNT * tukiCount;
        if (isTate) {
            const rate = pixelCount / imageBitmap.width;
            this.#canvas.width = pixelCount;
            this.#canvas.height = imageBitmap.height * rate;
        }
        else {
            const rate = pixelCount / imageBitmap.height;
            this.#canvas.width = imageBitmap.width * rate;
            this.#canvas.height = pixelCount;
        }
        this.#context.drawImage(imageBitmap, 0, 0, this.#canvas.width, this.#canvas.height);
    }

    image(imageBitmap, resizeImageWidth, resizeImageHeight, baseAverageColor = 110, needOutline = true, outlineThreshold = 180, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false) {
        this.#pasteImageToCanvas(imageBitmap, resizeImageWidth, resizeImageHeight, baseAverageColor, needOutline, outlineThreshold, colorCount, useNanameMikaduki, isImageColorReverse);
    }

    video(video, resizeVideoWidth, resizeVideoHeight, baseAverageColor = 110, needOutline = true, outlineThreshold = 180, colorCount = 2, useNanameMikaduki = false, isVideoColorReverse = false) {
        this.#pasteImageToCanvas(video, resizeVideoWidth, resizeVideoHeight, baseAverageColor, needOutline, outlineThreshold, colorCount, useNanameMikaduki, isVideoColorReverse, true);
    }

    #pasteImageToCanvas(image, resizeImageWidth, resizeImageHeight, baseAverageColor = 110, needOutline = true, outlineThreshold = 180, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false, isVideo = false) {
        this.#canvas.width = resizeImageWidth;
        this.#canvas.height = resizeImageHeight;
        this.#context.fillStyle = "#fff"; // 透過画像対策
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        if (isVideo) {
            this.#context.drawImage(image, 0, 0, image.videoWidth, image.videoHeight, 0, 0, resizeImageWidth, resizeImageHeight);
        }
        else {
            this.#context.drawImage(image, 0, 0);
        }
        
        // 画像の各ピクセルをグレースケールに変換する
        const imageData = this.imageData;
        this.#kirieFilter(imageData, baseAverageColor, needOutline, outlineThreshold, colorCount, useNanameMikaduki, isImageColorReverse);

        this.#context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    }
    
    #kirieFilter(imageData, fillThreshold = 100, needOutline = true, outlineThreshold = 180, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false) {
        // sobelフィルタによる輪郭抽出
        
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
    
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            }
            else {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }
            data[i + 3] = 255;
        }
    
        let sobelData = null;
        if (needOutline) {
            sobelData = new Uint8ClampedArray(width * height);
    
            const kernelX = [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]
            ];
            const kernelY = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]
            ];
        
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let pixelX = 0;
                    let pixelY = 0;
        
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const pixel = data[((y + ky) * width + (x + kx)) * 4];
                            pixelX += pixel * kernelX[ky + 1][kx + 1];
                            pixelY += pixel * kernelY[ky + 1][kx + 1];
                        }
                    }
        
                    const magnitude = Math.round(Math.sqrt(pixelX * pixelX + pixelY * pixelY));
                    sobelData[y * width + x] = magnitude;
                }
            }
        }
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;

                if (needOutline) {
                    const invertedMagnitude = 255 - sobelData[y * width + x];
                    if (invertedMagnitude < outlineThreshold) {
                        if (useNanameMikaduki && isImageColorReverse) {
                            data[idx] = data[idx + 1] = data[idx + 2] = COLOR_SW;
                        }
                        else {
                            data[idx] = data[idx + 1] = data[idx + 2] = COLOR_B;
                        }
                        continue;
                    }
                }

                let avgColor = 0;
                if (useNanameMikaduki && isImageColorReverse) {
                    avgColor = 255 - data[idx];
                }
                else {
                    avgColor = data[idx];
                }
                
                let newColor = COLOR_W;
                if (colorCount === 5) {
                    if (avgColor < fillThreshold * 1/3) {
                        newColor = COLOR_B;
                    }
                    else if (avgColor < fillThreshold * 2/3) {
                        newColor = COLOR_G1;
                    }
                    else if (avgColor < fillThreshold) {
                        newColor = COLOR_G2;
                    }
                    else if (avgColor < fillThreshold * 4/3) {
                        newColor = COLOR_G3;
                    }
                }
                else if (colorCount === 3) {
                    if (avgColor < fillThreshold * 2/3) {
                        newColor = COLOR_B;
                    }
                    else if (avgColor < fillThreshold) {
                        newColor = COLOR_G2;
                    }
                }
                else if (avgColor < fillThreshold) {
                    newColor = COLOR_B;
                }
        
                if (useNanameMikaduki && newColor === COLOR_W) {
                    if (avgColor >= fillThreshold * 4/3 + (COLOR_SW - fillThreshold * 4/3) / 2) {
                        newColor = COLOR_SW;
                    }
                }
            
                data[idx] = data[idx + 1] = data[idx + 2] = newColor;
            }
        }
    
        // ノイズ除去
        // medianFilter(imageData);
    }
}
