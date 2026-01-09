const kundbehovUrl = "http://localhost:8888/kundbehov";
const kundbehovsflodeUrl = "http://localhost:8888/kundbehovsflode";
const uppgifterUrl =
  "http://localhost:8889/uppgifter/handlaggare/3f439f0d-a915-42cb-ba8f-6a4170c6011f";

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
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

  const kundbehovRes = await postJson(kundbehovUrl, kundbehovBody);
  const kundbehovId = kundbehovRes?.data?.kundbehov?.id;

  if (!kundbehovId) {
    throw new Error("Could not find kundbehov.id in response");
  }

  const flodeRes = await postJson(kundbehovsflodeUrl, {
    kundbehovId,
  });
  console.log("Kundbehovsflode response:", flodeRes);

  const uppgifterRes = await fetch(uppgifterUrl, { method: "POST" });
  console.log("Uppgifter response:", uppgifterRes);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
