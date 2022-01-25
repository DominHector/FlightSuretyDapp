pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => bool) public authorizedCallers;

    struct Airline {
        address airline;
        bool isSubmitted;
        bool isApproved;
        bool isFunded;
        uint256 regIndex;
        uint256 votes;
        mapping(address => bool) votedFor;
    }
    mapping(address => Airline) private airlines;
    address[] private addressesAirlines;
    uint256 regIndexAirline;


    struct Insurance {
        address passenger;
        bytes32 flight;
        uint256 amount;
        uint payout;
        bool isPaid;
    }
    mapping(address => Insurance) private insurances;


    /********************************************************************************************/
    /*                                       EVENTS                                             */
    /********************************************************************************************/

    event OperationalStatusChanged(bool mode);
    event submittedAirline(address airline, bool isSubmitted, bool isApproved, bool isFunded, uint256 regIndex, uint256 votes);
    event votedAirline(address airline, address sender);
    event registeredAirline(address airline, address sender, bool isApproved);
    event fundedAirline(address airline, uint value, bool isFunded);
    event PaidInsurance(address _passenger, bytes32 _flight, uint256 _value, uint _payout, bool isPaid);


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(address _airline) public payable {
        contractOwner = msg.sender;
        airlines[_airline] = Airline(_airline, true, false, false, 0, 0);
        regIndexAirline = 0;
        addressesAirlines.push(_airline);
    }


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
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /** @dev Get operating status of contract
    *** @return A bool that is the current operating status*/
    function isOperational() public view returns(bool){
        return operational;
    }


    /** @dev Sets contract operations on/off
    *** When operational mode is disabled, all write transactions except for this one will fail */
    function setOperatingStatus(bool mode) external requireContractOwner differentModeRequest(mode) {
        operational = mode;
        emit OperationalStatusChanged(mode);
    }


    function authorizeCaller(address callerAddress) external requireContractOwner requireIsOperational {
        authorizedCallers[callerAddress] = true;
    }


    /** @dev getting balance of funds held in this contract address**/
    function getBalance() public view requireIsOperational returns (uint256) {
        return address(this).balance;
    }

    /** @dev getting if is submitted bool **/
    function isSubmitted(address _airline) external view returns(bool) {
        return airlines[_airline].isSubmitted;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/


    /** @dev Add an airline to the submit queue **/
    function submitAirline(address _airline) external payable requireIsOperational {
        uint256 regIndex = regIndexAirline++;

        airlines[_airline] = Airline({
            airline: _airline,
            isSubmitted: true,
            isApproved: false,
            isFunded: false,
            regIndex: regIndex,
            votes: 0
        });

        regIndexAirline = regIndex;
        addressesAirlines.push(_airline);

        emit submittedAirline(_airline, true, false, false, regIndex, 0);
    }


    /** @dev Vote an airline **/
    function voteAirline(address _airline) external {
        airlines[_airline].votes += 1;
        airlines[_airline].votedFor[msg.sender] = true;

        emit votedAirline(_airline, msg.sender);
    }


    /** @dev Add an airline to the registration queue Can only be called from FlightSuretyApp contract**/
    function registerAirline(address _airline) external {
        airlines[_airline].isApproved = true;
        emit registeredAirline(_airline, msg.sender, true);
    }


    /** @dev pay for registering Airline **/
    function fundAirline(address payable _airline) external payable requireIsOperational {
        airlines[_airline].isFunded = true;
    }


    /** @dev Get airline status**/
    function getAirline(address _airline) external view returns(address, bool, bool, bool, uint256, uint256) {
        return (
            airlines[_airline].airline,
            airlines[_airline].isSubmitted,
            airlines[_airline].isApproved,
            airlines[_airline].isFunded,
            airlines[_airline].regIndex,
            airlines[_airline].votes
        );
    }


    function getAirlines() external view returns(address[] memory) {
        address[] memory arrAddressesAirlines = new address[](addressesAirlines.length);
        for (uint i = 0; i < addressesAirlines.length; i++){
            arrAddressesAirlines[i] = airlines[addressesAirlines[i]].airline;
        }
        return (arrAddressesAirlines);
    }

    /** @dev Buy insurance for a flight**/
    function buyInsurance(address _passenger, bytes32 _flight, uint256 _value, uint _payout) external payable {

        insurances[_passenger] = Insurance({
            passenger: _passenger,
            flight: _flight,
            amount: _value,
            payout: _payout,
            isPaid: true
        });

        emit PaidInsurance(_passenger, _flight, _value, _payout, true);
    }


    /**  @dev Transfers eligible payout funds to insuree **/
    function payout(address payable _passenger) external payable {
        uint amount = insurances[_passenger].payout;
        address payable passenger = address(uint160(_passenger));

        passenger.transfer(amount);
    }


    /** @dev Fallback function for funding smart contract.**/
    function () payable external {}

}