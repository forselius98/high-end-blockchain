import crypto from 'node:crypto';
import { Transaction } from '../types/blockchain.js';

export class Block {
    public index: number;
    public timestamp: number;
    public data: Transaction[];
    public previousHash: string;
    public nonce: number;
    public hash: string;

    constructor(
        index: number,
        timestamp: number,
        data: Transaction[],
        previousHash: string = '',
    
    ){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    public calculateHash(): string {
        return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).digest('hex');
    }

    public mineBlock(difficulty: number): void {
        const target = Array(difficulty + 1).join('0');

        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }
}