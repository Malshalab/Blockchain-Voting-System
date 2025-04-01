# DecentralizedVoting Truffle Project

This project contains a smart contract for decentralized voting using the Truffle framework.

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

## 🔧 Install Truffle

Install Truffle globally using npm:

```bash
npm install -g truffle
```

To confirm installation:

```bash
truffle version
```

## 🚀 Set Up the Project

1. Clone or create the project folder:
   ```bash
   cd smart-contract
   ```

## 🔌 Set Up Ganache

Ganache provides a personal local Ethereum blockchain for development.

### Option 1: Ganache GUI

1. Download from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)
2. Install and run it
3. It will start a local blockchain on `http://127.0.0.1:7545` by default

### Option 2: ganache-cli

Install it globally:

```bash
npm install -g ganache
```

Start it with:

```bash
ganache
```

Leave it running in a separate terminal window while you run tests.

## 🧪 Run the Tests

Make sure a local blockchain is running (e.g., Ganache GUI or `ganache-cli`).

Then in the project folder, run:

```bash
npx truffle migrate --reset
npx truffle test
```

## ✅ Output

You should see output like:

```
Contract: DecentralizedVoting
  ✔ should add a validator
  ✔ should remove a validator
  ✔ should register a voter
  ✔ should create a poll
  ✔ should add a candidate
  ✔ should allow a registered voter to vote and get refunded
  ✔ should return poll results
  ✔ should deactivate a poll
```

All tests should pass if everything is set up correctly.

---

Feel free to expand the tests and contracts based on your use case.
