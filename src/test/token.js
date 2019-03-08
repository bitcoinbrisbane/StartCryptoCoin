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
    it.skip("Should get delta", async function () {
      //const start = await tokenInstance._start();
      //console.log(Number(start));

      //await helper.advanceTime(10000);

      const actual = await tokenInstance.delta(10000);
      console.log(Number(actual));
      console.log(actual);

      assert.equal(actual, 10000, "Delta should be 10000");
    });

    it.only("Should get delta", async function () {
      //const start = await tokenInstance._start();
      //console.log(Number(start));

      //await helper.advanceTime(10000);

      const actual = await tokenInstance.delta(10000, 20000);
      console.log(Number(actual));
      console.log(actual);

      assert.equal(actual, 10000, "Delta should be 10000");
    });

    it("Should calc 0 interest", async function () {
      const start = await tokenInstance._start();
      console.log(Number(start));

      const actual = await tokenInstance.calc(100, 0);
      console.log(Number(actual));

      assert.equal(actual.valueOf(), 0, "Should be 0");
    });

    it.only("Should calc balance x", async function () {
      const actual = await tokenInstance.calc(10000, 365);
      console.log(Number(actual));

      assert.equal(Number(actual), 1200, "Should be 1200");
    });

    it("Should calc balance", async function () {
      await tokenInstance.transfer(BOB, 10000000);

      await helper.advanceTime(30 * 24 * 60 * 60);

      const actual = await tokenInstance.balanceOf(BOB);
      console.log(Number(actual));

      assert.equal(Number(actual), 4800000000, "Should be 4800000000");
    });

    it("Should calc rate 2", async function () {
      // await tokenInstance.transfer(BOB, 100000000000000);
      // let actual = await tokenInstance.balanceOf(OWNER);

      // actual = await tokenInstance.balanceOf(BOB);
      // assert.equal(Number(actual), 100000000000000, "Bob balance should be 10,000 tokens");

      //await helper.advanceTime(1);

      //1000 tokens
      const amount = 10000000;

      actual = await tokenInstance.calc(amount, 30);
      console.log(Number(actual));

      //1300 tokens
      assert.equal(Number(actual), 4800000000, "Should be 1120 tokens");
    });

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

    it("Total supply should be 10000000000000", async function () {
      const actual = await tokenInstance.totalSupply();
      assert.equal(Number(actual), Number(10000000000000), "Total supply should be 10000000000000");
    });

    it("Owner balance should be 10000000000000", async function () {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 10000000000000, "Balance should be 10000000000000");
    });
    
    it.skip("Owner balance should be greater than 10000000000000", async function () {
      const actual = await tokenInstance.delta();
      assert.equal(actual.valueOf(), 10000000000000, "Balance should be greater than 10000000000000");
    });
  });
});