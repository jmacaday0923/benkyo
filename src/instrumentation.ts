export async function register() {
  // Validate the environment once at server start-up, so a misconfigured
  // deployment fails immediately instead of on the first request that needs it.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./env");
  }
}
