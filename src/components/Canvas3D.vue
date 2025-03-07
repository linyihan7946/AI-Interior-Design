<!--
 * @Author: LinYiHan
 * @Date: 2025-03-01 17:02:30
 * @Description: 
 * @Version: 1.0
-->
<template>
  <div ref="canvasRef" id="view3d"></div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';
// import { Cube } from '@/core/Cube';
import { Api } from '@/core/Api';

export default defineComponent({
  name: 'Canvas3D',
  setup() {
    // 创建一个 ref 变量，初始值是 null
    const canvasRef = ref(null);

    onMounted(() => {
      if (!canvasRef.value) return;

      Api.init({view3dId: canvasRef.value.id});
      Api.executeCommand("newFile", {});
      Api.executeCommand("createOneWall", {});
    });

    return {
      canvasRef,
    };
  },
});
</script>