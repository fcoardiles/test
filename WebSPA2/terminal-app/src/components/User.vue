<template>
  <b-row class="pt-1">
    <b-col cols="6">
      <b-row
        align-h="start"
        align-v="center"
        v-bind:style="{
          position: 'fixed',
          bottom: '0',
          zIndex: '20',
          fontFamily: 'Anton, sans-serif',
          color: '#878890',
        }"
      >
        <b-col cols="12">
          <h5>
            {{ clock.y }}/{{ clock.M }}/{{ clock.d }} {{ clock.h }}:{{
              clock.m
            }}:{{ clock.s }}
          </h5>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="6">
      <b-row
        v-bind:style="{
          position: 'fixed',
          bottom: '0',
          width: '50vw',
          textAlign: 'right',
          zIndex: '20',
          fontFamily: 'Anton, sans-serif',
          color: '#878890',
        }"
      >
        <b-col cols="12">
          <h5>v{{ version }}</h5>
        </b-col>
      </b-row>
    </b-col>
    <template v-if="hasSession">
      <div
        v-bind:style="{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: '#E65100',
          zIndex: '20',
          color: '#878890',
          padding: '5px',
        }"
      >
        <b-row>
          <b-col cols="6">
            <img
              src="images/logo.webp"
              alt="logo"
              height="40px"
              class="pt-1 pb-1"
            />
            <span
              class="pl-2"
              v-bind:style="{
                fontFamily: 'Anton, sans-serif',
                fontSize: '1.2em',
                color: '#46536E',
                height: '100%',
                top: '10px',
                position: 'absolute',
              }"
            >
              SAFE TERMINAL
              <i class="mdi mdi-lock-check" aria-hidden="true"></i>
            </span>
          </b-col>
          <b-col cols="6">
            <b-row align-h="end" align-v="center" class="pt-1 pr-1">
              <b-col
                cols="12"
                md="12"
                v-bind:style="{
                  color: 'white',
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: '1.2em',
                }"
                class="text-right"
              >
                <span class="mr-4">Terminál: {{ terminal }}</span>
                <span class="mr-4">
                  <i class="mdi mdi-account" aria-hidden="true"></i>
                  Nagy Annamaria
                </span>
                <b-button
                  v-bind:style="{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                  }"
                  to="logout"
                  class="mdi mdi-logout"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div
        v-bind:style="{
          height: '40px',
          width: '100%',
          position: 'fixed',
          bottom: 0,
          backgroundColor: '#0A173D',
        }"
      ></div>
    </template>
    <template v-else>
      <div
        v-bind:style="{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: '#E65100',
          zIndex: '20',
          color: '#878890',
          padding: '5px',
        }"
      >
        <b-row>
          <b-col cols="6">
            <img
              src="images/logo.webp"
              alt="logo"
              height="40px"
              class="pt-1 pb-1"
            />
            <span
              class="pl-2"
              v-bind:style="{
                fontFamily: 'Anton, sans-serif',
                fontSize: '1.2em',
                color: '#46536E',
                height: '100%',
                top: '10px',
                position: 'absolute',
              }"
            >
              SAFE TERMINAL
              <i class="mdi mdi-lock-check" aria-hidden="true"></i>
            </span>
          </b-col>
          <b-col cols="6">
            <b-row align-h="end" align-v="center" class="pt-1 pr-1">
              <b-col
                cols="12"
                md="12"
                v-bind:style="{
                  color: 'white',
                  fontFamily: 'Oswald, sans-serif',
                  fontSize: '1.2em',
                }"
                class="text-right"
              >
                <span class="mr-4">Terminál: {{ terminal }}</span>
                <span class="mr-4">
                  <i class="mdi mdi-account" aria-hidden="true"></i>
                  Nagy Annamaria
                </span>
                <b-button
                  v-bind:style="{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                  }"
                  to="logout"
                  class="mdi mdi-logout"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div
        v-bind:style="{
          height: '40px',
          width: '100%',
          position: 'fixed',
          bottom: 0,
          backgroundColor: '#0A173D',
        }"
      ></div>
    </template>
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
    hasSession: function() {
      return this.$store.reactive.hasSession;
    },
    userName: function() {
      return this.$store.reactive.userName;
    },
    terminal: function() {
      return this.$store.settings.reactive.terminalId;
    },
    version: function() {
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
