import { env } from "../config/env";
import type { HandlaggarId } from "../types";

export async function checkSidStatus(
  individer: HandlaggarId[],
): Promise<boolean> {
  const bffUrl = env.bffUrl;

  const response = await fetch(`${bffUrl}/sid/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ individer }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP error! status: ${response.status} - ${body}`);
  }

  const data = await response.json();
  return Boolean(data.sid);
}
