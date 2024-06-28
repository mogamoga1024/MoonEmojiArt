
let isDebug = false;

let appTitleClickCount = 0;

let tukiArt = "";

let canCopyButtonClick = true;

let isLoadingInputImage = false;
let isLoadingInputVideo = false;

let isSvg = false;

let videoTimerId = 0;
let isVideoParamChanged = false;

const MSG_非表示 = "";
let MSG_月ジェネの説明 = 
`・変換したい文か画像を入れてね！
・サイズを大きくするとクオリティが上がるよ！
・どうしても巨大な月文字を作りたい人はタイトル部分を2連打してね。
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。`;
const MSG_月ジェネの説明_裏 = 
`・・変換したい文か画像を入れてね！
・サイズを大きくするとクオリティが上がるよ！
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。`;
const MSG_エラー = "生成に失敗したよ！ごめんね！";
const MSG_テキストが大きすぎてキャンバスが作れなかった_縦 = "月文字のサイズが大きすぎて作れなかったよ。\n幅文字数か変換したい文を減らしてね。";
const MSG_テキストが大きすぎてキャンバスが作れなかった_横 = "月文字のサイズが大きすぎて作れなかったよ。\n高さ文字数か変換したい文を減らしてね。";
const MSG_画像サイズが大きすぎてキャンバスが作れなかった = "画像サイズが大きすぎて作れなかったよ。幅を減らしてね。";
const MSG_動画の画面サイズが大きすぎてキャンバスが作れなかった = "画面サイズが大きすぎて作れなかったよ。幅を減らしてね。";
let MSG_完成イメージが作れなかった = "";
const MSG_完成イメージが作れなかった_PC = 
`残念なことに完成イメージが作れなかったよ。
でもテキストデータだけは生きてるからコピーボタンかダウンロードボタンから取得できるよ。
クオリティが低下しても完成イメージが見たい場合はサイズを小さくしてね。
ちなみに開発当時は文字をそのまま表示するスタンスだったけどスマホだと激重だったからやめたよ。`;
const MSG_完成イメージが作れなかった_MOBILE = 
`残念なことに完成イメージが作れなかったよ。
でもテキストデータだけは生きてるからコピーボタンで取得できるよ。
クオリティが低下しても完成イメージが見たい場合はサイズを小さくしてね。
ちなみに開発当時は文字をそのまま表示するスタンスだったけどスマホだと激重だったからやめたよ。`;

const mobileGenerateBtnWidth = "110px";
const mobileCopyBtnWidth = "126px"; // 生成ボタンのwidthとpaddingを足した値

let prevText = "";
const textLengthSafeMax = 40;
const tukiCountSafeMaxDefault = 50;
const tukiCountUnSafeMaxDefault = 100;

const baseAverageColorDefault = 110;
const baseColorDistanceDefault = 30;

const imageWidthMaxDefault = 5000;
let imageWidthOri = 10;
let imageHeightRate = 1;

const videoWidthMaxDefault = 5000;
let videoWidthOri = 10;
let videoHeightRate = 1;

let worker = null;

let canvasMaxWidth = 0;
let canvasMaxHeight = 0;
let canvasMaxArea = 0;

const App = {
    components: {
        PlusMinusInputNumbur
    },
    data() {
        return {
            resultMessage: MSG_月ジェネの説明,
            tukiArtType: "none", // "none" | "text" | "image" | "video"
            shouldDisplayMonochromeImage: false,
            needDetailConfigLineWidth: false,
            needDetailConfigLetterSpacing: false,
            needDetailConfigTukiArtMargin: false,
            shouldShrinkImage: true,
            mode: "text", // "text" | "image" | "video"

            text: "",
            fontFamily: "noto-serif", // "default" | "noto-sans" | "noto-serif" | "sans" | "serif"
            tukiCount: 13, // Twitterが絵文字13文字で改行されるから
            tukiCountMin: 10,
            tukiCountMax: tukiCountSafeMaxDefault,
            letterSpacing: 0,
            letterSpacingMin: -20,
            letterSpacingMax: 20,
            lineWidth: 0,
            lineWidthMin: 0,
            lineWidthMax: 10,
            isBold: false,
            isTate: true,

            imageFileName: "",
            image: null,
            videoFile: null,

            isTextTateLinePowerUp: true,
            isTextYokoTopLinePowerUp: true,
            isTextYokoBottomLinePowerUp: true,

            isImageTateLinePowerUp: false,
            isImageYokoTopLinePowerUp: false,
            isImageYokoBottomLinePowerUp: false,

            isVideoTateLinePowerUp: false,
            isVideoYokoTopLinePowerUp: false,
            isVideoYokoBottomLinePowerUp: false,

            imageColorCount: 3,
            videoColorCount: 3,
            useImageNanameMikaduki: true,
            useVideoNanameMikaduki: true,
            imageBaseAverageColor: baseAverageColorDefault,
            videoBaseAverageColor: baseAverageColorDefault,
            baseAverageColorMin: COLOR_B,
            baseAverageColorMax: COLOR_SW,
            imageBaseColorDistance: baseColorDistanceDefault,
            videoBaseColorDistance: baseColorDistanceDefault,
            baseColorDistanceMin: 0,
            baseColorDistanceMax: 200,
            needImageOutline: true,
            needVideoOutline: true,

            isTextColorReverse: true,
            isImageColorReverse: false,
            isVideoColorReverse: false,

            imageWidth: imageWidthOri,
            imageWidthMin: imageWidthOri,
            imageWidthMax: imageWidthMaxDefault,

            videoWidth: videoWidthOri,
            videoWidthMin: videoWidthOri,
            videoWidthMax: videoWidthMaxDefault,

            fps: 30,
            fpsMin: 30,
            fpsMax: 120,

            tukiArtMarginTop: 0,
            tukiArtMarginBottom: 0,
            tukiArtMarginLeft: 0,
            tukiArtMarginRight: 0,
            tukiArtMarginMin: -20,
            tukiArtMarginMax: 20,

            canDisplayGenerateButton: false,
            isGeneratingTukiArt: false,

            canDisplayResultImageWidthRate: false,
            resultImageWidth: 0,
            resultImageWidthRate: 100,
            resultImageWidthRateMin: 10,
            resultImageWidthRateMax: 100,

            canDisplayResultVideoWidthRate: false,
            resultVideoWidth: 0,
            resultVideoWidthRate: 100,
            resultVideoWidthRateMin: 10,
            resultVideoWidthRateMax: 100,

            isMobile: false,
            canUseContextLetterSpacing: false,
            isSafety: true,
            moon: "🌑",
        }
    },
    async created() {
        const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
        const isMobileByUa = mobileRegex.test(navigator.userAgent);;
        const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
        this.isMobile = isMobileByUa || isMobileByClientHint;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        this.canUseContextLetterSpacing = "letterSpacing" in context;

        // デバッグ用 & PCでスマホのUIを確認したい
        const params = (new URL(window.location.href)).searchParams;
        isDebug = params.has("d");
        if (!this.isMobile) {
            this.isMobile = params.has("m");
        }

        MSG_完成イメージが作れなかった = this.isMobile ? MSG_完成イメージが作れなかった_MOBILE : MSG_完成イメージが作れなかった_PC;

        // エラー時のデフォ値の参考元：https://jhildenbiddle.github.io/canvas-size/#/?id=mobile
        const strCanvasMaxWidth = Cookies.get("canvasMaxWidth");
        if (strCanvasMaxWidth !== undefined) {
            canvasMaxWidth = Number(strCanvasMaxWidth);
        }
        else {
            try {
                canvasMaxWidth = (await canvasSize.maxWidth()).width;
                Cookies.set("canvasMaxWidth", String(canvasMaxWidth), {expires: 365});
            }
            catch (e) {
                canvasMaxWidth = 32767;
            }
        }
        const strCanvasMaxHeight = Cookies.get("canvasMaxHeight");
        if (strCanvasMaxHeight !== undefined) {
            canvasMaxHeight = Number(strCanvasMaxHeight);
        }
        else {
            try {
                canvasMaxHeight = (await canvasSize.maxHeight()).height;
                Cookies.set("canvasMaxHeight", String(canvasMaxHeight), {expires: 365});
            }
            catch (e) {
                canvasMaxHeight = 32767;
            }
        }
        const strCanvasMaxArea = Cookies.get("canvasMaxArea");
        if (strCanvasMaxArea !== undefined) {
            canvasMaxArea = Number(strCanvasMaxArea);
        }
        else {
            try {
                if (this.isMobile) {
                    const { width: maxAreaWidth, height: maxAreaHeight } = await canvasSize.maxArea({max: 16384});
                    canvasMaxArea = maxAreaWidth * maxAreaHeight;
                }
                else {
                    const { width: maxAreaWidth, height: maxAreaHeight } = await canvasSize.maxArea();
                    canvasMaxArea = maxAreaWidth * maxAreaHeight;
                }
                Cookies.set("canvasMaxArea", String(canvasMaxArea), {expires: 365});
            }
            catch (e) {
                canvasMaxArea = 10836 * 10836;
            }
        }
        canvasSizeTest = createCanvasSizeTest(canvasMaxWidth, canvasMaxHeight, canvasMaxArea);
    },
    mounted() {
        if (this.isMobile) {
            this.$refs.generateBtn.style.width = mobileGenerateBtnWidth;
            this.$refs.copyBtnWrapper.style.width = mobileCopyBtnWidth;
            this.$refs.copyBtn.style.width = mobileCopyBtnWidth;
        }

        if (isDebug) {
            // this.shouldDisplayMonochromeImage = true;
            this.text = "一三￥月文字";
            // this.tukiCount = 10;
            // // this.fontFamily = "sans";
            // this.fontFamily = "serif";
            // // this.fontFamily = "default";
            // this.isBold = true;
            // this.isTextTateLinePowerUp = false;
            // this.isTate = false;
            // this.isMobile = true;

            const timerId = setInterval(() => {
                if (canvasMaxArea !== 0) {
                    clearInterval(timerId);
                    this.onClickGenerateButton();
                }
            }, 100);
        }
    },
    watch: {
        mode(newVal) {
            if (
                newVal !== this.tukiArtType && (
                    newVal === "text" && this.text !== "" ||
                    newVal === "image" && this.image !== null ||
                    newVal === "video" && this.videoFile !== null
                )
            ) {
                this.canDisplayGenerateButton = true;
            }
            else {
                this.canDisplayGenerateButton = false;
            }
        },
        text(newVal) {
            if (newVal === "") {
                this.canDisplayGenerateButton = false;
            }
        },
        image(newVal) {
            if (newVal === null) {
                this.canDisplayGenerateButton = false;
                this.imageFileName = "";
            }
        },
        videoFile(newVal) {
            if (newVal === null) {
                this.canDisplayGenerateButton = false;
            }
        }
    },
    methods: {
        // 🌕🌕 タイトルのUIイベント 🌕🌕

        onClickAppTitle() {
            if (!this.isSafety) {
                this.changeSafety();
                return;
            }

            if (appTitleClickCount === 0) {
                setTimeout(() => {
                    appTitleClickCount = 0;
                }, 500);
            }

            appTitleClickCount++;

            if (appTitleClickCount >= 2) {
                this.changeSafety();
            }
        },

        // 🌕🌕 ファイル読み込みのUIイベント 🌕🌕

        onChangeInputImageFile(e) {
            if (isLoadingInputImage) {
                return;
            }
            isLoadingInputImage = true;

            const imageFile = e.target.files[0];
            e.target.value = "";

            if (!imageFile.type.startsWith("image")) {
                alert("画像ファイルを選択してね。");
                this.image = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                this.clearResult(MSG_月ジェネの説明);
                isLoadingInputImage = false;
                return;
            }

            this.image = new Image();
            this.image.onload = () => {
                if (this.image.width < this.imageWidthMin || this.image.width > imageWidthMaxDefault) {
                    alert(`画像の幅は${this.imageWidthMin}px以上${imageWidthMaxDefault}px以下の必要があるよ。`);
                    this.$refs.inputImageFile.value = "";
                    this.image = null;
                    this.imageWidth = imageWidthOri = this.imageWidthMin;

                    this.imageBaseAverageColor = baseAverageColorDefault;
                    this.imageBaseColorDistance = baseColorDistanceDefault;
                    URL.revokeObjectURL(this.image.src);
                    this.clearResult(MSG_月ジェネの説明);
                    isLoadingInputImage = false;
                }
                else {
                    this.imageFileName = imageFile.name;
                    isSvg = imageFile.type.includes("svg");

                    imageHeightRate = this.image.height / this.image.width;
                    const maxArea = 1280 * 720;
                    const imageWidthSafeMax = Math.floor(Math.sqrt(maxArea / imageHeightRate));
                    if (this.isSafety) {
                        this.imageWidthMax = imageWidthSafeMax;
                    }
                    if (this.image.width > imageWidthSafeMax) {
                        imageWidthOri = imageWidthSafeMax;
                        this.imageWidth = imageWidthSafeMax;
                    }
                    else {
                        imageWidthOri = this.image.width;
                        this.imageWidth = imageWidthOri;
                    }

                    this.imageBaseAverageColor = baseAverageColorDefault;
                    this.imageBaseColorDistance = baseColorDistanceDefault;
                    URL.revokeObjectURL(this.image.src);
                    isLoadingInputImage = false;

                    this.generateTukiArt(true);
                }
            };
            this.image.onerror = () => {
                alert("画像の読み込みに失敗したよ。");
                this.$refs.inputImageFile.value = "";
                this.image = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                URL.revokeObjectURL(this.image.src);
                this.clearResult(MSG_月ジェネの説明);
                isLoadingInputImage = false;
            };

            this.image.src = URL.createObjectURL(imageFile);
        },
        onChangeInputVideoFile(e) {
            if (isLoadingInputVideo) {
                return;
            }
            isLoadingInputVideo = true;

            this.videoFile = e.target.files[0];
            e.target.value = "";

            if (!this.videoFile.type.startsWith("video")) {
                alert("動画ファイルを選択してね。");
                this.videoFile = null;
                this.videoWidth = videoWidthOri = this.videoWidthMin;
                this.clearResult(MSG_月ジェネの説明);
                isLoadingInputVideo = false;
                return;
            }

            const video = document.createElement("video");
            video.onloadedmetadata = () => {
                if (video.videoWidth < this.videoWidthMin || video.videoWidth > videoWidthMaxDefault) {
                    alert(`画像の幅は${this.videoWidthMin}px以上${videoWidthMaxDefault}px以下の必要があるよ。`);
                    this.$refs.inputVideoFile.value = "";
                    this.videoFile = null;
                    this.videoWidth = videoWidthOri = this.videoWidthMin;

                    this.videoBaseAverageColor = baseAverageColorDefault;
                    this.videoBaseColorDistance = baseColorDistanceDefault;
                    URL.revokeObjectURL(video.src);
                    this.clearResult(MSG_月ジェネの説明);
                    isLoadingInputVideo = false;
                }
                else {
                    videoHeightRate = video.videoHeight / video.videoWidth;
                    const maxArea = 400 * 300; // 軽い
                    const videoWidthSafeMax = Math.floor(Math.sqrt(maxArea / videoHeightRate));
                    if (this.isSafety) {
                        this.videoWidthMax = videoWidthSafeMax;
                    }
                    if (video.videoWidth > videoWidthSafeMax) {
                        videoWidthOri = videoWidthSafeMax;
                        this.videoWidth = videoWidthSafeMax;
                    }
                    else {
                        videoWidthOri = video.videoWidth;
                        this.videoWidth = videoWidthOri;
                    }

                    this.videoBaseAverageColor = baseAverageColorDefault;
                    this.videoBaseColorDistance = baseColorDistanceDefault;
                    this.resultVideoWidthRate = 100;
                    URL.revokeObjectURL(video.src);
                    isLoadingInputVideo = false;

                    this.generateTukiArt();
                }
            };
            video.onerror = () => {
                alert("動画の読み込みに失敗したよ。");
                this.$refs.inputVideoFile.value = "";
                this.videoFile = null;
                this.videoWidth = videoWidthOri = this.videoWidthMin;
                URL.revokeObjectURL(video.src);
                this.clearResult(MSG_月ジェネの説明);
                isLoadingInputVideo = false;
            };

            video.src = URL.createObjectURL(this.videoFile);
        },

        // 🌕🌕 テキストパラメータのUIイベント 🌕🌕

        onClickNeedDetailConfigLineWidth() {
            this.needDetailConfigLineWidth = !this.needDetailConfigLineWidth;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickNeedDetailConfigLetterSpacing() {
            this.needDetailConfigLetterSpacing = !this.needDetailConfigLetterSpacing;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickNeedDetailConfigTukiArtMargin() {
            this.needDetailConfigTukiArtMargin = !this.needDetailConfigTukiArtMargin;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onBlurText() {
            if (
                this.text === "" && this.tukiArtType !== "none" ||
                this.text !== "" && this.text !== prevText
            ) {
                this.generateTukiArt();;
            }
        },
        onChangeTukiCount() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeFontFamily(e) {
            if (e.target.value === "noto-serif" || e.target.value === "serif") {
                this.isBold = false;
                this.isTextTateLinePowerUp = true;
                this.isTextYokoTopLinePowerUp = true;
                this.isTextYokoBottomLinePowerUp = true;
            }
            else {
                this.isBold = true;
                this.isTextTateLinePowerUp = false;
                this.isTextYokoTopLinePowerUp = false;
                this.isTextYokoBottomLinePowerUp = false;
            }
            if (this.text !== "") {
                this.generateTukiArt();;
            }
        },
        onChangeLineWidth() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeLetterSpacing() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginTop() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginBottom() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginLeft() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginRight() {
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickIsBold() {
            this.isBold = !this.isBold;
            if (this.text !== "") {
                this.generateTukiArt();;
            }
        },
        onClickIsTextColorReverse() {
            this.isTextColorReverse = !this.isTextColorReverse;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickIsTate(isTate) {
            this.isTate = isTate;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickIsTextTateLinePowerUp() {
            this.isTextTateLinePowerUp = !this.isTextTateLinePowerUp;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickIsTextYokoTopLinePowerUp() {
            this.isTextYokoTopLinePowerUp = !this.isTextYokoTopLinePowerUp;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },
        onClickIsTextYokoBottomLinePowerUp() {
            this.isTextYokoBottomLinePowerUp = !this.isTextYokoBottomLinePowerUp;
            if (this.text !== "") {
                this.generateTukiArt();
            }
        },

        // 🌕🌕 画像パラメータのUIイベント 🌕🌕

        onChangeImageBaseAverageColor() {
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickImageColorCount(count) {
            this.imageColorCount = count;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickUseImageNanameMikaduki() {
            this.useImageNanameMikaduki = !this.useImageNanameMikaduki;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onChangeImageBaseColorDistance() {
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onChangeImageWidth() {
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickNeedImageOutline() {
            this.needImageOutline = !this.needImageOutline;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickIsImageColorReverse() {
            this.isImageColorReverse = !this.isImageColorReverse;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickIsImageTateLinePowerUp() {
            this.isImageTateLinePowerUp = !this.isImageTateLinePowerUp;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickIsImageYokoTopLinePowerUp() {
            this.isImageYokoTopLinePowerUp = !this.isImageYokoTopLinePowerUp;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },
        onClickIsImageYokoBottomLinePowerUp() {
            this.isImageYokoBottomLinePowerUp = !this.isImageYokoBottomLinePowerUp;
            if (this.image !== null) {
                this.generateTukiArt();
            }
        },

        // 🌕🌕 動画パラメータのUIイベント 🌕🌕

        onChangeVideoBaseAverageColor() {
            isVideoParamChanged = true;
        },
        onClickVideoColorCount(count) {
            this.videoColorCount = count;
            isVideoParamChanged = true;
        },
        onClickUseVideoNanameMikaduki() {
            this.useVideoNanameMikaduki = !this.useVideoNanameMikaduki;
            isVideoParamChanged = true;
        },
        onChangeVideoBaseColorDistance() {
            isVideoParamChanged = true;
        },
        onChangeVideoWidth() {
            isVideoParamChanged = true;
        },
        onChangeFps() {
            isVideoParamChanged = true;
        },
        onClickNeedVideoOutline() {
            this.needVideoOutline = !this.needVideoOutline;
            isVideoParamChanged = true;
        },
        onClickIsVideoColorReverse() {
            this.isVideoColorReverse = !this.isVideoColorReverse;
            isVideoParamChanged = true;
        },
        onClickIsVideoTateLinePowerUp() {
            this.isVideoTateLinePowerUp = !this.isVideoTateLinePowerUp;
            isVideoParamChanged = true;
        },
        onClickIsVideoYokoTopLinePowerUp() {
            this.isVideoYokoTopLinePowerUp = !this.isVideoYokoTopLinePowerUp;
            isVideoParamChanged = true;
        },
        onClickIsVideoYokoBottomLinePowerUp() {
            this.isVideoYokoBottomLinePowerUp = !this.isVideoYokoBottomLinePowerUp;
            isVideoParamChanged = true;
        },

        // 🌕🌕 生成、コピーなどのUIイベント 🌕🌕

        onClickResetButton() {
            this.isGeneratingTukiArt = false;
            
            if (worker !== null) {
                worker.terminate(); worker = null;
            }
            if (this.tukiArtType === "video") {
                clearInterval(videoTimerId); videoTimerId = 0;
            }
            this.clearResult(MSG_月ジェネの説明);

            tukiArt = "";

            if (this.mode === "text") {
                this.tukiCount = 13;
                this.fontFamily = "noto-serif";
                this.lineWidth = 0;
                this.letterSpacing = 0;
                this.isBold = false;
                this.isTextTateLinePowerUp = true;
                this.isTextYokoTopLinePowerUp = true;
                this.isTextYokoBottomLinePowerUp = true;
                this.isTextColorReverse = true;
                this.tukiArtMarginTop = 0;
                this.tukiArtMarginBottom = 0;
                this.tukiArtMarginLeft = 0;
                this.tukiArtMarginRight = 0;
            }
            else if (this.mode === "image") {
                this.imageColorCount = 3;
                this.useImageNanameMikaduki = true;
                this.imageBaseAverageColor = baseAverageColorDefault;
                this.imageBaseColorDistance = baseColorDistanceDefault;
                this.needImageOutline = true;
                this.isImageColorReverse = false;
                this.imageWidth = imageWidthOri;
                this.isImageTateLinePowerUp = false;
                this.isImageYokoTopLinePowerUp = false;
                this.isImageYokoBottomLinePowerUp = false;
                this.shouldDisplayMonochromeImage = false;
            }
            else if (this.mode === "video") {
                this.videoColorCount = 3;
                this.useVideoNanameMikaduki = true;
                this.videoBaseAverageColor = baseAverageColorDefault;
                this.videoBaseColorDistance = baseColorDistanceDefault;
                this.needVideoOutline = true;
                this.isVideoColorReverse = false;
                this.videoWidth = videoWidthOri;
                this.isVideoTateLinePowerUp = false;
                this.isVideoYokoTopLinePowerUp = false;
                this.isVideoYokoBottomLinePowerUp = false;
                this.fps = this.fpsMin;
            }
        },
        // 生成ボタン押下時
        onClickGenerateButton() {
            this.generateTukiArt();
        },
        onClickCopyButton() {
            if (!canCopyButtonClick) {
                return;
            }
            canCopyButtonClick = false;

            navigator.clipboard.writeText(tukiArt);
            
            this.$refs.copyMessage.classList.add("display-copy-message");
            if (this.isMobile) {
                this.$refs.copyMessage.style.left = `calc(-1 * (100px - ${mobileCopyBtnWidth}) / 2)`;
            }
            setTimeout(() => {
                this.$refs.copyMessage.classList.remove("display-copy-message");
                if (this.isMobile) {
                    this.$refs.copyMessage.style.left = "";
                }
                canCopyButtonClick = true;
            }, 2000);
        },
        onClickDownLoadTextButton() {
            if (tukiArt === "") {
                return;
            }
            const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
            const blob = new Blob([bom, tukiArt], {type:"text/plan"});
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `moon_art${getStrCurrentDateTime()}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        onClickDownLoadImageButton() {
            if (tukiArt === "") {
                return;
            }
            const link = document.createElement("a");
            if (this.tukiArtType === "video") {
                link.href = this.$refs.resultVideo.toDataURL();
            }
            else {
                link.href = this.$refs.resultImage.src;
            }
            link.download = `moon_art${getStrCurrentDateTime()}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        },

        // 🌕🌕 ビジネスロジック 🌕🌕

        changeSafety() {
            if (this.isSafety) {
                let message = "";
                if (this.isMobile) {
                    message = "裏モードはテキストの文字数、画像の幅などがほぼ無制限に指定できるようになるけど、処理が重くてフリーズするかも。画質にこだわりがある人以外は使わないこと。OK？";
                }
                else {
                    message = "裏モードはテキストの文字数、画像の幅、動画の幅などがほぼ無制限に指定できるようになるけど、処理が重くてフリーズするかも。画質にこだわりがある人以外は使わないこと。OK？";
                }
                const res = confirm(message);
                if (!res) {
                    return;
                }
            }
            else {
                const res = confirm("表モードに戻ると、裏モードで入力した値はすべて初期化されるよ。OK？");
                if (res) {
                    location.reload();
                }
                return;
            }
            
            // 以降は裏モード確定

            this.isSafety = false;

            if (!this.isMobile) {
                const domGitCat = document.getElementById("git-cat");
                const tmpGitCatFill = domGitCat.style.fill;
                domGitCat.style.fill = domGitCat.style.color;
                domGitCat.style.color = tmpGitCatFill;
            }

            if (this.resultMessage === MSG_月ジェネの説明) {
                this.resultMessage = MSG_月ジェネの説明_裏;
            }
            MSG_月ジェネの説明 = MSG_月ジェネの説明_裏;

            document.body.classList.add("dark");

            // 上限更新
            this.tukiCountMax = tukiCountUnSafeMaxDefault;
            this.imageWidthMax = imageWidthMaxDefault;
            this.videoWidthMax = videoWidthMaxDefault;
        },
        clearResultVideo() {
            if (this.$refs.videoWrapper.firstChild != null) {
                this.$refs.videoWrapper.removeChild(this.$refs.videoWrapper.firstChild);
            }
            this.resultVideoWidth = 0;
            this.$refs.resultVideo.width = 0;
            this.$refs.resultVideo.height = 0;
        },
        clearResult(resultMessage) {
            if (resultMessage !== undefined) {
                this.resultMessage = resultMessage;
            }
            this.tukiArtType = "none";
            if (
                this.mode !== this.tukiArtType && (
                    this.mode === "text" && this.text !== "" ||
                    this.mode === "image" && this.image !== null ||
                    this.mode === "video" && this.videoFile !== null
                )
            ) {
                this.canDisplayGenerateButton = true;
            }
            else {
                this.canDisplayGenerateButton = false;
            }

            this.resultImageWidth = 0;

            URL.revokeObjectURL(this.$refs.monochrome.src);
            URL.revokeObjectURL(this.$refs.resultImage.src);
            this.$refs.monochrome.src = "";
            this.$refs.resultImage.src = "";

            this.clearResultVideo();
        },
        generateTukiArt(shoudlResetResultImageWidthRate = false) {
            if (
                this.mode === "image" && isLoadingInputImage ||
                this.mode === "video" && isLoadingInputVideo
            ) {
                return;
            }

            this.isGeneratingTukiArt = true;

            if (worker !== null) {
                worker.terminate(); worker = null;
            }
            if (this.mode !== "video") {
                this.clearResultVideo();
            }
            if (this.tukiArtType === "video") {
                clearInterval(videoTimerId); videoTimerId = 0;
            }

            tukiArt = "";

            if (
                this.mode === "text" && this.text === "" ||
                this.mode === "image" && this.image == null ||
                this.mode === "video" && this.videoFile == null
            ) {
                this.clearResult(MSG_月ジェネの説明);
                this.isGeneratingTukiArt = false;
                return;
            }

            // ぐるぐる～
            const moons = ["🌑", "🌘", "🌗", "🌖", "🌕", "🌔", "🌓", "🌒"];
            let moonIndex = this.isSafety ? 0 : 4;
            this.moon = moons[moonIndex];
            const moonTimerId = setInterval(() => {
                if (!this.isGeneratingTukiArt) {
                    clearInterval(moonTimerId);
                    return;
                }
                moonIndex = (moonIndex + 1) % moons.length;
                this.moon = moons[moonIndex];
            }, 100);

            this.generateTukiArt1(shoudlResetResultImageWidthRate);
        },
        async generateTukiArt1(shoudlResetResultImageWidthRate = false) {
            const mode = this.mode;

            if (mode === "text") {
                if (this.isSafety) {
                    const charArray = [...this.text];
                    if (charArray.length > textLengthSafeMax) {
                        this.text = charArray.slice(0, textLengthSafeMax).join("");
                    }
                }

                prevText = this.text;

                // Canvasを作る前に先にフォントを読み込む
                try {
                    if (this.fontFamily === "noto-serif") {
                        // :wght@400;700があると何故か太字と標準で切り変わらない
                        await loadFont("Noto Serif JP", `https://fonts.googleapis.com/css2?family=Noto+Serif+JP&text=${encodeURIComponent(this.text)}`);
                    }
                    else if (this.fontFamily === "noto-sans") {
                        await loadFont("Noto Sans JP", `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&text=${encodeURIComponent(this.text)}`);
                    }
                }
                catch (e) {
                    // フォントが読み込めなくても何もしない
                }
                
                const letterSpacing = this.needDetailConfigLetterSpacing ? this.letterSpacing : 0;
                const lineWidth = this.needDetailConfigLineWidth ? this.lineWidth : 0;
                let imageData = null;
                try {
                    imageData = MonochromeCanvas.createTextCanvas(this.text, this.fontFamily, this.isBold, this.isTate, letterSpacing, lineWidth);
                }
                catch (e) {
                    if (this.isTate) {
                        this.clearResult(MSG_テキストが大きすぎてキャンバスが作れなかった_縦);
                    }
                    else {
                        this.clearResult(MSG_テキストが大きすぎてキャンバスが作れなかった_横);
                    }
                    this.isGeneratingTukiArt = false;
                    return;
                }

                worker = new Worker("./js/worker/text_to_tuki_art_canvas_worker.js");
                worker.onmessage = async e => {
                    worker.terminate(); worker = null;

                    tukiArt = e.data.tukiArt;

                    if (e.data.isError) {
                        if (e.data.tukiArt !== "") {
                            this.clearResult(MSG_完成イメージが作れなかった);
                        }
                        else {
                            this.clearResult(MSG_エラー);
                        }
                        this.isGeneratingTukiArt = false;
                        return;
                    }

                    try {
                        await this.displayTukiArt(e.data.resultBase64);
                        this.resultMessage = MSG_非表示;
                        this.tukiArtType = mode;
                        this.canDisplayGenerateButton = false;
                        this.isGeneratingTukiArt = false;
                    }
                    catch (e) {
                        this.clearResult(MSG_完成イメージが作れなかった);
                        this.isGeneratingTukiArt = false;
                    }
                };
                worker.onerror = e => {
                    console.error(e);
                    worker.terminate(); worker = null;
                    this.clearResult(MSG_エラー);
                    this.isGeneratingTukiArt = false;
                };

                const tukiArtParams = {
                    tukiCount: this.tukiCount,
                    isTate: this.isTate,
                    isTextColorReverse: this.isTextColorReverse,
                    isTextTateLinePowerUp: this.isTextTateLinePowerUp,
                    isTextYokoTopLinePowerUp: this.isTextYokoTopLinePowerUp,
                    isTextYokoBottomLinePowerUp: this.isTextYokoBottomLinePowerUp,
                    needDetailConfigTukiArtMargin: this.needDetailConfigTukiArtMargin,
                    tukiArtMarginTop: this.tukiArtMarginTop,
                    tukiArtMarginBottom: this.tukiArtMarginBottom,
                    tukiArtMarginLeft: this.tukiArtMarginLeft,
                    tukiArtMarginRight: this.tukiArtMarginRight
                };

                worker.postMessage({imageData, tukiArtParams, canvasMaxWidth, canvasMaxHeight, canvasMaxArea}, [imageData]);
            }
            else if (mode === "image") {
                const tukiArtParams = {
                    imageWidth: this.imageWidth,
                    imageHeight: Math.round(this.imageWidth * imageHeightRate),
                    imageBaseAverageColor: this.imageBaseAverageColor,
                    needImageOutline: this.needImageOutline,
                    imageBaseColorDistance: this.imageBaseColorDistance,
                    imageColorCount: this.imageColorCount,
                    useImageNanameMikaduki: this.useImageNanameMikaduki,
                    isImageColorReverse: this.isImageColorReverse,
                    isImageTateLinePowerUp: this.isImageTateLinePowerUp,
                    isImageYokoTopLinePowerUp: this.isImageYokoTopLinePowerUp,
                    isImageYokoBottomLinePowerUp: this.isImageYokoBottomLinePowerUp
                };

                const isValidCanvas = canvasSizeTest(tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                if (!isValidCanvas) {
                    this.clearResult(MSG_画像サイズが大きすぎてキャンバスが作れなかった);
                    this.isGeneratingTukiArt = false;
                    return;
                }
                
                const canvas = new OffscreenCanvas(tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                const context = canvas.getContext("2d");
                if (isSvg) {
                    const svgCanvas = new OffscreenCanvas(this.image.width, this.image.height);
                    const svgContext = svgCanvas.getContext("2d", { willReadFrequently: true });
                    svgContext.drawImage(this.image, 0, 0);
                    context.drawImage(svgCanvas, 0, 0, this.image.width, this.image.height, 0, 0, tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                }
                else {
                    context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                }
                
                const imageData = canvas.transferToImageBitmap();

                worker = new Worker("./js/worker/image_to_tuki_art_canvas_worker.js");
                worker.onmessage = async e => {
                    worker.terminate(); worker = null;

                    tukiArt = e.data.tukiArt;

                    if (e.data.isError) {
                        if (e.data.tukiArt !== "") {
                            this.clearResult(MSG_完成イメージが作れなかった);
                        }
                        else {
                            this.clearResult(MSG_エラー);
                        }
                        this.isGeneratingTukiArt = false;
                        return;
                    }

                    try {
                        if (shoudlResetResultImageWidthRate) {
                            this.resultImageWidthRate = 100;
                        }
                        await this.displayTukiArt(e.data.resultBase64, e.data.monoBase64, tukiArtParams.imageWidth);
                        this.resultMessage = MSG_非表示;
                        this.tukiArtType = mode;
                        this.canDisplayGenerateButton = false;
                        this.isGeneratingTukiArt = false;
                    }
                    catch (e) {
                        this.clearResult(MSG_完成イメージが作れなかった);
                        this.isGeneratingTukiArt = false;
                    }
                };
                worker.onerror = e => {
                    console.error(e);
                    worker.terminate(); worker = null;
                    this.clearResult(MSG_エラー);
                    this.isGeneratingTukiArt = false;
                };

                worker.postMessage({imageData, tukiArtParams, canvasMaxWidth, canvasMaxHeight, canvasMaxArea}, [imageData]);
            }
            else if (mode === "video") {
                // 余談：videoもWebWorkerで処理しようとしたが重すぎて話にならなかった
                const video = document.createElement("video");
                video.setAttribute("height", "240");
                video.setAttribute("controls", "");
                
                let isVideoStopped = true;

                video.onloadeddata = () => {
                    const monoCanvas = new MonochromeCanvas();

                    video.volume = 0.2;

                    let resizeVideoWidth = this.videoWidth;
                    let resizeVideoHeight = Math.round(resizeVideoWidth * videoHeightRate);
                    
                    const isValidCanvas = canvasSizeTest(resizeVideoWidth, resizeVideoHeight);
                    if (!isValidCanvas) {
                        this.clearResult(MSG_動画の画面サイズが大きすぎてキャンバスが作れなかった);
                        this.isGeneratingTukiArt = false;
                        return;
                    }

                    // 何故かサムネが表示されないことがあるので数フレーム回す
                    let forceRunFrameCount = 5;
                    let canvasParams = null;
                    const resultVideoContext = this.$refs.resultVideo.getContext("2d");

                    const drawTukiArtFrame = () => {
                        if (this.videoWidth !== resizeVideoWidth) {
                            resizeVideoWidth = this.videoWidth;
                            resizeVideoHeight = Math.round(resizeVideoWidth * videoHeightRate);
                            canvasParams = null;
                        }
                        
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

                        tukiArt = TukiArtGenerator.createTukiArt(
                            monoCanvas.pixels,
                            this.isVideoColorReverse,
                            this.isVideoTateLinePowerUp,
                            this.isVideoYokoTopLinePowerUp,
                            this.isVideoYokoBottomLinePowerUp, 
                            this.videoColorCount,
                            this.useVideoNanameMikaduki
                        );

                        const textList = tukiArt.split("\n");

                        if (canvasParams === null) {
                            canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
                            this.$refs.resultVideo.width = canvasParams.width;
                            this.$refs.resultVideo.height = canvasParams.height;
                            this.resultVideoWidth = canvasParams.width < 1200 ? canvasParams.width : 1200;
                        }

                        TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, resultVideoContext);
                    };

                    video.onseeked = () => {
                        try {
                            drawTukiArtFrame(); // これいる？ ← いる
                        }
                        catch (e) {
                            console.error(e);
                            clearInterval(videoTimerId); videoTimerId = 0;
                            this.clearResult(MSG_エラー);
                        }
                    };

                    isVideoParamChanged = false;
                    let fps = this.fps;

                    const playTukiArtVideo = () => setInterval(() => {
                        if (forceRunFrameCount <= 0 && isVideoStopped && !isVideoParamChanged) {
                            return;
                        }
                        isVideoParamChanged = false;

                        if (this.fps !== fps) {
                            clearInterval(videoTimerId); videoTimerId = 0;
                            fps = this.fps;
                            videoTimerId = playTukiArtVideo();
                            return;
                        }

                        try {
                            drawTukiArtFrame();
                        }
                        catch (e) {
                            console.error(e);
                            clearInterval(videoTimerId); videoTimerId = 0;
                            this.clearResult(MSG_エラー);
                        }
                        if (forceRunFrameCount > 0) {
                            forceRunFrameCount--;
                        }
                    }, 1000 / fps);

                    this.clearResult();
                    this.$refs.videoWrapper.appendChild(video);

                    videoTimerId = playTukiArtVideo();

                    this.resultMessage = MSG_非表示;
                    this.tukiArtType = mode;
                    this.canDisplayGenerateButton = false;
                    this.isGeneratingTukiArt = false;
                };
                video.onerror = () => {
                    alert("動画の読み込みに失敗したよ。");
                    this.clearResult(MSG_エラー);
                    this.$refs.inputVideoFile.value = "";
                    this.videoFile = null;
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
        displayTukiArt(resultBase64, monoBase64 = "", monoWidth = 0) {
            return new Promise(async (resolve, reject) => {
                URL.revokeObjectURL(this.$refs.monochrome.src);
                URL.revokeObjectURL(this.$refs.resultImage.src);
    
                if (monoBase64 !== "") {
                    this.$refs.monochrome.style.maxWidth = monoWidth + "px";
                    this.$refs.monochrome.src = monoBase64;
                }
                
                const onImageLoad = () => {
                    this.$refs.resultImage.removeEventListener("load", onImageLoad);
                    this.$refs.resultImage.removeEventListener("error", onImageError);

                    this.resultImageWidth = this.$refs.resultImage.naturalWidth;

                    resolve();
                };
                const onImageError = e => {
                    console.log(e);
                    this.$refs.resultImage.removeEventListener("load", onImageLoad);
                    this.$refs.resultImage.removeEventListener("error", onImageError);
                    reject();
                };

                this.$refs.resultImage.addEventListener("load", onImageLoad);
                this.$refs.resultImage.addEventListener("error", onImageError);

                this.$refs.resultImage.src = resultBase64;
            });
        }
    }
};

Vue.createApp(App).mount("#app");
