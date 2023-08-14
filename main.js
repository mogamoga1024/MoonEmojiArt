
const img = new Image();
img.src = "野獣先輩.png";

img.onload = function() {
    const canvas = document.querySelector("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);
};



