<template>
  <div class="canvas2d" id="view2d" ref="canvas2d"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Canvas2D',
  setup() {
    const canvas2d = ref<HTMLElement | null>(null);

    return {
      canvas2d
    };
  }
});
</script>