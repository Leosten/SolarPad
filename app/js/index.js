/*globals $, SimpleStorage, document*/
$(document).ready(function() {

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
