import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network) {

        this.config = Config[network];
        this.owner = null;
        this.flights = [];
        this.airlines = [];
        this.passengers = [];
        this.gasLimit = 50000000;
    }


    async initWeb3 (logCallback) {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            this.web3 = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8545'));
        }

        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];

        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, this.config.appAddress, this.config.dataAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, this.config.dataAddress);
        this.flightSuretyApp.events.allEvents({fromBlock: 'latest', toBlock: 'latest'}, logCallback);
        this.flightSuretyData.events.allEvents({fromBlock: 'latest', toBlock: 'latest'}, logCallback);
    }

    async isOperational() {
        let resultApp = await this.flightSuretyApp.methods.isOperational().call();
        let resultData = await this.flightSuretyData.methods.isOperational().call();
        return [resultApp,resultData];
    }

    async setOperationalStatusApp(enabled) {
        return await this.flightSuretyApp.methods.setOperatingStatus(enabled).send({from: this.account});
    }

    async setOperationalStatusData(enabled) {
        return await this.flightSuretyData.methods.setOperatingStatus(enabled).send({from: this.account});
    }

    async fetchFlightStatus(flight) {
        let payload = {
            airline: this.account,
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        return await this.flightSuretyApp.methods.fetchFlightStatus(payload.airline, payload.flight, payload.timestamp).send({from: this.account});
    }

    async submitAirline(_address) {
        return await this.flightSuretyApp.methods.submitAirline(_address).send({from: this.account});
    }

    async voteAirline(_address) {
        return await this.flightSuretyApp.methods.voteAirline(_address).send({from: this.account});
    }

    async registerAirline(_address) {
        return await this.flightSuretyApp.methods.registerAirline(_address).send({from: this.account});
    }

    async getAirlineStatus(_address) {
        return await this.flightSuretyApp.methods.getAirlineStatus(_address).call();
    }
}