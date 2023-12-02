import { bitable, type Selection } from '@lark-base-open/js-sdk'
import { ref } from 'vue';


export default function useSelection() {
  const selection = ref<Selection>();

  const base = bitable.base;
  base.getSelection().then((s) => {
    if (!s) return;
    selection.value = s;
  })

  base.onSelectionChange(({ data: s }) => {
    if (!s) return;
    selection.value = s;
  })

  return {
    selection
  }
}