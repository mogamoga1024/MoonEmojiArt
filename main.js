
let monoCanvas = null;
let tukiArtGenerator = new TukiArtGenerator();

const App = {
    data() {
        return {
            isDebug: false,
            existsTukiArt: false,
            timer: null,
            toggle: false, // この値自体には何の関心もない。ただのCSSの制御に利用する。
            mode: "text", // "text" | "image"
            text: "",
            fontFamily: "default",
            fontSize: 60,
            fontSizePrev: 60,
            fontSizeMin: 50,
            fontSizeMax: 200,
            isBold: true,
            isTate: true,
            wasTate: true,
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
            // this.text = "あっ、はい。";
            // this.text = "あ";
            // this.text = "一あ一あ一";
            // this.text = "あ「あ」1「1」1";
            this.text = "「";
            this.fontSize = 80;
            this.fontFamily = "sans";
            // ↓ フォントのロードが終わっていないとフォントが反映されないっぽい？
            // monoCanvas.text(this.text, this.fontFamily, this.fontSize, this.isBold, this.isTate);
            // this.displayTukiArt(tukiArtGenerator.generate(monoCanvas.pixels, true));
        }
    },
    watch: {
        fontSize(newVal) {
            if (newVal === "") return; this.fontSizePrev = newVal;
        },
        fontFamily(newVal) {
            if (newVal === "default") {
                return;
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
        onBlurFontSizeNumber(e) {
            if (e.target.value === "") {
                this.fontSize = this.fontSizePrev;
                return;
            }
            this.fontSize = this.rangeCorrection(
                Number(e.target.value),
                this.fontSizeMin,
                this.fontSizeMax
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
            if (this.mode === "text") {
                if (this.text === "") {
                    return;
                }
                
                monoCanvas.text(this.text, this.fontFamily, this.fontSize, this.isBold, this.isTate);
                this.displayTukiArt(tukiArtGenerator.generate(monoCanvas.pixels, this.isTextColorReverse));
            }
            else if (this.mode === "image") {
                if (this.file == null || this.imageWidth === 0) {
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
                        this.displayTukiArt(tukiArtGenerator.generate(monoCanvas.pixels, this.isImageColorReverse));
                    });
                }
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

            this.existsTukiArt = true;

            if (this.mode === "text") {
                this.wasTate = this.isTate;
            }
            else {
                this.wasTate = false;
            }
        }
    }
};

Vue.createApp(App).mount("#app");
