# Fit for Live

A really simple little ANT+ heart-rate monitoring server intended for use with OSC.

A previous version of this exposes a web interface to be used in OBS, see this by switching branches to `websocket-interface`!

## Requirements

- ANT+ Chip - v2 or v3. v3 is the smaller USB stick with the curved end.

## First-time setup

1. Plug your ANT+ USB into your PC.
2. Download and run [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/).
3. Options -> List All Devices
4. Select your ANT+ device.
5. Using the up/down arrows, choose the `WinUSB` driver and click install.
6. Open `config.json` and adjust your settings.
7. Double click `FitForLive.exe` to start broadcasting data!

## Learn more about OSC

I use a tool called [Protokol](https://hexler.net/products/protokol) to see the messages that this tool outputs.

[Here's the OSC website](http://opensoundcontrol.org/), a useful resource for any developer looking to play around with easy, quick data transmission that's time sensitive.
