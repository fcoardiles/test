<template>
  <b-button class="pt-2 pb-2" :variant="variant" size="sm" :disabled="isLoading" @click="click()">
    <b-spinner small v-show="isLoading"></b-spinner>
    <span class="sr-only" v-show="isLoading">Loading...</span>
    {{ text }}
  </b-button>
</template>

<script>
export default {
  name: "ActionButton",
  props: {
    row: Object,
    ctx: Object,
    text: String,
    action: Function,
    variant: String,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async click() {
      this.isLoading = true;

      try {
        await this.action(this.ctx, this.row);
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
</style>