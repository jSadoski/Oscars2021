export const state = () => ({})

export const mutations = {
  set(state, ballot) {
    Object.assign(state, ballot)
  },
}
