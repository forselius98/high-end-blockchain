import { Block } from './Block.js';
import { Transaction } from '../types/blockchain.js';

export class Blockchain {
    public chain: Block[];
    public difficulty: number;
    public pendingTransactions: Transaction[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //Svårighetsgraden för PoW
        this.pendingTransactions = [];
    }

    private createGenesisBlock(): Block {
        return new Block(0, Date.now(), [], '0');
    }

    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    public validateTransaction(transaction: Transaction): boolean {
        const { serialNumber, fromAddress } = transaction;

        const history = this.getProductHistory(serialNumber);

        if (history.length === 0) {
            if (!fromAddress.toLowerCase().includes('manufacturer')) {
                throw new Error('Bara tillverkare kan skapa en ny lyx produkt.');
            }
            return true;
        }

    const currentOwner = history[history.length - 1].toAddress;
    
        if (currentOwner !== fromAddress) {
            throw new Error(`Ägarskapsfel: ${fromAddress} äger inte ${serialNumber}. Nuvarande ägare är ${currentOwner}.`);
        }
        return true;
    }

    public addTransaction(transaction: Transaction): void {
        this.validateTransaction(transaction);
        this.pendingTransactions.push({
            ...transaction,
            timestamp: transaction.timestamp || Date.now(),
        });
    }
    public minePendingTransactions(): Block {
        if (this.pendingTransactions.length === 0) {
            throw new Error('Inga transaktioner att bryta.');
        }

        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.pendingTransactions = [];

        return newBlock;
    }

    public getProductHistory(serialNumber: string): Transaction[] {
        const history: Transaction[] = [];

        for (const block of this.chain) {
            for (const tx of block.data) {
                if (tx.serialNumber === serialNumber) {
                    history.push(tx);
                }
            }
        }

        return history;
    }

    public isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        
        return true;
    }
}