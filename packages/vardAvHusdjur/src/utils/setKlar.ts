/* eslint-disable camelcase -- API response fields use snake_case naming convention */
import { useProductStore } from "../stores/VAHStore";

export async function setKlar() {
  const store = useProductStore();
  if (!store.uppgift?.ersattning) {
    return;
  }
  for (const item of store.uppgift.ersattning) {
    patchKundbehovsflode(item.ersattningId);
  }
}

async function patchKundbehovsflode(id: string) {
  const store = useProductStore();
  try {
    const url = `/regel/${store.regeltyp}/${store.uppgift?.kundbehovsflodeId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ersattnings_id: id,
        beslutsutfall: "JA",
        avslagsanledning: null,
        signera: true,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch {
        const text = await response.text();
        errorMessage += ` - ${text}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Response is not JSON. Got: ${text.substring(0, 100)}`);
    }

    const data = await response.json();
    store.setUppgift(data);
  } catch (error) {
    console.error("Error fetching uppgift information:", error);
    return null;
  }
}
