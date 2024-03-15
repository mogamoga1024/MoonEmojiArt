
const PlusMinusInputNumbur = {
    props: {
        modelValue: Number,
        modelMin: Number,
        modelMax: Number,
    },
    emits: ['update:modelValue'],
    template: `
        <div class="plus-minus-input-numbur">
          <div class="minus-btn"
               @click="onClickMinusButton">-</div>
          <input type="number"
                 :min="modelMin"
                 :max="modelMax"
                 :value="modelValue"
                 @blur="onBlurInputNumber">
          <div class="plus-btn"
               @click="onClickPlusButton">+</div>
        </div>
    `,
    data() {
        return {
            // todo
        }
    },
    created() {
        // todo
    },
    methods: {
        onClickMinusButton() {
            // todo
        },
        onClickPlusButton() {
            // todo
        },
        onBlurInputNumber() {
            // todo
        }
    }
};
