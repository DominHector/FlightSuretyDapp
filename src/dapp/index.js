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
    DOM.elid('submit-oracle').addEventListener('click', fetchFlight);
    DOM.elid('submit-airline').addEventListener('click', submitAirline);
    DOM.elid('vote-airline').addEventListener('click', voteAirline);
    DOM.elid('register-airline').addEventListener('click', registerAirline);
    DOM.elid('get-airline-status').addEventListener('click', getAirlineStatus);
    DOM.elid('fund-airline').addEventListener('click', fundAirline);

    await getAirlines();

})();

const isOperational = async () => {
    let result = null;
    let error = null;
    try {
        result = await contract.isOperational();
    } catch (e) {
        error = e;
    }
    display('display-wrapper-operational', [ { label: 'Status App Contract', error: error, value: result[0]} ]);
    display('display-wrapper-operational', [ { label: 'Status Data Contract', error: error, value: result[1]} ]);
}

const getBalance = async () => {
    let result = null;
    let error = null;
    try {
        result = await contract.getBalance();
    } catch (e) {
        error = e;
    }
    display('display-wrapper-operational', [ { label: 'Balance App Contract', error: error, value: result[0] + ' eth'} ]);
    display('display-wrapper-operational', [ { label: 'Balance Data Contract', error: error, value: result[1] + ' eth'} ]);
}

const setOperatingStatusAppTrue = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusApp(true);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusAppFalse = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusApp(false);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Disabled Contract'} ]);
}

const setOperatingStatusDataTrue = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusData(true);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusDataFalse = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusData(false);
    } catch (e) {
        error = e.message;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const fetchFlight = async () => {
    let value = DOM.elid('flight-number').value;
    let result = null;
    let error = null;
    try {
        result = await contract.fetchFlight(value);
    } catch (e) {
        error = JSON.stringify(e.message);
    }
    console.log(error);
    display('display-wrapper-oracles', [ { label: 'Fetch Flight Status', error: error, value: value + ' ' + Math.floor(Date.now() / 1000)} ]);
}

const submitAirline = async () => {
    let value = DOM.elid('submit-airline-input').value;
    let result = null;
    let error = null;

    try {
        result = await contract.submitAirline(value);
    } catch (e) {
        error = JSON.stringify(e.message);
    }
    console.log(error);
    display('display-wrapper-airlines', [ { label: 'Submit Airline', error: error, value: value} ]);
}

const voteAirline = async () => {
    let value = DOM.elid('vote-airline-input').value;
    let result = null;
    let error = null;
    try {
        result = await contract.voteAirline(value);
    } catch (e) {
        error = JSON.stringify(e.message);
    }
    console.log(error);
    display('display-wrapper-airlines', [ { label: 'Airline Voted', error: error, value: value} ]);
}

const registerAirline = async () => {
    let value = DOM.elid('register-airline-input').value;
    let result = null;
    let error = null;
    try {
        result = await contract.registerAirline(value);
    } catch (e) {
        error = JSON.stringify(e.message);
    }
    console.log(error);
    display('display-wrapper-airlines', [ { label: 'Airline Registered', error: error, value: value} ]);
}

const getAirlineStatus = async () => {
    let value = DOM.elid('get-airline-status-input').value;
    let result = null;
    let error = null;
    let stateAirlineKeys = ['Airline', 'Register', 'Index', 'Votes'];
    let stateAirline = [];
    display('display-wrapper-airlines', [ { label: '=======', error: error, value: '======='} ]);
    try {
        result = await contract.getAirlineStatus(value);
        for(let inx = 0; inx < Object.keys(result).length; inx++) {
            display('display-wrapper-airlines', [ { label: stateAirlineKeys[inx], error: error, value: result[inx]} ]);
        }
    } catch (e) {
        error = JSON.stringify(e.message);
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
        debugger;
    } catch (e) {
        error = JSON.stringify(e.message);
    }
    display('display-wrapper-airlines', [ { label: 'Airline Status', error: error, value: result} ]);
};

const getAirlines = async () => {
    let select = DOM.elid('select-insurance-airline-select');
    let result;
    let error;
    try {
        result = await contract.getAirlines();
        for(let inx = 0; inx < Object.keys(result[0]).length; inx++) {
            select.appendChild(DOM.option({value: result[0][inx]}, 'Airline ' + result[1][inx]));
        }
    } catch (e) {
        error = JSON.stringify(e.message);
        display('display-wrapper-passengers', [ { label: 'Airline Status', error: error, value: ''} ]);
    }
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