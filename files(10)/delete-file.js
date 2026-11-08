const { getStore } = require("@netlify/blobs");

const ADMIN_PASSWORD = "123456789";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }
  try {
    const { code, password } = JSON.parse(event.body);
    if (password !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
    }
    const store = getStore("gmi-files");
    await store.delete(code.toUpperCase() + ":file");
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
