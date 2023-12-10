<script setup lang="ts">
import { Form, FormItem, Input, Textarea, Button, message, Select, InputPassword, type FormInstance } from 'ant-design-vue';
import useSelection from '@/hooks/useSelection';
import useContent from '@/hooks/useContent';
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRequest } from 'vue-request';
import type { Rule } from 'ant-design-vue/es/form';

// TODO:
// 1. API 链接保存
// 2. 收藏夹保存
// 3. 标签保存
// 4. 内容保存，可回退
// 7. 动图
// 8. 上架

const { selection } = useSelection();
const { content } = useContent(selection);

const formRef = ref<FormInstance>();
const form = ref({
  apiURL: '',
  content: '',
  tags: [] as string[],
  // folder: '',
});

watch(content, (value) => {
  if (!value) return;
  form.value.content = value;
  formRef.value?.validateFields('content');
});

const formRules: Record<string, Rule[]> = {
  apiURL: [
    {
      required: true,
      message: '请输入 API 链接',
      trigger: 'change'
    },
  ],
  // folder: [
  //   {
  //     required: false,
  //   },
  // ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'change'
    },
  ],
}

const saveToCubox = () => {
  const { apiURL, content, tags } = form.value;
  return axios.post(apiURL, {
    content: tags.length ? `${content}\n#${tags.join(' #')}` : content,
  });
};
const { loading, runAsync } = useRequest(saveToCubox)

const submit = () => {
  formRef.value?.validate().then(() => {
    runAsync().then((res) => {
      if (res.data.code !== 0) {
        message.error(`保存失败：${res.data.message}`);
        return;
      }
      message.success('保存成功');
    }).catch((error) => {
      message.error(`保存失败：${error.message}`);
    })
  });
};

</script>

<template>
  <main style="padding: 6px 12px;">
    <Form layout="vertical" :rules="formRules" ref="formRef" :model="form">
      <FormItem name="apiURL">
        <template #label>
          <div class="flex flex-row w-full items-center">
            <div class="flex-1">API 链接</div>
            <Button type="link" href="https://v.flomoapp.com/mine?source=incoming_webhook&ref=lark_plugin" target="_blank" class="!p-0 !h-[unset]">点击获取</Button>
          </div>
        </template>
        <InputPassword v-model:value="form.apiURL" placeholder="在 Flomo 官网获取 API 链接"/>
      </FormItem>
      <!-- <FormItem label="收藏夹" name="folder">
        <Input v-model:value="form.folder" placeholder="默认放在收集箱"></Input>
      </FormItem> -->
      <FormItem label="标签" name="tags">
        <Select v-model:value="form.tags" mode="tags" placeholder="输入后按回车添加"></Select>
      </FormItem>
      <FormItem label="内容" name="content">
        <Textarea v-model:value="form.content" autoSize placeholder="选择表格记录会自动添加"></Textarea>
      </FormItem>
      <FormItem>
        <div class="flex flex-row items-center">
          <Button type="primary" @click="submit" :loading="loading">保存</Button>
          <div class="text-sm text-gray-400 ml-3">每天可调用 100 次 API</div>
        </div>
      </FormItem>
    </Form>
  </main>
</template>
<style scoped>

:deep(.ant-form-item-label label) {
  width: 100%;
}
</style>