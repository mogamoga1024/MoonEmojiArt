importScripts("create_canvas_size_test.js");
importScripts("constants.js");
importScripts("canvas_utils.js");
importScripts("tuki_art_generator.js");

onmessage = async e => {
    // debugger

    globalThis.canvasSizeTest = createCanvasSizeTest(e.data.canvasMaxWidth, e.data.canvasMaxHeight, e.data.canvasMaxArea);
    
    const textList = e.data.textList;
    const canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
    const canvas = new OffscreenCanvas(canvasParams.width, canvasParams.height);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);

    const fileReader = new FileReader();
    fileReader.onload = () => {
        postMessage({result: fileReader.result, width: canvasParams.width});
    };
    fileReader.onerror = e => {
        // メインスレッドでエラーを処理するので何もしない
    };
    const blob = await canvas.convertToBlob();
    fileReader.readAsDataURL(blob);
};
