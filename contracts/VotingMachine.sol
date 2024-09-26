// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

/// @title Voting smart contract
/// @author Shreyash Tripathi
/// @notice You can use this contract for voting simulation
/// @dev All function calls are currently implemented without side effects.

contract VotingMachine {

    ///// VARIABLE DECLARATION /////////////////////////////////////////////////////////////////////

    // Variable to store the current proposal ID, initialized to 1
    uint256 private current_proposal_ID = 1;


    ///// STRUCTURE /////////////////////////////////////////////////////////////////////

    /// @notice Defining the structure of the proposal
    /// @dev This struct contains all the necessary information about a proposal, including votes and timeframes.
    
    struct Proposal {
        uint256 PID;                    // Proposal ID
        string desc_text;               // Description of the proposal
        uint start_time;                // Timestamp when the proposal was created
        uint vote_time;                 // Duration for which voting is allowed (in seconds)
        uint256 vote_for;               // Counter for votes in favor of the proposal
        uint256 vote_against;           // Counter for votes against the proposal
        mapping(address => bool) Voted_users;  // Mapping to track which users have already voted
    }


    ///// MAPPINGS /////////////////////////////////////////////////////////////////////

    // Mapping of proposal IDs to Proposal structs to access each proposal by its unique ID
    mapping(uint256 => Proposal) proposal_by_id;

    ///// ARRAYS /////////////////////////////////////////////////////////////////////

    // Array to store all the proposal IDs that have been created
    uint256[] proposal_list;


    ////// EVENTS /////////////////////////////////////////////////////////////////////

    // Event emitted when a new proposal is created
    event ProposalCreated(uint256 PID, address creator);


    ////// FUNCTIONS //////////////////////////////////////////////////////////

    /// @notice Creates a new proposal with a description and validity period
    /// @param description The text describing the proposal
    /// @param validity The number of days for which voting will be allowed
    /// @return The unique ID of the created proposal
    function createProposal (string memory description, uint validity) external returns(uint256) {
        // Assign a unique ID to the proposal and set the description, voting time, and start time
        proposal_by_id[current_proposal_ID].PID = current_proposal_ID;
        proposal_by_id[current_proposal_ID].desc_text = description;
        proposal_by_id[current_proposal_ID].vote_time = validity * 86400;  // Convert days to seconds
        proposal_by_id[current_proposal_ID].start_time = block.timestamp;  // Set the current time as the start time

        // Emit an event to notify about the creation of the proposal
        emit ProposalCreated(current_proposal_ID, msg.sender);

        // Add the new proposal ID to the list of proposals
        proposal_list.push(current_proposal_ID);

        // Increment the proposal ID for the next proposal and return the current one
        return current_proposal_ID++;
    } 

    /// @notice Casts a vote for or against a specified proposal
    /// @param PID The ID of the proposal to vote on
    /// @param vote True for voting in favor, false for voting against
    function voting(uint256 PID, bool vote) external {
        // Ensure that the voting period is still active for the given proposal
        require(block.timestamp <= proposal_by_id[PID].vote_time + proposal_by_id[PID].start_time, "Voting period has ended");

        // Ensure that the user has not already voted for this proposal
        require(proposal_by_id[PID].Voted_users[msg.sender] == false, "User has already voted for the proposal");

        // Tally the vote for or against the proposal
        if (vote == true) {
            proposal_by_id[PID].vote_for++;
        } else {
            proposal_by_id[PID].vote_against++;
        }

        // Mark the user as having voted
        proposal_by_id[PID].Voted_users[msg.sender] = true;
    }

    /// @notice Checks the status of a proposal to see if voting is still active or closed
    /// @param PID The ID of the proposal
    /// @return The status of the proposal as a string ("Active" or "Closed")
    function getProposalStatus(uint256 PID) external view returns(string memory) {
        // Check if the current time is within the voting period of the proposal
        if(block.timestamp <= proposal_by_id[PID].vote_time + proposal_by_id[PID].start_time) {
            return "Active";
        } else {
            return "Closed";
        }
    }

    /// @notice Retrieves the total number of votes for and against a proposal
    /// @param PID The ID of the proposal
    /// @return The number of votes in favor and against the proposal
    function voteTally(uint256 PID) external view returns(uint256, uint256) {
        uint256 forVotes = proposal_by_id[PID].vote_for;         // Number of votes in favor
        uint256 againstVotes = proposal_by_id[PID].vote_against; // Number of votes against
        return (forVotes, againstVotes);
    }

    /// @notice Retrieves detailed information about a proposal
    /// @param PID The ID of the proposal
    /// @return The description, start time, voting duration (in days), and vote counts (for and against)
    function getProposalDetails(uint256 PID) external view returns(string memory, uint, uint, uint256, uint256) {
        return (
            proposal_by_id[PID].desc_text,
            proposal_by_id[PID].start_time,
            proposal_by_id[PID].vote_time / 1 days,  // Convert vote time back to days
            proposal_by_id[PID].vote_for,
            proposal_by_id[PID].vote_against
        );
    }

    /// @notice Checks whether a specific user has voted on a proposal
    /// @param PID The ID of the proposal
    /// @param user The address of the user
    /// @return True if the user has voted, false otherwise
    function checkUserVoted(uint256 PID, address user) external view returns(bool) {
        return proposal_by_id[PID].Voted_users[user];  // Return true or false based on user's vote status
    }

    function getListOfProposal() external view returns(uint256[] memory) {
        return proposal_list;
    }
}
