
class MonochromeCanvas {
    #canvas = null;
    #context = null;

    get canvas() {
        return this.#canvas;
    }

    get pixels() {
        return this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
    }

    constructor() {
        this.#canvas = new OffscreenCanvas(300, 150);
        this.#context = this.#canvas.getContext("2d", { willReadFrequently: true });
    }

    static createTextCanvasParams(text, _fontFamily = "default", isBold = true, isTate = true, letterSpacingLevel = 3, lineWidth = 0) {
        const fontWeight = isBold ? 700 : 400;
        let fontFamily = "";
        const fontSize = 80
        let tateMargin = 4;
        switch (_fontFamily) {
            case "default":
                fontFamily = "'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif";
                break;
            case "sans":
                fontFamily = "'Noto Sans JP', sans-serif";
                break;
            case "serif":
                fontFamily = "'Noto Serif JP', serif";
                if (isTate || text.length == 1) {
                    tateMargin = 8;
                }
                break;
            default: throw new Error(`引数が不正：${_fontFamily}`);
        }
        const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        if (isTate || text.length === 1) {
            return this.#createTateTextCanvasParams(text, font, tateMargin, letterSpacingLevel, lineWidth);
        }
        else {
            return this.#createYokoTextCanvasParams(text, font, letterSpacingLevel, lineWidth);
        }
    }

    static #createTateTextCanvasParams(text, font, tateMargin = 4, letterSpacingLevel = 3, lineWidth = 0) {
        const letterSpacing = Math.floor(tateMargin / 2 * (letterSpacingLevel - 1));

        const tmpCanvas = new OffscreenCanvas(300, 150);
        const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
        
        const smallCharList = "、。っゃゅょぁぃぅぇぉッャュョァィゥェォ 「」『』()（）【】";
        const rotateCharList = "「」『』()（）【】ー ～…";
        const reverseCharList = "ー～";
        const centerJustifiedCharList = "()（）【】…";
        const leftJustifiedCharList = "」』";

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

            tmpCanvas2.width = Math.ceil(char.canvasWidth);
            tmpCanvas2.height = Math.max(Math.ceil(char.canvasHeight), minCanvasHeight);

            if (isRotateCar) {
                // todo #canvasを使う意味がない気がするが もともとは速度のためにありものを使いまわしていただけ
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
            const prevDestY = dstY;
            if (isLargeMarginChar) {
                dstY += (standardCharHeight - trimmed.height) / 2;
            }

            tmpContext.putImageData(tmpContext2.getImageData(trimmed.x, trimmed.y, trimmed.width, trimmed.height), dstX, dstY);

            if (isLargeMarginChar) {
                dstY = prevDestY;
                dstY += standardCharHeight + letterSpacing;
                totalHeight += standardCharHeight;
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

    static #createYokoTextCanvasParams(text, font, letterSpacingLevel = 3, lineWidth = 0) {
        const letterSpacing = [-8, -4, 0, 4, 8, 12][letterSpacingLevel - 1];

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
        const pixels = tmpContext.getImageData(0, trimmed.y, tmpCanvas.width, trimmed.height);

        const tateMargin = 4;
        const tmpCanvas2 = new OffscreenCanvas(tmpCanvas.width, trimmed.height + tateMargin * 2);
        const tmpContext2 = tmpCanvas2.getContext("2d", { willReadFrequently: true });
        tmpContext2.fillStyle = "#fff";
        tmpContext2.fillRect(0, 0, tmpCanvas2.width, tmpCanvas2.height);
        tmpContext2.putImageData(pixels, 0, tateMargin);

        return tmpCanvas2.transferToImageBitmap();
    }

    text(imageData, tukiCount, isTate) {
        const pixelCount = TUKI_SIDE_PIXEL_COUNT * tukiCount;
        if (isTate) {
            const rate = pixelCount / imageData.width;
            this.#canvas.width = pixelCount;
            this.#canvas.height = imageData.height * rate;
        }
        else {
            const rate = pixelCount / imageData.height;
            this.#canvas.width = imageData.width * rate;
            this.#canvas.height = pixelCount;
        }
        this.#context.drawImage(imageData, 0, 0, this.#canvas.width, this.#canvas.height);
    }

    image(imageData, resizeImageWidth, resizeImageHeight, baseAverageColor = 110, needOutline = true, baseColorDistance = 30, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false) {
        this.#pasteImageToCanvas(imageData, resizeImageWidth, resizeImageHeight, baseAverageColor, needOutline, baseColorDistance, colorCount, useNanameMikaduki, isImageColorReverse);
    }

    video(video, resizeVideoWidth, resizeVideoHeight, baseAverageColor = 110, needOutline = true, baseColorDistance = 30, colorCount = 2, useNanameMikaduki = false, isVideoColorReverse = false) {
        this.#pasteImageToCanvas(video, resizeVideoWidth, resizeVideoHeight, baseAverageColor, needOutline, baseColorDistance, colorCount, useNanameMikaduki, isVideoColorReverse, true);
    }

    #pasteImageToCanvas(image, resizeImageWidth, resizeImageHeight, baseAverageColor = 110, needOutline = true, baseColorDistance = 30, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false, isVideo = false) {
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
        const pixels = this.pixels;
        for (let row = 0; row < pixels.height; row++) {
            for (let col = 0; col < pixels.width; col++) {
                const i = row * pixels.width * 4 + col * 4;

                if (needOutline) {
                    this.#outline(pixels, i, baseColorDistance);
                }
                this.#monochrome(pixels, i, baseAverageColor, colorCount, useNanameMikaduki, isImageColorReverse);
            }
        }
        this.#context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
    }

    #monochrome(pixels, i, baseAverageColor, colorCount = 2, useNanameMikaduki = false, isImageColorReverse = false) {
        const data = pixels.data;
        let avgColor = 0;
        if (useNanameMikaduki && isImageColorReverse) {
            avgColor = Math.floor(((255 - data[i]) + (255 - data[i + 1]) + (255 - data[i + 2])) / 3);
        }
        else {
            avgColor = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        }
    
        let newColor = COLOR_W; // todo りふぁくた
        if (colorCount === 5) {
            if (avgColor < baseAverageColor * 1/3) {
                newColor = COLOR_B;
            }
            else if (avgColor < baseAverageColor * 2/3) {
                newColor = COLOR_G1;
            }
            else if (avgColor < baseAverageColor) {
                newColor = COLOR_G2;
            }
            else if (avgColor < baseAverageColor * 4/3) {
                newColor = COLOR_G3;
            }
        }
        else if (colorCount === 3) {
            if (avgColor < baseAverageColor * 2/3) {
                newColor = COLOR_B;
            }
            else if (avgColor < baseAverageColor) {
                newColor = COLOR_G2;
            }
        }
        else if (avgColor < baseAverageColor) {
            newColor = COLOR_B;
        }

        if (useNanameMikaduki && newColor === COLOR_W) {
            if (avgColor >= baseAverageColor * 4/3 + (COLOR_SW - baseAverageColor * 4/3) / 2) {
                newColor = COLOR_SW;
            }
        }
    
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
