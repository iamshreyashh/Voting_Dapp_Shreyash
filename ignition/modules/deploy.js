const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("deploy", (m) => {

  const ContractA = m.contract("VotingMachine", [], );
  return { ContractA };
});


