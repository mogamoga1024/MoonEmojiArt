
const PlusMinusInputNumbur = {
    props: {
        modelValue: Number | String,
        min: Number,
        max: Number,
    },
    emits: ["update:modelValue"],
    template: `
        <div class="plus-minus-input-numbur">
          <div class="minus-btn"
               @click="onClickMinusButton">-</div>
          <input type="number"
                 :min="min"
                 :max="max"
                 :value="modelValue"
                 @blur="onBlurInputNumber">
          <div class="plus-btn"
               @click="onClickPlusButton">+</div>
        </div>
    `,
    data() {
        return {
            modelPrev: 0
        }
    },
    created() {
        this.modelPrev = Number(this.modelValue);
    },
    watch: {
        modelValue(newVal) {
            if (newVal === "") return;
            this.modelPrev = Number(newVal);
        },
    },
    methods: {
        onClickMinusButton() {
            const modelValue = Number(this.modelValue);
            if (modelValue > this.min) {
                this.$emit("update:modelValue", modelValue - 1);
            }
        },
        onClickPlusButton() {
            const modelValue = Number(this.modelValue);
            if (modelValue < this.max) {
                this.$emit("update:modelValue", modelValue + 1);
            }
        },
        onBlurInputNumber(e) {
            const newVal = Number(e.target.value);

            let newModelValue = newVal;

            if (e.target.value === "") {
                newModelValue = this.modelPrev;
            }
            else if (newVal < this.min) {
                newModelValue = this.min;
            }
            else if (newVal > this.max) {
                newModelValue = this.max;
            }

            this.$forceUpdate();

            this.$emit("update:modelValue", newModelValue);
        }
    }
};
