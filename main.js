
const monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));

monoCanvas.monochrome("野獣先輩.png");

const inputFile = document.querySelector("input[type='file']");
const baseAverageColorRange = document.querySelector("#base-average-color-range");
const baseColorDistanceRange = document.querySelector("#base-color-distance");
const monochromeButton = document.querySelector("#monochrome-btn");

baseAverageColorRange.value = monoCanvas.baseAverageColor;
baseColorDistanceRange.value = monoCanvas.baseColorDistance;

let file = null;
const reader = new FileReader();

inputFile.addEventListener("change", function(e) {
    file = e.target.files[0];
});

baseAverageColorRange.addEventListener("change", function(e) {
    monoCanvas.baseAverageColor = Number(e.target.value);
});

baseColorDistanceRange.addEventListener("change", function(e) {
    monoCanvas.baseColorDistance = Number(e.target.value);
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

