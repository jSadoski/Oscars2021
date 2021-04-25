<template>
  <section class="section">
    <h1 class="title">Create a Pool</h1>
    <b-field
      v-for="(ballot, i) in ballots"
      :key="i"
      :message="ballot.name"
      :type="ballot.loadingState"
    >
      <b-input
        v-model="ballot.id"
        placeholder="TAA1B2"
        expanded
        @input="lookupBallot(ballot)"
      />
      <p class="control">
        <b-button
          icon-right="account-remove-outline"
          :disabled="ballotsLength"
          outlined
          @click="removeBallot(i)"
        />
      </p>
    </b-field>
    <b-field>
      <b-button
        label="Add Ballot"
        icon-right="text-box-plus-outline"
        type="is-text"
        @click="addBallot"
      />
    </b-field>
    <b-button
      label="Start Pool"
      :disabled="!areBallotsValid"
      :type="startingPool ? 'is-loading' : areBallotsValid ? 'is-primary' : ''"
      expanded
      @click.prevent="startPool"
    />
  </section>
</template>

<script>
const Ballots = (ballots) => ballots
Ballots.get = (target) => target?.ballots
Ballots.add = (target, id) => this.ballots.push(target.create(id))
Ballots.create = (id) => ({ id, valid: null, loadingState: null, name: '' })
Ballots.remove = (target, id) =>
  (target.ballots = target.ballots.filter(({ fid }) => fid !== id))

export default {
  name: 'CreatePool',
  data() {
    return {
      ballots: [],
      startingPool: false,
    }
  },
  computed: {
    ballotsLength() {
      return this.ballots.length <= 1
    },
    areBallotsValid() {
      return this.ballots.every((ballot) => ballot.valid === true)
    },
  },
  mounted() {
    this.ballots = Ballots([null, null, null].map((el) => Ballots.create(el)))
  },
  methods: {
    addBallot() {
      this.ballots.push(Ballots.create(null))
    },
    removeBallot(id) {
      this.ballots.splice(id, 1)
    },
    async lookupBallot(ballot) {
      if (ballot.id.match(/\w+/)) {
        ballot.loadingState = 'is-loading'
        const res = await this.$fire.firestore
          .collection('ballots')
          .doc(ballot.id)
          .get()
        ballot.valid = !!res._delegate._document?.data
        ballot.name = ballot.valid
          ? res._delegate._document.data.partialValue.mapValue.fields.name
              .stringValue
          : ballot.name
        ballot.loadingState = ballot.valid ? 'is-success' : 'is-danger'
      } else {
        ballot.loadingState = null
      }
    },
    async startPool() {
      this.startingPool = true
      const id = this.generateId(8)
      try {
        await this.$fire.firestore
          .collection('pools')
          .doc(id)
          .set({ ballots: this.ballots })
        this.$router.push(`/poll/${id}`)
      } catch (e) {
        this.$buefy.toast.open({
          message: `Could not start a new pool: ${e.message}`,
          type: 'is-danger',
          interval: 5000,
        })
      }
    },
    dec2hex(dec) {
      return dec.toString(16).padStart(2, '0')
    },
    generateId(len) {
      const arr = new Uint8Array((len || 40) / 2)
      window.crypto.getRandomValues(arr)
      return Array.from(arr, this.dec2hex).join('').toUpperCase()
    },
  },
}
</script>
