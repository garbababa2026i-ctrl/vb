const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const code = ((event.queryStringParameters && event.queryStringParameters.code) || "").toUpperCase();
  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: "Code manquant" }) };
  }
  const store = getStore("gmi-files");
  const meta = await store.getMetadata(code + ":file");
  if (!meta) {
    return { statusCode: 404, body: JSON.stringify({ error: "Code introuvable" }) };
  }
  return { statusCode: 200, body: JSON.stringify(meta.metadata || {}) };
};
