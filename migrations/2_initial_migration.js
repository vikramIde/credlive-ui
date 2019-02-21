var MediaStore = artifacts.require("./MediaStore.sol");
var TestContract = artifacts.require("./TestContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MediaStore);
  deployer.deploy(TestContract);
};
