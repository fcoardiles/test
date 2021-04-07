<template>
  <b-container>
    <b-row class="pt-5 justify-content-center align-items-center"> </b-row>
  </b-container>
</template>

<script>
const signalR = require("@microsoft/signalr");
export default {
  name: "Login",
  mounted() {
    //this.test();
    if (this.$store.reactive.hasSession) this.$router.push("/").catch(() => {});
  },
  async created() {
    this.$options.sockets.onmessage = (data) => {
      const event = JSON.parse(data.data);
      console.log(event);
      if (event.Source == "CardReader") {
        if (event.Message == "") {
          console.log("close Session");
        } else {
          this.signalConnection(event.Message);
        }
      }
    };
  },
  data() {
    return {};
  },
  methods: {
    test() {
      //let socket = "localhost:5100/ws/api/management/notifications/hub";
      let socket = "api/management/notifications/hub";

      const connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        //.configureLogging(signalR.LogLevel.Information)
        .withUrl(socket,
         //{          accessTokenFactory: () => getOwnerCredentials,        }
         )
        .build();
      async function start() {
        try {
          await connection.start();
          console.log("SignalR Conectada.");
        } catch (err) {
          console.log("Data: " + err);
          setTimeout(start, 5000);
        }
      }
      connection.onclose(start);
      // Start the connection.
      start();
    },
    async signalConnection(value) {
      console.log(value);
      let socket = "ws://localhost:5100/ws/api/management/notifications/hub";
      const connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl(socket, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build();
      async function start() {
        try {
          await connection.start();
          console.log("SignalR Connected.");
        } catch (err) {
          console.log(err);
          setTimeout(start, 5000);
        }
      }
      connection.onclose(start);
      // Start the connection.
      start();
    },
  },
};
</script>
