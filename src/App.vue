<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ConfigProvider, StyleProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

</script>

<template>
  <ConfigProvider :locale="zhCN">
    <StyleProvider hash-priority="high">
      <RouterView />
    </StyleProvider>
  </ConfigProvider>
</template>