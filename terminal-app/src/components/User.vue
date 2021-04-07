<template>
  <b-row class="pt-1">
    <b-col cols="12">
      <em>
        <b-img src="/images/logojp.svg" height="30" class="mr-2" />
        <b>JászPlasztik</b> - Safe Terminal - v{{ version }}
      </em>
    </b-col>
    <b-col cols="6">
      <b-row align-h="start" align-v="center" class="pt-1">
        <b-col cols="12">
          <h5>
            {{ clock.y }}-{{ clock.M }}-{{ clock.d }} {{ clock.h }}:{{
              clock.m
            }}:{{ clock.s }}
          </h5>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="6">
      <b-row align-h="end" align-v="center" class="pt-1">
        <template v-if="hasSession">
          <b-col cols="12" md="auto">
            Terminál:
            <b>{{ terminal }}</b>
          </b-col>
          <b-col cols="12" md="auto">
            Név:
            <b>{{ userName }}</b>
          </b-col>
          <b-col cols="12" md="auto">
            <b-button variant="danger" to="logout">Kijelentkezés</b-button>
          </b-col>
        </template>
        <template v-else>
          <b-col cols="12" md="auto">
            <b-button variant="success" to="login">Bejelentkezés</b-button>
          </b-col>
        </template>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "User",
  created() {
    setTimeout(this.tick, 1000);
  },
  data() {
    return {
      loading: false,
      clock: {
        y: "0000",
        M: "00",
        d: "00",
        h: "00",
        m: "00",
        s: "00",
      },
    };
  },
  computed: {
    hasSession: function () {
      return this.$store.reactive.hasSession;
    },
    userName: function () {
      return this.$store.reactive.userName;
    },
    terminal: function () {
      return this.$store.settings.reactive.terminalId;
    },
    version: function () {
      return this.$store.reactive.version;
    },
  },
  methods: {
    tick() {
      let date = new Date();
      this.clock.y = date.getFullYear();
      this.clock.M = (date.getMonth() + 1 + "").padStart(2, "0");
      this.clock.d = (date.getDate() + "").padStart(2, "0");
      this.clock.h = (date.getHours() + "").padStart(2, "0");
      this.clock.m = (date.getMinutes() + "").padStart(2, "0");
      this.clock.s = (date.getSeconds() + "").padStart(2, "0");

      setTimeout(this.tick, 1000);
    },
  },
};
</script>