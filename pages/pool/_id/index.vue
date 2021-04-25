<template>
  <section class="section">
    <h1 class="title">Your pool</h1>
    <ul>
      <li v-for="ballot in pool" :key="ballot.mapValue.fields.id.stringValue">
        <router-link
          class="button is-ghost"
          :to="`${$route.path}/${ballot.mapValue.fields.id.stringValue}`"
          >{{ ballot.mapValue.fields.name.stringValue }}</router-link
        >
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  async asyncData({ $fire, route }) {
    let pool, error
    try {
      const res = await $fire.firestore
        .collection('pools')
        .doc(route.params.id)
        .get()
      pool =
        res._delegate._document.data.partialValue.mapValue.fields.ballots
          .arrayValue.values
    } catch (e) {
      error = e.message
    }

    return { pool, error }
  },
  mounted() {
    if (this.error)
      this.$buefy.toast.open({
        message: this.error,
        type: 'is-danger',
        duration: 5000,
      })
  },
}
</script>
