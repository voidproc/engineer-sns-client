
const ApiUrl = 'https://versatileapi.herokuapp.com/api';

export default ({ app }, inject) => {
  inject('api', {
    async getUserAll() {
      return await app.$http.$get(`${ApiUrl}/user/all`);
    },

    // つぶやきを取得
    async getTextAll() {
      return await app.$http.$get(`${ApiUrl}/text/all`);
    },

    // つぶやきを取得
    // count: 取得する件数
    async getText(count, skip = 0) {
      return await app.$http.$get(`${ApiUrl}/text/all?$orderby=_created_at desc&$limit=${count}&$skip=${skip}`);
    },

    async getMentionText(ownUid, count, skip = 0) {
      return await app.$http.$get(`${ApiUrl}/text/all?$orderby=_created_at desc&$limit=${count}&$filter=in_reply_to_user_id eq '${ownUid}'&$skip=${skip}`);
    },

    async getSearchText(query, count, skip = 0) {
      return await app.$http.$get(`${ApiUrl}/text/all?$orderby=_created_at desc&$limit=${count}&${query}&$skip=${skip}`);
    },

    async getLikes() {
      return await app.$http.$get(`${ApiUrl}/like/all`);
    },

    async getLikeCount(text_id) {
      let likeCount = 0;
      try {
        likeCount = Number((await app.$http.$get(`${ApiUrl}/like/${text_id}`)).like_count);
      }
      catch {
        return 0;
      }
      return likeCount;
    },

    async incrementLikeCount(text_id) {
      const count = await this.getLikeCount(text_id);
      this.setLikeCount(text_id, count + 1);
    },

    async decrementLikeCount(text_id) {
      const count = await this.getLikeCount(text_id);
      this.setLikeCount(text_id, Math.max(0, count - 1));
    },

    async setLikeCount(text_id, count) {
      const config = {
        headers: {
          Authorization: "LOVE",
        },
      };
      let postData = {
        like_count: count,
      };
      const response = await app.$http.put(`${ApiUrl}/like/${text_id}`, postData, config);
    },

    // つぶやきを投稿
    async postText(text, in_reply_to_text_id, in_reply_to_user_id) {
      const config = {
        headers: {
          Authorization: "HelloWorld",
        },
      };
      let postData = {
        text: text,
      };
      if (in_reply_to_text_id) {
        postData.in_reply_to_text_id = in_reply_to_text_id;
      }
      if (in_reply_to_user_id) {
        postData.in_reply_to_user_id = in_reply_to_user_id;
      }
      const response = await app.$http.post(
        `${ApiUrl}/text`,
        postData,
        config
      );
    },

    async getUserCount() {
      const response = await app.$http.$get(`${ApiUrl}/user/count`);
      return Number(response.count);
    },

    async getTextCount() {
      const response = await app.$http.$get(`${ApiUrl}/text/count`);
      return Number(response.count);
    },

    async getImageCount() {
      const response = await app.$http.$get(`${ApiUrl}/image/count`);
      return Number(response.count);
    },

    async createUser(name, description) {
      const response = await app.$http.$post(`${ApiUrl}/user/create_user`, {
        name: name,
        description: description,
      });
      return response.id;
    },

    async updateUser(name, description) {
      const response = await app.$http.$put(`${ApiUrl}/user/create_user`, {
        name: name,
        description: description,
      });
      return response.id;
    },

  });
}
