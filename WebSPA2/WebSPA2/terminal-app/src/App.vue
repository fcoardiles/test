<template>
  <b-container fluid>
    <User />
    <router-view />
  </b-container>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.restoreSession();
    this.checkVersion().then(() => {
      setInterval(async () => {
        await this.checkVersion();
      }, 30000);
    });
  },
  components: {
    User: () => import("./components/User"),
  },
  methods: {
    async checkVersion() {
      try {
        const response = await this.$http.get("version.json");

        if (
          this.$store.reactive.version != "" &&
          this.$store.reactive.version != response.data.version
        ) {
          console.log("New version!");
          location.reload(true);
          return;
        }

        this.$store.reactive.version = response.data.version;
      } catch {
        // ignore
        this.$store.reactive.version = "0";
      }
    },
  },
};
</script>