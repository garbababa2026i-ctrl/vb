const { getStore } = require("@netlify/blobs");

const ADMIN_PASSWORD = "123456789";

exports.handler = async (event) => {
  const password = event.queryStringParameters && event.queryStringParameters.password;
  if (password !== ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
  }
  const store = getStore("gmi-files");
  const { blobs } = await store.list();
  const files = [];
  for (const b of blobs) {
    if (b.key.endsWith(":file")) {
      const code = b.key.replace(":file", "");
      const meta = await store.getMetadata(b.key);
      files.push({ code, ...((meta && meta.metadata) || {}) });
    }
  }
  files.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return { statusCode: 200, body: JSON.stringify({ files }) };
};
