const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const code = ((event.queryStringParameters && event.queryStringParameters.code) || "").toUpperCase();
  if (!code) {
    return { statusCode: 400, body: "Code manquant" };
  }
  const store = getStore("gmi-files");
  const entry = await store.getWithMetadata(code + ":file", { type: "arrayBuffer" });
  if (!entry) {
    return { statusCode: 404, body: "Fichier introuvable" };
  }
  const meta = entry.metadata || {};
  const buffer = Buffer.from(entry.data);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": meta.contentType || "application/octet-stream",
      "Content-Disposition": "inline; filename=\"" + (meta.filename || "fichier") + "\"",
      "Cache-Control": "no-store"
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true
  };
};
