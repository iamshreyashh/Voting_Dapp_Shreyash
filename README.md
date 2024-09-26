# Voting application

This project demonstrates a basic decentralized voting application. It comes with a contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Used the XDC Appothem test network for deployment.
explorer: https://explorer.apothem.network/

contract address: 0x666901E36c74A7323704Acb282d08de03D06877F

[ Note: In the test file, the contract is re-deployed. ]

This folder contrains::

1. The smart contract (VotingMachine.sol)
2. Test folder (Voting.js)
3. Class diagram and Sequence diagram 


Try running some of the following tasks:

1. npx hardhat compile // to compile the smart contracts
2. npx hardhat ignition deploy ./ignition/modules/VotingMachine.js  // to deploy the cotract
3. npx hardhat test // to run the test cases

The test file tests the following parameters:

- Should create a proposal and emit ProposalCreated event
- Should allow users to vote for a proposal
- Should not allow a user to vote twice
- Should not allow voting after the voting period has ended
- Should return correct proposal status (Active/Closed)
- Should return correct vote counts
- Should correctly track if a user has voted
- Should return the list of all proposals


All the test cases (8) are successfully passed !


