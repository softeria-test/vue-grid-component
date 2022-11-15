<template>
  <div class="home">
    <GridComp :table="table"/>
  </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { factset as stach } from '@/stach-sdk'
import GridComp from '@/components/GridComp.vue' // NOSONAR
import stachRowOrganizedPackage from '@/data/stach-row-organized-package.json'

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable
const table: ITable = stachRowOrganizedPackage.tables.main as unknown as ITable
</script>
