/*

List of flags and their descriptions:

authentic: Ignores a target's substitute.
bite: Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw.
bullet: Has no effect on Pokemon with the Ability Bulletproof.
charge: The user is unable to make a move between turns.
contact: Makes contact.
dance: When used by a Pokemon, other Pokemon with the Ability Dancer can attempt to execute the same move.
defrost: Thaws the user if executed successfully while the user is frozen.
distance: Can target a Pokemon positioned anywhere in a Triple Battle.
gravity: Prevented from being executed or selected during Gravity's effect.
heal: Prevented from being executed or selected during Heal Block's effect.
mirror: Can be copied by Mirror Move.
mystery: Unknown effect.
nonsky: Prevented from being executed or selected in a Sky Battle.
powder: Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles.
protect: Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield.
pulse: Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher.
punch: Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist.
recharge: If this move is successful, the user must recharge on the following turn and cannot make a move.
reflectable: Bounced back to the original user by Magic Coat or the Ability Magic Bounce.
snatch: Can be stolen from the original user and instead used by another Pokemon using Snatch.
sound: Has no effect on Pokemon with the Ability Soundproof.

*/

'use strict';

/**@type {{[k: string]: MoveData}} */
let BattleMovedex = {
	
    "fireball": {
        num: 40001,
        accuracy: 100,
        basePower: 85,
        category: "Physical",
        desc: "Has a 10% chance to burn the target. The target thaws out if it is frozen.",
        shortDesc: "10% chance to dburn the target. Thaws target.",
        id: "fireball",
        isViable: true,
        name: "Fireball",
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, defrost: 1},
        thawsTarget: true,
        secondary: {
            chance: 10,
            status: 'brn',
        },
        target: "normal",
        type: "Fire",
        zMovePower: 160,
    },
    "chargeshot": {
        num: 40002,
        accuracy: 100,
        basePower: 95,
        category: "Special",
        desc: "No secondary effect.",
        shortDesc: "No secondary effect.",
        id: "chargeshot",
        isViable: true,
        name: "Charge Shot",
        pp: 10,
        priority: 0,
        flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
        secondary: false,
        target: "any",
        type: "Electric",
        zMovePower: 175,
     },
		"monadopurge": {
			num: 40003,
			accuracy: 100,
			basePower: 80,
			category: "Special",
			desc: "The target's Ability is rendered ineffective as long as it remains active. If the target uses Baton Pass, the replacement will remain under this effect. If the target's Ability is Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode, this effect does not happen, and receiving the effect through Baton Pass ends the effect immediately.",
			shortDesc: "Nullifies the target's Ability.",
			id: "monadopurge",
			name: "Monado Purge",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			volatileStatus: 'gastroacid',
			secondary: null,
			target: "normal",
			type: "Psychic",
			zMovePower: 160,
		},
		"monadoeater": {
			num: 40004,
			accuracy: 100,
			basePower: 20,
			basePowerCallback(pokemon, target) {
				let power = 20 + 20 * target.positiveBoosts();
				if (power > 200) power = 200;
				return power;
			},
			category: "Physical",
			desc: "Power is equal to 20+(X*20), where X is the target's total stat stage changes that are greater than 0, but not more than 200 power. Resets all of the target's stat stages to 0.",
			shortDesc: "20 power +20 for each of the target's stat boosts. Resets all of the target's stat stages to 0.",
			id: "monadoeater",
			name: "Monado Eater",
			pp: 5,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			secondary: null,
			target: "normal",
			type: "Fighting",
			zMovePower: 120,
		},
		"monadobuster": {
			num: 40005,
			accuracy: true,
			basePower: 200,
			category: "Physical",
			desc: "This move becomes a special attack if the target's Defense is greater than its Special Defense, including stat stage changes.",
			shortDesc: "Special if target's Def > Sp. Def.",
			id: "monadobuster",
			name: "Monado Buster",
			pp: 1,
			priority: 0,
			flags: {contact: 1},
			onModifyMove(move, pokemon, target) {
				if (target.getStat('def', false, true) > target.getStat('spd', false, true)) move.category = 'Special';	
			},
			isZ: "shulkiumz",
			secondary: null,
			target: "normal",
			type: "Fighting",
			contestType: "Cool",
		},
		"deploymissiles": {
			num: 40006,
			accuracy: 90,
			basePower: 25,
			category: "Physical",
			desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.",
			shortDesc: "Hits 2-5 times in one turn.",
			id: "deploymissiles",
			isViable: true,
			name: "Deploy Missiles",
			pp: 10,
			priority: 0,
			flags: {bullet: 1, protect: 1, mirror: 1},
			multihit: [2, 5],
			secondary: null,
			target: "normal",
			type: "Steel",
			zMovePower: 140,
			contestType: "Tough",
		},
		"starspit": {
			num: 40007,
			accuracy: 100,
			basePower: 80,
			basePowerCallback(pokemon, target, move) {
				if (target.newlySwitched || this.willMove(target)) {
					this.debug('Payback NOT boosted');
					return move.basePower;
				}
				this.debug('Payback damage boost');
				return move.basePower * 1.5;
			},
			category: "Physical",
			desc: "Power multiplies by 1.5 if the user moves after the target this turn, including actions taken through Instruct or the Dancer Ability. Switching in does not count as an action. This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
			shortDesc: "Power multiplies by 1.5 if the user moves after the target. Physical if user's Atk > Sp. Atk.",
			id: "starspit",
			name: "Star Spit",
			pp: 15,
			priority: 0,
			flags: {protect: 1, mirror: 1},
			onModifyMove(move, pokemon) {
				if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
			},
			secondary: null,
			target: "normal",
			type: "Flying",
			zMovePower: 160,
			contestType: "Cute",
		},
	"jambaspear": {
		num: 40008,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a 10% chance to paralyze the target.",
		shortDesc: "10% chance to paralyze the target.",
		id: "jambaspear",
		isViable: true,
		name: "Jamba Spear",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		zMovePower: 175,
		contestType: "Cool",
	},
	"devilsknife": {
		num: 40009,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user spends two or three turns locked into this move and becomes confused immediately after its move on the last turn of the effect if it is not already. This move targets an opposing Pokemon at random on each turn. If the user is prevented from moving, is asleep at the beginning of a turn, or the attack is not successful against the target on the first turn of the effect or the second turn of a three-turn effect, the effect ends without causing confusion. If this move is called by Sleep Talk and the user is asleep, the move is used for one turn and does not confuse the user.",
		shortDesc: "Lasts 2-3 turns. Confuses the user afterwards.",
		id: "devilsknife",
		isViable: true,
		name: "Devilsknife",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove(pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		secondary: null,
		target: "randomNormal",
		type: "Dark",
		zMovePower: 190,
		contestType: "Cool",
	},
	"dashslash": {
		num: 40010,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "User switches out after damaging the target.",
		id: "dashslash",
		isViable: true,
		name: "Dash Slash",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Steel",
		zMovePower: 140,
		contestType: "Cool",
	},
	"assassinate": {
		num: 40011,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Ignores the target's stat stage changes, including evasiveness.",
		shortDesc: "Ignores the target's stat stage changes.",
		id: "assassinate",
		isViable: true,
		name: "Assassinate",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: null,
		target: "normal",
		type: "Dark",
		zMovePower: 175,
		contestType: "Tough",
	},
	"etherealroller": {
		num: 40012,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to flinch the target.",
		id: "etherealroller",
		isViable: true,
		name: "Ethereal Roller",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ghost",
		zMovePower: 160,
		contestType: "Cool",
	},
	"minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed, Body Slam, Dragon Rush, Ethereal Roller, Flying Press, Heat Crash, Heavy Slam, Malicious Moonsault, Steamroller, and Stomp will not check accuracy and have their damage doubled if used against the user while it is active.",
		shortDesc: "Raises the user's evasiveness by 2.",
		id: "minimize",
		name: "Minimize",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'minimize',
		effect: {
			noCopy: true,
			onSourceModifyDamage(damage, source, target, move) {
				if (['stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'etherealroller'].includes(move.id)) {
					return this.chainModify(2);
				}
			},
			onAccuracy(accuracy, target, source, move) {
				if (['stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'etherealroller'].includes(move.id)) {
					return true;
				}
				return accuracy;
			},
		},
		boosts: {
			evasion: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMoveEffect: 'clearnegativeboost',
		contestType: "Cute",
	},
	"purry": {
		num: 40013,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			if (!pokemon.volatiles['purry']) return 0;
			return pokemon.volatiles['purry'].damage || 1;
		},
		category: "Physical",
		desc: "Deals damage to the last opposing Pokemon to hit the user with an attack this turn equal to 1.5 times the HP lost by the user from that attack, rounded down. If the user did not lose HP from the attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's attack this turn.",
		shortDesc: "If hit by an attack, returns 1.5x damage.",
		id: "purry",
		name: "Purry",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('purry');
		},
		onTryHit(target, source, move) {
			if (!source.volatiles['purry']) return false;
			if (source.volatiles['purry'].position === null) return false;
		},
		effect: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectData.position = null;
				this.effectData.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectData.target) return;
				return source.side.foe.active[this.effectData.position];
			},
			onAfterDamage(damage, target, source, effect) {
				if (effect && effect.effectType === 'Move' && source.side !== target.side) {
					this.effectData.position = source.position;
					this.effectData.damage = 1.5 * damage;
				}
			},
		},
		secondary: null,
		target: "scripted",
		type: "Normal",
		ignoreImmunity: true,
		zMovePower: 100,
		contestType: "Cute",
	},
	"crystalspin": {
		num: 40014,
		accuracy: true,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 10 * (move.hit + 1);
		},
		category: "Physical",
		desc: "Hits three times. Power increases to 30 for the second hit and 40 for the third. This move does not check accuracy. If one of the hits breaks the target's substitute, it will take damage for the remaining hits.",
		shortDesc: "Hits 3 times. This move does not check accuracy.",
		id: "crystalspin",
		name: "Crystal Spin",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		secondary: null,
		target: "normal",
		type: "Ice",
		zMovePower: 120,
		contestType: "Cool",
	},
	"angelicflare": {
		num: 40015,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "angelicflare",
		isViable: true,
		name: "Angelic Flare",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMovePower: 180,
		contestType: "Beautiful",
	},
	"reanimate": {
		num: 40016,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. The user cures its burn, poison, or paralysis. Fails if the user is not burned, poisoned, or paralyzed.",
		shortDesc: "Heals the user by 50% of its max HP. User cures its burn, poison, or paralysis.",
		id: "reanimate",
		isViable: true,
		name: "Reanimate",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onHit(pokemon) {
			if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
			pokemon.cureStatus();
		},
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Ghost",
		zMoveEffect: 'clearnegativeboost',
		contestType: "Clever",
	},
	"greatslash": {
		num: 40017,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "Lowers the user's Defense and Speed by 1 stage.",
		shortDesc: "Lowers the user's Defense and Speed by 1.",
		id: "greatslash",
		isViable: true,
		name: "Great Slash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		self: {
			boosts: {
				def: -1,
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		zMovePower: 190,
		contestType: "Tough",
	},
	"fujiwaravolcano": {
		num: 40018,
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		desc: "Has a 30% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 1/2 recoil. 30% chance to burn.",
		id: "fujiwaravolcano",
		isViable: true,
		name: "Fujiwara Volcano",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [1, 2],
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		zMovePower: 200,
		contestType: "Tough",
	},
	"iceklone": {
		num: 40019,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/16 of their maximum HP, rounded down, and have their Speed lowered by 1 stage. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.",
		shortDesc: "Protects from moves. Contact: loses 1/16 max HP, lowers Spe by 1.",
		id: "iceklone",
		isViable: true,
		name: "Ice Klone",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'iceklone',
		onTryHit(target, source, move) {
			return !!this.willAct() && this.runEvent('StallMove', target);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		effect: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (move.isZ) move.zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.damage(source.maxhp / 16, source, target);
					this.boost({spe: -1}, source, target, this.getActiveMove("Ice Klone"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZPowered && move.flags['contact']) {
					this.damage(source.maxhp / 16, source, target);
					this.boost({spe: -1}, source, target, this.getActiveMove("Ice Klone"));
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Ice",
		zMoveBoost: {def: 1},
		contestType: "Cool",
	},
// "digslash": {
//         num: 40000,
//         accuracy: 100,
//         basePower: 95,
//         category: "Physical",
//         desc: "Has a higher chance for a critical hit.",
//         shortDesc: "High critical hit ratio",
//         id: "digslash",
//         name: "Dig Slash",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1, authentic: 1, contact: 1, distance: 1},
//         critRatio: 2,
//         secondary: false,
//         target: "normal",
//         type: "Ground",
//         zMovePower: 175,
//     },
//     "chargehandle": {
//         num: 40001,
//         accuracy: 90,
//         basePower: 150,
//         category: "Physical",
//         desc: "This attack charges on the first turn and executes on the second. Lowers speed by 1 stage after use. Breaks the foes protection.",
//         shortDesc: "Charges, then hits turn 2. Breaks protection. Lowers speed after use.",
//         id: "chargehandle",
//         name: "Charge Handle",
//         pp: 5,
//         priority: 0,
//         flags: {contact: 1, charge: 1, mirror: 1},
//         breaksProtect: true,
//         secondary: false,
//         target: "normal",
//         type: "Steel",
//         zMovePower: 200,
//     },
//     "hairwhip": {
//         num: 40002,
//         accuracy: 90,
//         basePower: 120,
//         category: "Physical",
//         desc: "Has a higher chance for a critical hit.",
//         shortDesc: "High critical hit ratio.",
//         id: "hairwhip",
//         name: "Hair Whip",
//         pp: 10,
//         priority: 0,
//         flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
//         critRatio: 2,
//         secondary: false,
//         target: "normal",
//         type: "Psychic",
//         zMovePower: 190,
//         contestType: "Tough",
//     },
//     "phasingram": {
//         num: 40004,
//         accuracy: 100,
//         basePower: 90,
//         category: "Physical",
//         desc: "Ignores the target's stat stage changes, including evasiveness.",
//         shortDesc: "Ignores the target's stat stage changes.",
//         id: "phasingram",
//         isViable: true,
//         name: "Phasing Ram",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         ignoreEvasion: true,
//         ignoreDefensive: true,
//         secondary: false,
//         target: "normal",
//         type: "Ghost",
//         zMovePower: 175,
//     },
//         "knifetoss": {
//         num: 40005,
//         accuracy: 95,
//         basePower: 55,
//         category: "Special",
//         desc: "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. Each hit has 30% chance to badly poison the target.",
//         shortDesc: "Hits 2 times in one turn. 30% chance to badly poison target per hit.",
//         id: "knifetoss",
//         isViable: true,
//         name: "Knife Toss",
//         pp: 5,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         multihit: 2,
//         secondary: {
//             chance: 30,
//             status: 'tox',
//         },
//         target: "normal",
//         type: "Flying",
//         zMovePower: 180,
//     },
//     "liarshot": {
//         num: 40006,
//         accuracy: 100,
//         basePower: 80,
//         category: "Physical",
//         desc: "Has a 30% chance to flinch the target.",
//         shortDesc: "30% chance to flinch the target.",
//         id: "liarshot",
//         isViable: true,
//         name: "Liar Shot",
//         pp: 15,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         secondary: {
//             chance: 30,
//             volatileStatus: 'flinch',
//         },
//         target: "normal",
//         type: "Dark",
//         zMovePower: 160,
//     },
//     "thorntrap": {
//         num: 40007,
//         accuracy: 95,
//         basePower: 35,
//         category: "Physical",
//         desc: "Prevents the target from switching for four or five turns; seven turns if the user is holding Grip Claw. Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute. This effect is not stackable or reset by using this or another partial-trapping move.",
//         shortDesc: "Traps and damages the target for 4-5 turns.",
//         id: "thorntrap",
//         name: "Thorn Trap",
//         pp: 20,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         volatileStatus: 'partiallytrapped',
//         secondary: false,
//         target: "normal",
//         type: "Grass",
//         zMovePower: 100,
//     },
//     "sunrise": {
//         num: 40007,
//         accuracy: true,
//         basePower: 0,
//         category: "Status",
//         desc: "The user restores 66.7% of its maximum HP, rounded half up.",
//         shortDesc: "Heals the user by 66.7% of its max HP.",
//         id: "sunrise",
//         isViable: true,
//         name: "Sunrise",
//         pp: 5,
//         priority: 0,
//         flags: {snatch: 1, heal: 1},
//         heal: [2, 3],
//         secondary: false,
//         target: "self",
//         type: "Fire",
//         zMoveEffect: 'clearnegativeboost',
//     },
//     "rockout": {
//         num: 40008,
//         accuracy: 100,
//         basePower: 100,
//         category: "Special",
//         desc: "If it hits a target, wakes them up. Hits all adjacent foes.",
//         shortDesc: "The target wakes up.",
//         id: "rockout",
//         name: "Rock Out",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
//         secondary: {
//             dustproof: true,
//             chance: 100,
//             onHit: function (target) {
//                 if (target.status === 'slp') target.cureStatus();
//             },
//         },
//         target: "allAdjacent",
//         type: "Rock",
//         zMovePower: 180,
//     },
//     "minigun": {
//         num: 40009,
//         accuracy: 100,
//         basePower: 0,
//         basePowerCallback: function (pokemon, target) {
//             let power = (Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) || 1);
//             if (power > 150) power = 150;
//             this.debug('' + power + ' bp');
//             return power;
//         },
//         category: "Special",
//         desc: "Power is equal to (25 * target's current Speed / user's current Speed), rounded down, + 1, but not more than 150.",
//         shortDesc: "More power the slower the user than the target.",
//         id: "minigun",
//         isViable: true,
//         name: "Minigun",
//         pp: 5,
//         priority: 0,
//         flags: {bullet: 1, protect: 1, mirror: 1},
//         secondary: false,
//         target: "normal",
//         type: "Normal",
//         zMovePower: 160,
//     },
//     "fantasyseal": {
//         num: 40010,
//         accuracy: true,
//         basePower: 90,
//         category: "Special",
//         desc: "This move's type effectiveness against Dark and Ghost is changed to be super effective no matter what this move's type is.",
//         shortDesc: "Super effective on Dark and Ghost.",
//         id: "fantasyseal",
//         isViable: true,
//         name: "Fantasy Seal",
//         pp: 20,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         onEffectiveness: function (typeMod, type) {
//             if (type === 'Dark' || type === 'Ghost') return 1;
//         },
//         secondary: false,
//         target: "normal",
//         type: "Flying",
//         zMovePower: 140,
//     },
//     "genkigirl": {
//         num: 40011,
//         accuracy: true,
//         basePower: 0,
//         category: "Status",
//         desc: "The user restores 1/2 of its maximum HP, rounded half up. The user is healed of major status conditions.",
//         shortDesc: "Heals the user by 50% of its max HP. Major status conditions healed.",
//         id: "genkigirl",
//         isViable: true,
//         name: "Genki Girl",
//         pp: 10,
//         priority: 0,
//         flags: {snatch: 1, heal: 1},
//         heal: [1, 2],
//         onHit: function (pokemon) {
//             if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
//             pokemon.cureStatus();
//         },
//         secondary: false,
//         target: "self",
//         type: "Fairy",
//         zMoveEffect: 'clearnegativeboost',
//     },
//         "masterspark": {
//         num: 40012,
//         accuracy: 100,
//         basePower: 100,
//         category: "Special",
//         desc: "Has a 30% chance to lower the target's Special Defense by 1 stage.",
//         shortDesc: "30% chance to lower the target's Sp. Def by 1.",
//         id: "masterspark",
//         isViable: true,
//         name: "Master Spark",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         secondary: {
//             chance: 30,
//             boosts: {
//                 spd: -1,
//             },
//         },
//         target: "normal",
//         type: "Electric",
//         zMovePower: 180,
//     },
//     "pipewarp": {
//         num: 40013,
//         accuracy: 100,
//         basePower: 130,
//         category: "Special",
//         desc: "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.",
//         shortDesc: "Physical if user's Atk > Sp. Atk.",
//         id: "pipewarp",
//         isViable: true,
//         name: "Pipe Warp",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         onModifyMove: function (move, pokemon) {
//             if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
//         },
//         secondary: false,
//         target: "normal",
//         type: "Steel",
//         zMovePower: 195,
//     },
//     "chaosenergy": {
//         num: 40014,
//         accuracy: true,
//         basePower: 130,
//         category: "Special",
//         desc: "This move cannot be used successfully unless the user's current form, while considering Transform, is Sonic. If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.",
//         shortDesc: "Sonic: Breaks protection.",
//         id: "chaosenergy",
//         isViable: true,
//         name: "Chaos Energy",
//         pp: 5,
//         priority: 0,
//         flags: {mirror: 1, authentic: 1},
//         breaksProtect: true,
//         onTry: function (pokemon) {
//             if (pokemon.template.species === 'Sonic') {
//                 return;
//             }
//             this.add('-hint', "Only a Pokemon whose form is Sonic can use this move.");
//             if (pokemon.template.species === 'Hoopa') {
//                 this.add('-fail', pokemon, 'move: Chaos Energy', '[forme]');
//                 return null;
//             }
//             this.add('-fail', pokemon, 'move: Chaos Energy');
//             return null;
//         },
//         secondary: false,
//         target: "normal",
//         type: "Normal",
//         zMovePower: 195,
//     },
//     "leafviolin": {
//         num: 40015,
//         accuracy: 100,
//         basePower: 110,
//         category: "Special",
//         desc: "20% chance to raise Sp. Def by 1 stage.",
//         shortDesc: "20% chance to raise Sp. Def by 1. Hits adjacent foes.",
//         id: "leafviolin",
//         isViable: true,
//         name: "Leaf Violin",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
//         secondary: {
//             chance: 20,
//             self: {
//                 boosts: {
//                     spd: 1,
//                 },
//             },
//         },
//         target: "allAdjacentFoes",
//         type: "Grass",
//         zMovePower: 175,
//         contestType: "Cool",
//     },
//         "hammerthrow": {
//         num: 40016,
//         accuracy: 100,
//         basePower: 90,
//         category: "Physical",
//         desc: "Has a 30% chance to burn the target.",
//         shortDesc: "30% chance to burn the target.",
//         id: "hammerthrow",
//         isViable: true,
//         name: "Hammer Throw",
//         pp: 15,
//         priority: 0,
//         flags: {protect: 1, mirror: 1,},
//         thawsTarget: true,
//         secondary: {
//             chance: 30,
//             status: 'brn',
//         },
//         target: "normal",
//         type: "Flying",
//         zMovePower: 175,
//     },
//         "hammerbarrage": {
//         num: 40017,
//         accuracy: 100,
//         basePower: 20,
//         category: "Physical",
//         desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
//         shortDesc: "Hits 2-5 times in one turn.",
//         id: "hammerbarrage",
//         isViable: true,
//         name: "Hammer Barrage",
//         pp: 30,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         multihit: [2, 5],
//         secondary: false,
//         target: "normal",
//         type: "Rock",
//         zMovePower: 140,
//     },
//     "pinktyphoon": {
//         num: 40018,
//         accuracy: 85,
//         basePower: 100,
//         category: "Physical",
//         desc: "Has a 30% chance to confuse the target.",
//         shortDesc: "30% chance to confuse the target.",
//         id: "pinktyphoon",
//         name: "Pink Typhoon",
//         pp: 15,
//         priority: 0,
//         flags: {contact: 1, protect: 1, mirror: 1},
//         secondary: {
//             chance: 30,
//             volatileStatus: 'confusion',
//         },
//         target: "normal",
//         type: "Fairy",
//         zMovePower: 180,
//     },
//         "vanish": {
//         num: 40019,
//         accuracy: true,
//         basePower: 100,
//         category: "Physical",
//         desc: "If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. Only Zelda-Sheik or pokemon in the form of Zelda-Shiek may use this move.",
//         shortDesc: "Breaks the target's protection for this turn. Only usable on Zelda-Shiek.",
//         id: "vanish",
//         name: "Vanish",
//         pp: 5,
//         priority: 0,
//         flags: {mirror: 1, authentic: 1},
//         onTry: function (pokemon) {
//             if (pokemon.template.species === 'Zelda-Shiek') {
//                 return;
//             }
//             this.add('-hint', "Only a Pokemon whose form is Zelda-Shiek can use this move.");
//             if (pokemon.template.species === 'Zelda') {
//                 this.add('-fail', pokemon, 'move: Vanish', '[forme]');
//                 return null;
//             }
//             this.add('-fail', pokemon, 'move: Vanish');
//             return null;
//         },
//         breaksProtect: true,
//         secondary: false,
//         target: "normal",
//         type: "Psychic",
//         zMovePower: 180,
//     },
//     "warlockpunch": {
//         num: 40020,
//         accuracy: 100,
//         basePower: 110,
//         category: "Physical",
//         desc: "Has a 32% chance to flinch the target.",
//         shortDesc: "20% chance to flinch the target.",
//         id: "warlockpunch",
//         isViable: true,
//         name: "Warlock Punch",
//         pp: 10,
//         priority: 0,
//         flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
//         secondary: {
//             chance: 20,
//             volatileStatus: 'flinch',
//         },
//         target: "normal",
//         type: "Dark",
//         zMovePower: 185,
//     },
//     "crossslash": {
//         num: 40021,
//         accuracy: 90,
//         basePower: 30,
//         category: "Physical",
//         desc: "Hits two to four times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit four times.",
//         shortDesc: "Hits 2-4 times in one turn.",
//         id: "crossslash",
//         name: "Cross Slash",
//         pp: 20,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         multihit: [2, 4],
//         secondary: false,
//         target: "normal",
//         type: "Steel",
//         zMovePower: 140,
//     },
//     "thundaga": {
//         num: 40022,
//         accuracy: 100,
//         basePower: 80,
//         category: "Special",
//         desc: "No additional effect.",
//         shortDesc: "No additional effect.",
//         id: "thundaga",
//         isViable: true,
//         name: "Thundaga",
//         pp: 15,
//         priority: 0,
//         flags: {protect: 1,mirror: 1},
//         secondary: false,
//         target: "any",
//         type: "Electric",
//         zMovePower: 160,
//     },
//     "firaga": {
//         num: 40023,
//         accuracy: 100,
//         basePower: 80,
//         category: "Special",
//         desc: "No additional effect.",
//         shortDesc: "No additional effect.",
//         id: "firaga",
//         isViable: true,
//         name: "Firaga",
//         pp: 15,
//         priority: 0,
//         flags: {protect: 1,mirror: 1},
//         secondary: false,
//         target: "any",
//         type: "Fire",
//         zMovePower: 160,
//     },
//     "blizzaga": {
//         num: 40024,
//         accuracy: 100,
//         basePower: 80,
//         category: "Special",
//         desc: "No additional effect.",
//         shortDesc: "No additional effect.",
//         id: "blizzaga",
//         isViable: true,
//         name: "Blizzaga",
//         pp: 15,
//         priority: 0,
//         flags: {protect: 1,mirror: 1},
//         secondary: false,
//         target: "any",
//         type: "Ice",
//         zMovePower: 160,
//     },
//     "cannonballblast": {
//         num: 40026,
//         accuracy: 100,
//         basePower: 140,
//         category: "Physical",
//         desc: "Has a 10% chance to flinch the target.",
//         shortDesc: "10% chance to flinch the target.",
//         id: "cannonballblast",
//         isViable: true,
//         name: "Cannonball Blast",
//         pp: 10,
//         priority: 0,
//         flags: {protect: 1, mirror: 1},
//         secondary: {
//             chance: 10,
//             volatileStatus: 'flinch',
//         },
//         target: "normal",
//         type: "Steel",
//         zMovePower: 200,
//     },
};

exports.BattleMovedex = BattleMovedex;
