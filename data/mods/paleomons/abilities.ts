const kickMoves = [
	'blazekick', 'doublekick', 'highjumpkick', 'jumpkick', 'lowkick',
	'megakick', 'rollingkick', 'thunderouskick', 'triplekick', 'tropkick', 'stickkick',
];
export const Abilities: {[abilityid: string]: ModdedAbilityData} = {

	bloodsuck: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['heal'] && move.category !== "Status") {
				this.debug('Bloodsuck boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},

		name: "Bloodsuck",
		shortDesc: "User's draining moves deal 1.3x damage.",
		desc: "The user's draining moves have their power multiplied by 1.3x.",
		rating: 3,
		num: -100,
	},

	carboniferous: {
		onModifyMovePriority: -5,
		onModifyMove(move, target) {
			if (move.type === "Bug" /*&& target.hasType("Fairy")*/) {
				(move as any).carboniferousBoosted = true;
			};
		},

		onSourceBasePowerPriority: 18,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fairy') {
				return this.chainModify(0.5);
			}
		},

		name: "Carboniferous",
		shortDesc: "User's Bug moves are super effective against Fairy-types; Fairy moves deal halved damage.",
		desc: "The user's Bug-type moves deal super effective damage against Fairy-types. Fairy-type moves targeting the user deal halved damage.",
		rating: 3,
		num: -101,
	},

	oozingtar: {
		onStart(source) {
			this.field.setTerrain('tarterrain');
		},

		name: "Oozing Tar",
		shortDesc: "Automatically sets Tar Terrain.",
		rating: 4,
		num: -102,
	},

	underbrushtactics: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Dark' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Grass';
			}
		},
		name: "Underbrush Tactics",
		desc: "This Pokemon's Dark-type moves become Grass-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Dark-type moves become Grass-type.",
		rating: 4,
		num: -103,
	},

	corrosivepincers: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Poison') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-message', `${pokemon.name}'s Corrosive Pincers made it immune to being poisoned!`);
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) {
				this.add('-message', `${target.name}'s Corrosive Pincers made it immune to being poisoned!`);
			}
			return false;
		},
		name: "Corrosive Pincers",
		desc: "This Pokemon's attacking stat is doubled while using a Poison-type attack. If a Pokemon uses a Poison-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
		shortDesc: "This Pokemon's Poison power is 2x; it can't be poisoned; Poison power against it is halved.",
		rating: 4.5,
		num: -104,
	},

	chaser: {
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (/* target.newlySwitched || */ this.queue.willMove(target)) {
					return basePower * 1.3;
				}
				return basePower;
			}
		},
		name: "Chaser",
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the first to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the first to move in a turn.",
		rating: 3,
		num: -105,
	},

	absorption: {
		onSwitchIn(pokemon) {
			this.effectData.switchingIn = true;
			pokemon.addVolatile('absorption');
		},
		onStart(pokemon) {
			if (!this.effectData.switchingIn || this.field.isTerrain('')) {
				return;
			}
			this.add('-message', `Absorption Activated!`);
			this.field.clearTerrain();
			this.heal((pokemon.baseMaxhp / 8), pokemon);
		},
		/*
		onTryHit(target, source, move) {
			if (!target.volatiles['absorption']) return;
			if (!target.volatiles['absorption'].type) return;
			if (target !== source && move.type === target.volatiles['absorption'].type) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Absorption');
				}
				return null;
			}
		},
		*/

		name: "Absorption",
		desc: "If there is an active terrain, the terrain ends and the user is healed by 12% of its maximum HP",
		shortDesc: "If there is a terrain active, ends the terrain and heals the user by 12% of its max HP",
		rating: 3,
		num: -106,
	},

	thunderstruck: {
		onSetStatus(status, target, source, effect) {
			if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
				if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
					this.add('-message', `${target.name} was too shocked to stop moving!`);
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (!target.isGrounded() || target.isSemiInvulnerable()) return;
			if (status.id === 'yawn') {
				this.add('-message', `${target.name} was too shocked to stop moving!`);
				return null;
			}
		},
		onBasePowerPriority: 6,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
				this.debug('thunderstruck boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},

		name: "Thunderstruck",
		desc: "h",
		shortDesc: "Simulates the effects of Electric Terrain on the user.",
		rating: 3,
		num: -107,
	},
	fanglock: {
		onModifyMove(move) {
			if (!move || !move.flags['bite'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				volatileStatus: 'fanglock',
			});
		},
		onFoeTrapPokemon(pokemon) {
			if (!this.isAdjacent(pokemon, this.effectData.target)) return;
			if (pokemon.volatiles['fanglock']) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (pokemon.volatiles['fanglock']) {
				pokemon.maybeTrapped = true;
			}
		},

		name: "Fanglock",
		desc: "This Pokemon's bite-based attacks trap their target.",
		shortDesc: "This Pokemon's bite-based attacks trap their target.",
		rating: 3,
		num: -108,
	},

	frigidlanding: {
		onDamage(damage, target, source, effect) {
			if (effect && (effect.id === 'stealthrock' || effect.id === 'spikes' || effect.id === 'toxicspikes' || effect.id === 'scorchedpebbles')) {
				return false;
			}
		},

		name: "Frigid Landing",
		desc: "On switch-in, this Pokemon avoids all hazard damage.",
		shortDesc: "On switch-in, this Pokemon avoids all hazard damage.",
		rating: 3,
		num: -109,
	},

	natureprowess: {
		onStart(pokemon){
			if(pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (!item.naturalGift) return;
			let type: string;
			type = item.naturalGift.type;

			if (!pokemon.hasType(type) && pokemon.addType(type)) {
				this.add('-start', pokemon, 'typeadd', type, '[from] ability: Nature Prowess');
			}
		},

		onUpdate(pokemon) {
			if ((pokemon.ignoringItem() || !pokemon.item) && Object.keys(pokemon.getTypes()).length === 2) {
				pokemon.setType("Grass");
				this.add('-start', pokemon, 'typechange', 'Grass', '[from] ability: Nature Prowess');
			}
		},

		name: "Nature Prowess",
		desc: "Adds a secondary type equal to Natural Gift to this Pokemon. Natural Gift doesn't consume the user's held berry.",
		shortDesc: "Adds secondary type equal to Natural Gift; berry isn't consumed by Natural Gift.",
		num: -110,
	},

	persistence: { 
		onBeforeMove(target, source, move) {
			if (!source || source === target || move.category === 'Status' || move.name === "Counter") return;
			const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
			if (move.flags['charge'] && !target.volatiles['twoturnmove']) {
				this.boost({atk: 1});
			} /*else if (!this.dex.getImmunity(moveType, source)) {
				this.boost({atk: 1});
			}
			(move as any).persistence = true;
			*/
		},
		onAfterMove(source, target, move) {
			if (!source || source === target || move.category === 'Status' || move.name === "Counter") return;
			if(source.moveThisTurnResult === null || source.moveThisTurnResult === undefined) return;
			if(!source.moveThisTurnResult) {
				this.boost({atk: 1});
			} else if(target.moveThisTurnResult) {
			}
		},
		name: "Persistence",
		desc: "If the user chooses an attacking move but doesn't damage the target on the same turn, raises the user's Attack by 1 stage.",
		shortDesc: "If the user doesn't damage the target with an attacking move, raises user's Attack by 1 stage.",
		num: -111,
	},

	thunderthighs: {
		onBasePowerPriority: 23,
		onModifyMove(critRatio, source, target, move) {
			if (kickMoves.includes(move.id)) {
				move.basePower *= 1.2;
			}
		},
		name: "Thunder Thighs",
		desc: "Moves with the word 'kick' in their name have their power multiplied by 1.2x.",
		shortDesc: "Kicking moves deal 1.2x damage.",
		num: -112,
	},

	magicsurge: {
		onStart(source) {
			this.useMove('magicroom', source);
		},

		name: "Magic Surge",
		desc: "Upon switch-in, summons Magic Room",
		shortDesc: "Upon switch-in, summonns Magic Room",
		num: -113,
	},

	vibrato: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.flags['sound'] && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
			}
		},
		name: "Vibrato",
		desc: "This Pokemon's sound-based moves become Electric-type. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Electric-type.",
		rating: 4,
		num: -114,
	},

	audiorupture: {
		onAfterMove(source, target, move) {
			if(!target) return;
			const targetAbility = target.getAbility();
			if (targetAbility.isPermanent || targetAbility.id === 'soundproof') {
				return;
			}
			if (move.flags['sound']) {
				const oldAbility = target.setAbility('soundproof', target);
				if (oldAbility) {
					this.add('-ability', target, 'Soundproof', '[from] Ability: Audio Rupture', '[of] ' + target);
				}
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound'] && move.category !== "Status") {
				this.debug('Audio Rupture boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		name: "Audio Rupture",
		desc: "This Pokemon's sound-based moves have their power boosted by 1.3x. When this Pokemon uses a sound-based move, the target's ability becomes Soundproof if it is not already Soundproof.",
		shortDesc: "This Pokemon's sound-based moves cause the opponent to gain Soundproof and are boosted.",
		rating: 4,
		num: -115,
	},
	
	//
	//
	//
	//
	// Vanilla abilities start here
	//
	//
	//
	//

	mimicry: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				let newType;
				switch (this.field.terrain) {
				case 'electricterrain':
					newType = 'Electric';
					break;
				case 'grassyterrain':
					newType = 'Grass';
					break;
				case 'mistyterrain':
					newType = 'Fairy';
					break;
				case 'psychicterrain':
					newType = 'Psychic';
					break;
				case 'tarterrain':
					newType = 'Psychic';
					break;
				}
				if (!newType || pokemon.getTypes().join() === newType || !pokemon.setType(newType)) return;
				this.add('-start', pokemon, 'typechange', newType, '[from] ability: Mimicry');
			},
		},
	},
};