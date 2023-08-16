
class TukimojiGenerator {
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
}
