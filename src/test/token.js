const Token = artifacts.require("Token");
const helper = require("./helpers/truffleTestHelper");

contract.only("Token", function(accounts) {
  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  let tokenInstance;

  beforeEach(async function () {
    tokenInstance = await Token.new();
  });

  describe("ERC20 tests", () => {
    it("It should test ERC20 public properties", async function () {
      const name = await tokenInstance.name();
      assert.equal(name, "SCC", "Name should be StartCryptoCoin");

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "SCC", "Symbol should be SCC");
    });

    it("Total supply should be 0", async function () {
      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });

    it("Owner balance should be 0", async function () {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 0, "Balance should be 0");
    });
  });

  it("It should mint 1337 tokens", async function () {
    await tokenInstance.mint('0x00', '0x01', 1337);
 
    const balance = await tokenInstance.balanceOf(OWNER);
    assert.equal(balance.valueOf(), 1337, "Balance should be 1337");

    const actual = await tokenInstance.totalSupply();
    assert.equal(actual.valueOf(), 1337, "Total supply should be 1337");
  });

  it("It should not allow fee increase within 30 days", async () => {
    try {
      await tokenInstance.increaseFee();
    }
    catch(error) {
      assert(error);
      assert.equal(error.reason, "Cannot update fee within 30 days of last change", `Incorrect revert reason: ${error.reason}`);
    }
  });

  it("It should increase fee by 0.1%", async () => {
    const newBlock = await helper.advanceTime(31 * 24 * 60 * 60);

    const fee = await tokenInstance.fee();
    await tokenInstance.increaseFee();

    const actual = await tokenInstance.fee();
    const lastUpdated = await tokenInstance.lastUpdated();

    assert.isTrue(actual > fee, "Fee did not increase");
    assert.equal(220, actual, "Incorrect fee set");
    assert.isTrue(lastUpdated > 0, "Last updated not set");
  });

  it("It should not allow a negative fee", async () => {
    try {
      await tokenInstance.decreaseFee(-10);
    }
    catch(error) {
      assert(error);
      assert.equal(error.reason, "Fee must not less than current", `Incorrect revert reason: ${error.reason}`);
    }
  });

  it("It should decrease fee", async () => {
    await tokenInstance.decreaseFee(5);
    const actual = await tokenInstance.fee();
    const lastUpdated = await tokenInstance.lastUpdated();

    assert.equal(5, actual, "Incorrect fee set");
    assert.isTrue(lastUpdated > 0, "Last updated not set");
  });

  describe("With 10 grams (100,000 tokens) minted balance", () => {

    beforeEach(async () => await tokenInstance.mint('0x00', '0x01', 100000));

    it("It should transfer 1 gram (10000 tokens) from owner to bob (no fees)", async () => {
      await tokenInstance.transfer(BOB, 10000);
      var actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 90000, "Owner balance should be 9 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 10000, "Bob balance should be 1 gram");
    });

    it("It should transfer 10 grams (100,000 tokens) from bob to alice with fee", async () => {
      await tokenInstance.transfer(BOB, 20000);
      
      var actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 80000, "Owner balance should be 8 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 20000, "Bob balance should be 2 grams");

      await tokenInstance.transfer(ALICE, 10000, { from: BOB });

      actual = await tokenInstance.balanceOf(ALICE);
      assert.equal(Number(actual), 9980, "Balance should be 9980 tokens");

      actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 80020, "Balance should be 80020");
    });

    it("Owner should allow alice to transfer 100 tokens to bob from owner", async function () {
      await tokenInstance.approve(ALICE, 100);

      //account 0 (owner) now transfers from alice to bob
      await tokenInstance.transferFrom(OWNER, BOB, 100, {from: ALICE});
      var actual = await tokenInstance.balanceOf(BOB);
      assert.equal(actual.valueOf(), 100, "Balance should be 100");
    });

    it("It should not allow transfer to zero address", async () => {
      try {
        await tokenInstance.transfer(0, 10);
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "Invalid address", `Incorrect revert reason: ${error.reason}`);
      }
    });

    it("It should not allow sending by user with insuffient funds", async () => {
      await tokenInstance.transfer(BOB, 500);
      try {
        await tokenInstance.transfer(ALICE, 600, { from: BOB });
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "Insufficient funds", `Incorrect revert reason: ${error.reason}`);
      }
    });
  });
});