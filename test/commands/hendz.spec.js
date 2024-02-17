const chai = require('chai')
const { use, expect, assert } = require('chai')
const fs = require('fs')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const path = require('path')

const utils = require('../../utils/index.js')

let originalEnv = process.env

let hendz

use(sinonChai)

describe('Commands - hendz', () => {
  let writeFileStub
  let readFileStub
  let getCharacterStub = sinon.stub(utils, 'getUserCharacterConfig')

  beforeEach(() => {
    writeFileStub = sinon.stub(fs, 'writeFile')
    readFileStub = sinon.stub(fs, 'readFile')
    
    writeFileStub.callsFake((path, data, cb) => {
      cb(null)
    })

    readFileStub.callsFake((path, cb) => {
      cb(null, JSON.stringify([]))
    })

    getCharacterStub.resolves('hi?')

    originalEnv = process.env

    hendz = require('../../commands/hendz.js')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should create', () => {
    expect(hendz).to.exist
  })

  describe('hendzHandler', () => {
    describe('show', () => {
      it('should handle the first show', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'show'
          },
          user: {
            id: '123'
          }
        }

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('You\'ve hendz\'d')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify(['123']))
      })
      
      it('should handle subsequent shows', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'show'
          },
          user: {
            id: '123'
          }
        }

        readFileStub.callsFake((path, cb) => {
          cb(null, JSON.stringify(['abc']))
        })

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('You\'ve hendz\'d')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify(['abc', '123']))
      })
      
      it('should handle the same person showing', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'show'
          },
          user: {
            id: '123'
          }
        }

        readFileStub.callsFake((path, cb) => {
          cb(null, JSON.stringify(['123']))
        })

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('You\'ve hendz\'d')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify(['123']))
      })
    })

    describe('hide', () => {
      it('should handle the hide interaction', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'hide'
          },
          user: {
            id: '123',
          }
        }

        readFileStub.callsFake((path, cb) => {
          cb(null, JSON.stringify(['123']))
        })

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('You\'ve unhendz\'d')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify([]))
      })

      it('should hide only the specified user', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'hide'
          },
          user: {
            id: '123',
          }
        }

        readFileStub.callsFake((path, cb) => {
          cb(null, JSON.stringify(['!"£', '123', 'abc']))
        })

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('You\'ve unhendz\'d')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify(['!"£', 'abc']))
      })
    })

    describe('peek', () => {
      it('should handle the peek interaction', async () => {
        it('should handle no users', async () => {
          const interaction = {
            options: {
              getSubcommand: () => 'peek'
            }
          }

          const result = await hendz.hendzHandler(interaction)

          expect(result.content).to.contain('No-one. Very sad. :(')
        })

        it('should handle many users', async () => {
          readFileStub.callsFake((path, cb) => {
            console.log('readFileStub called')
            cb(null, JSON.stringify(['123']))
          })

          const interaction = {
            options: {
              getSubcommand: () => 'peek'
            }
          }

          const result = await hendz.hendzHandler(interaction)

          expect(result.content).to.contain('People who have hendz\'d: 123')
        })
      })
    })

    describe('reset', () => {
      it('should handle the reset interaction when empty', async () => {
        const interaction = {
          options: {
            getSubcommand: () => 'reset'
          }
        }

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('Hendz have been reset')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify([]))
      })

      it('should handle the reset interaction when populated', async () => {
        readFileStub.callsFake((path, cb) => {
          cb(null, JSON.stringify(['123']))
        })

        const interaction = {
          options: {
            getSubcommand: () => 'reset'
          }
        }

        const result = await hendz.hendzHandler(interaction)

        expect(result.content).to.equal('Hendz have been reset')
        expect(writeFileStub).to.have.been.calledWith(path.resolve(__dirname, '../../assets/data/hendz.json'), JSON.stringify([]))
      })
    })
  })
})