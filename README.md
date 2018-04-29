# Sinfonia

![Logo](https://github.com/ghtyrant/sinfonia/raw/master/build/icons/256x256.png "Sinfonia Logo")

> Interactive ambient sound scene designer

![Main Interface](https://github.com/ghtyrant/sinfonia/raw/master/screenshots/sinfonia.png "Sinfonia Logo")

**This software is still highly experimental!** It will not warn you when closing with unsaved changes, you will have to upload everytime you change something. You can't use Ctrl-S to save, you will have to overwrite your file every time you need to save. You have been warned!

#### Usage
Make sure you set `Sound Library` in settings to an existing path that contains your sound samples before your start.

##### Add a new sound
Clicking "Add Sound" will add a new empty sound to the category "General". Edit its settings by clicking on the cogs icon. Here you set a name, a category and select an audio file. To upload your changes, click "Upload".

**Currently, all changes to sounds and their functions need to be uploaded to the server manually by clicking "Upload"!**

Click the Play button in the lower left to start. You should here your sound playing once.

A sound has three different types of functions: *Start*, *Update* and *Finish*. *Start* will be applied before the sound starts playing, *Update* will be applied continuously while the sound is playing and finally, *Finish* will be applied once a sound has finished.

Example: Click the "+" to add a new function to Start. Select "Volume". Then click on the newly appeared, green "Volume" function. In the dialog, you can edit the volume of the sound sample. You can either set an exact value or click on "Randomize" and define a range.
Upload and you should be able to hear the difference already.

##### Trigger
By enabling "Needs trigger" on a sound, you will be able to trigger playback of a sample by the click of a button. All functions will still apply, so if you added a "Delay" function, playback of the sample will be delayed after triggering it.
Switch to the "Trigger" section in the app to see a list of triggerable sounds.

You can also trigger sounds via HTTP/REST. Simply POST to `http://localhost:9090/trigger` with the following JSON content:
```
{ "name": "Name of the sound to trigger" }
```

This allows you to integrate Sinfonia into other applications.

#### Running an external server
One strength of Sinfonia is that front- and backend can be run independently. This allows you to run the server on a machine connected to your HiFi system, while controlling it using a different computer on your network.

To do this, switch to Settings and disable the built-in server. Start the `sinfonia_server` binary on the machine you want to do the actual audio playback (e.g. `sinfonia_server -h 0.0.0.0:9090 -s /path/to/your/sound/samples -a SomeAccessToken`)
Set up the server address (`http://address:9090/`) and the access token (`SomeAccessToken`) and click "Test & Save". Once set up, you are ready to go.

#### Building
Before building, copy sinfonia_server binary to `dist/backend/<os>`. (e.g., copy `sinfonia_server.exe` to `dist/backend/sinfonia_server.exe` on Windows).

``` bash
# install dependencies
npm install

# build electron application for production
npm run build
```
