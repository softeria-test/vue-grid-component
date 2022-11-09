<template>
  <div class="grid-comp">
    <table v-if="table">
      <caption>Example Row Organized Stach Table</caption>
      <tr v-for="(row, rowIndex) in table.data.rows"
        :key="rowIndex"
      >
        <template v-if="isHeader(row)">
          <th v-for="(cellValue, colIndex) in unhiddenCells(row, row.cells)"
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
        <template v-else>
          <td v-for="(cellValue, colIndex) in unhiddenCells(row, row.cells)"
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
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import stachRowOrganizedPackage from '@/data/stach-row-organized-package.json'
import { factset as stach } from '@/stach-sdk'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
type IRow = stach.protobuf.stach.v2.RowOrganizedPackage.IRow

const table: ITable = reactive(stachRowOrganizedPackage.tables.main as unknown as ITable)

const isHeader = (row: IRow) => (row.rowType as unknown as string) === 'Header'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isHidden = (row: IRow, colIndex: number) => false

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const alignment = (row: IRow, colIndex: number, direction: string) => {
  if (direction === 'horizontal') {
    return 'center'
  } else {
    // direction === 'vertical'
    return 'middle'
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rowspan = (row: IRow, colIndex: number) => 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colspan = (row: IRow, colIndex: number) => 1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const groupLevel = (row: IRow, colIndex: number) => 0

const unhiddenCells = (row: IRow, cells: unknown[]) => {
  return cells.filter((cell, index) => !isHidden(row, index))
}
</script>
