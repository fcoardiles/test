import Vue from 'vue';

var SettingsManager = (function () {
    var reactive = Vue.observable({
        terminalId: 0
    });

    return {
        reactive,
        getTerminalId: () => {
            let id = window.localStorage.getItem('terminalId');
            let terminalId = id === null ? 0 : parseInt(id);
            reactive.terminalId = terminalId;
            return terminalId;
        },
        setTerminalId: (id) => {
            window.localStorage.setItem('terminalId', id);
            reactive.terminalId = id;
        }
    }
}());

var Store = (function () {
    var settings = SettingsManager

    var session = {
        id: 0,
        isActive: false,
        loginDateTime: null,
        logoutDateTime: null,
        totalDurationSec: 0,
        employee: {
            id: 0,
            cardCode: 0,
            fullName: ""
        }
    }

    var reactive = Vue.observable({
        userName: "",
        hasSession: false,
        terminal: 0,
        version: ""
    });

    return {
        settings,
        session,
        reactive,
        resetSession: function () {
            this.session = {
                id: 0,
                employee: {
                    id: 0
                }
            }
            this.reactive.userName = "";
            this.reactive.hasSession = false;
            window.localStorage.removeItem('session');
        },
        loadSession: function (session) {
            this.session = session;
            this.reactive.userName = session.employee.fullName;
            this.reactive.hasSession = true;
            window.localStorage.setItem('session', JSON.stringify(session));
        },
        restoreSession: function () {
            let session = window.localStorage.getItem('session');
            if (session !== null && session != "") {
                this.session = JSON.parse(session);
                this.reactive.hasSession = true;
                this.reactive.userName = this.session.employee.fullName;
            }
        }
    }
}());


export default {
    install(Vue) {
        Store.restoreSession();
        Vue.prototype.$store = Store;
    },
    Store
}