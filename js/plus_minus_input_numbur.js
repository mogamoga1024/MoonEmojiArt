
const PlusMinusInputNumbur = {
    props: {
        modelValue: Number,
        min: Number,
        max: Number,
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
            if (this.modelValue > this.min) {
                const newModelValue = this.modelValue - 1;
                this.$emit("update:modelValue", newModelValue);
                this.$emit("change", newModelValue);
            }
        },
        onClickPlusButton() {
            if (this.modelValue < this.max) {
                const newModelValue = this.modelValue + 1;
                this.$emit("update:modelValue", newModelValue);
                this.$emit("change", newModelValue);
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
            this.$emit("change", newModelValue);
        }
    }
};
