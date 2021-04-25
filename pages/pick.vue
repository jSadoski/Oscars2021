<template>
  <section class="section">
    <b-field label="Your Name:">
      <b-input v-model="yourName" placeholder="The Academy" />
    </b-field>
    <!-- Ballot Modal -->
    <b-field label="Your Ballot:">
      <b-button
        type="is-ghost"
        icon-left="ballot-outline"
        size="is-small"
        @click="ballotCodeOpen"
      >
        <em>Enter a Ballot Code</em>
      </b-button>
      <b-modal
        ref="EnterCode"
        v-model="isGetModalActive"
        has-modal-card
        @after-enter="$refs.ballotCode.focus()"
      >
        <div class="modal-card" style="width: auto">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">
                <span class="icon"><i class="mdi ballot" /></span> Ballot Code
              </p>
              <button
                type="button"
                class="delete"
                @click="isGetModalActive = false"
              />
            </header>
            <section class="modal-card-body">
              <b-field label="Code for This Ballot:">
                <b-input
                  ref="ballotCode"
                  v-model="ballotCode"
                  readonly
                  @focus="$event.target.select()"
                />
              </b-field>
              <b-button
                class="is-small"
                icon-right="arrow-right"
                @click="
                  isGetModalActive = false
                  isSetModalActive = true
                "
              >
                Enter my Own
              </b-button>
            </section>
            <footer class="modal-card-foot">
              <b-button label="Close" @click="isGetModalActive = false" />
              <b-button label="Enter Ballot Code" @click="enterBallotCode" />
            </footer>
          </div>
        </div>
      </b-modal>

      <b-modal v-model="isSetModalActive" has-modal-card>
        <div class="modal-card" style="width: auto">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">
                <span class="icon"><i class="mdi ballot" /></span> Enter Ballot
                Code
              </p>
              <button
                type="button"
                class="delete"
                @click="isSetModalActive = false"
              />
            </header>
            <section class="modal-card-body">
              <b-field label="Enter Code:">
                <b-input v-model="enteredBallotCode"> </b-input>
              </b-field>
              <b-button
                class="is-small"
                icon-left="arrow-left"
                @click="
                  isSetModalActive = false
                  isGetModalActive = true
                "
              >
                Back
              </b-button>
            </section>
            <footer class="modal-card-foot">
              <b-button label="Close" @click="isSetModalActive = false" />
              <b-button label="Enter Ballot Code" @click="enterBallotCode" />
            </footer>
          </div>
        </div>
      </b-modal>
    </b-field>
    <!--  -->
    <!-- Selections -->

    <b-dropdown aria-role="list">
      <template #trigger="{ active }">
        <b-button
          ref="categoryButton"
          type="is-ghost is-large has-text-black"
          :icon-right="active ? 'menu-up' : 'menu-down'"
        >
          {{ activeNom.name }}
        </b-button>
      </template>
      <b-dropdown-item
        v-for="(category, i) in noms"
        :key="i"
        @click="activeScreen = i"
      >
        {{ category.name }}
      </b-dropdown-item>
    </b-dropdown>
    <b-carousel
      v-model="activeScreen"
      :arrow="false"
      :autoplay="false"
      :indicator="false"
    >
      <b-carousel-item v-for="(category, index) in noms" :key="index">
        <div class="block pb-4">
          <h2 class="title is-5 is-uppercase"></h2>
          <b-field v-for="(nom, i) in category.noms" :key="i">
            <b-radio v-model="selections[category.tag]" :native-value="i">
              {{ nom }}
            </b-radio>
          </b-field>
        </div>
      </b-carousel-item>
    </b-carousel>
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <b-button
            icon-left="arrow-left"
            :disabled="activeScreen <= 0"
            @click="
              activeScreen = activeScreen > 0 ? activeScreen - 1 : activeScreen
            "
          >
            Previous
          </b-button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button
            icon-right="arrow-right"
            :disabled="activeScreen >= 23"
            :class="selections[activeNom.tag] === null ? '' : 'is-primary'"
            @click="
              activeScreen =
                activeScreen <= 23 ? activeScreen + 1 : activeScreen
            "
          >
            Next
          </b-button>
        </div>
      </div>
    </div>
    <!--  -->
    <!-- Submit button -->
    <div class="block">
      <b-button
        ref="submitButton"
        :type="submitButtonType"
        expanded
        @click.prevent="submitBallot"
      >
        Submit
      </b-button>
    </div>
  </section>
</template>

<script>
import noms from '../data/nominations.js'

export default {
  name: 'PickSheet',
  async asyncData({ route, $fire }) {
    let selections = Object.fromEntries(noms.map((nom) => [nom.tag, null]))
    let yourName
    let error, resObj
    if (route.query.id) {
      try {
        const resObj = await $fire.firestore
          .collection('ballots')
          .doc(route.query.id)
          .get()
        yourName =
          resObj._delegate._document.data.partialValue.mapValue.fields.name
            .stringValue
        const rawSelections =
          resObj._delegate._document.data.partialValue.mapValue.fields
            .selections.mapValue.fields
        const s = Object.fromEntries(
          Object.entries(rawSelections).map(([key, { stringValue }]) => [
            key,
            stringValue,
          ])
        )
        selections = s ?? selections
      } catch (e) {
        error = e.message
      }
    }
    return {
      yourName,
      noms,
      selections,
      error,
      resObj,
    }
  },
  data() {
    return {
      activeScreen: 0,
      enteringCode: false,
      enteredBallotCode: '',
      isSetModalActive: false,
      isGetModalActive: false,
      yourName: '',
      isSubmittingBallot: false,
    }
  },
  computed: {
    ballotCode() {
      return JSON.stringify(
        Object.entries(this.selections).filter((pair) => pair[1] != null)
      ).replace(/\[|\]|"|,/g, '')
    },
    activeNom() {
      return noms[this.activeScreen]
    },
    isBallotComplete() {
      return Object.values(this.selections).every((value) => value != null)
    },
    submitButtonType() {
      return this.isSubmittingBallot
        ? 'is-loading'
        : this.isBallotComplete
        ? 'is-primary'
        : ''
    },
  },
  mounted() {
    if (this.error)
      this.$buefy.toast.open({
        message: `Could not load a poll for id:<br />${this.error}<br />${this.resObj}`,
        position: 'is-bottom',
        type: 'is-danger',
      })
  },
  methods: {
    enterBallotCode() {
      // Unpack a ballot code string into the form
      ;[...this.enteredBallotCode.matchAll(/([a-z]+)([0-9]+)/g)].forEach(
        (match) => (this.selections[match[1]] = match[2])
      )
      this.isSetModalActive = false
    },
    ballotCodeOpen() {
      this.isGetModalActive = true
      // this.$refs.EnterCode.ballotCode.focus()
    },
    async submitBallot() {
      if (this.yourName !== '' && this.isBallotComplete) {
        this.isSubmittingBallot = true
        const capturedInitials = this.yourName.match(/\b\S/g).splice(0, 2)
        const initials =
          capturedInitials.length < 2
            ? this.yourName.slice(0, 2)
            : capturedInitials
        const id = [initials, this.generateId(5)].join('').toUpperCase()
        try {
          await this.$fire.firestore
            .collection('ballots')
            .doc(id)
            .set({ name: this.yourName, selections: this.selections })
        } catch (e) {
          this.$buefy.toast.open({
            message: `Something went wrong: ${e.message}`,
            type: 'is-danger',
          })
        }
        this.$router.push(`/ballot/${id}`)
      } else {
        this.$buefy.toast.open({
          message: 'Ballot is not complete',
          type: 'is-danger',
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
