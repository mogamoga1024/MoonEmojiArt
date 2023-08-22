
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
        return color === 0 ? B : W;
    }

    _convertTuki(pixels, shouldDrawThinBlackYokoLine = false, shouldDrawThinBlackTateLine = false) {
        let rtnTuki = null;
        let hitCount = -1;

        const rowCount = this.#tukiList[0].pixels.length;
        const colCount = this.#tukiList[0].pixels[0].length;
        const existsLightColList = [false, false, false, false];
        const tukiPriorityList = this.#tukiPriorityList(shouldDrawThinBlackTateLine);
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
            if (tuki.emoji === "🌒") {
                tukiBBBWHitCount = tmpHitCount;
            }
            else if (tuki.emoji === "🌘") {
                tukiWBBBHitCount = tmpHitCount;
            }
            if (hitCount < tmpHitCount) {
                hitCount = tmpHitCount;
                rtnTuki = tuki;
            }
            else if (hitCount === tmpHitCount) {
                if (tukiPriorityList[rtnTuki.emoji] < tukiPriorityList[tuki.emoji]) {
                    rtnTuki = tuki;
                }
            }
        }

        if (shouldDrawThinBlackYokoLine && rtnTuki.emoji === "🌕" && hitCount < 16 && existsLightColList.filter(e => e).length > 2) {
            return "🌑";
        }

        if (shouldDrawThinBlackTateLine && "🌒🌘".includes(rtnTuki.emoji)) {
            if (tukiBBBWHitCount === tukiWBBBHitCount) {
                return "🌑";
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

    #tukiPriorityList(shouldDrawThinBlackTateLine) {
        if (shouldDrawThinBlackTateLine) {
            return {
                "🌑": 3, "🌓": 2, "🌗": 2, "🌒": 1,
                "🌔": 1, "🌘": 1, "🌖": 1, "🌕": 0,
            }
        }
        else {
            return {
                "🌕": 3, "🌑": 2, "🌓": 1, "🌗": 1,
                "🌒": 0, "🌔": 0, "🌘": 0, "🌖": 0,
            }
        }
    }

    #tukiList = [
        {
            emoji: "🌑",
            pixels: [
                [B, B, B, B],
                [B, B, B, B],
                [B, B, B, B],
                [B, B, B, B],
            ]
        },
        {
            emoji: "🌒",
            pixels: [
                [B, B, B, W],
                [B, B, B, W],
                [B, B, B, W],
                [B, B, B, W],
            ]
        },
        {
            emoji: "🌓",
            pixels: [
                [B, B, W, W],
                [B, B, W, W],
                [B, B, W, W],
                [B, B, W, W],
            ]
        },
        {
            emoji: "🌔",
            pixels: [
                [B, W, W, W],
                [B, W, W, W],
                [B, W, W, W],
                [B, W, W, W],
            ]
        },
        {
            emoji: "🌘",
            pixels: [
                [W, B, B, B],
                [W, B, B, B],
                [W, B, B, B],
                [W, B, B, B],
            ]
        },
        {
            emoji: "🌗",
            pixels: [
                [W, W, B, B],
                [W, W, B, B],
                [W, W, B, B],
                [W, W, B, B],
            ]
        },
        {
            emoji: "🌖",
            pixels: [
                [W, W, W, B],
                [W, W, W, B],
                [W, W, W, B],
                [W, W, W, B],
            ]
        },
        {
            emoji: "🌕",
            pixels: [
                [W, W, W, W],
                [W, W, W, W],
                [W, W, W, W],
                [W, W, W, W],
            ]
        },
    ];
}
