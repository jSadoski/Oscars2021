<template>
  <section class="section">
    <h1 class="title">{{ name }}'s Ballot:</h1>
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <h2 class="subtitle has-text-grey has-text-weight-light">
            (<span class="is-family-code">{{ $route.params.id }}</span
            >)
          </h2>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button
            type="is-ghost"
            icon-right="arrow-right"
            @click="$router.push(`/pick/?id=${$route.params.id}`)"
          >
            <em>Copy this ballot</em>
          </b-button>
        </div>
      </div>
    </div>
    <ul>
      <li v-for="{ category, pick, tag } in picks" :key="tag">
        <h2 class="title is-6">{{ category }}:</h2>
        {{ pick }}
      </li>
    </ul>
  </section>
</template>

<script>
import noms from '~/data/nominations.js'

export default {
  async asyncData({ $fire, route }) {
    const req = await $fire.firestore
      .collection('ballots')
      .doc(route.params.id)
      .get()
    const ballot = req._delegate._document.data.partialValue.mapValue.fields
    return { ballot }
  },
  data() {},
  computed: {
    picks() {
      return noms.map(({ name, tag, noms }) => {
        return {
          category: name,
          tag,
          pick: noms[this.ballot.selections.mapValue.fields[tag].stringValue],
        }
      })
    },
    name() {
      return this.ballot.name.stringValue
    },
  },
}
</script>
