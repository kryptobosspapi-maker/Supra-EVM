{
  "name": "@supra/evm",
  "version": "0.1.0",
  "description": "Ethereum Virtual Machine (EVM) interpreter for the Supra blockchain",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "test": "ts-node src/test.ts",
    "build": "tsc",
    "dev": "ts-node src/test.ts",
    "clean": "rimraf dist",
    "prepare": "npm run build"
  },
  "keywords": [
    "evm",
    "ethereum",
    "supra",
    "blockchain",
    "virtual-machine",
    "interpreter",
    "solidity"
  ],
  "author": "Giuseppe (Krypto Mami)",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kryptobosspapi-maker/supra-evm.git"
  },
  "bugs": {
    "url": "https://github.com/kryptobosspapi-maker/supra-evm/issues"
  },
  "homepage": "https://github.com/kryptobosspapi-maker/supra-evm#readme",
  "devDependencies": {
    "@types/node": "^22.15.3",
    "rimraf": "^6.0.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
