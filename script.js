class PizzaClicker {
    constructor() {
        this.pizzas = 0;
this.tokens = 0; // New property to track tokens
this.tokenGenerationRate = 60; // Tokens earned per minute
        this.pps = 0;
        this.clickPowerLevels = [1, 2, 4, 8, 16]; // Define click power levels
        this.currentClickPowerLevel = 0; // Start at level 0
        this.clickPower = this.clickPowerLevels[this.currentClickPowerLevel]; // Set initial click power
        this.totalClicks = 0;
        this.totalPizzasEarned = 0;
        this.playTime = 0; // Initialize play time
        this.playerName = ''; // Add player name property
        this.pets = ['Cat', 'Dog', 'Pizza Monster', 'Dragon', 'Unicorn']; // Define pets that can be won
        
        this.upgrades = {
            cursor: {
                cost: 15,
                owned: 0,
                pps: 0.2,
                multiplier: 1.12
            },
            oven: {
                cost: 100,
                owned: 0,
                pps: 1,
                multiplier: 1.13
            },
            chef: {
                cost: 500,
                owned: 0,
                pps: 4,
                multiplier: 1.14
            },
            factory: {
                cost: 1200,
                owned: 0,
                pps: 10,
                multiplier: 1.15
            },
            portal: {
                cost: 5000,
                owned: 0,
                pps: 40,
                multiplier: 1.16
            },
            dimension: {
                cost: 20000,
                owned: 0,
                pps: 100,
                multiplier: 1.17
            },
            singularity: {
                cost: 100000,
                owned: 0,
                pps: 400,
                multiplier: 1.18
            }
        };

        this.achievements = {
            firstClick: {
                name: "Primeiros Passos",
                description: "Faça seu primeiro clique",
                unlocked: false,
                type: "click",
                requirement: 1
            },
            pizzaNovice: {
                name: "Aprendiz de Pizza",
                description: "Alcance 100 pizzas",
                unlocked: false,
                type: "pizza",
                requirement: 100
            },
            pizzaMaster: {
                name: "Mestre das Pizzas",
                description: "Alcance 1000 pizzas",
                unlocked: false,
                type: "pizza",
                requirement: 1000
            },
            pizzaLegend: {
                name: "Lenda da Pizza",
                description: "Alcance 10000 pizzas",
                unlocked: false,
                type: "pizza",
                requirement: 10000
            },
            factoryOwner: {
                name: "Fábrica em Ação",
                description: "Compre uma fábrica",
                unlocked: false,
                type: "upgrade",
                requirement: "factory"
            },
            portalMaster: {
                name: "Mestre do Portal",
                description: "Compre um portal",
                unlocked: false,
                type: "upgrade",
                requirement: "portal"
            },
            dimensionWalker: {
                name: "Andarilho Dimensional",
                description: "Compre uma dimensão",
                unlocked: false,
                type: "upgrade",
                requirement: "dimension"
            },
            singularityAchiever: {
                name: "Conquistador da Singularidade",
                description: "Compre uma singularidade",
                unlocked: false,
                type: "upgrade",
                requirement: "singularity"
            },
            clickMaster: {
                name: "Mestre dos Cliques",
                description: "Faça 100 cliques",
                unlocked: false,
                type: "totalClicks",
                requirement: 100
            },
            clickGod: {
                name: "Deus dos Cliques",
                description: "Faça 1000 cliques",
                unlocked: false,
                type: "totalClicks",
                requirement: 1000
            },
            timeTraveler: {
                name: "Viajante do Tempo",
                description: "Jogue por 1 hora",
                unlocked: false,
                type: "time",
                requirement: 3600
            },
            rebirthMaster: {
                name: "Renascido",
                description: "Complete um renascimento",
                unlocked: false,
                type: "rebirth",
                requirement: 1
            },
            rebirthExpert: {
                name: "Especialista em Renascimento",
                description: "Complete 5 renascimentos",
                unlocked: false,
                type: "rebirth",
                requirement: 5
            },
            rebirthLegend: {
                name: "Lenda do Renascimento",
                description: "Complete 10 renascimentos",
                unlocked: false,
                type: "rebirth",
                requirement: 10
            },
            upgradeCollector: {
                name: "Colecionador de Upgrades",
                description: "Possua 10 upgrades no total",
                unlocked: false,
                type: "totalUpgrades",
                requirement: 10
            },
            upgradeMaster: {
                name: "Mestre dos Upgrades",
                description: "Possua 50 upgrades no total",
                unlocked: false,
                type: "totalUpgrades",
                requirement: 50
            },
            ppsMaster: {
                name: "Mestre da Produção",
                description: "Alcance 100 PPS",
                unlocked: false,
                type: "pps",
                requirement: 100
            },
            ppsGod: {
                name: "Deus da Produção",
                description: "Alcance 1000 PPS",
                unlocked: false,
                type: "pps",
                requirement: 1000
            },
            tokenCollector: {
                name: "Colecionador de Tokens",
                description: "Ganhe 10 tokens",
                unlocked: false,
                type: "tokens",
                requirement: 10
            },
            tokenMaster: {
                name: "Mestre dos Tokens",
                description: "Ganhe 50 tokens",
                unlocked: false,
                type: "tokens",
                requirement: 50
            },
            tokenLegend: {
                name: "Lenda dos Tokens",
                description: "Ganhe 100 tokens",
                unlocked: false,
                type: "tokens",
                requirement: 100
            }
        };

        console.log("Game initialized!"); // Debug log
        console.log("Initializing game..."); // Debug log
        this.init();
    }

    init() {
        this.bindEvents();
        this.startGameLoop();
        this.loadGame();
    }

    bindEvents() {
        const pizza = document.getElementById('pizza');
        console.log("Binding click event to pizza element."); // Debug log
        pizza.addEventListener('click', () => this.clickPizza());
        
        // Bind upgrade clicks
        document.querySelectorAll('.upgrade').forEach(upgrade => {
            upgrade.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.upgrade;
                this.buyUpgrade(type);
            });
        });
    }

    clickPizza() {
        console.log("Pizza clicked!"); // Debug log
        // Additional debug log to check click power
        console.log(`Current click power: ${this.clickPower}`);
        this.pizzas += this.clickPower;
        this.totalClicks++;
        this.totalPizzasEarned += this.clickPower;
        
        this.updateDisplay();
        this.showFloatingPizza();
        this.animatePizzaClick();
        this.playClickSound();
        this.checkAchievements();
    }

    showFloatingPizza() {
        const floatingPizza = document.getElementById('floating-pizza');
        const pizza = document.getElementById('pizza');
        const rect = pizza.getBoundingClientRect();
        
        floatingPizza.style.left = rect.left + rect.width / 2 + 'px';
        floatingPizza.style.top = rect.top + 'px';
        floatingPizza.style.display = 'block';
        
        setTimeout(() => {
            floatingPizza.style.display = 'none';
        }, 1000);
    }

    animatePizzaClick() {
        const pizza = document.getElementById('pizza');
        pizza.classList.add('pizza-click-animation');
        setTimeout(() => {
            pizza.classList.remove('pizza-click-animation');
        }, 200);
    }

    animateUpgradePurchase(type) {
        const upgradeElement = document.querySelector(`[data-upgrade="${type}"]`);
        if (upgradeElement) {
            upgradeElement.classList.add('upgrade-purchase-animation');
            setTimeout(() => {
                upgradeElement.classList.remove('upgrade-purchase-animation');
            }, 500);
        }
    }

    playClickSound() {
        // Create a simple click sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    buyUpgrade(type) {
        const upgrade = this.upgrades[type];
        
        if (this.pizzas >= upgrade.cost) {
            this.pizzas -= upgrade.cost;
            upgrade.owned++;
            upgrade.cost = Math.floor(upgrade.cost * upgrade.multiplier);
            
            this.updatePPS();
            this.updateDisplay();
            this.saveGame();
            this.animateUpgradePurchase(type);
            this.checkAchievements();
        }
    }

    // Check achievements based on game state
    checkAchievements() {
        for (const [key, achievement] of Object.entries(this.achievements)) {
            if (!achievement.unlocked) {
                let conditionMet = false;
                
                switch (achievement.type) {
                    case "click":
                        conditionMet = this.totalClicks >= achievement.requirement;
                        break;
                    case "pizza":
                        conditionMet = this.pizzas >= achievement.requirement;
                        break;
                    case "upgrade":
                        conditionMet = this.upgrades[achievement.requirement].owned > 0;
                        break;
                    case "totalClicks":
                        conditionMet = this.totalClicks >= achievement.requirement;
                        break;
                    case "time":
                        conditionMet = this.playTime >= achievement.requirement;
                        break;
                    case "rebirth":
                        conditionMet = this.rebirthSystem && this.rebirthSystem.totalRebirths >= achievement.requirement;
                        break;
                    case "totalUpgrades":
                        const totalUpgrades = Object.values(this.upgrades).reduce((sum, upgrade) => sum + upgrade.owned, 0);
                        conditionMet = totalUpgrades >= achievement.requirement;
                        break;
                    case "pps":
                        conditionMet = this.pps >= achievement.requirement;
                        break;
                    case "tokens":
                        conditionMet = this.tokens >= achievement.requirement;
                        break;
                }
                
                if (conditionMet) {
                    this.unlockAchievement(key);
                }
            }
        }
    }

    // Unlock an achievement
    unlockAchievement(key) {
        const achievement = this.achievements[key];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievementNotification(achievement);
            this.updateAchievementsDisplay();
            this.saveGame();
        }
    }

    // Show achievement notification
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <span class="achievement-icon">🏆</span>
                <div class="achievement-notification-text">
                    <div class="achievement-notification-title">Conquista Desbloqueada!</div>
                    <div class="achievement-notification-name">${achievement.name}</div>
                    <div class="achievement-notification-desc">${achievement.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    // Update achievements display in the UI
    updateAchievementsDisplay() {
        const achievementsSection = document.querySelector('.achievements-section');
        if (!achievementsSection) return;
        
        achievementsSection.innerHTML = `
            <h3>🏆 Conquistas</h3>
            ${Object.values(this.achievements).map(achievement => `
                <div class="achievement ${achievement.unlocked ? '' : 'locked'}">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    ${achievement.unlocked ? '<div class="achievement-badge">🏆</div>' : ''}
                </div>
            `).join('')}
        `;
    }

    updatePPS() {
        this.pps = 0;
        for (const [type, upgrade] of Object.entries(this.upgrades)) {
            this.pps += upgrade.owned * upgrade.pps;
        }
    }

    updateDisplay() {
        document.getElementById('pizza-count').textContent = Math.floor(this.pizzas);
        document.getElementById('pizza-counter').textContent = Math.floor(this.pizzas);
        document.getElementById('pps').textContent = this.pps.toFixed(1);
        document.getElementById('token-count').textContent = this.tokens;
        
        // Update upgrade displays
        for (const [type, upgrade] of Object.entries(this.upgrades)) {
            const costElement = document.getElementById(`${type}-cost`);
            const ownedElement = document.getElementById(`${type}-owned`);
            
            if (costElement) costElement.textContent = Math.floor(upgrade.cost);
            if (ownedElement) ownedElement.textContent = upgrade.owned;
            
            const upgradeElement = document.querySelector(`[data-upgrade="${type}"]`);
            if (upgradeElement) {
                if (this.pizzas >= upgrade.cost) {
                    upgradeElement.classList.add('available');
                    upgradeElement.classList.remove('unavailable');
                } else {
                    upgradeElement.classList.add('unavailable');
                    upgradeElement.classList.remove('available');
                }
            }
        }
    }

    startGameLoop() {
        setInterval(() => {
            this.pizzas += this.pps / 10; // Divide by 10 for 100ms intervals
            this.updateDisplay();
        }, 100);
        
        // Timer functionality - update play time every second
        setInterval(() => {
            this.playTime++;
            this.updatePlayTimeDisplay();
            this.checkAchievements(); // Check for time-based achievements
            
            // Token generation - earn 1 token per minute
            if (this.playTime % this.tokenGenerationRate === 0 && this.playTime > 0) {
                this.tokens += 1;
                this.updateDisplay(); // Update display to show new tokens
            }
        }, 1000);
    }

    updatePlayTimeDisplay() {
        const playTimeElement = document.getElementById('play-time');
        if (playTimeElement) {
            playTimeElement.textContent = `${this.playTime}s`;
        }
    }

    saveGame() {
        const saveData = {
            pizzas: this.pizzas,
            tokens: this.tokens, // Save tokens
            upgrades: this.upgrades,
            achievements: this.achievements,
            totalClicks: this.totalClicks,
            totalPizzasEarned: this.totalPizzasEarned,
            playerName: this.playerName, // Save player name
            playTime: this.playTime // Save play time
        };
        localStorage.setItem('pizzaClickerSave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('pizzaClickerSave');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.pizzas = data.pizzas || 0;
            this.tokens = data.tokens || 0; // Load tokens
            this.upgrades = { ...this.upgrades, ...data.upgrades };
            this.totalClicks = data.totalClicks || 0;
            this.totalPizzasEarned = data.totalPizzasEarned || 0;
            this.playerName = data.playerName || ''; // Load player name
            this.playTime = data.playTime || 0; // Load play time
            
            // Load achievements if they exist in save data
            if (data.achievements) {
                for (const [key, achievement] of Object.entries(data.achievements)) {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = achievement.unlocked || false;
                    }
                }
            }
            
            this.updatePPS();
            this.updateDisplay();
            this.updatePlayTimeDisplay(); // Update play time display
            this.updateAchievementsDisplay();
            
            // Show welcome modal if no player name is set
            if (!this.playerName) {
                this.showWelcomeModal();
            } else {
                this.updatePlayerNameDisplay();
            }
        } else {
            // First time playing - show welcome modal
            this.showWelcomeModal();
        }
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        const nameInput = document.getElementById('player-name-input');
        const startButton = document.getElementById('start-game-btn');
        
        modal.style.display = 'flex';
        
        // Focus on input
        setTimeout(() => {
            nameInput.focus();
        }, 100);
        
        // Handle start button click
        startButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (name) {
                this.playerName = name;
                modal.style.display = 'none';
                this.updatePlayerNameDisplay();
                this.saveGame();
            } else {
                nameInput.focus();
            }
        });
        
        // Handle Enter key press
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startButton.click();
            }
        });
    }

    updatePlayerNameDisplay() {
        // Update header to include player name
        const header = document.querySelector('header h1');
        if (header && this.playerName) {
            header.innerHTML = `Pizza Clicker <span style="font-size: 1.2rem; color: var(--cc-orange);">- ${this.playerName}</span>`;
        }
    }

    resetGame() {
        if (confirm('Tem certeza que deseja resetar o jogo?')) {
            localStorage.removeItem('pizzaClickerSave');
            location.reload();
        }
    }
}

    // Initialize the game when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        const game = new PizzaClicker();
        window.game = game;
        
        // game.pizzas = 1000; // Set pizzas to 1000 for testing
        
        // Initialize rebirth system
        const rebirthSystem = new RebirthSystem(game);
        game.rebirthSystem = rebirthSystem;
        
        // Apply rebirth bonuses
        rebirthSystem.applyRebirthBonuses();
        
        // rebirthSystem.rebirth(); // Trigger rebirth for testing
        
        // Add reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Game';
        resetButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        resetButton.addEventListener('click', () => game.resetGame());
        document.body.appendChild(resetButton);
    });

// Auto-save every 10 seconds
setInterval(() => {
    if (window.game) {
        window.game.saveGame();
        if (window.game.rebirthSystem) {
            window.game.rebirthSystem.saveRebirthData();
        }
    }
}, 10000);
