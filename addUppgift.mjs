const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Environment variables (set these via command line or .env file)
const KUNDBEHOV_API_URL =
  process.env.VITE_KUNDBEHOV_API_URL || "http://localhost:8888";
const UPPGIFTER_API_URL =
  process.env.VITE_UPPGIFTER_API_URL || "http://localhost:8889";
const HANDLAGGARE_ID =
  process.env.VITE_MOCK_HANDLAGGARE_ID ||
  "469ddd20-6796-4e05-9e18-6a95953f6cb3";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);

  const contentType = res.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");

  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const details = isJson ? JSON.stringify(body, null, 2) : String(body);
    throw new Error(
      `HTTP ${res.status} ${res.statusText} for ${url}\n${details}`,
    );
  }

  return body;
}

async function main() {
  const kundbehovBody = {
    persnr: "19900101-9999",
    formanstyp: "VAH",
    period: {
      start: 1.7665308e9,
      slut: 1.7667036e9,
    },
  };

  const kundbehovRes = await fetchJson(`${KUNDBEHOV_API_URL}/kundbehov`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(kundbehovBody),
  });

  const kundbehovId = kundbehovRes?.kundbehov?.id;
  if (!kundbehovId) {
    throw new Error(
      `Could not find kundbehov.id in response:\n${JSON.stringify(kundbehovRes, null, 2)}`,
    );
  }

  console.log("/kundbehov OK - kundbehovId:", kundbehovId);

  const flodeRes = await fetchJson(`${KUNDBEHOV_API_URL}/kundbehovsflode`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ kundbehovId }),
  });

  console.log("/kundbehovsflode OK - flodeId:", flodeRes?.kundbehovsflode?.id);

  const uppgifterBase = `${UPPGIFTER_API_URL}/uppgifter/handlaggare/${HANDLAGGARE_ID}`;

  const thirdRes = await fetchJson(uppgifterBase, {
    method: "POST",
    headers: JSON_HEADERS,
  });

  console.log("POST /uppgifter/handlaggare response: ");
  console.log(JSON.stringify(thirdRes, null, 2));

  const fourthRes = await fetchJson(uppgifterBase, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  console.log("GET /uppgifter/handlaggare response: ");
  console.log(JSON.stringify(fourthRes, null, 2));
}

main().catch((err) => {
  console.error("❌ Chain failed:");
  console.error(err?.stack || err);
  process.exitCode = 1;
});
