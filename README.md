# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.


![This is an image](./images/dappp.png)
<br>
<br>
The first line (address [0]) is recorded along with the contract
<br>
<br>
1. Anyone can send an airline
<br>
<br>
2. If there are 4 or more funded airlines, the votes are taken into account for the consensus
<br>
<br>
3. Only the first airline can register other airlines sent, if there are already 4 airlines, other airlines can register other aerolines.
<br>
<br>
Anyone can consult the states of the airlines.
<br>
<br>
4. Only you can fund your airline if it has been registered by consensus or by the first line.
<br>
<br>
Anyone can purchase a flight, check its status and receive compensation if the correct flight status is met.
<br>
## Versions
Node: v15.11.0<br>
Truffle: v5.2.4<br>
Solidity: ^0.5.0


## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

