async function enviaWhatsUltra({ to, text }) {
  const f = await getFetch();
  if (process.env.ULTRA_PROVIDER === "ultramsg") {
    // UltraMSG: POST /{instance}/messages/chat (form-encoded ou JSON)
    const url = `${process.env.ULTRA_BASE_URL}/${process.env.ULTRA_INSTANCE_ID}/messages/chat`;
    const payload = {
      token: process.env.ULTRA_TOKEN,
      to,            // 5579xxxxxxxx sem +
      body: text     // campo é body na UltraMSG
    };
    const res = await f(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => null);
    if (!res || !res.ok) {
      const body = res ? await res.text() : "NO_RESPONSE";
      throw new Error(`ULTRAMSG_FAIL_${res ? res.status : "NET"}_${body}`);
    }
    try { return await res.json(); } catch { return {}; }
  } else {
    // UltraSMG (antigo)
    const url = `${process.env.ULTRA_BASE_URL}/message/sendText`;
    const payload = {
      instanceId: process.env.ULTRA_INSTANCE_ID,
      token: process.env.ULTRA_TOKEN,
      to,
      message: text
    };
    const res = await f(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!res || !res.ok) {
      const body = res ? await res.text() : "NO_RESPONSE";
      throw new Error(`ULTRASMG_FAIL_${res ? res.status : "NET"}_${body}`);
    }
    try { return await res.json(); } catch { return {}; }
  }
}
