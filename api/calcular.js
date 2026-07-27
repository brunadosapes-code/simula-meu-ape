export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Apenas método POST é permitido' });
    }

    const { renda, nascimento, temFilhos, ocupacao } = req.body;

    // Matriz oficial da Tabela Credilar MCMV / Caixa[cite: 3]
    const tabelaCredilar = [
        { renda: 1000, fin: 59840, subDep: 55000, subSem: 16500 },
        { renda: 1200, fin: 72642, subDep: 55000, subSem: 16500 },
        { renda: 1400, fin: 85443, subDep: 55000, subSem: 16500 },
        { renda: 1600, fin: 98962, subDep: 55000, subSem: 16500 },
        { renda: 1800, fin: 111046, subDep: 55000, subSem: 16500 },
        { renda: 2000, fin: 123848, subDep: 50089, subSem: 15233 },
        { renda: 2200, fin: 132313, subDep: 38993, subSem: 11868 },
        { renda: 2400, fin: 144708, subDep: 29260, subSem: 8920 },
        { renda: 2600, fin: 157103, subDep: 21157, subSem: 6461 },
        { renda: 2800, fin: 169498, subDep: 14603, subSem: 4467 },
        { renda: 3000, fin: 171211, subDep: 9621, subSem: 2945 },
        { renda: 3200, fin: 183219, subDep: 5880, subSem: 1803 },
        { renda: 3400, fin: 189232, subDep: 3492, subSem: 1071 },
        { renda: 3600, fin: 189017, subDep: 2333, subSem: 715 },
        { renda: 3800, fin: 199970, subDep: 2142, subSem: 657 },
        { renda: 4000, fin: 210923, subDep: 2099, subSem: 644 },
        { renda: 4200, fin: 197652, subDep: 0, subSem: 0 },
        { renda: 4400, fin: 207409, subDep: 0, subSem: 0 },
        { renda: 4700, fin: 220000, subDep: 0, subSem: 0 },
        { renda: 5000, fin: 220000, subDep: 0, subSem: 0 },
        { renda: 5200, fin: 212636, subDep: 0, subSem: 0 },
        { renda: 5400, fin: 221251, subDep: 0, subSem: 0 },
        { renda: 5600, fin: 229865, subDep: 0, subSem: 0 },
        { renda: 5800, fin: 238480, subDep: 0, subSem: 0 },
        { renda: 6000, fin: 247094, subDep: 0, subSem: 0 },
        { renda: 6200, fin: 255709, subDep: 0, subSem: 0 },
        { renda: 6400, fin: 264323, subDep: 0, subSem: 0 },
        { renda: 6600, fin: 278158, subDep: 0, subSem: 0 },
        { renda: 6800, fin: 281552, subDep: 0, subSem: 0 },
        { renda: 7000, fin: 290167, subDep: 0, subSem: 0 },
        { renda: 7200, fin: 298781, subDep: 0, subSem: 0 }
    ];

    let dadosFaixa = tabelaCredilar[0];
    for (let item of tabelaCredilar) {
        if (renda >= item.renda) {
            dadosFaixa = item;
        } else {
            break;
        }
    }

    const valorFinanciado = dadosFaixa.fin;
    const subsidioMCMV = temFilhos ? dadosFaixa.subDep : dadosFaixa.subSem;
    
    // Subsídio puro do programa MCMV
    const subsidioTotal = subsidioMCMV;
    const poderDeCompraTotal = valorFinanciado + subsidioTotal;

    const parcelaMaxima = renda * 0.30;

    return res.status(200).json({
        sucesso: true,
        resumo: {
            modalidade: renda <= 7200 ? "Minha Casa Minha Vida (Faixas 1 e 2)" : "Minha Casa Minha Vida (Faixa 3) / SBPE",
            prazoMeses: 420,
            parcelaInicialEstimada: parcelaMaxima,
            valorFinanciado: valorFinanciado,
            subsidioTotal: subsidioTotal,
            poderDeCompraTotal: poderDeCompraTotal
        }
    });
}
