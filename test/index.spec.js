const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const path = require('path')
const botchro = require('../index.js')

const assert = chai.assert
chai.use(chaiAsPromised);

describe('Botchro', () => {
  describe('! commands', () => {
    describe('uptime', () => {
      it('should be a promise, via function', () => {
        assert.typeOf(botchro.checkCommand("uptime"), 'promise')
      })
      it('should return a 0s uptime, via command', () => {
        // assert.eventually.have.property(botchro.checkCommand("uptime"), 'content')
        // assert.to.eventually.equal(botchro.checkCommand("uptime"), '0d0h0m0s')
      })
      it('should return a 0s uptime', () => {
        assert.equal(botchro.getUptime(), '0d0h0m0s')
      })
    })
  })
  describe('logging', () =>{
    it('return nothing if trying to log a null error', () => {
      assert.equal(botchro.logError(null), null)
    })
  })
})
