
class TukiArtGenerator {
    generate(pixels, isImageColorReverse = false, shouldDrawThinBlackYokoLine = false, shouldDrawThinBlackTateLine = false) {
        let text = "";

        const data = pixels.data;
        for (let row = 0; row < pixels.height; row += 4) {
            for (let col = 0; col < pixels.width; col += 4) {
                const tmpPixels = [];
                for (let j = 0; j < 4; j++) {
                    if (row + j < pixels.height) {
                        const tmpRow = [];
                        for (let k = 0; k < 4; k++) {
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

    #colorToBit(color) {
        // todo PCとスマホで異なる
        // color < 128 ? B : W;
        // みたいな。パラメータも作ったほうがいいか。
        // return color === 0 ? B : W;
        return color < 128 ? B : W;
    }

    _convertTuki(pixels, shouldDrawThinBlackYokoLine = false, shouldDrawThinBlackTateLine = false) {
        let rtnTuki = null;
        let hitCount = -1;

        const rowCount = this.#tukiList[0].pixels.length;
        const colCount = this.#tukiList[0].pixels[0].length;
        const existsLightColList = [false, false, false, false];
        let tukiBBBWHitCount = 0;
        let tukiWBBBHitCount = 0;
        for (const tuki of this.#tukiList) {
            let tmpHitCount = 0;
            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < colCount; col++) {
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

        if (shouldDrawThinBlackYokoLine && hitCount < 16 && existsLightColList.filter(e => e).length > 2) {
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
                for (let row = 0; row < rowCount; row++) {
                    for (let col = 0; col < colCount; col++) {
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

    #reverse(emoji) {
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

    #tukiList = [
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
