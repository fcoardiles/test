<template>
  <b-row
    v-bind:style="{
      backgroundImage: 'url(images/bk.webp)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '98vh',
    }"
  >
    <b-col cols="12">
      <b-row>
        <b-col cols="12" class="text-left pb-2 pt-5 mt-3">
          <h2
            v-bind:style="{
              fontFamily: 'Oswald, sans-serif',
              backgroundColor: '#001D29',
              padding: '5px 10px',
              borderRadius: '5px',
              color: 'white',
            }"
          >
            MUNKÁK
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <b-progress height="2px" :value="timerProgress"></b-progress>
          <b-table
            hover
            :items="loadData"
            :fields="fields"
            sort-by="job.dateTime"
            :sort-desc="true"
            :tbody-tr-class="rowClass"
            primary-key="job.id"
            :no-provider-paging="true"
            :no-provider-filtering="true"
            :no-provider-sorting="true"
            ref="table"
            v-bind:style="{
              textAlign: 'center',
              backgroundColor: '#343A40',
              color: 'white',
            }"
          >
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>{{ loadingText }}</strong>
              </div>
            </template>

            <template v-slot:cell(datetime)="row">{{
              new Date(Date.parse(row.item.job.dateTime)).toLocaleString()
            }}</template>

            <template v-slot:cell(action)="row">
              <!--Kezdés-->
              <ActionButton
                v-if="row.item.job.jobStatus.id == 0"
                :row="row"
                :action="setState"
                class="mdi mdi-calendar-start"
                v-bind:style="{
                  backgroundColor: 'transparent',
                  color: '#57AB57',
                  padding: 0,
                  margin: 0,
                  border: 'none',
                }"
                :ctx="{ statusId: 1 }"
              />&nbsp;
              <!--Megszakítás-->
              <ActionButton
                v-if="row.item.job.jobStatus.id == 1"
                :row="row"
                :action="setState"
                class="mdi mdi-motion-pause"
                v-bind:style="{
                  backgroundColor: 'transparent',
                  color: 'red',
                  padding: 0,
                  margin: 0,
                  border: 'none',
                }"
                :ctx="{ statusId: -1 }"
              />&nbsp;
            </template>
            <template v-slot:cell(action2)="row">
              <!--Megnyitás-->
              <ActionButton
                :disabled="!row.item.vault"
                :row="row"
                :action="openClick"
                class="mdi mdi-folder-download"
                v-bind:style="{
                  backgroundColor: 'transparent',
                  color: '#37474F',
                  padding: 0,
                  margin: 0,
                  border: 'none',
                }"
                :ctx="{}"
              />
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import axios from "axios";
export default {
  name: "Main",
  components: {
    ActionButton: () => import("../components/main/ActionButton"),
  },
  async created() {
    this.timer = setInterval(async () => {
      if (this.actionInProgress) return;

      this.timerProgress += 1;
      if (this.timerProgress >= 100) {
        this.timerProgress = 0;
        this.$refs.table.refresh();
      }
    }, 500);
    this.$options.sockets.onmessage = (data) => {
      const event = JSON.parse(data.data);
      //console.log(event);
      if (event.Source == "BarcodeReader") {
        this.handleBarcode(event.Message);
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  data() {
    return {
      loadingText: "Betöltés...",
      actionInProgress: false,
      timer: "",
      timerProgress: 0,
      fields: [
        {
          key: "job.id",
          label: "ID",
          tdClass: "align-middle",
        },
        {
          key: "job.jobStatus.name",
          label: "Státusz",
          tdClass: "align-middle",
        },
        {
          key: "job.notificationNumber",
          label: "SAP jelentés",
          tdClass: "align-middle",
        },
        {
          key: "order.orderId",
          label: "SAP Rendelés",
          tdClass: "align-middle",
        },
        {
          key: "vault.partNumber",
          label: "Rajzszám",
          tdClass: "align-middle",
        },
        {
          key: "dateTime",
          label: "Létrehozva",
          tdClass: "align-middle",
        },
        {
          key: "action",
          label: "Művelet",
          tdClass: "align-middle",
        },
        {
          key: "action2",
          label: "Megnyitás",
          tdClass: "align-middle",
        },
      ],
      //items: [],
    };
  },
  methods: {
    async loadData() {
      try {
        const table = [];
        this.loadingText = "Munkák betöltése...";
        const { data } = await this.$http.get(
          "api/management/job/byTerminal/" +
            this.$store.settings.getTerminalId() +
            "/dynamic"
        );

        data.terminalJobs.forEach((job, i) => {
          table[i] = {
            job,
          };
        });

        var numbers = data.terminalJobs
          .map((x) => "Numbers=" + x.notificationNumber)
          .join("&");

        if (numbers.length == 0) return [];

        this.loadingText = "SAP adatok betöltése...";
        const { data: sapData } = await this.$http.get(
          "api/sap/getNotifications/byNotificationNumber?" + numbers
        );

        table.forEach((row) => {
          row.order = sapData.notifications.find((n) =>
            n.notificationNumber.endsWith("0000" + row.job.notificationNumber)
          );
        });

        var orders = sapData.notifications
          .map((x) => "sapOrders=" + x.orderId)
          .join("&");

        if (orders.length == 0) return [];

        this.loadingText = "Vault adatok betöltése...";
        const { data: vaultData } = await this.$http.get(
          "api/vault/vaultLog/bySapOrder?" + orders
        );

        table.forEach((row) => {
          row.vault = vaultData.vaultLogs.find(
            (v) => v.sapOrder == row.order?.orderId ?? ""
          );
        });

        return table;
      } catch (error) {
        this.displayError(error);
        return [];
      }
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.job.jobStatus.id == -1) return "bg-danger";
      if (item.job.jobStatus.id == 1) return "bg-warning";
      if (item.job.jobStatus.id == 2) return "bg-success";
    },
    async openClick(_, row) {
      if (this.actionInProgress) return;
      this.actionInProgress = true;

      try {
        const instance = axios.create();
        const response = await instance.get(
          "http://localhost:5100/DownloadAndOpenFileFromVault?fileName=" +
            row.item.vault.fileName +
            "&masterId=" +
            row.item.vault.masterId,
          { crossDomain: true }
        );

        this.actionInProgress = false;
      } catch (error) {
        if (error.response == undefined) {
          // no agent
          await this.download(row);
          this.actionInProgress = false;
        } else {
          this.displayError(error);
        }
      }
    },
    async download(row) {
      try {
        const response = await this.$http.get(
          "/api/vault/core/file/download/byMasterId/" + row.item.vault.masterId
        );

        var a = document.createElement("a");
        a.href =
          "data:application/document;base64," +
          response.data.fileDownload.base64Content;
        a.download = "" + row.item.vault.fileName;
        a.click();
        //window.location.href = "data:application/octet-stream;base64," + response.data.content;
      } catch (error) {
        this.displayError(error);
      }
    },
    async setState(ctx, row) {
      try {
        await this.$http.put("/api/management/job/status", {
          id: row.item.job.id,
          statusId: ctx.statusId,
        });
      } catch (error) {
        this.displayError(error);
      }

      this.$refs.table.refresh();
    },
    displayError(text) {
      this.$bvToast.toast("" + text, {
        title: `Hiba`,
        variant: "danger",
        solid: true,
        toaster: "b-toaster-bottom-center",
        appendToast: true,
      });
    },
    handleBarcode(barcode) {
      barcode = barcode.trim();
      let row = this.$refs.table.localItems.find(
        (r) =>
          r.vault?.partNumber.trim() == barcode ||
          r.job.notificationNumber == barcode
      );

      if (row == null) {
        this.displayError("Nem található ilyen jelentés / rajz:" + barcode);
      } else {
        if (row.job.jobStatus.id == 0) {
          this.setState({ statusId: 1 }, { item: row }); // To in-progress
        }
        /* else if (row.job.jobStatus.id == 1) {
          this.setState({ statusId: 2 }, { item: row }); // To done
        } */
      }
    },
  },
};
</script>
<style>
th {
  font-weight: 800;
}
tbody {
  background-color: #ffffff !important;
  color: #37474f;
  font-family: "Oswald", sans-serif;
}
</style>
