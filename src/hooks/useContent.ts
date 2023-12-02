import type { Ref } from "vue";
import { ref, watch } from "vue";
import { bitable, type Selection } from '@lark-base-open/js-sdk'

export default function useContent(selection: Ref<Selection | undefined>) {
  const content = ref('')
  watch(selection, async (selection) => {
    if (!selection) return
    const { tableId, recordId } = selection;
    if (!tableId || !recordId) return
  
    const table = await bitable.base.getTable(tableId);
    const fieldList = await table.getFieldList();
    const cellList = await Promise.all(fieldList.map(async (field) => {
      return {
        name: await field.getName(),
        cellString: await field.getCellString(recordId),
      }
    }));
    content.value = cellList.map((cell) => `${cell.name}: ${cell.cellString}`).join('\n');
  })
  return {
    content
  }
}