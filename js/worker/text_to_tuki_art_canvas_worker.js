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

        monoCanvas.text(evnt.data.imageData, prm.tukiCount, prm.isTate);
        tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, prm.isTextColorReverse, prm.isTextYokoLinePowerUp, prm.isTextTateLinePowerUp, prm.isTextYokoTopLinePowerUp, prm.isTextYokoBottomLinePowerUp, 2);

        if (prm.needDetailConfigTukiArtMargin) {
            const tukiArtMargin = {
                top: prm.tukiArtMarginTop, bottom: prm.tukiArtMarginBottom,
                left: prm.tukiArtMarginLeft, right: prm.tukiArtMarginRight
            };
            tukiArt = TukiArtGenerator.applyMargin(tukiArt, tukiArtMargin, prm.isTextColorReverse);
        }

        const textList = tukiArt.split("\n");

        const canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
        const canvas = new OffscreenCanvas(canvasParams.width, canvasParams.height);
        const context = canvas.getContext("2d", { willReadFrequently: true });
        TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, context);

        const fileReader = new FileReader();
        fileReader.onload = () => {
            postMessage({tukiArt, resultBase64: fileReader.result, isError: false});
        };
        const blob = await canvas.convertToBlob();
        fileReader.readAsDataURL(blob);
    }
    catch (error) {
        console.error(error);
        postMessage({isError: true, tukiArt})
    }
};
