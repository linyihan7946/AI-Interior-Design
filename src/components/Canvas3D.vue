<template>
  <div ref="canvasRef" id="view3d" style="width: 50%;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Canvas3D',
  setup() {
    const canvasRef = ref(null);

    return {
      canvasRef
    };
  }
});
</script>