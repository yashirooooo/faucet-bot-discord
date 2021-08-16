import { logger } from '@polkadot/util';
import pRetry from 'p-retry';
import { token, chainAddr, seeds } from './consts';
const { Client, Intents } = require('discord.js');
import { Keyring } from '@polkadot/keyring';
import { sendCru } from './crustApi';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { saveFaucetor, queryFaucetor } from './db/faucetorDao';

const keyring = new Keyring();

const isValidAddr = (addr: string) => {
    try {
      keyring.decodeAddress(addr);
      return true;
    } catch (error) {
      return false;
    }
}

const l = logger('main');

const bot = () => {
    const provider = new WsProvider(chainAddr);
    ApiPromise.create({
      provider,
      typesBundle: typesBundleForPolkadot,
    }).then(async (api) => {
      const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], restRequestTimeout: 60 * 6000 });
      client.on('ready', () => {
          console.log(`Logged in as ${client.user.tag}!`);
      });
      
      client.on('error', console.error);
      
      client.on('messageCreate', async (msg: { author: any; content: string; reply: (arg0: string) => void; }) => {
          const address = msg.content;
          const authorId = msg.author.id;
          l.log(`authorId: ${authorId}`)
          if (isValidAddr(address)) {
            const isExist = await queryFaucetor(authorId);
            if (isExist) {
              msg.reply('You have already applied for the test token');
            } else {
              const result = await sendCru(api, address, seeds);
              if (result.status) {
                await saveFaucetor(authorId);
              }
              msg.reply(result.details);
            }
          }
      });
  
      client.login(token);
    }).catch(async (e) => {
      process.exit(1);
    })   
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
