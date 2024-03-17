
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let monoCanvas = null;

const MSG_NO_INPUT_DATA = 
`・変換したい文か画像を決めて生成ボタンを押してね！
・サイズが小さいとクオリティが低くなるよ！
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。
・UIをいろいろいじって大してテストせずにリリースしたからバグったらゴメンね。(24/03/16)`;
const MSG_ERROR = "生成に失敗したよ！ごめんね！";
const MSG_FAILURE_TEXT_MONO = "文字数が多すぎて一次加工で失敗したよ。減らしてね。";
const MSG_FAILURE_IMAGE_MONO = "画像サイズが大きすぎて一次加工で失敗したよ。減らしてね。";
const MSG_TOO_MANY_CHARA = 
`文字が多すぎて完成イメージが作れなかったよ。
でもテキストデータだけは生きてるからコピーボタンかダウンロードボタンから取得できるよ。
クオリティが低下しても完成イメージが見たい場合はサイズを小さくしてね。
ちなみに開発当時は文字をそのまま表示するスタンスだったけどスマホだと激重だったからやめたよ。`;

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
            tukiArtType: "", // "text" | "image"
            shouldDisplayMonochromeImage: false,
            needDetailConfigLetterSpacingLevel: false,
            needDetailConfigTukiArtMargin: false,
            shouldShrinkImage: true,
            mode: "text", // "text" | "image"
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
            isTextYokoLinePowerUp: true,
            isTextTateLinePowerUp: true,
            isImageYokoLinePowerUp: false,
            isImageTateLinePowerUp: false,
            colorCount: 3,
            useNanameMikaduki: true,
            file: null,
            fileReader: new FileReader(),
            baseAverageColor: 110,
            baseAverageColorMin: COLOR_B,
            baseAverageColorMax: COLOR_SW,
            baseColorDistance: 30,
            baseColorDistanceMin: 0,
            baseColorDistanceMax: 200,
            needOutline: true,
            isTextColorReverse: true,
            isImageColorReverse: false,
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
            canDisplayTukiArt: false,

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

        const params = (new URL(window.location.href)).searchParams;
        this.isDebug = params.get("isDebug") === "true";
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

        this.$refs.monochrome.style.width = "100%";
        this.$refs.result.style.width = "100%";
    },
    watch: {
        isGeneratingTukiArt(newVal) {
            if (newVal) {
                this.$refs.processing.style.display = "";
            }
            else {
                this.$refs.processing.style.display = "none";
            }
        }
    },
    methods: {
        onChangeInputFile(e) {
            if (this.isLoadingInputImage) {
                return;
            }
            this.isLoadingInputImage = true;

            this.file = e.target.files[0];
            e.target.value = "";

            const img = new Image();
            img.onload = () => {
                if (img.width < this.imageWidthMin || img.width > this.imageWidthMax) {
                    alert(`画像の幅は${this.imageWidthMin}px以上${this.imageWidthMax}px以下の必要があります`);
                    this.$refs.inputFile.value = "";
                    this.file = null;
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
                this.$refs.inputFile.value = "";
                this.file = null;
                this.imageWidth = this.imageWidthMin;
                URL.revokeObjectURL(img.src);
                this.isLoadingInputImage = false;
            };

            img.src = URL.createObjectURL(this.file);
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
                const tmpFile = this.file;

                this.file = null;
                this.colorCount = 3;
                this.useNanameMikaduki = true;
                this.baseAverageColor = 110;
                this.baseColorDistance = 30;
                this.needOutline = true;
                this.isImageColorReverse = false;
                this.imageWidth = this.imageWidthOri;
                this.isImageYokoLinePowerUp = false;
                this.isImageTateLinePowerUp = false;
                this.shouldDisplayMonochromeImage = false;

                this.generateTukiArt();
                this.file = tmpFile;
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
            setTimeout(() => {
                this.$refs.copyMessage.classList.remove("display-copy-message");
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
            link.href = this.$refs.result.src;
            link.download = `moon_art${getStrCurrentDateTime()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        clearResult() {
            this.$refs.monochrome.src = 0;
            this.$refs.result.src = 0;
        },
        generateTukiArt() {
            if (
                this.isGeneratingTukiArt ||
                this.mode === "image" && this.isLoadingInputImage
            ) {
                return;
            }
            this.isGeneratingTukiArt = true;

            monoCanvas = new MonochromeCanvas();
            this.resultMessage = "";

            if (this.mode === "text") {
                if (this.text === "") {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.clearResult();
                    this.tukiArtType = this.mode;
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    this.canDisplayTukiArt = false;
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
                    }
                    catch (e) {
                        console.error(e);
                        this.resultMessage = MSG_TOO_MANY_CHARA;
                        this.canDisplayTukiArt = false;
                    }
                    this.wasTate = this.isTate;
                    this.tukiArtType = this.mode;
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
                    this.clearResult();
                    this.tukiArtType = this.mode;
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    this.canDisplayTukiArt = false;
                }
            }
            else if (this.mode === "image") {
                if (this.file == null || this.imageWidth === 0) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.clearResult();
                    this.tukiArtType = this.mode;
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    this.canDisplayTukiArt = false;
                    return;
                }
            
                this.fileReader.readAsDataURL(this.file);
            
                this.fileReader.onload = () => {
                    monoCanvas.image(
                        this.fileReader.result,
                        this.imageWidth,
                        Math.round(this.imageHeightOri * this.imageWidth / this.imageWidthOri),
                        Number(this.baseAverageColor), // todo Numberはいらない。と思うが、不安なので放置。時間があったら確かめる。
                        this.needOutline,
                        this.baseColorDistance,
                        this.colorCount,
                        this.useNanameMikaduki,
                        this.isImageColorReverse
                    ).then(() => {
                        this.tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isImageColorReverse, this.isImageYokoLinePowerUp, this.isImageTateLinePowerUp, this.colorCount, this.useNanameMikaduki);
                        try {
                            this.displayTukiArt();
                        }
                        catch (e) {
                            console.error(e);
                            this.resultMessage = MSG_TOO_MANY_CHARA;
                            this.canDisplayTukiArt = false;
                        }
                        this.wasTate = false;
                        this.tukiArtType = this.mode;
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
                        this.clearResult();
                        this.tukiArtType = this.mode;
                        monoCanvas = null;
                        this.isGeneratingTukiArt = false;
                        this.canDisplayTukiArt = false;
                    });
                };
                this.fileReader.onerror = () => {
                    this.resultMessage = MSG_ERROR;
                    this.clearResult();
                    this.tukiArtType = this.mode;
                    monoCanvas = null;
                    this.isGeneratingTukiArt = false;
                    this.canDisplayTukiArt = false;
                };
            }
        },
        displayTukiArt() {
            this.$refs.monochrome.src = monoCanvas.canvas.toDataURL("image/png");
            this.$refs.monochrome.style.maxWidth = monoCanvas.canvas.width + "px";

            const tukiArtCanvas = TukiArtGenerator.createTukiArtCanvas(this.tukiArt);
            this.$refs.result.src = tukiArtCanvas.toDataURL("image/png");
            this.$refs.result.style.maxWidth = tukiArtCanvas.width + "px";
            
            this.canDisplayTukiArt = true;

            // this.debugText = debugText;
        }
    }
};

Vue.createApp(App).mount("#app");
