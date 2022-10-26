<template>
  <div class="home">
    <GridComp/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GridComp from '@/components/GridComp.vue' // @ is an alias to /src

@Component({
  components: {
    GridComp
  }
})
export default class HomeView extends Vue {}
</script>
