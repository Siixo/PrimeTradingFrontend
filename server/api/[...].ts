export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const rawTarget = (
    config.public.apiBaseUrl || "http://localhost:8080"
  ).replace(/\/$/, "");
  const target = /^https?:\/\//i.test(rawTarget)
    ? rawTarget
    : `https://${rawTarget}`;

  // Use the built-in Nitro proxy utility
  // This is much more reliable on Vercel as it explicitly forwards headers.
  return proxyRequest(event, `${target}${event.path}`);
});
