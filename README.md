# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.


![This is an image](./images/dapp.png)

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

