export const Moves: {[k: string]: ModdedMoveData} = {
	coalsting: {
		num: 827,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Coal Sting",
		shortDesc: "30% chance to burn the target. Thaws target.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1},
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
    inkgulp: {
		num: 828,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Ink Gulp",
		shortDesc: "User recovers 50% of the damage dealt. Raises user's Special Attack by 1 if this KOes the target.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, heal: 1},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({spa: 1}, pokemon, pokemon, move);
		},
      drain: [3, 4],
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	bouldertoss: {
		num: 829,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Boulder Toss",
		shortDesc: "No additional effect.",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	icescream: {
		num: 830,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Ice Scream",
        shortDesc: "Lowers the user's Sp. Atk by 2.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	baitsplash: {
		num: 831,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		name: "Bait Splash",
        shortDesc: "Traps and damages the target for 4-5 turns.",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	hamsterslam: {
        accuracy: 100,
        basePower: 45,
        category: "Physical",
        name: "Hamster Slam",
        pp: 10,
        priority: 0,
        flags: {contact: 1, protect: 1, mirror: 1},
        onModifyType(move, source) {
            move.type = source.getTypes()[0];
        },
        onHit(target, source, move) {
            if (source.getTypes().length === 1) {
                move.type = source.getTypes()[0];
            } else {
                move.type = source.getTypes()[1];
            }
        },
        multihit: 2,
        secondary: null,
        target: "normal",
        type: "Normal",
        contestType: "Tough",
    },
	shellstack: {
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Shell Stack",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		useSourceDefensiveAsOffensive: true,
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	biobelly: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Bio Belly",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1},
		self: {
			onHit(source) {
				for (const ally of source.side.pokemon) {
					ally.cureStatus();
				}
			},
		},
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	hardwork: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hard Work",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	excaliburslash: {
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Excalibur Slash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Cool",
	},
	bubbleblades: {
		accuracy: 90,
		basePower: 18,
		category: "Physical",
		name: "Bubble Blades",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	balloonburner: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Balloon Burner",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1, defrost: 1, gravity: 1},
		condition: {
		duration: 5,
		onStart(self) {
				if (self.volatiles['smackdown'] || self.volatiles['ingrain']) return false;
				this.add('-start', self, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 15,
			onEnd(self) {
				this.add('-end', self, 'Magnet Rise');
			},
		},
		thawsTarget: true,
		secondary: {
		chance: 10,
		status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
};
