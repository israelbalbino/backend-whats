const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS personalizado
const allowedDomains = process.env.ALLOWED_DOMAINS.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Bloqueado por CORS: ${origin}`);
      callback(new Error("Não autorizado pelo CORS"));
    }
  }
}));

app.use(express.json());

app.post("/whatsapp-image", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Número de telefone obrigatório" });
  }

  try {
    const response = await axios.get(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/profile-picture/${phone}`
    );

    if (response.data && response.data.profile_picture_url) {
      return res.json({ imageUrl: response.data.profile_picture_url });
    } else {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }
  } catch (err) {
    console.error("Erro na API da Z-API:", err.message);
    return res.status(500).json({ error: "Erro ao buscar imagem" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
