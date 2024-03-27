
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let appTitleClickCount = 0;

let tukiArt = "";

let canCopyButtonClick = true;

let isLoadingInputImage = false;
let isLoadingInputVideo = false;

let timer = 0;
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

const textLengthSafeMax = 40;
const tukiCountSafeMaxDefault = 50;
const tukiCountUnSafeMaxDefault = 100;
const letterSpacingLevelDefault = 3;

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
            isDebug: false,
            debugText: debugText,
            resultMessage: MSG_月ジェネの説明,
            tukiArtType: "none", // "none" | "text" | "image" | "video"
            shouldDisplaySample: true,
            shouldDisplayMonochromeImage: false,
            needDetailConfigLineWidth: false,
            needDetailConfigLetterSpacingLevel: false,
            needDetailConfigTukiArtMargin: false,
            shouldShrinkImage: true,
            mode: "text", // "text" | "image" | "video"

            text: "",
            fontFamily: "serif", // "default" | "sans" | "serif"
            tukiCount: 13, // Twitterが絵文字13文字で改行されるから
            tukiCountMin: 10,
            tukiCountMax: tukiCountSafeMaxDefault,
            letterSpacingLevel: 3,
            lineWidth: 0,
            lineWidthMin: 0,
            lineWidthMax: 10,
            isBold: false,
            isTate: true,
            isMonoCanvasTate: false, // 縦書きのモノクロ画像が見たいときだけにtrueにする。デバグ専用。

            imageFile: null,
            videoFile: null,

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

            isGeneratingTukiArt: false,

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
        this.isDebug = params.has("d");
        if (!this.isMobile) {
            this.isMobile = params.has("m");
        }

        MSG_完成イメージが作れなかった = this.isMobile ? MSG_完成イメージが作れなかった_MOBILE : MSG_完成イメージが作れなかった_PC;

        // エラー時のデフォ値の参考元：https://jhildenbiddle.github.io/canvas-size/#/?id=mobile
        try {
            canvasMaxWidth = (await canvasSize.maxWidth()).width;
        }
        catch (e) {
            canvasMaxWidth = 32767;
        }
        try {
            canvasMaxHeight = (await canvasSize.maxHeight()).height;
        }
        catch (e) {
            canvasMaxHeight = 32767;
        }
        try {
            if (this.isMobile) {
                const { width: maxAreaWidth, height: maxAreaHeight } = await canvasSize.maxArea({max: 16384});
                canvasMaxArea = maxAreaWidth * maxAreaHeight;
            }
            else {
                const { width: maxAreaWidth, height: maxAreaHeight } = await canvasSize.maxArea();
                canvasMaxArea = maxAreaWidth * maxAreaHeight;
            }
        }
        catch (e) {
            canvasMaxArea = 10836 * 10836;
        }

        canvasSizeTest = createCanvasSizeTest(canvasMaxWidth, canvasMaxHeight, canvasMaxArea);
    },
    mounted() {
        if (this.isMobile) {
            this.$refs.generateBtn.style.width = mobileGenerateBtnWidth;
            this.$refs.copyBtnWrapper.style.width = mobileCopyBtnWidth;
            this.$refs.copyBtn.style.width = mobileCopyBtnWidth;
        }

        this.displaySample();

        if (this.isDebug) {
            // this.shouldDisplayMonochromeImage = true;
            this.text = "一三￥";
            // this.tukiCount = 10;
            // this.letterSpacingLevel = 1;
            // // this.fontFamily = "sans";
            // this.fontFamily = "serif";
            // // this.fontFamily = "default";
            // this.isBold = true;
            this.isTextYokoLinePowerUp = false;
            this.isTextTateLinePowerUp = false;
            // this.isTate = false;
            // this.isMobile = true;

            const timer = setInterval(() => {
                if (canvasMaxArea !== 0) {
                    clearInterval(timer);
                    this.onClickGenerateButton();
                }
            }, 100);
        }
    },
    watch: {
        mode(newVal) {
            if (this.tukiArtType === "none") {
                if (newVal === "video") {
                    this.clearResult();
                }
                else {
                    this.displaySample();
                }
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

            this.imageFile = e.target.files[0];
            e.target.value = "";

            if (!this.imageFile.type.startsWith("image")) {
                alert("画像ファイルを選択してね。");
                this.imageFile = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                isLoadingInputImage = false;
                return;
            }

            const img = new Image();
            img.onload = () => {
                if (img.width < this.imageWidthMin || img.width > imageWidthMaxDefault) {
                    alert(`画像の幅は${this.imageWidthMin}px以上${imageWidthMaxDefault}px以下の必要があるよ。`);
                    this.$refs.inputImageFile.value = "";
                    this.imageFile = null;
                    this.imageWidth = imageWidthOri = this.imageWidthMin;

                    this.imageBaseAverageColor = baseAverageColorDefault;
                    this.imageBaseColorDistance = baseColorDistanceDefault;
                    URL.revokeObjectURL(img.src);
                    isLoadingInputImage = false;
                }
                else {
                    imageHeightRate = img.height / img.width;
                    const maxArea = 1280 * 720;
                    const imageWidthSafeMax = Math.floor(Math.sqrt(maxArea / imageHeightRate));
                    if (this.isSafety) {
                        this.imageWidthMax = imageWidthSafeMax;
                    }
                    if (img.width > imageWidthSafeMax) {
                        imageWidthOri = imageWidthSafeMax;
                        this.imageWidth = imageWidthSafeMax;
                    }
                    else {
                        imageWidthOri = img.width;
                        this.imageWidth = imageWidthOri;
                    }

                    this.imageBaseAverageColor = baseAverageColorDefault;
                    this.imageBaseColorDistance = baseColorDistanceDefault;
                    URL.revokeObjectURL(img.src);
                    isLoadingInputImage = false;

                    this.generateTukiArt();
                }
            };
            img.onerror = () => {
                alert("画像の読み込みに失敗したよ。");
                this.$refs.inputImageFile.value = "";
                this.imageFile = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                URL.revokeObjectURL(img.src);
                isLoadingInputImage = false;
            };

            img.src = URL.createObjectURL(this.imageFile);
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
                isLoadingInputVideo = false;
            };

            video.src = URL.createObjectURL(this.videoFile);
        },

        // 🌕🌕 テキストパラメータのUIイベント 🌕🌕

        onClickNeedDetailConfigLineWidth() {
            this.needDetailConfigLineWidth = !this.needDetailConfigLineWidth;
            this.generateTukiArt();
        },
        onClickNeedDetailConfigLetterSpacingLevel() {
            this.needDetailConfigLetterSpacingLevel = !this.needDetailConfigLetterSpacingLevel;
            this.generateTukiArt();
        },
        onClickNeedDetailConfigTukiArtMargin() {
            this.needDetailConfigTukiArtMargin = !this.needDetailConfigTukiArtMargin;
            this.generateTukiArt();
        },
        onChangeText() {
            this.generateTukiArt();
        },
        onChangeTukiCount() {
            this.generateTukiArt();
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
            this.generateTukiArt();
        },
        onChangeLineWidth() {
            this.generateTukiArt();
        },
        onClickLetterSpacingLevel(num) {
            this.letterSpacingLevel = num;
            this.generateTukiArt();
        },
        onChangeTukiArtMarginTop() {
            this.generateTukiArt();
        },
        onChangeTukiArtMarginBottom() {
            this.generateTukiArt();
        },
        onChangeTukiArtMarginLeft() {
            this.generateTukiArt();
        },
        onChangeTukiArtMarginRight() {
            this.generateTukiArt();
        },
        onClickIsBold() {
            this.isBold = !this.isBold;
            this.generateTukiArt();
        },
        onClickIsTextColorReverse() {
            this.isTextColorReverse = !this.isTextColorReverse;
            this.generateTukiArt();
        },
        onClickIsTate(isTate) {
            this.isTate = isTate;
            this.generateTukiArt();
        },
        onClickIsTextYokoLinePowerUp() {
            this.isTextYokoLinePowerUp = !this.isTextYokoLinePowerUp;
            this.generateTukiArt();
        },
        onClickIsTextTateLinePowerUp() {
            this.isTextTateLinePowerUp = !this.isTextTateLinePowerUp;
            this.generateTukiArt();
        },

        // 🌕🌕 画像パラメータのUIイベント 🌕🌕

        onChangeImageBaseAverageColor() {
            this.generateTukiArt();
        },
        onClickImageColorCount(count) {
            this.imageColorCount = count;
            this.generateTukiArt();
        },
        onClickUseImageNanameMikaduki() {
            this.useImageNanameMikaduki = !this.useImageNanameMikaduki;
            this.generateTukiArt();
        },
        onChangeImageBaseColorDistance() {
            this.generateTukiArt();
        },
        onChangeImageWidth() {
            this.generateTukiArt();
        },
        onClickNeedImageOutline() {
            this.needImageOutline = !this.needImageOutline;
            this.generateTukiArt();
        },
        onClickIsImageColorReverse() {
            this.isImageColorReverse = !this.isImageColorReverse;
            this.generateTukiArt();
        },
        onClickIsImageYokoLinePowerUp() {
            this.isImageYokoLinePowerUp = !this.isImageYokoLinePowerUp;
            this.generateTukiArt();
        },
        onClickIsImageTateLinePowerUp() {
            this.isImageTateLinePowerUp = !this.isImageTateLinePowerUp;
            this.generateTukiArt();
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
        onClickIsVideoYokoLinePowerUp() {
            this.isVideoYokoLinePowerUp = !this.isVideoYokoLinePowerUp;
            isVideoParamChanged = true;
        },
        onClickIsVideoTateLinePowerUp() {
            this.isVideoTateLinePowerUp = !this.isVideoTateLinePowerUp;
            isVideoParamChanged = true;
        },

        // 🌕🌕 生成、コピーなどのUIイベント 🌕🌕

        onClickResetButton() {
            this.isGeneratingTukiArt = false;
            
            if (worker !== null) {
                worker.terminate(); worker = null;
            }
            if (this.tukiArtType === "video") {
                clearInterval(timer); timer = 0;
            }
            this.resultMessage = MSG_月ジェネの説明;
            this.tukiArtType = "none";
            this.clearResult();

            tukiArt = "";

            if (this.mode === "text") {
                this.tukiCount = 13;
                this.fontFamily = "serif";
                this.lineWidth = 0;
                this.letterSpacingLevel = letterSpacingLevelDefault;
                this.isBold = false;
                this.isTextYokoLinePowerUp = true;
                this.isTextTateLinePowerUp = true;
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
                this.isImageYokoLinePowerUp = false;
                this.isImageTateLinePowerUp = false;
                this.shouldDisplayMonochromeImage = false;
            }
            else if (this.mode === 'video') {
                this.videoColorCount = 3;
                this.useVideoNanameMikaduki = true;
                this.videoBaseAverageColor = baseAverageColorDefault;
                this.videoBaseColorDistance = baseColorDistanceDefault;
                this.needVideoOutline = true;
                this.isVideoColorReverse = false;
                this.videoWidth = videoWidthOri;
                this.isVideoYokoLinePowerUp = false;
                this.isVideoTateLinePowerUp = false;
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
            link.href = this.$refs.resultImage.src;
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
        displaySample() {
            if (this.mode === "text") {
                this.shouldDisplaySample = true;
                URL.revokeObjectURL(this.$refs.resultImage.src);
                this.$refs.resultImage.src = "./assets/sample_text.png";
                this.$refs.resultImage.style.maxWidth = "247px";
            }
            else if (this.mode === "image") {
                this.shouldDisplaySample = true;
                URL.revokeObjectURL(this.$refs.resultImage.src);
                this.$refs.resultImage.src = "./assets/sample_image.png";
                this.$refs.resultImage.style.maxWidth = "494px";
            }
        },
        clearResultVideo() {
            if (this.$refs.videoWrapper.firstChild != null) {
                this.$refs.videoWrapper.removeChild(this.$refs.videoWrapper.firstChild);
            }
            if (this.$refs.resultVideo.width !== 0) {
                this.$refs.resultVideo.width = 0;
                this.$refs.resultVideo.height = 0;
            }
        },
        clearResult() {
            URL.revokeObjectURL(this.$refs.monochrome.src);
            this.$refs.monochrome.src = "";

            this.clearResultVideo();

            if (this.mode === "video") {
                URL.revokeObjectURL(this.$refs.resultImage.src);
                this.$refs.resultImage.src = "";
            }
            else {
                this.displaySample();
            }
        },
        generateTukiArt() {
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
                clearInterval(timer); timer = 0;
            }

            tukiArt = "";

            if (
                this.mode === "text" && this.text === "" ||
                this.mode === "image" && this.imageFile == null ||
                this.mode === "video" && this.videoFile == null
            ) {
                this.resultMessage = MSG_月ジェネの説明;
                this.tukiArtType = "none";
                this.clearResult();
                this.isGeneratingTukiArt = false;
                return;
            }

            // ぐるぐる～
            const moons = ["🌑", "🌘", "🌗", "🌖", "🌕", "🌔", "🌓", "🌒"];
            let moonIndex = this.isSafety ? 0 : 4;
            this.moon = moons[moonIndex];
            const moonTimer = setInterval(() => {
                if (!this.isGeneratingTukiArt) {
                    clearInterval(moonTimer);
                    return;
                }
                moonIndex = (moonIndex + 1) % moons.length;
                this.moon = moons[moonIndex];
            }, 100);

            // こうしないとスマホで「処理中…」のやつがでない
            // setTimeout(this.generateTukiArt1, 50);

            this.generateTukiArt1();
        },
        generateTukiArt1() {
            const mode = this.mode;

            if (mode === "text") {
                if (this.isSafety) {
                    const charArray = [...this.text];
                    if (charArray.length > textLengthSafeMax) {
                        this.text = charArray.slice(0, textLengthSafeMax).join("");
                    }
                }

                worker = new Worker("./js/text_to_tuki_art_canvas_worker.js");
                const isTate = this.isTate;
                worker.onmessage = async e => {
                    worker.terminate(); worker = null;

                    tukiArt = e.data.tukiArt;

                    if (e.data.isError) {
                        if (e.data.errorName === "TooLargeCanvasError") {
                            if (isTate) {
                                this.resultMessage = MSG_テキストが大きすぎてキャンバスが作れなかった_縦;
                            }
                            else {
                                this.resultMessage = MSG_テキストが大きすぎてキャンバスが作れなかった_横;
                            }
                        }
                        else if (e.data.tukiArt !== "") {
                            this.resultMessage = MSG_完成イメージが作れなかった;
                        }
                        else {
                            this.resultMessage = MSG_エラー;
                        }
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                        return;
                    }

                    try {
                        await this.displayTukiArt(e.data.resultBase64, e.data.width);
                        this.resultMessage = MSG_非表示;
                        this.tukiArtType = mode;
                        this.shouldDisplaySample = false;
                        this.isGeneratingTukiArt = false;
                    }
                    catch (e) {
                        this.resultMessage = MSG_完成イメージが作れなかった;
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                    }
                };
                worker.onerror = e => {
                    console.error(e);
                    worker.terminate(); worker = null;
                    this.resultMessage = MSG_エラー;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                };

                const tukiArtParams = {
                    text: this.text,
                    fontFamily: this.fontFamily,
                    tukiCount: this.tukiCount,
                    lineWidth: this.needDetailConfigLineWidth ? this.lineWidth : 0,
                    letterSpacingLevel: this.needDetailConfigLetterSpacingLevel ? this.letterSpacingLevel : letterSpacingLevelDefault,
                    isBold: this.isBold,
                    isTate: this.isTate,
                    isTextColorReverse: this.isTextColorReverse,
                    isTextYokoLinePowerUp: this.isTextYokoLinePowerUp,
                    isTextTateLinePowerUp: this.isTextTateLinePowerUp,
                    needDetailConfigTukiArtMargin: this.needDetailConfigTukiArtMargin,
                    tukiArtMarginTop: this.tukiArtMarginTop,
                    tukiArtMarginBottom: this.tukiArtMarginBottom,
                    tukiArtMarginLeft: this.tukiArtMarginLeft,
                    tukiArtMarginRight: this.tukiArtMarginRight
                };

                worker.postMessage({tukiArtParams, canvasMaxWidth, canvasMaxHeight, canvasMaxArea});
            }
            else if (mode === "image") {
                const fileReader = new FileReader();
                const tukiArtParams = {
                    imageWidth: this.imageWidth,
                    imageHeight: Math.round(this.imageWidth * imageHeightRate),
                    imageBaseAverageColor: this.imageBaseAverageColor,
                    needImageOutline: this.needImageOutline,
                    imageBaseColorDistance: this.imageBaseColorDistance,
                    imageColorCount: this.imageColorCount,
                    useImageNanameMikaduki: this.useImageNanameMikaduki,
                    isImageColorReverse: this.isImageColorReverse,
                    isImageYokoLinePowerUp: this.isImageYokoLinePowerUp,
                    isImageTateLinePowerUp: this.isImageTateLinePowerUp
                };

                fileReader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const isValidCanvas = canvasSizeTest(tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                        if (!isValidCanvas) {
                            this.resultMessage = MSG_画像サイズが大きすぎてキャンバスが作れなかった;
                            this.tukiArtType = "none";
                            this.clearResult();
                            this.isGeneratingTukiArt = false;
                            return;
                        }
                        
                        const canvas = new OffscreenCanvas(tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                        const context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, tukiArtParams.imageWidth, tukiArtParams.imageHeight);
                        const imageData = canvas.transferToImageBitmap();

                        worker = new Worker("./js/image_to_tuki_art_canvas_worker.js");
                        worker.onmessage = async e => {
                            worker.terminate(); worker = null;

                            tukiArt = e.data.tukiArt;

                            if (e.data.isError) {
                                if (e.data.errorName === "TooLargeCanvasError") {
                                    this.resultMessage = MSG_画像サイズが大きすぎてキャンバスが作れなかった;
                                }
                                else if (e.data.tukiArt !== "") {
                                    this.resultMessage = MSG_完成イメージが作れなかった;
                                }
                                else {
                                    this.resultMessage = MSG_エラー;
                                }
                                this.tukiArtType = "none";
                                this.clearResult();
                                this.isGeneratingTukiArt = false;
                                return;
                            }

                            try {
                                await this.displayTukiArt(e.data.resultBase64, e.data.width, e.data.monoBase64, tukiArtParams.imageWidth);
                                this.resultMessage = MSG_非表示;
                                this.tukiArtType = mode;
                                this.shouldDisplaySample = false;
                                this.isGeneratingTukiArt = false;
                            }
                            catch (e) {
                                this.resultMessage = MSG_完成イメージが作れなかった;
                                this.tukiArtType = "none";
                                this.clearResult();
                                this.isGeneratingTukiArt = false;
                            }
                        };
                        worker.onerror = e => {
                            console.error(e);
                            worker.terminate(); worker = null;
                            this.resultMessage = MSG_エラー;
                            this.tukiArtType = "none";
                            this.clearResult();
                            this.isGeneratingTukiArt = false;
                        };

                        worker.postMessage({imageData, tukiArtParams, canvasMaxWidth, canvasMaxHeight, canvasMaxArea}, [imageData]);
                    };
                    img.onerror = e => {
                        this.resultMessage = MSG_エラー;
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                        return;
                    };

                    img.src = fileReader.result;
                };
                fileReader.onerror = () => {
                    this.resultMessage = MSG_エラー;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                };

                fileReader.readAsDataURL(this.imageFile);
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

                    this.$refs.resultVideo.style.maxWidth = (video.videoWidth < 1200 ? video.videoWidth : 1200) + "px";
                    
                    let resizeVideoWidth = this.videoWidth;
                    let resizeVideoHeight = Math.round(resizeVideoWidth * videoHeightRate);
                    
                    const isValidCanvas = canvasSizeTest(resizeVideoWidth, resizeVideoHeight);
                    if (!isValidCanvas) {
                        this.resultMessage = MSG_動画の画面サイズが大きすぎてキャンバスが作れなかった;
                        this.tukiArtType = "none";
                        this.clearResult();
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

                        const tukiArt = TukiArtGenerator.createTukiArt(
                            monoCanvas.pixels,
                            this.isVideoColorReverse,
                            this.isVideoYokoLinePowerUp,
                            this.isVideoTateLinePowerUp, 
                            this.videoColorCount,
                            this.useVideoNanameMikaduki
                        );

                        const textList = tukiArt.split("\n");

                        if (canvasParams === null) {
                            canvasParams = TukiArtGenerator.findValidTukiArtCanvasParams(textList);
                            this.$refs.resultVideo.width = canvasParams.width;
                            this.$refs.resultVideo.height = canvasParams.height;
                        }

                        TukiArtGenerator.createTukiArtCanvas(textList, canvasParams, resultVideoContext);
                    };

                    video.onseeked = () => {
                        try {
                            drawTukiArtFrame(); // これいる？ ← いる
                        }
                        catch (e) {
                            console.error(e);
                            clearInterval(timer); timer = 0;
                            this.resultMessage = MSG_エラー;
                            this.tukiArtType = "none";
                            this.clearResult();
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
                            clearInterval(timer); timer = 0;
                            fps = this.fps;
                            timer = playTukiArtVideo();
                            return;
                        }

                        try {
                            drawTukiArtFrame();
                        }
                        catch (e) {
                            console.error(e);
                            clearInterval(timer); timer = 0;
                            this.resultMessage = MSG_エラー;
                            this.tukiArtType = "none";
                            this.clearResult();
                        }
                        if (forceRunFrameCount > 0) {
                            forceRunFrameCount--;
                        }
                    }, 1000 / fps);

                    this.clearResult();
                    this.$refs.videoWrapper.appendChild(video);

                    timer = playTukiArtVideo();

                    this.resultMessage = MSG_非表示;
                    this.tukiArtType = mode;
                    this.shouldDisplaySample = false;
                    this.isGeneratingTukiArt = false;
                };
                video.onerror = () => {
                    alert("動画の読み込みに失敗したよ。");
                    this.resultMessage = MSG_エラー;
                    this.tukiArtType = "none";
                    this.clearResult();
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
        displayTukiArt(resultBase64, resultWidth, monoBase64 = "", monoWidth = 0) {
            return new Promise(async (resolve, reject) => {
                URL.revokeObjectURL(this.$refs.monochrome.src);
                URL.revokeObjectURL(this.$refs.resultImage.src);
    
                if (monoBase64 !== "") {
                    this.$refs.monochrome.style.maxWidth = monoWidth + "px";
                    this.$refs.monochrome.src = monoBase64;
                }
                
                this.$refs.resultImage.onload = () => {
                    resolve();
                };
                this.$refs.resultImage.onerror = e => {
                    console.log(e);
                    reject();
                };
                this.$refs.resultImage.style.maxWidth = resultWidth + "px";
                this.$refs.resultImage.src = resultBase64;
            });
        }
    }
};

Vue.createApp(App).mount("#app");
