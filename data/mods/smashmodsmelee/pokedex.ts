export const Pokedex: {[speciesid: string]: SpeciesData} = {
	raichu: {
		inherit: true,
		otherFormes: ["Raichu-Mega"],
		formeOrder: ["Raichu", "Raichu-Mega"],
	},
	raichumega: {
		num: 26,
		name: "Raichu-Mega",
		baseSpecies: "Raichu",
		forme: "Mega",
		types: ["Electric", "Fighting"],
		baseStats: {hp: 60, atk: 125, def: 55, spa: 110, spd: 100, spe: 125},
		abilities: {0: "Reckless"},
		heightm: 0.8,
		weightkg: 30,
		color: "Yellow",
		eggGroups: ["Field", "Fairy"],
		requiredItem: "Raichunite",
	},
	garbodor: {
		inherit: true,
		otherFormes: ["Garbodor-Mega"],
		formeOrder: ["Garbodor", "Garbodor-Mega"],
	},
	garbodormega: {
		num: 569,
		name: "Garbodor-Mega",
		baseSpecies: "Garbodor",
		forme: "Mega",
		types: ["Poison"],
		baseStats: {hp: 80, atk: 95, def: 132, spa: 95, spd: 132, spe: 40},
		abilities: {0: "Trash Compactor"},
		heightm: 1.9,
		weightkg: 107.3,
		color: "Green",
		eggGroups: ["Mineral"],
		requiredItem: "Garbodorite",
	},
	vanilluxe: {
		inherit: true,
		otherFormes: ["Vanilluxe-Mega"],
		formeOrder: ["Vanilluxe", "Vanilluxe-Mega"],
	},
	vanilluxemega: {
		num: 584,
		name: "Vanilluxe-Mega",
		baseSpecies: "Vanilluxe",
		forme: "Mega",
		types: ["Ice"],
		baseStats: {hp: 71, atk: 95, def: 85, spa: 160, spd: 115, spe: 109},
		abilities: {0: "Cold Sweat"},
		heightm: 1.3,
		weightkg: 57.5,
		color: "White",
		eggGroups: ["Mineral"],
		requiredItem: "Vanillite",
	},
	trubbish: {
		inherit: true,
		otherFormes: ["Trubbish-Marshadow"],
		formeOrder: ["Trubbish", "Trubbish-Marshadow"],
	},
	trubbishmarshadow: {
		num: 802,
		name: "Trubbish-Marshadow",
		baseSpecies: "Marshadow",
		forme: "Marshadow",
		types: ["Poison"],
		gender: "N",
		baseStats: {hp: 91, atk: 91, def: 114, spa: 72, spd: 114, spe: 118},
		abilities: {0: "Technician"},
		heightm: 0.6,
		weightkg: 31,
		color: "Green",
		eggGroups: ["Mineral"],
	},
	beheeyem: {
		inherit: true,
		abilities: {0: "Time Warp", 1: "Synchronize", H: "Analytic"},
	},
	pyukchin: {
		num: -1001,
		name: "Pyukchin",
		types: ["Water", "Electric"],
		baseStats: {hp: 61, atk: 90, def: 122, spa: 70, spd: 117, spe: 20},
		abilities: {0: "Thunderhead"},
		heightm: 0.3,
		weightkg: 1.1,
		color: "Black",
		eggGroups: ["Water 1"],
	},
	thundahi: {
		num: -1002,
		name: "Thundahi",
		types: ["Electric", "Dragon"],
		gender: "N",
		baseStats: {hp: 70, atk: 60, def: 90, spa: 80, spd: 130, spe: 80},
		abilities: {0: "Aftermath", 1: "Storm Drain", H: "Drought"},
		heightm: 3.5,
		weightkg: 211.7,
		color: "Yellow",
		eggGroups: ["Dragon"],
	},
	miltank: {
		num: 241,
		name: "Miltank",
		types: ["Ground", "Fairy"],
		gender: "F",
		baseStats: {hp: 95, atk: 80, def: 105, spa: 40, spd: 70, spe: 100},
		abilities: {0: "Thick Fat", 1: "Scrappy", H: "Sap Sipper"},
		heightm: 1.2,
		weightkg: 75.5,
		color: "Pink",
		eggGroups: ["Field"],
	},
	kecleon: {
		inherit: true,
		evos: ["Camomander"],
	},
	camomander: {
		num: -1003,
		name: "Camomander",
		types: ["Normal", "Dragon"],
		baseStats: {hp: 90, atk: 120, def: 90, spa: 40, spd: 110, spe: 70},
		abilities: {0: "Adaptability", H: "Protean"},
		heightm: 1,
		weightkg: 22,
		color: "Green",
		prevo: "Kecleon",
		evoType: "trade",
		eggGroups: ["Field"],
	},
	moltres: {
		inherit: true,
		otherFormes: ["Moltres-Galar"],
		formeOrder: ["Moltres", "Moltres-Galar"],
	},
	moltresgalar: {
		num: 146,
		name: "Moltres-Galar",
		baseSpecies: "Moltres",
		forme: "Galar",
		types: ["Dark", "Flying"],
		gender: "N",
		baseStats: {hp: 90, atk: 85, def: 90, spa: 100, spd: 125, spe: 90},
		abilities: {0: "Berserk"},
		heightm: 2,
		weightkg: 66,
		color: "Red",
		eggGroups: ["Undiscovered"],
	},
	copperajah: {
		inherit: true,
		otherFormes: ["Copperajah-Forge"],
		formeOrder: ["Copperajah", "Copperajah-Forge"],
	},
	copperajahforge: {
		num: 879,
		name: "Copperajah-Forge",
		types: ["Steel", "Fire"],
		baseStats: {hp: 122, atk: 130, def: 95, spa: 80, spd: 69, spe: 30},
		abilities: {0: "Sheer Force", H: "Flash Fire"},
		heightm: 3,
		weightkg: 650,
		color: "Green",
		prevo: "Cufant",
		evoLevel: 34,
		eggGroups: ["Field", "Mineral"],
	},
	claydol: {
		num: 344,
		name: "Claydol",
		types: ["Ground", "Psychic"],
		gender: "N",
		baseStats: {hp: 80, atk: 70, def: 105, spa: 70, spd: 120, spe: 75},
		abilities: {0: "Sand Force", 1: "Sand Veil", H: "Filter"},
		heightm: 1.5,
		weightkg: 108,
		color: "Black",
		prevo: "Baltoy",
		evoLevel: 36,
		eggGroups: ["Mineral"],
	},
	unown: {
		num: 201,
		name: "Unown",
		baseForme: "A",
		types: ["Psychic"],
		gender: "N",
		baseStats: {hp: 48, atk: 72, def: 48, spa: 72, spd: 48, spe: 48},
		abilities: {0: "Levitate"},
		heightm: 0.5,
		weightkg: 5,
		color: "Black",
		eggGroups: ["Undiscovered"],
		otherFormes: ["Unown-M"],
		formeOrder: ["Unown", "Unown-M"],
	},
	unownm: {
		num: 201,
		name: "Unown-M",
		types: ["Bug", "Dark"],
		gender: "N",
		baseStats: {hp: 70, atk: 115, def: 140, spa: 70, spd: 115, spe: 70},
		abilities: {0: "Magic Guard"},
		heightm: 0.5,
		weightkg: 5,
		color: "Black",
		eggGroups: ["Undiscovered"],
	},
	watervellumental: {
		num: -1004,
		name: "Water Vellumental",
		types: ["Water", "Dragon"],
		gender: "N",
		baseStats: {hp: 108, atk: 95, def: 82, spa: 110, spd: 100, spe: 85},
		abilities: {0: "Storm Drain"},
		heightm: 0.3,
		weightkg: 0.1,
		color: "Blue",
		eggGroups: ["Undiscovered"],
	},
	escavalier: {
		num: 589,
		name: "Escavalier",
		types: ["Bug", "Steel"],
		baseStats: {hp: 70, atk: 135, def: 105, spa: 60, spd: 105, spe: 20},
		abilities: {0: "Swarm", 1: "Guard Up", H: "Knight's Blade"},
		heightm: 1,
		weightkg: 33,
		color: "Gray",
		prevo: "Karrablast",
		evoType: "trade",
		evoCondition: "with a Shelmet",
		eggGroups: ["Bug"],
	},
	lemotic: {
		num: -1005,
		name: "Lemotic",
		types: ["Grass", "Ground"],
		baseStats: {hp: 108, atk: 95, def: 82, spa: 110, spd: 100, spe: 85},
		abilities: {0: "Minus", 1: "Mega Launcher", H: "Perish Body"},
		heightm: 1,
		weightkg: 6.4,
		color: "Yellow",
		eggGroups: ["Grass"],
	},
	joltry: {
		num: -1006,
		name: "Joltry",
		types: ["Grass", "Electric"],
		genderRatio: {M: 0.875, F: 0.125},
		baseStats: {hp: 87, atk: 92, def: 70, spa: 110, spd: 87, spe: 115},
		abilities: {0: "ChloroVolt"},
		heightm: 1.1,
		weightkg: 42.1,
		color: "Green",
		prevo: "Eevee",
		evoType: "useItem",
		evoItem: "Thunder Stone",
		eggGroups: ["Field"],
	},
	magmacroak: {
		num: -1007,
		name: "Magmacroak",
		types: ["Fire", "Fighting"],
		genderRatio: {M: 0.75, F: 0.25},
		baseStats: {hp: 89, atk: 110, def: 76, spa: 115, spd: 90, spe: 94},
		abilities: {0: "Flame Touch"},
		heightm: 1.5,
		weightkg: 56.2,
		color: "Red",
		prevo: "Magmar",
		evoType: "trade",
		evoItem: "Magmarizer",
		eggGroups: ["Human-Like"],
	},
	floraflare: {
		num: -1008,
		name: "Floraflare",
		types: ["Grass", "Fire"],
		baseStats: {hp: 85, atk: 135, def: 75, spa: 90, spd: 90, spe: 60},
		abilities: {0: "Chlorophyll", 1: "Leaf Guard", H: "Water Absorb"},
		heightm: 0.8,
		weightkg: 8.5,
		color: "Yellow",
		prevo: "Sunflora",
		evoType: "trade",
		eggGroups: ["Grass"],
	},
	torgeist: {
		num: -1009,
		name: "Torgeist",
		types: ["Ghost", "Flying"],
		baseStats: {hp: 55, atk: 75, def: 90, spa: 115, spd: 100, spe: 105},
		abilities: {0: "Clear Body", 1: "Cursed Body", H: "Merciless"},
		heightm: 1.2,
		weightkg: 15,
		color: "Orange",
		eggGroups: ["Amorphous"],
	},
	roserade: {
		inherit: true,
		otherFormes: ["Roserade-Scarfed"],
		formeOrder: ["Roserade", "Roserade-Scarfed"],
	},
	roseradescarfed: {
		num: 407,
		name: "Roserade-Scarfed",
		baseSpecies: "Roserade",
		forme: "Scarfed",
		types: ["Poison", "Fairy"],
		baseStats: {hp: 60, atk: 70, def: 65, spa: 125, spd: 105, spe: 107},
		abilities: {0: "Natural Cure", 1: "Shield Dust", H: "Technician"},
		heightm: 0.9,
		weightkg: 14.3,
		color: "Green",
		prevo: "Roselia",
		evoType: "useItem",
		evoItem: "Shiny Stone",
		eggGroups: ["Fairy", "Grass"],
	},
	gladiaster: {
		num: -1010,
		name: "Gladiaster",
		types: ["Ice", "Steel"],
		baseStats: {hp: 118, atk: 110, def: 79, spa: 119, spd: 69, spe: 105},
		abilities: {0: "Rock Head", 1: "Drought", H: "Unaware"},
		heightm: 1.1,
		weightkg: 148,
		color: "Pink",
		eggGroups: ["Mineral", "Human-Like"],
	},
	hypnihil: {
		num: -1011,
		name: "Hypnihil",
		types: ["Rock", "Psychic"],
		baseStats: {hp: 101, atk: 67, def: 61, spa: 113, spd: 127, spe: 97},
		abilities: {0: "Parasomnia"},
		heightm: 1.4,
		weightkg: 65.6,
		color: "White",
		prevo: "Drowzee",
		evoLevel: 26,
		eggGroups: ["Undiscovered"],
	},
};
