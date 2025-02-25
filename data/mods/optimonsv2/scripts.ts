export const Scripts: {[k: string]: ModdedBattleScriptsData} = {
	init() {
		const addNewMoves = (pokemonid: string, moveids: string[]) => {
			for (const moveid of moveids) {
				this.modData('Learnsets', pokemonid).learnset[moveid] = [moveid === 'dracometeor' || moveid === 'steelbeam' ? '8T' : '8M'];
			}
		};
		addNewMoves('inteleon', ['taunt', 'encore', 'hypervoice', 'psychic', 'sludgewave']);
		addNewMoves('falinks', ['bonerush', 'rockblast', 'pinmissile', 'powertrip']);
		addNewMoves('cramorant', ['uturn', 'toxic']);
		addNewMoves('eiscue', ['iceshard', 'aquajet']);
		addNewMoves('perrserker', ['anchorshot', 'bulletpunch', 'knockoff', 'bulkup']);
		addNewMoves('mrrime', ['toxic', 'courtchange']);
		addNewMoves('cursola', ['recover']);
		addNewMoves('rapidashgalar', ['moonblast', 'moonlight', 'earthpower']);
		addNewMoves('weezinggalar', ['moonlight', 'nastyplot']);
		addNewMoves('stunfiskgalar', ['spikes', 'toxicspikes', 'ironhead', 'spikyshield']);
		addNewMoves('boltund', [
			'hyperfang', 'nastyplot', 'aurasphere', 'mysticalfire', 'focusblast', 'extremespeed', 'seedbomb', 'icefang', 'poisonfang', 'flamethrower',
		]);
		addNewMoves('eldegoss', ['mysticalfire', 'sludgebomb', 'uturn', 'bodypress']);
		addNewMoves('greedent', ['recycle', 'uturn']);
		addNewMoves('thievul', ['earthpower', 'drillrun', 'icebeam', 'psychic', 'energyball']);
		addNewMoves('grapploct', ['aquajet', 'toxic']);
		addNewMoves('coalossal', ['recover']);
		addNewMoves('sandaconda', ['recover', 'whirlwind']);
		addNewMoves('flapple', ['superpower', 'earthquake', 'dragonclaw', 'roost', 'smartstrike']);
		addNewMoves('appletun', ['dragontail', 'calmmind', 'sludgebomb', 'flamethrower', 'earthquake']);
		addNewMoves('electivire', ['closecombat', 'knockoff', 'bulkup', 'meteormash']);
		addNewMoves('yanmega', ['dracometeor', 'dragonpulse', 'focusblast']);
		addNewMoves('dusknoir', ['bulkup', 'knockoff', 'drainpunch']);
		addNewMoves('sudowoodo', ['synthesis', 'leechseed', 'recover']);
		addNewMoves('oranguru', ['slackoff', 'teleport', 'hypervoice', 'earthpower']);
		addNewMoves('bellossom', ['hypervoice', 'mysticalfire', 'uturn', 'aromatherapy']);
		addNewMoves('garbodor', ['recover', 'flashcannon', 'steelbeam']);
		addNewMoves('druddigon', ['recover', 'dragondance', 'steelbeam']);
		addNewMoves('flygon', ['sludgewave', 'powergem']);
		addNewMoves('togedemaru', ['volttackle', 'drainpunch', 'moonlight', 'stealthrock']);
		addNewMoves('galvantula', ['taunt', 'memento']);
		addNewMoves('samurott', ['flipturn', 'aurasphere']);
		addNewMoves('delphox', ['recover', 'voltswitch', 'earthpower']);
		addNewMoves('torterra', ['gravapple', 'bodypress', 'aromatherapy']);
		addNewMoves('vikavolt', ['uturn', 'defog', 'hurricane']);
		addNewMoves('escavalier', ['recover', 'uturn', 'earthquake']);
		addNewMoves('accelgor', ['darkpulse', 'nastyplot']);
		addNewMoves('aurorus', ['boomburst', 'powergem']);
		addNewMoves('avalugg', ['iciclecrash']);
	  addNewMoves('lapras', ['aquajet', 'swordsdance']);
		addNewMoves('hitmontop', ['swordsdance', 'knockoff']);
		addNewMoves('gourgeist', ['taunt', 'partingshot']);
		addNewMoves('zoroark', ['moonblast', 'playrough']);
		addNewMoves('toxicroak', ['uturn']);
	},
};
