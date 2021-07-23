<template>
  <div class="uk-margin" uk-margin>
    <div v-if="replyTo" class="uk-text-small uk-text-primary">
      <span class="uk-text-bold">Reply to {{ replyToUserName }}</span>[{{ replyToUserIdShort }}]
      <span>(Post:{{ replyToTextIdShort }})</span>
    </div>
    <div>
      <input class="uk-input" type="text" placeholder="Something" v-model="text" />
    </div>
    <button class="uk-button uk-button-default uk-button-primary" @click="$emit('submitPost', text)">Post</button>
  </div>
</template>

<script>
export default {
  props: ['replyTo'],

  data() {
    return {
      text: '',
    }
  },

  computed: {
    replyToUserName() {
      return this.replyTo?.user_name || '';
    },

    replyToUserIdShort() {
      return this.replyTo?.user_id_short || '';
    },

    replyToTextIdShort() {
      return this.replyTo?.text_id_short || '';
    },
  }
}
</script>
