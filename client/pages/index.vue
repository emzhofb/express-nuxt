<template>
  <v-app>
    <file-upload @file-uploaded="loadFiles" />
    <file-list ref="fileList" />
  </v-app>
</template>

<script>
import FileUpload from '~/components/FileUpload.vue';
import FileList from '~/components/FileList.vue';

export default {
  components: {
    FileUpload,
    FileList,
  },
  methods: {
    loadFiles() {
      this.$refs.fileList.fetchFiles();
    },
  },
};
</script>
