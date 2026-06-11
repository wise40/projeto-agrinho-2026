// Variáveis globais para os gráficos
let umidadeChart = null;
let reservatorioChart = null;

// Dados atuais dos sensores
let currentData = {
    umidadeSolo: 65,
    temperatura: 24,
    umidadeAr: 70,
    energiaSolar: 45,
    nivelReservatorios: [78, 65, 82, 45, 92],
    nomesReservatorios: ['Res. Norte', 'Res. Sul', 'Res. Leste', 'Res. Oeste', 'Res. Central']
};

// Histórico de umidade do solo (últimas 24 horas)
let umidadeHistorico = [62, 64, 63, 65, 66, 64, 63, 65, 67, 68, 66, 65, 64, 63, 65, 67, 69, 68, 67, 66, 65, 64, 65, 66];
let horas = Array.from({ length: 24 }, (_, i) => `${i}:00`);

// Dados de previsão do tempo
const previsoes = [
    { dia: 'Seg', temp: 26, cond: '☀️ Ensolarado', chuva: 0 },
    { dia: 'Ter', temp: 28, cond: '🌤️ Parcialmente Nublado', chuva: 10 },
    { dia: 'Qua', temp: 24, cond: '🌧️ Chuva Leve', chuva: 60 },
    { dia: 'Qui', temp: 22, cond: '🌧️ Chuva Moderada', chuva: 80 },
    { dia: 'Sex', temp: 25, cond: '⛅ Nublado', chuva: 30 }
];

// Estatísticas sustentáveis
let sustainStats = {
    aguaEconomizada: 12500,
    arvoresPlantadas: 156,
    energiaGerada: 3420,
    co2Evitado: 1850
};

// Função para gerar dados aleatórios realistas
function gerarDadosAleatorios() {
    const variacao = (valor, maxVariacao) => {
        const variacaoReal = (Math.random() - 0.5) * maxVariacao;
        let novoValor = valor + variacaoReal;
        return Math.max(0, Math.min(100, novoValor));
    };

    return {
        umidadeSolo: Math.floor(variacao(currentData.umidadeSolo, 15)),
        temperatura: Number((variacao(currentData.temperatura, 3)).toFixed(1)),
        umidadeAr: Math.floor(variacao(currentData.umidadeAr, 12)),
        energiaSolar: Math.floor(variacao(currentData.energiaSolar, 10)),
        nivelReservatorios: currentData.nivelReservatorios.map(val =>
            Math.floor(variacao(val, 8))
        ),
        npk: {
            nitrogenio: Math.floor(Math.random() * 80 + 20),
            fosforo: Math.floor(Math.random() * 60 + 15),
            potassio: Math.floor(Math.random() * 70 + 25)
        },
        bateria: Math.floor(Math.random() * 30 + 65)
    };
}

// Dados reais da fazenda (valores ideais)
function gerarDadosReais() {
    return {
        umidadeSolo: 72,
        temperatura: 23.5,
        umidadeAr: 68,
        energiaSolar: 78,
        nivelReservatorios: [85, 72, 88, 58, 94],
        npk: {
            nitrogenio: 65,
            fosforo: 48,
            potassio: 52
        },
        bateria: 92
    };
}

// Função para atualizar todos os cards de estatísticas
function atualizarCards(novosDados) {
    // Atualizar umidade do solo
    document.getElementById('umidadeValue').textContent = novosDados.umidadeSolo;
    const umidadeStatus = novosDados.umidadeSolo < 40 ? '⚠️ Baixa' :
        novosDados.umidadeSolo > 80 ? '💧 Alta' : '✅ Ideal';
    document.getElementById('umidadeStatus').textContent = umidadeStatus;

    // Atualizar temperatura
    document.getElementById('tempValue').textContent = novosDados.temperatura;
    const tempStatus = novosDados.temperatura > 30 ? '🔥 Alta' :
        novosDados.temperatura < 18 ? '❄️ Baixa' : '✅ Ideal';
    document.getElementById('tempStatus').textContent = tempStatus;

    // Atualizar umidade do ar
    document.getElementById('umidadeArValue').textContent = novosDados.umidadeAr;
    const umidadeArStatus = novosDados.umidadeAr < 40 ? '🌵 Seco' :
        novosDados.umidadeAr > 80 ? '💨 Úmido' : '✅ Confortável';
    document.getElementById('umidadeArStatus').textContent = umidadeArStatus;

    // Atualizar energia solar
    document.getElementById('energiaValue').textContent = novosDados.energiaSolar;
    const energiaStatus = novosDados.energiaSolar > 70 ? '⚡ Excelente' :
        novosDados.energiaSolar > 40 ? '🟡 Moderado' : '🔴 Baixo';
    document.getElementById('energiaStatus').textContent = energiaStatus;

    // Atualizar sensores NPK
    document.getElementById('nitrogenio').textContent = novosDados.npk.nitrogenio;
    document.getElementById('fosforo').textContent = novosDados.npk.fosforo;
    document.getElementById('potassio').textContent = novosDados.npk.potassio;

    // Atualizar bateria
    const bateria = novosDados.bateria;
    document.getElementById('bateriaBar').style.width = `${bateria}%`;
    document.getElementById('bateriaValue').textContent = `${bateria}%`;

    // Atualizar timestamp
    const agora = new Date();
    document.getElementById('ultimaAtualizacao').textContent =
        agora.toLocaleTimeString('pt-BR');
}

// Função para atualizar o gráfico de umidade do solo
function atualizarGraficoUmidade(novosDados) {
    // Adicionar novo dado ao histórico e remover o mais antigo
    umidadeHistorico.push(novosDados.umidadeSolo);
    if (umidadeHistorico.length > 24) {
        umidadeHistorico.shift();
    }

    if (umidadeChart) {
        umidadeChart.data.datasets[0].data = [...umidadeHistorico];
        umidadeChart.update();
    } else {
        // Criar gráfico
        const ctx = document.getElementById('umidadeChart').getContext('2d');
        umidadeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: horas,
                datasets: [{
                    label: 'Umidade do Solo (%)',
                    data: [...umidadeHistorico],
                    borderColor: '#00D2FF',
                    backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00FF88',
                    pointBorderColor: '#00D2FF',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1A5F7A',
                            font: { weight: 'bold' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Umidade: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Umidade (%)',
                            color: '#1A5F7A'
                        },
                        grid: {
                            color: 'rgba(26, 95, 122, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Horário',
                            color: '#1A5F7A'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            color: '#1A5F7A'
                        }
                    }
                }
            }
        });
    }

    // Atualizar insight
    const ultimaUmidade = umidadeHistorico[umidadeHistorico.length - 1];
    const mediaUmidade = umidadeHistorico.reduce((a, b) => a + b, 0) / umidadeHistorico.length;
    let insight = '';
    if (ultimaUmidade > mediaUmidade + 5) {
        insight = '⬆️ Umidade acima da média. Considere reduzir a irrigação para economizar água.';
    } else if (ultimaUmidade < mediaUmidade - 5) {
        insight = '⬇️ Umidade abaixo da média. Recomenda-se iniciar a irrigação em breve.';
    } else {
        insight = '✅ Umidade estável. Condições ideais para o desenvolvimento das culturas.';
    }
    document.getElementById('umidadeInsight').textContent = insight;
}

// Função para atualizar gráfico de reservatórios
function atualizarGraficoReservatorios(novosDados) {
    if (reservatorioChart) {
        reservatorioChart.data.datasets[0].data = [...novosDados.nivelReservatorios];
        reservatorioChart.update();
    } else {
        const ctx = document.getElementById('reservatorioChart').getContext('2d');
        reservatorioChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: currentData.nomesReservatorios,
                datasets: [{
                    label: 'Nível do Reservatório (%)',
                    data: [...novosDados.nivelReservatorios],
                    backgroundColor: [
                        'rgba(0, 210, 255, 0.7)',
                        'rgba(0, 200, 83, 0.7)',
                        'rgba(0, 210, 255, 0.7)',
                        'rgba(0, 200, 83, 0.7)',
                        'rgba(0, 210, 255, 0.7)'
                    ],
                    borderColor: [
                        '#00D2FF',
                        '#00C853',
                        '#00D2FF',
                        '#00C853',
                        '#00D2FF'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1A5F7A',
                            font: { weight: 'bold' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Nível: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Nível (%)',
                            color: '#1A5F7A'
                        },
                        grid: {
                            color: 'rgba(26, 95, 122, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#1A5F7A'
                        }
                    }
                }
            }
        });
    }

    // Atualizar insight dos reservatórios
    const mediaReservatorios = novosDados.nivelReservatorios.reduce((a, b) => a + b, 0) / novosDados.nivelReservatorios.length;
    const reservatorioBaixo = novosDados.nivelReservatorios.filter(n => n < 30).length;
    let insight = '';
    if (reservatorioBaixo > 0) {
        insight = `⚠️ Atenção! ${reservatorioBaixo} reservatório(s) com nível crítico. Priorize o uso de água dessas regiões.`;
    } else if (mediaReservatorios > 80) {
        insight = '💧 Reservatórios com ótimo nível de água. Capacidade garantida para os próximos dias.';
    } else if (mediaReservatorios < 50) {
        insight = '🌧️ Níveis moderados. Monitore o consumo e considere captação de água da chuva.';
    } else {
        insight = '✅ Níveis adequados. Abastecimento garantido para as operações agrícolas.';
    }
    document.getElementById('reservatorioInsight').textContent = insight;
}

// Função para atualizar a previsão do tempo
function atualizarPrevisaoTempo() {
    const weatherGrid = document.getElementById('weatherGrid');
    weatherGrid.innerHTML = '';

    previsoes.forEach(previsao => {
        const dayCard = document.createElement('div');
        dayCard.className = 'weather-day';
        dayCard.innerHTML = `
            <div class="day">${previsao.dia}</div>
            <div class="temp">${previsao.temp}°C</div>
            <div class="condition">${previsao.cond}</div>
            <div class="rain">🌧️ ${previsao.chuva}%</div>
        `;
        weatherGrid.appendChild(dayCard);
    });
}

// Função para atualizar estatísticas sustentáveis
function atualizarStatsSustentaveis() {
    document.getElementById('aguaEconomizada').textContent = sustainStats.aguaEconomizada.toLocaleString();
    document.getElementById('arvoresPlantadas').textContent = sustainStats.arvoresPlantadas.toLocaleString();
    document.getElementById('energiaGerada').textContent = sustainStats.energiaGerada.toLocaleString();
    document.getElementById('co2Evitado').textContent = sustainStats.co2Evitado.toLocaleString();
}

// Função principal para atualizar todos os dados
function atualizarTodosDados(novosDados) {
    // Atualizar dados atuais
    currentData.umidadeSolo = novosDados.umidadeSolo;
    currentData.temperatura = novosDados.temperatura;
    currentData.umidadeAr = novosDados.umidadeAr;
    currentData.energiaSolar = novosDados.energiaSolar;
    currentData.nivelReservatorios = [...novosDados.nivelReservatorios];

    // Atualizar componentes visuais
    atualizarCards(novosDados);
    atualizarGraficoUmidade(novosDados);
    atualizarGraficoReservatorios(novosDados);
}

// Função para simular novos dados
function simularNovosDados() {
    const novosDados = gerarDadosAleatorios();
    atualizarTodosDados(novosDados);

    // Atualizar estatísticas sustentáveis aleatoriamente
    sustainStats.aguaEconomizada += Math.floor(Math.random() * 500);
    sustainStats.arvoresPlantadas += Math.floor(Math.random() * 5);
    sustainStats.energiaGerada += Math.floor(Math.random() * 100);
    sustainStats.co2Evitado += Math.floor(Math.random() * 50);
    atualizarStatsSustentaveis();

    // Feedback visual
    const btn = document.getElementById('btnSimularDados');
    const originalText = btn.textContent;
    btn.textContent = '✅ Dados Atualizados!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
}

// Função para carregar dados reais da fazenda
function carregarDadosReais() {
    const novosDados = gerarDadosReais();
    atualizarTodosDados(novosDados);

    // Feedback visual
    const btn = document.getElementById('btnDadosReais');
    const originalText = btn.textContent;
    btn.textContent = '✅ Dados Reais Carregados!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
}

// Inicialização e Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    const dadosIniciais = gerarDadosReais();
    atualizarTodosDados(dadosIniciais);
    atualizarPrevisaoTempo();
    atualizarStatsSustentaveis();

    // Configurar event listeners
    document.getElementById('btnSimularDados').addEventListener('click', simularNovosDados);
    document.getElementById('btnDadosReais').addEventListener('click', carregarDadosReais);

    // Refresh buttons para os gráficos
    document.getElementById('refreshUmidade').addEventListener('click', () => {
        const novosDados = gerarDadosAleatorios();
        atualizarGraficoUmidade(novosDados);
    });

    document.getElementById('refreshReservatorios').addEventListener('click', () => {
        const novosDados = gerarDadosAleatorios();
        atualizarGraficoReservatorios(novosDados);
    });

    // Atualização automática a cada 30 segundos (opcional)
    let autoUpdateInterval = setInterval(() => {
        const novosDados = gerarDadosAleatorios();
        atualizarTodosDados(novosDados);
    }, 30000);

    // Limpar intervalo quando a página for fechada (opcional)
    window.addEventListener('beforeunload', () => {
        if (autoUpdateInterval) {
            clearInterval(autoUpdateInterval);
        }
    });

    console.log('✅ Dashboard Frutiger Aero inicializado com sucesso!');
});