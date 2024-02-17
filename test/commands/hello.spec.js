const chai = require('chai')
const { use, expect, assert } = require('chai')
const chaiAsPromised = require("chai-as-promised")
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const path = require('path')

const utils = require('../../utils/index.js')

let originalEnv = process.env

let hello

use(sinonChai)

describe('Commands - hello', () => {
  const getLastCommitMessageStub = sinon.stub(utils, 'getLastCommitMessage')
  const getLastCommitTimeStub = sinon.stub(utils, 'getLastCommitTime')

  beforeEach(() => {
    originalEnv = process.env

    process.env.BOTNAME = 'botname'

    getLastCommitTimeStub.returns('2021/10/10 10:10:10')
    getLastCommitMessageStub.returns('commit message')

    hello = require('../../commands/hello.js')
  })

  afterEach(() => {
    process.env = originalEnv
    sinon.restore()
  })

  it('should create', () => {
    expect(hello.hello).to.exist
  })

  it('should return an object', () => {
    expect(hello.hello()).to.be.an('object')
  })

  it('should have the name of the bot', () => {
    expect(hello.hello().author.name).to.equal('botname')
  })

  it('should have a title', () => {
    expect(hello.hello().title).to.be.a.string
  })

  it('should have the last commit time and message', () => {
    expect(hello.hello().fields[2].value).to.contain('2021/10/10 10:10:10').and.contain('commit message')
  })

  it('should be powered by salt', () => {
    expect(hello.hello().footer.text).to.equal('Powered by salt.')
  })
})