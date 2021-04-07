<template>
  <b-container>
    <b-row class="pt-5 justify-content-center align-items-center">
      <b-form class="col-5" @submit="onSubmit" v-if="!loading" ref="form">
        <b-img src="/images/jp.svg" height="100" center />
        <h2 class="text-center pt-5 pb-5">Bejelentkezés</h2>
        <b-alert :show="error.message !== null" variant="danger" dismissible>{{
          error.message
        }}</b-alert>
        <b-form-group
          v-show="terminalId === null"
          id="employee-group-1"
          label="Terminál azonosító:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            type="number"
            v-model="form.terminalId"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="employee-group-2"
          label="Kártyaszám:"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="form.employeeCardCode"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" ref="btn">Tovább</b-button>
      </b-form>
      <div v-else class="text-center">
        <b-spinner label="Loading..."></b-spinner>
        <h4 class="text-center">{{ loading }}</h4>
      </div>
    </b-row>
  </b-container>
</template>

<script>
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

      this.$store.settings.setTerminalId(data.terminalId);
      this.terminalId = data.terminalId;
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

      let sessions = data.terminalSessions.sort(function(a, b) {
        return b.id - a.id;
      });

      this.$store.loadSession(sessions[0]);
      this.$router.push("/").catch(() => {});
    } catch (error) {
      console.log(error);
    }

    this.loading = null;
  },
  data() {
    return {
      form: {
        employeeCardCode: "",
        terminalId: 0,
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
        const { data } = await this.$http.post("api/management/session", {
          TerminalId: terminalId,
          EmployeeCardCode: this.form.employeeCardCode,
          CloseExistingSession: true,
        });

        this.$store.loadSession(data.terminalSession);
        this.$store.settings.setTerminalId(terminalId);
        this.$router.push("/");
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
