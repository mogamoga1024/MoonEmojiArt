
class TukiArtGenerator {
    generate(pixels) {
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

                text += this._convertTuki(tmpPixels);
            }
            text += "\n";
        }

        return text;
    }

    #colorToBit(color) {
        return color === 0 ? 0 : 1;
    }

    _convertTuki(pixels) {
        let rtnTuki = null;
        let count = -1;

        const rowCount = this.#tukiList[0].pixels.length;
        const colCount = this.#tukiList[0].pixels[0].length;
        for (const tuki of this.#tukiList) {
            let tmpCount = 0;
            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < colCount; col++) {
                    tmpCount += tuki.pixels[row][col] === pixels[row][col] ? 1 : 0;
                }
            }
            if (count < tmpCount) {
                count = tmpCount;
                rtnTuki = tuki;
            }
            else if (count === tmpCount) {
                if (rtnTuki.priority < tuki.priority) {
                    rtnTuki = tuki;
                }
            }
        }

        return rtnTuki.emoji;
    }

    #tukiList = [
        {
            emoji: "🌑",
            priority: 2,
            pixels: [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
        },
        {
            emoji: "🌒",
            priority: 0,
            pixels: [
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
            ]
        },
        {
            emoji: "🌓",
            priority: 1,
            pixels: [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [0, 0, 1, 1],
            ]
        },
        {
            emoji: "🌔",
            priority: 0,
            pixels: [
                [0, 1, 1, 1],
                [0, 1, 1, 1],
                [0, 1, 1, 1],
                [0, 1, 1, 1],
            ]
        },
        {
            emoji: "🌘",
            priority: 0,
            pixels: [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
            ]
        },
        {
            emoji: "🌗",
            priority: 1,
            pixels: [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ]
        },
        {
            emoji: "🌖",
            priority: 0,
            pixels: [
                [1, 1, 1, 0],
                [1, 1, 1, 0],
                [1, 1, 1, 0],
                [1, 1, 1, 0],
            ]
        },
        {
            emoji: "🌕",
            priority: 3,
            pixels: [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
            ]
        },
    ];
}
