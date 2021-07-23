<template>
  <div>
    <ul uk-tab style="background-color: white">
      <li v-for="content in contents" :key="content">
        <a href="#" :id="`tab${content}`" @click="switchContent(content)">{{content}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [],

  data() {
    return {
      contents: [
        'Timeline',
        'Mention',
        'Search',
        'Account',
        'Settings',
      ],
    }
  },

  methods: {
    switchContent(name) {
      this.$emit('switchContent', name);
    }
  }
}
</script>
