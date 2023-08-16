
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

        return text;
    }

    #convertTuki(pixels) {
        let tuki = this.#tukiList[0].emoji;

        
    }

    #tukiList = [
        {
            emoji: "🌑",
            pixels: [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
        },
        {
            emoji: "🌒",
            pixels: [
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
            ]
        },
        {
            emoji: "🌓",
            pixels: [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [0, 0, 1, 1],
            ]
        },
        {
            emoji: "🌔",
            pixels: [
                [0, 1, 1, 1],
                [0, 1, 1, 1],
                [0, 1, 1, 1],
                [0, 1, 1, 1],
            ]
        },
        {
            emoji: "🌘",
            pixels: [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
            ]
        },
        {
            emoji: "🌗",
            pixels: [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ]
        },
        {
            emoji: "🌖",
            pixels: [
                [1, 1, 1, 0],
                [1, 1, 1, 0],
                [1, 1, 1, 0],
                [1, 1, 1, 0],
            ]
        },
        {
            emoji: "🌕",
            pixels: [
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
            ]
        },
    ];
}
