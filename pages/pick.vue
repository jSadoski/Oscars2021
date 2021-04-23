<template>
  <section class="section">
    <!-- Ballot Modal -->
    <div class="block">
      <b-button
        :class="isBallotComplete ? 'is-primary' : ''"
        icon-left="ballot-outline"
        expanded
        @click="ballotCodeOpen"
      >
        Ballot Code
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
              <b-button label="Enter Ballot Code" @click="enterBallot" />
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
                <b-input v-model="enterBallotCode"> </b-input>
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
              <b-button label="Enter Ballot Code" @click="enterBallot" />
            </footer>
          </div>
        </div>
      </b-modal>
    </div>
    <!--  -->
    <!-- Selections -->

    <b-dropdown aria-role="list">
      <template #trigger="{ active }">
        <b-button :icon-right="active ? 'menu-up' : 'menu-down'">
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
  </section>
</template>

<script>
import noms from '../data/nominations.js'

export default {
  asyncData({ params }) {
    const selections = Object.fromEntries(noms.map((nom) => [nom.tag, null]))
    return {
      noms,
      selections,
    }
  },
  data() {
    return {
      activeScreen: 0,
      enteringCode: false,
      enterBallotCode: '',
      isSetModalActive: false,
      isGetModalActive: false,
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
  },
  methods: {
    enterBallot() {
      // Unpack a ballot code string into the form
      ;[...this.enterBallotCode.matchAll(/([a-z]+)([0-9]+)/g)].forEach(
        (match) => (this.selections[match[1]] = match[2])
      )
      this.isSetModalActive = false
    },
    ballotCodeOpen() {
      this.isGetModalActive = true
      // this.$refs.EnterCode.ballotCode.focus()
    },
  },
}
</script>
