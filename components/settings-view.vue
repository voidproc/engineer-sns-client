<template>
  <div class="uk-margin" uk-margin>
    <legend class="uk-legend">Pagination</legend>

    <hr>

    <legend class="uk-legend">Refresh frequency</legend>

    <div class="uk-margin">
      <label class="uk-form-label" for="freq-timeline">Timeline</label>
      <select class="uk-select" id="freq-timeline" v-model="interval.timeline" @change="changeInterval">
        <option v-for="option in freqOptions" :value="option.value" :key="'timeline'+option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div class="uk-margin">
      <label class="uk-form-label" for="freq-mention">Mention</label>
      <select class="uk-select" id="freq-mention" v-model="interval.mention" @change="changeInterval">
        <option v-for="option in freqOptions" :value="option.value" :key="'mention'+option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div class="uk-margin">
      <label class="uk-form-label" for="freq-users">Users</label>
      <select class="uk-select" id="freq-users" v-model="interval.users" @change="changeInterval">
        <option v-for="option in freqOptions" :value="option.value" :key="'users'+option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div class="uk-margin">
      <label class="uk-form-label" for="freq-likes">Likes</label>
      <select class="uk-select" id="freq-likes" v-model="interval.likes" @change="changeInterval">
        <option v-for="option in freqOptions" :value="option.value" :key="'likes'+option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'timerInterval' ],

  data() {
    return {
      interval: {
        ...this.timerInterval,
      },

      freqOptions: [
        { text: '10 min', value: '10' },
        { text: '5 min', value: '5' },
        { text: '3 min', value: '3' },
        { text: '1 min', value: '1' },
      ],
    }
  },

  methods: {
    changeInterval() {
      this.$emit('changeInterval', this.interval);
    }
  }
}
</script>
