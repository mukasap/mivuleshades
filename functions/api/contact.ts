export async function onRequestPost({ request }) {
  try {
    const form = await request.formData();

    // Honeypot (optional but recommended)
    if (form.get("company")) {
      return json({ ok: true });
    }

    const name = form.get("name")?.toString().trim();
    const email = form.get("email")?.toString().trim();
    const message = form.get("message")?.toString().trim();

    if (!name || !email || !message) {
      return json(
        { ok: false, error: "Please fill in all fields." },
        400
      );
    }

    const body = `
New message from mivuleshades.com

Name: ${name}
Email: ${email}

Message:
${message}
`;

    await fetch("mailto:contact@mivuleshades.com", {
      method: "POST",
      body,
    });

    return json({ ok: true });
  } catch (err) {
    return json(
      { ok: false, error: "Something went wrong. Please try again later." },
      500
    );
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
