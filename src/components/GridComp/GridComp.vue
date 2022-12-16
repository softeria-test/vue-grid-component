<template>
  <div class="grid-comp">
    <table v-if="myTable">
      <caption>Example Row Organized Stach Table</caption>
      <tr v-for="(row, rowIndex) in myTable.data.rows"
        :key="rowIndex"
      >
        <template v-if="isHeader(row)">
          <template v-for="(cellValue, colIndex) in row.cells">
            <th v-if="!isHidden(myTable, row, colIndex)"
              :key="colIndex"
              :rowspan="rowspan(row, colIndex)"
              :colspan="colspan(row, colIndex)"
              :style="{
                  textAlign: alignment(myTable, row, colIndex, 'horizontal'),
                  verticalAlign: alignment(myTable, row, colIndex, 'vertical')
              }"
            >
              <div :style="{ 'padding-left': leftPadding(row, colIndex) }">
                <span>{{ cellValue }}</span>
                <span
                  v-if="isHeaderLeaf(row, colIndex)"
                  class="arrow"
                  :class="sortDirectionClass(row, colIndex)"
                  @click="onSortArrowClicked(row, colIndex)"
                ></span>
              </div>
            </th>
          </template>
        </template>
        <template v-else>
          <template v-for="(cellValue, colIndex) in row.cells">
            <td v-if="!isHidden(myTable, row, colIndex)"
              :key="colIndex"
              :rowspan="rowspan(row, colIndex)"
              :colspan="colspan(row, colIndex)"
              :style="{
                textAlign: alignment(myTable, row, colIndex, 'horizontal'),
                verticalAlign: alignment(myTable, row, colIndex, 'vertical')
              }"
            >
              <div :style="{ 'padding-left': leftPadding(row, colIndex) }">
                {{ cellValue }}
              </div>
            </td>
          </template>
        </template>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import type { PropType, Ref } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import { factset as stach } from '@/stach-sdk'
import {
  createTable,
  isHeader,
  isHeaderLeaf,
  isHidden,
  alignment,
  rowspan,
  colspan,
  leftPadding,
  sortDirectionClass,
  sorted
} from './features/features'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
type IRow = stach.protobuf.stach.v2.RowOrganizedPackage.IRow
interface IMyHeaderCellDetail extends stach.protobuf.stach.v2.RowOrganizedPackage.IHeaderCellDetail {
  isOrderedAsc: boolean;
}

export default defineComponent({
  props: {
    table: Object as PropType<ITable>
  },
  setup (props) {
    const myTable: Ref<ITable | null> = ref(null)
    const isOrderedAsc = ref(true)

    watch(() => props.table, (table: ITable | undefined) => {
      myTable.value = createTable(table, isOrderedAsc.value)
    })

    const toggleSortDirection = (row: IRow, colIndex: number) => {
      const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
      headerCellDetail.isOrderedAsc = !headerCellDetail.isOrderedAsc
    }

    const updateSortDirectionRef = (row: IRow, colIndex: number) => {
      const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
      isOrderedAsc.value = headerCellDetail.isOrderedAsc
    }

    const onSortArrowClicked = (row: IRow, colIndex: number) => {
      toggleSortDirection(row, colIndex)
      updateSortDirectionRef(row, colIndex)
      if (myTable.value?.data?.rows) {
        myTable.value.data.rows = sorted(myTable.value.data.rows, colIndex, isOrderedAsc.value)
      }
    }

    return {
      myTable,
      isHeader,
      isHeaderLeaf,
      isHidden,
      alignment,
      rowspan,
      colspan,
      leftPadding,
      sortDirectionClass,
      onSortArrowClicked
    }
  }
})
</script>

<style scoped>
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid;
}
</style>
