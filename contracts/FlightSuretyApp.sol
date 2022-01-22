pragma solidity ^0.5.0;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./FlightSuretyData.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    FlightSuretyData flightSuretyData;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    address payable contractOwner;          // Account used to deploy contract

    struct Airline {
        address airline;
        bool approved;
        uint256 regIndex;
        uint256 votes;
        mapping(address => bool) votedFor;
    }
    Airline[] public airlines;

    struct Flight {
        address airline;
        bool isRegistered;
        bytes32 flightKey;
        string flightNumber;
        uint8 statusCode;
        uint256 updatedTimestamp;
    }
    mapping(bytes32 => Flight) private flights;

    mapping(address => uint256) public regIndexAirline;
    uint256[] private airlineKeys;
    address[] private addressesAirlines;

    bytes32[] private regIndexFlight;

    bool public operational;

    /********************************************************************************************/
    /*                                       EVENTS                                             */
    /********************************************************************************************/

    event OperationalStatusChanged(bool mode);
    event submittedAirline(address airline, uint256 regIndex, bool executed, uint256 numVotes);
    event votedAirline(address airline, uint256 _regIndex);
    event registeredAirline(address airline, uint256 _regIndex);
    event airlinePaid(address airline, uint256 value);
    event registeredFlight(address airline, bool isRegistered, bytes32 flightKey, string flightNumber, uint8 statusCode, uint256 updatedTimestamp);

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        // Modify to call data contract's status
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier differentModeRequest(bool status)
    {
        require(status != operational, "Contract already in the state requested");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor(address payable _dataContract) public {
        flightSuretyData = FlightSuretyData(_dataContract);
        contractOwner = msg.sender;
        operational = true;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */
    function isOperational() public view returns(bool){
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus(bool mode) external requireContractOwner differentModeRequest(mode) returns(bool){
        operational = mode;
        emit OperationalStatusChanged(mode);
        return mode;
    }

    /**
    * @dev getting balance of funds held in this contract address
    *
    */
    function getBalance() public view requireIsOperational returns (uint256) {
        return address(this).balance;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/


    /**
     * @dev Add an airline to the submit queue
    *
    */
    function submitAirline
    (
        address _airline
    )
    external
    payable
    {
        uint256 _regIndex = airlines.length;

        airlines.push(Airline({
            airline: _airline,
            approved: false,
            regIndex: _regIndex,
            votes: 0
        }));

        regIndexAirline[_airline] = _regIndex;
        airlineKeys.push(_regIndex);
        addressesAirlines.push(_airline);

        emit submittedAirline(_airline, _regIndex, false, 0);
    }

    /**
     * @dev Vote an airline
    *
    */
    function voteAirline
    (
        address _airline
    )
    external
    {
        uint256 regIndex = _getRegIndex(_airline);

        airlines[regIndex].votes += 1;
        airlines[regIndex].votedFor[msg.sender] = true;

        emit votedAirline(msg.sender, regIndex);
    }

    function _getRegIndex (address _airline) private view returns (uint256) {
        return regIndexAirline[_airline];
    }

    /**
     * @dev Add an airline to the registration queue
    *
    */
    function registerAirline
    (
        address _airline
    )
    external
    {
        uint256 regIndex = _getRegIndex(_airline);
        airlines[regIndex].approved = true;

        emit registeredAirline(msg.sender, regIndex);
    }

    /**
    * @dev pay for registering Airline
    *
    */
    function fundAirline() external payable requireIsOperational {
        flightSuretyData.fundAirline();
    }

    /**
 * @dev Get airline status
    *
    */
    function getAirlineStatus
    (
        address _airline
    )
    external
    view
    returns(address, bool, uint256, uint256)
    {
        uint256 regIndex = _getRegIndex(_airline);
        return (airlines[regIndex].airline, airlines[regIndex].approved, airlines[regIndex].regIndex, airlines[regIndex].votes);
    }


    function getAirlines() external view returns(uint256[] memory, address[] memory) {
        uint256[] memory arrAirlines = new uint256[](airlineKeys.length);
        address[] memory arrAddressesAirlines = new address[](addressesAirlines.length);
        for (uint i = 0; i < airlineKeys.length; i++){
            arrAirlines[i] = airlines[airlineKeys[i]].regIndex;
            arrAddressesAirlines[i] = airlines[airlineKeys[i]].airline;
        }
        return (arrAirlines, arrAddressesAirlines);
    }

    /**
     * @dev Register a future flight for insuring.
    *
    */
    function registerFlight
    (
        uint8 _airlineIndex,
        string calldata _flight,
        uint256 _timestamp
    )
    external
    payable
    {
        address _airline = airlines[_airlineIndex].airline;
        bytes32 flightKey = getFlightKey(msg.sender, _flight, _timestamp);

        flights[flightKey] = Flight ({
            airline: _airline,
            isRegistered: true,
            flightKey: flightKey,
            flightNumber: _flight,
            statusCode: STATUS_CODE_UNKNOWN,
            updatedTimestamp: _timestamp
        });

        regIndexFlight.push(flightKey);

        emit registeredFlight(_airline, true, flightKey, _flight, STATUS_CODE_UNKNOWN, _timestamp);
    }

    function getFlights() external view returns (bytes32[] memory ) {
        bytes32[] memory arrFlights = new bytes32[](regIndexFlight.length);

        for (uint i = 0; i < regIndexFlight.length; i++){
            arrFlights[i] = flights[regIndexFlight[i]].flightKey;
        }

        return (arrFlights);
    }

    function getFlightData(bytes32 flightKey) external view requireIsOperational returns(address, string memory, uint8, uint256) {
        return (flights[flightKey].airline, flights[flightKey].flightNumber, flights[flightKey].statusCode, flights[flightKey].updatedTimestamp);
    }

    /**
     * @dev Called after oracle has updated flight status
    *
    */
    function processFlightStatus
    (
        address airline,
        string memory flight,
        uint256 timestamp,
        uint8 statusCode
    )
    internal
    pure
    {
    }


    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus
                        (
                            address airline,
                            string calldata flight,
                            uint256 timestamp                            
                        )
                        external
                        requireIsOperational
    {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        oracleResponses[key] = ResponseInfo({
                                                requester: msg.sender,
                                                isOpen: true
                                            });

        emit OracleRequest(index, airline, flight, timestamp);
    } 


    // region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
        // This lets us group responses and identify
        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    function registerOracle
    (
    )
    external
    payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
        isRegistered: true,
        indexes: indexes
        });
    }

    function getMyIndexes
                            (
                            )
                            view
                            external
                            returns(uint8[3] memory)
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string calldata flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        external
    {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey
    (
        address airline,
        string memory flight,
        uint256 timestamp
    )
    pure
    internal
    returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
    (
        address account
    )
    internal
    returns(uint8[3] memory)
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);

        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
    (
        address account
    )
    internal
    returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

    // endregion

}   
