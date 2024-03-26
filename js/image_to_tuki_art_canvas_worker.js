importScripts("create_canvas_size_test.js");
importScripts("constants.js");
importScripts("canvas_utils.js");
importScripts("custom_errors.js");
importScripts("monochrome_canvas.js");
importScripts("tuki_art_generator.js");

onmessage = async evnt => {
    let tukiArt = "";
    try {
        canvasSizeTest = createCanvasSizeTest(evnt.data.canvasMaxWidth, evnt.data.canvasMaxHeight, evnt.data.canvasMaxArea);
    
        debugger

        const prm = evnt.data.tukiArtParams;
        const monoCanvas = new MonochromeCanvas();

        /*await*/ monoCanvas.image(
            evnt.data.imageData,
            prm.imageWidth,
            prm.imageHeight,
            prm.imageBaseAverageColor,
            prm.needImageOutline,
            prm.imageBaseColorDistance,
            prm.imageColorCount,
            prm.useImageNanameMikaduki,
            prm.isImageColorReverse
        );
        tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, prm.isImageColorReverse, prm.isImageYokoLinePowerUp, prm.isImageTateLinePowerUp, prm.imageColorCount, prm.useImageNanameMikaduki);

        const textList = tukiArt.split("\n");

        const canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
        const canvas = new OffscreenCanvas(canvasParams.width, canvasParams.height);
        const context = canvas.getContext("2d", { willReadFrequently: true });
        TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);
        
        // todo monoCanvasの画像
        
        const fileReader = new FileReader();
        fileReader.onload = () => {
            postMessage({tukiArt, imageBase64: fileReader.result, width: canvasParams.width, isError: false});
        };
        const blob = await canvas.convertToBlob();
        fileReader.readAsDataURL(blob);
    }
    catch (error) {
        postMessage({isError: true, errorName: error.constructor.name, tukiArt})
    }
};
