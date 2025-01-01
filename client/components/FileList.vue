<template>
  <v-container>
    <template v-if="files.length > 0">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="files"
        :items-per-page="5"
        :search="search"
        @click:row="goToFile"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon @click="deleteFile(item, $event)" class="mr-2" color="red">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </template>

    <v-alert v-if="files.length === 0" type="info">No files uploaded yet.</v-alert>
  </v-container>
</template>

<script>
export default {
  computed: {
    files() {
      return this.$store.state.file.files;
    },
    loading() {
      return this.$store.state.file.loading;
    },
  },
  data() {
    return {
      headers: [
        { text: 'File Name', align: 'start', sortable: true, value: 'filename' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      search: '',
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      await this.$store.dispatch('file/fetchFiles');
    },
    goToFile(filepath) {
      const url = `${process.env.VUE_APP_SERVER_HOST || 'https://express-nuxt-production-34c3.up.railway.app'}${filepath.path}`;
      window.open(url, '_blank');
    },
    async deleteFile(file, event) {
      event.stopPropagation();
      const confirmDelete = confirm(`Are you sure you want to delete ${file.filename}?`);
      if (confirmDelete) {
        try {
          await this.$store.dispatch('file/deleteFile', file);
          this.fetchFiles(); // Refresh the file list after deletion
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    },
  },
};
</script>
