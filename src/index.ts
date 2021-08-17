import { logger } from '@polkadot/util';
import pRetry from 'p-retry';
import { token, chainAddr, seeds, channel } from './consts';
const { Client, Intents } = require('discord.js');
import { Keyring } from '@polkadot/keyring';
import { sendCru } from './crustApi';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { saveFaucetor, queryFaucetor, updateFaucetor } from './db/faucetorDao';
import console from 'console';

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
      
      client.on('messageCreate', async (msg: { channelId: any; content: any; author: { id: any; }; reply: (arg0: string) => void; }) => {
        console.log('msg', JSON.stringify(msg))
        const channelId = msg.channelId;
        if (channel == channelId) {
          const address = msg.content;
          const authorId = msg.author.id;
          if (isValidAddr(address)) {
            l.log(`authorId: ${authorId}`)
            const isExist = await queryFaucetor(authorId);
            if (isExist) {
              if (10 > isExist.count) {
                const result = await sendCru(api, address, seeds);
                if (result.status) {
                  await updateFaucetor(authorId, isExist.count+1);
                  msg.reply(`💸 Transfer success, please check your account (${9-isExist.count}/10)`)
                } else {
                  msg.reply(`️⏰ Transfer failed, please try it later`);
                }
              } else {
                msg.reply('🚫 Reached the claim limit (10/10)');
              }

            } else {
              const result = await sendCru(api, address, seeds);
              if (result.status) {
                await saveFaucetor(authorId);
                msg.reply(`💸 Transfer success, please check your account (9/10)`)
              } else {
                msg.reply(`️⏰ Transfer failed, please try it later`);
              }
            }
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
