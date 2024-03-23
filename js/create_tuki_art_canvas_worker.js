importScripts("constants.js");
// importScripts("canvas_utils.js");
importScripts("tuki_art_generator.js");

onmessage = async e => {
    const textList = e.data.textList;
    const canvasParams = e.data.canvasParams;
    const context = e.data.canvas.getContext("2d", { willReadFrequently: true });
    // debugger
    TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);
    // const tukiArtBlob = e.data.canvas.convertToBlob();
    // postMessage(tukiArtBlob, [tukiArtBlob]);
    const fileReader = new FileReader();
    fileReader.onload = () => {
        postMessage(fileReader.result);
    }
    fileReader.onerror = (e) => {
        // todo
    }
    const blob = await e.data.canvas.convertToBlob();
    fileReader.readAsDataURL(blob);
};
