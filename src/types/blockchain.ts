export interface Transaction {
    serialNumber: string;
    fromAddress: string;
    toAddress: string;
    timestamp?: number;
}

export interface ChainResponse {
    length: number;
    isValid: boolean;
    chain: BlockData[];
}

export interface BlockData {
    index: number;
    timestamp: number;
    data: Transaction[];
    previousHash: string;
    nonce: number;
    hash: string;
}
