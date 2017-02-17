/*globals $, SimpleStorage, document*/
$(document).ready(function() {

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi = [{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"setString","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getString","outputs":[{"name":"","type":"string"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"changedString","type":"string"}],"name":"stringChanged","type":"event"}];
var sender = "0x687d3e7804f7f04e3181bb742014f6ad385773e5";
// web3.personal.unlockAccount(sender, "1111");
// var contract = web3.eth.contract(abi).at(sender);
// var buyer = web3.eth.contract(abi).at("0x687d3e7804f7f04e3181bb742014f6ad385773e5");
//connexion au testRPC wallet


var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

var addToSolarLog = function(id, txt) {
  $(id + " .solarlogs").append("<br>" + txt);
};



var currentmwh = 2500;
var threshold = 1700;

// ===========================
// My solar energy
// ===========================
SolarEnergy.set(currentmwh, threshold);

// var contractInstance = new SolarEnergy({threshold, currentmwh});

$("#blockchain button.setcurrentsolar").click(function() {
    var value = parseInt($("#blockchain input.current").val(), 10);
    currentmwh = value;
    SolarEnergy.set(currentmwh, threshold);
    // addToSolarLog("#blockchain", "SimpleStorage.set(" + value + ")");
  });

  $("#blockchain button.setthresholdsolar").click(function() {
    var value = parseInt($("#blockchain input.threshold").val(), 10);
    threshold = value;
    SolarEnergy.set(currentmwh, threshold);
    // addToSolarLog("#blockchain", "SimpleStorage.set(" + value + ")");
  });

  $("#blockchain button.getetherbalance").click(function() {
    SolarEnergy.get().then(function(value) {
      $("#blockchain .currentether").html(value.toNumber());
    // addToSolarLog("#blockchain", "get ether balance: " + value.toNumber());
    });
  });

  $("#blockchain button.sellenergy").click(function() {
    var address = $("#blockchain input.address").val();
    SolarEnergy.sellExcessEnergyForEther(address).then(function(result) {
        $("#blockchain .result").html(result);
    // addToSolarLog("#blockchain", "get ether balance: " + value.toNumber());
    });
  });
});

// ===========================
// Storage (IPFS) example
// ===========================
$(document).ready(function() {
  EmbarkJS.Storage.setProvider('ipfs',{server: 'localhost', port: '5001'});

  $("#storage button.setIpfsText").click(function() {
    var value = $("#storage input.ipfsText").val();
    EmbarkJS.Storage.saveText(value).then(function(hash) {
      $("span.textHash").html(hash);
      $("input.textHash").val(hash);
    });
    addToLog("#storage", "EmbarkJS.Storage.saveText('" + value + "').then(function(hash) { })");
  });

  $("#storage button.loadIpfsHash").click(function() {
    var value = $("#storage input.textHash").val();
    EmbarkJS.Storage.get(value).then(function(content) {
      $("span.ipfsText").html(content);
    });
    addToLog("#storage", "EmbarkJS.Storage.get('" + value + "').then(function(content) { })");
  });

  $("#storage button.uploadFile").click(function() {
    var input = $("#storage input[type=file]");
    EmbarkJS.Storage.uploadFile(input).then(function(hash) {
      $("span.fileIpfsHash").html(hash);
      $("input.fileIpfsHash").val(hash);
    });
    addToLog("#storage", "EmbarkJS.Storage.uploadFile($('input[type=file]')).then(function(hash) { })");
  });

  $("#storage button.loadIpfsFile").click(function() {
    var hash = $("#storage input.fileIpfsHash").val();
    var url = EmbarkJS.Storage.getUrl(hash);
    var link = '<a href="' + url + '" target="_blank">' + url + '</a>';
    $("span.ipfsFileUrl").html(link);
    $(".ipfsImage").attr('src', url);
    addToLog("#storage", "EmbarkJS.Storage.getUrl('" + hash + "')");
  });

});

// ===========================
// Communication (Whisper) example
// ===========================
$(document).ready(function() {

  $("#communication .error").hide();
  web3.version.getWhisper(function(err, res) {
    if (err) {
      $("#communication .error").show();
    } else {
      EmbarkJS.Messages.setProvider('whisper');
    }
  });

  $("#communication button.listenToChannel").click(function() {
    var channel = $("#communication .listen input.channel").val();
    $("#communication #subscribeList").append("<br> subscribed to " + channel + " now try sending a message");
    EmbarkJS.Messages.listenTo({topic: [channel]}).then(function(message) {
      $("#communication #messagesList").append("<br> channel: " + channel + " message: " + message);
    });
    addToLog("#communication", "EmbarkJS.Messages.listenTo({topic: ['" + channel + "']}).then(function(message) {})");
  });

  $("#communication button.sendMessage").click(function() {
    var channel = $("#communication .send input.channel").val();
    var message = $("#communication .send input.message").val();
    EmbarkJS.Messages.sendMessage({topic: channel, data: message});
    addToLog("#communication", "EmbarkJS.Messages.sendMessage({topic: '" + channel + "', data: '" + message + "'})");
  });

});

