import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.CORREIOS_TOKEN;

app.get("/rastrear/:codigo", async (req, res) => {
    const codigo = req.params.codigo;

    try {
        const r = await axios.post(
            "https://api.correios.com.br/v1/sro-rastro",
            {
                codigos: [codigo]
            },
            {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(r.data);

    } catch (error) {
        console.error("Erro:", error.response?.data || error.message);

        return res.json({
            erro: "Código não encontrado ou API recusou a consulta."
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});
