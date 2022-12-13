<template>
  <div class="grid-comp">
    <table v-if="table">
      <caption>Example Row Organized Stach Table</caption>
      <tr v-for="(row, rowIndex) in table.data.rows"
        :key="rowIndex"
      >
        <template v-if="isHeader(row)">
          <template v-for="(cellValue, colIndex) in row.cells">
            <th v-if="!isHidden(row, colIndex)"
              :key="colIndex"
              :rowspan="rowspan(row, colIndex)"
              :colspan="colspan(row, colIndex)"
              :style="{
                  textAlign: alignment(row, colIndex, 'horizontal'),
                  verticalAlign: alignment(row, colIndex, 'vertical')
              }"
            >
              <div :style="{ 'padding-left': groupLevel(row, colIndex) + 'em' }">
                {{ cellValue }}
              </div>
            </th>
          </template>
        </template>
        <template v-else>
          <template v-for="(cellValue, colIndex) in row.cells">
            <td v-if="!isHidden(row, colIndex)"
              :key="colIndex"
              :rowspan="rowspan(row, colIndex)"
              :colspan="colspan(row, colIndex)"
              :style="{
                textAlign: alignment(row, colIndex, 'horizontal'),
                verticalAlign: alignment(row, colIndex, 'vertical')
              }"
            >
              <div :style="{ 'padding-left': groupLevel(row, colIndex) + 'em' }">
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
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { factset as stach } from '@/stach-sdk'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
type IRow = stach.protobuf.stach.v2.RowOrganizedPackage.IRow

export default defineComponent({
  props: {
    table: Object as PropType<ITable>
  },
  setup (props) {
    const columns = () => {
      return props.table?.definition?.columns
    }

    const isHeader = (row: IRow) => {
      return (row.rowType as unknown as string) === 'Header'
    }

    const isHidden = (row: IRow, colIndex: number) => {
      const myColumns = columns()

      if ((row.rowType as unknown as string) === 'Header') {
        const headerCellColumnIndex = row.headerCellDetails?.[colIndex]?.columnIndex
        if (headerCellColumnIndex != null) {
          return myColumns?.[headerCellColumnIndex].isHidden
        }
      } else {
        return myColumns?.[colIndex].isHidden
      }
    }

    const alignment = (row: IRow, colIndex: number, direction: string) => {
      const alignmentType = direction === 'horizontal' ? 'halign' : 'valign'

      const myColumns = columns()

      if ((row.rowType as unknown as string) === 'Header') {
        const headerCellColumnIndex = row.headerCellDetails?.[colIndex]?.columnIndex
        if (headerCellColumnIndex != null) {
          return myColumns?.[headerCellColumnIndex]?.format?.[alignmentType]
        }
      } else {
        return myColumns?.[colIndex]?.format?.[alignmentType]
      }
    }

    const rowspan = (row: IRow, colIndex: number) => {
      return row.headerCellDetails?.[colIndex]?.rowspan
    }

    const colspan = (row: IRow, colIndex: number) => {
      return row.headerCellDetails?.[colIndex]?.colspan
    }

    const groupLevel = (row: IRow, colIndex: number) => {
      return row.cellDetails?.[colIndex]?.groupLevel
    }

    const unhiddenCells = (row: IRow, cells: unknown[]) => {
      return cells.filter((cell, index) => !isHidden(row, index))
    }

    return {
      isHeader,
      isHidden,
      alignment,
      rowspan,
      colspan,
      groupLevel,
      unhiddenCells,
      columns
    }
  }
})
</script>
