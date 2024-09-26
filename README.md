# Voting application

This project demonstrates a basic decentralized voting application. It comes with a contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Also included the pictures of self-build notes on paper before the start of building in order to simplyfy the process and understand the needs, it is part of how I proceed with the work along.

Used the XDC Appothem test network for deployment.
explorer: https://explorer.apothem.network/

contract address: 0x666901E36c74A7323704Acb282d08de03D06877F

[ Note: In the test file, the contract is re-deployed. ]

This folder contrains::

1. The smart contract (VotingMachine.sol)
2. Test folder (Voting.js)
3. Class diagram and Sequence diagram 


Try running some of the following tasks:

 1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voting-machine.git
   cd voting-machine
```
2. Compile the smart contract
```bash
 npx hardhat compile
```
3. Deploy the smart contract
```bash
 npx hardhat ignition deploy ./ignition/modules/VotingMachine.js
```
4. Run the test cases:
```bash
 npx hardhat test
```

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


--> Assumptions I made:

1. Storing the details of the vote_for and vote_against for each proposal to be withing the struct as to maintain clean accessability and a abstraction layer to other data.

2. The time period of the proposal is assumed to be in days, it can be also taken as the seconds or minutes if needed.

3. The return of the details of the proposal includes:
   a) The description text
   b) The start time stamp
   c) The for_votes
   d) the against_votes
 All these details were assumed to be enough to show as result.

4. In the structure of a proposal I added few extra fields for the sake of data management and better organization of a proposal and its defiition.



--> Future upgradations possible:

1. In the further upgrade of the contract we can set that a user can creat a proposal and only create another after the first one ends to prevent a single user to repeatdly creating simultaneous multi proposals.

2. creating a list of allowed voters only to make sure only legitimate votes fallin.



--> SECURITY:

1. The security of the smart contract is currently good-moderate, for current needs the security is well. If further upgradations are made the security level can be upgraded accordingly.


Thanks and Regards !
Shreyash



