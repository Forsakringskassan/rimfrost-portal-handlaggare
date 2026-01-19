const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

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

  const kundbehovRes = await fetchJson("http://localhost:8888/kundbehov", {
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

  const flodeRes = await fetchJson("http://localhost:8888/kundbehovsflode", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ kundbehovId }),
  });

  console.log("/kundbehovsflode OK - flodeId:", flodeRes?.kundbehovsflode?.id);

  const handlaggareId = "3f439f0d-a915-42cb-ba8f-6a4170c6011f";
  const uppgifterBase = `http://localhost:8889/uppgifter/handlaggare/${handlaggareId}`;

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
