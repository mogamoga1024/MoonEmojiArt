
const monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));

monoCanvas.monochrome("野獣先輩.png");

const inputFile = document.querySelector("input[type='file']");

inputFile.addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function() {
        monoCanvas.monochrome(reader.result);
    }
});
