importScripts("../create_canvas_size_test.js");
importScripts("../constants.js");
importScripts("../canvas_utils.js");
importScripts("../custom_errors.js");
importScripts("../monochrome_canvas.js");
importScripts("../tuki_art_generator.js");

onmessage = async evnt => {
    let tukiArt = "";
    try {
        canvasSizeTest = createCanvasSizeTest(evnt.data.canvasMaxWidth, evnt.data.canvasMaxHeight, evnt.data.canvasMaxArea);

        const prm = evnt.data.tukiArtParams;
        const monoCanvas = new MonochromeCanvas();

        monoCanvas.image(
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
        
        let monoBase64 = "";
        await new Promise(async resolve => {
            const fr = new FileReader();
            fr.onload = () => {
                monoBase64 = fr.result;
                resolve();
            };
            fr.onerror = () => {
                resolve();
            };
            const monoBlob = await monoCanvas.canvas.convertToBlob();
            fr.readAsDataURL(monoBlob);
        });
        
        const fr = new FileReader();
        fr.onload = () => {
            postMessage({tukiArt, monoBase64, resultBase64: fr.result, isError: false});
        };
        const blob = await canvas.convertToBlob();
        fr.readAsDataURL(blob);
    }
    catch (error) {
        console.error(error);
        postMessage({isError: true, tukiArt})
    }
};
