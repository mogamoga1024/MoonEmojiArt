
function createCanvasSizeTest(maxWidth, maxHeight, maxArea) {
    return function(widht, height) {
        if (widht > maxWidth) {
            return false;
        }
        else if (height > maxHeight) {
            return false;
        }
        else if (widht * height > maxArea) {
            return false;
        }
        return true;
    }
}
