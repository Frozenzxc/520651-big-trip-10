import AppController from "./controller/app-controller";

const app = new AppController();
app.registerSW();
app.render();
app.syncSW();
app.isOffline();

