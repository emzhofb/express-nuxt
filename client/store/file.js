export const state = () => ({
  files: [],
  loading: false,
});

export const mutations = {
  setFiles(state, files) {
    state.files = files;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
};

export const actions = {
  async fetchFiles({ commit }) {
    commit('setLoading', true);
    try {
      const response = await this.$axios.get('/files');
      if (response.status === 200) {
        commit('setFiles', response.data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      commit('setLoading', false);
    }
  },
};
