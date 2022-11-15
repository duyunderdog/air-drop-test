const Airdrop = artifacts.require("TheAirdropDistributor");

module.exports = function(deployer) {
  deployer.deploy(Airdrop);
};
