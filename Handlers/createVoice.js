require('dotenv').config({ debug: false });
var colors = require('colors/safe');

const createVoiceHandler = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        // Création du salon temporaire
        if (!oldState.channelId && newState.channelId === process.env.CREATE_VOICE_CHANNEL) {
            const member = newState.member;
            if (!member) return;
            const guild = newState.guild;
            const channelName = `${member.user.username}'𝘀 𝗰𝗵𝗮𝗻𝗻𝗲𝗹`;
            const createdChannel = await guild.channels.create({
                name: channelName,
                type: 2, // 2 = GUILD_VOICE
                parent: newState.channel.parentId || undefined,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: ['Connect', 'ManageChannels', 'MuteMembers', 'MoveMembers'],
                    },
                    {
                        id: guild.roles.everyone.id,
                        allow: ['Connect'],
                    },
                ],
            });
            await member.voice.setChannel(createdChannel);
            console.log(colors.green(` ⟭ Created a voice channel for ${member.user.username}.`));
        }

        if (oldState.channel && oldState.channel.members.size === 0) {
            const channel = oldState.channel;
            if (
                channel.type === 2 &&
                channel.name.endsWith("𝘀 𝗰𝗵𝗮𝗻𝗻𝗲𝗹")
            ) {
                try {
                    await channel.delete();
                    console.log(colors.green(` ⟭ Deleted voice channel of ${channel.name}.`));
                } catch (e) {
                    // ignore
                }
            }
        }
    });
};

module.exports = createVoiceHandler;
