<template>
  <div ref="canvasRef" id="view3d">
    <canvas ref="canvas3d" id="canvas3d"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'Canvas3D',
  setup() {
    const canvasRef = ref<HTMLElement | null>(null);
    const canvas3d = ref<HTMLCanvasElement | null>(null);

    return {
      canvasRef,
      canvas3d
    };
  }
});
</script>

<style scoped>
#view3d {
  width: 100%;
  height: 100%;
  position: relative;
}

#canvas3d {
  width: 100%;
  height: 100%;
  display: block;
}
</style>