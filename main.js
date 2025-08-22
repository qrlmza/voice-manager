require('dotenv').config({ debug: false });
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const prefix = "!"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});


const readyHandler = require('./Handlers/ready');
readyHandler(client);

const createVoiceHandler = require('./Handlers/createVoice');
createVoiceHandler(client);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // get the member's voice channel
    const getVoiceChannel = () => message.member.voice.channel;

    // check if mentioned user is valid
    const getMentionedMember = () => {
        const user = message.mentions.users.first();
        if (!user) return null;
        return message.guild.members.cache.get(user.id);
    };

    if (command === "voice-ban") {
        const target = getMentionedMember();
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        if (!target) {
            const msg = await message.reply("Please mention a user to ban.");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.permissionOverwrites.edit(target, { Connect: false });
            const msg = await message.reply(`${target.user.tag} has been voice banned from your channel.`);
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to ban user from the voice channel.");
            await deleteBoth(msg);
        }
    }
    
    else if (command === "voice-unban") {
        const target = getMentionedMember();
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        if (!target) {
            const msg = await message.reply("Please mention a user to unban.");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.permissionOverwrites.edit(target, { Connect: null });
            const msg = await message.reply(`${target.user.tag} has been unbanned from your channel.`);
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to unban user from the voice channel.");
            await deleteBoth(msg);
        }
    }
    
    else if (command === "voice-lock") {
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: false });
            const msg = await message.reply("Your voice channel is now locked.");
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to lock the voice channel.");
            await deleteBoth(msg);
        }
    }
    
    else if (command === "voice-unlock") {
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: null });
            const msg = await message.reply("Your voice channel is now unlocked.");
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to unlock the voice channel.");
            await deleteBoth(msg);
        }
    }
    
    else if (command === "voice-limit") {
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        const limit = parseInt(args[0]);
        if (isNaN(limit) || limit < 0 || limit > 99) {
            const msg = await message.reply("Please provide a valid user limit (0-99).");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.setUserLimit(limit);
            const msg = await message.reply(`User limit set to ${limit}.`);
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to set user limit.");
            await deleteBoth(msg);
        }
    }
    
    else if (command === "voice-give") {
        const target = getMentionedMember();
        const channel = getVoiceChannel();
        const deleteBoth = async (msg) => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 1500);
        };
        if (!channel) {
            const msg = await message.reply("You must be in a voice channel.");
            await deleteBoth(msg);
            return;
        }
        if (!channel.permissionsFor(message.member).has('ManageChannels')) {
            const msg = await message.reply("Tu dois être owner de ce salon pour utiliser cette commande.");
            await deleteBoth(msg);
            return;
        }
        if (!target) {
            const msg = await message.reply("Please mention a user to give ownership.");
            await deleteBoth(msg);
            return;
        }
        try {
            await channel.permissionOverwrites.edit(target, { ManageChannels: true, Connect: true, Speak: true });
            await channel.permissionOverwrites.edit(message.member, { ManageChannels: false });
            const msg = await message.reply(`Ownership given to ${target.user.tag}.`);
            await deleteBoth(msg);
        } catch (e) {
            const msg = await message.reply("Failed to give ownership.");
            await deleteBoth(msg);
        }
    }
});

client.login(process.env.APP_TOKEN);