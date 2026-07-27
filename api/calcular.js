export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Apenas método POST é permitido' });
    }

    const { renda, valorImovel, nascimento, temFGTS, temDependente } = req.body;

    const TETO_MCMV_SP = 350000;
    const TETO_CASA_PAULISTA = 264000;
    const COMPROMETIMENTO_MAX = 0.30;

    const anoNascimento = new Date(nascimento).getFullYear();
    const idade = new Date().getFullYear() - anoNascimento;
    const prazoAnos = Math.min(35, 80 - idade);
    const prazoMeses = prazoAnos * 12;

    const parcelaMaxima = renda * COMPROMETIMENTO_MAX;
    
    let subsidioMCMV = 0;
    let subsidioCasaPaulista = 0;

    if (valorImovel <= TETO_MCMV_SP) {
        if (renda <= 2640) {
            subsidioMCMV = temDependente ? 55000 : 45000;
        } else if (renda <= 4400) {
            subsidioMCMV = Math.max(0, 55000 - ((renda - 2640) * 15));
        }
    }

    if (valorImovel <= TETO_CASA_PAULISTA && renda <= 4400) {
        subsidioCasaPaulista = 13000;
    }

    const subsidioTotal = subsidioMCMV + subsidioCasaPaulista;

    const financiamentoMaxImovel = valorImovel * 0.80;
    const financiamentoPelaRenda = (parcelaMaxima * (1 - Math.pow(1 + 0.007, -prazoMeses))) / 0.007;
    
    const valorFinanciado = Math.min(financiamentoMaxImovel, financiamentoPelaRenda);
    const entradaNecessaria = Math.max(0, valorImovel - valorFinanciado - subsidioTotal);

    return res.status(200).json({
        sucesso: true,
        resumo: {
            modalidade: valorImovel <= TETO_MCMV_SP ? "Minha Casa Minha Vida / Casa Paulista" : "Financiamento SBPE (Caixa / Bancos)",
            prazoMeses: prazoMeses,
            parcelaInicialEstimada: parcelaMaxima,
            valorFinanciado: valorFinanciado,
            subsidioTotal: subsidioTotal,
            entradaEstimada: entradaNecessaria
        }
    });
}
