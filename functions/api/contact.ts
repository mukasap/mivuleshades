export async function onRequestPost({ request }) {
  try {
    const form = await request.formData();

    const name = form.get("name");
    const email = form.get("email");
    const message = form.get("message");

    if (!name || !email || !message) {
      return json({ ok: false, error: "All fields are required." }, 400);
    }

    const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "contact@mivuleshades.com" }],
            reply_to: { email },
          },
        ],
        from: {
          email: "contact@mivuleshades.com",
          name: "Mivule Shades Website",
        },
        subject: "New contact form message",
        content: [
          {
            type: "text/plain",
            value: `
Name: ${name}
Email: ${email}

${message}
            `,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error("Mail send failed");
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json(
      { ok: false, error: "Failed to send message. Try again later." },
      500
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
