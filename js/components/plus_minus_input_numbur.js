
const PlusMinusInputNumbur = {
    props: {
        modelValue: Number,
        min: Number,
        max: Number,
        step: {
            type: Number,
            default: 1
        }
    },
    emits: ["update:modelValue", "change"],
    template: `
        <div class="plus-minus-input-numbur">
          <div class="minus-btn"
               ontouchstart=""
               @click="onClickMinusButton">-</div>
          <input type="number"
                 :min="min"
                 :max="max"
                 :value="modelValue"
                 @focus="$event.target.select()"
                 @blur="onBlurInputNumber">
          <div class="plus-btn"
               ontouchstart=""
               @click="onClickPlusButton">+</div>
        </div>
    `,
    data() {
        return {
            modelPrev: 0
        }
    },
    created() {
        this.modelPrev = this.modelValue;
    },
    watch: {
        modelValue(newVal) {
            if (newVal === "") return;
            this.modelPrev = newVal;
        },
    },
    methods: {
        onClickMinusButton() {
            if (this.modelValue === this.min) {
                return;
            }

            const newModelValue = this.modelValue - this.step;
            if (newModelValue >= this.min) {
                this.$emit("update:modelValue", newModelValue);
                this.$emit("change", newModelValue);
            }
            else {
                this.$emit("update:modelValue", this.min);
                this.$emit("change", this.min);
            }
        },
        onClickPlusButton() {
            if (this.modelValue === this.max) {
                return;
            }

            const newModelValue = this.modelValue + this.step;
            if (newModelValue <= this.max) {
                this.$emit("update:modelValue", newModelValue);
                this.$emit("change", newModelValue);
            }
            else {
                this.$emit("update:modelValue", this.max);
                this.$emit("change", this.max);
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

            if (newModelValue !== this.modelValue) {
                this.$emit("update:modelValue", newModelValue);
                this.$emit("change", newModelValue);
            }
        }
    }
};
