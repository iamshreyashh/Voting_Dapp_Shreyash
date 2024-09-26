
const { toBigInt, toNumber } = require("ethers");
const { ethers } = require("hardhat");


describe("VotingMachine", function () {
  let VotingMachine, votingMachine, owner, addr1, addr2;

  beforeEach(async function () {
    const chai = await import("chai");
    expect = chai.expect;
    // Deploy the VotingMachine contract
    VotingMachine = await ethers.getContractFactory("VotingMachine");
    [owner, addr1, addr2, addr3] = await ethers.getSigners(); // Get test accounts
    votingMachine = await ethers.deployContract("VotingMachine");
  });

  // Test case: Create a proposal
  it("Should create a proposal and emit ProposalCreated event", async function () {
    const tx = await votingMachine.connect(addr1).createProposal("Proposal 1", 7); // 7 days validity
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    // Check the proposal details
    const [desc, startTime, duration, votesFor, votesAgainst] = await votingMachine.getProposalDetails(1);
    expect(desc).to.equal("Proposal 1");
    const durationInDays = Number(duration); // Duration should be a number, not a BigNumber
    expect(durationInDays).to.equal(7); // Should be equal to the validity provided
    expect(Number(votesFor)).to.equal(0);
    expect(Number(votesAgainst)).to.equal(0);
  });

  // Test case: Voting for a proposal
  it("Should allow users to vote for a proposal", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 7); // Create proposal

    // addr1 votes in favor
    await votingMachine.connect(addr1).voting(1, true);
    let [votesFor, votesAgainst] = await votingMachine.voteTally(1);
    expect(Number(votesFor)).to.equal(1);
    expect(Number(votesAgainst)).to.equal(0);

    // addr2 votes against
    await votingMachine.connect(addr2).voting(1, false);
    [votesFor, votesAgainst] = await votingMachine.voteTally(1);
    expect(Number(votesFor)).to.equal(1);
    expect(Number(votesAgainst)).to.equal(1);
  });

  // Test case: Prevent double voting
  it("Should not allow a user to vote twice", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 7); // Create proposal

    // addr1 votes in favor
    await votingMachine.connect(addr1).voting(1, true);

    // Try voting again, expect a revert
    await expect(votingMachine.connect(addr1).voting(1, false)).to.be.revertedWith("User has already voted for the proposal");
  });

  // Test case: Voting after expiration should not be allowed
  it("Should not allow voting after the voting period has ended", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 0); // Create proposal with 1 day validity

    // Move time forward by 2 days
    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // Try to vote after the expiration, expect a revert
    await expect(votingMachine.connect(addr1).voting(1, true)).to.be.revertedWith("Voting period has ended");
  });

  // Test case: Check proposal status (Active/Closed)
  it("Should return correct proposal status (Active/Closed)", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 1); // 1 day validity

    // Immediately after creation, proposal should be active
    let status = await votingMachine.getProposalStatus(1);
    expect(status).to.equal("Active");

    // Move forward in time by 2 days
    await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // After expiration, proposal should be closed
    status = await votingMachine.getProposalStatus(1);
    expect(status).to.equal("Closed");
  });

  // Test case: Check vote tally for a proposal
  it("Should return correct vote counts", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 7);

    // addr1 and addr2 cast votes
    await votingMachine.connect(addr1).voting(1, true);  // addr1 votes for
    await votingMachine.connect(addr2).voting(1, false); // addr2 votes against

    const [votesFor, votesAgainst] = await votingMachine.voteTally(1);
    expect(Number(votesFor)).to.equal(1);
    expect(Number(votesAgainst)).to.equal(1);
  });

  // Test case: Check if a user has voted
  it("Should correctly track if a user has voted", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 7);

    // addr1 votes
    await votingMachine.connect(addr1).voting(1, true);

    // Check if addr1 has voted
    let hasVoted = await votingMachine.checkUserVoted(1, addr1.address);
    expect(hasVoted).to.be.true;

    // Check if addr2 has voted (should not have)
    hasVoted = await votingMachine.checkUserVoted(1, addr2.address);
    expect(hasVoted).to.be.false;
  });

  // Test case: Retrieve the list of proposals
  it("Should return the list of all proposals", async function () {
    await votingMachine.connect(addr1).createProposal("Proposal 1", 7);
    await votingMachine.connect(addr2).createProposal("Proposal 2", 5);

    const proposals = await votingMachine.getListOfProposal();
    expect(proposals.length).to.equal(2);
    expect(Number(proposals[0])).to.equal(1);
    expect(Number(proposals[1])).to.equal(2);
  });
});
