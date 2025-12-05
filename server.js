document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("rastreioForm");
    const input = document.getElementById("codigo");
    const resultadoDiv = document.getElementById("resultado");
    const loading = document.getElementById("loading");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const codigo = input.value.trim();

        if (!codigo) {
            mostrarErro("Digite um código de rastreio válido.");
            return;
        }

        resultadoDiv.innerHTML = "";
        loading.style.display = "block";

        try {
            const response = await fetch(`https://rastreiophp-production.up.railway.app/rastreio.php?codigo=${codigo}`);

            if (!response.ok) {
                throw new Error("Erro ao consultar o servidor.");
            }

            const data = await response.json();
            loading.style.display = "none";

            if (data.error) {
                mostrarErro(data.error);
                return;
            }

            mostrarResultado(data);

        } catch (err) {
            loading.style.display = "none";
            mostrarErro("Falha na conexão. Tente novamente.");
            console.error(err);
        }
    });

    function mostrarErro(msg) {
        resultadoDiv.innerHTML = `
            <div class="erro">
                ❌ ${msg}
            </div>
        `;
    }

    function mostrarResultado(data) {
        resultadoDiv.innerHTML = `
            <div class="card">
                <h2>📦 Informações do Objeto</h2>
                <p><strong>Código:</strong> ${data.codigo}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Última atualização:</strong> ${data.ultima_atualizacao}</p>
                <hr>
                <h3>📍 Movimentações</h3>
                ${data.eventos.map(evento => `
                    <div class="evento">
                        <p><strong>${evento.data}</strong> — ${evento.local}</p>
                        <p>${evento.status}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }
});
