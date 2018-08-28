# Fit for Live

A really simple little ANT+ heart-rate monitoring server intended for use in tools like OBS.

## Requirements

- ANT+ Chip - v2 or v3. v3 is the smaller USB stick with the curved end.

## First-time setup

1. Plug your ANT+ USB into your PC.
2. Download and run [Zadig](http://sourceforge.net/projects/libwdi/files/zadig/).
3. Options -> List All Devices
4. Select your ANT+ device.
5. Using the up/down arrows, choose the `WinUSB` driver and click install.
6. Open `config.json` and adjust your settings.
7. Double click `FitForLive.exe` to start!
8. Use the address provided in the console to see what monitors are available.

## Developing your own monitor

The entire `www` folder is served as static content to express, so any css, javascript, images, html are able to be easily handled.

**See `www/basic.html` for a minimal implementation example**