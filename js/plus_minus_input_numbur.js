
const PlusMinusInputNumbur = {
    props: {
        modelValue: Number,
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
                 :value="mutModelValue"
                 @blur="onBlurInputNumber">
          <div class="plus-btn"
               @click="onClickPlusButton">+</div>
        </div>
    `,
    data() {
        return {
            mutModelValue: 0,
            modelPrev: 0
        }
    },
    created() {
        this.mutModelValue = this.modelValue;
        this.modelPrev = this.modelValue;
    },
    watch: {
        mutModelValue(newVal) {
            if (newVal === "") return;
            this.modelPrev = Number(newVal);
        },
    },
    methods: {
        onClickMinusButton() {
            if (this.mutModelValue > this.min) {
                this.mutModelValue -= 1;
                this.$emit("update:modelValue", this.mutModelValue);
            }
        },
        onClickPlusButton() {
            if (this.mutModelValue < this.max) {
                this.mutModelValue += 1;
                this.$emit("update:modelValue", this.mutModelValue);
            }
        },
        onBlurInputNumber(e) {
            const newVal = Number(e.target.value);

            if (e.target.value === "") {
                this.mutModelValue = this.modelPrev;
                this.$forceUpdate();
            }
            else if (newVal < this.min) {
                this.mutModelValue = this.min;
            }
            else if (newVal > this.max) {
                this.mutModelValue = this.max;
            }
            else {
                this.mutModelValue = newVal;
            }
            
            this.$emit("update:modelValue", this.mutModelValue);
        }
    }
};
