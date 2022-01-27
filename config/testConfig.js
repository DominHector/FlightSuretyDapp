
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x4a9C0ecF3fE93E290449d51efb43241Ff95747c8",
        "0xb01B4E50bDcAE78c5DC5B80A6407B38852DD79A1",
        "0x6e66CDc32d20546e64Ded1D65307E83Cf930E354",
        "0x3C62501bEFB6c30D6dadDA1d5266576caB49218F",
        "0x54ED929BF0f5ae4B3d9b77Bbcf3AF3D227b8132F",
        "0xE1d2Fe83Df9702346dC0867de1A79F0452E11126",
        "0x22bAECe9821d6FD856B6d42Ed98D521e016406c7",
        "0xdeF1687EAd23f0005c7A4B81f31AC6D7edc13C64",
        "0xfa7BB0ac2298750e7fE1819DC598cbFb9be3b20D",
        "0x1d72F63023A0479803aB421c59F49f32b5989673",
        "0xE7b8C407BEF9de288663DFD47F1A509420A73bFA",
        "0xFC55D395384F6E2144A3B899888085e0e41436E0",
        "0xEA4A423255126Fb6b112454DAe1B03D05aeF8523",
        "0x93159474e9d0e08a052BaB0c0CF6D8c0aC9C99ac",
        "0x8b4D849679d08E4d74a590c408f028a7B2A6bc47",
        "0xF5985d467eb7e8B1D829E6d97E1E20C5a7119840",
        "0xa6dAcf789A07D117531BF19e3E2FDE1E48b1162a",
        "0xef13cf20D96c05D79b230114D4A2Fc3E296DE639",
        "0xD5075c087B6A2f9A77A4E084363F1b8Bb1f432f6",
        "0x71a584c2759905f8476cA33817eE82f0a5051343",
        "0x4d8a3C42fb46E2f1902368b91301c3Ab0A9a8109",
        "0x944857B8468f1368Fb7fbf6b7a6E35f734922BA7",
        "0xAC58F542990f3e7F288ad117359d1A1f80178743",
        "0x2744652d9FADC926730366504BB860C4414F2B2F",
        "0x68BB761b96e2D414D4BaCb5457f49ceE86eDa5Be",
        "0xbB859e7Dc97639D9c13275732B4B6DE39B4E839a",
        "0xa9A4a7F50a73A90b75CD4A393e0203a4D5D470CD",
        "0xECE6987BAaA2fd9A3e62f92d36042d7b8aBAB6C0",
        "0x886B3390950d54902F75dc9DCA31a9d53aFb68Ac",
        "0x05b781e2BAD7ba59A228A088C20Dcf6a80A067E2",
        "0x871512A2A1871d80bF05313e25f32049d6C9F8a3",
        "0x749400b93638A6cf7A5E3c475b66570AAE2e9A80",
        "0x28f1fA46fAfb5751d15Dc865bdB1a5a00321c572",
        "0xa5b84B6f1317e90fAcea04676e134F396e4D6Ff4",
        "0x1731d6aF1f1DA37B4ad360E329EceeD9D95c0e5D",
        "0x408bF91e5f9749D8F350eb055253F034f5c41ecF",
        "0xaDD2d7bE917dFB9e80f56Ec3D9E278b07b18FD72",
        "0xF8BE2853F8582919812C41B5b259A8b6a61f2524",
        "0xdDAA2f11b3e42Ce5fa22b4caCFfA8c78d9030A49",
        "0x78086F4F0Eb2969DB59E8886142056817C8d2f9b"
    ];


    let owner;
    let firstAirline = owner = accounts[0]; // owner
    let airline2 = accounts[1];
    let airline3 = accounts[2];
    let airline4 = accounts[3];

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