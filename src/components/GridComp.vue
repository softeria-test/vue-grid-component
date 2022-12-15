<template>
  <div class="grid-comp">
    <table v-if="myTable">
      <caption>Example Row Organized Stach Table</caption>
      <tr v-for="(row, rowIndex) in myTable.data.rows"
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
                <span>{{ cellValue }}</span>
                <span
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
import type { PropType, Ref } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import { factset as stach } from '@/stach-sdk'

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

    const initialize = (table: ITable) => {
      myTable.value = structuredClone(table)
      // Initialize isOrderedAsc properties for leaf headers
      myTable.value?.data?.rows?.forEach(row => {
        if (row.headerCellDetails) {
          Object.values(row.headerCellDetails).forEach((headerCellDetailValue, colIndex) => {
            if (isHeaderLeaf(row, colIndex)) {
              (headerCellDetailValue as IMyHeaderCellDetail).isOrderedAsc = isOrderedAsc.value
            }
          })
        }
      })
    }

    watch(() => props.table, (table: ITable | undefined) => {
      if (table) {
        initialize(table)
      }
    })

    const columns = () => {
      return props.table?.definition?.columns
    }

    const isHeader = (row: IRow) => {
      return (row.rowType as unknown as string) === 'Header'
    }

    const isHeaderLeaf = (row: IRow, colIndex: number) => {
      // If rowspan and colspan is not defined or has a value less than 1 for this column of this row,
      // this header should be a leaf
      const myColspan = colspan(row, colIndex)
      const myRowspan = rowspan(row, colIndex)
      return (!myColspan || myColspan < 1) && (!myRowspan || myRowspan < 1)
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

    const sortDirectionClass = (row: IRow, colIndex: number) => {
      if (isHeaderLeaf(row, colIndex)) {
        const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
        if (headerCellDetail.isOrderedAsc) {
          return 'asc'
        }
        return 'dsc'
      }
    }

    const toggleSortDirection = (row: IRow, colIndex: number) => {
      const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
      headerCellDetail.isOrderedAsc = !headerCellDetail.isOrderedAsc
    }

    const updateSortDirectionRef = (row: IRow, colIndex: number) => {
      const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
      isOrderedAsc.value = headerCellDetail.isOrderedAsc
    }

    const sort = (colIndex: number) => {
      // Increase colIndex by 1 since the first column is allocated for the tree structure
      // But increase it by 2 if it is equal to or bigger than 2 since a hidden column is exist there
      if (colIndex < 2) {
        colIndex += 1
      } else {
        colIndex += 2
      }

      myTable.value?.data?.rows?.sort((firstRow, secondRow) => {
        let returnValue = null

        if (isHeader(firstRow) || isHeader(secondRow)) {
          // Don't sort headers
          returnValue = 0
        } else {
          const firstRowCellValue = (firstRow.cells as unknown as [])[colIndex]
          const secondRowCellValue = (secondRow.cells as unknown as [])[colIndex]
          if (firstRowCellValue === null && secondRowCellValue === null) {
            // Don't sort null values
            returnValue = 0
          } else if (firstRowCellValue === null) {
            // null values should be below
            returnValue = 1
          } else if (secondRowCellValue === null) {
            // null values should be below
            returnValue = -1
          } else {
            if (firstRowCellValue > secondRowCellValue) {
              returnValue = 1
            } else if (firstRowCellValue < secondRowCellValue) {
              returnValue = -1
            } else {
              returnValue = 0
            }

            // Get negative of returnValue if sortDirection is dsc
            if (!isOrderedAsc.value) {
              returnValue = -returnValue
            }
          }
        }

        return returnValue
      })
    }

    const onSortArrowClicked = (row: IRow, colIndex: number) => {
      toggleSortDirection(row, colIndex)
      updateSortDirectionRef(row, colIndex)
      sort(colIndex)
    }

    return {
      myTable,
      isHeader,
      isHidden,
      alignment,
      rowspan,
      colspan,
      groupLevel,
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
