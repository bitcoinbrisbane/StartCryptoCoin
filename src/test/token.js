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

  describe("Interest tests", () => {
    it("Should not have any interest", async function () {
      const start = await tokenInstance._start();
      console.log(Number(start));

      const actual = await tokenInstance.calc(100, start);
      console.log(Number(actual));

      assert.equal(actual.valueOf(), 100, "Should still be 100");
    });
  });

  describe("ERC20 tests", () => {
    it("Should test ERC20 public properties", async function () {
      const name = await tokenInstance.name();
      assert.equal(name, "StartCryptoCoin", "Name should be StartCryptoCoin");

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "SCC", "Symbol should be SCC");
    });

    it("Total supply should be 1000000000", async function () {
      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 1000000000, "Total supply should be 0");
    });

    it("Owner balance should be 1000000000", async function () {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 1000000000, "Balance should be 1000000000");
    });
    
    it.only("Owner balance should be greater than 1000000000", async function () {
      await advanceTime(10000);

      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 1000000000, "Balance should be 1000000000");
    });
  });
});