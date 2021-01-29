<template>
  <b-container>
    <video autoplay loop muted>
      <source src="/video/bkn.webm" type="video/webm" />
    </video>
    <div id="filter-video"></div>
    <div id="repeat"></div>
    <div id="repeatH"></div>
    <b-row
      class="justify-content-center align-items-center"
      v-bind:style="{ height: '90vh' }"
    >
      <b-card
        align="center"
        v-bind:style="{
          backgroundColor: '#EAEBEE',
          borderRadius: '1em',
          zIndex: '20',
          width: '420px',
        }"
      >
        <b-form class="col-12" @submit="onSubmit" v-if="!loading" ref="form">
          <b-img src="/images/jp_logo.webp" height="50" center />

          <h4
            v-bind:style="{
              fontFamily: 'Anton, sans-serif',
              margin: '5px',
              color: '#46536E',
            }"
          >
            SAFE TERMINAL <i class="mdi mdi-lock-check" aria-hidden="true"></i>
          </h4>

          <h5
            class="pt-3 pb-1"
            v-bind:style="{
              fontFamily: 'Oswald, sans-serif',
              color: '#041640',
            }"
          >
            BEJELENTKEZÉS
          </h5>
          <b-alert
            :show="error.message !== null"
            variant="danger"
            dismissible
            >{{ error.message }}</b-alert
          >
          <b-form-group
            v-show="terminalId === null"
            id="employee-group-1"
            label-for="input-1"
            v-bind:style="{
              fontFamily: 'Oswald, sans-serif',
            }"
          >
            <b-form-input
              id="input-1"
              type="number"
              v-model="form.terminalId"
              class="text-center"
              placeholder="TERMINÁL"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="employee-group-2"
            label-for="input-2"
            v-bind:style="{
              fontFamily: 'Oswald, sans-serif',
            }"
          >
            <b-form-input
              id="input-2"
              placeholder="KÁRTYASZÁM"
              v-model="form.employeeCardCode"
              class="text-center"
              required
            ></b-form-input>
          </b-form-group>

          <b-button
            type="submit"
            block
            v-bind:style="{
              backgroundColor: '#E65100',
              fontFamily: 'Oswald, sans-serif',
              border: 'none',
            }"
            ref="btn"
            >TOVÁBB</b-button
          >
        </b-form>
        <div v-else class="text-center">
          <b-spinner label="Loading..."></b-spinner>
          <h4 class="text-center">{{ loading }}</h4>
        </div>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import Axios from "axios";
export default {
  name: "Login",
  mounted() {
    if (this.$store.reactive.hasSession) this.$router.push("/").catch(() => {});
  },
  async created() {
    this.$options.sockets.onmessage = (data) => {
      const event = JSON.parse(data.data);
      console.log(event);
      if (event.Source == "CardReader") {
        this.form.employeeCardCode = event.Message;
        this.submit();
      }
    };

    try {
      this.loading = "Kapcsolódás az helyi ügynökhöz...";
      const { data } = await this.$http.get("http://localhost:5100/terminalId");
      this.test = 1;
      this.$store.settings.setTerminalId(data.terminalId);
      this.terminalId = data.terminalId;

      this.terminalId = this.test;
    } catch (error) {
      if (error.response == undefined) {
        // no agent
      } else {
        this.error.message = "" + error;
      }

      this.loading = null;
      return;
    }

    try {
      const { data } = await this.$http.get(
        "api/management/session/ByTerminal/" +
          this.$store.settings.getTerminalId() +
          "?isActive=true"
      );

      if (data.terminalSessions.length < 1) {
        this.loading = null;
        return;
      }

      let sessions = data.terminalSessions.sort(function(a, b) {
        return b.id - a.id;
      });

      this.$store.loadSession(sessions[0]);
      this.$router.push("/").catch(() => {});
    } catch (error) {
      if (error.response.status == 404) {
        // no session
      } else {
        this.error.message = "" + error;
      }
    }

    this.loading = null;
  },
  data() {
    return {
      form: {
        employeeCardCode: "",
        terminalId: "",
      },
      terminalId: null,
      loading: null,
      error: {
        message: null,
      },
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.submit();
    },
    async submit() {
      this.loading = "Betöltés...";
      let terminalId = this.terminalId ?? this.form.terminalId;

      try {
        Axios.post("/api/management/session/", {
          TerminalId: terminalId,
          EmployeeCardCode: this.form.employeeCardCode,
          CloseExistingSession: true,
        });
        /*
        this.$store.loadSession(data.terminalSession);
        this.$store.settings.setTerminalId(terminalId);
        this.$router.push("/");*/
      } catch (err) {
        if (err.response.status == 404) {
          this.error.message = "Ismeretlen terminál vagy kártyaszám!";
        } else {
          this.error.message = "" + err;
        }

        return;
      } finally {
        this.loading = null;
      }
    },
  },
};
</script>
<style>
video {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  background-size: 100% 100%;
  background-color: black;
  background-position: center center;
  background-size: contain;
  object-fit: cover;
  z-index: 3;
}
#filter-video {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background-color: rgba(0, 0, 27, 0.85);
  z-index: 5;
}
#repeat {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  z-index: 6;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.2) 8px 2px,
    transparent 10px 20px
  );
}
#repeatH {
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  z-index: 6;
  background-image: repeating-linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 8px 2px,
    transparent 10px 20px
  );
}
</style>
