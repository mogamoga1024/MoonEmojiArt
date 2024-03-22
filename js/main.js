
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let appTitleClickCount = 0;

const fileReader = new FileReader();

let timer = 0;
let isVideoParamChanged = false;

const MSG_NO_INPUT_DATA = 
`・変換したい文か画像を決めて生成ボタンを押してね！
・サイズが小さいとクオリティが低くなるよ！
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。
・どうしても巨大な月文字を作りたい人はタイトル部分を2連打してね。`; // todo 文言
const MSG_ERROR = "生成に失敗したよ！ごめんね！";
const MSG_FAILURE_TEXT_MONO = "文字数が多すぎて一次加工で失敗したよ。減らしてね。";
const MSG_FAILURE_IMAGE_MONO = "画像サイズが大きすぎて一次加工で失敗したよ。減らしてね。";
const MSG_FAILURE_VIDEO_MONO = "画面サイズが大きすぎて一次加工で失敗したよ。ごめんね。";
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

const textLengthSafeMax = 20;
const tukiCountSafeMaxDefault = 30;
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
            tukiArt: "", // todo
            tukiArtType: "none", // "none" | "text" | "image" | "video"
            shouldDisplaySample: true,
            shouldDisplayMonochromeImage: false,
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

            isLoadingInputImage: false, // todo
            isLoadingInputVideo: false, // todo
            isGeneratingTukiArt: false,

            isMobile: false,
            canUseContextLetterSpacing: false,
            isSafety: true,
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
            // this.isTate = false;
            // this.isMobile = true;
        }

        if (this.isMobile) {
            this.$refs.generateBtn.style.width = mobileGenerateBtnWidth;
            this.$refs.copyBtnWrapper.style.width = mobileCopyBtnWidth;
            this.$refs.copyBtn.style.width = mobileCopyBtnWidth;
        }

        this.displaySample();
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
        },
        isGeneratingTukiArt(newVal) {
            // v-showだと、スマホででかい画像の時に何故か「処理中…」のやつがでない現象が発生するため、直接スタイルを変えている
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
        videoWidth() {
            isVideoParamChanged = true;
        },
        needVideoOutline() {
            isVideoParamChanged = true;
        },
        isVideoColorReverse() {
            isVideoParamChanged = true;
        },
        fps() {
            isVideoParamChanged = true;
        },
    },
    methods: {
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
        onChangeInputImageFile(e) {
            if (this.isLoadingInputImage) {
                return;
            }
            this.isLoadingInputImage = true;

            this.imageFile = e.target.files[0];
            e.target.value = "";

            if (!this.imageFile.type.startsWith("image")) {
                alert("画像ファイルを選択してね。");
                this.imageFile = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                this.isLoadingInputImage = false;
                return;
            }

            const img = new Image();
            img.onload = () => {
                if (img.width < this.imageWidthMin || img.width > imageWidthMaxDefault) {
                    alert(`画像の幅は${this.imageWidthMin}px以上${imageWidthMaxDefault}px以下の必要があるよ。`);
                    this.$refs.inputImageFile.value = "";
                    this.imageFile = null;
                    this.imageWidth = imageWidthOri = this.imageWidthMin;
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
                }

                this.imageBaseAverageColor = baseAverageColorDefault;
                this.imageBaseColorDistance = baseColorDistanceDefault;

                URL.revokeObjectURL(img.src);
                this.isLoadingInputImage = false;
            };
            img.onerror = () => {
                alert("画像の読み込みに失敗したよ。");
                this.$refs.inputImageFile.value = "";
                this.imageFile = null;
                this.imageWidth = imageWidthOri = this.imageWidthMin;
                URL.revokeObjectURL(img.src);
                this.isLoadingInputImage = false;
            };

            img.src = URL.createObjectURL(this.imageFile);
        },
        onChangeInputVideoFile(e) {
            if (this.isLoadingInputVideo) {
                return;
            }
            this.isLoadingInputVideo = true;

            this.videoFile = e.target.files[0];
            e.target.value = "";

            if (!this.videoFile.type.startsWith("video")) {
                alert("動画ファイルを選択してね。");
                this.videoFile = null;
                this.videoWidth = videoWidthOri = this.videoWidthMin;
                this.isLoadingInputVideo = false;
                return;
            }

            const video = document.createElement("video");
            video.onloadedmetadata = () => {
                if (video.videoWidth < this.videoWidthMin || video.videoWidth > videoWidthMaxDefault) {
                    alert(`画像の幅は${this.videoWidthMin}px以上${videoWidthMaxDefault}px以下の必要があるよ。`);
                    this.$refs.inputVideoFile.value = "";
                    this.videoFile = null;
                    this.videoWidth = videoWidthOri = this.videoWidthMin;
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
                    this.isLoadingInputVideo = false;

                    this.generateTukiArt();
                }
            };
            video.onerror = () => {
                alert("動画の読み込みに失敗したよ。");
                this.$refs.inputVideoFile.value = "";
                this.videoFile = null;
                this.videoWidth = videoWidthOri = this.videoWidthMin;
                URL.revokeObjectURL(video.src);
                this.isLoadingInputVideo = false;
            };

            video.src = URL.createObjectURL(this.videoFile);
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
                clearInterval(timer); timer = 0;
                
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

            this.resultMessage = MSG_NO_INPUT_DATA;
            this.tukiArtType = "none";
            this.clearResult();
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
                this.isGeneratingTukiArt ||
                this.mode === "image" && this.isLoadingInputImage ||
                this.mode === "video" && this.isLoadingInputVideo
            ) {
                return;
            }
            this.isGeneratingTukiArt = true;

            // スマホででかい画像の時に何故か「処理中…」のやつがでない現象が発生するため、強制的に描画させる
            this.$forceUpdate();

            // こうしないと「処理中…」のやつがでない
            setTimeout(this.generateTukiArt1, 50);
        },
        generateTukiArt1() {
            if (this.mode !== "video") {
                this.clearResultVideo();
            }

            if (this.tukiArtType === "video") {
                clearInterval(timer); timer = 0;
            }

            if (this.mode === "text") {
                const monoCanvas = new MonochromeCanvas();

                if (this.text === "") {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                    return;
                }

                if (this.isSafety) {
                    const charArray = [...this.text];
                    if (charArray.length > textLengthSafeMax) {
                        this.text = charArray.slice(0, textLengthSafeMax).join("");
                    }
                }

                try {
                    const letterSpacingLevel = this.needDetailConfigLetterSpacingLevel ? this.letterSpacingLevel : letterSpacingLevelDefault;

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
                        this.displayTukiArt(monoCanvas);
                        this.resultMessage = "";
                        this.tukiArtType = this.mode;
                        this.shouldDisplaySample = false;
                    }
                    catch (e) {
                        console.error(e);
                        this.resultMessage = MSG_TOO_MANY_CHARA;
                        this.tukiArtType = "none";
                        this.clearResult();
                    }
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
                    this.isGeneratingTukiArt = false;
                }
            }
            else if (this.mode === "image") {
                const monoCanvas = new MonochromeCanvas();

                if (this.imageFile == null || this.imageWidth === 0) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                    return;
                }

                fileReader.onload = () => {
                    monoCanvas.image(
                        fileReader.result,
                        this.imageWidth,
                        Math.round(this.imageWidth * imageHeightRate),
                        this.imageBaseAverageColor,
                        this.needImageOutline,
                        this.imageBaseColorDistance,
                        this.imageColorCount,
                        this.useImageNanameMikaduki,
                        this.isImageColorReverse
                    ).then(() => {
                        this.tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isImageColorReverse, this.isImageYokoLinePowerUp, this.isImageTateLinePowerUp, this.imageColorCount, this.useImageNanameMikaduki);
                        try {
                            this.displayTukiArt(monoCanvas);
                            this.resultMessage = "";
                            this.tukiArtType = this.mode;
                            this.shouldDisplaySample = false;
                        }
                        catch (e) {
                            console.error(e);
                            this.resultMessage = MSG_TOO_MANY_CHARA;
                            this.tukiArtType = "none";
                            this.clearResult();
                        }
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
                        this.isGeneratingTukiArt = false;
                    });
                };
                fileReader.onerror = () => {
                    this.resultMessage = MSG_ERROR;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                };

                fileReader.readAsDataURL(this.imageFile);
            }
            else if (this.mode === "video") {
                if (this.videoFile == null) {
                    this.resultMessage = MSG_NO_INPUT_DATA;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                    return;
                }

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
                    
                    const isValidCanvas = canvasSize.test({
                        width : resizeVideoWidth,
                        height: resizeVideoHeight
                    });
                    if (!isValidCanvas) {
                        this.resultMessage = MSG_FAILURE_VIDEO_MONO;
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                        return;
                    }

                    // 何故かサムネが表示されないことがあるので数フレーム回す
                    let forceRunFrameCount = 5;
                    let font = "";
                    let lineHeight = 0;
                    const resultVideoContext = this.$refs.resultVideo.getContext("2d");

                    const drawTukiArtFrame = () => {
                        if (this.videoWidth !== resizeVideoWidth) {
                            // 最初に最大サイズでcanvasSize.testしているので再度する必要はない
                            resizeVideoWidth = this.videoWidth;
                            resizeVideoHeight = Math.round(resizeVideoWidth * videoHeightRate);
                            forceRunFrameCount = 1;
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

                        ({font, lineHeight} = TukiArtGenerator.createTukiArtCanvas(tukiArt, this.$refs.resultVideo, resultVideoContext, font, lineHeight, forceRunFrameCount > 0));
                    };

                    video.onseeked = () => {
                        try {
                            drawTukiArtFrame();
                        }
                        catch (e) {
                            console.error(e);
                            clearInterval(timer); timer = 0;
                            this.resultMessage = MSG_ERROR;
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
                            this.resultMessage = MSG_ERROR;
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

                    this.resultMessage = "";
                    this.tukiArtType = this.mode;
                    this.shouldDisplaySample = false;
                    this.isGeneratingTukiArt = false;
                };
                video.onerror = () => {
                    alert("動画の読み込みに失敗したよ。");
                    this.resultMessage = MSG_ERROR;
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
        displayTukiArt(monoCanvas) {
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
