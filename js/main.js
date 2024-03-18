
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let monoCanvas = null;
let resultVideoContext = null;
let timer = 0;
let isVideoParamChanged = false;

const MSG_NO_INPUT_DATA = 
`・変換したい文か画像を決めて生成ボタンを押してね！
・サイズが小さいとクオリティが低くなるよ！
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。
・UIをいろいろいじって大してテストせずにリリースしたからバグったらゴメンね。(24/03/16)`;
const MSG_ERROR = "生成に失敗したよ！ごめんね！";
const MSG_FAILURE_TEXT_MONO = "文字数が多すぎて一次加工で失敗したよ。減らしてね。";
const MSG_FAILURE_IMAGE_MONO = "画像サイズが大きすぎて一次加工で失敗したよ。減らしてね。";
let MSG_TOO_MANY_CHARA = "";
const MSG_TOO_MANY_CHARA_PC = 
`文字が多すぎて完成イメージが作れなかったよ。
でもテキストデータだけは生きてるからコピーボタンかダウンロードボタンから取得できるよ。
クオリティが低下しても完成イメージが見たい場合はサイズを小さくしてね。
ちなみに開発当時は文字をそのまま表示するスタンスだったけどスマホだと激重だったからやめたよ。`;
const MSG_TOO_MANY_CHARA_MOBILE = 
`文字が多すぎて完成イメージが作れなかったよ。
でもテキストデータだけは生きてるからコピーボタンで取得できるよ。
クオリティが低下しても完成イメージが見たい場合はサイズを小さくしてね。
ちなみに開発当時は文字をそのまま表示するスタンスだったけどスマホだと激重だったからやめたよ。`;

const mobileGenerateBtnWidth = "110px";
const mobileCopyBtnWidth = "126px"; // 生成ボタンのwidthとpaddingを足した値

const App = {
    components: {
        PlusMinusInputNumbur
    },
    data() {
        return {
            isDebug: false,
            debugText: debugText,
            canCopyButtonClick: true,
            resultMessage: MSG_NO_INPUT_DATA,
            tukiArt: "",
            tukiArtType: "none", // "none" | "text" | "image" | "video"
            shouldDisplayMonochromeImage: false,
            needDetailConfigLetterSpacingLevel: false,
            needDetailConfigTukiArtMargin: false,
            shouldShrinkImage: true,
            mode: "text", // "text" | "image" | "video"

            text: "",
            fontFamily: "serif", // "default" | "sans" | "serif"
            tukiCount: 13, // Twitterが絵文字13文字で改行されるから
            tukiCountMin: 10,
            tukiCountMax: 50,
            letterSpacingLevel: 3,
            letterSpacingLevelDefault: 3,
            isBold: false,
            isTate: true,
            wasTate: true,

            imageFile: null,
            videoFile: null,
            fileReader: new FileReader(),

            isTextYokoLinePowerUp: true,
            isTextTateLinePowerUp: true,
            isImageYokoLinePowerUp: false,
            isImageTateLinePowerUp: false,
            isVideoYokoLinePowerUp: false,
            isVideoTateLinePowerUp: false,

            imageColorCount: 3,
            videoColorCount: 3,
            useImageNanameMikaduki: true,
            useVideoNanameMikaduki: true,
            imageBaseAverageColor: 110,
            videoBaseAverageColor: 110,
            baseAverageColorMin: COLOR_B,
            baseAverageColorMax: COLOR_SW,
            imageBaseColorDistance: 30,
            videoBaseColorDistance: 30,
            baseColorDistanceMin: 0,
            baseColorDistanceMax: 200,
            needImageOutline: true,
            needVideoOutline: true,

            isTextColorReverse: true,
            isImageColorReverse: false,
            isVideoColorReverse: false,

            imageWidthOri: 100,
            imageHeightOri: 0,
            imageWidth: 100,
            imageWidthMin: 10,
            imageWidthMax: 5000,

            tukiArtMarginTop: 0,
            tukiArtMarginBottom: 0,
            tukiArtMarginLeft: 0,
            tukiArtMarginRight: 0,
            tukiArtMarginMin: -20,
            tukiArtMarginMax: 20,

            isLoadingInputImage: false,
            isGeneratingTukiArt: false,

            isMobile: false,
            canUseContextLetterSpacing: false,
        }
    },
    created() {
        const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
        const isMobileByUa = mobileRegex.test(navigator.userAgent);;
        const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
        this.isMobile = isMobileByUa || isMobileByClientHint;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        this.canUseContextLetterSpacing = "letterSpacing" in context;

        // デバッグ用 & PCでスマホのUIを確認したい
        const params = (new URL(window.location.href)).searchParams;
        this.isDebug = params.has("d");
        if (!this.isMobile) {
            this.isMobile = params.has("m");
        }

        MSG_TOO_MANY_CHARA = this.isMobile ? MSG_TOO_MANY_CHARA_MOBILE : MSG_TOO_MANY_CHARA_PC;
    },
    mounted() {
        if (this.isDebug) {
            // this.shouldDisplayMonochromeImage = true;
            this.text = "ピピコピコピコピコピッピ！";
            // this.tukiCount = 10;
            // this.letterSpacingLevel = 1;
            // // this.fontFamily = "sans";
            // this.fontFamily = "serif";
            // // this.fontFamily = "default";
            // this.isBold = true;
            // this.isTextYokoLinePowerUp = true;
            // this.isTextTateLinePowerUp = true;
            this.isTate = false;
            // this.isMobile = true;
        }

        if (this.isMobile) {
            this.$refs.generateBtn.style.width = mobileGenerateBtnWidth;
            this.$refs.copyBtnWrapper.style.width = mobileCopyBtnWidth;
            this.$refs.copyBtn.style.width = mobileCopyBtnWidth;
        }

        this.$refs.monochrome.style.width = "100%";
        this.$refs.resultImage.style.width = "100%";

        resultVideoContext = this.$refs.resultVideo.getContext("2d");
    },
    watch: {
        isGeneratingTukiArt(newVal) {
            if (newVal) {
                this.$refs.processing.style.display = "";
            }
            else {
                this.$refs.processing.style.display = "none";
            }
        },
        isVideoYokoLinePowerUp() {
            isVideoParamChanged = true;
        },
        isVideoTateLinePowerUp() {
            isVideoParamChanged = true;
        },
        videoColorCount() {
            isVideoParamChanged = true;
        },
        useVideoNanameMikaduki() {
            isVideoParamChanged = true;
        },
        videoBaseAverageColor() {
            isVideoParamChanged = true;
        },
        videoBaseColorDistance() {
            isVideoParamChanged = true;
        },
        needVideoOutline() {
            isVideoParamChanged = true;
        },
        isVideoColorReverse() {
            isVideoParamChanged = true;
        },
    },
    methods: {
        onChangeInputImageFile(e) {
            if (this.isLoadingInputImage) {
                return;
            }
            this.isLoadingInputImage = true;

            this.imageFile = e.target.files[0];
            e.target.value = "";

            if (!this.imageFile.type.startsWith("image")) {
                alert("画像ファイルを選択してください");
                this.imageFile = null;
                this.imageWidth = this.imageWidthMin;
                this.isLoadingInputImage = false;
                return;
            }

            const img = new Image();
            img.onload = () => {
                if (img.width < this.imageWidthMin || img.width > this.imageWidthMax) {
                    alert(`画像の幅は${this.imageWidthMin}px以上${this.imageWidthMax}px以下の必要があります`);
                    this.$refs.inputImageFile.value = "";
                    this.imageFile = null;
                    this.imageWidth = this.imageWidthMin;
                }
                else {
                    this.imageWidth = this.imageWidthOri = img.width;
                    this.imageHeightOri = img.height;
                }
                
                URL.revokeObjectURL(img.src);
                this.isLoadingInputImage = false;
            };
            img.onerror = () => {
                alert("画像の読み込みに失敗しました");
                this.$refs.inputImageFile.value = "";
                this.imageFile = null;
                this.imageWidth = this.imageWidthMin;
                URL.revokeObjectURL(img.src);
                this.isLoadingInputImage = false;
            };

            img.src = URL.createObjectURL(this.imageFile);
        },
        onChangeInputVideoFile(e) {
            this.videoFile = e.target.files[0];
            e.target.value = "";

            if (!this.videoFile.type.startsWith("video")) {
                alert("動画ファイルを選択してください");
                this.videoFile = null;
                return;
            }
        },
        onChangeFontFamily(e) {
            if (e.target.value === "serif") {
                this.isBold = false;
                this.isTextYokoLinePowerUp = true;
                this.isTextTateLinePowerUp = true;
            }
            else {
                this.isBold = true;
                this.isTextYokoLinePowerUp = false;
                this.isTextTateLinePowerUp = false;
            }
        },
        onClickResetButton() {
            if (this.mode === "text") {
                const tmpText = this.text;

                this.text = "";
                this.tukiCount = 13;
                this.letterSpacingLevel = 3;
                this.fontFamily = "serif";
                this.isBold = false;
                this.isTextYokoLinePowerUp = true;
                this.isTextTateLinePowerUp = true;
                this.isTextColorReverse = true;
                this.tukiArtMarginTop = 0;
                this.tukiArtMarginBottom = 0;
                this.tukiArtMarginLeft = 0;
                this.tukiArtMarginRight = 0;
                
                this.generateTukiArt();
                this.text = tmpText;
            }
            else if (this.mode === "image") {
                const tmpFile = this.imageFile;

                this.imageFile = null;
                this.imageColorCount = 3;
                this.useImageNanameMikaduki = true;
                this.imageBaseAverageColor = 110;
                this.imageBaseColorDistance = 30;
                this.needImageOutline = true;
                this.isImageColorReverse = false;
                this.imageWidth = this.imageWidthOri;
                this.isImageYokoLinePowerUp = false;
                this.isImageTateLinePowerUp = false;
                this.shouldDisplayMonochromeImage = false;

                this.generateTukiArt();
                this.imageFile = tmpFile;
            }
            else if (this.mode === 'video') {
                clearInterval(timer);
                monoCanvas = null;
                URL.revokeObjectURL(this.$refs.video.src);
                this.$refs.resultVideo.width = 0;
                this.$refs.resultVideo.height = 0;

                const tmpFile = this.videoFile;
                this.videoFile = null;

                this.generateTukiArt();
                this.videoFile = tmpFile;
            }
        },
        // 生成ボタン押下時
        onClickGenerateButton() {
            this.generateTukiArt();
        },
        onClickCopyButton() {
            if (!this.canCopyButtonClick) {
                return;
            }
            this.canCopyButtonClick = false;

            navigator.clipboard.writeText(this.tukiArt);
            
            this.$refs.copyMessage.classList.add("display-copy-message");
            if (this.isMobile) {
                this.$refs.copyMessage.style.left = `calc(-1 * (100px - ${mobileCopyBtnWidth}) / 2)`;
            }
            setTimeout(() => {
                this.$refs.copyMessage.classList.remove("display-copy-message");
                if (this.isMobile) {
                    this.$refs.copyMessage.style.left = "";
                }
                this.canCopyButtonClick = true;
            }, 2000);
        },
        onClickDownLoadTextButton() {
            if (this.tukiArt === "") {
                return;
            }
            const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
            const blob = new Blob([bom, this.tukiArt], {type:"text/plan"});
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `moon_art${getStrCurrentDateTime()}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        onClickDownLoadImageButton() {
            if (this.tukiArt === "") {
                return;
            }
            const link = document.createElement("a");
            link.href = this.$refs.resultImage.src;
            link.download = `moon_art${getStrCurrentDateTime()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        clearResult() {
            URL.revokeObjectURL(this.$refs.monochrome.src);
            URL.revokeObjectURL(this.$refs.resultImage.src);
            this.$refs.monochrome.src = "";
            this.$refs.resultImage.src = "";
        },
        generateTukiArt() {
            if (
                this.isGeneratingTukiArt ||
                this.mode === "image" && this.isLoadingInputImage
            ) {
                return;
            }
            this.isGeneratingTukiArt = true;

            if (this.tukiArtType === "video") {
                clearInterval(timer);
                monoCanvas = null;
                URL.revokeObjectURL(this.$refs.video.src);
                this.$refs.resultVideo.width = 0;
                this.$refs.resultVideo.height = 0;
            }

            this.resultMessage = "";
            
            if (this.mode === "text") {
                monoCanvas = new MonochromeCanvas();

                if (this.text === "") {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    return;
                }
                try {
                    const letterSpacingLevel = this.needDetailConfigLetterSpacingLevel ? this.letterSpacingLevel : this.letterSpacingLevelDefault;

                    monoCanvas.text(this.text, this.fontFamily, this.tukiCount, this.isBold, this.isTate, letterSpacingLevel);
                    this.tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isTextColorReverse, this.isTextYokoLinePowerUp, this.isTextTateLinePowerUp, 2);

                    if (this.needDetailConfigTukiArtMargin) {
                        const tukiArtMargin = {
                            top: this.tukiArtMarginTop, bottom: this.tukiArtMarginBottom,
                            left: this.tukiArtMarginLeft, right: this.tukiArtMarginRight
                        };
                        this.tukiArt = TukiArtGenerator.applyMargin(this.tukiArt, tukiArtMargin, this.isTextColorReverse);
                    }

                    try {
                        this.displayTukiArt();
                        this.tukiArtType = this.mode;
                    }
                    catch (e) {
                        console.error(e);
                        this.resultMessage = MSG_TOO_MANY_CHARA;
                        this.tukiArtType = "none";
                        this.clearResult();
                    }
                    this.wasTate = this.isTate;
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                }
                catch(e) {
                    console.error(e);
                    if (e.constructor === TooLargeCanvasError) {
                        this.resultMessage = MSG_FAILURE_TEXT_MONO;
                    }
                    else {
                        this.resultMessage = MSG_ERROR;
                    }
                    this.tukiArtType = "none";
                    this.clearResult();
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                }
            }
            else if (this.mode === "image") {
                monoCanvas = new MonochromeCanvas();

                if (this.imageFile == null || this.imageWidth === 0) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    return;
                }

                this.fileReader.onload = () => {
                    monoCanvas.image(
                        this.fileReader.result,
                        this.imageWidth,
                        Math.round(this.imageHeightOri * this.imageWidth / this.imageWidthOri),
                        this.imageBaseAverageColor,
                        this.needImageOutline,
                        this.imageBaseColorDistance,
                        this.imageColorCount,
                        this.useImageNanameMikaduki,
                        this.isImageColorReverse
                    ).then(() => {
                        this.tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isImageColorReverse, this.isImageYokoLinePowerUp, this.isImageTateLinePowerUp, this.imageColorCount, this.useImageNanameMikaduki);
                        try {
                            this.displayTukiArt();
                            this.tukiArtType = this.mode;
                        }
                        catch (e) {
                            console.error(e);
                            this.resultMessage = MSG_TOO_MANY_CHARA;
                            this.tukiArtType = "none";
                            this.clearResult();
                        }
                        this.wasTate = false;
                        monoCanvas = null;
                        this.isGeneratingTukiArt = false;
                    }).catch(e => {
                        console.error(e);
                        if (e.constructor === TooLargeCanvasError) {
                            this.resultMessage = MSG_FAILURE_IMAGE_MONO;
                        }
                        else {
                            this.resultMessage = MSG_ERROR;
                        }
                        this.tukiArtType = "none";
                        this.clearResult();
                        monoCanvas = null;
                        this.isGeneratingTukiArt = false;
                    });
                };
                this.fileReader.onerror = () => {
                    this.resultMessage = MSG_ERROR;
                    this.tukiArtType = "none";
                    this.clearResult();
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                };

                this.fileReader.readAsDataURL(this.imageFile);
            }
            else if (this.mode === "video") {
                if (this.videoFile == null) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                    return;
                }

                const video = this.$refs.video;
                let isVideoStopped = true;

                video.onloadeddata = () => {
                    monoCanvas = new MonochromeCanvas();

                    video.volume = 0.2;

                    this.$refs.resultVideo.style.maxWidth = (video.videoWidth < 1200 ? video.videoWidth : 1200) + "px";
                    
                    let isFirst = true;
                    const maxArea = 400 * 300; // 軽い
                    // const maxArea = 800 * 450; // 多分大丈夫
                    const rate = video.videoHeight / video.videoWidth;
                    const resizeVideoWidth = Math.floor(Math.sqrt(maxArea / rate));
                    const resizeVideoHeight = resizeVideoWidth * rate;
                    let font = "";
                    let lineHeight = 0;

                    const drawTukiArtFrame = () => {
                        monoCanvas.video(
                            video,
                            resizeVideoWidth,
                            resizeVideoHeight,
                            this.videoBaseAverageColor, 
                            this.needVideoOutline,
                            this.videoBaseColorDistance,
                            this.videoColorCount,
                            this.useVideoNanameMikaduki,
                            this.isVideoColorReverse
                        );

                        const tukiArt = TukiArtGenerator.createTukiArt(
                            monoCanvas.pixels,
                            this.isVideoColorReverse,
                            this.isVideoYokoLinePowerUp,
                            this.isVideoTateLinePowerUp, 
                            this.videoColorCount,
                            this.useVideoNanameMikaduki
                        );

                        ({font, lineHeight} = TukiArtGenerator.createTukiArtCanvas(tukiArt, this.$refs.resultVideo, resultVideoContext, font, lineHeight, isFirst));
                    };

                    video.onseeked = () => {
                        drawTukiArtFrame();
                    };

                    isVideoParamChanged = false;

                    timer = setInterval(() => {
                        if (!isFirst && isVideoStopped && !isVideoParamChanged) {
                            return;
                        }
                        isVideoParamChanged = false;
                        drawTukiArtFrame();
                        if (isFirst) {
                            isFirst = false;
                        }
                    }, 1000/30);

                    this.tukiArtType = this.mode;
                    this.isGeneratingTukiArt = false;
                };
                video.onerror = () => {
                    alert("動画の読み込みに失敗しました");
                    this.resultMessage = MSG_ERROR;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.$refs.inputVideoFile.value = "";
                    this.videoFile = null;
                    URL.revokeObjectURL(video.src);
                    this.isGeneratingTukiArt = false;
                };
                video.onpause = () => {
                    isVideoStopped = true;
                };
                video.onplay = () => {
                    isVideoStopped = false;
                };
                
                video.src = URL.createObjectURL(this.videoFile);
            }
        },
        displayTukiArt() {
            URL.revokeObjectURL(this.$refs.monochrome.src);
            URL.revokeObjectURL(this.$refs.resultImage.src);

            this.$refs.monochrome.src = monoCanvas.canvas.toDataURL("image/png");
            this.$refs.monochrome.style.maxWidth = monoCanvas.canvas.width + "px";

            const {canvas: tukiArtCanvas} = TukiArtGenerator.createTukiArtCanvas(this.tukiArt);
            this.$refs.resultImage.src = tukiArtCanvas.toDataURL("image/png");
            this.$refs.resultImage.style.maxWidth = tukiArtCanvas.width + "px";
            
            // this.debugText = debugText;
        }
    }
};

Vue.createApp(App).mount("#app");
