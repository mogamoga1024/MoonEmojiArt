
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
                 :value="modelValue"
                 @focus="$event.target.select()"
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
                this.$emit("update:modelValue", this.modelValue - 1);
            }
        },
        onClickPlusButton() {
            if (this.modelValue < this.max) {
                this.$emit("update:modelValue", this.modelValue + 1);
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
