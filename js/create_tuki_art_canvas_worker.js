importScripts("constants.js");
importScripts("tuki_art_generator.js");

onmessage = async e => {
    const textList = e.data.textList;
    const canvasParams = e.data.canvasParams;
    const context = e.data.canvas.getContext("2d", { willReadFrequently: true });
    TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);
    const fileReader = new FileReader();
    fileReader.onload = () => {
        postMessage(fileReader.result);
    };
    fileReader.onerror = e => {
        // メインスレッドでエラーを処理するので何もしない
    };
    const blob = await e.data.canvas.convertToBlob();
    fileReader.readAsDataURL(blob);
};
