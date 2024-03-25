
let debugText = "";
function debug(text) {
    debugText += text + "\n";
};

let appTitleClickCount = 0;
let generateButtonClickCount = 0;

let tukiArt = "";

let isLoadingInputImage = false;
let isLoadingInputVideo = false;

let timer = 0;
let isVideoParamChanged = false;

const MSG_非表示 = "";
let MSG_月ジェネの説明 = 
`・変換したい文か画像を入れてね！
・サイズが小さいとクオリティが低くなるよ！
・即生成ボタンと生成ボタンは2連打で切り替えられるよ！
・どうしても巨大な月文字を作りたい人はタイトル部分を2連打してね。
・ちなみにYouTubeのコメントに使うとスパム判定で表示されないよ。悲しいね。`;
const MSG_月ジェネの説明_裏 = 
`・・変換したい文か画像を入れてね！
・サイズが小さいとクオリティが低くなるよ！
・即生成ボタンと生成ボタンは2連打で切り替えられるよ！
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

let shouldReGenerateTukiArt = false;

let canvasMaxWidth = 0; // todo
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
            canCopyButtonClick: true,
            resultMessage: MSG_月ジェネの説明,
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

            isGeneratingTukiArt: false,
            isGenerateImmediatelyMode: true, // todo

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

        try {
            canvasMaxWidth = (await canvasSize.maxWidth()).width;
            canvasMaxHeight = (await canvasSize.maxHeight()).height;
            const { width: maxAreaWidth, height: maxAreaHeight } = await canvasSize.maxArea();
            canvasMaxArea = maxAreaWidth * maxAreaHeight;
        }
        catch (e) {
            canvasMaxWidth = 32767;
            canvasMaxHeight = 32767;
            canvasMaxArea = 10836 * 10836;
        }

        // console.log(canvasMaxWidth, canvasMaxHeight, canvasMaxArea);

        canvasSizeTest = createCanvasSizeTest(canvasMaxWidth, canvasMaxHeight, canvasMaxArea);
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
            if (newVal === false) {
                if (this.isGenerateImmediatelyMode && shouldReGenerateTukiArt) {
                    shouldReGenerateTukiArt = false;
                    this.generateTukiArt();
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

                    if (this.isGenerateImmediatelyMode) {
                        this.generateTukiArt();
                    }
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

        onClickNeedDetailConfigLetterSpacingLevel() {
            this.needDetailConfigLetterSpacingLevel = !this.needDetailConfigLetterSpacingLevel;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickNeedDetailConfigTukiArtMargin() {
            this.needDetailConfigTukiArtMargin = !this.needDetailConfigTukiArtMargin;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeText() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeTukiCount() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickLetterSpacingLevel(num) {
            this.letterSpacingLevel = num;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
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
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginTop() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginBottom() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginLeft() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeTukiArtMarginRight() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsBold() {
            this.isBold = !this.isBold;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsTextColorReverse() {
            this.isTextColorReverse = !this.isTextColorReverse;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsTate(isTate) {
            this.isTate = isTate;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsTextYokoLinePowerUp() {
            this.isTextYokoLinePowerUp = !this.isTextYokoLinePowerUp;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsTextTateLinePowerUp() {
            this.isTextTateLinePowerUp = !this.isTextTateLinePowerUp;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },

        // 🌕🌕 画像パラメータのUIイベント 🌕🌕

        onChangeImageBaseAverageColor() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickImageColorCount(count) {
            this.imageColorCount = count;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickUseImageNanameMikaduki() {
            this.useImageNanameMikaduki = !this.useImageNanameMikaduki;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeImageBaseColorDistance() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onChangeImageWidth() {
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickNeedImageOutline() {
            this.needImageOutline = !this.needImageOutline;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsImageColorReverse() {
            this.isImageColorReverse = !this.isImageColorReverse;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsImageYokoLinePowerUp() {
            this.isImageYokoLinePowerUp = !this.isImageYokoLinePowerUp;
            if (this.isGenerateImmediatelyMode) {
                this.generateTukiArt();
            }
        },
        onClickIsImageTateLinePowerUp() {
            this.isImageTateLinePowerUp = !this.isImageTateLinePowerUp;
            if (this.isGenerateImmediatelyMode) {
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
            if (this.isGeneratingTukiArt) {
                return;
            }

            tukiArt = "";

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

            if (this.mode === "video" || !this.isGenerateImmediatelyMode) {
                this.resultMessage = MSG_月ジェネの説明;
                this.tukiArtType = "none";
                this.clearResult();
            }
            else {
                this.generateTukiArt();
            }
        },
        // 生成ボタン押下時
        onClickGenerateButton() {
            if (this.mode === "video") {
                this.generateTukiArt();
                return;
            }

            if (generateButtonClickCount === 0) {
                setTimeout(() => {
                    generateButtonClickCount = 0;
                }, 500);
            }

            generateButtonClickCount++;

            if (generateButtonClickCount >= 2) {
                this.isGenerateImmediatelyMode = !this.isGenerateImmediatelyMode;
            }
            else {
                this.generateTukiArt();
            }
        },
        onClickCopyButton() {
            if (!this.canCopyButtonClick) {
                return;
            }
            this.canCopyButtonClick = false;

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
                this.canCopyButtonClick = true;
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

            if (this.isGeneratingTukiArt) {
                if (this.isGenerateImmediatelyMode) {
                    shouldReGenerateTukiArt = true;
                }
                return;
            }

            this.isGeneratingTukiArt = true;

            tukiArt = "";

            if (this.mode !== "video") {
                this.clearResultVideo();
            }

            if (this.tukiArtType === "video") {
                clearInterval(timer); timer = 0;
            }

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
                if (!this.isGeneratingTukiArt && !shouldReGenerateTukiArt) {
                    clearInterval(moonTimer);
                    return;
                }
                moonIndex = (moonIndex + 1) % moons.length;
                this.moon = moons[moonIndex];
            }, 100);

            // こうしないとスマホで「処理中…」のやつがでない
            setTimeout(this.generateTukiArt1, 50);
        },
        generateTukiArt1() {
            if (this.mode === "text") {
                const monoCanvas = new MonochromeCanvas();

                if (this.isSafety) {
                    const charArray = [...this.text];
                    if (charArray.length > textLengthSafeMax) {
                        this.text = charArray.slice(0, textLengthSafeMax).join("");
                    }
                }

                try {
                    const letterSpacingLevel = this.needDetailConfigLetterSpacingLevel ? this.letterSpacingLevel : letterSpacingLevelDefault;

                    monoCanvas.text(this.text, this.fontFamily, this.tukiCount, this.isBold, this.isTate, letterSpacingLevel);
                    tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isTextColorReverse, this.isTextYokoLinePowerUp, this.isTextTateLinePowerUp, 2);

                    if (this.needDetailConfigTukiArtMargin) {
                        const tukiArtMargin = {
                            top: this.tukiArtMarginTop, bottom: this.tukiArtMarginBottom,
                            left: this.tukiArtMarginLeft, right: this.tukiArtMarginRight
                        };
                        tukiArt = TukiArtGenerator.applyMargin(tukiArt, tukiArtMargin, this.isTextColorReverse);
                    }

                    const textList = tukiArt.split("\n");
                    
                    const worker = new Worker("./js/create_tuki_art_canvas_worker.js");
                    worker.onmessage = async e => {
                        worker.terminate();
                        try {
                            await this.displayTukiArt(null, e.data.result, e.data.width);
                            this.resultMessage = MSG_非表示;
                            this.tukiArtType = this.mode;
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
                        worker.terminate();
                        this.resultMessage = MSG_完成イメージが作れなかった;
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                    };
                    worker.postMessage({textList, canvasMaxWidth, canvasMaxHeight, canvasMaxArea});
                }
                catch(e) {
                    console.error(e);
                    if (e.constructor === TooLargeCanvasError) {
                        if (this.isTate) {
                            this.resultMessage = MSG_テキストが大きすぎてキャンバスが作れなかった_縦;
                        }
                        else {
                            this.resultMessage = MSG_テキストが大きすぎてキャンバスが作れなかった_横;
                        }
                    }
                    else {
                        this.resultMessage = MSG_エラー;
                    }
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                }
            }
            else if (this.mode === "image") {
                const monoCanvas = new MonochromeCanvas();
                const fileReader = new FileReader();

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
                    ).then(async () => {
                        tukiArt = TukiArtGenerator.createTukiArt(monoCanvas.pixels, this.isImageColorReverse, this.isImageYokoLinePowerUp, this.isImageTateLinePowerUp, this.imageColorCount, this.useImageNanameMikaduki);
                        const textList = tukiArt.split("\n");
                        
                        const worker = new Worker("./js/create_tuki_art_canvas_worker.js");
                        worker.onmessage = async e => {
                            worker.terminate();
                            try {
                                await this.displayTukiArt(monoCanvas, e.data.result, e.data.width);
                                this.resultMessage = MSG_非表示;
                                this.tukiArtType = this.mode;
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
                            worker.terminate();
                            this.resultMessage = MSG_完成イメージが作れなかった;
                            this.tukiArtType = "none";
                            this.clearResult();
                            this.isGeneratingTukiArt = false;
                        };
                        worker.postMessage({textList, canvasMaxWidth, canvasMaxHeight, canvasMaxArea});
                    }).catch(e => {
                        console.error(e);
                        if (e.constructor === TooLargeCanvasError) {
                            this.resultMessage = MSG_画像サイズが大きすぎてキャンバスが作れなかった;
                        }
                        else {
                            this.resultMessage = MSG_エラー;
                        }
                        this.tukiArtType = "none";
                        this.clearResult();
                        this.isGeneratingTukiArt = false;
                    });
                };
                fileReader.onerror = () => {
                    this.resultMessage = MSG_エラー;
                    this.tukiArtType = "none";
                    this.clearResult();
                    this.isGeneratingTukiArt = false;
                };

                fileReader.readAsDataURL(this.imageFile);
            }
            else if (this.mode === "video") {
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
                    this.tukiArtType = this.mode;
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
        displayTukiArt(monoCanvas, tukiArtData, tukiArtImageWidth) {
            return new Promise(async (resolve, reject) => {
                URL.revokeObjectURL(this.$refs.monochrome.src);
                URL.revokeObjectURL(this.$refs.resultImage.src);
    
                if (monoCanvas !== null) {
                    // OffscreenCanvasはtoDataURLが使えないのでこうする
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        this.$refs.monochrome.src = fileReader.result;
                        this.$refs.monochrome.style.maxWidth = monoCanvas.canvas.width + "px";
                    }
                    fileReader.onerror = e => {
                        console.log(e);
                        // 別にモノクロ画像は重要ではないので何もしない
                    }
                    const monoBlob = await monoCanvas.canvas.convertToBlob();
                    fileReader.readAsDataURL(monoBlob);
                }
                
                this.$refs.resultImage.style.maxWidth = tukiArtImageWidth + "px";
                this.$refs.resultImage.src = tukiArtData;

                this.$refs.resultImage.onload = () => {
                    resolve();
                };
                this.$refs.resultImage.onerror = e => {
                    console.log(e);
                    reject();
                };
            });
        }
    }
};

Vue.createApp(App).mount("#app");
