<template>
  <div>
    <b-navbar class="navbar">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            :src="require('~/assets/images/Oscars_2021_logo.png')"
            alt="The Oscars 2021 Logo"
          />
        </b-navbar-item>
      </template>
      <template #start> </template>

      <template #end> </template>
    </b-navbar>

    <section class="main-content columns">
      <div class="container" style="max-width: 800px">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {}
</script>
