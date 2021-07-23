<template>
  <div>
    <ul class="uk-pagination">
      <li :class="{'uk-disabled': pagenation.current === 0}">
        <a href="#" @click="$emit('paginationPrev')"><span uk-pagination-previous></span></a>
      </li>
      <li :class="{'uk-active uk-background-muted': pagenation.current === i}" v-for="(i, index) in pageList" :key="`page-${index}`">
        <a v-if="pagenation.current !== i && i !== '...'" href="#" @click="$emit('paginationTo', i)">{{ i + 1 }}</a>
        <span v-else>{{ i === '...' ? i : i + 1 }}</span>
      </li>
      <li :class="{'uk-disabled': pagenation.current === lastPage}">
        <a href="#" @click="$emit('paginationNext')"><span uk-pagination-next></span></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'pagenation',
  ],

  computed: {
    lastPage() {
      return Math.max(0, Math.floor((this.pagenation.count - 1) / this.pagenation.limit));
    },

    pageList() {
      const pageListBegin = Math.max(0, this.pagenation.current - 10);
      const pageListEnd = Math.min(this.pagenation.current + 10, this.lastPage);;
      let list = [];

      for (let i = pageListBegin; i <= pageListEnd; i++) {
        list.push(i);
      }

      let middle = Math.min(Math.max(this.pagenation.current, 5), this.lastPage - 5);
      list = list
        .filter(x => (x >= middle - 5) && (x <= middle + 5))
        .filter(x => (x >= 0) && (x <= this.lastPage));

      const start = Math.min(...list);
      const end = Math.max(...list);
      if (start > 1) {
        list.unshift('...');
      }
      if (start > 0) {
        list.unshift(0);
      }
      if (end < this.lastPage - 1) {
        list.push('...');
      }
      if (end < this.lastPage) {
        list.push(this.lastPage);
      }

      return list;
    }
  },

  methods: {
  }
}
</script>
