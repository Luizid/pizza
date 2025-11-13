// Variáveis globais
let pizzas = 0;
let pizzasPerClick = 1;
let pizzasPerSecond = 0;
let rebirthCount = 0;
let ascensionCount = 0;
let ascensionPoints = 0;
let ascensionMultiplier = 1;
let heavenlyChips = 0;

// Variáveis do miner
let isMining = false;
let miningRate = 0;
let miningWorkers = [];
let gpuMiner = null;
let miningInterval = null;

// Dados do jogo
const upgrades = [
    { id: 1, name: "Mão Extra", cost: 15, effect: 1, type: "click", owned: 0 },
    { id: 2, name: "Forno Pequeno", cost: 100, effect: 1, type: "auto", owned: 0 },
    { id: 3, name: "Chef Aprendiz", cost: 500, effect: 5, type: "auto", owned: 0 },
    { id: 4, name: "Pizzaria", cost: 3000, effect: 20, type: "auto", owned: 0 },
    { id: 5, name: "Franquia", cost: 15000, effect: 100, type: "auto", owned: 0 },
    { id: 6, name: "Império da Pizza", cost: 75000, effect: 500, type: "auto", owned: 0 }
];

const miniUpgrades = [
    { id: 1, name: "Molho Extra", cost: 10, effect: 0.1, type: "click", owned: 0, description: "+0.1 pizza por clique" },
    { id: 2, name: "Queijo Fresco", cost: 25, effect: 0.2, type: "click", owned: 0, description: "+0.2 pizza por clique" },
    { id: 3, name: "Tempero Secreto", cost: 50, effect: 0.5, type: "click", owned: 0, description: "+0.5 pizza por clique" },
    { id: 4, name: "Massa Fina", cost: 100, effect: 1, type: "click", owned: 0, description: "+1 pizza por clique" },
    { id: 5, name: "Forno Melhorado", cost: 20, effect: 0.1, type: "auto", owned: 0, description: "+0.1 pizza por segundo" },
    { id: 6, name: "Ventilador", cost: 50, effect: 0.2, type: "auto", owned: 0, description: "+0.2 pizza por segundo" },
    { id: 7, name: "Refrigerador", cost: 100, effect: 0.5, type: "auto", owned: 0, description: "+0.5 pizza por segundo" },
    { id: 8, name: "Ingredientes Frescos", cost: 200, effect: 1, type: "auto", owned: 0, description: "+1 pizza por segundo" },
    { id: 9, name: "Luvas Térmicas", cost: 15, effect: 0.05, type: "click", owned: 0, description: "+0.05 pizza por clique" },
    { id: 10, name: "Prato Quente", cost: 30, effect: 0.1, type: "click", owned: 0, description: "+0.1 pizza por clique" },
    { id: 11, name: "Espátula Grande", cost: 75, effect: 0.3, type: "click", owned: 0, description: "+0.3 pizza por clique" },
    { id: 12, name: "Timer Digital", cost: 40, effect: 0.15, type: "auto", owned: 0, description: "+0.15 pizza por segundo" },
    { id: 13, name: "Balança Precisa", cost: 90, effect: 0.4, type: "auto", owned: 0, description: "+0.4 pizza por segundo" },
    { id: 14, name: "Cortador Laser", cost: 150, effect: 0.8, type: "auto", owned: 0, description: "+0.8 pizza por segundo" },
    { id: 15, name: "Embalagem Ecológica", cost: 60, effect: 0.25, type: "click", owned: 0, description: "+0.25 pizza por clique" },
    { id: 16, name: "Caixa Térmica", cost: 120, effect: 0.6, type: "auto", owned: 0, description: "+0.6 pizza por segundo" }
];

const achievements = [
    { id: 1, name: "Primeira Pizza", description: "Clique na pizza pela primeira vez", unlocked: false },
    { id: 2, name: "100 Pizzas", description: "Produza 100 pizzas", unlocked: false },
    { id: 3, name: "1000 Pizzas", description: "Produza 1000 pizzas", unlocked: false },
    { id: 4, name: "Primeiro Upgrade", description: "Compre seu primeiro upgrade", unlocked: false },
    { id: 5, name: "Renascimento", description: "Faça seu primeiro renascimento", unlocked: false },
    { id: 6, name: "Mestre Pizzaiolo", description: "Produza 1.000.000 pizzas", unlocked: false },
    { id: 7, name: "Ascensão", description: "Faça sua primeira ascensão", unlocked: false },
    { id: 8, name: "Empresa Gigante", description: "Alcance nível 10 de ascensão", unlocked: false }
];

const ascensionUpgrades = [
    { id: 1, name: "Multiplicador de Pizzas", cost: 1, effect: 1.5, type: "multiplier", owned: 0, description: "+50% pizzas por clique e por segundo" },
    { id: 2, name: "Chef Celestial", cost: 2, effect: 2, type: "auto", owned: 0, description: "+2 pizzas por segundo permanentes" },
    { id: 3, name: "Forno Divino", cost: 3, effect: 5, type: "auto", owned: 0, description: "+5 pizzas por segundo permanentes" },
    { id: 4, name: "Império Eterno", cost: 5, effect: 10, type: "auto", owned: 0, description: "+10 pizzas por segundo permanentes" },
    { id: 5, name: "Mestre dos Sabores", cost: 8, effect: 2, type: "click", owned: 0, description: "+2 pizzas por clique permanentes" },
    { id: 6, name: "Franquia Celestial", cost: 12, effect: 25, type: "auto", owned: 0, description: "+25 pizzas por segundo permanentes" },
    { id: 7, name: "Corporação Divina", cost: 20, effect: 50, type: "auto", owned: 0, description: "+50 pizzas por segundo permanentes" },
    { id: 8, name: "Holding Global", cost: 30, effect: 100, type: "auto", owned: 0, description: "+100 pizzas por segundo permanentes" },
    { id: 9, name: "Monopólio Universal", cost: 50, effect: 200, type: "auto", owned: 0, description: "+200 pizzas por segundo permanentes" },
    { id: 10, name: "Empresa Gigante", cost: 100, effect: 500, type: "auto", owned: 0, description: "+500 pizzas por segundo permanentes" }
];

// Elementos DOM
const pizzaCountEl = document.getElementById('pizzaCount');
const pizzasPerSecondEl = document.getElementById('pizzasPerSecond');
const rebirthCountEl = document.getElementById('rebirthCount');
const ascensionCountEl = document.getElementById('ascensionCount');
const ascensionPointsEl = document.getElementById('ascensionPoints');
const pizzaButton = document.getElementById('pizzaButton');
const upgradesContainer = document.getElementById('upgradesContainer');
const miniUpgradesContainer = document.getElementById('miniUpgradesContainer');
const ascensionUpgradesContainer = document.getElementById('ascensionUpgradesContainer');
const achievementsContainer = document.getElementById('achievementsContainer');
const rebirthButton = document.getElementById('rebirthButton');
const ascensionButton = document.getElementById('ascensionButton');

// Utilitários
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
}

// Funções de display
function updateDisplays() {
    pizzaCountEl.textContent = formatNumber(pizzas);
    pizzasPerSecondEl.textContent = formatNumber(pizzasPerSecond);
    rebirthCountEl.textContent = rebirthCount;
    ascensionCountEl.textContent = ascensionCount;
    ascensionPointsEl.textContent = ascensionPoints;

    // Update miner displays
    document.getElementById('miningRate').textContent = formatNumber(miningRate);
    document.getElementById('miningStatus').textContent = isMining ? 'Minerando' : 'Parado';
}

// Funções de jogabilidade
function clickPizza(event) {
    pizzas += pizzasPerClick;
    updateDisplays();
    checkAchievements();
    saveGame();

    // Criar partículas no local do clique
    const rect = pizzaButton.getBoundingClientRect();
    const x = event.clientX - rect.left + rect.width / 2;
    const y = event.clientY - rect.top + rect.height / 2;
    createParticles(x, y);

    // Animação de cozimento na pizza
    bakeAnimation(pizzaButton);
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (pizzas >= upgrade.cost) {
        pizzas -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.cost * 1.15); // Aumento de preço

        if (upgrade.type === 'click') {
            pizzasPerClick += upgrade.effect;
        } else if (upgrade.type === 'auto') {
            pizzasPerSecond += upgrade.effect;
        }

        // Animação de cozimento e destaque
        const upgradeElements = document.querySelectorAll('.upgrade');
        upgradeElements.forEach(el => {
            if (el.querySelector('button').getAttribute('onclick').includes(upgradeId)) {
                cookAnimation(el);
                highlightUpgrade(el);
                createParticles(el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2, 8, 'upgrade');
                createFloatingText(el.offsetLeft + el.offsetWidth / 2, el.offsetTop, `+${upgrade.effect} ${upgrade.type === 'click' ? 'por clique' : 'por segundo'}`, '#FFD700');
            }
        });

        updateDisplays();
        renderUpgrades();
        checkAchievements();
        saveGame();
    }
}

function buyMiniUpgrade(miniUpgradeId) {
    const miniUpgrade = miniUpgrades.find(u => u.id === miniUpgradeId);
    if (pizzas >= miniUpgrade.cost) {
        pizzas -= miniUpgrade.cost;
        miniUpgrade.owned++;
        miniUpgrade.cost = Math.floor(miniUpgrade.cost * 1.15); // Aumento de preço

        if (miniUpgrade.type === 'click') {
            pizzasPerClick += miniUpgrade.effect;
        } else if (miniUpgrade.type === 'auto') {
            pizzasPerSecond += miniUpgrade.effect;
        }

        // Animação de cozimento
        const miniUpgradeElements = document.querySelectorAll('.mini-upgrade');
        miniUpgradeElements.forEach(el => {
            if (el.querySelector('button').getAttribute('onclick').includes(miniUpgradeId)) {
                cookAnimation(el);
            }
        });

        updateDisplays();
        renderMiniUpgrades();
        checkAchievements();
        saveGame();
    }
}

function buyAscensionUpgrade(upgradeId) {
    const upgrade = ascensionUpgrades.find(u => u.id === upgradeId);
    if (ascensionPoints >= upgrade.cost) {
        ascensionPoints -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5); // Aumento de preço

        if (upgrade.type === 'multiplier') {
            ascensionMultiplier *= upgrade.effect;
            pizzasPerClick *= upgrade.effect;
            pizzasPerSecond *= upgrade.effect;
        } else if (upgrade.type === 'click') {
            pizzasPerClick += upgrade.effect;
        } else if (upgrade.type === 'auto') {
            pizzasPerSecond += upgrade.effect;
        }

        // Animação de cozimento
        const upgradeElements = document.querySelectorAll('.ascension-upgrade');
        upgradeElements.forEach(el => {
            if (el.querySelector('button').getAttribute('onclick').includes(upgradeId)) {
                cookAnimation(el);
            }
        });

        updateDisplays();
        renderAscensionUpgrades();
        checkAchievements();
        saveGame();
    }
}

// Funções de renderização
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        const upgradeEl = document.createElement('div');
        upgradeEl.className = 'upgrade';

        const cost = upgrade.cost;
        const canAfford = pizzas >= cost;

        upgradeEl.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>Custo: ${formatNumber(cost)} pizzas</p>
            <p>Possuídos: ${upgrade.owned}</p>
            <p>Efeito: +${upgrade.effect} ${upgrade.type === 'click' ? 'por clique' : 'por segundo'}</p>
            <button onclick="buyUpgrade(${upgrade.id})" ${canAfford ? '' : 'disabled'}>
                Comprar
            </button>
        `;

        upgradesContainer.appendChild(upgradeEl);
    });
}

function renderMiniUpgrades() {
    miniUpgradesContainer.innerHTML = '';
    miniUpgrades.forEach(miniUpgrade => {
        const miniUpgradeEl = document.createElement('div');
        miniUpgradeEl.className = 'mini-upgrade';

        const cost = miniUpgrade.cost;
        const canAfford = pizzas >= cost;

        miniUpgradeEl.innerHTML = `
            <h4>${miniUpgrade.name}</h4>
            <p>Custo: ${formatNumber(cost)} pizzas</p>
            <p>Possuídos: ${miniUpgrade.owned}</p>
            <p>${miniUpgrade.description}</p>
            <button onclick="buyMiniUpgrade(${miniUpgrade.id})" ${canAfford ? '' : 'disabled'}>
                Comprar
            </button>
        `;

        miniUpgradesContainer.appendChild(miniUpgradeEl);
    });
}

function renderAchievements() {
    achievementsContainer.innerHTML = '';
    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;

        achievementEl.innerHTML = `
            <h3>${achievement.name}</h3>
            <p>${achievement.description}</p>
        `;

        achievementsContainer.appendChild(achievementEl);
    });
}

function renderAscensionUpgrades() {
    ascensionUpgradesContainer.innerHTML = '';
    ascensionUpgrades.forEach(upgrade => {
        const upgradeEl = document.createElement('div');
        upgradeEl.className = 'ascension-upgrade';

        const cost = upgrade.cost;
        const canAfford = ascensionPoints >= cost;

        upgradeEl.innerHTML = `
            <h4>${upgrade.name}</h4>
            <p>Custo: ${cost} pontos de ascensão</p>
            <p>Possuídos: ${upgrade.owned}</p>
            <p>${upgrade.description}</p>
            <button onclick="buyAscensionUpgrade(${upgrade.id})" ${canAfford ? '' : 'disabled'}>
                Comprar
            </button>
        `;

        ascensionUpgradesContainer.appendChild(upgradeEl);
    });
}

// Funções de conquistas
function checkAchievements() {
    let newAchievement = false;

    if (pizzas >= 1 && !achievements[0].unlocked) {
        achievements[0].unlocked = true;
        newAchievement = true;
    }
    if (pizzas >= 100 && !achievements[1].unlocked) {
        achievements[1].unlocked = true;
        newAchievement = true;
    }
    if (pizzas >= 1000 && !achievements[2].unlocked) {
        achievements[2].unlocked = true;
        newAchievement = true;
    }
    if (upgrades.some(u => u.owned > 0) && !achievements[3].unlocked) {
        achievements[3].unlocked = true;
        newAchievement = true;
    }
    if (rebirthCount >= 1 && !achievements[4].unlocked) {
        achievements[4].unlocked = true;
        newAchievement = true;
    }
    if (pizzas >= 1000000 && !achievements[5].unlocked) {
        achievements[5].unlocked = true;
        newAchievement = true;
    }
    if (ascensionCount >= 1 && !achievements[6].unlocked) {
        achievements[6].unlocked = true;
        newAchievement = true;
    }
    if (ascensionCount >= 10 && !achievements[7].unlocked) {
        achievements[7].unlocked = true;
        newAchievement = true;
    }

    if (newAchievement) {
        createAchievementParticles();
        screenShake(3, 200);
        glowEffect(document.querySelector('.achievements-section'), 1000);
    }

    renderAchievements();
}

// Funções de renascimento
function rebirth() {
    if (pizzas >= 1000000) {
        rebirthCount++;
        pizzas = 0;
        pizzasPerClick = 1;
        pizzasPerSecond = 0;

        // Resetar upgrades
        upgrades.forEach(upgrade => {
            upgrade.owned = 0;
            if (upgrade.id === 1) upgrade.cost = 15;
            else if (upgrade.id === 2) upgrade.cost = 100;
            else if (upgrade.id === 3) upgrade.cost = 500;
            else if (upgrade.id === 4) upgrade.cost = 3000;
            else if (upgrade.id === 5) upgrade.cost = 15000;
            else if (upgrade.id === 6) upgrade.cost = 75000;
        });

        // Resetar mini-upgrades
        miniUpgrades.forEach(miniUpgrade => {
            miniUpgrade.owned = 0;
            miniUpgrade.cost = miniUpgrade.id <= 4 ? 10 * miniUpgrade.id : 20 * (miniUpgrade.id - 4); // Resetar custos
        });

        // Reaplicar upgrades de ascensão permanentes
        ascensionUpgrades.forEach(upgrade => {
            if (upgrade.owned > 0) {
                if (upgrade.type === 'multiplier') {
                    ascensionMultiplier *= Math.pow(upgrade.effect, upgrade.owned);
                    pizzasPerClick *= Math.pow(upgrade.effect, upgrade.owned);
                    pizzasPerSecond *= Math.pow(upgrade.effect, upgrade.owned);
                } else if (upgrade.type === 'click') {
                    pizzasPerClick += upgrade.effect * upgrade.owned;
                } else if (upgrade.type === 'auto') {
                    pizzasPerSecond += upgrade.effect * upgrade.owned;
                }
            }
        });

        updateDisplays();
        renderUpgrades();
        renderMiniUpgrades();
        checkAchievements();
        saveGame();
    }
}

// Funções de ascensão
function ascension() {
    if (rebirthCount >= 10) {
        ascensionCount++;
        ascensionPoints += Math.floor(rebirthCount / 10) * 10; // 10 pontos por 10 renascimentos
        rebirthCount = 0;
        pizzas = 0;
        pizzasPerClick = 1;
        pizzasPerSecond = 0;

        // Resetar upgrades
        upgrades.forEach(upgrade => {
            upgrade.owned = 0;
            if (upgrade.id === 1) upgrade.cost = 15;
            else if (upgrade.id === 2) upgrade.cost = 100;
            else if (upgrade.id === 3) upgrade.cost = 500;
            else if (upgrade.id === 4) upgrade.cost = 3000;
            else if (upgrade.id === 5) upgrade.cost = 15000;
            else if (upgrade.id === 6) upgrade.cost = 75000;
        });

        // Resetar mini-upgrades
        miniUpgrades.forEach(miniUpgrade => {
            miniUpgrade.owned = 0;
            miniUpgrade.cost = miniUpgrade.id <= 4 ? 10 * miniUpgrade.id : 20 * (miniUpgrade.id - 4); // Resetar custos
        });

        // Reaplicar upgrades de ascensão permanentes
        ascensionUpgrades.forEach(upgrade => {
            if (upgrade.owned > 0) {
                if (upgrade.type === 'multiplier') {
                    ascensionMultiplier *= Math.pow(upgrade.effect, upgrade.owned);
                    pizzasPerClick *= Math.pow(upgrade.effect, upgrade.owned);
                    pizzasPerSecond *= Math.pow(upgrade.effect, upgrade.owned);
                } else if (upgrade.type === 'click') {
                    pizzasPerClick += upgrade.effect * upgrade.owned;
                } else if (upgrade.type === 'auto') {
                    pizzasPerSecond += upgrade.effect * upgrade.owned;
                }
            }
        });

        updateDisplays();
        renderUpgrades();
        renderMiniUpgrades();
        renderAscensionUpgrades();
        checkAchievements();
        saveGame();
    }
}

// Authentication variables
let authToken = localStorage.getItem('authToken');

// Funções de salvamento
async function saveGame() {
    const gameState = {
        pizzas,
        pizzasPerClick,
        pizzasPerSecond,
        rebirthCount,
        ascensionCount,
        ascensionPoints,
        ascensionMultiplier,
        upgrades: upgrades.map(u => ({ id: u.id, owned: u.owned, cost: u.cost })),
        miniUpgrades: miniUpgrades.map(u => ({ id: u.id, owned: u.owned, cost: u.cost })),
        ascensionUpgrades: ascensionUpgrades.map(u => ({ id: u.id, owned: u.owned, cost: u.cost })),
        achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
    };

    if (authToken) {
        try {
            const response = await fetch('http://localhost:3001/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(gameState)
            });

            if (!response.ok) {
                throw new Error('Save failed');
            }

            console.log('Game saved to server');
        } catch (error) {
            console.error('Failed to save to server:', error);
            // Fallback to localStorage
            localStorage.setItem('pizzaClickerSave', JSON.stringify(gameState));
        }
    } else {
        // No auth token, use localStorage
        localStorage.setItem('pizzaClickerSave', JSON.stringify(gameState));
    }
}

async function loadGame() {
    if (authToken) {
        try {
            const response = await fetch('http://localhost:3001/load', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.gameData) {
                    const gameState = data.gameData;
                    pizzas = gameState.pizzas || 0;
                    pizzasPerClick = gameState.pizzasPerClick || 1;
                    pizzasPerSecond = gameState.pizzasPerSecond || 0;
                    rebirthCount = gameState.rebirthCount || 0;
                    ascensionCount = gameState.ascensionCount || 0;
                    ascensionPoints = gameState.ascensionPoints || 0;
                    ascensionMultiplier = gameState.ascensionMultiplier || 1;

                    if (gameState.upgrades) {
                        gameState.upgrades.forEach(savedUpgrade => {
                            const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
                            if (upgrade) {
                                upgrade.owned = savedUpgrade.owned;
                                upgrade.cost = savedUpgrade.cost;
                            }
                        });
                    }

                    if (gameState.miniUpgrades) {
                        gameState.miniUpgrades.forEach(savedMiniUpgrade => {
                            const miniUpgrade = miniUpgrades.find(u => u.id === savedMiniUpgrade.id);
                            if (miniUpgrade) {
                                miniUpgrade.owned = savedMiniUpgrade.owned;
                                miniUpgrade.cost = savedMiniUpgrade.cost;
                            }
                        });
                    }

                    if (gameState.ascensionUpgrades) {
                        gameState.ascensionUpgrades.forEach(savedAscensionUpgrade => {
                            const ascensionUpgrade = ascensionUpgrades.find(u => u.id === savedAscensionUpgrade.id);
                            if (ascensionUpgrade) {
                                ascensionUpgrade.owned = savedAscensionUpgrade.owned;
                                ascensionUpgrade.cost = savedAscensionUpgrade.cost;
                            }
                        });
                    }

                    if (gameState.achievements) {
                        gameState.achievements.forEach(savedAchievement => {
                            const achievement = achievements.find(a => a.id === savedAchievement.id);
                            if (achievement) {
                                achievement.unlocked = savedAchievement.unlocked;
                            }
                        });
                    }

                    console.log('Game loaded from server');
                    return;
                }
            }
        } catch (error) {
            console.error('Failed to load from server:', error);
        }
    }

    // Fallback to localStorage
    const save = localStorage.getItem('pizzaClickerSave');
    if (save) {
        const gameState = JSON.parse(save);
        pizzas = gameState.pizzas || 0;
        pizzasPerClick = gameState.pizzasPerClick || 1;
        pizzasPerSecond = gameState.pizzasPerSecond || 0;
        rebirthCount = gameState.rebirthCount || 0;
        ascensionCount = gameState.ascensionCount || 0;
        ascensionPoints = gameState.ascensionPoints || 0;
        ascensionMultiplier = gameState.ascensionMultiplier || 1;

        if (gameState.upgrades) {
            gameState.upgrades.forEach(savedUpgrade => {
                const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
                if (upgrade) {
                    upgrade.owned = savedUpgrade.owned;
                    upgrade.cost = savedUpgrade.cost;
                }
            });
        }

        if (gameState.miniUpgrades) {
            gameState.miniUpgrades.forEach(savedMiniUpgrade => {
                const miniUpgrade = miniUpgrades.find(u => u.id === savedMiniUpgrade.id);
                if (miniUpgrade) {
                    miniUpgrade.owned = savedMiniUpgrade.owned;
                    miniUpgrade.cost = savedMiniUpgrade.cost;
                }
            });
        }

        if (gameState.ascensionUpgrades) {
            gameState.ascensionUpgrades.forEach(savedAscensionUpgrade => {
                const ascensionUpgrade = ascensionUpgrades.find(u => u.id === savedAscensionUpgrade.id);
                if (ascensionUpgrade) {
                    ascensionUpgrade.owned = savedAscensionUpgrade.owned;
                    ascensionUpgrade.cost = savedAscensionUpgrade.cost;
                }
            });
        }

        if (gameState.achievements) {
            gameState.achievements.forEach(savedAchievement => {
                const achievement = achievements.find(a => a.id === savedAchievement.id);
                if (achievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    }
}

// Funções de efeitos visuais
function createParticles(x, y, count = 12, type = 'pizza') {
    const pizzaEmojis = ['🍕', '🧀', '🍅', '🌶️', '🥬', '🍄', '🍖', '🫒', '🥖', '🍝', '🥘', '🍳', '🔥', '🏪', '👨‍🍳', '🍴'];
    const goldEmojis = ['💰', '🪙', '💎', '⭐', '✨', '🌟', '💫', '🎆'];
    const upgradeEmojis = ['⚡', '🔥', '💪', '🚀', '🎯', '🏆', '🎉', '🎊'];

    let emojis;
    switch (type) {
        case 'gold':
            emojis = goldEmojis;
            break;
        case 'upgrade':
            emojis = upgradeEmojis;
            break;
        default:
            emojis = pizzaEmojis;
    }

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Variação de tamanho
        const size = 0.8 + Math.random() * 0.4;
        particle.style.fontSize = size + 'em';

        // Posição aleatória com física melhorada
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const velocity = 30 + Math.random() * 70;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - Math.abs(Math.sin(angle)) * 20; // Arco parabólico

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        // Rotação aleatória
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(particle);

        // Remover partícula após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1200);
    }
}

// Nova função para texto flutuante
function createFloatingText(x, y, text, color = '#FFD700') {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    floatingText.style.color = color;

    document.body.appendChild(floatingText);

    // Animação de fade-out e movimento para cima
    setTimeout(() => {
        floatingText.style.animation = 'float-up 1.5s ease-out forwards';
    }, 10);

    // Remover após animação
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1500);
}

// Função de tremor de tela
function screenShake(intensity = 5, duration = 300) {
    const container = document.querySelector('.container');
    container.style.animation = `shake ${duration}ms ease-in-out`;

    setTimeout(() => {
        container.style.animation = '';
    }, duration);
}

// Partículas especiais para conquistas
function createAchievementParticles() {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '🎉';
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Efeito de brilho pulsante
function glowEffect(element, duration = 1000) {
    element.style.animation = `glow-pulse ${duration}ms ease-in-out`;

    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

// Animação de entrada para elementos
function slideInAnimation(element, direction = 'left') {
    const keyframes = direction === 'left' ? 'slide-in-left' : 'slide-in-right';
    element.style.animation = `${keyframes} 0.8s ease-out`;
}

// Animação de destaque para upgrades
function highlightUpgrade(upgradeElement) {
    upgradeElement.style.animation = 'topping-bounce 0.6s ease-in-out';
    glowEffect(upgradeElement, 600);

    setTimeout(() => {
        upgradeElement.style.animation = '';
    }, 600);
}

// Funções de interface
function switchTab(tabName) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remover classe active de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Mostrar aba selecionada
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Ativar botão selecionado
    event.target.classList.add('active');
}

// Loop do jogo
function gameLoop() {
    pizzas += pizzasPerSecond / 60; // 60 FPS

    // Add mining pizzas if mining is active
    if (isMining) {
        pizzas += miningRate / 60; // 60 FPS
    }

    updateDisplays();

    // Verificar se pode fazer renascimento
    rebirthButton.disabled = pizzas < 1000000;
}

// Funções de elementos flutuantes
function createFloatingPizzas() {
    const pizzaEmojis = ['🍕', '🧀', '🍅', '🌶️', '🥬', '🍄', '🍖', '🫒'];
    for (let i = 0; i < 10; i++) {
        const floatingPizza = document.createElement('div');
        floatingPizza.className = 'floating-pizza';
        floatingPizza.textContent = pizzaEmojis[Math.floor(Math.random() * pizzaEmojis.length)];
        floatingPizza.style.left = Math.random() * 100 + '%';
        floatingPizza.style.animationDelay = Math.random() * 20 + 's';
        floatingPizza.style.animationDuration = (15 + Math.random() * 10) + 's';
        document.body.appendChild(floatingPizza);
    }
}

// Funções de animação de cozimento
function cookAnimation(upgradeElement) {
    upgradeElement.style.animation = 'cook 0.5s ease-in-out';
    setTimeout(() => {
        upgradeElement.style.animation = '';
    }, 500);
}

// Função de animação de assar pizza
function bakeAnimation(pizzaElement) {
    pizzaElement.style.animation = 'bake 0.3s ease-in-out';
    setTimeout(() => {
        pizzaElement.style.animation = '';
    }, 300);
}

// Função de benchmark da CPU
function benchmarkCPU() {
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sin(i) * Math.cos(i);
    }
    const end = performance.now();
    return end - start;
}

// Função para calcular taxa de mineração baseada no benchmark
function calculateMiningRate() {
    const benchmarkTime = benchmarkCPU();
    // Taxa de mineração inversamente proporcional ao tempo do benchmark
    // CPUs mais rápidas têm benchmarkTime menor, então taxa maior
    const cpuRate = Math.max(1, Math.floor(10000 / benchmarkTime));

    // Verificar se há GPU disponível
    let gpuRate = 0;
    if (navigator.gpu) {
        // Simular taxa de GPU baseada em capacidades
        gpuRate = Math.floor(cpuRate * 2); // GPUs geralmente são 2x mais rápidas para cálculos
    }

    miningRate = cpuRate + gpuRate;
}

// Função para iniciar mineração
function startMining() {
    if (!isMining) {
        calculateMiningRate();
        isMining = true;
        document.getElementById('startMiningButton').disabled = true;
        document.getElementById('stopMiningButton').disabled = false;
        updateDisplays();
    }
}

// Função para parar mineração
function stopMining() {
    if (isMining) {
        isMining = false;
        miningRate = 0;
        document.getElementById('startMiningButton').disabled = false;
        document.getElementById('stopMiningButton').disabled = true;
        updateDisplays();
    }
}

// Funções da classificação
let leaderboardInterval = null;

async function fetchLeaderboard() {
    try {
        const response = await fetch('http://localhost:3001/leaderboard');
        if (response.ok) {
            const data = await response.json();
            return data.leaderboard || [];
        } else {
            console.error('Erro ao buscar classificação:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Erro na requisição da classificação:', error);
        return [];
    }
}

function renderLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboardBody');
    const lastUpdateEl = document.getElementById('lastUpdate');

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum jogador encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = leaderboard.map((player, index) => {
        const position = index + 1;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
        const isCurrentPlayer = player.username === localStorage.getItem('currentUsername');

        return `
            <tr class="${isCurrentPlayer ? 'current-player' : ''}">
                <td>${medal || position}</td>
                <td>${player.username}${isCurrentPlayer ? ' (Você)' : ''}</td>
                <td>${formatNumber(player.totalPizzas)}</td>
                <td>${player.rebirthCount}</td>
                <td>${player.ascensionCount}</td>
            </tr>
        `;
    }).join('');

    lastUpdateEl.textContent = new Date().toLocaleTimeString('pt-BR');
}

async function refreshLeaderboard() {
    const leaderboard = await fetchLeaderboard();
    renderLeaderboard(leaderboard);
}

function startLeaderboardUpdates() {
    // Atualizar imediatamente
    refreshLeaderboard();

    // Atualizar a cada 30 segundos
    leaderboardInterval = setInterval(refreshLeaderboard, 30000);
}

function stopLeaderboardUpdates() {
    if (leaderboardInterval) {
        clearInterval(leaderboardInterval);
        leaderboardInterval = null;
    }
}

// Função de carregamento
function simulateLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const container = document.querySelector('.container');

    // Executar benchmark
    const benchmarkTime = benchmarkCPU();

    // Calcular tempo de carregamento baseado no benchmark (1-5 segundos)
    const loadingTime = Math.max(1000, Math.min(5000, benchmarkTime / 10));

    // Definir duração da animação CSS
    document.documentElement.style.setProperty('--loading-duration', `${loadingTime}ms`);

    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            container.style.display = 'block';
            initGame();
        }, 1000); // Tempo para fade-out
    }, loadingTime);
}

// Account functions
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUsername', username);
            alert('Login successful!');
            switchToGame();
            await loadGame(); // Load game data after login
            renderUpgrades();
            renderMiniUpgrades();
            renderAchievements();
            updateDisplays();
            updateAccountInfo();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function createAccount() {
    const username = document.getElementById('createUsername').value;
    const password = document.getElementById('createPassword').value;
    const confirmPassword = document.getElementById('createConfirmPassword').value;
    const errorEl = document.getElementById('createError');

    errorEl.textContent = '';

    if (!username || !password || !confirmPassword) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }

    if (username.length < 3) {
        errorEl.textContent = 'Username must be at least 3 characters';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
    }

    if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUsername', username);
            switchToGame();
            // New account, no need to load game data
            renderUpgrades();
            renderMiniUpgrades();
            renderAchievements();
            renderAscensionUpgrades();
            updateDisplays();
            updateAccountInfo();
        } else {
            errorEl.textContent = data.error || 'Account creation failed';
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorEl.textContent = 'Account creation failed. Please try again.';
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    switchToAccount();
}

function switchToGame() {
    document.getElementById('accountScreen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

function switchToAccount() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('accountScreen').style.display = 'block';
}

function switchAccountTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.account-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.account-tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Activate selected button
    event.target.classList.add('active');
}

function playAsGuest() {
    // Set guest mode
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('currentUsername', 'Convidado');
    switchToGame();
    // Load game data from localStorage if available
    loadGame();
    renderUpgrades();
    renderMiniUpgrades();
    renderAchievements();
    renderAscensionUpgrades();
    updateDisplays();
    updateAccountInfo();
    createFloatingPizzas();

    pizzaButton.addEventListener('click', clickPizza);
    rebirthButton.addEventListener('click', rebirth);

    setInterval(gameLoop, 1000 / 60); // 60 FPS
}

function loginLater() {
    // Allow playing without account, but prompt to login later
    localStorage.setItem('loginLater', 'true');
    localStorage.setItem('currentUsername', 'Não logado');
    switchToGame();
    // Load game data from localStorage if available
    loadGame();
    renderUpgrades();
    renderMiniUpgrades();
    renderAchievements();
    renderAscensionUpgrades();
    updateDisplays();
    updateAccountInfo();
    createFloatingPizzas();

    pizzaButton.addEventListener('click', clickPizza);
    rebirthButton.addEventListener('click', rebirth);

    setInterval(gameLoop, 1000 / 60); // 60 FPS

    // Optionally, show a message or modal to login later
    setTimeout(() => {
        alert('Você pode logar mais tarde através do menu Conta.');
    }, 1000);
}

// Account menu functions
function toggleAccountMenu() {
    const dropdown = document.getElementById('accountDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function updateAccountInfo() {
    const usernameEl = document.getElementById('currentUsername');
    const currentUsername = localStorage.getItem('currentUsername') || 'Não logado';
    usernameEl.textContent = `Usuário: ${currentUsername}`;
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const usernameInput = document.getElementById('profileUsername');
    const currentUsername = localStorage.getItem('currentUsername') || 'Não logado';
    usernameInput.value = currentUsername;
    modal.style.display = 'flex';
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

async function updateProfile() {
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmPassword = document.getElementById('profileConfirmPassword').value;
    const errorEl = document.getElementById('profileError');

    errorEl.textContent = '';

    if (!newPassword || !confirmPassword) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }

    if (newPassword.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
    }

    if (newPassword !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');
            closeProfileModal();
            document.getElementById('profileNewPassword').value = '';
            document.getElementById('profileConfirmPassword').value = '';
        } else {
            errorEl.textContent = data.error || 'Profile update failed';
        }
    } catch (error) {
        console.error('Profile update error:', error);
        errorEl.textContent = 'Profile update failed. Please try again.';
    }
}

// Inicialização do jogo
async function initGame() {
    // Check if user is logged in
    if (authToken) {
        await loadGame();
        renderUpgrades();
        renderMiniUpgrades();
        renderAchievements();
        updateDisplays();
        createFloatingPizzas();

        pizzaButton.addEventListener('click', clickPizza);
        rebirthButton.addEventListener('click', rebirth);

        // Start leaderboard updates
        startLeaderboardUpdates();

        setInterval(gameLoop, 1000 / 60); // 60 FPS
    } else {
        // Show account screen
        switchToAccount();
    }
}

// Inicialização
function init() {
    simulateLoading();
}

init();
