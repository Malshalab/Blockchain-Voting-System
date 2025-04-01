const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(Voting, { gas: 6700000, gasPrice: 20000000000 });
};