
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xf927ee18BBdA1B685D1aD7faA45F4D61B8f44D1d",
        "0x6E0B3FFb889A5F4190d11a0B47c7785b794e3382",
        "0x0A452Fb911A56da52e85682E9d59Bf69b9429a89",
        "0x34E802460989E8B27e71464DD5d5508d70416F62",
        "0x456F64d87Bd1c918EC927B36d01a70122b6306A6",
        "0x3F1EC1AE85184Ad05c7974418921B6153A3fe47E",
        "0xc62E78518BA23D544a711e2403EDc25944E501f0",
        "0x02175d5F4Aa70d66820A41aDCF77DAAcC1bbBd42",
        "0x7CF28F0aE44Fc37C6Dd07961fAd2Fcc96405Cc72",
        "0x0acA617205dbf6fe05654C7690fB01869F9D7461"
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];
    let airline2 = accounts[2];
    let airline3 = accounts[3];

    let flightSuretyData = await FlightSuretyData.new(firstAirline);
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);


    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};