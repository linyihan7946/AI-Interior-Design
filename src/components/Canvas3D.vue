<!--
 * @Author: LinYiHan
 * @Date: 2025-03-01 17:02:30
 * @Description: 
 * @Version: 1.0
-->
<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { Cube } from '@/core/Cube';
import { Renderer } from '@/core/Renderer';

export default defineComponent({
  name: 'Canvas3D',
  setup() {
    // 创建一个 ref 变量，初始值是 null
    const canvasRef = ref(null);

    onMounted(() => {
      if (!canvasRef.value) return;

      // 创建场景
      const scene = new THREE.Scene();

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // 创建渲染器
      const renderer = new Renderer(scene, camera, canvasRef.value);

      // 创建立方体
      const cube = new Cube(scene);

      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);

        // 立方体旋转
        cube.animate();

        // 渲染场景
        renderer.render();
      };

      animate();
    });

    return {
      canvasRef,
    };
  },
});
</script>