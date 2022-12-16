import { factset as stach } from '@/stach-sdk'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
type IRow = stach.protobuf.stach.v2.RowOrganizedPackage.IRow
interface IMyHeaderCellDetail extends stach.protobuf.stach.v2.RowOrganizedPackage.IHeaderCellDetail {
  isOrderedAsc: boolean;
}

export const createTable = (table: ITable | undefined, isOrderedAsc: boolean) => {
  let myTable = null

  if (table) {
    myTable = structuredClone(table)
    // Initialize isOrderedAsc properties for leaf headers
    myTable.data?.rows?.forEach((row: IRow) => {
      if (row.headerCellDetails) {
        Object.values(row.headerCellDetails).forEach((headerCellDetailValue, colIndex) => {
          if (isHeaderLeaf(row, colIndex)) {
            (headerCellDetailValue as IMyHeaderCellDetail).isOrderedAsc = isOrderedAsc
          }
        })
      }
    })
  }

  return myTable
}

const columns = (table: ITable) => {
  return table?.definition?.columns
}

export const isHeader = (row: IRow) => {
  return (row.rowType as unknown as string) === 'Header'
}

export const isHeaderLeaf = (row: IRow, colIndex: number) => {
  // If rowspan and colspan is not defined or has a value less than 1 for this column of this row,
  // this header should be a leaf
  const myColspan = colspan(row, colIndex)
  const myRowspan = rowspan(row, colIndex)
  return (!myColspan || myColspan < 1) && (!myRowspan || myRowspan < 1)
}

export const isHidden = (table: ITable, row: IRow, colIndex: number) => {
  const myColumns = columns(table)

  if ((row.rowType as unknown as string) === 'Header') {
    const headerCellColumnIndex = row.headerCellDetails?.[colIndex]?.columnIndex
    if (headerCellColumnIndex != null) {
      return myColumns?.[headerCellColumnIndex].isHidden
    }
  } else {
    return myColumns?.[colIndex].isHidden
  }
}

export const alignment = (table: ITable, row: IRow, colIndex: number, direction: string) => {
  const alignmentType = direction === 'horizontal' ? 'halign' : 'valign'

  const myColumns = columns(table)

  if ((row.rowType as unknown as string) === 'Header') {
    const headerCellColumnIndex = row.headerCellDetails?.[colIndex]?.columnIndex
    if (headerCellColumnIndex != null) {
      return myColumns?.[headerCellColumnIndex]?.format?.[alignmentType]
    }
  } else {
    return myColumns?.[colIndex]?.format?.[alignmentType]
  }
}

export const rowspan = (row: IRow, colIndex: number) => {
  return row.headerCellDetails?.[colIndex]?.rowspan
}

export const colspan = (row: IRow, colIndex: number) => {
  return row.headerCellDetails?.[colIndex]?.colspan
}

const groupLevel = (row: IRow, colIndex: number) => {
  return row.cellDetails?.[colIndex]?.groupLevel
}

export const leftPadding = (row: IRow, colIndex: number) => {
  return groupLevel(row, colIndex) + 'em'
}

export const sortDirectionClass = (row: IRow, colIndex: number) => {
  if (isHeaderLeaf(row, colIndex)) {
    const headerCellDetail = row.headerCellDetails?.[colIndex] as IMyHeaderCellDetail
    if (headerCellDetail.isOrderedAsc) {
      return 'asc'
    }
    return 'dsc'
  }
}

export const sorted = (rows: IRow[], colIndex: number, isOrderedAsc: boolean) => {
  // Increase colIndex by 1 since the first column is allocated for the tree structure
  // But increase it by 2 if it is equal to or bigger than 2 since a hidden column is exist there
  if (colIndex < 2) {
    colIndex += 1
  } else {
    colIndex += 2
  }

  const myRows = structuredClone(rows)

  myRows.sort((firstRow: IRow, secondRow: IRow) => {
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
        if (!isOrderedAsc) {
          returnValue = -returnValue
        }
      }
    }

    return returnValue
  })

  return myRows
}
