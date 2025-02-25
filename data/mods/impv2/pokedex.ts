export const Pokedex: {[speciesid: string]: SpeciesData} = {
	throhinteleon: {
		num: 1,
		name: "Throh-Inteleon",
		types: ["Water", "Fighting"],
		gender: "M",
		baseStats: {hp: 137, atk: 114, def: 97, spa: 34, spd: 97, spe: 51},
		abilities: {0: "Torrent", H: "Sniper"},
		heightm: 1.3,
		weightkg: 63.2,
		color: "Red",
		eggGroups: ["Human-Like"],
	},
	dhelmiserillaboom: {
		num: 2,
		name: "Dhelmise-Rillaboom",
		types: ["Ghost", "Grass"],
		gender: "N",
		baseStats: {hp: 70, atk: 131, def: 100, spa: 86, spd: 90, spe: 40},
		abilities: {0: "Overgrow", H: "Grassy Surge"},
		heightm: 3.9,
		weightkg: 215.2,
		color: "Green",
		eggGroups: ["Mineral"],
	},
	starmiecinderace: {
		num: 3,
		name: "Starmie-Cinderace",
		types: ["Water", "Fire"],
		gender: "N",
		baseStats: {hp: 61, atk: 76, def: 87, spa: 102, spd: 87, spe: 117},
		abilities: {0: "Blaze", H: "Libero"},
		heightm: 1.1,
		weightkg: 80,
		color: "Purple",
		prevo: "Staryu",
		evoType: "useItem",
		evoItem: "Water Stone",
		eggGroups: ["Water 3"],
	},
	rioluperrserker: {
		num: 4,
		name: "Riolu-Perrserker",
		types: ["Steel", "Fighting"],
		genderRatio: {M: 0.875, F: 0.125},
		baseStats: {hp: 62, atk: 108, def: 62, spa: 53, spd: 62, spe: 93},
		abilities: {0: "Battle Armor", 1: "Tough Claws", H: "Steely Spirit"},
		heightm: 0.7,
		weightkg: 20.2,
		color: "Blue",
		evos: ["Lucario"],
		eggGroups: ["Undiscovered"],
		canHatch: true,
	},
	heliolisksirfetchd: {
		num: 5,
		name: "Heliolisk-Sirfetchd",
		types: ["Electric", "Fighting"],
		baseStats: {hp: 68, atk: 58, def: 55, spa: 115, spd: 99, spe: 115},
		abilities: {0: "Steadfast", H: "Scrappy"},
		heightm: 1,
		weightkg: 21,
		color: "Yellow",
		prevo: "Helioptile",
		evoType: "useItem",
		evoItem: "Sun Stone",
		eggGroups: ["Monster", "Dragon"],
	},
	axewmrrime: {
		num: 6,
		name: "Axew-MrRime",
		types: ["Dragon"],
		baseStats: {hp: 76, atk: 145, def: 99, spa: 49, spd: 66, spe: 95},
		abilities: {0: "Tangled Feet", 1: "Screen Cleaner", H: "Ice Body"},
		heightm: 0.6,
		weightkg: 18,
		color: "Green",
		evos: ["Fraxure"],
		eggGroups: ["Monster", "Dragon"],
	},
	corviknightobstagoon: {
		num: 7,
		name: "Corviknight-Obstagoon",
		types: ["Flying", "Normal"],
		baseStats: {hp: 103, atk: 91, def: 110, spa: 56, spd: 89, spe: 71},
		abilities: {0: "Reckless", 1: "Guts", H: "Defiant"},
		heightm: 2.2,
		weightkg: 75,
		color: "Purple",
		prevo: "Corvisquire",
		evoLevel: 38,
		eggGroups: ["Flying"],
	},
	chesnaughtrunerigus: {
		num: 8,
		name: "Chesnaught-Runerigus",
		types: ["Ghost", "Fighting"],
		genderRatio: {M: 0.875, F: 0.125},
		baseStats: {hp: 80, atk: 98, def: 111, spa: 67, spd: 69, spe: 58},
		abilities: {0: "Wandering Spirit"},
		heightm: 1.6,
		weightkg: 90,
		color: "Green",
		prevo: "Quilladin",
		evoLevel: 36,
		eggGroups: ["Field"],
	},
	grimeralolacursola: {
		num: 9,
		name: "Grimer-Alola-Cursola",
		baseSpecies: "Grimer",
		forme: "Alola",
		types: ["Ghost", "Dark"],
		baseStats: {hp: 126, atk: 126, def: 78, spa: 63, spd: 78, spe: 39},
		abilities: {0: "Weak Armor", H: "Perish Body"},
		heightm: 0.7,
		weightkg: 42,
		color: "Green",
		evos: ["Muk-Alola"],
		eggGroups: ["Amorphous"],
	},
};
