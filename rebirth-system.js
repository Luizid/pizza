class RebirthSystem {
    constructor(game) {
        this.game = game;
        this.rebirthPoints = 0;
        this.totalRebirths = 0;
        this.rebirthMultipliers = {
            clickPower: 1,
            ppsMultiplier: 1,
            costReduction: 1,
            bonusPoints: 1,
            upgradeEfficiency: 1,
            rebirthSpeed: 1,
            achievementMultiplier: 1,
            goldenPizzaChance: 1
        };
        
        // Modular upgrade definitions with balanced costs and progression
        this.rebirthUpgrades = {
            clickPower: {
                name: "Poder de Clique",
                description: "Aumenta o poder de clique em 2x por nível",
                baseCost: 2,
                costMultiplier: 1.8,
                effectMultiplier: 2,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            ppsMultiplier: {
                name: "Multiplicador PPS",
                description: "Aumenta PPS em 1.5x por nível",
                baseCost: 3,
                costMultiplier: 1.7,
                effectMultiplier: 1.5,
                owned: 0,
                maxLevel: 10,
                type: "multiplicative"
            },
            costReduction: {
                name: "Redução de Custo",
                description: "Reduz custos de upgrades em 10% por nível",
                baseCost: 5,
                costMultiplier: 2.0,
                effectMultiplier: 0.9,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            autoRebirth: {
                name: "Auto-Renascimento",
                description: "Renasce automaticamente ao atingir o custo",
                baseCost: 15,
                costMultiplier: 3.0,
                effectMultiplier: 1,
                owned: 0,
                maxLevel: 5,
                type: "special"
            },
            bonusPoints: {
                name: "Bônus de Pontos",
                description: "Aumenta pontos de renascimento em 25% por nível",
                baseCost: 8,
                costMultiplier: 1.6,
                effectMultiplier: 1.25,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            upgradeEfficiency: {
                name: "Eficiência de Upgrade",
                description: "Reduz custo de upgrades de renascimento em 15% por nível",
                baseCost: 6,
                costMultiplier: 1.9,
                effectMultiplier: 0.85,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            rebirthSpeed: {
                name: "Velocidade de Renascimento",
                description: "Aumenta velocidade de ganho de pontos em 20% por nível",
                baseCost: 4,
                costMultiplier: 1.8,
                effectMultiplier: 1.2,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            achievementMultiplier: {
                name: "Multiplicador de Conquistas",
                description: "Aumenta bônus de conquistas em 30% por nível",
                baseCost: 10,
                costMultiplier: 2.2,
                effectMultiplier: 1.3,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            goldenPizzaChance: {
                name: "Chance de Pizza Dourada",
                description: "Aumenta chance de pizzas douradas em 5% por nível",
                baseCost: 12,
                costMultiplier: 2.5,
                effectMultiplier: 1.05,
                owned: 0,
                maxLevel: 5,
                type: "multiplicative"
            },
            startingBonus: {
                name: "Bônus Inicial",
                description: "Começa com 500 pizzas por nível",
                baseCost: 7,
                costMultiplier: 2.0,
                effectMultiplier: 500,
                owned: 0,
                maxLevel: 5,
                type: "additive"
            }
        };
        
        this.baseRebirthCost = 1000;
        this.rebirthCostMultiplier = 1.5;
        this.autoRebirthEnabled = false;
        this.init();
    }

    init() {
        this.loadRebirthData();
        this.createRebirthUI();
        this.startAutoRebirthCheck();
    }

    loadRebirthData() {
        const rebirthData = localStorage.getItem('pizzaClickerRebirth');
        if (rebirthData) {
            try {
                const data = JSON.parse(rebirthData);
                this.rebirthPoints = data.rebirthPoints || 0;
                this.totalRebirths = data.totalRebirths || 0;
                
                // Merge upgrade data while preserving structure
                for (const [key, upgrade] of Object.entries(this.rebirthUpgrades)) {
                    if (data.rebirthUpgrades && data.rebirthUpgrades[key]) {
                        upgrade.owned = data.rebirthUpgrades[key].owned || 0;
                    }
                }
                
                this.updateRebirthMultipliers();
            } catch (error) {
                console.error('Error loading rebirth data:', error);
            }
        }
    }

    saveRebirthData() {
        const rebirthData = {
            rebirthPoints: this.rebirthPoints,
            totalRebirths: this.totalRebirths,
            rebirthUpgrades: {}
        };

        for (const [key, upgrade] of Object.entries(this.rebirthUpgrades)) {
            rebirthData.rebirthUpgrades[key] = {
                owned: upgrade.owned
            };
        }

        localStorage.setItem('pizzaClickerRebirth', JSON.stringify(rebirthData));
    }

    getRebirthCost() {
        return Math.floor(this.baseRebirthCost * Math.pow(this.rebirthCostMultiplier, this.totalRebirths));
    }

    getRebirthPointsGain() {
        let basePoints = Math.floor(this.game.pizzas / 100);
        let multiplier = 1;
        
        // Apply bonuses from upgrades
        multiplier *= this.rebirthMultipliers.bonusPoints;
        multiplier *= this.rebirthMultipliers.rebirthSpeed;
        
        // Additional bonus based on total rebirths
        multiplier *= (1 + (this.totalRebirths * 0.1));
        
        return Math.max(1, Math.floor(basePoints * multiplier));
    }

    rebirth() {
        const cost = this.getRebirthCost();
        
        if (this.game.pizzas >= cost) {
            // Calculate points gain
            const pointsGained = this.getRebirthPointsGain();
            this.rebirthPoints += pointsGained;
            this.totalRebirths++;
            
            // Reset game state but keep rebirth points and upgrades
            this.resetGameState();
            
            // Apply starting bonus
            const startingBonus = this.rebirthUpgrades.startingBonus.owned * this.rebirthUpgrades.startingBonus.effectMultiplier;
            this.game.pizzas = startingBonus;
            
            // Update display and save
            this.updateDisplay();
            this.saveRebirthData();
            this.game.saveGame();
            
            // Show rebirth notification
            this.showRebirthNotification(pointsGained);
            
            // Check achievements
            this.game.checkAchievements();
        }
    }

    resetGameState() {
        // Reset main game state but preserve rebirth system
        this.game.pizzas = 0;
        this.game.pps = 0;
        this.game.totalClicks = 0;
        this.game.totalPizzasEarned = 0;
        
        // Reset upgrades but preserve their costs for progression
        for (const [key, upgrade] of Object.entries(this.game.upgrades)) {
            upgrade.owned = 0;
            // Keep the cost progression from previous run
        }
        
        this.game.updatePPS();
        this.game.updateDisplay();
    }

    buyRebirthUpgrade(type) {
        const upgrade = this.rebirthUpgrades[type];
        
        if (!upgrade || upgrade.owned >= upgrade.maxLevel) {
            return;
        }
        
        const cost = this.getUpgradeCost(type);
        
        if (this.rebirthPoints >= cost) {
            this.rebirthPoints -= cost;
            upgrade.owned++;
            
            this.updateRebirthMultipliers();
            this.updateDisplay();
            this.saveRebirthData();
            
            // Show purchase animation
            this.showUpgradePurchaseAnimation(type);
            
            // Special handling for auto-rebirth
            if (type === 'autoRebirth' && upgrade.owned > 0) {
                this.autoRebirthEnabled = true;
            }
        }
    }

    getUpgradeCost(type) {
        const upgrade = this.rebirthUpgrades[type];
        if (!upgrade) return Infinity;
        
        // Apply upgrade efficiency discount
        const efficiency = this.rebirthMultipliers.upgradeEfficiency;
        const baseCost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned);
        
        return Math.floor(baseCost * efficiency);
    }

    updateRebirthMultipliers() {
        // Reset all multipliers
        for (const key in this.rebirthMultipliers) {
            this.rebirthMultipliers[key] = 1;
        }
        
        // Apply upgrade effects
        for (const [type, upgrade] of Object.entries(this.rebirthUpgrades)) {
            if (upgrade.owned > 0) {
                switch (upgrade.type) {
                    case "multiplicative":
                        this.rebirthMultipliers[type] *= Math.pow(upgrade.effectMultiplier, upgrade.owned);
                        break;
                    case "additive":
                        // For additive upgrades, we handle them separately
                        break;
                    case "special":
                        // Special upgrades handled elsewhere
                        break;
                }
            }
        }
        
        // Apply multipliers to game
        this.applyRebirthBonuses();
    }

    applyRebirthBonuses() {
        // Apply click power bonus
        const baseClickPower = this.game.clickPowerLevels[this.game.currentClickPowerLevel];
        this.game.clickPower = baseClickPower * this.rebirthMultipliers.clickPower;
        
        // Apply PPS multiplier
        this.game.updatePPS();
        this.game.pps *= this.rebirthMultipliers.ppsMultiplier;
        
        // Apply cost reduction to main game upgrades
        for (const upgrade of Object.values(this.game.upgrades)) {
            const originalCost = upgrade.cost;
            upgrade.cost = Math.floor(originalCost * this.rebirthMultipliers.costReduction);
        }
    }

    startAutoRebirthCheck() {
        setInterval(() => {
            if (this.autoRebirthEnabled && this.game.pizzas >= this.getRebirthCost()) {
                this.rebirth();
            }
        }, 1000); // Check every second
    }

    createRebirthUI() {
        const rebirthSection = document.createElement('div');
        rebirthSection.id = 'rebirth-section';
        rebirthSection.innerHTML = this.generateRebirthUI();
        
        // Insert after upgrades section
        const upgradesSection = document.querySelector('.upgrades-section');
        if (upgradesSection && upgradesSection.parentNode) {
            upgradesSection.parentNode.insertBefore(rebirthSection, upgradesSection.nextSibling);
        } else {
            document.body.appendChild(rebirthSection);
        }
        
        this.bindUIEvents();
    }

    generateRebirthUI() {
        return `
            <div class="rebirth-container">
                <h2>🔄 Sistema de Renascimento</h2>
                
                <div class="rebirth-info">
                    <div class="rebirth-stat">
                        <span class="rebirth-label">Pontos de Renascimento:</span>
                        <span id="rebirth-points" class="rebirth-value">${this.rebirthPoints}</span>
                    </div>
                    <div class="rebirth-stat">
                        <span class="rebirth-label">Total de Renascimentos:</span>
                        <span id="total-rebirths" class="rebirth-value">${this.totalRebirths}</span>
                    </div>
                    <div class="rebirth-stat">
                        <span class="rebirth-label">Próximo Renascimento:</span>
                        <span id="rebirth-cost" class="rebirth-value">${this.getRebirthCost()}</span>
                    </div>
                </div>

                <div class="rebirth-actions">
                    <button id="rebirth-button" class="rebirth-btn ${this.game.pizzas >= this.getRebirthCost() ? 'available' : 'unavailable'}">
                        Renascer
                        <span class="rebirth-tooltip">Requer ${this.getRebirthCost()} pizzas</span>
                    </button>
                </div>

                <div class="rebirth-upgrades">
                    <h3>Upgrades de Renascimento</h3>
                    <div class="rebirth-upgrades-container">
                        ${this.generateUpgradesHTML()}
                    </div>
                </div>
            </div>
        `;
    }

    generateUpgradesHTML() {
        let html = '';
        for (const [type, upgrade] of Object.entries(this.rebirthUpgrades)) {
            const cost = this.getUpgradeCost(type);
            const canAfford = this.rebirthPoints >= cost;
            const isMaxLevel = upgrade.owned >= upgrade.maxLevel;
            
            html += `
                <div class="rebirth-upgrade ${canAfford && !isMaxLevel ? 'available' : 'unavailable'} ${isMaxLevel ? 'max-level' : ''}" 
                     data-rebirth="${type}">
                    <div class="rebirth-upgrade-info">
                        <div class="rebirth-upgrade-name">${upgrade.name}</div>
                        <div class="rebirth-upgrade-desc">${upgrade.description}</div>
                        <div class="rebirth-upgrade-cost">Custo: <span id="${type}-cost">${cost}</span> RP</div>
                        <div class="rebirth-upgrade-level">Nível: <span id="${type}-level">${upgrade.owned}</span>/${upgrade.maxLevel}</div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    bindUIEvents() {
        // Rebirth button
        const rebirthButton = document.getElementById('rebirth-button');
        if (rebirthButton) {
            rebirthButton.addEventListener('click', () => this.rebirth());
        }
        
        // Upgrade buttons
        document.querySelectorAll('.rebirth-upgrade').forEach(upgrade => {
            upgrade.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.rebirth;
                this.buyRebirthUpgrade(type);
            });
        });
    }

    updateDisplay() {
        // Update rebirth points and total rebirths
        const pointsElement = document.getElementById('rebirth-points');
        const totalElement = document.getElementById('total-rebirths');
        const costElement = document.getElementById('rebirth-cost');
        const rebirthButton = document.getElementById('rebirth-button');
        
        if (pointsElement) pointsElement.textContent = this.rebirthPoints;
        if (totalElement) totalElement.textContent = this.totalRebirths;
        if (costElement) costElement.textContent = this.getRebirthCost();
        
        // Update rebirth button state
        if (rebirthButton) {
            const canRebirth = this.game.pizzas >= this.getRebirthCost();
            rebirthButton.className = `rebirth-btn ${canRebirth ? 'available' : 'unavailable'}`;
            rebirthButton.querySelector('.rebirth-tooltip').textContent = `Requer ${this.getRebirthCost()} pizzas`;
        }
        
        // Update upgrade displays
        for (const [type, upgrade] of Object.entries(this.rebirthUpgrades)) {
            const costElement = document.getElementById(`${type}-cost`);
            const levelElement = document.getElementById(`${type}-level`);
            const upgradeElement = document.querySelector(`[data-rebirth="${type}"]`);
            
            if (costElement) costElement.textContent = this.getUpgradeCost(type);
            if (levelElement) levelElement.textContent = upgrade.owned;
            
            if (upgradeElement) {
                const canAfford = this.rebirthPoints >= this.getUpgradeCost(type);
                const isMaxLevel = upgrade.owned >= upgrade.maxLevel;
                
                upgradeElement.className = `rebirth-upgrade ${canAfford && !isMaxLevel ? 'available' : 'unavailable'} ${isMaxLevel ? 'max-level' : ''}`;
                
                // Update progress indicator
                if (levelElement) {
                    const progress = (upgrade.owned / upgrade.maxLevel) * 100;
                    levelElement.style.setProperty('--progress', `${progress}%`);
                }
            }
        }
    }

    showRebirthNotification(pointsGained) {
        this.showNotification(`Renascimento realizado! +${pointsGained} Pontos de Renascimento`, 'success');
    }

    showUpgradePurchaseAnimation(type) {
        const upgrade = document.querySelector(`[data-rebirth="${type}"]`);
        if (upgrade) {
            upgrade.classList.add('purchase-success');
            setTimeout(() => {
                upgrade.classList.remove('purchase-success');
            }, 500);
        }
        
        this.showNotification(`${this.rebirthUpgrades[type].name} comprado!`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
}
