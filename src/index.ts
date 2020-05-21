import Discord from 'discord.js';
import mongoose from 'mongoose';

// TODO(https://github.com/kmangutov/janule/issues/11): Get `config.json` working.
const config = {
    db: '',
    token: '',
};

const client = new Discord.Client();
const mlab = (<any>config).db;
client.login((<any>config).token);
mongoose.connect(mlab);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.info('WELCOME TO JANULE .. BOT... HI');

    let MemeScheme = mongoose.Schema({
        name: String,
    });
    let Meme = mongoose.model('Meme', MemeScheme, 'memes');
    const memes = Meme.collection.find();
    memes.forEach((meme: any) => {
        console.info(meme);
    });

    const CMD_ADD = '!addmeme';
    const CMD_GET = '!getmemes';

    client.on('message', (message: any) => {
        const username = message.author.username + '#' + message.author.discriminator;
        if (!message.content.startsWith('!')) {
            return;
        } else if (message.content.startsWith(CMD_ADD)) {
            const param = message.content.substring(CMD_ADD.length);
            Meme.collection.insert([
                {
                    name: param,
                    creator: username,
                },
            ]);
        } else if (message.content === CMD_GET) {
            const memes = Meme.collection.find();
            memes.toArray().then((documents) => {
                const results = documents.map((value, index) => {
                    const creator = value.creator ?? 'Unknown';
                    return index + ': ' + value.name + ' \n Created By: ' + creator;
                });
                message.channel.send('Current Memes: \n' + results.join('\n'));
            });
        }
    });
});
