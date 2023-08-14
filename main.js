
const monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));

monoCanvas.monochrome("野獣先輩.png");

const inputFile = document.querySelector("input[type='file']");
const baseAverageColorRange = document.querySelector("#base-average-color-range");
const baseAverageColorNumber = document.querySelector("#base-average-color-number");
const baseColorDistanceRange = document.querySelector("#base-color-distance-range");
const baseColorDistanceNumber = document.querySelector("#base-color-distance-number");
const monochromeButton = document.querySelector("#monochrome-btn");

baseAverageColorRange.value = baseAverageColorNumber.value = monoCanvas.baseAverageColor;
baseColorDistanceRange.value = baseColorDistanceNumber.value = monoCanvas.baseColorDistance;

let file = null;
const reader = new FileReader();

inputFile.addEventListener("change", function(e) {
    file = e.target.files[0];
});

baseAverageColorRange.addEventListener("change", function(e) {
    monoCanvas.baseAverageColor = Number(e.target.value);
    baseAverageColorNumber.value = monoCanvas.baseAverageColor;
});

baseAverageColorNumber.addEventListener("change", function(e) {
    let value = Number(e.target.value);
    const min = Number(baseAverageColorRange.min);
    const max = Number(baseAverageColorRange.max);
    if (value < min) {
        value = min;
        baseAverageColorNumber.value = value;
    }
    else if (value > max) {
        value = max;
        baseAverageColorNumber.value = value;
    }
    monoCanvas.baseAverageColor = value;
    baseAverageColorRange.value = monoCanvas.baseAverageColor;
});

baseColorDistanceRange.addEventListener("change", function(e) {
    monoCanvas.baseColorDistance = Number(e.target.value);
    baseColorDistanceNumber.value = monoCanvas.baseColorDistance;
});

baseColorDistanceNumber.addEventListener("change", function(e) {
    let value = Number(e.target.value);
    const min = Number(baseColorDistanceRange.min);
    const max = Number(baseColorDistanceRange.max);
    if (value < min) {
        value = min;
        baseColorDistanceNumber.value = value;
    }
    else if (value > max) {
        value = max;
        baseColorDistanceNumber.value = value;
    }
    monoCanvas.baseColorDistance = value;
    baseColorDistanceRange.value = monoCanvas.baseColorDistance;
});

monochromeButton.addEventListener("click", function() {
    if (file == null) {
        return;
    }

    reader.readAsDataURL(file);

    reader.onload = function() {
        monoCanvas.monochrome(reader.result);
    }
});

