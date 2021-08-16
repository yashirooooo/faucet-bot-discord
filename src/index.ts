import { logger } from '@polkadot/util';
import pRetry from 'p-retry';
import { token } from './consts';
const { Client, Intents } = require('discord.js');

const l = logger('main');

const bot = () => {
    console.log('token', token)
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], restRequestTimeout: 60 * 6000 });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    
    client.on('error', console.error);
    
    client.on('message', (msg: { content: string; reply: (arg0: string) => void; }) => {
        if (msg.content === 'hi') {
            msg.reply('hello');
        }
    });

    client.login(token);
}

// TODO: add error handling
const main = async () => {

  await pRetry(bot, {
    onFailedAttempt: error => {
      console.log(
        `${error.message} - Retry attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
      );
    },
    retries: 10,
  }) 
};

main().catch(e => {
  l.error(e);
  process.exit(1);
});
