<template>
  <div id="config">
    <h1>Settings</h1>
    <h3>Server</h3>
    <p>URL: {{ serverUrl }}</p>

    <h3>Storage</h3>
    <dl>
      <dt>Use third-party sync</dt>
      <small>Use installed Dropbox, Google Drive, OneDrive or Yandex Disk as storage. Write path where you want to store your data, e.g. 'c:/Users/antivitla/Dropbox/Notes' (win) or '/Users/antivitla/Dropbox/Notes' (osx).</small>
      <dd>(Dropbox, Google Drive, OneDrive, YandexDisk)</dd>

      <br>
      <br>

      <dt>Use Mitaba account</dt>
      <small>Login with Facebook, Google, Github, VK or Yandex into your Mitaba/Titamota account</small>
      <dd>(login with social auth)</dd>

      <br>
      <br>

      <dt>Other url</dt>
      <small>If you want to use your own standalone minota server, provide it's url here</small>
      <dd>(url)</dd>
    </dl>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'config',
    computed: {
      ...mapGetters([
        'serverUrl'
      ])
    }
  }
</script>
