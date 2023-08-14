
let monoCanvas = null;

const App = {
    data() {
        return {
            file: null,
            fileReader: null,
            baseAverageColor: 90,
            baseColorDistance: 50,
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
    }
};

Vue.createApp(App).mount("#app");
