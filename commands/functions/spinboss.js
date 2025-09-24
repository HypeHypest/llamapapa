const bosses = [
    "Zulrah", "Vorkath", "General Graardor", "Commander Zilyana", "Kree'arra",
    "K'ril Tsutsaroth", "Dagannoth Rex", "Dagannoth Prime", "Dagannoth Supreme",
    "King Black Dragon", "Giant Mole", "Cerberus", "Abyssal Sire", "Thermonuclear Smoke Devil",
    "Alchemical Hydra"
];

const bossImages = {
    "Zulrah": "https://example.com/images/zulrah.png",
    "Vorkath": "https://example.com/images/vorkath.png",
    "General Graardor": "https://example.com/images/graardor.png",
    "Commander Zilyana": "https://example.com/images/zilyana.png",
    "Kree'arra": "https://example.com/images/kreearra.png",
    "K'ril Tsutsaroth": "https://example.com/images/kril.png",
    "Dagannoth Rex": "https://example.com/images/rex.png",
    "Dagannoth Prime": "https://example.com/images/prime.png",
    "Dagannoth Supreme": "https://example.com/images/supreme.png",
    "King Black Dragon": "https://example.com/images/kbd.png",
    "Giant Mole": "https://example.com/images/mole.png",
    "Cerberus": "https://example.com/images/cerberus.png",
    "Abyssal Sire": "https://example.com/images/sire.png",
    "Thermonuclear Smoke Devil": "https://example.com/images/smoke_devil.png",
    "Alchemical Hydra": "https://example.com/images/hydra.png"
};

function getThreeRandomBosses() {
    const shuffled = bosses.slice().sort(() => 0.5 - Math.random());
    const selectedBosses = shuffled.slice(0, 3);
    return selectedBosses.map(boss => ({
        boss,
        image: bossImages[boss]
    }));
}

const bossEmojis = {
    "Zulrah": 'zulrah',
    "Vorkath": 'vorkath',
    "General Graardor": 'graardor',
    "Commander Zilyana": 'zilyana',
    "Kree'arra": 'kreearra',
    "K'ril Tsutsaroth": 'kril',
    "Dagannoth Rex": 'rex',
    "Dagannoth Prime": 'prime',
    "Dagannoth Supreme": 'supreme',
    "King Black Dragon": 'kbd',
    "Giant Mole": 'mole',
    "Cerberus": 'cerberus',
    "Abyssal Sire": 'sire',
    "Thermonuclear Smoke Devil": 'smoke_devil',
    "Alchemical Hydra": 'hydra',
    "Phantom Muspah": 'muspah',
    "Sarachnis": 'sarach',
    "Perilous Moons": 'bloodmoon',
    "Barrows": 'barrows'
};

function getVotingOptions() {
    const options = getThreeRandomBosses();
    const optionsWithEmoji = options.map(option => ({
        ...option,
        emoji: `:${bossEmojis[option.boss]}:`,
        reactionCount: 1
    }));
    return {
        options: optionsWithEmoji,
        message: `Vote for your preferred boss by reacting with the corresponding emoji.`
    };
}

module.exports = { getThreeRandomBosses, getVotingOptions };