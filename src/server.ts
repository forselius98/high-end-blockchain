import express, { Request, Response } from 'express';
import { Blockchain } from './engine/Blockchain.js';
import { Transaction } from './types/blockchain.js';

const app = express();
const port = 3000;

app.use(express.json());

const highEndBlockchain = new Blockchain();

// GEt API/Chain 
app.get(`/api/chain`, (req: Request, res: Response) => {
    res.json({
        length: highEndBlockchain.chain.length,
        isValid: highEndBlockchain.isChainValid(),
        chain: highEndBlockchain.chain
    });
});

// POST API/Transaction- lägg till en ny transaktion
app.post(`/api/transaction`, (req: Request, res: Response) => {
    try {
    const { serialNumber,fromAddress, toAddress } = req.body as Transaction;

    if (!serialNumber || !fromAddress || !toAddress) {
        return res.status(400).json({ error: 'Fälten serialNumber, fromAddress och toAddress krävs.' });
    }

    highEndBlockchain.addTransaction({ serialNumber, fromAddress, toAddress });

    res.status(201).json({
        message: 'Transaktion tillagd.',
        pendingCount: highEndBlockchain.pendingTransactions.length
    });

} catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ett okänt fel uppstod.';
    res.status(400).json({ error: errorMessage });
}
});

// POST API/Mine - bryt ett nytt block

app.post(`/api/mine`, (req: Request, res: Response) => {
    try {
        const minedBlock = highEndBlockchain.minePendingTransactions();
        res.json({
            message: 'Block bryten.',
            block: minedBlock
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ett okänt fel uppstod.';
        res.status(400).json({ error: errorMessage });
    }
});

    //GET API/verify/id
app.get(`/api/verify/:id`, (req: Request, res: Response) => {
    const serialNumber = req.params.id;
    const history = highEndBlockchain.getProductHistory(serialNumber as string);

    if (history.length === 0) {
        return res.status(404).json({ error: 'Ingen produkt med det serienumret hittades.' });
    }
    
    const currentOwner = history[history.length - 1].toAddress;

    res.json({
        serialNumber,
        currentOwner,
        totalTransfers: history.length,
        history
    });
});

app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});