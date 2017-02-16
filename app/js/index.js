/*globals $, SimpleStorage, document*/

var addToLog = function(id, txt) {
  $(id + " .logs").append("<br>" + txt);
};

var addToSolarLog = function(id, txt) {
  $(id + " .solarlogs").append("<br>" + txt);
};

var currentmwh = 2500;
var threshold = 1700;
var excess = currentmwh - threshold;
excess = 0;

// ===========================
// Blockchain example
// ===========================
$(document).ready(function() {

  $("#blockchain button.set").click(function() {
    var value = parseInt($("#blockchain input.text").val(), 10);
    SimpleStorage.set(value);
    addToLog("#blockchain", "SimpleStorage.set(" + value + ")");
  });

  $("#blockchain button.get").click(function() {
    SimpleStorage.get().then(function(value) {
      $("#blockchain .value").html(value.toNumber());
    });
    addToLog("#blockchain", "SimpleStorage.get()");
  });


// ===========================
// My solar energy
// ===========================
$("#blockchain button.setcurrentsolar").click(function() {
    var value = parseInt($("#blockchain input.current").val(), 10);
    currentmwh = value;
    // addToSolarLog("#blockchain", "SimpleStorage.set(" + value + ")");
  });

  $("#blockchain button.setthresholdsolar").click(function() {
    var value = parseInt($("#blockchain input.threshold").val(), 10);
    currentmwh = value;
    // addToSolarLog("#blockchain", "SimpleStorage.set(" + value + ")");  
  });

  $("#blockchain button.getetherbalance").click(function() {
    SolarEnergy.get().then(function(value) {
      $("#blockchain .currentether").html(value.toNumber());
    // addToSolarLog("#blockchain", "get ether balance: " + value.toNumber());
    });
  });

  $("#blockchain button.sellenergy").click(function() {
    var address = $("#blockchain input.address").html();
    SolarEnergy.sellExcessEnergyForEther("0xf78854ef9961ac891b153be685ef91ea3fece182", excess).then(function(bool) {
      if (bool === true) {
        $("#blockchain .result").html("Transaction accepted");
      } else {
        $("#blockchain .result").html("Transaction refused, not enough ether");
      }
    // addToSolarLog("#blockchain", "get ether balance: " + value.toNumber());
    });
  });


  // $("#blockchain button.addresses").click(function() {
  //   SolarEnergy.checkAddresses().then(function(arr) {
  //   newHTML = [];
  //   $.each(arr, function(index, value) {
  //     newHTML.push('<span>' + value + '</span>');
  //   });
  //   $("#blockchain .result").html(newHTML.join(""));

  //   });
  // });

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

