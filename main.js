
let monoCanvas = null;

const App = {
    data() {
        return {
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
            imageWidthOri: 0,
            imageHeightOri: 100,
            imageWidth: 100,
            imageWidthMin: 100,
            imageWidthMax: 1280,
            imageSizeRate: 1,
            imageSizeRateMin: 0.1,
            imageSizeRateMax: Math.floor(1280 * 10 / 100) / 10, // Math.floor(imageWidthMax * 10 / imageWidthMin) / 10
        }
    },
    mounted() {
        monoCanvas = new MonochromeCanvas(this.$refs.canvas);
        monoCanvas.monochrome("野獣先輩.png", this.baseAverageColor, this.needOutline, this.baseColorDistance);
    },
    watch: {
        baseAverageColor(newVal) {
            if (newVal === "") {
                return;
            }
            this.baseAverageColorPrev = this.baseAverageColor;
        },
        baseColorDistance(newVal) {
            if (newVal === "") {
                return;
            }
            this.baseColorDistancePrev = this.baseColorDistance;
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
        onBlurBaseAverageColorNumber(e) {
            if (e.target.value === "") {
                this.baseAverageColor = this.baseAverageColorPrev;
                return;
            }
            const value = Number(e.target.value);
            if (value < this.baseAverageColorMin) {
                this.baseAverageColor = this.baseAverageColorMin;
            }
            else if (value > this.baseAverageColorMax) {
                this.baseAverageColor = this.baseAverageColorMax;
            }
        },
        onBlurBaseColorDistanceNumber(e) {
            if (e.target.value === "") {
                this.baseColorDistance = this.baseColorDistancePrev;
                return;
            }
            const value = Number(e.target.value);
            if (value < this.baseColorDistanceMin) {
                this.baseColorDistance = this.baseColorDistanceMin;
            }
            else if (value > this.baseAverageColorMax) {
                this.baseColorDistance = this.baseColorDistanceMax;
            }
        },
        onBlurImageWidth(e) {
            if (e.target.value === "") {
                this.imageWidth = this.imageWidthOri; // todo
                return;
            }
            const value = Number(e.target.value);
            if (value < this.imageWidthMin) {
                this.imageWidth = this.imageWidthMin;
            }
            else if (value > this.imageWidthMax) {
                this.imageWidth = this.imageWidthMax;
            }
            if (this.file !== null) {
                this.imageSizeRate = Math.floor(this.imageWidth * 10 / this.imageWidthOri) / 10;
            }
        },
        onBlurImageSizeRate(e) {
            if (e.target.value === "") {
                this.imageSizeRate = 1; // todo
                return;
            }
            const value = Number(e.target.value);
            if (value < this.imageSizeRateMin) {
                this.imageSizeRate = this.imageSizeRateMin;
            }
            else if (value > this.imageSizeRateMax) {
                this.imageSizeRate = this.imageSizeRateMax;
            }
            if (this.file !== null) {
                this.imageWidth = Math.round(this.imageWidthOri * this.imageSizeRate);
            }
        },
        onClickMonochromeButton() {
            if (this.file == null || this.imageWidth === 0) {
                return;
            }
        
            this.fileReader.readAsDataURL(this.file);
        
            this.fileReader.onload = () => {
                monoCanvas.monochrome(this.fileReader.result, this.baseAverageColor, this.needOutline, this.baseColorDistance);
            }
        }
    }
};

Vue.createApp(App).mount("#app");
