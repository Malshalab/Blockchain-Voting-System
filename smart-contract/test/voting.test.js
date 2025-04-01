const DecentralizedVoting = artifacts.require("DecentralizedVoting");

contract("DecentralizedVoting", accounts => {
    const admin = accounts[0];
    const validator = accounts[1];
    const voter = accounts[2];

    let instance;

    beforeEach(async () => {
        instance = await DecentralizedVoting.new({ from: admin });
    });

    it("should add a validator", async () => {
        await instance.addValidator(validator, { from: admin });
        const isVal = await instance.isValidator(validator);
        assert.equal(isVal, true);
    });

    it("should remove a validator", async () => {
        await instance.addValidator(validator, { from: admin });
        await instance.removeValidator(validator, { from: admin });
        const isVal = await instance.isValidator(validator);
        assert.equal(isVal, false);
    });

    it("should register a voter", async () => {
        const voterHash = web3.utils.keccak256("voter-id");
        await instance.registerVoter(voterHash, { from: admin });
        const isRegistered = await instance.registeredVoters(voterHash);
        assert.equal(isRegistered, true);
    });

    it("should create a poll", async () => {
        const now = Math.floor(Date.now() / 1000);
        await instance.createPoll("Test Poll", now, now + 1000, { from: admin });
        const poll = await instance.polls(1);
        assert.equal(poll.title, "Test Poll");
    });

    it("should add a candidate", async () => {
        const now = Math.floor(Date.now() / 1000);
        await instance.createPoll("Poll", now, now + 1000, { from: admin });
        await instance.addCandidate(1, "Alice", { from: admin });
        const poll = await instance.polls(1);
        assert.equal(poll.candidateCount.toNumber(), 1);
    });

    it("should allow a registered voter to vote and get refunded", async () => {
        const now = Math.floor(Date.now() / 1000);
        const voteFee = await instance.voteFee();
        const voterHash = web3.utils.keccak256("voter-1");

        await instance.registerVoter(voterHash, { from: admin });
        await instance.createPoll("Vote Poll", now, now + 1000, { from: admin });
        await instance.addCandidate(1, "Bob", { from: admin });

        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(voter));

        const tx = await instance.vote(1, 1, voterHash, {
            from: voter,
            value: voteFee,
            gasPrice: 0 // makes balance math easier
        });

        const finalBalance = web3.utils.toBN(await web3.eth.getBalance(voter));
        assert.equal(finalBalance.sub(initialBalance).toString(), "0");
    });

    it("should return poll results", async () => {
        const now = Math.floor(Date.now() / 1000);
        const voterHash = web3.utils.keccak256("voter-x");

        await instance.registerVoter(voterHash, { from: admin });
        await instance.createPoll("Results Poll", now, now + 1000, { from: admin });
        await instance.addCandidate(1, "Alice", { from: admin });
        await instance.vote(1, 1, voterHash, {
            from: voter,
            value: await instance.voteFee(),
            gasPrice: 0
        });

        const results = await instance.getPollResults(1);
        assert.equal(results.candidateIds.length, 1);
        assert.equal(results.voteCounts[0].toNumber(), 1);
    });

    it("should deactivate a poll", async () => {
        const now = Math.floor(Date.now() / 1000);
        await instance.createPoll("Inactive Poll", now, now + 1000, { from: admin });
        await instance.deactivatePoll(1, { from: admin });
        const poll = await instance.polls(1);
        assert.equal(poll.active, false);
    });
});
