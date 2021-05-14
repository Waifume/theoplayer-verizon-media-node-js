# License
This projects falls under the license as defined in https://github.com/THEOplayer/license-and-disclaimer.

# verizon-media-node-js

`verizon-media-node-js` connects a Node.js back-end with THEOplayer front-end.

* The Node.js back-end generates a Verizon Media compliant token for a specific asset with a specific set of query parameters.
* The THEOplayer front-end communicates with the Node.js back-end, sets up THEOplayer using the [THEOplayer Verizon Media API](https://docs.theoplayer.com/how-to-guides/07-miscellaneous/02-verizon-media/01-preplay.md).

This project was born out of the need to have a reference back-end which generates Preplay parameters,
including a [Verizon Media token](https://docs.vdms.com/video/index.html#Tutorials/Signed-Playback-URL-Tutorial.htm?Highlight=token).

The current flow of this project is:

1. `public/index.html` is a front-end integration of the THEOplayer Web SDK.
2. This `public/index.html` can do a POST call to `/asset`.
3. A (valid) call to `/asset` returns the Preplay parameters, including the token.
4. `public/index.html` takes the response from `/asset` and uses it to configure a valid stream configuration.
5. `public/index.html` allows you to play the configured stream, or just preview the stream configuration. 

# Installation

You can run this project if you have `npm` and `node` on your machine.
This project has been tested on the following machines:
* macOS with `npm v7.0.14` and `node v10.15.0`.
* Windows with `npm v6.14.10` and `node v14.15.4`.

To install this project:

1. Run `npm install` in your terminal to install the dependencies.
2. Add your Verizon Media `secret` to `config.json`. You can find this value as the API key in your Verizon Media dashboard at https://cms.uplynk.com/static/cms2/index.html#/settings/integration-keys.
3. Run `node server.js` in your terminal to start the local web server.
4. Replace the configured THEOplayer SDK with your own THEOplayer SDK.

The tutorial at [https://youtu.be/AkkJr1ZszJc](https://youtu.be/AkkJr1ZszJc) talks you through the first three steps.

# Usage

Once the installation is complete, and your local web server is running,
go to http://localhost:3000/index.html and test your stream:

1. Enter the asset ID
2. Check DRM if the asset requires DRM
3. Select the type of asset
4. Configure (optional) additional settings
5. Hit the "Generate"-button