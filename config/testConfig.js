
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xc18D995c8e35738ba0a5e27256C4972603f9BDA1",
        "0xb6A3E82984Ff2Bd70FB0aCC39fFC5ca4849dd9d6",
        "0x572c10603c79e1DE5eCD3997f52414a2bcDE321F",
        "0xB4224081965b735d5CA068deC7B56A191A7A5E0F",
        "0x924E9FBEe815d514B98C86a08f5B0Ed8a97C3033",
        "0xA87D55107bE94dC351545dF262aF2Fc8d5c2cC87",
        "0x44Cf78a3E0323B90dABE512D648e3DD8dd526F2e",
        "0x0011392Cfaf850D80f462D58bF19852986aE979e",
        "0x148669c5Cfe4B64F06b8e216E91A959b9128716F",
        "0xd300B354F8547450F2a974C2f25320C11361B909"
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