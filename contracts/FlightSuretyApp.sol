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

    uint8 private constant MINIMUM_AIRLINES_TO_VOTE = 4;
    uint public constant FUND_AIRLINE_PRICE = 10000000000000000000;

    address payable contractOwner;          // Account used to deploy contract

    struct Flight {
        address airline;
        bool isRegistered;
        bytes32 flightKey;
        string flightNumber;
        uint8 statusCode;
        uint256 timestamp;
    }
    mapping(bytes32 => Flight) private flights;
    bytes32[] private regIndexFlight;

    bool public operational;

    /********************************************************************************************/
    /*                                       EVENTS                                             */
    /********************************************************************************************/

    event OperationalStatusChanged(bool mode);
    event airlinePaid(address airline, uint256 value);
    event registeredFlight(address airline, bool isRegistered, bytes32 flightKey, string flightNumber, uint8 statusCode, uint256 timestamp);

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

    modifier requireNotSubmittedAirline(address _airline) {
        require(!flightSuretyData.isSubmitted(_airline), "Airline is already submitted");
        _;
    }

    modifier requireIsSubmittedAirline(address _airline) {
        require(flightSuretyData.isSubmitted(_airline), "Airline is not submitted");
        _;
    }

    modifier requireIsRegisteredAirline() {
        require(flightSuretyData.isRegistered(msg.sender), "Airline is not Registered");
        _;
    }

    modifier requireAirlineIsFunded() {
        require(flightSuretyData.isFunded(msg.sender), "Airline is not funded");
        _;
    }

    modifier requireNotVoted(address _airline) {
        require(!flightSuretyData.isVotedBy(_airline), "Already voted");
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

    /** @dev Get operating status of contract
    *** @return A bool that is the current operating status*/
    function isOperational() public view returns(bool){
        return operational;
    }

    /** @dev Sets contract operations on/off
    *** When operational mode is disabled, all write transactions except for this one will fail*/
    function setOperatingStatus(bool mode) external requireContractOwner differentModeRequest(mode) returns(bool){
        operational = mode;
        emit OperationalStatusChanged(mode);
        return mode;
    }

    /** @dev getting balance of funds held in this contract address**/
    function getBalance() public view requireIsOperational returns (uint256) {
        return address(this).balance;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/


    /** @dev Add an airline*/
    function submitAirline(address _airline) external requireIsOperational requireNotSubmittedAirline(_airline) returns(address) {
        require(msg.sender == _airline, "It is not your address");
        flightSuretyData.submitAirline(_airline);
        return (_airline);
    }

    /** @dev Vote an airline*/
    function voteAirline(address _airline) external requireIsOperational requireAirlineIsFunded requireNotVoted(_airline) returns(address, address) {
        if (flightSuretyData.numAirlinesFunded() < MINIMUM_AIRLINES_TO_VOTE) {
            require(flightSuretyData.getFirstAirline() == msg.sender, "You are not the first airline");
        } else {
            require(_airline != msg.sender, "You can't vote for yourself");
        }

        flightSuretyData.voteAirline(_airline);
        return (_airline, msg.sender);
    }


    /** @dev Add an airline to the registration queue*/
    function registerAirline(address _airline) external requireIsOperational requireAirlineIsFunded requireIsSubmittedAirline(_airline) returns(address, address) {
        if (flightSuretyData.numAirlinesFunded() < MINIMUM_AIRLINES_TO_VOTE) {
            require(flightSuretyData.getFirstAirline() == msg.sender, "You are not the first airline");
        }

        if (flightSuretyData.numAirlinesFunded() >= MINIMUM_AIRLINES_TO_VOTE) {
            uint airlinesFunded = flightSuretyData.numAirlinesFunded();
            uint8 votes = flightSuretyData.getVotesAirline(_airline);
            require(airlinesFunded.div(2) <= votes, "Has not passed the consensus");
        }

        flightSuretyData.registerAirline(_airline);
        return (_airline, msg.sender);
    }


    /** @dev pay for registering Airline**/
    function fundAirline() external payable requireIsOperational requireIsRegisteredAirline {
        address payable payableAccount = address(uint160(address(flightSuretyData)));
        require(msg.value == FUND_AIRLINE_PRICE, "Insufficient founds, 10 eth");
        payableAccount.transfer(msg.value);
        flightSuretyData.fundAirline(msg.sender);
    }


    /** @dev Get airline status**/
    function getAirlineStatus(address _airline) external view returns(address, bool, bool, bool, uint256, uint256) {
        return flightSuretyData.getAirline(_airline);
    }


    /** @dev Register a future flight for insuring.**/
    function getAirlines() external view returns(address[] memory) {
        return flightSuretyData.getAirlines();
    }


    /*** @dev Register a future flight for insuring.**/
    function registerFlight(address _airline, string calldata _flight, uint256 _timestamp) external payable {

        bytes32 flightKey = getFlightKey(_airline, _flight, _timestamp);

        flights[flightKey] = Flight ({
            airline: _airline,
            isRegistered: true,
            flightKey: flightKey,
            flightNumber: _flight,
            statusCode: STATUS_CODE_UNKNOWN,
            timestamp: _timestamp
        });

        regIndexFlight.push(flightKey);

        emit registeredFlight(_airline, true, flightKey, _flight, STATUS_CODE_UNKNOWN, _timestamp);
    }


    /*** @dev Get All Flights**/
    function getFlights() external view returns (bytes32[] memory ) {
        bytes32[] memory arrFlights = new bytes32[](regIndexFlight.length);

        for (uint i = 0; i < regIndexFlight.length; i++){
            arrFlights[i] = flights[regIndexFlight[i]].flightKey;
        }

        return (arrFlights);
    }


    /*** @dev Get Flight data**/
    function getFlightData(bytes32 flightKey) external view requireIsOperational returns(address, bool, bytes32, string memory, uint8, uint256) {
        return (
            flights[flightKey].airline,
            flights[flightKey].isRegistered,
            flights[flightKey].flightKey,
            flights[flightKey].flightNumber,
            flights[flightKey].statusCode,
            flights[flightKey].timestamp
        );
    }


    /*** @dev Called after oracle has updated flight status**/
    function processFlightStatus(bytes32 flightKey, uint8 statusCode) internal {
        flights[flightKey].statusCode = statusCode;
    }


    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus(bytes32 _flightKey) external requireIsOperational {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, flights[_flightKey].airline, flights[_flightKey].flightNumber, flights[_flightKey].timestamp));
        oracleResponses[key] = ResponseInfo({requester: msg.sender, isOpen: true});

        emit OracleRequest(index, flights[_flightKey].airline, flights[_flightKey].flightNumber, flights[_flightKey].timestamp);
    } 


    function buyInsurance (bytes32 _flight) external payable requireIsOperational {
        address payable payableAccount = address(uint160(address(flightSuretyData)));
        payableAccount.transfer(msg.value);

        uint payout = msg.value + msg.value.div(2);

        flightSuretyData.buyInsurance(msg.sender, _flight, msg.value, payout);
    }


    function payout () external payable requireIsOperational {
        flightSuretyData.payout(msg.sender);
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
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status, bytes32 flightKye);

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

        address payable dataContract = address(uint160(address(flightSuretyData)));
        dataContract.transfer(msg.value);

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

            bytes32 flightKey = getFlightKey(airline, flight, timestamp);

            emit FlightStatusInfo(airline, flight, timestamp, statusCode, flightKey);

            // Handle flight status as appropriate
            processFlightStatus(flightKey, statusCode);
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
