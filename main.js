
const monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));

monoCanvas.setImage("野獣先輩.png");

const inputFile = document.querySelector("input[type='file']");

inputFile.addEventListener("change", function(e) {
    const file = e.target.files;
    const reader = new FileReader();

    reader.readAsDataURL(file[0]);

    reader.onload = function() {
        monoCanvas.setImage(reader.result);
    }
});
