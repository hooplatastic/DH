const bladeMoves = [
	'aerialace', 'airslash', 'behemothblade', 'crosspoison', 'cut', 'falseswipe', 'furycutter', 'leafblade', 'nightslash', 'psychocut', 'razorshell', 'razorwind',
	'sacredsword', 'secretsword', 'slash', 'xscissor', 'solarblade', 'ceaselessedge',
];
export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	gravitas: {
		shortDesc: "On switch-in, this Pokémon summons Gravity.",
		onStart(source) {
			this.field.addPseudoWeather('gravity');
		},
		name: "Gravitas",
		rating: 4,
		num: -1,
	},
	ignite: {
		desc: "This Pokémon's Normal-type moves become Fire-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokémon's Normal-type moves become Fire-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fire';
				(move as any).igniteBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if ((move as any).igniteBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Ignite",
		rating: 4,
		num: -2,
	},
	downtoearth: {
		shortDesc: "While this Pokémon is active, the effects of terrains are disabled.",
		onStart(source) {
			if (this.field.terrain) {
				this.add('-ability', source, 'Down-to-Earth');
				this.add('-message', `${source.name} suppresses the effects of the terrain!`);
			}
		},
		onAnyTerrainStart(target, source, terrain) {
			const pokemon = this.effectData.target;
			this.add('-ability', pokemon, 'Down-to-Earth');
			this.add('-message', `${pokemon.name} suppresses the effects of the terrain!`);
		},
		onEnd(source) {
			if (this.field.terrain) {
				this.add('-message', `${source.name} is no longer suppressing the effects of the terrain!`);
			}
			source.abilityData.ending = true;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('mimicry')) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth') && target !== source) {
							this.debug('Down-to-Earth prevents type change');
							return;
						}
					}
					if (this.field.terrain) {
						pokemon.addVolatile('mimicry');
					} else {
						const types = pokemon.baseSpecies.types;
						if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
						this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
						this.hint("Transform Mimicry changes you to your original un-transformed types.");
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('electricseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('psychicseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('grassyseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('mistyseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('acidicseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('acidicterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
		},
		name: "Down-to-Earth",
		rating: 2,
		num: -3,
	},
	grasspelt: {
		shortDesc: "If Grassy Terrain is active, this Pokémon's Defense is multiplied by 1.5.",
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents Defense increase');
					return;
				}
			}
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	mimicry: {
		shortDesc: "This Pokémon's type changes to match the Terrain. Type reverts when Terrain ends.",
		onStart(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents type change');
					return;
				}
			}
			if (this.field.terrain) {
				pokemon.addVolatile('mimicry');
			} else {
				const types = pokemon.baseSpecies.types;
				if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				this.hint("Transform Mimicry changes you to your original un-transformed types.");
			}
		},
		onAnyTerrainStart() {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents type change');
					return;
				}
			}
			const pokemon = this.effectData.target;
			delete pokemon.volatiles['mimicry'];
			pokemon.addVolatile('mimicry');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['mimicry'];
		},
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
				case 'acidicterrain':
					newType = 'Poison';
					break;
				}
				if (!newType || pokemon.getTypes().join() === newType || !pokemon.setType(newType)) return;
				this.add('-start', pokemon, 'typechange', newType, '[from] ability: Mimicry');
			},
			onUpdate(pokemon) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents type change');
						const types = pokemon.species.types;
						if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
						this.add('-activate', pokemon, 'ability: Mimicry');
						this.add('-end', pokemon, 'typechange', '[silent]');
						pokemon.removeVolatile('mimicry');
					}
				}
				if (!this.field.terrain) {
					const types = pokemon.species.types;
					if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
					this.add('-activate', pokemon, 'ability: Mimicry');
					this.add('-end', pokemon, 'typechange', '[silent]');
					pokemon.removeVolatile('mimicry');
				}
			},
		},
		name: "Mimicry",
		rating: 0.5,
		num: 250,
	},
	surgesurfer: {
		shortDesc: "If Electric Terrain is active, this Pokémon's Speed is doubled.",
		onModifySpe(spe) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents Speed increase');
					return;
				}
			}
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		name: "Surge Surfer",
		rating: 2.5,
		num: 207,
	},
	arenarock: {
		desc: "On switch-in, the field becomes Grassy Terrain. This terrain remains in effect until this Ability is no longer active for any Pokémon.",
		shortDesc: "On switch-in, Grassy Terrain begins until this Ability is not active in battle.",
		onStart(source) {
			if (this.field.setTerrain('grassyterrain')) {
				this.add('-message', `${source.name} covered the arena with unrelenting plant growth!`);
				this.hint("Arena Rock doesn't wear off until the user leaves the field!");
				this.field.terrainData.duration = 0;
			} else if (this.field.isTerrain('grassyterrain') && this.field.terrainData.duration !== 0) {
				this.add('-ability', source, 'Arena Rock');
				this.add('-message', `${source.name} covered the arena with unrelenting plant growth!`);
				this.hint("Arena Rock doesn't wear off until the user leaves the field!");
				this.field.terrainData.source = source;
				this.field.terrainData.duration = 0;
			}
		},
		onAnyTerrainStart(target, source, terrain) {
			if (terrain.id !== 'grassyterrain') {
				this.field.clearTerrain();
				this.field.setTerrain('grassyterrain');
			}
		},
/*
		onAnySetTerrain(target, source, terrain) {
			if (source.hasAbility('arenarock') && terrain.id === 'grassyterrain') return;
			return false;
		},
*/
		onEnd(pokemon) {
			if (this.field.terrainData.source !== pokemon || !this.field.isTerrain('grassyterrain')) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('arenarock')) {
					this.field.terrainData.source = target;
					return;
				}
			}
			this.field.clearTerrain();
		},
		name: "Arena Rock",
		rating: 4.5,
		num: -4,
	},
	sharpstriker: {
		desc: "This Pokémon's ballistic moves have their power multiplied by 1.2. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "This Pokémon's ballistic moves have 1.2x power.",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) {
				return this.chainModify(1.2);
			}
		},
		name: "Sharp Striker",
		rating: 3,
		num: -5,
	},
	coldsweat: {
		desc: "On switch-in, this Pokémon summons hail. It changes the current weather to rain whenever any opposing Pokémon has an attack that is super effective on this Pokémon or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, Hidden Power counts as its determined type, and Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "Summons hail on switch-in. If foe has a supereffective or OHKO move, summons rain.",
		onStart(source) {
			this.field.setWeather('hail');
			for (const target of source.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, source) && this.dex.getEffectiveness(moveType, source) > 0 ||
						move.ohko
					) {
						this.field.setWeather('raindance');
						return;
					}
				}
			}
		},
		onAnySwitchIn(pokemon) {
			const source = this.effectData.target;
			if (pokemon === source) return;
			for (const target of source.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, source) && this.dex.getEffectiveness(moveType, source) > 0 ||
						move.ohko
					) {
						this.field.setWeather('raindance', source);
						return;
					}
				}
			}
		},
		name: "Cold Sweat",
		rating: 4,
		num: -6,
	},
	trashcompactor: {
		desc: "This Pokémon is immune to all entry hazards. If it lands on any type of entry hazard, it clears the hazard and Stockpiles 1.",
		shortDesc: "Hazard immunity. Clears hazards, Stockpiles 1 if switched in on them.",
		onStart(pokemon) {
			let activated = false;
			for (const sideCondition of ['gmaxsteelsurge', 'spikes', 'stealthrock', 'stickyweb', 'toxicspikes']) {
				if (pokemon.side.getSideCondition(sideCondition) && !this.field.getPseudoWeather('stickyresidues')) {
					if (!activated) {
						this.add('-activate', pokemon, 'ability: Trash Compactor');
						pokemon.addVolatile('stockpile');
						activated = true;
					}
					pokemon.side.removeSideCondition(sideCondition);
					this.add('-sideend', pokemon.side, this.dex.getEffect(sideCondition).name, '[from] Ability: Trash Compactor', '[of] ' + pokemon);
				}
			}
		},
		hazardImmune: true,
		name: "Trash Compactor",
		rating: 5,
		num: -7,
	},
	tempestuous: {
		desc: "When replacing a fainted party member, this Pokémon's Special Defense is boosted, and it charges power to double the power of its Electric-type move on its first turn.",
		shortDesc: "Gains the effect of Charge when replacing a fainted ally.",
		onAfterMega(pokemon) {
			if (!pokemon.side.faintedLastTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		onStart(pokemon) {
			if (!pokemon.side.faintedThisTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		name: "Tempestuous",
		rating: 3,
		num: -8,
	},
	sootguard: {
		shortDesc: "This Pokémon receives 3/4 damage from neutrally effective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod === 0) {
				this.debug('Soot Guard neutralize');
				return this.chainModify(0.75);
			}
		},
		name: "Soot Guard",
		rating: 3,
		num: -9,
	},
	dustscatter: {
		shortDesc: "This Pokémon bypasses immunuties to its spore and powder moves.",
		onModifyMove(move) {
			delete move.flags['powder'];
		},
		name: "Dust Scatter",
		rating: 2,
		num: -10,
	},
	counterclockwisespiral: {
		desc: "On switch-in, the field becomes Trick Room. This room remains in effect until this Ability is no longer active for any Pokémon.",
		shortDesc: "On switch-in, Trick Room begins until this Ability is not active in battle.",
		onStart(source) {
			if (this.field.getPseudoWeather('trickroom')) {
				this.add('-ability', source, 'Counter-Clockwise Spiral');
				this.add('-message', `${source.name} twisted the dimensions!`);
				this.hint("Counter-Clockwise Spiral doesn't wear off until the user leaves the field!");
				this.field.pseudoWeather.trickroom.source = source;
				this.field.pseudoWeather.trickroom.duration = 0;
			} else {
				this.add('-ability', source, 'Counter-Clockwise Spiral');
				this.field.addPseudoWeather('trickroom');
				this.hint("Counter-Clockwise Spiral doesn't wear off until the user leaves the field!");
				this.field.pseudoWeather.trickroom.duration = 0;
			}
		},
		onAnyTryMove(target, source, effect) {
			if (['trickroom'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Counter-Clockwise Spiral', move, '[of] ' + target);
				return false;
			}
		},
		onEnd(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('counterclockwisespiral')) {
					return;
				}
			}
			this.field.removePseudoWeather('trickroom');
		},
		name: "Counter-Clockwise Spiral",
		rating: 4.5,
		num: -11,
	},
	nightmareheart: {
		desc: "When this Pokémon faints, the Pokémon that knocked it out is cursed, losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. In addition, the Pokémon that knocked it out permanently receives this Ability, which persists even through switching, until it is knocked out and the Ability is passed along again.",
		shortDesc: "If this Pokémon is KOed, the attacker is cursed, then permanently receives this Ability.",
		onFaint(target, source, effect) {
			if (!source || !effect || target.side === source.side) return;
			if (effect.effectType === 'Move' && !effect.isFutureMove) {
				this.add('-ability', target, 'Nightmare Heart');
				source.addVolatile('curse');
				const bannedAbilities = [
					'battlebond', 'comatose', 'disguise', 'insomnia', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'truant', 'zenmode',
				];
				if (bannedAbilities.includes(source.ability)) {
					return;
				} else {
					source.setAbility('nightmareheart');
					source.baseAbility = 'nightmareheart' as ID;
					source.ability = 'nightmareheart' as ID;
					this.add('-ability', source, 'Nightmare Heart', '[from] Ability: Nightmare Heart');
				}
			}
		},
		name: "Nightmare Heart",
		rating: 3,
		num: -12,
	},
	executioner: {
		desc: "When this Pokémon's target has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using an attack.",
		shortDesc: "This Pokémon's attacking stat is 1.5x when its target has 1/2 or less HP.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (defender.hp <= defender.maxhp / 2) {
				this.debug('Executioner boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (defender.hp <= defender.maxhp / 2) {
				this.debug('Executioner boost');
				return this.chainModify(1.5);
			}
		},
		name: "Executioner",
		rating: 4,
		num: -13,
	},
	solarcore: {
		shortDesc: "During intense sunlight, this Pokémon can skip the charging turn of its moves.",
		onChargeMove(pokemon, target, move) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Solar Core - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		name: "Solar Core",
		rating: 2,
		num: -14,
	},
	twominded: {
		desc: "When this Pokémon's Attack is modified, its Special Attack is modified in the opposite way, and vice versa. The same is true for its Defense and Special Defense.",
		shortDesc: "Applies the opposite of stat changes to the opposite stat (Atk/Sp. Atk, Def/Sp. Def).",
		onAfterBoost(boost, target, source, effect) {
			if (!boost || effect.id === 'twominded') return;
			let activated = false;
			const twoMindedBoost: SparseBoostsTable = {};
			if (boost.spa) {
				twoMindedBoost.atk = -1 * boost.spa;
				activated = true;
			}
			if (boost.spd) {
				twoMindedBoost.def = -1 * boost.spd;
				activated = true;
			}
			if (boost.atk) {
				twoMindedBoost.spa = -1 * boost.atk;
				activated = true;
			}
			if (boost.def) {
				twoMindedBoost.spd = -1 * boost.def;
				activated = true;
			}
			if (activated === true) {
				this.add('-ability', target, 'Two-Minded');
				this.boost(twoMindedBoost, target, target, null, true);
			}
		},
		name: "Two-Minded",
		rating: 4,
		num: -15,
	},
	adrenaline: {
		desc: "This Pokémon's next move is guaranteed to be a critical hit after it attacks and knocks out another Pokémon.",
		shortDesc: "After landing a KO, this Pokémon's next move is guaranteed to be a critical hit.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				source.addVolatile('laserfocus');
			}
		},
		name: "Adrenaline",
		rating: 3,
		num: -16,
	},
	ambush: {
		shortDesc: "This Pokémon's attacks are critical hits if the user moves before the target.",
		onModifyCritRatio(critRatio, source, target) {
			if (target.newlySwitched || this.queue.willMove(target)) return 5;
		},
		name: "Ambush",
		rating: 4,
		num: -17,
	},
	secondwind: {
		desc: "While this Pokémon has more than 1/2 of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokémon has more than 1/2 of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		name: "Second Wind",
		rating: -1,
		num: -18,
	},
	birdofprey: {
		desc: "Prevents adjacent opposing Flying-type Pokémon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Flying-type foes from choosing to switch.",
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Flying') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!pokemon.knownType || pokemon.hasType('Flying')) {
				pokemon.maybeTrapped = true;
			}
		},
		name: "Bird of Prey",
		rating: 4.5,
		num: -19,
	},
	showdown: {
		desc: "While this Pokémon is present, all Pokémon are prevented from restoring any HP. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. Regenerator is also suppressed.",
		shortDesc: "While present, all Pokémon are prevented from healing and Regenerator is suppressed.",
		onStart(source) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (!activated) {
					this.add('-ability', source, 'Showdown');
				}
				activated = true;
				if (!pokemon.volatiles['healblock']) {
					pokemon.addVolatile('healblock');
				}
			}
		},
		onAnySwitchIn(pokemon) {
			if (!pokemon.volatiles['healblock']) {
				pokemon.addVolatile('healblock');
			}
		},
		onEnd(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('showdown')) return;
			}
			for (const target of this.getAllActive()) {
				target.removeVolatile('healblock');
			}
		},
		name: "Showdown",
		rating: 3.5,
		num: -20,
	},
	regenerator: {
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('showdown')) {
					return;
				}
			}
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	hardworker: {
		shortDesc: "This Pokémon's HM moves have 1.5x power.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (['cut', 'fly', 'surf', 'strength', 'whirlpool', 'waterfall', 'rocksmash', 'dive', 'rockclimb'].includes(move.id)) {
				this.debug('Hard Worker boost');
				return this.chainModify([1.5]);
			}
		},
		name: "Hard Worker",
		rating: 3,
		num: -21,
	},
	alchemist: {
		desc: "After attacking a poisoned target with a Poison-type move, this Pokémon has an equal chance to cause one of various random effects. Possible effects include: replacing the poison status with paralysis, burn or toxic poison; afflicting the target with confusion, Torment or Encore; choosing two random stats and either boosting or lowering each one; causing the target to use Explosion if its current HP is 25% or less or afflicting it with a Curse if not; or transforming the target into Seismitoad, Ariados or Butterfree until it switches out.",
		shortDesc: "Poison-type move on poisoned target: random chance of 11 different effects.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && target.hp && move.type === 'Poison' && ['psn', 'tox'].includes(target.status)) {
				const r = this.random(11);
				if (r < 1) {
					if (!target.setStatus('par', source)) {
						this.add('-ability', source, 'Alchemist');
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} couldn't be paralyzed!`);
					}
				} else if (r < 2) {
					if (target.setStatus('brn', source)) {
						this.add('-ability', source, 'Alchemist');
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} couldn't be burned!`);
					}
				} else if (r < 3) {
					if (target.status === 'psn') {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)}'s poison became more severe!`);
						target.setStatus('tox', source);
					} else {
						this.add('-ability', source, 'Alchemist');
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)}'s poison can't get any worse!`);
					}
				} else if (r < 4) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('confusion')) {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} could not be confused!`);
					}
				} else if (r < 5) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('encore')) {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} could not be affected by Encore!`);
					}
				} else if (r < 6) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('torment')) {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} could not be affected by Torment!`);
					}
				} else if (r < 7) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 8) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 9) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 10) {
					this.add('-ability', source, 'Alchemist');
					if (target.hp >= target.maxhp / 4) {
						if (!target.addVolatile('curse')) {
							this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} could not be cursed!`);
						}
					} else {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} suddenly exploded!`);
						this.useMove('explosion', target, "[from] ability: Alchemist", "[of] " + source);
					}
				} else {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('alchemist')) {
						this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} has already transformed!`);
					}
				}
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-message', `${(pokemon.illusion ? pokemon.illusion.name : pokemon.name)} is being transformed...!?`);
				const randForm = this.random(3);
				if (randForm < 1) {
					this.add('-message', `It became a Seismitoad!`);
					pokemon.formeChange('Seismitoad');
					pokemon.setAbility('poisontouch');
				} else if (randForm < 2) {
					this.add('-message', `It became an Ariados!`);
					pokemon.formeChange('Ariados');
					pokemon.setAbility('insomnia');
				} else {
					this.add('-message', `It became a Butterfree!`);
					pokemon.formeChange('Butterfree');
					pokemon.setAbility('compoundeyes');
				}
			},
			onEnd(pokemon) {
				if (['Seismitoad', 'Ariados', 'Butterfree'].includes(pokemon.species.forme)) {
					pokemon.formeChange(pokemon.species.battleOnly as string);
				}
			},
		},
		name: "Alchemist",
		rating: 3,
		num: -22,
	},
	blackmail: {
		desc: "After using a physical Dark-type move, this Pokémon permanently replaces its target's Ability with Orderly Target. The Pokémon with Orderly Target cannot knock out Mega Honchkrow - all of its moves will leave Mega Honchkrow with at least 1 HP. Blackmail can only affect one target per battle.",
		shortDesc: "Single-use. Physical Dark moves: permanently change target's Ability to Orderly Target.",
		onSourceHit(target, source, move) {
			if (!move || !target || target.side === source.side || !target.hp || this.effectData.busted) return;
			if (target !== source && move.type === 'Dark' && move.category === 'Physical') {
				target.setAbility('orderlytarget');
				target.baseAbility = 'orderlytarget' as ID;
				target.ability = 'orderlytarget' as ID;
				this.add('-ability', target, 'Orderly Target', '[from] Ability: Blackmail');
				this.effectData.busted = true;
			}
		},
		isPermanent: true,
		name: "Blackmail",
		rating: 3,
		num: -23,
	},
	orderlytarget: {
		desc: "If the target of this Pokémon's move has Blackmail, it survives every hit with at least 1 HP.",
		shortDesc: "If this Pokémon's target has Blackmail, it survives every hit with at least 1 HP.",
		onDamagePriority: -0,
		onAnyDamage(damage, target, source, effect) {
			if (source === this.effectData.target && target.hasAbility('blackmail') &&
				damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', source, 'Orderly Target');
				return target.hp - 1;
			}
		},
		name: "Orderly Target",
		rating: -1,
		num: -24,
	},
	stickyresidues: {
		desc: "On switch-in, this Pokémon summons sticky residues that prevent hazards from being cleared or moved by Court Change for five turns. Fails if the effect is already active on the user's side.",
		shortDesc: "On switch-in, prevents hazards from being cleared or moved by Court Change for 5 turns.",
		onStart(source) {
			if (this.field.addPseudoWeather('stickyresidues')) {
				this.add('-message', `${source.name} set up sticky residues on the battlefield!`);
			}
		},
		condition: {
			duration: 5,
			onEnd() {
				this.add('-message', `The sticky residues disappeared from the battlefield!`);
			},
		},
		name: "Sticky Residues",
		rating: 3,
		num: -25,
	},
	disguise: {
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		shortDesc: "(Mimikyu only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectData.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.getSpecies(speciesid));
			}
			if (pokemon.canMegaEvo && this.effectData.busted) {
				pokemon.canMegaEvo = 'mimikyubustedmega';
			}
		},
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	spectralanger: {
		shortDesc: "This Pokémon's Attack rises after it uses an attack that is super effective on the target.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && target.getMoveHitData(move).typeMod > 0) {
				this.boost({atk: 1}, source);
			}
		},
		onSourceAfterSubDamage(target, source, move) { // should still activate when targeting a Substitute
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && target.getMoveHitData(move).typeMod > 0) {
				this.boost({atk: 1}, source);
			}
		},
		name: "Spectral Anger",
		rating: 3,
		num: -26,
	},
	diamonddust: {
		desc: "On switch-in, this Pokémon summons Diamond Dust for 5 turns. During the effect, Pokémon are immune to all Rock-type attacks and Stealth Rock; Weather Ball becomes an Ice-type move, and its base power is 100; and other weather-related moves and Abilities behave as they do in Hail.",
		shortDesc: "5 turns: all Pokémon are immune to Rock; counts as hail.",
		onStart(source) {
			this.field.setWeather('diamonddust');
		},
		name: "Diamond Dust",
		rating: 3,
		num: -27,
	},
	forecast: {
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'diamonddust':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
		},
		name: "Forecast",
		rating: 2,
		num: 59,
	},
	icebody: {
		desc: "If Hail or Diamond Dust is active, this Pokémon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokémon takes no damage from Hail.",
		shortDesc: "If Hail or Diamond Dust is active, heals 1/16 of its max HP each turn; immunity to Hail.",
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	iceface: {
		desc: "If this Pokémon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail or Diamond Dust begins or when Eiscue switches in while Hail or Diamond Dust is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, the first physical hit it takes deals 0 damage. Effect restored in Hail, Diamond Dust.",
		onStart(pokemon) {
			if (
				(this.field.isWeather('hail') || this.field.isWeather('diamonddust')) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed
			) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' && effect.category === 'Physical' &&
				target.species.id === 'eiscue' && !target.transformed
			) {
				this.add('-activate', target, 'ability: Ice Face');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed) return;
			if (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates)) return;
			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed) return;
			if (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates)) return;
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.species.id === 'eiscue' && this.effectData.busted) {
				pokemon.formeChange('Eiscue-Noice', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectData.target;
			if (
				(this.field.isWeather('hail') || this.field.isWeather('diamonddust'))
				&& pokemon.species.id === 'eiscuenoice' && !pokemon.transformed
			) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		isPermanent: true,
		name: "Ice Face",
		rating: 3,
		num: 248,
	},
	slushrush: {
		shortDesc: "If Hail or Diamond Dust is active, this Pokémon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail') || this.field.isWeather('diamonddust')) {
				return this.chainModify(2);
			}
		},
		name: "Slush Rush",
		rating: 3,
		num: 202,
	},
	snowcloak: {
		desc: "If Hail or Diamond Dust is active, this Pokémon's evasiveness is multiplied by 1.25. This Pokémon takes no damage from Hail.",
		shortDesc: "If Hail or Diamond Dust is active, evasiveness is 1.25x; immunity to Hail.",
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('hail') || this.field.isWeather('diamonddust')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	prehistoricrage: {
		desc: "This Pokémon's Dragon-type moves' type effectiveness against Fairy is changed to be super effective.",
		shortDesc: "This Pokémon's Dragon-type moves are super effective against Fairy-types.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Prehistoric Rage');
			this.add('-message', `${pokemon.name}'s Dragon-type moves are super effective against Fairy-types!`);
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (move.type !== 'Dragon') return;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Dragon'] = true;
				(move as any).prehistoricrageBoosted = true;
			}
		},
		name: "Prehistoric Rage",
		rating: 3,
		num: -28,
	},
	lusterswap: {
		desc: "On entry, this Pokémon's type changes to match its first move that's super effective against an adjacent opponent.",
		shortDesc: "On entry: type changes to match its first move that's super effective against an adjacent opponent.",
		onStart(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.getMove(moveSlot.move);
				if (move.category === 'Status') continue;
				const moveType = move.id === 'hiddenpower' ? pokemon.hpType : move.type;
				for (const target of pokemon.side.foe.active) {
					if (!target || target.fainted || !this.isAdjacent(target, pokemon)) continue;
					if (
						this.dex.getImmunity(moveType, target) && this.dex.getEffectiveness(moveType, target) > 0
					) {
						this.add('-ability', pokemon, 'Luster Swap');
						if (!pokemon.setType(moveType)) continue;
						this.add('-message', `${pokemon.name} changed its type to match its ${move.name}!`);
						this.add('-start', pokemon, 'typechange', moveType);
						return;
					}
				}
			}
			this.add('-ability', pokemon, 'Luster Swap');
			this.add('-message', `${pokemon.name} can't hit any opponent super effectively!`);
			return;
		},
		name: "Luster Swap",
		rating: 3,
		num: -29,
	},
	acidicsurge: {
		desc: "On switch-in, this Pokémon summons Acidic Terrain for 5 turns. During the effect, the power of Poison-type attacks made by grounded Pokémon is multiplied by 1.3, and grounded Steel-types are not immune to Poison-type damage. Steel-type Pokémon are still immune to being poisoned and badly poisoned, except by Pokémon with Corrosion. Camouflage transforms the user into a Poison-type, Nature Power becomes Sludge Bomb, and Secret Power has a 30% chance to cause poison. Lasts for 8 turns if the user is holding a Terrain Extender (such as through Skill Swap).",
		shortDesc: "5 turns. Grounded: +Poison power, Steel not immune to Poison type.",
		onStart(source) {
			this.field.setTerrain('acidicterrain');
		},
		name: "Acidic Surge",
		rating: 4,
		num: -30,
	},
	flowergift: {
		desc: "If this Pokémon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5. If this Pokémon is a Mega Meganium and Sunny Day is active, the Attack and Special Defense of it and its allies are multiplied by 1.5. If this Pokémon is a Cherrim or a Mega Meganium and it is holding Utility Umbrella, it remains in its regular form and the Attack and Special Defense stats of it and its allies are not boosted. If this Pokémon is a Cherrim in its Sunshine form and is given Utility Umbrella, it will immediately switch back to its regular form. If this Pokémon is a Cherrim holding Utility Umbrella and its item is removed while Sunny Day is active, it will transform into its Sunshine Form. If an ally is holding Utility Umbrella while Cherrim is in its Sunshine Form or Meganium is Mega Evolved, they will not receive the Attack and Special Defense boosts.",
		shortDesc: "If user is Cherrim or Mega Meganium and Sunny Day is active: 1.5x ally team Atk and Sp. Def.",
		onStart(pokemon) {
			delete this.effectData.forme;
		},
		onUpdate(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
				}
			}
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim' &&
				this.effectData.target.species.name !== 'Meganium-Mega') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim' &&
				this.effectData.target.species.name !== 'Meganium-Mega') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		name: "Flower Gift",
		rating: 1,
		num: 122,
	},
	savage: {
		desc: "This Pokémon's biting moves become multi-hit moves that hit three times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. Each hit's damage is cut to one third.",
		shortDesc: "This Pokémon's biting moves hit three times. Each hit's damage is cut to one third.",
		onPrepareHit(source, target, move) {
			if (move.multihit) return;
			if (move.flags['bite'] && !move.isZ && !move.isMax) {
				move.multihit = 3;
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['bite']) return this.chainModify([0x0555, 0x1000]);
		},
		name: "Savage",
		rating: 3.5,
		num: -31,
	},
	volcanicsinge: {
		desc: "After any of this Pokémon's stats is reduced, making contact with a Pokémon on its team burns the attacker. The duration is one turn for each stat stage that was reduced, and the duration is extended if stats are reduced again while it is already in effect.",
		shortDesc: "After stat reduction, contact moves burn attacker. Duration = amount of stat reduction.",
		name: "Volcanic Singe",
		onBoost(boost, target, source, effect) {
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					let num = boost[i]!;
					while (num !== 0) {
						target.side.addSideCondition('volcanicsinge');
						num++;
					}
				}
			}
		},
		condition: {
			duration: 2,
			onStart(side) {
				this.add('-ability', this.effectData.source, 'Volcanic Singe');
				this.add('-message', `The air around ${this.effectData.source.name}'s team was superheated!`);
				this.hint(`During Volcanic Singe, making contact with a Pokémon on ${this.effectData.source.name}'s team will result in a burn!`);
				this.hint(`The effect is extended each time ${this.effectData.source.name}'s stats are lowered!`);
				this.effectData.duration = 2;
			},
			onRestart(side) {
				this.effectData.duration++;
			},
			onHit(target, source, move) {
				if (target.side === this.effectData.target && move.flags['contact']) {
					source.trySetStatus('brn', target);
				}
			},
			onResidualOrder: 10,
			onResidual(side) {
				if (this.effectData.duration > 1) {
					this.add('-message', `There are ${this.effectData.duration} turns left of Volcanic Singe!`);
				} else if (this.effectData.duration === 1) {
					this.add('-message', `There is one turn left of Volcanic Singe!`);
				}
			},
			onEnd(side) {
				this.add('-message', `The air around ${this.effectData.source.name}'s team cooled down!`);
			},
		},
		rating: 3.5,
		num: -32,
	},
	settle: {
		desc: "When using a given special move for the first time in at least three turns, this Pokémon uses its Attack stat, and the power is increased by 100%. Has no effect if the same special move has been used in the last three turns.",
		shortDesc: "On using special move for the first time in at least 3 turns: move uses Atk stat, 2x power.",
		name: "Settle",
		onModifyMove(move, pokemon) {
			let num = 0;
			for (const moveSlot of pokemon.moveSlots) {
				num++;
				const checkSlot = this.dex.getMove(moveSlot.move);
				if (move.id === checkSlot.id) {
					if (num === 1 && !pokemon.volatiles['settle1']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle1');
						(move as any).settleBoosted = true;
					} else if (num === 2 && !pokemon.volatiles['settle2']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle2');
						(move as any).settleBoosted = true;
					} else if (num === 3 && !pokemon.volatiles['settle3']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle3');
						(move as any).settleBoosted = true;
					} else if (num === 4 && !pokemon.volatiles['settle4']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle4');
						(move as any).settleBoosted = true;
					}
				}
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if ((move as any).settleBoosted) {
				this.hint(`${move.name} was boosted by Settle!`);
				return this.chainModify(2);
			}
		},
		rating: 3,
		num: -33,
	},
	heavenlytechniques: {
		desc: "If this Pokémon is at full HP, its blade-based and slashing moves have their priority increased by 1. When its HP is in between full and 1/3, this Pokémon's Defense is raised by 1 stage after it uses a blade-based or slashing move. When it has 1/3 or less of its maximum HP, rounded down, this Pokémon's blade-based and slashing moves are critical hits.",
		shortDesc: "Slashing moves: +1 priority at full HP, always crit at 1/3 HP or less, +1 Defense otherwise.",
		onModifyPriority(priority, pokemon, target, move) {
			if (bladeMoves.includes(move.id) && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (source.hp === source.maxhp || source.hp <= source.maxhp / 3) return;
			if (bladeMoves.includes(move.id)) {
				this.boost({def: 1}, source);
			}
		},
		onSourceAfterSubDamage(target, source, move) { // should still activate when targeting a Substitute
			if (!move || !target) return;
			if (source.hp === source.maxhp || source.hp <= source.maxhp / 3) return;
			if (bladeMoves.includes(move.id)) {
				this.boost({def: 1}, source);
			}
		},
		onModifyCritRatio(critRatio, source, target, move) {
			if (bladeMoves.includes(move.id) && source.hp <= source.maxhp / 3) return 5;
		},
		name: "Heavenly Techniques",
		rating: 3,
		num: -34,
	},
	rotation: {
		desc: "On switch-in, this Pokémon's Defense or Special Defense is raised by 1 stage based on the weaker combined attacking stat of all opposing Pokémon. Special Defense is raised if their Special Attack is higher, and Defense is raised if their Attack is the same or higher.",
		shortDesc: "On switch-in, Defense or Sp. Def is raised 1 stage based on the foes' weaker Attack.",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({def: 1});
			} else if (totalspa) {
				this.boost({spd: 1});
			}
		},
		name: "Rotation",
		rating: 4,
		num: -35,
	},
	spiritofgiving: {
		desc: "On switch-in, every Pokémon in this Pokémon's party regains the item it started with, even if the item was a popped Air Balloon, if the item was picked up by a Pokémon with the Pickup Ability, or the item was lost to Bug Bite, Covet, Incinerate, Knock Off, Pluck, or Thief. It doesn't work if the Pokémon is already holding something else.",
		shortDesc: "Restores the party's used or removed items on switch-in.",
		name: "Spirit of Giving",
		onStart(pokemon) {
			const side = pokemon.side;
			let activated = false;
			for (const ally of side.pokemon) {
				if (ally.item) continue;
				if ((ally as any).lostItemForDelibird) {
					const item = (ally as any).lostItemForDelibird;
					if (ally.setItem(item)) {
						if (!activated) {
							this.add('-ability', pokemon, 'Spirit of Giving');
						}
						activated = true;
						this.add('-item', ally, this.dex.getItem(item), '[from] Ability: Spirit of Giving');
					}
				}
			}
		},
		rating: 4,
		num: -36,
	},
/*
	asonesawsbuck: {
		desc: "The combination of Hustle and A Winter's Tale. This Pokémon's Attack is multiplied by 1.5 and the accuracy of its physical attacks is multiplied by 0.8. The damage of this Pokémon's Ice-type moves used on consecutive turns is increased, up to a maximum of 1.5x after 5 turns. If Hail is active, the effect is doubled for a maximum of 2x after 5 turns.",
		shortDesc: "The combination of Hustle and A Winter's Tale.",
		name: "As One (Sawsbuck)",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onStart(pokemon) {
			pokemon.addVolatile('awinterstale');
		},
		// This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: 7,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return accuracy * 0.8;
			}
		},
		rating: 4,
		num: -2000, // does not exist
	},
*/
	springfever: {
		desc: "While this Pokémon is active, if any Pokémon uses a Fire-type move, it is prevented from executing and the attacker loses 1/4 of its maximum HP, rounded half up. This effect does not happen if the Fire-type move is prevented by Primordial Sea.​",
		shortDesc: "While active, any Pokémon using a Fire move loses 1/4 max HP.",
		onStart(pokemon) {
			this.add('-message', `${pokemon.name} fills the air with explosive powder!`);
		},
		onAnyTryMove(target, source, move) {
			if (move.type === 'Fire') {
				this.add('-activate', source, 'move: Powder');
				this.damage(this.clampIntRange(Math.round(source.maxhp / 4), 1));
				return false;
			}
		},
		name: "Spring Fever",
		rating: 4,
		num: -37,
	},
	summerdays: {
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn. If this Pokemon is holding Utility Umbrella, its Special Attack remains the same and it does not lose any HP.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
		name: "Summer Days",
		rating: 2,
		num: -38,
	},
	autumnleaves: {
		desc: "This Pokémon's Grass-type attacks cause the Ghost type to be added to the target, effectively making it have two or three types. Has no effect if the target is already a Ghost-type. If Forest's Curse or Electroplating adds a type to the target, it replaces the type added by this Ability and vice versa.",
		shortDesc: "This Pokémon's Grass attacks add Ghost to the targets' type(s).",
		onSourceHit(target, source, move) {
			if (move.category !== 'Status' && move.type === 'Grass') {
				if (target.hasType('Ghost')) return;
				if (!target.addType('Ghost')) return;
				this.add('-start', target, 'typeadd', 'Ghost', '[from] Ability: Autumn Leaves');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		name: "Autumn Leaves",
		rating: 4,
		num: -39,
	},
	winterstale: {
		desc: "The damage of this Pokémon's Ice-type moves used on consecutive turns is increased, up to a maximum of 1.5x after 5 turns. If Hail is active, the effect is doubled for a maximum of 2x after 5 turns.",
		shortDesc: "Damage of Ice moves used on consecutive turns is increased, max 1.5x (2x in Hail).",
		onStart(pokemon) {
			pokemon.addVolatile('winterstale');
		},
		condition: {
			onStart(pokemon) {
				this.effectData.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('winterstale') && !pokemon.hasAbility('asonesawsbuck')) {
					pokemon.removeVolatile('winterstale');
					return;
				}
				if (move.type === 'Ice' && pokemon.moveLastTurnResult) {
					this.effectData.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					this.effectData.numConsecutive = 1;
				} else {
					this.effectData.numConsecutive = 0;
				}
				this.effectData.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [0x1000, 0x1333, 0x1666, 0x1999, 0x1CCC, 0x2000];
				const numConsecutive = this.effectData.numConsecutive > 5 ? 5 : this.effectData.numConsecutive;
				if (['hail'].includes(source.effectiveWeather())) {
					return this.chainModify([dmgMod[numConsecutive], 0x1000]);
				} else {
					return damage * (1 + (this.effectData.numConsecutive / 10));
				}
			},
		},
		name: "Winter's Tale",
		rating: 4,
		num: -40,
	},
	desertgales: {
		desc: "On switch-in, this Pokémon summons Desert Gales for 5 turns. During the effect, Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.2; Normal-type moves become Ground-type moves; Weather Ball becomes a Ground-type move, and its base power is 100; and other weather-related moves and Abilities behave as they do in Sandstorm.",
		shortDesc: "5 turns. +Ground/Rock/Steel power, Normal moves become Ground-type.",
		onStart(source) {
			this.field.setWeather('desertgales');
		},
		name: "Desert Gales",
		rating: 4,
		num: -41,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "This Pokémon's Ground/Rock/Steel attacks do 1.3x in Sandstorm and Desert Gales; immunity to it.",
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	sandrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's Speed is doubled. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm or Desert Gales is active, this Pokémon's Speed is doubled; immunity to Sandstorm.",
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	sandveil: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's evasiveness is multiplied by 1.25. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm or Desert Gales is active, this Pokémon's evasiveness is 1.25x; immunity to Sandstorm.",
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	steelbreaker: {
		shortDesc: "This Pokémon's attacks are critical hits if the target is a Steel-type Pokémon.",
		onModifyCritRatio(critRatio, source, target) {
			if (target && target.hasType('Steel')) return 5;
		},
		name: "Steelbreaker",
		rating: 3,
		num: -42,
	},
	elegance: {
		desc: "This Pokémon's moves have their secondary effect chance guaranteed, unless it has a non-volatile status condition, is confused, or is affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Secondary effects of moves are guaranteed unless it has a status or a mental affliction.",
		onModifyMovePriority: -2,
		onModifyMove(move, attacker) {
			if (attacker.status) return;
			if (attacker.volatiles['attract'] || attacker.volatiles['confusion'] ||
				attacker.volatiles['disable'] || attacker.volatiles['encore'] || attacker.volatiles['healblock'] ||
				attacker.volatiles['taunt'] || attacker.volatiles['torment']) return;
			if (move.secondaries) {
				this.debug('maximizing secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance = 100;
				}
			}
			if (move.self?.chance) move.self.chance = 100;
		},
		name: "Elegance",
		rating: 5,
		num: -43,
	},
	seismicscream: {
		desc: "This Pokémon uses Earthquake at 60 base power after using a sound-based move. If the sound-based move is a special attack, the Earthquake that is used is also a special attack.",
		shortDesc: "Follows up sound moves with an Earthquake of 60 BP.",
		onAfterMove(target, source, move) {
			if (!move || !target || !target.hp) return;
			if (target !== source && target.hp && move.flags['sound']) {
				this.effectData.target.addVolatile('seismicscream');
				/*
				this.add('-anim', source, "Earthquake", target);
				*/
				this.useMove('earthquake', this.effectData.target); // going to rework this a bit
			}
		},
		name: "Seismic Scream",
		rating: 3,
		num: -44,
	},
	acidrock: {
		desc: "On switch-in, this Pokémon poisons every Pokémon on the field. Pokémon with Soundproof are immune. Poison inflicted through this Ability does half as much damage as normal poison.",
		shortDesc: "On switch-in, this Pokémon poisons every Pokémon on the field.",
		onStart(pokemon) {
			for (const target of this.getAllActive()) {
				if (!target || !this.isAdjacent(target, pokemon) || target.status) continue;
				if (target.hasAbility('soundproof')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target, "[from] ability: Soundproof", "[of] " + target);
				} else if (!target.runStatusImmunity('psn')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target);
				} else {
					if (target.setStatus('psn', pokemon)) {
						this.hint(`Poison inflicted through Acid Rock is only half as damaging as normal poison.`);
					}
				}
			}
		},
		name: "Acid Rock",
		rating: 4,
		num: -45,
	},
	coupdegrass: {
		desc: "This Pokémon moves first in its priority bracket when its target has 1/2 or less of its maximum HP, rounded down. Does not affect moves that have multiple targets.",
		shortDesc: "This Pokémon moves first in its priority bracket when its target has 1/2 or less HP.",
		onUpdate(pokemon) {
			const action = this.queue.willMove(pokemon);
			if (!action) return;
			const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
			if (!target) return;
			if (!action.move.spreadHit && target.hp && target.hp <= target.maxhp / 2) {
				pokemon.addVolatile('coupdegrass');
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				const action = this.queue.willMove(pokemon);
				if (action) {
					this.add('-ability', pokemon, 'Coup de Grass');
					this.add('-message', `${pokemon.name} prepared to move immediately!`);
				}
			},
			onModifyPriority(priority) {
				return priority + 0.1;
			},
		},
		name: "Coup de Grass",
		rating: 3,
		num: -46,
	},
	masquerade: {
		desc: "This Pokémon inherits the Ability of the last unfainted Pokemon in its party until it takes direct damage from another Pokémon's attack. Abilities that cannot be copied are \"No Ability\", As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "Inherits the Ability of the last party member. Wears off when attacked.",
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectData.gaveUp || pokemon.volatiles['masquerade']) return;
			pokemon.addVolatile('masquerade');
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				const additionalBannedAbilities = [
					'noability', 'flowergift', 'forecast', 'hugepower', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas',
					'powerofalchemy', 'purepower', 'receiver', 'trace', 'wonderguard',
				];
				if (
					pokemon.side.pokemon[i].fainted ||
					pokemon.side.pokemon[i].getAbility().isPermanent || additionalBannedAbilities.includes(pokemon.side.pokemon[i].ability)
				) {
					continue;
				}
				break;
			}
			if (!pokemon.side.pokemon[i] || pokemon === pokemon.side.pokemon[i]) {
				this.effectData.gaveUp = true;
				return;
			}
			const masquerade = pokemon.side.pokemon[i];
			this.add('-ability', pokemon, 'Masquerade');
			pokemon.setAbility(masquerade.ability);
			this.hint(`${pokemon.name} inherited ${this.dex.getAbility(pokemon.ability).name} from ${masquerade.name}!`);
			this.add('-ability', pokemon, this.dex.getAbility(pokemon.ability).name, '[silent]');
		},
		condition: {
			onDamagingHit(damage, target, source, move) {
				this.effectData.busted = true;
			},
			onFaint(pokemon) {
				this.effectData.busted = true;
			},
			onUpdate(pokemon) {
				if (pokemon.hasAbility('masquerade')) return;
				if (this.effectData.busted) {
					this.add('-ability', pokemon, 'Masquerade');
					this.add('-message', `${pokemon.name}'s Masquerade wore off!`);
					pokemon.setAbility('masquerade');
				}
			},
		},
		name: "Masquerade",
		rating: 3,
		num: -47,
	},
	bodyofwater: {
		desc: "When this Pokémon uses a Water-type attack, damage is calculated using the user's Defense stat as its Attack or its Special Defense as its Special Attack. Other effects that modify the Attack and Special Attack stats are used as normal, including stat stage changes.",
		shortDesc: "Water-type attacks use Def as Atk and Sp. Def as Sp. Atk in damage calculation.",
		name: "Body of Water",
		onModifyMove(move, attacker) {
			if (move.type === 'Water') {
				move.useSourceDefensiveAsOffensive = true;
				(move as any).bodyofwaterBoosted = true;
			}
		},
		rating: 3.5,
		num: -48,
	},
	neutralizinggas: {
		inherit: true,
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			for (const target of this.getAllActive()) {
				if (target.getAbility() && target.getAbility().name !== 'Neutralizing Gas') {
					this.singleEvent('End', target.getAbility(), target.abilityData, target);
				}
			}
			pokemon.abilityData.ending = false;
		},
	},
	everlastingwinter: {
		desc: "On switch-in, the weather becomes Hail. This weather remains in effect until this Ability is no longer active for any Pokémon, or the weather is changed by Delta Stream, Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, hail begins until this Ability is not active in battle.",
		onStart(source) {
			if (this.field.setWeather('hail')) {
				this.add('-message', `${source.name} created an unrelenting winter storm!`);
				this.hint("Everlasting Winter doesn't wear off until the user leaves the field!");
				this.field.weatherData.duration = 0;
			} else if (this.field.isWeather('hail') && this.field.weatherData.duration !== 0) {
				this.add('-ability', source, 'Everlasting Winter');
				this.add('-message', `${source.name} created an unrelenting winter storm!`);
				this.hint("Everlasting Winter doesn't wear off until the user leaves the field!");
				this.field.weatherData.source = source;
				this.field.weatherData.duration = 0;
			}
		},
		onAnySetWeather(target, source, weather) {
			if (source.hasAbility('everlastingwinter') && weather.id === 'hail') return;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'hail' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('everlastingwinter')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Everlasting Winter",
		rating: 4.5,
		num: -49,
	},
	deltastream: {
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land, Everlasting Winter or Primordial Sea.",
		onStart(source) {
			this.field.setWeather('deltastream');
		},
		onAnySetWeather(target, source, weather) {
			if (source.hasAbility('everlastingwinter') && weather.id === 'hail') return;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deltastream')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Delta Stream",
		rating: 4,
		num: 191,
	},
	desolateland: {
		desc: "On switch-in, the weather becomes extremely harsh sunlight that prevents damaging Water-type moves from executing, in addition to all the effects of Sunny Day. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Everlasting Winter or Primordial Sea.",
		onStart(source) {
			this.field.setWeather('desolateland');
		},
		onAnySetWeather(target, source, weather) {
			if (source.hasAbility('everlastingwinter') && weather.id === 'hail') return;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('desolateland')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Desolate Land",
		rating: 4.5,
		num: 190,
	},
	primordialsea: {
		desc: "On switch-in, the weather becomes heavy rain that prevents damaging Fire-type moves from executing, in addition to all the effects of Rain Dance. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Delta Stream, Desolate Land or Everlasting Winter.",
		onStart(source) {
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			if (source.hasAbility('everlastingwinter') && weather.id === 'hail') return;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		name: "Primordial Sea",
		rating: 4.5,
		num: 189,
	},
	forgery: {
		desc: "This Pokémon inherits the item of the last unfainted Pokemon in its party.",
		shortDesc: "Inherits the item of the last party member.",
		onStart(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			pokemon.addVolatile('forgery');
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (
					!pokemon.side.pokemon[i] || pokemon.side.pokemon[i].fainted ||
					!pokemon.side.pokemon[i].item || this.dex.getItem(pokemon.side.pokemon[i].item).zMove ||
					 this.dex.getItem(pokemon.side.pokemon[i].item).megaStone
				) continue;
				break;
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			const forgery = pokemon.side.pokemon[i];
			this.add('-ability', pokemon, 'Forgery');
			pokemon.item = forgery.item;
			this.add('-message', `${pokemon.name}'s Zoroarkite became a replica of the ${this.dex.getItem(forgery.item).name} belonging to ${forgery.name}!`);
		},
		onUpdate(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			if (!pokemon.item) {
				this.add('-ability', pokemon, 'Forgery');
				this.add('-message', `${pokemon.name}'s Zoroarkite returned to normal!`);
				pokemon.item = 'zoroarkite' as ID;
			}
		},
		onEnd(pokemon) {
			if (pokemon.species.name !== 'Zoroark-Mega') return;
			if (pokemon.item !== 'zoroarkite') {
				this.add('-ability', pokemon, 'Forgery');
				this.add('-message', `${pokemon.name}'s Zoroarkite returned to normal!`);
				pokemon.item = 'zoroarkite' as ID;
			}
		},
		isPermanent: true,
		name: "Forgery",
		rating: 3,
		num: -50,
	},
	clairvoyance: {
		desc: "This Pokémon's Psychic-type moves take effect two turns after being used. At the end of that turn, the damage is calculated at that time and dealt to the Pokémon at the position the target had when the move was used. Only one move can be delayed at a time. If the user is no longer active at the time an attacking move should hit, damage is calculated based on the user's natural Attack or Special Attack stat, types, and level, with no boosts from its held item or Ability. Status moves are used by the Pokémon at the position the user had when the move was used.",
		shortDesc: "Psychic-type moves delayed until two turns later, but only one at a time.",
		onBeforeMove(source, target, move) {
			if (
				move && move.type === 'Psychic' && source.hasAbility('clairvoyance') &&
				source.side.addSlotCondition(source, 'clairvoyance')
			) {
				Object.assign(source.side.slotConditions[source.position]['clairvoyance'], {
					duration: 3,
					source: source,
					target: null,
					move: move,
					position: target.position,
					side: target.side,
					moveData: this.dex.getMove(move),
				});
				this.add('-ability', source, 'Clairvoyance');
				this.add('-message', `${source.name} cast ${move.name} into the future!`);
				source.deductPP(move.id, 1);
				return null;
			}
		},
		condition: {
			duration: 3,
			onResidualOrder: 3,
			onEnd(target) {
				this.effectData.target = this.effectData.side.active[this.effectData.position];
				const data = this.effectData;
				const move = this.dex.getMove(data.move);
				this.add('-ability', this.effectData.source, 'Clairvoyance');
				if (!data.target) {
					this.hint(`${move.name} did not hit because there was no target.`);
					return;
				}

				this.add('-message', `${this.effectData.source.name}'s ${move.name} took effect!`);
				data.target.removeVolatile('Endure');

				if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
					data.moveData.infiltrates = true;
				}
				if (data.source.hasAbility('normalize') && this.gen >= 6) {
					data.moveData.type = 'Normal';
				}
				if (data.source.hasAbility('adaptability') && this.gen >= 6) {
					data.moveData.stab = 2;
				}
				data.moveData.isFutureMove = true;
				delete data.moveData.flags['contact'];
				delete data.moveData.flags['protect'];

				if (move.category === 'Status') {
					this.useMove(move, target, data.target);
				} else {
					const hitMove = new this.dex.Move(data.moveData) as ActiveMove;
					if (data.source.isActive) {
						this.add('-anim', data.source, hitMove, data.target);
					}
					this.trySpreadMoveHit([data.target], data.source, hitMove);
				}
			},
		},
		name: "Clairvoyance",
		rating: 3,
		num: -51,
	},
	sleightofhand: {
		desc: "This Pokémon's contact moves become special attacks and do not make contact with the target.",
		shortDesc: "This Pokémon's contact moves become special and non-contact.",
		onModifyMove(move) {
			if (move.flags['contact']) {
				if (move.category !== 'Special') move.category = 'Special';
				delete move.flags['contact'];
			}
		},
		name: "Sleight of Hand",
		rating: 3,
		num: -52,
	},
	moleawhac: {
		desc: "This Pokémon's Attack is raised by 1 stage at the end of each full turn if it uses an attacking move. Its Attack boosts are cleared and its Attack is not increased on the same turn when it is hit by a contact move.",
		shortDesc: "Atk rises 1 stage on each attacking turn; Atk reset on contact.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				const moleawhacBoost: SparseBoostsTable = {};
				moleawhacBoost.atk = -1 * target.boosts['atk'];
				this.boost(moleawhacBoost, target, target);
				target.addVolatile('moleawhac');
			}
		},
		onPrepareHit(source, target, move) {
			if (move.category === 'Status') {
				source.addVolatile('moleawhac');
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns && !pokemon.volatiles['moleawhac']) {
				this.boost({atk: 1});
			}
		},
		condition: {
			duration: 1,
		},
		name: "Mole-a-Whac",
		rating: 4.5,
		num: -53,
	},
	sos: {
		desc: "If this Pokémon is a Wishiwashi that has Mega Evolved, it calls for help and changes form at the end of each full turn it has been on the field, building up to Mega Wishiwashi (School Form) over five turns.",
		shortDesc: "More Wishiwashi spawn at the end of each turn.",
		onStart(pokemon) {
			if (pokemon.species.id === 'wishiwashimega' && pokemon.hp > pokemon.maxhp / 4) {
				this.add('-message', `Startled by the Mega Evolution, ${pokemon.name}'s school dispersed...`);
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.transformed || !pokemon.hp || !pokemon.activeTurns ||
				pokemon.species.id === 'wishiwashi' || pokemon.species.id === 'wishiwashischool' ||
				pokemon.species.id === 'wishiwashimegaschool'
			) return;
			this.add('-activate', pokemon, 'ability: SOS');
			this.add('-message', `${pokemon.name} called for help!`);
			if (pokemon.species.id === 'wishiwashimega') {
				pokemon.formeChange('Wishiwashi-Mega-1', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega1') {
				pokemon.formeChange('Wishiwashi-Mega-2', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega2') {
				pokemon.formeChange('Wishiwashi-Mega-3', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega3') {
				pokemon.formeChange('Wishiwashi-Mega-4', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega4') {
				pokemon.formeChange('Wishiwashi-Mega-School', this.effect, true);
			}
			this.add('-message', `More of ${pokemon.name}'s friends came together!`);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			const species = this.dex.getSpecies(pokemon.species.name);
			const abilities = species.abilities;
			const baseStats = species.baseStats;
			const type = species.types[0];
			this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities[0] + `</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
			pokemon.baseMaxhp = Math.floor(Math.floor(
				2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
			) * pokemon.level / 100 + 10);
			const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
			pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newMaxHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		isPermanent: true,
		name: "SOS",
		rating: 5,
		num: -54,
	},
	stancechange: {
		desc: "If this Pokémon is an Aegislash or a Falinks-Mega, it changes to Blade Forme or Mega Combat before attempting to use an attacking move, and changes to Shield Forme or Mega Legion before attempting to use King's Shield.",
		shortDesc: "Changes Aegislash/Falinks-Mega to Blade Forme/Combat before attack, Shield Forme/Legion before King's Shield.",
		onBeforeMovePriority: 0.5,
		onBeforeMove(attacker, defender, move) {
			if (
				(attacker.species.baseSpecies !== 'Aegislash' && !attacker.species.name.startsWith('Falinks-Mega')) || attacker.transformed
			) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			if (attacker.species.baseSpecies === 'Aegislash') {
				const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
				if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
			} else if (attacker.species.name.startsWith('Falinks-Mega')) {
				const targetForme = (move.id === 'kingsshield' ? 'Falinks-Mega-Legion' : 'Falinks-Mega-Combat');
				if (attacker.species.name !== targetForme) {
					attacker.formeChange(targetForme);
					if (targetForme === 'Falinks-Mega-Legion') {
						this.add('-message', `${attacker.name} changed to Legion formation!`);
						this.add('-start', attacker, 'typechange', attacker.getTypes(true).join('/'), '[silent]');
					} else {
						this.add('-message', `${attacker.name} changed to Combat formation!`);
						this.add('-start', attacker, 'typechange', attacker.getTypes(true).join('/'), '[silent]');
						if (!this.effectData.busted) { // this is just to make a dt that only shows up once per Mega Falinks
							const species = this.dex.getSpecies(attacker.species.name);
							const abilities = species.abilities;
							const baseStats = species.baseStats;
							const type = species.types[0];
							if (species.types[1]) {
								const type2 = species.types[1];
								this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"><img src="https://${Config.routes.client}/sprites/types/${type2}.png" alt="${type2}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities[0] + `</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
							} else {
								this.add(`raw|<ul class="utilichart"><li class="result"><span class="col pokemonnamecol" style="white-space: nowrap">` + species.name + `</span> <span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32"></span> <span style="float: left ; min-height: 26px"><span class="col abilitycol">` + abilities[0] + `</span><span class="col abilitycol"></span></span><span style="float: left ; min-height: 26px"><span class="col statcol"><em>HP</em><br>` + baseStats.hp + `</span> <span class="col statcol"><em>Atk</em><br>` + baseStats.atk + `</span> <span class="col statcol"><em>Def</em><br>` + baseStats.def + `</span> <span class="col statcol"><em>SpA</em><br>` + baseStats.spa + `</span> <span class="col statcol"><em>SpD</em><br>` + baseStats.spd + `</span> <span class="col statcol"><em>Spe</em><br>` + baseStats.spe + `</span> </span></li><li style="clear: both"></li></ul>`);
							}
							this.effectData.busted = true;
						}
					}
				}
			}
		},
		isPermanent: true,
		name: "Stance Change",
		rating: 4,
		num: 176,
	},
	poolfloaties: {
		desc: "This Pokémon and its adjacent allies are immune to Water-type moves. For 3 turns after the user or its adjacent allies use a Water-type move or are hit by a Water-type move, they are also immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability as long as they remain active. If they use Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this immunity if the user is under any of their effects.",
		shortDesc: "Pokémon and allies: gain Ground immunity from Water moves; Water immunity.",
		onAnyTryHit(target, source, move) {
			if (target !== source && target.side === this.effectData.target.side && move.type === 'Water') {
				target.addVolatile('poolfloaties');
				this.add('-immune', target, '[from] ability: Pool Floaties', '[of] ' + this.effectData.target);
				return null;
			}
			if (target !== source && source.side === this.effectData.target.side && move.type === 'Water') {
				source.addVolatile('poolfloaties');
			}
		},
		condition: {
			duration: 3,
			onStart(target) {
				if (
					target.volatiles['smackdown'] || target.volatiles['ingrain'] || this.field.getPseudoWeather('Gravity')
				) return false;
				this.add('-start', target, 'Pool Floaties', '[silent]');
				if (target === this.effectData.source) {
					this.add('-message', `${target.name} was lifted up by its pool floaties!`);
				} else {
					this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} was lifted up by ${this.effectData.source.name}'s pool floaties!`);
				}
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'Pool Floaties', '[silent]');
				this.add('-message', `${(target.illusion ? target.illusion.name : target.name)} floated back down!`);
			},
		},
		name: "Pool Floaties",
		rating: 3,
		num: -55,
	},
	redlicorice: {
		desc: "This Pokémon's Fairy-type attacks cause the target to become sticky and flammable. When a Fire-type attack is used against a target that is sticky and flammable, its power is multiplied by 1.5, and the target is burned but is no longer sticky and flammable. When a Fire-type attack is used by an attacker that is sticky and flammable, the user takes recoil damage equal to 50% the HP lost by the target (rounded half up, but not less than 1 HP), and the user is burned but is no longer sticky and flammable.",
		shortDesc: "Fairy attacks make target sticky; Fire attacks: burn, 50% more damage to sticky Pokémon.",
		onSourceHit(target, source, move) {
			if (move.category !== 'Status' && move.type === 'Fairy') {
				target.addVolatile('redlicorice');
			}
		},
		condition: {
			onStart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Sticky Gel', '[from] ability: Red Licorice', '[of] ' + source);
			},
			onAnyDamage(damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && effect.type === 'Fire' && source === this.effectData.target) {
					if (this.effectData.damage) {
						if (target.hp <= damage) {
							this.effectData.damage += target.hp;
						} else {
							this.effectData.damage += damage;
						}
					} else {
						if (target.hp <= damage) {
							this.effectData.damage = target.hp;
						} else {
							this.effectData.damage = damage;
						}
					}
					this.effectData.lit = true;
				} else if (effect && effect.effectType === 'Move' && effect.type === 'Fire' && target === this.effectData.target) {
					this.effectData.lit = true;
					return damage * 1.5;
				}
			},
			onUpdate(pokemon) {
				if (this.effectData.lit) {
					pokemon.removeVolatile('redlicorice');
					this.add('-end', pokemon, 'Sticky Gel', '[silent]');
					this.hint("The sticky gel ignited!");
					if (this.effectData.damage) {
						this.damage(this.effectData.damage / 2, this.effectData.target);
					}
					pokemon.trySetStatus('brn', this.effectData.source);
				}
			},
		},
		name: "Red Licorice",
		rating: 3,
		num: -56,
	},
	stygianshades: {
		desc: "This Pokémon's Dark-type status moves set one layer of Spikes on the opposing side of the field.",
		shortDesc: "Dark-type status moves set spikes on the opposing side.",
		onAfterMove(target, source, move) {
			if (!move || !source) return;
			if (move.type === 'Dark' && move.category === 'Status') {
				this.add('-ability', this.effectData.target, 'Stygian Shades');
				this.effectData.target.side.foe.addSideCondition('spikes');
			}
		},
		name: "Stygian Shades",
		rating: 3,
		num: -57,
	},
	longwhip: {
		desc: "This Pokémon's multi-hit attacks do damage at the end of each turn, for the maximum number of times the attack could hit, instead of being used immediately. More than one move can stack in this way.",
		shortDesc: "Multi-hit attacks: damage over time, for as many turns as they could hit.",
		onBeforeMove(source, target, move) {
			if (move.multihit) {
				this.add('-ability', source, 'Long Whip');
				this.add('-message', `${source.name} prepared to whip ${(target.illusion ? target.illusion.name : target.name)}'s team with ${move.name}!`);
				source.deductPP(move.id, 1);
				if (move.accuracy && typeof move.accuracy === 'number') {
					if (this.randomChance((100 - move.accuracy), 100)) {
						this.add('-message', `But it failed!`);
						return null;
					}
				}
				let whipMove = null;
				if (target.side.addSlotCondition(target, 'longwhip1')) {
					whipMove = 'longwhip1';
				} else if (target.side.addSlotCondition(target, 'longwhip2')) {
					whipMove = 'longwhip2';
				} else if (target.side.addSlotCondition(target, 'longwhip3')) {
					whipMove = 'longwhip3';
				} else if (target.side.addSlotCondition(target, 'longwhip4')) {
					whipMove = 'longwhip4';
				} else if (target.side.addSlotCondition(target, 'longwhip5')) {
					whipMove = 'longwhip5';
				} else {
					this.add('-message', `But it failed!`);
					return null;
				}
				let numberHits;
				if (Array.isArray(move.multihit) && move.multihit.length) {
					numberHits = move.multihit[1];
				} else {
					numberHits = move.multihit;
				}
				Object.assign(target.side.slotConditions[target.position][whipMove], {
					duration: numberHits,
					source: source,
					move: move,
					position: target.position,
					side: target.side,
					moveData: this.dex.getMove(move),
				});
				return null;
			}
		},
		name: "Long Whip",
		rating: 3,
		num: -58,
	},
	gravitationalpull: {
		desc: "This Pokémon is immune to all entry hazards and incorporates them into its body. Pokémon making contact with this Pokémon are affected by all of the hazards on both sides of the field, in the same way as if they had switched in.",
		shortDesc: "Hazard immunity. On contact, attackers suffer the effects of hazards on the field.",
		name: "Gravitational Pull",
		onStart(pokemon) {
			for (const active of this.getAllActive()) {
				if (active.volatiles['gravitationalpull']) {
					active.removeVolatile('gravitationalpull');
				}
			}
			pokemon.addVolatile('gravitationalpull');
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['gravitationalpull']) return;
			for (const active of this.getAllActive()) {
				if (active.volatiles['gravitationalpull']) {
					return;
				}
			}
			pokemon.addVolatile('gravitationalpull');
		},
		onEnd(pokemon) {
			if (pokemon.volatiles['gravitationalpull']) {
				pokemon.removeVolatile('gravitationalpull');
				for (const active of this.getAllActive()) {
					if (active.hasAbility('gravitationalpull') && active !== pokemon) {
						active.addVolatile('gravitationalpull');
						return;
					}
				}
				const hazards = [
					'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const sideCondition of hazards) {
					if (pokemon.side.getSideCondition(sideCondition) || pokemon.side.foe.getSideCondition(sideCondition)) {
						this.add('-message', `The hazards on the field returned to their original positions!`);
						return;
					}
				}
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'ability: Gravitational Pull');
				const hazards = [
					'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const sideCondition of hazards) {
					if (pokemon.side.getSideCondition(sideCondition) || pokemon.side.foe.getSideCondition(sideCondition)) {
						this.add('-message', `The hazards on the field are surrounding ${pokemon.name}!`);
						return;
					}
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'ability: Gravitational Pull', '[silent]');
			},
			onDamagingHitOrder: 1,
			onDamagingHit(damage, target, source, move) {
				if (move.flags['contact']) {
					let success = undefined;
					if (target.side.getSideCondition('spikes') || target.side.foe.getSideCondition('spikes')) {
						if (!success) {
							success = true;
							this.add('-ability', target, 'Gravitational Pull');
						}
						let layers = 0;
						if (target.side.sideConditions['spikes']) {
							layers += target.side.sideConditions['spikes'].layers;
						}
						if (target.side.foe.sideConditions['spikes']) {
							layers += target.side.foe.sideConditions['spikes'].layers;
						}
						const damageAmounts = [0, 3, 4, 6, 6, 6, 6]; // 1/8, 1/6, 1/4 - caps at 3
						this.damage(damageAmounts[layers] * source.maxhp / 24, source, target);
						// this.add('-message', `${source.name} was hurt by the spikes!`);
					}
					if (target.side.getSideCondition('toxicspikes') || target.side.foe.getSideCondition('toxicspikes')) {
						if (!success) {
							success = true;
							this.add('-ability', target, 'Gravitational Pull');
						}
						let layers = 0;
						if (target.side.sideConditions['toxicspikes']) {
							layers += target.side.sideConditions['toxicspikes'].layers;
						}
						if (target.side.foe.sideConditions['toxicspikes']) {
							layers += target.side.foe.sideConditions['toxicspikes'].layers;
						}
						if (layers >= 2) {
							source.trySetStatus('tox', target);
						} else {
							source.trySetStatus('psn', target);
						}
					}
					if (target.side.getSideCondition('stealthrock') || target.side.foe.getSideCondition('stealthrock')) {
						if (!success) {
							success = true;
							this.add('-ability', target, 'Gravitational Pull');
						}
						const typeMod = this.clampIntRange(source.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
						this.damage(source.maxhp * Math.pow(2, typeMod) / 8, source, target);
						// this.add('-message', `Pointed stones dug into ${source.name}!`);
					}
					if (target.side.getSideCondition('stickyweb') || target.side.foe.getSideCondition('stickyweb')) {
						if (!success) {
							success = true;
							this.add('-ability', target, 'Gravitational Pull');
						}
						this.add('-activate', source, 'move: Sticky Web');
						this.boost({spe: -1}, source, target, this.dex.getActiveMove('stickyweb'));
					}
					if (target.side.getSideCondition('gmaxsteelsurge') || target.side.foe.getSideCondition('gmaxsteelsurge')) {
						if (!success) {
							success = true;
							this.add('-ability', target, 'Gravitational Pull');
						}
						const steelHazard = this.dex.getActiveMove('Stealth Rock');
						steelHazard.type = 'Steel';
						const typeMod = this.clampIntRange(source.runEffectiveness(steelHazard), -6, 6);
						this.damage(source.maxhp * Math.pow(2, typeMod) / 8, source, target);
						// this.add('-message', `${source.name} was hurt by the sharp spikes!`);
					}
				}
			},
		},
		hazardImmune: true,
		rating: 3,
		num: -59,
	},
	chakralock: {
		desc: "After this Pokémon uses an attack that is super effective on the target, the target is burned.",
		shortDesc: "After an attack that is super effective on the target, the target is burned.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && target.getMoveHitData(move).typeMod > 0) {
				target.trySetStatus('brn', source);
			}
		},
		name: "Chakra Lock",
		rating: 3,
		num: -60,
	},
	vajra: {
		desc: "This Pokémon's Dark-type moves become Electric-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokémon's Dark-type moves become Electric-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Dark' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Electric';
				(move as any).vajraBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if ((move as any).vajraBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Vajra",
		rating: 4,
		num: -61,
	},
	innerfortitude: {
		desc: "When this Pokémon has 1/2 or less of its maximum HP, rounded down, its Defense and Special Defense are doubled. This Pokémon also cannot fall asleep. Gaining this Ability while asleep cures it.",
		shortDesc: "At 1/2 or less of max HP, Defense and Special Defense are doubled. Cannot fall asleep.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				this.debug('Inner Fortitude boost');
				return this.chainModify(2);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				this.debug('Inner Fortitude boost');
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Inner Fortitude');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Inner Fortitude');
			}
			return false;
		},
		name: "Inner Fortitude",
		rating: 4,
		num: -62,
	},
	buildup: {
		desc: "This Pokémon restores 1/8 of its maximum HP, rounded down, at the end of each full turn if it uses an attacking move, but only if it was not hit by a damaging move in the same turn.",
		shortDesc: "Healed by 1/8 of its max HP each attacking turn; fails if attacked same turn.",
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('buildup');
		},
		onPrepareHit(source, target, move) {
			if (move.category === 'Status') {
				source.addVolatile('buildup');
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns && !pokemon.volatiles['buildup']) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		condition: {
			duration: 1,
		},
		name: "Buildup",
		rating: 4,
		num: -63,
	},
	implode: {
		desc: "This Pokémon does not suffer the drawbacks of recoil moves and sacrificial moves as long as a target is successfully KOed.",
		shortDesc: "If it KOs a target, ignores recoil and self-KO effects of that move.",
		onModifyMove(move) {
			if (move.recoil || move.mindBlownRecoil || (move.selfdestruct && move.selfdestruct === 'always')) {
				this.effectData.target.addVolatile('implode');
				this.effectData.target.volatiles['implode'].move = move;
				this.effectData.target.volatiles['implode'].recoil = move.recoil;
				this.effectData.target.volatiles['implode'].mindBlownRecoil = move.mindBlownRecoil;
				delete move.recoil;
				delete move.mindBlownRecoil;
				if (move.selfdestruct && move.selfdestruct === 'always') {
					this.effectData.target.volatiles['implode'].selfdestruct = move.selfdestruct;
					delete move.selfdestruct;
				}
			}
		},
		onPrepareHit(target, source, move) {
			if (!this.effectData.target.volatiles['implode']) return;
			if (this.effectData.target.volatiles['implode'].selfdestruct) this.add('-anim', target, "Breakneck Blitz", target);
		},
		condition: {
			duration: 1,
			onAfterMove(source, target, move) {
				for (const pokemon of this.getAllActive()) {
					if (pokemon === source) continue;
					if (!pokemon.hp) {
						source.removeVolatile('implode');
						return;
					}
				}
				if (this.effectData.recoil && move.totalDamage) {
					if (!this.activeMove) throw new Error("Battle.activeMove is null");
					this.damage(this.clampIntRange(Math.round(this.activeMove.totalDamage * this.effectData.recoil![0] / this.effectData.recoil![1]), 1), source, source, 'recoil');
				}
				if (this.effectData.mindBlownRecoil) {
					this.damage(Math.round(source.maxhp / 2), source, source, this.dex.getEffect('Mind Blown'), true);
				}
				if (this.effectData.selfdestruct) {
					this.faint(source, source, this.effectData.move);
				}
				source.removeVolatile('implode');
			},
		},
		name: "Implode",
		rating: 4,
		num: -64,
	},
	mindrider: {
		shortDesc: "If Psychic Terrain is active, this Pokémon's Speed is doubled.",
		onModifySpe(spe) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents Speed increase');
					return;
				}
			}
			if (this.field.isTerrain('psychicterrain')) {
				return this.chainModify(2);
			}
		},
		name: "Mind Rider",
		rating: 2.5,
		num: -65,
	},
	erraticcode: {
		desc: "While this Pokémon is present, all Pokémon are prevented from from using the same move twice in a row.",
		shortDesc: "While present, all Pokémon are prevented from using the same move twice in a row.",
		onStart(source) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (!activated) {
					this.add('-ability', source, 'Erratic Code');
				}
				activated = true;
				if (!pokemon.volatiles['torment']) {
					pokemon.addVolatile('torment');
				}
			}
		},
		onAnySwitchIn(pokemon) {
			if (!pokemon.volatiles['torment']) {
				pokemon.addVolatile('torment');
			}
		},
		onEnd(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('erraticcode')) return;
			}
			for (const target of this.getAllActive()) {
				target.removeVolatile('torment');
			}
		},
		name: "Erratic Code",
		rating: 3.5,
		num: -66,
	},
	cheapheat: {
		desc: "When this Pokémon uses an attacking move, before the move hits, the Pokémon's attacking stat and the target's defending stat are raised by 1 stage. The stats that were raised are lowered by 1 stage after the move hits.",
		shortDesc: "User's attacking stat and foe's defending stat: +1 before move, -1 after move.",
		onBeforeMove(source, target, move) {
			if (!move.basePower || target === source || move.spreadHit) return;
			let activated = false;
			let attackingStat = 'atk';
			let defendingStat = 'def';
			if (move.category === 'Special') {
				attackingStat = 'spa';
			}
			if (move.useSourceDefensiveAsOffensive) {
				attackingStat = attackingStat === 'atk' ? 'def' : 'spd';
			}
			if (move.defensiveCategory) {
				defendingStat = move.defensiveCategory === 'Physical' ? 'def' : 'spd';
			} else {
				defendingStat = move.category === 'Physical' ? 'def' : 'spd';
			}
			this.add('-ability', source, 'Cheap Heat', 'boost');
			if (move.useTargetOffensive) {
				const cheapHeatBoost: SparseBoostsTable = {};
				if (attackingStat === 'atk') cheapHeatBoost.atk = 1;
				if (attackingStat === 'def' || defendingStat === 'def') cheapHeatBoost.def = 1;
				if (attackingStat === 'spa') cheapHeatBoost.spa = 1;
				if (attackingStat === 'spd' || defendingStat === 'spd') cheapHeatBoost.spd = 1;
				target.addVolatile('cheapheat');
				target.volatiles['cheapheat'].source = source;
				target.volatiles['cheapheat'].boost = cheapHeatBoost;
				this.runEvent('CheapHeat', target);
			} else {
				let cheapHeatBoostSource: SparseBoostsTable = {};
				let cheapHeatBoostTarget: SparseBoostsTable = {};
				source.addVolatile('cheapheat');
				source.volatiles['cheapheat'].source = source;
				source.volatiles['cheapheat'].boost = cheapHeatBoostSource;
				if (attackingStat === 'atk') source.volatiles['cheapheat'].boost.atk = 1;
				if (attackingStat === 'def') source.volatiles['cheapheat'].boost.def = 1;
				if (attackingStat === 'spa') source.volatiles['cheapheat'].boost.spa = 1;
				if (attackingStat === 'spd') source.volatiles['cheapheat'].boost.spd = 1;
				this.runEvent('CheapHeat', source);
				target.addVolatile('cheapheat');
				target.volatiles['cheapheat'].source = source;
				target.volatiles['cheapheat'].boost = cheapHeatBoostTarget;
				if (defendingStat === 'def') target.volatiles['cheapheat'].boost.def = 1;
				if (defendingStat === 'spd') target.volatiles['cheapheat'].boost.spd = 1;
				this.runEvent('CheapHeat', target);
			}
		},
		onAfterMove(source, target, move) {
			for (const defender of this.getAllActive()) {
				this.runEvent('ReverseCheapHeat', defender);
			}
		},
		onEnd(pokemon) {
			for (const defender of this.getAllActive()) {
				this.runEvent('ReverseCheapHeat', defender);
			}
		},
		condition: {
			onCheapHeat(pokemon) {
				this.boost(this.effectData.boost, pokemon, this.effectData.source, null, true);
				this.effectData.activeMove = this.activeMove;
				this.effectData.completed = true;
			},
			onReverseCheapHeat(pokemon) {
				if (!pokemon.hp) return;
				let i: BoostName;
				for (i in this.effectData.boost) {
					this.effectData.boost[i]! *= -1;
				}
				this.boost(this.effectData.boost, pokemon, this.effectData.source, null, true);
				pokemon.removeVolatile('cheapheat');
			},
		},
		name: "Cheap Heat",
		rating: 3,
		num: -67,
	},
	staccato: {
		desc: "If this Pokémon cures an opposing Pokémon's non-volatile status condition, the affected Pokémon will be paralyzed.",
		shortDesc: "When curing a foe's status (ex. Purify, Sparkling Aria), replaces with paralysis.",
		onBeforeMove(source, target, move) {
			if (['purify', 'sparklingaria', 'wakeupslap', 'smellingsalts', 'uproar'].includes(move.id)) {
				target.addVolatile('staccato', this.effectData.target);
			}
		},
		condition: {
			duration: 1,
			onEnd(pokemon) {
				if (this.effectData.busted) {
					this.add('-ability', this.effectData.source, 'Staccato');
					pokemon.setStatus('par', this.effectData.source);
				}
			},
			onAfterMoveSecondary(source, target, move) {
				target.removeVolatile('staccato');
			},
		},
		name: "Staccato",
		rating: 3,
		num: -68,
	},
	gyaru: {
		desc: "This Pokémon's Fighting-type moves become Fire-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokémon's Fighting-type moves become Fire-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Fighting' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fire';
				(move as any).gyaruBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if ((move as any).gyaruBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Gyaru",
		rating: 4,
		num: -69,
	},
	electroplating: {
		desc: "This Pokémon's Electric-type attacks that make contact cause the Steel type to be added to the target, effectively making it have two or three types. Has no effect if the target is already a Steel-type. If Forest's Curse, Trick-or-Treat or Autumn Leaves adds a type to the target, it replaces the type added by this Ability and vice versa.",
		shortDesc: "This Pokémon's Electric contact moves add steel to the targets' type(s).",
		onSourceHit(target, source, move) {
			if (move.type === 'Electric' && move.flags['contact']) {
				if (target.hasType('Steel')) return;
				if (!target.addType('Steel')) return;
				this.add('-start', target, 'typeadd', 'Steel', '[from] Ability: Electroplating');
			}
		},
		name: "Electroplating",
		rating: 4,
		num: -70,
	},
	comedian: {
		desc: "This Pokémon is immune to Fairy-type moves. When hit by a Fairy-type move, it raises its Attack and its adjacent allies' Attack by 1 stage each.",
		shortDesc: "Fairy immunity; user's Attack and allies' Attack are both raised 1 stage if user is hit by a Fairy move.",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				let activated = false;
				for (const ally of target.side.active) {
					if (!ally || (!this.isAdjacent(ally, target) && ally !== target)) continue;
					if (!activated) {
						this.add('-ability', target, 'Comedian', 'boost');
						this.add('-message', `${target.name} is howling with laughter!`);
						activated = true;
					}
					this.boost({atk: 1}, ally, target, null, true);
				}
				if (!activated) {
					this.add('-immune', target, '[from] ability: Comedian');
					this.add('-message', `${target.name} is howling with laughter!`);
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (target === this.effectData.target || target.side !== source.side) return;
			if (move.type === 'Fairy') {
				let activated = false;
				for (const ally of target.side.active) {
					if (!ally || (!this.isAdjacent(ally, target) && ally !== target)) continue;
					if (!activated) {
						this.add('-ability', target, 'Comedian', 'boost');
						this.add('-message', `${target.name} is howling with laughter!`);
						activated = true;
					}
					this.boost({atk: 1}, ally, target, null, true);
				}
			}
		},
		name: "Comedian",
		rating: 3,
		num: -71,
	},
	pacifyingpelt: {
		desc: "This Pokémon is immune to Fighting-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Fighting-type move.",
		shortDesc: "This Pokémon heals 1/4 of its max HP when hit by Fighting moves; Fighting immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fighting') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Pacifying Pelt');
				}
				return null;
			}
		},
		name: "Pacifying Pelt",
		rating: 4,
		num: -72,
	},
	alluring: {
		shortDesc: "This Pokémon removes the pivoting effect of opposing Pokémon's moves.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Alluring');
			this.add('-message', `Pokémon opposing ${pokemon.name} can't pivot out of battle!`);
		},
		onAnyModifyMove(move, pokemon) {
			if (pokemon.side === this.effectData.target.side) return;
			if (move.selfSwitch && !move.ignoreAbility) delete move.selfSwitch;
		},
		name: "Alluring",
		rating: 4,
		num: -73,
	},
	rebel: {
		shortDesc: "This Pokémon and allies: 1.3x damage when any Pokémon has stat drops.",
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			let rebel = null;
			for (const pokemon of this.getAllActive()) {
				let statDrop: BoostName;
				for (statDrop in pokemon.boosts) {
					if (pokemon.boosts[statDrop] < 0) rebel = true;
				}
			}
			if (rebel) {
				this.debug('Rebel boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		name: "Rebel",
		rating: 2.5,
		num: -74,
	},
	agitate: {
		desc: "When this Pokémon raises or lowers another Pokémon's stat stages, the effect is increased by one stage for each affected stat.",
		shortDesc: "Increases stat stage changes the Pokémon inflicts by 1 stage.",
		onAnyBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			if (!target || !source || target === source || source !== this.effectData.target) return; // doesn't work on itself
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) boost[i]! -= 1; // exacerbate debuffs
				if (boost[i]! > 0) boost[i]! += 1; // augment buffs
			}
		},
		name: "Agitate",
		rating: 3,
		num: -75,
	},
	snowflake: {
		desc: "After this Pokémon takes damage from a Rock-type move, including Stealth Rock, it also sets up Aurora Veil regardless of the current weather. It can still set an Aurora Veil even if the damage knocks it out.",
		shortDesc: "Sets up Aurora Veil after taking Rock damage, Stealth Rock - even if it faints.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && ((effect.effectType === 'Move' && effect.type === 'Rock') || (effect.id === 'stealthrock'))
			) {
				this.effectData.veiled = true;
			}
		},
		onUpdate(pokemon) {
			if (this.effectData.veiled) {
				this.effectData.veiled = null;
				this.add('-ability', pokemon, 'Snowflake');
				pokemon.side.addSideCondition('auroraveil');
			}
		},
		onFaint(pokemon) {
			if (this.effectData.veiled) {
				this.effectData.veiled = null;
				this.add('-ability', pokemon, 'Snowflake');
				pokemon.side.addSideCondition('auroraveil');
			}
		},
		name: "Snowflake",
		rating: 3.5,
		num: -76,
	},
	lethality: {
		desc: "This Pokémon's blade-based and slashing moves have power doubled against a target whose HP is full.",
		shortDesc: "Slashing moves: doubled damage if the target has full HP.",
		onModifyMove(critRatio, source, target, move) {
			if (bladeMoves.includes(move.id) && move.basePower && target.hp === target.maxhp) {
				move.basePower *= 2;
			}
		},
		name: "Lethality",
		rating: 3.5,
		num: -77,
	},
	queensgambit: {
		desc: "If this Pokémon switched in on the same turn, priority moves from opposing Pokémon targeted at itself or at allies are prevented from having an effect. If this Ability is activated, its own first move then has increased priority.",
		shortDesc: "Only while switching in, protects the team from priority; gains +1 priority on its next move if it does.",
		onFoeTryMove(target, source, move) {
			if (this.effectData.target.activeTurns) return;
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectData.target;
			if ((source.side === dazzlingHolder.side || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', target, "ability: Queen's Gambit", move, '[of] ' + dazzlingHolder);
				this.effectData.target.addVolatile('queensgambit');
				return false;
			}
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-message', `${pokemon.name} is ready to strike back!`);
			},
			onModifyPriority(priority, pokemon, target, move) {
				return priority + 1;
			},
		},
		name: "Queen's Gambit",
		rating: 2,
		num: -78,
	},
	uplifting: {
		shortDesc: "While this Pokémon is present, all Pokémon are non-grounded.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Uplifting');
			this.add('-message', `While ${pokemon.name} is present, all Pokémon are non-grounded.`);
		},
		// effect is in scripts.ts
		name: "Uplifting",
		rating: 4,
		num: -79,
	},
};
