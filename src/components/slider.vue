<template>
    <v-slider
        :value="value"
        v-model="localValue"
        @change="$emit('input', $event)"
        step="1"
        ticks="always"
        tick-size="4"
        :label="label"
        thumb-label="always"
        :max="maxHealth"
        :min="minHealth"
        :color="thumbColor"
        @mousedown="clicky"
        @mouseup="hideTopBar"
    >
        <template v-slot:append>
            <v-text-field :value="value" v-model="localValue" @change="$emit('input', $event)" class="mt-0 pt-0" type="number" style="width: 60px"></v-text-field>
        </template>
    </v-slider>
</template>

<script>
export default {
    props: {
        value: Number,
        label: String,
        maxHealth: Number,
        minHealth: Number,
        thumbColor: String,
        clicky: Function
    },
    data() {
        return {
            localValue: 0
        };
    },
    methods: {
        hideTopBar(){
            this.$emit('hideTopBarMessage');
        }
    },
    watch: {
        localValue(){
            this.$emit('topBarValue', this.localValue);
        }
    },
    created(){
        this.localValue = this.value;
    }
};
</script>

<style lang="scss" scoped></style>
