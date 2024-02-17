const chai = require('chai')
const { use, expect, assert } = require('chai')
const sinon = require("sinon")
const sinonChai = require("sinon-chai")
const path = require('path')
const { ActivityType } = require('discord.js')
const http = require('http')
const { client } = require('../client.js')

const botchro = require('../index.js')

use(sinonChai)

describe('Botchro index', () => {
  let clientStub

  let loadCommandsStub
  let hostFilesStub
  let requireMock

  it('should create', () => {
    expect(botchro).to.exist
  })

  beforeEach(() => {
    sinon.stub(client, 'on').callsFake(() => {})
    sinon.stub(client, 'login').callsFake(() => {})

    requireMock = sinon.mock(path, 'require')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('startClient', () => {
    beforeEach(() => {
      loadCommandsStub = sinon.stub(botchro, 'loadCommands').callsFake(() => {})
      hostFilesStub = sinon.stub(botchro, 'hostFiles').callsFake(() => {})
    })

    it('should be a function', () => {
      expect(botchro.startClient).to.be.a('function')
    })

    it('should load commands', () => {
      botchro.startClient()
      expect(loadCommandsStub).to.have.been.called
    })

    it('should host files', () => {
      botchro.startClient()
      expect(hostFilesStub).to.have.been.called
    })

    it('should set an activity', () => {
      sinon.restore()
      sinon.stub(client, 'login').callsFake(() => {})
      loadCommandsStub = sinon.stub(botchro, 'loadCommands').callsFake(() => {})

      clientStub = sinon.stub()
      sinon.stub(client, 'user').get(() => {return{
        tag: '',
        setActivity: clientStub
      }})
      sinon.stub(client, 'on').callsFake((arg1, arg2) => {
        arg2()
      })

      botchro.startClient()

      expect(clientStub).to.have.been.calledWith(sinon.match.string, { type: ActivityType.Watching });
    })

    it('should login', () => {
      botchro.startClient()
      expect(client.login).to.have.been.called
    })
  })

  describe('hostFiles', () => {
    it('should be a function', () => {
      expect(botchro.hostFiles).to.be.a('function')
    })

    it('should create a server', () => {
      const createServerStub = sinon.stub(http, 'createServer').callsFake(() => {
        return {
          listen: () => {}
        }
      })
      botchro.hostFiles()
      expect(createServerStub).to.have.been.called
    })
  })
})
