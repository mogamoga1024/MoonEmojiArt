
class MonochromeCanvas {
    baseAverageColor = 90;
    baseColorDistance = 50;
    needOutline = true;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    monochrome(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;

            img.onload = () => {
                // キャンバスに画像を貼る
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.context.drawImage(img, 0, 0);

                // 画像の各ピクセルをグレースケールに変換する
                const pixels = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                for (let y = 0; y < pixels.height; y++) {
                    for (let x = 0; x < pixels.width; x++) {
                        const i = (y * 4) * pixels.width + x * 4;

                        if (this.needOutline) {
                            this.#outline(pixels, i);
                        }
                        this.#monochrome(pixels, i);
                    }
                }
                this.context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
                resolve();
            };
            img.onerror = e => reject(e);
        });
    }

    #monochrome(pixels, i) {
        const data = pixels.data;
        const avgColor = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
    
        //let newColor = avgColor < 128 ? 0 : 255;
        let newColor = avgColor < this.baseAverageColor ? 0 : 255;
    
        data[i] = data[i + 1] = data[i + 2] = newColor;
    };
    
    #outline(pixels, i) {
        const data = pixels.data;
        const rightIdx = i + 4;
        const underIdx = i + pixels.width * 4;
    
        const existsRight = (i / 4 + 1) % pixels.width !== 0;
        const existsUnder = i <= pixels.width * 4 * (pixels.height - 1);
    
        let didChangeColor = false;
        if (existsRight) {
            if (this.#colorDistance(data, i, rightIdx) > this.baseColorDistance) {
                data[i] = data[i + 1] = data[i + 2] = 0;
                didChangeColor = true;
            }
        }
        if (!didChangeColor && existsUnder) {
            if (this.#colorDistance(data, i, underIdx) > this.baseColorDistance) {
                data[i] = data[i + 1] = data[i + 2] = 0;
            }
        }
    };
    
    // 3次元空間の距離を求める
    #colorDistance(data, oriIdx, dstIdx) {
        return Math.sqrt(
            Math.pow((data[oriIdx] - data[dstIdx]), 2) +
            Math.pow((data[oriIdx + 1] - data[dstIdx + 1]), 2) +
            Math.pow((data[oriIdx + 2] - data[dstIdx + 2]), 2)
        );
    };
};
