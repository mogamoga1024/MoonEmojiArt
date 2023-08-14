
let monoCanvas = null;

const App = {
    data() {
        return {
            file: null,
            fileReader: null,
            baseAverageColor: 90,
            baseAverageColorDefault: 90,
            baseAverageColorMin: 0,
            baseAverageColorMax: 255,
            baseColorDistance: 50,
            baseColorDistanceDefault: 50,
            baseColorDistanceMin: 0,
            baseColorDistanceMax: 200,
            needOutline: true,
        }
    },
    mounted() {
        monoCanvas = new MonochromeCanvas(document.querySelector("canvas"));
        monoCanvas.monochrome("野獣先輩.png");
    },
    methods: {
        onChangeInputFile(e) {
            this.file = e.target.files[0];
        },
        onChangeBaseAverageColorNumber(e) {
            if (e.target.value === "") {
                this.baseAverageColor = this.baseAverageColorDefault;
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
                this.baseColorDistance = this.baseColorDistanceDefault;
                return;
            }
            const value = Number(e.target.value);
            if (value < this.baseColorDistanceMin) {
                this.baseColorDistance = this.baseColorDistanceMin;
            }
            else if (value > this.baseAverageColorMax) {
                this.baseColorDistance = this.baseColorDistanceMax;
            }
        }
    }
};

Vue.createApp(App).mount("#app");
