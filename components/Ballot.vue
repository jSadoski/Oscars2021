<template>
  <section class="section">
    <h1 class="title">{{ name }}'s Ballot:</h1>
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <h2 class="subtitle has-text-grey has-text-weight-light">
            (<span class="is-family-code">{{ ballotid }}</span
            >)
          </h2>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button
            type="is-ghost"
            icon-right="arrow-right"
            @click="$router.push(`/ballot/?id=${$ballotid}`)"
          >
            <em>Copy this ballot</em>
          </b-button>
        </div>
      </div>
    </div>
    <h3 class="subtitle">Ballot Score: {{ score }}</h3>
    <ul>
      <li v-for="{ category, pick, tag } in picks" :key="tag">
        <h2 class="title is-6">{{ category }}:</h2>
        {{ pick }}
      </li>
    </ul>
  </section>
</template>

<script>
import noms from '~/assets/data/nominations.js'

export default {
  props: {
    ballotid: {
      type: String,
      required: true,
    },
    scored: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ballot: {
        name: { stringValue: '' },
        selections: { mapValue: { fields: {} } },
      },
      winners: {},
    }
  },
  async fetch() {
    const req = await this.$fire.firestore
      .collection('ballots')
      .doc(this.ballotid)
      .get()
    this.ballot = req._delegate._document.data.partialValue.mapValue.fields
    if (this.scored) {
      const reqWinners = await this.$fire.firestore
        .collection('winners')
        .doc('MQTtQQqDxhUiGdUzZLGu')
        .get()
      this.winners =
        reqWinners._delegate._document.data.partialValue.mapValue.fields
    }
  },
  computed: {
    name() {
      return this.ballot.name?.stringValue ?? this.name
    },
    picks() {
      return noms.map(({ name, tag, noms }) => {
        const pickIndex = this.ballot.selections.mapValue.fields[tag]
          ?.stringValue
        const pick = noms[pickIndex]
        return {
          category: name,
          tag,
          pick,
          winner: this.winners[tag]?.integerValue === pickIndex,
        }
      })
    },
    score() {
      return this.picks.reduce((accumulator, pick) => {
        return accumulator + (pick.winner ? 1 : 0)
      }, 0)
    },
  },
}
</script>
