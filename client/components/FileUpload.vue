<template>
  <v-container>
    <v-form @submit.prevent="handleFileUpload">
      <v-file-input
        v-model="file"
        label="Choose a file"
        accept="*.*"
        outlined
        required
      ></v-file-input>
      <v-btn :loading="loading" :disabled="loading" type="submit" color="primary">
        Upload
      </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar.success" :timeout="3000" color="success">
      File uploaded successfully!
    </v-snackbar>
    <v-snackbar v-model="snackbar.error" :timeout="3000" color="error">
      Error uploading file: {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      loading: false,
      snackbar: {
        success: false,
        error: false,
      },
      errorMessage: '',
    };
  },
  methods: {
    async handleFileUpload() {
      if (!this.file) return;

      const formData = new FormData();
      formData.append('file', this.file);

      this.loading = true;
      try {
        const response = await this.$axios.post('/upload', formData);
        if (response.status === 200) {
          this.file = null;
          this.snackbar.success = true;
          this.$emit('file-uploaded', response.data); // Emit with response data if needed
        }
      } catch (error) {
        this.snackbar.error = true;
        this.errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
