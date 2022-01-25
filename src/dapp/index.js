import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

const contract = new Contract('localhost');
let blockNumbersSeen = [];

(async() => {
    await contract.initWeb3(eventHandler);

    DOM.elid('get-operational-status').addEventListener('click', isOperational);
    DOM.elid('get-balance').addEventListener('click', getBalance);
    DOM.elid('disable-app-contract').addEventListener('click', setOperatingStatusAppFalse);
    DOM.elid('enable-app-contract').addEventListener('click', setOperatingStatusAppTrue);
    DOM.elid('disable-data-contract').addEventListener('click', setOperatingStatusDataFalse);
    DOM.elid('enable-data-contract').addEventListener('click', setOperatingStatusDataTrue);
    DOM.elid('submit-airline').addEventListener('click', submitAirline);
    DOM.elid('vote-airline').addEventListener('click', voteAirline);
    DOM.elid('register-airline').addEventListener('click', registerAirline);
    DOM.elid('get-airline-status').addEventListener('click', getAirlineStatus);
    DOM.elid('fund-airline').addEventListener('click', fundAirline);
    DOM.elid('register-flight').addEventListener('click', registerFlight);
    DOM.elid('submit-oracle').addEventListener('click', fetchFlight);
    DOM.elid('get-flight-status').addEventListener('click', getFlightStatus);
    DOM.elid('buy-insurance').addEventListener('click', buyInsurance);
    DOM.elid('get-payout').addEventListener('click', payout);

    await getAirlines();
    await getFlights();

})();

const isOperational = async () => {
    let result;
    let error;
    try {
        result = await contract.isOperational();

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status App Contract', error: error, value: result[0]} ]);
    display('display-wrapper-operational', [ { label: 'Status Data Contract', error: error, value: result[1]} ]);
}

const getBalance = async () => {
    let result;
    let error;
    try {
        result = await contract.getBalance();

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Balance App Contract', error: error, value: result[0] + ' eth'} ]);
    display('display-wrapper-operational', [ { label: 'Balance Data Contract', error: error, value: result[1] + ' eth'} ]);
}

const setOperatingStatusAppTrue = async () => {
    let error;
    try {
        await contract.setOperationalStatusApp(true);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusAppFalse = async () => {
    let error;
    try {
        await contract.setOperationalStatusApp(false);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Disabled Contract'} ]);
}

const setOperatingStatusDataTrue = async () => {
    let error;
    try {
        await contract.setOperationalStatusData(true);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusDataFalse = async () => {
    let error;
    try {
        await contract.setOperationalStatusData(false);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const submitAirline = async () => {
    let value = DOM.elid('submit-airline-input').value;
    let result;
    let error;

    try {
        result = await contract.submitAirline(value);
    } catch (e) {
        error = e.message;
    }

    display('display-wrapper-airlines', [ { label: 'Submit Airline', error: error, value: value} ]);
}

const voteAirline = async () => {
    let value = DOM.elid('vote-airline-input').value;
    let result;
    let error;
    try {
        result = await contract.voteAirline(value);

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-airlines', [ { label: 'Airline Voted', error: error, value: value} ]);
}

const registerAirline = async () => {
    let value = DOM.elid('register-airline-input').value;
    let result;
    let error;
    try {
        result = await contract.registerAirline(value);

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-airlines', [ { label: 'Airline Registered', error: error, value: value} ]);
}

const getAirlineStatus = async () => {
    let value = DOM.elid('get-airline-status-input').value;
    let result;
    let error;
    let stateAirlineKeys = ['Airline', 'Submitted', 'Approved', 'Funded', 'Index', 'Votes'];
    let stateAirline = [];
    display('display-wrapper-airlines', [ { label: '=======', error: error, value: '======='} ]);
    try {
        result = await contract.getAirlineStatus(value);

        for(let inx = 0; inx < Object.keys(result).length; inx++) {
            display('display-wrapper-airlines', [ { label: stateAirlineKeys[inx], error: error, value: result[inx]} ]);
        }
    } catch (e) {
        error = e.message;
        display('display-wrapper-airlines', [ { label: 'Airline Status', error: error, value: result} ]);
    }
    display('display-wrapper-airlines', [ { label: '=======', error: error, value: '======='} ]);
}

const fundAirline = async () => {
    let value = DOM.elid('fund-airline-input').value;
    let result;
    let error;
    try {
        result = await contract.fundAirline(value);


    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-airlines', [ { label: 'Airline Status', error: error, value: result} ]);
};

const getAirlines = async () => {
    let selectFlights = DOM.elid('register-flight-airline-select');
    let selectInsurance = DOM.elid('insurance-airline-select');
    let result;
    let error;
    try {
        result = await contract.getAirlines();

        for(let inx = 0; inx < Object.keys(result).length; inx++) {
            selectFlights.appendChild(DOM.option({value: result[inx]}, 'Airline ' + result[inx]));
        }
    } catch (e) {
        error = e.message;

        display('display-wrapper-passengers', [ { label: 'Airline Status', error: error, value: ''} ]);
    }
};

const registerFlight = async () => {
    let airlineValue = DOM.elid('register-flight-airline-select').value;
    let flightValue = DOM.elid('register-flight-number-input').value;
    let flightTimestamp = DOM.elid('register-flight-timestamp-input').value;
    let result;
    let error;

    try {
        result = await contract.registerFlight(airlineValue, flightValue, flightTimestamp);

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-flights', [ { label: 'Submit Airline', error: error, value: flightValue} ]);
}

const getFlights = async () => {
    let selectFlights = DOM.elid('buy-insurance-select');
    let selectFetchFlights = DOM.elid('fetch-flight-airline-select');
    let selectGetFlights = DOM.elid('get-status-flight-select');
    let flightKey;
    let flightData;
    let error;
    try {
        flightKey = await contract.getFlights();

        for(let inx = 0; inx < Object.keys(flightKey).length; inx++) {
            flightData = await contract.getFlightData(flightKey[inx]);

            selectFlights.appendChild(DOM.option({value: flightKey[inx]}, 'Flight: ' + flightData[3] + '  ' + new Date(parseInt(flightData[5]))));
            selectFetchFlights.appendChild(DOM.option({value: flightKey[inx]}, 'Flight: ' + flightData[3] + '  ' + new Date(parseInt(flightData[5]))));
            selectGetFlights.appendChild(DOM.option({value: flightKey[inx]}, 'Flight: ' + flightData[3] + '  ' + new Date(parseInt(flightData[5]))));
        }

    } catch (e) {
        error = e.message;
        display('display-wrapper-flights', [ { label: 'Flight Status', error: error, value: ''} ]);
    }
};

const getFlightStatus = async () => {
    let flightKey = DOM.elid('get-status-flight-select').value;
    let flightData;
    let error;

    try {
        flightData = await contract.getFlightData(flightKey);

        display('display-wrapper-passengers', [ { label: '', error: '', value: '=========='}]);
        display('display-wrapper-passengers', [ { label: 'Flight Airline', error: '', value: flightData[0]}]);
        display('display-wrapper-passengers', [ { label: 'Flight Key', error: '', value: flightData[2]}]);
        display('display-wrapper-passengers', [ { label: 'Flight Number', error: '', value: flightData[3]}]);
        display('display-wrapper-passengers', [ { label: 'Flight Date', error: '', value: flightData[5]}]);
        display('display-wrapper-passengers', [ { label: 'Flight Status', error: '', value: _getStatusCode(flightData[4])}]);
        display('display-wrapper-passengers', [ { label: '', error: '', value: '=========='}]);

    } catch (e) {
        error = e.message;
        display('display-wrapper-passengers', [ { label: 'Airline Status', error: error, value: ''} ]);
    }
};

const _getStatusCode = function(code) {

    if (code === '0') {
        return 'UNKNOWN';
    } else if (code === '10') {
        return 'ON_TIME';
    } else if (code === '20'){
        return 'LATE_AIRLINE';
    } else if (code === '30') {
        return 'LATE_WEATHER';
    } else if (code === '40') {
        return 'LATE_TECHNICAL';
    } else if (code === '50') {
        return 'LATE_OTHER';
    }
}

const fetchFlight = async () => {
    let flightKey = DOM.elid('fetch-flight-airline-select').value;
    let result;
    let error;

    try {
        result = await contract.fetchFlight(flightKey);

    } catch (e) {
        error = e.message;
    }

    display('display-wrapper-passengers', [ { label: 'Fetch Flight Status', error: error, value: flightKey} ]);
}

const buyInsurance = async () => {
    let value = DOM.elid('buy-insurance-input').value;
    let flight = DOM.elid('buy-insurance-select').value;
    let result;
    let error;

    try {
        result = await contract.buyInsurance(value, flight);

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-passengers', [ { label: 'Buy Status', error: error, value: result} ]);
};

const payout = async () => {
    let result
    let error;
    try {
        result = await contract.payout();

    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-passengers', [ { label: 'Pay Out', error: error, value: result} ]);
};


//====================

function display(wrapper, results) {
    let displayDiv = DOM.elid(wrapper);
    let section = DOM.section();
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-6 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-6 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}

function eventHandler(error, event) {
    if (blockNumbersSeen.indexOf(event.transactionHash) > -1) {
        blockNumbersSeen.splice(blockNumbersSeen.indexOf(event.transactionHash), 1);
        return;
    }
    blockNumbersSeen.push(event.transactionHash);
}