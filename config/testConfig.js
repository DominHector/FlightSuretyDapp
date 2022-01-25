
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xCe17748175ca8f99e7A1E53489b908AA00506196",
        "0x2d8A258E0299297B523489CEB0ac08cD0e5CFa11",
        "0x768f3124ed6aFF63278Eee5246C9e5a6408443f8",
        "0xD4c89D04B82eD7490023B50Df46aFc60a97E4468",
        "0x22F4D5aEE21C8280235dCe4390EAf7C18690A958",
        "0xdB6e120098db2c408B5de54db4E640ce2B7064c1",
        "0xdab380f2872728338A9b9Df1C700d2D9DDD57B45",
        "0xC90bBbe2EFeEBC639d8d22aa9c3cA2fdea6fCF1d",
        "0x280bB501F6fF33032e4bD045BE079dC8eD93410C",
        "0x0Ef22ADe9a5A72C6b2Dd1368aFB42398E1fb4536",
        "0xecFAfF0b46fA143a30f7052731BdB94336785888",
        "0x4576E7725939950ce9B1F09Eb7EC2d668b47D331",
        "0x843838eD48b07E0cB3ce85FB26DbC422f9970aC7",
        "0x5F94577a84323dDD2E3431d70f336901FdDAcafd",
        "0x1C5F209d502444C05D19E9531FF62CdBb8f8BB04",
        "0xcfE4dfCAA49c3b61C80502948c3644C75270Fcd6",
        "0xb0a807055b9962a9806c4db76c99dcC19B329B28",
        "0xF7345541224df0Ef199C2F17a279F9C88be9EEbB",
        "0x923D3C13a12324D71F09441F16A90CfeD9842f7A",
        "0xA41C42505CA2A684B25b4a3B4C9Cc62db97b6ac4",
        "0xCbe63b879EBE0DCBE9D4f0C96a41F54aDE7F01A4",
        "0xe4AC1652037c2156Ef5e067429E8c3D062dC5051",
        "0xDE94B0651EFf24a58dA8363813B5E796D6FdeCD6",
        "0xd002E7Fe6E4A7b88EEd7da316a8fA4d51FC17caC",
        "0x72e7b0b3e8209387a231f0792fD900B72A631340",
        "0xa75C96745cb4305a9e95E36992Bd041078b5537b",
        "0xbc9a44B9eCBdbC4f756eCA7e8BA0624A7aCa5F51",
        "0x71BC94Db497C799165A53dec4D21D0d34D561106",
        "0xfc676a868d3106e748654BABf81616f545Aa44D7",
        "0x4ce343babeEa1a25902Bf593754e2d2A1d024C9C",
        "0xb5787D8ED8613e92c54c1ae28381aD0A345A2249",
        "0xE0726B6E69afEcf9BF86853F32F1cD127D32b62d",
        "0xDdF68823aCC4D1D34d75b9B55530e5DE057E616a",
        "0x4fbbbFa6B709004704542c105388C25989AB0cC0",
        "0x9d48456C6595078249C240917DAFE31d104E0d25",
        "0x28010b0b28e6a6718A2462244dC953801Fa3a9A9",
        "0x6AE57D99c3Bf59C19535eBcAf73d1b24BaA5A2da",
        "0x8eb9aD2941cBAd2E5d09C500B9C05f1ed00fC25D",
        "0x747140138486d522B8c84A14Cd388b97EfD80ca2",
        "0xDCf78FC3772D6df856F2a465E5eFCf0ed1Cc550a"
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