<template>
  <b-row class="pt-5 text-center justify-content-center">
    <b-col cols="6">
      <h1>
        <p>Kijelentkezés...</p>
      </h1>
      <div>
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Logout",
  created() {
    if (!this.$store.reactive.hasSession) {
      this.$router.push("/login");
      return;
    }

    this.$http
      .put("api/management/session/" + this.$store.session.id)
      .then(() => {
        this.$store.resetSession();
        this.$router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
</style>