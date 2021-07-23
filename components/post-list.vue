<template>
  <div>
    <div class="uk-margin-medium" uk-margin v-for="(post, index) in posts" :key="`post-${index}`">
      <div>
        <span class="uk-text-bold"><a class="uk-link-reset" href="#" @click="$emit('searchUser', post._user_id)">{{ post.user_name }}</a></span>
        <span>[{{ post.user_id_short }}]</span>
        <span class="uk-text-muted uk-text-small">{{ post._updated_at }}</span>
      </div>
      <div>
        <div class="uk-text-primary uk-text-small">
          <span v-if="post.in_reply_to_user_id && post.in_reply_to_text_id">
            <span class="uk-text-bold">@{{ post.reply_to_user_name || '' }}</span>[u:{{ post.reply_to_user_id_short || '' }}<span v-if="post.in_reply_to_text_id"> t:{{ post.reply_to_text_id_short || '' }}</span>]
          </span>
          <span v-else>
            <span v-if="post.in_reply_to_user_id">
              <span class="uk-text-bold">@{{ post.reply_to_user_name || '' }}</span>[u:{{ post.reply_to_user_id_short || '' }}]
            </span>
            <span v-if="post.in_reply_to_text_id">
              <span class="uk-text-bold">@</span>[t:{{ post.reply_to_text_id_short || '' }}]
            </span>
          </span>
        </div>
        <div class="uk-margin-small-bottom">{{ post.text }}</div>
      </div>
      <div>
        <span class="uk-text-primary" uk-icon="icon: reply" @click="reply(post.id)"></span>
        &nbsp;&nbsp;
        &nbsp;&nbsp;
        <span class="uk-text-primary" uk-icon="icon: heart" @click="like(post.id)"></span>
        &nbsp;&nbsp;
        <span class="uk-text-muted uk-text-small">{{ post.like_count }}</span>
        &nbsp;&nbsp;
        &nbsp;&nbsp;
        <span class="uk-text-primary" uk-icon="icon: minus-circle" @click="dislike(post.id)"></span>
        &nbsp;&nbsp;
        &nbsp;&nbsp;
        <span class="uk-text-primary" uk-icon="icon: info"></span>
        <div uk-dropdown>
          <ul class="uk-nav uk-dropdown-nav">
            <li>User ID: ({{ post._user_id }})</li>
            <li>Text ID: ({{ post.id }})</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="uk-margin" uk-margin>
      <timeline-pagination-links
        v-if="mode === 'Timeline'"
        :pagenation="pagenation"
        @paginationPrev="paginationPrev"
        @paginationNext="paginationNext"
        @paginationTo="paginationTo" />
    </div>
  </div>
</template>

<script>
import TimelinePaginationLinks from '@/components/timeline-pagination-links.vue';

export default {
  props: [
    // 投稿データ
    'posts',

    // ページネーションに関する情報
    'pagenation',

    // 投稿データの種類（Timeline, Mention, Search）
    'mode',
  ],

  components: {
    TimelinePaginationLinks,
  },

  data() {
    return {
    }
  },

  computed: {
  },

  methods: {
    reply(text_id) {
      this.$emit('reply', text_id);
    },

    like(text_id) {
      this.$emit('like', text_id);
    },

    dislike(text_id) {
      this.$emit('dislike', text_id);
    },

    paginationPrev() {
      this.paginationTo(this.pagenation.current - 1);
    },

    paginationNext() {
      this.paginationTo(this.pagenation.current + 1);
    },

    paginationTo(page) {
      this.$emit('changePage', page);
    },
  }
}
</script>
