<template>
  <div>
    <section class="uk-section uk-section-small uk-padding-small">
      <div class="uk-container">
        <content-switcher @switchContent="content = $event" />
      </div>
    </section>

    <div id="submit-view-modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close @click="clearReplyTarget"></button>
        <submit-view :replyTo="replyTo" @submitPost="submitPost" />
      </div>
    </div>

    <section class="uk-section uk-section-small uk-padding-small uk-padding-remove-top">
      <div class="uk-container">
        <div v-if="content !== 'Settings'">
          <button class="uk-button uk-button-primary uk-margin-bottom" uk-icon="icon: file-edit" @click="showSubmitView('')"></button>
          <button class="uk-button uk-button-default uk-margin-bottom" uk-icon="icon: refresh" @click="getCurrentContentPosts"></button>
        </div>
        <div v-if="content === 'Search'">
          <div class="uk-inline">
            <a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: search" @click="search"></a>
            <input class="uk-input uk-form-width-large" type="text" placeholder="Search" v-model="searchText" />
          </div>
          <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
              <label><input class="uk-radio" type="radio" value="userid" v-model="radioSearchTarget"> User ID</label>
              <label><input class="uk-radio" type="radio" value="text" v-model="radioSearchTarget" disabled> Text</label>
          </div>
          <hr>
        </div>
        <div v-if="content === 'Timeline'">
          <post-list
            :posts="posts.timeline"
            :pagenation="pagenation.timeline"
            mode="Timeline"
            @reply="showSubmitView"
            @like="incrementLikeCount"
            @dislike="decrementLikeCount"
            @changePage="changeTimelinePage"
            @searchUser="searchUser" />
        </div>
        <div v-if="content === 'Mention'">
          <post-list
            :posts="posts.mention"
            :pagenation="pagenation.mention"
            mode="Mention"
            @reply="showSubmitView"
            @like="incrementLikeCount"
            @dislike="decrementLikeCount"
            @changePage="changeMentionPage"
            @searchUser="searchUser" />
        </div>
        <div v-if="content === 'Search'">
          <post-list
            :posts="posts.search"
            :pagenation="pagenation.search"
            mode="Search"
            @reply="showSubmitView"
            @like="incrementLikeCount"
            @dislike="decrementLikeCount"
            @changePage="changeSearchPage"
            @searchUser="searchUser" />
        </div>
        <div v-if="content === 'Settings'">
          <account-view :ownUserInfo="ownUserInfo" />
          <hr>
          <settings-view :timerInterval="timerInterval" @changeInterval="changeInterval" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UIkit from "uikit";
import PostList from '@/components/post-list.vue';
import ContentSwitcher from '@/components/content-switcher.vue';
import SubmitView from '@/components/submit-view.vue';
import AccountView from '@/components/account-view.vue';
import SettingsView from '@/components/settings-view.vue';

export default {
  components: {
    PostList,
    ContentSwitcher,
    SubmitView,
    AccountView,
    SettingsView,
  },

  data() {
    return {
      users: [],
      likes: [],

      posts: {
        timeline: [],
        mention: [],
        search: [],
      },

      // タブ切り替え
      content: 'Timeline',

      // ページネーション
      pagenation: {
        timeline: {
          current: 0,
          limit: 30,
          count: 0,
        },
        mention: {
          current: 0,
          limit: 100,
        },
        search: {
          current: 0,
          limit: 100,
        }
      },

      // 検索
      searchText: '',
      radioSearchTarget: 'userid',

      // 返信対象
      replyTo: undefined,

      // 自分のユーザ情報
      ownUserInfo: undefined,

      // 更新間隔
      timerInterval: {
        timeline: 3,
        mention: 3,
        users: 10,
        likes: 5,
      },

      intervalId: {
        timeline: null,
        mention: null,
        users: null,
        likes: null,
      }
    }
  },

  async fetch() {
  },

  async mounted() {
    await this.getUsers();

    // 自分のユーザ情報取得
    const id = await this.$api.createUser('', '');
    this.ownUserInfo = this.findUser(id);
    if (this.ownUserInfo) {
      await this.$api.updateUser(this.ownUserInfo.name, this.ownUserInfo.description);
    }

    await this.getLikes();

    await this.getTimelinePosts();
    await this.getMentionPosts();

    this.setTimerIntervals();
  },

  computed: {
  },

  methods: {
    findUser(id) {
      return this.users.find(user => user.id === id);  // user object or undefined
    },

    async getTimelinePosts() {
      this.posts.timeline = await this.$api.getText(this.pagenation.timeline.limit, this.pagenation.timeline.current * this.pagenation.timeline.limit);
      this.posts.timeline = this.formatPosts(this.posts.timeline);

      this.pagenation.timeline.count = await this.$api.getTextCount();
  },

    async getMentionPosts() {
      this.posts.mention = await this.$api.getMentionText(this.ownUserInfo.id, this.pagenation.mention.limit);
      this.posts.mention = this.formatPosts(this.posts.mention);
    },

    async getSearchPosts() {
      let query;
      if (this.radioSearchTarget === 'userid') {
        query = `$filter=_user_id eq '${this.searchText}'`;
      }
      else {
        //query = `$filter=contains(text, '${this.searchText}')`;
      }
      this.posts.search = await this.$api.getSearchText(query, this.pagenation.search.limit);
      this.posts.search = this.formatPosts(this.posts.search);
    },

    async getUsers() {
      this.users = await this.$api.getUserAll();
    },

    async getLikes() {
      this.likes = await this.$api.getLikes();
    },

    async getLikesAndFormatPosts() {
      await this.getLikes();
      this.posts.timeline = this.formatPosts(this.posts.timeline);
      this.posts.mention = this.formatPosts(this.posts.mention);
      this.posts.search = this.formatPosts(this.posts.search);
    },

    formatPosts(posts) {
      return posts.map(post => this.formattedPost(post));
    },

    formattedPost(post) {
      return {
        ...post,
        user_name: this.findUser(post._user_id)?.name || '',
        user_id_short: post._user_id.substring(0, 6),
        text_id_short: post.id.substring(0, 8),
        reply_to_user_name: this.findUser(post.in_reply_to_user_id)?.name || '',
        reply_to_user_id_short: post.in_reply_to_user_id?.substring(0, 6) || '',
        reply_to_text_id_short: post.in_reply_to_text_id?.substring(0, 8) || '',
        _updated_at: new Date(post._updated_at).toLocaleString(),
        like_count: this.likes.find(like => like.id === post.id)?.like_count || 0,
      };
    },

    currentContentPosts() {
      let posts = this.posts.timeline;
      if (this.content === 'Mention') {
        posts = this.posts.mention;
      }
      else if (this.content === 'Search') {
        posts = this.posts.search;
      }
      return posts;
    },

    async getCurrentContentPosts() {
      if (this.content === 'Timeline') {
        await this.getTimelinePosts();
      }
      else if (this.content === 'Mention') {
        await this.getMentionPosts();
      }
      else if (this.content === 'Search') {
        await this.getSearchPosts();
      }
    },

    showSubmitView(replyToId) {
      if (!replyToId) {
        this.clearReplyTarget();
      }
      else {
        this.replyTo = this.currentContentPosts().find(post => post.id === replyToId);
      }

      UIkit.modal('#submit-view-modal').show();
    },

    async submitPost(text) {
      UIkit.modal('#submit-view-modal').hide();

      await this.$api.postText(
        text,
        this.replyTo?.id || '',
        this.replyTo?._user_id || '');

      await this.getTimelinePosts();
    },

    clearReplyTarget() {
      this.replyTo = undefined;
    },

    async incrementLikeCount(text_id) {
      await this.$api.incrementLikeCount(text_id);
      await this.getLikesAndFormatPosts();
    },

    async decrementLikeCount(text_id) {
      await this.$api.decrementLikeCount(text_id);
      await this.getLikesAndFormatPosts();
    },

    async changeTimelinePage(page) {
      this.pagenation.timeline.current = page;
      this.pagenation.timeline.count = await this.$api.getTextCount();
      await this.getTimelinePosts();
    },

    async changeMentionPage(page) {
    },

    async changeSearchPage(page) {
    },

    searchUser(userId) {
      this.searchText = userId;
      document.getElementById(`tabSearch`).click();
    },

    async search() {
      await this.getSearchPosts();
    },

    setTimerIntervals() {
      if (this.intervalId.timeline)
        clearInterval(this.intervalId.timeline);
      if (this.intervalId.mention)
        clearInterval(this.intervalId.mention);
      if (this.intervalId.users)
        clearInterval(this.intervalId.users);
      if (this.intervalId.likes)
        clearInterval(this.intervalId.likes);

      this.intervalId.timeline = setInterval(this.getTimelinePosts, this.timerInterval.timeline * 1000 * 60);
      this.intervalId.mention = setInterval(this.getMentionPosts, this.timerInterval.mention * 1000 * 60);
      this.intervalId.users = setInterval(this.getUsers, this.timerInterval.users * 1000 * 60);
      this.intervalId.likes = setInterval(this.getLikes, this.timerInterval.likes * 1000 * 60);
    },

    changeInterval(interval) {
      this.timerInterval = {
        ...interval
      }
      this.setTimerIntervals();
    }
  }
}
</script>
