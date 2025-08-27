class PetSystem {
    constructor(game) {
        this.game = game;
        
        // Limited time event - 7 days to obtain mythical pet
        this.eventStartTime = Date.now();
        this.eventDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        this.eventActive = true;
        
        this.pets = {
            cat: {
                name: "Gato",
                emoji: "🐱",
                description: "Aumenta PPS em 5%",
                rarity: "common",
                bonus: { type: "pps", multiplier: 1.05 },
                owned: false
            },
            dog: {
                name: "Cachorro",
                emoji: "🐶",
                description: "Aumenta poder de clique em 10%",
                rarity: "common",
                bonus: { type: "click", multiplier: 1.1 },
                owned: false
            },
            pizzaMonster: {
                name: "Monstro de Pizza",
                emoji: "🍕👾",
                description: "Aumenta ganho de pizzas em 15%",
                rarity: "rare",
                bonus: { type: "all", multiplier: 1.15 },
                owned: false
            },
            dragon: {
                name: "Dragão",
                emoji: "🐉",
                description: "Dobra a geração de tokens",
                rarity: "epic",
                bonus: { type: "token", multiplier: 2.0 },
                owned: false
            },
            unicorn: {
                name: "Unicórnio",
                emoji: "🦄",
                description: "Triplica pontos de renascimento",
                rarity: "legendary",
                bonus: { type: "rebirth", multiplier: 3.0 },
                owned: false
            },
            cosmicDragon: {
                name: "Dragão Cósmico",
                emoji: "🐉✨",
                description: "Multiplica todas as pizzas por 2x",
                rarity: "mythical",
                bonus: { type: "all", multiplier: 2.0 },
                owned: false
            },
            penguin: {
                name: "Pinguim",
                emoji: "🐧",
                description: "Reduz custos em 20%",
                rarity: "rare",
                bonus: { type: "cost", multiplier: 0.8 },
                owned: false
            },
            fox: {
                name: "Raposa",
                emoji: "🦊",
                description: "Aumenta chance de pizzas douradas",
                rarity: "epic",
                bonus: { type: "golden", multiplier: 2.0 },
                owned: false
            },
            turtle: {
                name: "Tartaruga",
                emoji: "🐢",
                description: "Ganha pizzas automaticamente 2x mais rápido",
                rarity: "rare",
                bonus: { type: "speed", multiplier: 2.0 },
                owned: false
            }
        };
        
        this.activePet = null;
        this.rouletteCost = 5; // Tokens per spin
        this.spinAnimationDuration = 3000; // 3 seconds
        this.init();
    }

    init() {
        this.loadPetData();
        this.checkEventStatus();
        this.createPetUI();
        this.startEventTimer();
    }

    startEventTimer() {
        // Update timer every minute
        this.timerInterval = setInterval(() => {
            this.checkEventStatus();
            this.updateEventTimer();
        }, 60000); // Update every minute
    }

    checkEventStatus() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.eventStartTime;
        this.eventActive = timeElapsed < this.eventDuration;
        
        if (!this.eventActive) {
            console.log("Evento do Dragão Cósmico expirou");
        }
    }

    formatTimeRemaining() {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.eventStartTime;
        const timeRemaining = this.eventDuration - timeElapsed;
        
        if (timeRemaining <= 0) {
            return "Evento encerrado";
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${days}d ${hours}h ${minutes}m`;
    }

    loadPetData() {
        const petData = localStorage.getItem('pizzaClickerPets');
        if (petData) {
            try {
                const data = JSON.parse(petData);
                
                // Load pet ownership
                for (const [petId, pet] of Object.entries(this.pets)) {
                    if (data.pets && data.pets[petId]) {
                        pet.owned = data.pets[petId].owned || false;
                    }
                }
                
                this.activePet = data.activePet || null;
                this.applyActivePetBonus();
                
            } catch (error) {
                console.error('Error loading pet data:', error);
            }
        }
    }

    savePetData() {
        const petData = {
            pets: {},
            activePet: this.activePet
        };

        for (const [petId, pet] of Object.entries(this.pets)) {
            petData.pets[petId] = {
                owned: pet.owned
            };
        }

        localStorage.setItem('pizzaClickerPets', JSON.stringify(petData));
    }

    createPetUI() {
        const petSection = document.createElement('div');
        petSection.id = 'pet-section';
        petSection.innerHTML = this.generatePetUI();
        
        // Insert after rebirth section or at the end
        const rebirthSection = document.getElementById('rebirth-section');
        if (rebirthSection && rebirthSection.parentNode) {
            rebirthSection.parentNode.insertBefore(petSection, rebirthSection.nextSibling);
        } else {
            const upgradesSection = document.querySelector('.upgrades-section');
            if (upgradesSection && upgradesSection.parentNode) {
                upgradesSection.parentNode.insertBefore(petSection, upgradesSection.nextSibling);
            } else {
                document.body.appendChild(petSection);
            }
        }
        
        this.bindPetEvents();
    }

    generatePetUI() {
        return `
            <div class="pet-container">
                <h2>🎰 Roleta de Pets</h2>
                
                <div class="pet-info">
                    <div class="pet-stat">
                        <span class="pet-label">Tokens:</span>
                        <span id="pet-tokens" class="pet-value">${this.game.tokens}</span>
                    </div>
                    <div class="pet-stat">
                        <span class="pet-label">Custo por giro:</span>
                        <span class="pet-value">${this.rouletteCost} tokens</span>
                    </div>
                    ${this.eventActive ? `
                    <div class="pet-stat">
                        <span class="pet-label">Evento:</span>
                        <span id="event-timer" class="pet-value">${this.formatTimeRemaining()}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="pet-actions">
                    <button id="spin-button" class="pet-btn ${this.game.tokens >= this.rouletteCost ? 'available' : 'unavailable'}">
                        🎯 Girar Roleta
                        <span class="pet-tooltip">Custa ${this.rouletteCost} tokens</span>
                    </button>
                </div>

                <div class="roulette-container">
                    <div class="roulette-wheel" id="roulette-wheel">
                        ${this.generateRouletteItems()}
                    </div>
                    <div class="roulette-pointer"></div>
                </div>

                <div class="pet-collection">
                    <h3>🐾 Coleção de Pets</h3>
                    <div class="pets-grid">
                        ${this.generatePetsCollection()}
                    </div>
                </div>

                <div class="active-pet">
                    <h3>⭐ Pet Ativo</h3>
                    <div id="active-pet-display">
                        ${this.generateActivePetDisplay()}
                    </div>
                </div>
            </div>
        `;
    }

    generateRouletteItems() {
        const items = [];
        const petEntries = Object.entries(this.pets);
        
        // Add each pet multiple times based on rarity
        for (const [petId, pet] of petEntries) {
            // Skip mythical pet if event is not active
            if (pet.rarity === "mythical" && !this.eventActive) {
                continue;
            }
            
            let count = 1;
            
            switch (pet.rarity) {
                case "common": count = 4; break;
                case "rare": count = 3; break;
                case "epic": count = 2; break;
                case "legendary": count = 1; break;
                case "mythical": count = 1; break; // Mythical pets are the rarest
            }
            
            for (let i = 0; i < count; i++) {
                items.push(`<div class="roulette-item" data-pet="${petId}">${pet.emoji}</div>`);
            }
        }
        
        // Shuffle items for random distribution
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        
        return items.join('');
    }

    generatePetsCollection() {
        let html = '';
        for (const [petId, pet] of Object.entries(this.pets)) {
            html += `
                <div class="pet-card ${pet.owned ? 'owned' : 'locked'} ${this.activePet === petId ? 'active' : ''}" 
                     data-pet="${petId}">
                    <div class="pet-emoji">${pet.emoji}</div>
                    <div class="pet-info">
                        <div class="pet-name">${pet.name}</div>
                        <div class="pet-rarity ${pet.rarity}">${this.getRarityName(pet.rarity)}</div>
                        <div class="pet-description">${pet.description}</div>
                    </div>
                    ${pet.owned ? `
                        <button class="pet-activate-btn" data-pet="${petId}">
                            ${this.activePet === petId ? '✅ Ativo' : '⚡ Ativar'}
                        </button>
                    ` : '<div class="pet-locked">🔒</div>'}
                </div>
            `;
        }
        return html;
    }

    generateActivePetDisplay() {
        if (!this.activePet) {
            return '<div class="no-active-pet">Nenhum pet ativo</div>';
        }
        
        const pet = this.pets[this.activePet];
        return `
            <div class="active-pet-card">
                <div class="active-pet-emoji">${pet.emoji}</div>
                <div class="active-pet-info">
                    <div class="active-pet-name">${pet.name}</div>
                    <div class="active-pet-bonus">${pet.description}</div>
                </div>
                <button class="pet-deactivate-btn">❌ Remover</button>
            </div>
        `;
    }

    getRarityName(rarity) {
        const names = {
            common: "Comum",
            rare: "Raro",
            epic: "Épico",
            legendary: "Lendário",
            mythical: "Mítico"
        };
        return names[rarity] || rarity;
    }

    bindPetEvents() {
        // Spin button
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            spinButton.addEventListener('click', () => this.spinRoulette());
        }
        
        // Pet activation buttons
        document.querySelectorAll('.pet-activate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = e.currentTarget.dataset.pet;
                this.activatePet(petId);
            });
        });
        
        // Pet deactivation button
        const deactivateBtn = document.querySelector('.pet-deactivate-btn');
        if (deactivateBtn) {
            deactivateBtn.addEventListener('click', () => this.deactivatePet());
        }
    }

    spinRoulette() {
        if (this.game.tokens < this.rouletteCost) {
            this.showNotification("Tokens insuficientes!", "warning");
            return;
        }
        
        if (this.isSpinning) return;
        this.isSpinning = true;
        
        // Deduct tokens
        this.game.tokens -= this.rouletteCost;
        this.game.updateDisplay();
        this.updateTokenDisplay();
        
        const wheel = document.getElementById('roulette-wheel');
        const items = document.querySelectorAll('.roulette-item');
        const spinButton = document.getElementById('spin-button');
        
        // Disable button during spin
        spinButton.disabled = true;
        spinButton.classList.add('spinning');
        
        // Calculate random stop position
        const itemCount = items.length;
        const randomIndex = Math.floor(Math.random() * itemCount);
        const targetAngle = 360 - (randomIndex * (360 / itemCount));
        const extraSpins = 5; // Number of extra full spins
        const totalAngle = (extraSpins * 360) + targetAngle;
        
        // Animate the spin
        wheel.style.transition = `transform ${this.spinAnimationDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
        wheel.style.transform = `rotate(${totalAngle}deg)`;
        
        // Handle spin completion
        setTimeout(() => {
            this.isSpinning = false;
            spinButton.disabled = false;
            spinButton.classList.remove('spinning');
            
            // Get the winning pet
            const winningItem = items[randomIndex];
            const petId = winningItem.dataset.pet;
            this.handleSpinResult(petId);
            
        }, this.spinAnimationDuration);
    }

    handleSpinResult(petId) {
        const pet = this.pets[petId];
        
        if (pet.owned) {
            // Pet already owned - give bonus tokens
            const bonusTokens = Math.floor(this.rouletteCost * 0.5);
            this.game.tokens += bonusTokens;
            this.showNotification(`Pet repetido! +${bonusTokens} tokens`, "info");
        } else {
            // New pet!
            pet.owned = true;
            this.showNotification(`Novo pet: ${pet.emoji} ${pet.name}!`, "success");
            
            // Check pet-related achievements
            this.checkPetAchievements();
        }
        
        this.updateDisplay();
        this.savePetData();
        this.game.saveGame();
    }

    activatePet(petId) {
        if (this.pets[petId] && this.pets[petId].owned) {
            this.activePet = petId;
            this.applyActivePetBonus();
            this.updateDisplay();
            this.savePetData();
            this.showNotification(`${this.pets[petId].emoji} ${this.pets[petId].name} ativado!`, "success");
        }
    }

    deactivatePet() {
        this.activePet = null;
        this.applyActivePetBonus(); // This will clear bonuses
        this.updateDisplay();
        this.savePetData();
        this.showNotification("Pet desativado", "info");
    }

    applyActivePetBonus() {
        // Clear previous bonuses
        this.game.petBonus = {
            pps: 1,
            click: 1,
            all: 1,
            token: 1,
            cost: 1,
            golden: 1,
            speed: 1,
            rebirth: 1
        };
        
        // Apply active pet bonus
        if (this.activePet && this.pets[this.activePet]) {
            const pet = this.pets[this.activePet];
            this.game.petBonus[pet.bonus.type] = pet.bonus.multiplier;
        }
        
        // Update game calculations
        this.game.updatePPS();
        this.game.updateDisplay();
        
        if (this.game.rebirthSystem) {
            this.game.rebirthSystem.updateRebirthMultipliers();
        }
    }

    checkPetAchievements() {
        const ownedPets = Object.values(this.pets).filter(pet => pet.owned).length;
        
        // You can add pet-specific achievements here
        if (ownedPets >= 3) {
            // Achievement for collecting 3 pets
        }
        
        if (ownedPets >= Object.keys(this.pets).length) {
            // Achievement for collecting all pets
        }
    }

    updateDisplay() {
        // Update token display
        this.updateTokenDisplay();
        
        // Update event timer if event is active
        this.updateEventTimer();
        
        // Update pets collection
        const petsGrid = document.querySelector('.pets-grid');
        if (petsGrid) {
            petsGrid.innerHTML = this.generatePetsCollection();
            this.bindPetEvents(); // Rebind events for new elements
        }
        
        // Update active pet display
        const activePetDisplay = document.getElementById('active-pet-display');
        if (activePetDisplay) {
            activePetDisplay.innerHTML = this.generateActivePetDisplay();
            
            // Rebind deactivate button
            const deactivateBtn = document.querySelector('.pet-deactivate-btn');
            if (deactivateBtn) {
                deactivateBtn.addEventListener('click', () => this.deactivatePet());
            }
        }
        
        // Update spin button
        const spinButton = document.getElementById('spin-button');
        if (spinButton) {
            const canSpin = this.game.tokens >= this.rouletteCost;
            spinButton.className = `pet-btn ${canSpin ? 'available' : 'unavailable'}`;
            spinButton.querySelector('.pet-tooltip').textContent = `Custa ${this.rouletteCost} tokens`;
        }
    }

    updateEventTimer() {
        const timerElement = document.getElementById('event-timer');
        if (timerElement && this.eventActive) {
            timerElement.textContent = this.formatTimeRemaining();
        }
    }

    updateTokenDisplay() {
        const tokenElement = document.getElementById('pet-tokens');
        if (tokenElement) {
            tokenElement.textContent = this.game.tokens;
        }
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

// Add pet system to game initialization
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to be initialized
    setTimeout(() => {
        if (window.game) {
            window.game.petSystem = new PetSystem(window.game);
        }
    }, 1000);
});
