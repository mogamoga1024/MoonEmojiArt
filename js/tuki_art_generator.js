
class TukiArtGenerator {
    static createTukiArt(pixels, isImageColorReverse = false, shouldDrawThinBlackYokoLine = false, shouldDrawThinBlackTateLine = false) {
        let text = "";

        const data = pixels.data;
        for (let row = 0; row < pixels.height; row += 4) {
            for (let col = 0; col < pixels.width; col += 4) {
                const tmpPixels = [];
                for (let j = 0; j < TUKI_SIDE_PIXEL_COUNT; j++) {
                    if (row + j < pixels.height) {
                        const tmpRow = [];
                        for (let k = 0; k < TUKI_SIDE_PIXEL_COUNT; k++) {
                            if (col + k < pixels.width) {
                                const l = (row + j) * pixels.width * 4 + (col + k) * 4;
                                tmpRow.push(this.#colorToBit(data[l]));
                            }
                            else {
                                tmpRow.push(tmpRow[tmpRow.length - 1]);
                            }
                        }
                        tmpPixels.push(tmpRow);
                    }
                    else {
                        tmpPixels.push(tmpPixels[tmpPixels.length - 1]);
                    }
                }

                const emoji = this._convertTuki(tmpPixels, shouldDrawThinBlackYokoLine, shouldDrawThinBlackTateLine);
                text += isImageColorReverse ? this.#reverse(emoji) : emoji;
            }
            text += "\n";
        }

        return text;
    }

    static createTukiArtCanvas(tukiArt) {
        const textList = tukiArt.split("\n");

        const tmpCanvas = document.createElement("canvas");
        const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
    
        let fontSize = 12;
        let font = "";
        let lineHeight = 0;
        let rtnCanvasWidth = 0;
        let rtnCanvasHeight = 0;
        while (true) {
            if (fontSize < 1) {
                throw new Error("文字数多すぎ");
            }

            font = `400 ${fontSize}px 'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif`;
        
            tmpContext.font = font;
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            const measure = tmpContext.measureText("🌑")
            tmpCanvas.width = Math.ceil(measure.width);
            tmpCanvas.height = Math.ceil(Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent);
    
            tmpContext.font = font;
            tmpContext.fillStyle = "#fff";
            tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            tmpContext.fillStyle = "#000";
            tmpContext.textBaseline = "top";
            tmpContext.textAlign = "center";
            tmpContext.fillText("🌑", tmpCanvas.width / 2, 0);
            const tmpPixels = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height)
            const trimmed = CanvasUtils.trimming(tmpPixels);
        
            const margin = tmpCanvas.width - trimmed.width;
            lineHeight = tmpCanvas.height + margin;

            rtnCanvasWidth = tmpContext.measureText(textList[0]).width;
            rtnCanvasHeight = lineHeight * textList.length;

            const isValidCanvas = canvasSize.test({
                width : rtnCanvasWidth,
                height: rtnCanvasHeight
            });
            if (isValidCanvas) {
                break;
            }

            fontSize -= 1;
        }

        const rtnCanvas = document.createElement("canvas");
        const rtnContext = rtnCanvas.getContext("2d", { willReadFrequently: true });
    
        rtnCanvas.width = rtnCanvasWidth;
        rtnCanvas.height = rtnCanvasHeight;
    
        rtnContext.fillStyle = "#fff";
        rtnContext.fillRect(0, 0, rtnCanvas.width, rtnCanvas.height);
    
        rtnContext.font = font;
        rtnContext.fillStyle = "#000";
        rtnContext.textBaseline = "top";
        rtnContext.textAlign = "left";
    
        for (let i = 0; i < textList.length; i++) {
            const text = textList[i];
            const y = i * lineHeight;
            rtnContext.fillText(text, 0, y);
        }
    
        return rtnCanvas;
    }    

    static #colorToBit(color) {
        return color < 128 ? B : W;
    }

    static _convertTuki(pixels, shouldDrawThinBlackYokoLine = false, shouldDrawThinBlackTateLine = false) {
        let rtnTuki = null;
        let hitCount = -1;

        const existsLightColList = [false, false, false, false];
        let tukiBBBWHitCount = 0;
        let tukiWBBBHitCount = 0;
        for (const tuki of this.#tukiList) {
            let tmpHitCount = 0;
            for (let row = 0; row < TUKI_SIDE_PIXEL_COUNT; row++) {
                for (let col = 0; col < TUKI_SIDE_PIXEL_COUNT; col++) {
                    tmpHitCount += tuki.pixels[row][col] === pixels[row][col] ? 1 : 0;
                    if (!existsLightColList[col] && pixels[row][col] === B) {
                        existsLightColList[col] = true;
                    }
                }
            }
            if (shouldDrawThinBlackTateLine) {
                if (tuki.emoji === "🌒") {
                    tukiBBBWHitCount = tmpHitCount;
                }
                else if (tuki.emoji === "🌘") {
                    tukiWBBBHitCount = tmpHitCount;
                }
            }
            if (hitCount < tmpHitCount) {
                hitCount = tmpHitCount;
                rtnTuki = tuki;
            }
            else if (hitCount === tmpHitCount) {
                if (shouldDrawThinBlackTateLine && tuki.emoji === "🌕") {
                    // 何もしない。
                }
                else if (rtnTuki.priority < tuki.priority) {
                    rtnTuki = tuki;
                }
            }
        }

        const maxHitCount = TUKI_SIDE_PIXEL_COUNT * TUKI_SIDE_PIXEL_COUNT;
        if (shouldDrawThinBlackYokoLine && hitCount < maxHitCount && existsLightColList.filter(e => e).length > 2) {
            return "🌑";
        }

        if (shouldDrawThinBlackTateLine) {
            if ("🌒🌘".includes(rtnTuki.emoji)) {
                if (tukiBBBWHitCount === tukiWBBBHitCount) {
                    return "🌑";
                }
            }
            else if ("🌔🌖".includes(rtnTuki.emoji)) {
                let blackHitCount = 0;
                for (let row = 0; row < TUKI_SIDE_PIXEL_COUNT; row++) {
                    for (let col = 0; col < TUKI_SIDE_PIXEL_COUNT; col++) {
                        blackHitCount += pixels[row][col] === B ? 1 : 0;
                    }
                }
                if (blackHitCount < 3) {
                    return "🌕";
                }
            }
        }

        return rtnTuki.emoji;
    }

    static #reverse(emoji) {
        switch (emoji) {
            case "🌑": return "🌕";
            case "🌒": return "🌖";
            case "🌓": return "🌗";
            case "🌔": return "🌘";
            case "🌘": return "🌔";
            case "🌗": return "🌓";
            case "🌖": return "🌒";
            case "🌕": return "🌑";
            default: throw new Error(`引数が不正：${emoji}`);
        }
    }

    static #tukiList = [
        {
            emoji: "🌑",
            priority: 2,
            pixels: [
                [B, B, B, B],
                [B, B, B, B],
                [B, B, B, B],
                [B, B, B, B],
            ]
        },
        {
            emoji: "🌒",
            priority: 0,
            pixels: [
                [B, B, B, W],
                [B, B, B, W],
                [B, B, B, W],
                [B, B, B, W],
            ]
        },
        {
            emoji: "🌓",
            priority: 1,
            pixels: [
                [B, B, W, W],
                [B, B, W, W],
                [B, B, W, W],
                [B, B, W, W],
            ]
        },
        {
            emoji: "🌔",
            priority: 0,
            pixels: [
                [B, W, W, W],
                [B, W, W, W],
                [B, W, W, W],
                [B, W, W, W],
            ]
        },
        {
            emoji: "🌘",
            priority: 0,
            pixels: [
                [W, B, B, B],
                [W, B, B, B],
                [W, B, B, B],
                [W, B, B, B],
            ]
        },
        {
            emoji: "🌗",
            priority: 1,
            pixels: [
                [W, W, B, B],
                [W, W, B, B],
                [W, W, B, B],
                [W, W, B, B],
            ]
        },
        {
            emoji: "🌖",
            priority: 0,
            pixels: [
                [W, W, W, B],
                [W, W, W, B],
                [W, W, W, B],
                [W, W, W, B],
            ]
        },
        {
            emoji: "🌕",
            priority: 3,
            pixels: [
                [W, W, W, W],
                [W, W, W, W],
                [W, W, W, W],
                [W, W, W, W],
            ]
        },
    ];
}
