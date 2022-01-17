import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
//import BigNum from "bignumber";

const contract = new Contract('localhost');
let blockNumbersSeen = [];

(async() => {
    await contract.initWeb3(eventHandler);

    DOM.elid('get-operational-status').addEventListener('click', isOperational);
    DOM.elid('disable-app-contract').addEventListener('click', setOperatingStatusAppFalse);
    DOM.elid('enable-app-contract').addEventListener('click', setOperatingStatusAppTrue);
    DOM.elid('disable-data-contract').addEventListener('click', setOperatingStatusDataFalse);
    DOM.elid('enable-data-contract').addEventListener('click', setOperatingStatusDataTrue);
    DOM.elid('submit-oracle').addEventListener('click', fetchFlightStatus);
    DOM.elid('submit-airline').addEventListener('click', submitAirline);
    DOM.elid('vote-airline').addEventListener('click', voteAirline);
    DOM.elid('register-airline').addEventListener('click', registerAirline);
    DOM.elid('get-airline-status').addEventListener('click', getAirlineStatus);

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

const setOperatingStatusAppTrue = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusApp(true);
    } catch (e) {
        error = e.message;
        debugger;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusAppFalse = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusApp(false);
    } catch (e) {
        error = e.message;
        debugger;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Disabled Contract'} ]);
}

const setOperatingStatusDataTrue = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusData(true);
    } catch (e) {
        error = e.message;
        debugger;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const setOperatingStatusDataFalse = async () => {
    let error = null;
    try {
        await contract.setOperationalStatusData(false);
    } catch (e) {
        error = e.message;
        debugger;
    }
    display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
}

const fetchFlightStatus = async () => {
    let value = DOM.elid('flight-number').value;
    let result = null;
    let error = null;
    try {
        result = await contract.fetchFlightStatus(value);
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
    debugger;
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
    try {
        result = await contract.getAirlineStatus(value);
        result = JSON.stringify(result);

    } catch (e) {
        error = JSON.stringify(e.message);
    }
    console.log(error);
    display('display-wrapper-airlines', [ { label: 'Airline Status', error: error, value: result} ]);
}

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
    // console.log(event.address);
    //
    // const log = DOM.elid('log-ul');
    // let newLi1 = document.createElement('li');
    // newLi1.append(`${event.event} - ${event.transactionHash}`);
    // log.appendChild(newLi1);
}


/*


const isOperational = async () => {
    await contract.isOperational((error, result) => {
        display('display-wrapper-operational', [{label: 'Status', error: error, value: result}]);
    });
}

const setOperatingStatusFalse = async () => {
    await contract.setOperationalStatus(false, (error, result) => {
        display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Disabled Contract'} ]);
    });
}

const setOperatingStatusTrue = async () => {
    await contract.setOperationalStatus(true, (error, result) => {
       display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
    });
}

const fetchFlightStatus = async () => {
    let value = DOM.elid('flight-number').value;
    await contract.fetchFlightStatus(value, (error, result) => {
        display('display-wrapper-oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
    });
}

function EnableDisable(customerAddress, ether) {
    //Reference the Button.
    var btnSubmit = document.getElementById("submitCustomerDetails");

    //Verify the TextBox value.
    if (customerAddress.value.trim() != "") {
        //Disable the TextBox when TextBox has value.
        submitCustomerDetails.disabled = false;
    } else if (ether == 0 || ether > 1) {
        //Disable the Enable the TextBox when TextBox has value.
        submitCustomerDetails.disabled = false;
    } else {
        //Enable both the TextBox when TextBox is empty.
        btnSubmit.disabled = true;
    }
};
*/












// import DOM from './dom';
// import Contract from './contract';
// import './flightsurety.css';
//
//
// (async() => {
//
//     let result = null;
//
//     let contract = new Contract('localhost', () => {
//
//         DOM.elid('get-operational-status').addEventListener('click', () => {
//             contract.isOperational((error, result) => {
//                 console.log(error,result);
//                 display('display-wrapper-operational', [ { label: 'Status', error: error, value: result} ]);
//             });
//         });
//
//         DOM.elid('disable-contract').addEventListener('click', () => {
//             contract.setOperatingStatus(false, (error, result) => {
//                 console.log(error,result);
//                 display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Disabled Contract'} ]);
//             });
//         })
//
//         DOM.elid('enable-contract').addEventListener('click', () => {
//             contract.setOperatingStatus(true, (error, result) => {
//                 console.log(error,result)
//                 display('display-wrapper-operational', [ { label: 'Status', error: error, value: 'Enabled Contract'} ]);
//             });
//         })
//
//         // User-submitted transaction
//         DOM.elid('submit-oracle').addEventListener('click', () => {
//             let value = DOM.elid('flight-number').value;
//             // Write transaction
//             contract.fetchFlightStatus(value, (error, result) => {
//                 display('display-wrapper-oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
//             });
//         })
//
//         DOM.elid('register-airline').addEventListener('click', () => {
//             let value = DOM.elid('register-airline-input').value;
//             contract.registerAirline(value, (error, result) => {
//                display('display-wrapper-airlines', [{label: 'register-airline', error: error, value: result.value}]);
//             });
//         });
//
//         DOM.elid('register-flight').addEventListener('click', () => {
//             let value = DOM.elid('register-flight-input').value;
//             contract.registerFlight(value, (error, result) => {
//                display('display-wrapper-airlines',  [{label: 'register-flight', error: error, value: result.value}]);
//             });
//         });
//
//         DOM.elid('process-flight-status').addEventListener('click', () => {
//             let value = DOM.elid('process-flight-status-input').value;
//             contract.processFlightStatus(value, (error, result) => {
//                display( 'display-wrapper-airlines',  [{label: 'process-flight-status', error: error, value: result.value}]);
//             });
//         });
//
//     });
//
//
// })();
//
//
// function display(wrapper, results) {
//     let displayDiv = DOM.elid(wrapper);
//     let section = DOM.section();
//
//     results.map((result) => {
//         let row = section.appendChild(DOM.div({className:'row'}));
//         row.appendChild(DOM.div({className: 'col-sm-6 field'}, result.label));
//         row.appendChild(DOM.div({className: 'col-sm-6 field-value'}, result.error ? String(result.error) : String(result.value)));
//         section.appendChild(row);
//     })
//     displayDiv.append(section);
//
// }
//
//
//
//
//
//
//
