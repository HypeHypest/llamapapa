const { SlashCommandBuilder } = require('discord.js');
const { createBaseEmbed } = require('../utilities/embed');
const fs = require('fs');
const path = require('path');


const skills = [
    "Mining", "Smithing", "Fishing", "Cooking", "Firemaking",
    "Woodcutting", "Agility", "Herblore", "Thieving", "Crafting", "Fletching",
    "Slayer", "Hunter", "Runecrafting", "Construction"
];

const skillImages = {
    Mining: "assets/skills/mining.png",
    Smithing: "assets/skills/smithing.png",
    Fishing: "assets/skills/fishing.png",
    Cooking: "assets/skills/cooking.png",
    Firemaking: "assets/skills/firemaking.png",
    Woodcutting: "assets/skills/woodcutting.png",
    Agility: "assets/skills/agility.png",
    Herblore: "assets/skills/herblore.png",
    Thieving: "assets/skills/thieving.png",
    Crafting: "assets/skills/crafting.png",
    Fletching: "assets/skills/fletching.png",
    Slayer: "assets/skills/slayer.png",
    Hunter: "assets/skills/hunter.png",
    Runecrafting: "assets/skills/runecrafting.png",
    Construction: "assets/skills/construction.png"
};

function getThreeRandomSkills() {
    const shuffled = skills.slice().sort(() => 0.5 - Math.random());
    const selectedSkills = shuffled.slice(0, 3);
    return selectedSkills.map(skill => ({
        skill,
        image: skillImages[skill]
    }));
}

const skillEmojis = {
    Mining: 'mining',
    Smithing: 'smith',
    Fishing: 'fish',
    Cooking: 'cook',
    Firemaking: 'fm',
    Woodcutting: 'wc',
    Agility: 'agi',
    Herblore: 'herb',
    Thieving: 'thiev',
    Crafting: 'craft',
    Fletching: 'fletch',
    Slayer: 'slayer', //missing
    Hunter: 'hunter',
    Runecrafting: 'rc',
    Construction: 'con'
};


const activePolls = new Map();

const POLLS_FILE = path.join(__dirname, 'activePolls.json');

function loadActivePolls() {
    if (fs.existsSync(POLLS_FILE)) {
        try {
            const data = fs.readFileSync(POLLS_FILE, 'utf8');
            const polls = JSON.parse(data);
            for (const [id, poll] of Object.entries(polls)) {
                activePolls.set(id, poll);
            }
        } catch (e) {
            console.error('Failed to load active polls:', e);
        }
    }
}

function saveActivePolls() {
    try {
        fs.writeFileSync(POLLS_FILE, JSON.stringify(Object.fromEntries(activePolls)), 'utf8');
    } catch (e) {
        console.error('Failed to save active polls:', e);
    }
}

// On process exit, save polls
process.on('exit', saveActivePolls);
process.on('SIGINT', () => { saveActivePolls(); process.exit(); });
process.on('SIGTERM', () => { saveActivePolls(); process.exit(); });

// Load on startup
loadActivePolls();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spinskill')
        .setDescription('Spin for 3 random skills and vote!'),
    async execute(interaction) {
        const skills = getThreeRandomSkills();
        const skillOptions = skills.map(({ skill, image }) => ({
            skill,
            image,
            emoji: skillEmojis[skill]
        }));


        const embed = createBaseEmbed()
            .setTitle('Skill Voting Poll!')
            .setDescription('Vote for your preferred skill by reacting with the corresponding emoji. Poll ends in 24 hours!')
            .addFields(
                skillOptions.map(({ skill, image, emoji }) => ({
                    name: `${skill} ${emoji}`,
                    value: `![${skill}](${image})`,
                    inline: true
                }))
            );

        const reply = await interaction.reply({ embeds: [embed], fetchReply: true });
        for (const { emoji } of skillOptions) {
            try {
                await reply.react(emoji);
            } catch (e) {
                console.error(`Failed to react with emoji ${emoji}:`, e);
            }
        }

        activePolls.set(reply.id, {
            messageId: reply.id,
            channelId: reply.channel.id,
            skillOptions,
            endTime: Date.now() + 24 * 60 * 60 * 1000
        });

        setTimeout(async () => {
            try {
                const channel = await interaction.client.channels.fetch(reply.channel.id);
                const message = await channel.messages.fetch(reply.id);
                // Count votes
                let maxVotes = 0;
                let winner = null;
                for (const option of skillOptions) {
                    const reaction = message.reactions.cache.get(option.emoji);
                    const count = reaction ? reaction.count - 1 : 0;
                    if (count > maxVotes) {
                        maxVotes = count;
                        winner = option;
                    }
                }
                if (winner) {
                    await channel.send({
                        embeds: [embed.createBaseEmbed()
                            .setTitle('Poll Ended!')
                            .setDescription(`The winning skill is **${winner.skill}** with ${maxVotes} votes!`)
                            .setImage(winner.image)
                        ]
                    });
                } else {
                    await channel.send('The poll has ended! No votes were cast.');
                }
            } catch (e) {
                console.error('Error ending poll:', e);
            } finally {
                activePolls.delete(reply.id);
            }
        }, 24 * 60 * 60 * 1000);
    }
};