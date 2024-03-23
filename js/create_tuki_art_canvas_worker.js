importScripts("constants.js");
// importScripts("canvas_utils.js");
importScripts("tuki_art_generator.js");

onmessage = e => {
    const textList = e.data.textList;
    const canvasParams = e.data.canvasParams;
    const context = e.data.canvas.getContext("2d", { willReadFrequently: true });
    // debugger
    TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);
    postMessage("ok");
};
