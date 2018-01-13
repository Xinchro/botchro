# Botchro


## Developing
This assumes you've got [Nodemon](https://github.com/remy/nodemon/) installed globally (for development).  
You'll also need:
  - a token of your own, which you'll need to add to a `.env` file as: `TOKEN = yourtoken`.
  - a client id of your own, this is found in `my apps` -> `app details` on [Discord's app page](https://discordapp.com/developers/applications/me), add to `.env` as: `BOTCLIENT = <@yourclientid>`
  - a name of your own, add to `.env` as `BOTNAME = yourbotnamehere`

### Example .env file
```
TOKEN = aBCDe12345-54321.eDcBa
BOTCLIENT = <@1234567890987654321>
BOTNAME = Botchro
```

Just run `npm start` to start the bot. It will restart on file changes to update with your changes.
