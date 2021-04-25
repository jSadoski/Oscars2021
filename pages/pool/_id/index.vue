<template>
  <section class="section">
    <h1 class="title">Your pool</h1>
    <ul>
      <li v-for="(ballot, i) in ballots" :key="i">
        <router-link :to="`${$route.path}/${ballot.id}`">{{
          ballot.name.stringValue
        }}</router-link
        >: {{ ballot.score }} pts.
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  async asyncData({ $fire, route }) {
    let pool, ballots, winners, res, error
    try {
      res = await $fire.firestore.collection('pools').doc(route.params.id).get()
      pool =
        res._delegate._document.data.partialValue.mapValue.fields.ballots
          .arrayValue.values

      ballots = await Promise.all(
        pool.map(async (ballot) => {
          res = await $fire.firestore
            .collection('ballots')
            .doc(ballot.mapValue.fields.id.stringValue)
            .get()
          const newBallot =
            res._delegate._document.data.partialValue.mapValue.fields
          newBallot.id = ballot.mapValue.fields.id.stringValue
          return newBallot
        })
      )

      res = await $fire.firestore
        .collection('winners')
        .doc('MQTtQQqDxhUiGdUzZLGu')
        .get()
      winners = res._delegate._document.data.partialValue.mapValue.fields

      ballots = ballots.map((ballot) => {
        ballot.score = Object.entries(ballot.selections.mapValue.fields).reduce(
          (accumulator, [key, value]) => {
            return (
              accumulator +
              (value.stringValue === winners[key].integerValue.toString()
                ? 1
                : 0)
            )
          },
          0
        )
        return ballot
      })
    } catch (e) {
      error = e
    }

    return { pool, ballots, winners, res, error }
  },
  mounted() {
    if (this.error)
      this.$buefy.toast.open({
        message: this.error.toString(),
        type: 'is-danger',
        duration: 5000,
      })
  },
}
</script>
