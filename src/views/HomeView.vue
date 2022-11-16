<template>
  <div class="home">
    <GridComp :table="table"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// @ is an alias to /src
import { factset as stach } from '@/stach-sdk'
import GridComp from '@/components/GridComp.vue' // NOSONAR

type ITable = stach.protobuf.stach.v2.RowOrganizedPackage.ITable

const table = ref<ITable | null>(null)

fetch('stach-row-organized-package.json')
  .then(stachDataRaw => {
    return stachDataRaw.json()
  })
  .then(stachRowOrganizedPackage => {
    table.value = stachRowOrganizedPackage.tables.main as unknown as ITable
  })
</script>
