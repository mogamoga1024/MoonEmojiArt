
const imgHE = document.querySelector("#main-img");
const canvas = document.querySelector("canvas");

canvas.width = imgHE.width;
canvas.height = imgHE.height;
canvas.getContext('2d').drawImage(imgHE, 0, 0);

