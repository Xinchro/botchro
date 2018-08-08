const chai = require('chai')
const path = require('path')
const botchro = require('../index.js')

const assert = chai.assert

describe('Botchro', () => {
  describe('! commands', () => {
    describe('uptime', () => {
      it('should be a promise', () => {
        assert.typeOf(botchro.checkCommand("uptime"), 'promise')
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
