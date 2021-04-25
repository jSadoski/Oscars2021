<template>
  <section>
    <ballot :ballotid="$route.params.ballot" :scored="true" />
  </section>
</template>

<script>
import Ballot from '~/components/Ballot'

export default {
  components: { Ballot },
}
</script>
