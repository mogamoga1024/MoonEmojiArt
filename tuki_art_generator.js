
class TukiArtGenerator {
    generate(pixels) {
        let text = "";

        const data = pixels.data;
        for (let y = 0; y < pixels.height; y++) {
            for (let x = 0; x < pixels.width; x++) {
                const i = y * pixels.width * 4 + x * 4;
                
                if (data[i] === 0) {
                    text += "■";
                }
                else {
                    text += "□";
                }
            }
            text += "\n";
        }

        //return text;
        return "";
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
