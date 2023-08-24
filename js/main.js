
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let monoCanvas = null;
let tukiArtGenerator = new TukiArtGenerator();

const MSG_NO_INPUT_DATA = `変換したい文か画像を決めて生成ボタンを押してね！
サイズが小さいとクオリティが低くなるよ！ごめんね！
ちなみにYouTubeに月文字を書き込むとスパム判定で表示されないよ！
不謹慎な言葉を表示できちゃうからだろうね！
あと、まだ開発中だから多少の不具合は大目に見てね！`;
const MSG_ERROR = "生成に失敗したよ！ごめんね！";

const App = {
    data() {
        return {
            isDebug: false,
            debugText: debugText,
            timer: null,
            toggle: false, // この値自体には何の関心もない。ただのCSSの制御に利用する。
            resultMessage: MSG_NO_INPUT_DATA,
            shouldDisplayMonochromeImage: false,
            mode: "text", // "text" | "image"
            text: "",
            fontFamily: "default",
            tukiCount: 13,
            tukiCountPrev: 13,
            tukiCountMin: 10,
            tukiCountMax: 50,
            isBold: true,
            isTate: true,
            wasTate: true,
            isTextYokoLinePowerUp: false,
            isTextTateLinePowerUp: false,
            isImageYokoLinePowerUp: false,
            isImageTateLinePowerUp: false,
            file: null,
            fileReader: new FileReader(),
            baseAverageColor: 90,
            baseAverageColorPrev: 90,
            baseAverageColorMin: 0,
            baseAverageColorMax: 255,
            baseColorDistance: 50,
            baseColorDistancePrev: 50,
            baseColorDistanceMin: 0,
            baseColorDistanceMax: 200,
            needOutline: true,
            isTextColorReverse: true,
            isImageColorReverse: false,
            imageWidthOri: 0,
            imageHeightOri: 100,
            imageWidth: 100,
            imageWidthPrev: 100,
            imageWidthMin: 100,
            imageWidthMax: 3000,
            imageSizeRate: 1,
            imageSizeRatePrev: 1,
            imageSizeRateMin: 0.1,
            imageSizeRateMax: Math.floor(3000 * 10 / 100) / 10, // Math.floor(imageWidthMax * 10 / imageWidthMin) / 10
        }
    },
    created() {
        const params = (new URL(window.location.href)).searchParams;
        this.isDebug = params.get("isDebug") === "true";
    },
    mounted() {
        monoCanvas = new MonochromeCanvas(this.$refs.canvas);
        if (this.isDebug) {
            this.shouldDisplayMonochromeImage = true;
            this.text = "草生える。";
            this.tukiCount = 13;
            // this.fontFamily = "sans";
            this.fontFamily = "serif";
            this.isTate = true;
        }
    },
    watch: {
        tukiCount(newVal) {
            if (newVal === "") return; this.tukiCountPrev = newVal;
        },
        fontFamily(newVal) {
            if (newVal === "serif") {
                this.isTextYokoLinePowerUp = true;
                this.isTextTateLinePowerUp = true;
            }
            else {
                this.isTextYokoLinePowerUp = false;
                this.isTextTateLinePowerUp = false;
            }
        },
        baseAverageColor(newVal) {
            if (newVal === "") return; this.baseAverageColorPrev = newVal;
        },
        baseColorDistance(newVal) {
            if (newVal === "") return; this.baseColorDistancePrev = newVal;
        },
        imageWidth(newVal) {
            if (newVal === "") return; this.imageWidthPrev = newVal;
        },
        imageSizeRate(newVal) {
            if (newVal === "") return; this.imageSizeRatePrev = newVal;
        }
    },
    methods: {
        onChangeInputFile(e) {
            this.file = e.target.files[0];

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
                    this.imageSizeRateMin = Math.ceil(this.imageWidthMin * 10 / this.imageWidth) / 10;
                    this.imageSizeRateMax = Math.floor(this.imageWidthMax * 10 / this.imageWidth) / 10;
                }
                this.imageSizeRate = 1;
                
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
            };

            img.src = URL.createObjectURL(this.file);
        },
        onBlurTukiCountNumber(e) {
            if (e.target.value === "") {
                this.tukiCount = this.tukiCountPrev;
                return;
            }
            this.tukiCount = this.rangeCorrection(
                Number(e.target.value),
                this.tukiCountMin,
                this.tukiCountMax
            );
        },
        onBlurBaseAverageColorNumber(e) {
            if (e.target.value === "") {
                this.baseAverageColor = this.baseAverageColorPrev;
                return;
            }
            this.baseAverageColor = this.rangeCorrection(
                Number(e.target.value),
                this.baseAverageColorMin,
                this.baseAverageColorMax
            );
        },
        onBlurBaseColorDistanceNumber(e) {
            if (e.target.value === "") {
                this.baseColorDistance = this.baseColorDistancePrev;
                return;
            }
            this.baseColorDistance = this.rangeCorrection(
                Number(e.target.value),
                this.baseColorDistanceMin,
                this.baseColorDistanceMax
            );
        },
        onBlurImageWidth(e) {
            if (e.target.value === "") {
                this.imageWidth = this.imageWidthPrev;
                return;
            }
            this.imageWidth = this.rangeCorrection(
                Number(e.target.value),
                this.imageWidthMin,
                this.imageWidthMax
            );
            if (this.file !== null) {
                this.imageSizeRate = Math.floor(this.imageWidth * 10 / this.imageWidthOri) / 10;
            }
        },
        onBlurImageSizeRate(e) {
            if (e.target.value === "") {
                this.imageSizeRate = this.imageSizeRatePrev;
                return;
            }
            this.imageSizeRate = this.rangeCorrection(
                Number(e.target.value),
                this.imageSizeRateMin,
                this.imageSizeRateMax
            );
            if (this.file !== null) {
                this.imageWidth = Math.round(this.imageWidthOri * this.imageSizeRate);
            }
        },
        // 生成ボタン押下時
        onClickGenerateButton() {
            this.resultMessage = "";
            if (this.mode === "text") {
                if (this.text === "") {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    return;
                }
                try {
                    monoCanvas.text(this.text, this.fontFamily, this.tukiCount, this.isBold, this.isTate);
                    const tukiArt = tukiArtGenerator.generate(monoCanvas.pixels, this.isTextColorReverse, this.isTextYokoLinePowerUp, this.isTextTateLinePowerUp);
                    this.displayTukiArt(tukiArt);
                }
                catch(e) {
                    console.error(e);
                    this.resultMessage = MSG_ERROR;
                }
            }
            else if (this.mode === "image") {
                if (this.file == null || this.imageWidth === 0) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    return;
                }
            
                this.fileReader.readAsDataURL(this.file);
            
                this.fileReader.onload = () => {
                    monoCanvas.image(
                        this.fileReader.result,
                        this.imageWidth,
                        Math.round(this.imageHeightOri * this.imageWidth / this.imageWidthOri),
                        this.baseAverageColor,
                        this.needOutline,
                        this.baseColorDistance
                    ).then(() => {
                        this.displayTukiArt(tukiArtGenerator.generate(monoCanvas.pixels, this.isImageColorReverse, this.isImageYokoLinePowerUp, this.isImageTateLinePowerUp));
                    }).catch(e => {
                        console.error(e);
                        this.resultMessage = MSG_ERROR;
                    });
                };
                this.fileReader.onerror = () => {
                    this.resultMessage = MSG_ERROR;
                };
            }
        },
        onClickCopyButton() {
            navigator.clipboard.writeText(this.$refs.result.value);
            this.toggle = !this.toggle;
        },
        rangeCorrection(val, min, max) {
            if (val < min) {
                return min;
            }
            else if (val > max) {
                return max;
            }
            return val;
        },
        displayTukiArt(tukiArt) {
            this.$refs.calcWidth.textContent = tukiArt.substring(0, tukiArt.indexOf("\n")); // 必ず"\n"が存在する
            this.$refs.result.style.width = `${this.$refs.calcWidth.clientWidth + 50}px`;
            this.$refs.result.style.height = "auto";
            this.$refs.result.value = tukiArt;
            this.$refs.result.style.height = `${this.$refs.result.scrollHeight}px`;
            this.$refs.calcWidth.textContent = "";

            if (this.mode === "text") {
                this.wasTate = this.isTate;
            }
            else {
                this.wasTate = false;
            }

            this.debugText = debugText;
        }
    }
};

Vue.createApp(App).mount("#app");
