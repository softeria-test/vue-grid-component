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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { factset as stach } from '@/stach-sdk'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
type IRow = stach.protobuf.stach.v2.RowOrganizedPackage.IRow

@Component
export default class GridComp extends Vue {
  @Prop() private table!: ITable;

  isHeader (row: IRow) {
    return (row.rowType as unknown as string) === 'Header'
  }

  isHidden (row: IRow, colIndex: number) {
    const columns = this.columns()

    if ((row.rowType as unknown as string) === 'Header') {
      const headerCellColumnIndex = row.headerCellDetails?.[colIndex].columnIndex
      if (headerCellColumnIndex != null) {
        return columns?.[headerCellColumnIndex].isHidden
      }
    } else {
      return columns?.[colIndex].isHidden
    }
  }

  alignment (row: IRow, colIndex: number, direction: string) {
    if (direction === 'horizontal') {
      return 'center'
    } else {
      // direction === 'vertical'
      return 'middle'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rowspan (row: IRow, colIndex: number) {
    return 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colspan (row: IRow, colIndex: number) {
    return 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  groupLevel (row: IRow, colIndex: number) {
    return 0
  }

  unhiddenCells (row: IRow, cells: unknown[]) {
    return cells.filter((cell, index) => !this.isHidden(row, index))
  }

  columns () {
    return this.table.definition?.columns
  }
}
</script>
