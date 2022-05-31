export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	chitinize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Bug';
				move.pixilateBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([4915, 4096]);
		},
		name: "Chitinize",
		desc: "This Pokemon's Normal-type moves become Bug-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Bug type and have 1.2x power.",
		rating: 4,
		num: 2001,
	},
	decoy: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType === 'Move' && ['carnivinepatratdex'].includes(target.species.id) && !target.transformed) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['carnivinepatratdex'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['carnivinepatratdex'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['carnivinepatratdex'].includes(pokemon.species.id) && this.effectData.busted) {
				const speciesid = pokemon.species.id === 'carnivinepatratdex' ? 'Carnivine-Patratdex-Revealed' : 'Carnivine-Patratdex-Revealed';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.getSpecies(speciesid));
			}
		},
		isPermanent: true,
		name: "Decoy",
		desc: "If this Pokemon is a Carnivine-Patratdex, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		shortDesc: "(Carnivine-Patratdex only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.",
		rating: 3.5,
		num: 2002,
	},
	electroreception: {
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('electroreception - enhancing accuracy');
			return this.chainModify([5325, 4096]);
		},
		name: "Electroreception",
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
		rating: 3,
		num: 2003,
	},
	fieldreport: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.id === 'sunnyday'  || move?.id === 'raindance' || move?.id === 'sandstorm' || move?.id === 'hail' || move?.id === 'grassyterrain' || move?.id === 'electricterrain' || move?.id === 'mistyterrain' || move?.id === 'psychicterrain') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		name: "Field Report",
		shortDesc: "This Pokemon's weather and terrain moves have their priority increased by 1.",
		rating: 4,
		num: 2004,
	},
	hammerhead: {
		onDamagingHit(damage, target, source, move) {
			if (target.transformed || target.isSemiInvulnerable()) return;
			if (['ostratahammer'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				target.formeChange('ostrata', move);
			}
		},
		// The Dig part of this mechanic is implemented in Dig's `onTryMove` in moves.ts
		onSourceTryPrimaryHit(target, source, effect) {
			if (effect && effect.id === 'drillrun' && source.hasAbility('hammerhead') && source.species.name === 'Ostrata' && !source.transformed) {
				const forme = source.hp <= source.maxhp / 2 ? 'ostratahammer' : 'ostratahammer';
				source.formeChange(forme, effect);
			}
		},
		isPermanent: true,
		name: "Hammer Head",
		desc: "If this Pokemon is an Ostrata, it changes forme when it hits a target with Drill Run or uses the first turn of Dig successfully. It becomes its Hammer form. If Ostrata gets hit in this form, rock shards fly out, even if it has no HP remaining. The shrapnel deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. Ostrata will return to normal if shards fly out or Ostrata switches out.",
		shortDesc: "When hit after Drill Run/Dig, attacker takes 1/4 max HP.",
		rating: 2.5,
		num: 2005,
	},
	hayveil: {
		onBeforeMovePriority: 0.5,
		onBeforeMove(attacker, defender, move) {
				if (attacker.species.baseSpecies !== 'Incrownito' || attacker.transformed) return;
				if (move.category === 'Status' && move.id !== 'wheatshield') return;
				const targetForme = (move.id === 'wheatshield' ? 'Incrownito' : 'Incrownito-Flock');
				if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		isPermanent: true,
		name: "Hay Veil",
		desc: "If this Pokemon is an Incrownito, it changes to Flock Forme before attempting to use an attacking move, and changes to Scarecrow Forme before attempting to use Wheat Shield.",
		shortDesc: "If Incrownito, changes Forme to Flock before attacks and Scarecrow before Wheat Shield.",
		rating: 4,
		num: 2006,
	},
	raingrow: {
		onStart(pokemon) {
			delete this.effectData.forme;
		},
		onUpdate(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Monsoonura' || pokemon.transformed) return;
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'monsoonurachunky') {
					pokemon.formeChange('Monsoonura-Chunky', this.effect, false, '[msg]');
				}
			} else {
				if (pokemon.species.id === 'monsoonurachunky') {
					pokemon.formeChange('Monsoonura', this.effect, false, '[msg]');
				}
			}
		},
		name: "Raingrow",
		desc: "If this Pokemon is a Monsoonura and Rain Dance is active, it changes to Chunky Form immediately. This form change is stopped and reverted while Monsoonura is holding a Utility Umbrella.",
		shortDesc: "If user is Monsoonura and Rain Dance is active, it becomes Chunky.",
		rating: 1,
		num: 2007,
	},
};
