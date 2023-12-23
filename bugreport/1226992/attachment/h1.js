let neuter = buffer => { try { postMessage("", "invalid", [buffer]) } catch (e) { } };
// Helper function to exchange ice candidates between
// two local peer connections
function exchangeIceCandidates(pc1, pc2) {
  // private function
  function doExchange(localPc, remotePc) {
    localPc.addEventListener('icecandidate', event => {
      const { candidate } = event;

      // Guard against already closed peerconnection to
      // avoid unrelated exceptions.
      if (remotePc.signalingState !== 'closed') {
        remotePc.addIceCandidate(candidate);
      }
    });
  }

  doExchange(pc1, pc2);
  doExchange(pc2, pc1);
}  

function freememory() {
  try { window.gc(); } catch (err) { }
}

function make_msgchat(arg_0,arg_cb){
  let channel = new MessageChannel();
  let localPort = channel.port1;
  let externalPort = channel.port2;
  
  externalPort.onmessage = arg_cb;
  
  localPort.postMessage(arg_0);
}

var runcount = { 'jsfuzzer': 0, 'eventhandler1': 0, 'eventhandler2': 0, 'eventhandler3': 0, 'eventhandler4': 0, 'eventhandler5': 0 }

function GetVariable(fuzzervars, var_type) { if (fuzzervars[var_type]) { return fuzzervars[var_type]; } else { return null; } }

function SetVariable(fuzzervars, var_name, var_type) { fuzzervars[var_type] = var_name; }
var fuzzervars = {};
    