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
  removeFile(state, fileId) {
    state.files = state.files.filter(file => file.id !== fileId);
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
  async deleteFile({ commit }, file) {
    try {
      const response = await this.$axios.delete(`/files/${file._id}`);
      if (response.status === 200) {
        commit('removeFile', file.id);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  },
};
