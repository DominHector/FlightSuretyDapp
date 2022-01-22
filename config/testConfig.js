
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0xE5B0b7d80789e51f383a266c4F97115e797D538b",
        "0x9E502B551E981bFD04a3c018E8D3e1268CA10F42",
        "0x389DfF566D125194F6eA2C9A80710B9EA75236A3",
        "0x7e19db9202B7bA5e225d4D95266735B97b32Bc04",
        "0xfce45ABC7B7c3Adf8e115d53e94753F4ED16AE59",
        "0x7119Cf424EA01560DB8d3C90D055Cd214A98a465",
        "0x96a38e9832F52609cB2Da44268eB6FCC17C50794",
        "0x2345491e71a3f20f40B23883101546826121B49F",
        "0x8e9a4676387D32225d4a992502987b8B9ef482C9",
        "0x6b2D397beec6DbD78534D4a5B38Fb0b656Fe02F3",
        "0x4BB0E17744627d94FF2bA2526b33D002A523323e",
        "0x99895906714e233336c45fD98072eDDE2a5A48e5",
        "0x9A7d3bC4c4Da58FC365BCbB228E9879B62145B34",
        "0x3bF15689fD5720b982Da058d352d652F9f65cE9D",
        "0x5756746Fb99083D3c10c2E6E1C7499E7b902341c",
        "0x5eaec1720EB2d479eDc3BfC920D7ccA2F94367c1",
        "0x44DcDBe13f75aeE4F0d9D363CEedEAC046DBDB38",
        "0x8F9EebF9FC0feaA0e5CE13Cbdfd45356FaB6Cd05",
        "0x29DEb9A3c2fA5731Ee5BC1DA14E0FBe829D6F727",
        "0x7eDE2E3A503BaeBfE9677417a681Cc681C930541",
        "0xB7A2574F312a0dabAA3881F10836515a82309902",
        "0x2e013e48367884bAC75A0d8518B9a38a569bA9AF",
        "0x0CDE151C0F30e87AeEf823C957C019b53c348cB0",
        "0x377aE5F73d0Cf512DEF569184ECaA4af26BBda4c",
        "0x183F389e4C7318f7Ce86b7905f17a5365662Ad6a",
        "0xE4d0499630a29404E1D4Fa138d2e6416a543B92F",
        "0x345dF3349B7A6D151e5f1E5D6DbEe55F99e5a972",
        "0xCa7660C3d7daEC23ddf37598DA2D6c2aA6061Fa5",
        "0x82179CFb5c86e85df7336e1fF1E7F349F59BF1bf",
        "0x44170bDdB7c90893e360057A3AB9A0e8AB279e55",
        "0x810A83cD9B19Cb4A87C0806317FfF916E0E50324",
        "0x428ea54895D02350ad18EA5aE33909Fa82B6D348",
        "0xBC05454bC50f64c2ae2Fab0EA69BE514d9E5c080",
        "0x10E4c539A231aEf634095Ba2f32879Bd73d6BfA5",
        "0x71e0CceA5d95c779700A8EDEE31410eb645B2589",
        "0xA3abA4A7E8983B89400566aeeA4030a16519C441",
        "0x33628ca6304b3CABBEA6c2Ecd11808d4445062cD",
        "0x97F01753311bcc2D3A43bED151B5C1221fACE474",
        "0xDaBc04180D8Db9CB465E46e17Bbc2FeF0B76ED44",
        "0x0Cc660c7701dE1C3abCC96dD941Ff226245CEd14"
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