import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import * as Sentry from "@sentry/svelte";
// Initialize the Sentry SDK here
Sentry.init({
  dsn: "https://10f35c3bdbe74919bdd8dbfe0e9a5b8e@o95413.ingest.us.sentry.io/208704",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  integrations: [
  ],
});

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
