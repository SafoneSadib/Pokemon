// Added 'isAnimating' flag to prevent multiple clicks
let p1, p2, turn = 1, gameActive = false, isAnimating = false;

// --- DATA: Moves & Types ---
const moveDB = {
    normal: [{ name: "Tackle", type: "normal", pwr: 40, acc: 100 }, { name: "Hyper Beam", type: "normal", pwr: 150, acc: 90 }, { name: "Quick Attack", type: "normal", pwr: 40, acc: 100 }],
    fire: [{ name: "Flamethrower", type: "fire", pwr: 90, acc: 100 }, { name: "Fire Blast", type: "fire", pwr: 110, acc: 85 }, { name: "Ember", type: "fire", pwr: 40, acc: 100 }],
    water: [{ name: "Hydro Pump", type: "water", pwr: 110, acc: 80 }, { name: "Surf", type: "water", pwr: 90, acc: 100 }, { name: "Water Gun", type: "water", pwr: 40, acc: 100 }],
    grass: [{ name: "Solar Beam", type: "grass", pwr: 120, acc: 100 }, { name: "Energy Ball", type: "grass", pwr: 90, acc: 100 }, { name: "Vine Whip", type: "grass", pwr: 45, acc: 100 }],
    electric: [{ name: "Thunder", type: "electric", pwr: 110, acc: 70 }, { name: "Thunderbolt", type: "electric", pwr: 90, acc: 100 }, { name: "Zap Cannon", type: "electric", pwr: 120, acc: 50 }],
    ice: [{ name: "Ice Beam", type: "ice", pwr: 90, acc: 100 }, { name: "Blizzard", type: "ice", pwr: 110, acc: 70 }],
    fighting: [{ name: "Close Combat", type: "fighting", pwr: 120, acc: 100 }, { name: "Brick Break", type: "fighting", pwr: 75, acc: 100 }],
    poison: [{ name: "Sludge Bomb", type: "poison", pwr: 90, acc: 100 }, { name: "Gunk Shot", type: "poison", pwr: 120, acc: 80 }],
    ground: [{ name: "Earthquake", type: "ground", pwr: 100, acc: 100 }, { name: "Dig", type: "ground", pwr: 80, acc: 100 }],
    flying: [{ name: "Brave Bird", type: "flying", pwr: 120, acc: 100 }, { name: "Air Slash", type: "flying", pwr: 75, acc: 95 }],
    psychic: [{ name: "Psychic", type: "psychic", pwr: 90, acc: 100 }, { name: "Future Sight", type: "psychic", pwr: 120, acc: 100 }],
    bug: [{ name: "X-Scissor", type: "bug", pwr: 80, acc: 100 }, { name: "Megahorn", type: "bug", pwr: 120, acc: 85 }],
    rock: [{ name: "Stone Edge", type: "rock", pwr: 100, acc: 80 }, { name: "Rock Slide", type: "rock", pwr: 75, acc: 90 }],
    ghost: [{ name: "Shadow Ball", type: "ghost", pwr: 80, acc: 100 }, { name: "Shadow Claw", type: "ghost", pwr: 70, acc: 100 }],
    dragon: [{ name: "Dragon Claw", type: "dragon", pwr: 80, acc: 100 }, { name: "Outrage", type: "dragon", pwr: 120, acc: 100 }],
    steel: [{ name: "Flash Cannon", type: "steel", pwr: 80, acc: 100 }, { name: "Iron Head", type: "steel", pwr: 80, acc: 100 }],
    dark: [{ name: "Dark Pulse", type: "dark", pwr: 80, acc: 100 }, { name: "Crunch", type: "dark", pwr: 80, acc: 100 }],
    fairy: [{ name: "Moonblast", type: "fairy", pwr: 95, acc: 100 }, { name: "Dazzling Gleam", type: "fairy", pwr: 80, acc: 100 }],
    default: [{ name: "Struggle", type: "normal", pwr: 50, acc: 100 }]
};

const typeChart = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5 },
    water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5 },
    electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, ground: 0 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
};

// --- CORE LOGIC ---
const getMovesForMon = (types) => {
    let pool = [];
    types.forEach(t => { if (moveDB[t]) pool = [...pool, ...moveDB[t]]; });
    pool = [...pool, ...moveDB['normal'], ...moveDB['default']];
    pool = pool.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
    return pool.sort(() => 0.5 - Math.random()).slice(0, 4);
};

const getRandomId = () => Math.floor(Math.random() * 151) + 1;

const getPokeData = async (idOrName) => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        const imgUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        const types = data.types.map(t => t.type.name);

        return {
            name: data.name,
            hp: data.stats[0].base_stat * 3,
            maxHp: data.stats[0].base_stat * 3,
            atk: data.stats[1].base_stat,
            img: imgUrl,
            types: types,
            energy: 0,
            moves: getMovesForMon(types)
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const playAudio = (id) => {
    const audio = document.getElementById(id);
    if (audio) { audio.currentTime = 0; audio.play().catch(e => { }); }
}

const updateUI = () => {
    if (!p1 || !p2) return;

    // Highlight Active Player
    document.getElementById('p1-area').classList.toggle('active-turn', turn === 1 && gameActive);
    document.getElementById('p2-area').classList.toggle('active-turn', turn === 2 && gameActive);

    // Update P1
    updatePlayerUI(p1, 'p1');

    // Move Buttons P1
    const moveContainer = document.getElementById('p1-moves');
    moveContainer.innerHTML = '';
    p1.moves.forEach((move) => {
        const btn = document.createElement('button');
        btn.className = `move-btn type-${move.type}`;
        btn.innerHTML = `<span class="move-name">${move.name}</span><span class="move-meta">${move.type} | ${move.pwr}</span>`;
        btn.disabled = turn !== 1 || !gameActive;
        btn.onclick = () => performMove(move);
        moveContainer.appendChild(btn);
    });

    // Update P2
    updatePlayerUI(p2, 'p2');

    // Move Buttons P2 (Visual Only - Disabled)
    const p2MoveContainer = document.getElementById('p2-moves');
    p2MoveContainer.innerHTML = '';
    if (p2.moves && p2.moves.length > 0) {
        p2.moves.forEach((move) => {
            const btn = document.createElement('button');
            btn.className = `move-btn type-${move.type}`;
            btn.innerHTML = `<span class="move-name">${move.name}</span><span class="move-meta">${move.type} | ${move.pwr}</span>`;
            btn.disabled = true; // Always disabled for CPU
            btn.style.opacity = "0.7";
            p2MoveContainer.appendChild(btn);
        });
    }
};

const updatePlayerUI = (p, prefix) => {
    const pct = Math.max(0, (p.hp / p.maxHp * 100));
    const hpBar = document.getElementById(`${prefix}-hp-bar`);
    hpBar.style.width = pct + "%";

    // Dynamic HP Colors
    hpBar.className = 'hp-fill'; // reset
    if (pct > 50) hpBar.classList.add('high');
    else if (pct > 20) hpBar.classList.add('mid');
    else hpBar.classList.add('low');

    document.getElementById(`${prefix}-hp-text`).innerText = `${Math.ceil(p.hp)}/${p.maxHp}`;
    document.getElementById(`${prefix}-energy-bar`).style.width = p.energy + "%";
    document.getElementById(`${prefix}-energy-text`).innerText = p.energy + "%";
};

const showDamage = (targetArea, amount, isCrit) => {
    const el = document.createElement('div');
    el.className = 'damage-text';
    el.innerText = `-${amount}`;
    el.style.color = isCrit ? '#fbbf24' : '#ef4444';
    if (isCrit) el.style.fontSize = "3rem";
    document.getElementById(targetArea).appendChild(el);
    setTimeout(() => el.remove(), 1000);
};

const performMove = async (move, isUlt = false) => {
    // FIX: Prevent multiple clicks by checking isAnimating flag
    if (!move) move = { name: "Struggle", type: "normal", pwr: 30, acc: 100 };
    if (isAnimating || !gameActive) return;

    // Lock Input
    isAnimating = true;

    const attacker = turn === 1 ? p1 : p2;
    const defender = turn === 1 ? p2 : p1;
    const attackSide = turn === 1 ? 'p1-display' : 'p2-display';
    const defendSide = turn === 1 ? 'p2-display' : 'p1-display';
    const targetArea = turn === 1 ? 'p2-area' : 'p1-area';

    // 1. Accuracy Check
    if (!isUlt && Math.random() * 100 > move.acc) {
        document.getElementById('log').innerHTML = `${attacker.name.toUpperCase()} used ${move.name} but <span style="color:#94a3b8">MISSED!</span>`;
        endTurn();
        isAnimating = false; // Release lock if missed
        return;
    }

    // 2. Lunge Animation
    const lungeClass = turn === 1 ? 'lunge-right' : 'lunge-left';
    const atkEl = document.getElementById(attackSide).querySelector('img');
    atkEl.classList.add(lungeClass);
    setTimeout(() => atkEl.classList.remove(lungeClass), 400);

    // Wait briefly for impact
    await new Promise(r => setTimeout(r, 200));

    // 3. Calc Damage
    let mult = 1;
    if (typeChart[move.type]) {
        defender.types.forEach(dt => {
            if (typeChart[move.type][dt] !== undefined) mult *= typeChart[move.type][dt];
        });
    }

    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    let baseDmg = (attacker.atk * 0.5) + (move.pwr * 0.5);
    let dmg = Math.floor(baseDmg * (0.85 + Math.random() * 0.3) * mult * stab);

    if (isUlt) {
        dmg = Math.floor(dmg * 2);
        attacker.energy = 0;
        playAudio('sfx-ult');
    } else {
        attacker.energy = Math.min(100, attacker.energy + 20);
        playAudio('sfx-hit');
    }

    defender.hp = Math.max(0, defender.hp - dmg);

    // 4. Hit Visuals (Flash + Shake + Text)
    const defEl = document.getElementById(defendSide).querySelector('img');
    defEl.classList.add('hit-flash');
    setTimeout(() => defEl.classList.remove('hit-flash'), 400);

    const areaEl = document.getElementById(targetArea);
    areaEl.classList.remove('shake');
    void areaEl.offsetWidth; // trigger reflow
    areaEl.classList.add('shake');

    showDamage(targetArea, dmg, mult > 1 || isUlt);

    let logMsg = `${attacker.name.toUpperCase()} used <b>${move.name}</b>!`;
    if (mult > 1) logMsg += ` <span style="color:#fbbf24">It's super effective!</span>`;
    if (mult < 1) logMsg += ` <span style="color:#94a3b8">It's not very effective...</span>`;
    document.getElementById('log').innerHTML = logMsg;

    updateUI();

    if (defender.hp <= 0) {
        gameActive = false;
        triggerGameOver(attacker.name, attacker === p1);
        document.getElementById('status').innerHTML = `WINNER: <span>${attacker.name.toUpperCase()}</span>`;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('start-btn').innerText = "PLAY AGAIN";
        document.getElementById('start-btn').onclick = () => location.reload();
    } else {
        endTurn();
    }

    // Release Lock at the very end of the animation sequence
    isAnimating = false;
};

const endTurn = () => {
    turn = turn === 1 ? 2 : 1;
    if (turn === 2) {
        // CPU TURN
        setTimeout(() => {
            if (!gameActive) return;

            // SMART AI LOGIC
            let bestMove = null;
            let bestScore = -1;

            // 1. Should I ult?
            if (p2.energy >= 100) {
                performMove({ name: "ULTIMATE BLAST", type: "normal", pwr: 120, acc: 100 }, true);
                return;
            }

            // 2. Find best type match
            if (p2.moves && p2.moves.length > 0) {
                p2.moves.forEach(m => {
                    let score = m.pwr; // Base priority by power
                    let effectiveness = 1;

                    // Check against Player types
                    if (typeChart[m.type]) {
                        p1.types.forEach(t => {
                            if (typeChart[m.type][t] !== undefined) effectiveness *= typeChart[m.type][t];
                        });
                    }

                    score = score * effectiveness;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = m;
                    }
                });

                // 20% Chance to be random (makes CPU less robotic)
                if (Math.random() < 0.2) bestMove = p2.moves[Math.floor(Math.random() * p2.moves.length)];

                performMove(bestMove);
            } else {
                performMove({ name: "Tackle", type: "normal", pwr: 40, acc: 100 });
            }
        }, 1500);
    } else {
        updateUI();
    }
};

// --- SETUP & UTILS ---
const popularIds = [1, 4, 7, 25, 39, 52, 65, 94, 133, 143, 149, 150, 248, 384, 448, 700];

const openSelection = () => {
    if (gameActive || document.getElementById('start-btn').innerText === "PLAY AGAIN") return;
    const modal = document.getElementById('selection-modal');
    const grid = document.getElementById('poke-grid');
    grid.innerHTML = '';
    modal.style.display = 'flex';

    popularIds.forEach(id => {
        const item = document.createElement('div');
        item.className = 'poke-option';
        item.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"><p>#${id}</p>`;
        item.onclick = () => selectPokemon(id);
        grid.appendChild(item);
    });
};

const selectPokemon = async (idOrName) => {
    const modal = document.getElementById('selection-modal');
    document.getElementById('log').innerText = "Summoning Pokémon...";
    const chosen = await getPokeData(idOrName);

    if (chosen) {
        p1 = chosen;
        localStorage.setItem('my_pokemon', idOrName);
        document.getElementById('p1-display').innerHTML = `
                    <img src="${p1.img}" class="pokemon-img">
                    <h2 class="pokemon-name">${p1.name}</h2>
                    <div class="type-badge">${p1.types.join(' / ')}</div>
                `;
        document.getElementById('log').innerText = `${p1.name.toUpperCase()} is ready!`;
        modal.style.display = 'none';
        updateUI();
    } else {
        alert("Pokémon not found!");
    }
};

const handleSearch = () => {
    const val = document.getElementById('p1-input').value.trim();
    if (val) selectPokemon(val);
};

document.getElementById('p1-search-btn').onclick = handleSearch;
document.getElementById('p1-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });

const runRoulette = (sideId, duration) => {
    return new Promise((resolve) => {
        const display = document.getElementById(`${sideId}-display`);
        const interval = setInterval(() => {
            const tempId = getRandomId();
            let img = display.querySelector('img');
            if (!img || img.src === "") {
                display.innerHTML = `<img src="" class="pokemon-img" style="filter:grayscale(1) brightness(0.5); width:80px">`;
                img = display.querySelector('img');
            }
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${tempId}.png`;
        }, 100);
        setTimeout(() => { clearInterval(interval); resolve(); }, duration);
    });
};

document.getElementById('start-btn').onclick = async () => {
    if (!p1) return alert("Select your Pokémon first!");
    const btn = document.getElementById('start-btn');
    btn.disabled = true;
    document.getElementById('status').innerHTML = "FINDING <span>OPPONENT...</span>";

    const p2Promise = getPokeData(getRandomId());
    await runRoulette('p2', 2000);
    p2 = await p2Promise;

    document.getElementById('p2-display').innerHTML = `<img src="${p2.img}" class="pokemon-img"><h2 class="pokemon-name">${p2.name}</h2><div class="type-badge">${p2.types.join(' / ')}</div>`;
    document.getElementById('status').innerHTML = "BATTLE <span>START</span>";
    gameActive = true;
    turn = 1;
    updateUI();
    document.getElementById('log').innerText = "Battle Start! Select a move!";
};

document.getElementById('close-modal').onclick = () => document.getElementById('selection-modal').style.display = 'none';

// --- EFFECTS ---
const createConfetti = () => {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
};

const triggerGameOver = (winnerName, isPlayerWin) => {
    const overlay = document.getElementById('result-overlay');
    const text = document.getElementById('result-text');
    overlay.style.opacity = '1';
    text.style.transform = 'scale(1)';
    text.innerText = isPlayerWin ? "VICTORY!" : "DEFEAT";
    text.style.color = isPlayerWin ? "#fbbf24" : "#ef4444";

    if (isPlayerWin) {
        document.getElementById('p1-display').classList.add('winner-anim');
        document.getElementById('p2-display').classList.add('loser-anim');
        createConfetti();
    } else {
        document.getElementById('p1-display').classList.add('loser-anim');
        document.getElementById('p2-display').classList.add('winner-anim');
    }
};

window.onload = () => {
    const savedPokemon = localStorage.getItem('my_pokemon');
    if (savedPokemon) selectPokemon(savedPokemon);
};