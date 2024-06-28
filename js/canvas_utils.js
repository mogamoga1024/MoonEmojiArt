
class CanvasUtils {
    static trimming(imageData) {
        const data = imageData.data;
        let targetLeftX = -1;
        let targetRightX = -1;
        let targetTopY = -1;
        let targetBottomY = -1;

        // left-xを求める
        for (let col = 0; col < imageData.width; col++) {
            for (let row = 0; row < imageData.height; row++) {
                const i = row * imageData.width * 4 + col * 4;
                if (data[i] !== COLOR_SW) {
                    targetLeftX = col;
                    break;
                }
            }
            if (targetLeftX !== -1) {
                break;
            }
        }

        if (targetLeftX === -1) {
            throw new Error("文字がない！！真っ白！！");
        }

        // right-xを求める
        for (let col = imageData.width - 1; col >= 0; col--) {
            for (let row = 0; row < imageData.height; row++) {
                const i = row * imageData.width * 4 + col * 4;
                if (data[i] !== COLOR_SW) {
                    targetRightX = col;
                    break;
                }
            }
            if (targetRightX !== -1) {
                break;
            }
        }

        // top-yを求める
        for (let row = 0; row < imageData.height; row++) {
            for (let col = targetLeftX; col <= targetRightX; col++) {
                const i = row * imageData.width * 4 + col * 4;
                if (data[i] !== COLOR_SW) {
                    targetTopY = row;
                    break;
                }
            }
            if (targetTopY !== -1) {
                break;
            }
        }

        // bottom-yを求める
        for (let row = imageData.height - 1; row >= 0; row--) {
            for (let col = targetLeftX; col <= targetRightX; col++) {
                const i = row * imageData.width * 4 + col * 4;
                if (data[i] !== COLOR_SW) {
                    targetBottomY = row;
                    break;
                }
            }
            if (targetBottomY !== -1) {
                break;
            }
        }

        return {
            x: targetLeftX, y: targetTopY,
            width: targetRightX - targetLeftX + 1,
            height: targetBottomY - targetTopY + 1
        };
    }
}
