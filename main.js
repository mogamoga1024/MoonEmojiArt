
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
        }
    },
    mounted() {
        monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));
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
        },
        onChangeBaseAverageColorNumber(e) {
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
        onChangeBaseColorDistanceNumber(e) {
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
        onClickMonochromeButton() {
            if (this.file == null) {
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
