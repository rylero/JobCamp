import { FirebaseScrypt } from 'firebase-scrypt';

const firebaseHashingParams = {
    memCost: 14,
    rounds: 8,
    saltSeparator: 'Bw==',
    signerKey: 'gdShl9G7k68tQK/PsKz6bExGdaQ2l0/w6LXWoEjpWxAjn/bYGoSZXz2byS9hTi57iMwX65iLUaHdySmIhwOB4w==',
}

export const scrypt = new FirebaseScrypt(firebaseHashingParams);