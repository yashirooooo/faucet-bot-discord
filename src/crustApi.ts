import { ApiPromise } from '@polkadot/api';
import { trasferAmount } from './consts';
import { sendTx } from './utils/tx';
import BN from 'bn.js';
const UNIT = new BN(1_000_000_000_000);

let api: ApiPromise;

export interface BatchFile {
    cid: string;
    size: number;
}

export async function sendCru(api: ApiPromise, dests: string, seeds: string) {
    try {
        // 1. Try connect to Crust Network
        const tx = api.tx.balances.transfer(dests, UNIT.muln(trasferAmount));

        const res = await sendTx(api, tx, seeds);
        
        if (res?.status) {
            res.details = `Transfer CRU to ${dests} success`;
            console.log(`Transfer CRU to ${dests} success`);
        } else {
            res.details = `Transfer CRU to ${dests} failed with ${res?.details}`;
            console.error(
                `Transfer CRU to ${dests} failed with ${res?.details}`
            );
        }
        return res;
    } catch (e) {
        return {
            status: false,
            message: 'Error',
            details: e
        };
    }
}

