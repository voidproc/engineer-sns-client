<template>
  <div class="uk-margin" uk-margin>
    <legend class="uk-legend">Account</legend>

    <div>
      <input class="uk-input" type="text" placeholder="Name" v-model="userName" />
    </div>
    <div>
      <input class="uk-input" type="text" placeholder="Description" v-model="description" />
    </div>
    <div>
      <input class="uk-input" type="text" disabled placeholder="Description" :value="ownUserInfo ? ownUserInfo.id : ''" />
    </div>
    <div>
      <button class="uk-button uk-button-default uk-button-primary" @click="createUser">Create User</button>
      <button class="uk-button uk-button-default uk-button-primary" @click="updateUser">Update User</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['ownUserInfo'],

  data() {
    return {
      userName: this.ownUserInfo?.name || '',
      description: this.ownUserInfo?.description || '',
    }
  },

  methods: {
    createUser() {
      this.$api.createUser(this.userName, this.description);
    },

    updateUser() {
      this.$api.updateUser(this.userName, this.description);
    },
  }
}
</script>
