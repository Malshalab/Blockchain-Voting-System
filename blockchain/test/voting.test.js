const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  it("should deploy the contract and emit debug events", async () => {
    const instance = await Voting.deployed();
    const pollCount = await instance.pollCount();
    assert.equal(pollCount.toNumber(), 0, "Initial poll count should be 0");
  });

  it("should create a poll successfully and emit events", async () => {
    const instance = await Voting.deployed();
    try {
      const tx = await instance.createPoll("Favorite color?", ["Red", "Blue"]);
      console.log("Events emitted during createPoll:", tx.logs);
      const pollCount = await instance.pollCount();
      assert.equal(pollCount.toNumber(), 1, "Poll count should be 1 after creating a poll");
    } catch (error) {
      assert.fail("createPoll failed with error: " + error.message);
    }
  });

  it("should revert when creating a poll with fewer than two options", async () => {
    const instance = await Voting.deployed();
    try {
      await instance.createPoll("Invalid Poll", ["OnlyOneOption"]);
      assert.fail("The transaction should have thrown an error");
    } catch (error) {
      // Check that the error message indicates a revert (common for require failures)
      assert(
        error.message.toLowerCase().includes("revert"),
        "Expected error message to contain 'revert', got: " + error.message
      );
    }
  });
});