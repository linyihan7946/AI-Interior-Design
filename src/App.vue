<template>
  <div id="app">
    <div class="canvas-container">
      <Canvas3D />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Canvas3D from '@/components/Canvas3D.vue';

export default defineComponent({
  name: 'App',
  components: {
    Canvas3D
  }
});
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style>