const { getStore } = require("@netlify/blobs");

const ADMIN_PASSWORD = "123456789";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }
  try {
    const body = JSON.parse(event.body);
    const { filename, contentType, dataBase64, description, password } = body;

    if (password !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: "Mot de passe incorrect" }) };
    }
    if (!filename || !dataBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "Fichier manquant" }) };
    }

    const store = getStore("gmi-files");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];

    const buffer = Buffer.from(dataBase64, "base64");
    await store.set(code + ":file", buffer, {
      metadata: {
        filename,
        contentType: contentType || "application/octet-stream",
        description: description || "",
        createdAt: Date.now()
      }
    });

    return { statusCode: 200, body: JSON.stringify({ code }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
