# HIGH-END_BLOCKCHAIN

Node.js & TypeScript REST API med ett inbyggt Proof-of-Work (PoW) blockkedjesystem för spårbarhet och ägarskapsvalidering av lyxprodukter.

## 🚀 Snabbstart

1. **Installera beroenden:**
   ```bash
   npm install
   ```

2. **Starta i utvecklingsläge:*
   ```bash
   npm run dev
   ```

---

## 📂 Projektstruktur

```text
src/
├── types/
│   └── blockchain.ts     # Datatyper och interfaces
├── engine/
│   ├── Block.ts          # Block-klass & PoW-mining
│   └── Blockchain.ts     # Blockkedjelogik & State Validation
└── server.ts             # Express REST API
```

---

## 🔌 API Endpoints

| Metod | Endpoint | Beskrivning |
|---|---|---|
| `GET` | `/api/chain` | Hämtar hela blockkedjan och dess giltighet |
| `POST` | `/api/transactions` | Validerar ägarskap och lägger till transaktion i pending pool |
| `POST` | `/api/mine` | Kör PoW-mining på pending transactions och skapar nytt block |
| `GET` | `/api/verify/:id` | Hämtar historik och nuvarande ägare för ett serienummer |

---

## 📝 Exempel (POST /api/transactions)

```json
{
  "serialNumber": "ROLEX-SUB-9981",
  "fromAddress": "0xManufacturerKey",
  "toAddress": "0xCollectorA"
}
```
