importScripts("create_canvas_size_test.js");
importScripts("constants.js");
importScripts("canvas_utils.js");
importScripts("tuki_art_generator.js");

onmessage = async evnt => {
    try {
        canvasSizeTest = createCanvasSizeTest(evnt.data.canvasMaxWidth, evnt.data.canvasMaxHeight, evnt.data.canvasMaxArea);
    
        const textList = evnt.data.textList;
        const canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
        const canvas = new OffscreenCanvas(canvasParams.width, canvasParams.height);
        const context = canvas.getContext("2d", { willReadFrequently: true });
        TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);
    
        const fileReader = new FileReader();
        fileReader.onload = () => {
            postMessage({imageData: fileReader.result, width: canvasParams.width, isError: false});
        };
        const blob = await canvas.convertToBlob();
        fileReader.readAsDataURL(blob);
    }
    catch (error) {
        postMessage({isError: true, errorName: error.constructor.name})
    }
};
