<template>
    <v-select class="select" :value="value" @change="$emit('input', $event)" :items="passedItems" :label="labelName">
        <template :slot="slotName" v-for="(slotName, i) in ['selection', 'item']" slot-scope="{ item }">
            <span :key="i">{{ item }}</span>
            <img :key="`i${i}`" class="select-image" :src="require(`@/assets/${labelName}s/${item}.png`)" />
        </template>
    </v-select>
</template>

<script>
export default {
    props: {
        value: String,
        passedItems: Array,
        labelName: String
    }
};
</script>

<style lang="scss" scoped>
.select {
    max-width: 400px;
}

.select-image {
    max-height: 2em;
    margin-left: 1em;
}
</style>
