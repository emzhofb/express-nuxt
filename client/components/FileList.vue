<template>
  <v-container>
    <v-list>
      <v-list-item-group v-if="files.length > 0">
        <v-list-item v-for="file in files" :key="file.id" @click="goToFile(file.path)">
          <v-list-item-content>
            <v-list-item-title>{{ file.filename }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-alert v-else type="info">No files uploaded yet.</v-alert>
    </v-list>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      files: [],
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await this.$axios.get('/files');
        if (response.status === 200) {
          this.files = response.data;
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },
    goToFile(filepath) {
      const url = `${process.env.SERVER_HOST || 'https://express-nuxt-production.up.railway.app/'}${filepath}`;
      // Open the file in a new tab
      window.open(url, '_blank');
    },
  },
};
</script>
