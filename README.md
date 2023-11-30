# Skara Player 

A customizable, flexible video player for the modern web


## Installation 

```
npm install @skara-live/skara-player
```


## Usage 

### Usage in Javscript application

```js
import SkaraPlayer from "@skara-live/skara-player"
import "@skara-live/skara-player/dist/index.css"
const cfg = {
  src: "http://amssamples.streaming.mediaservices.windows.net/634cd01c-6822-4630-8444-8dd6279f94c6/CaminandesLlamaDrama4K.ism/manifest(format=m3u8-aapl)",
  theme: {
     colors: {
       primary: "#fc0000",
       secondary: "#ffffff",
     },
     spacing: {
       margin: "4px",
       padding: "20px"
     }
   }
}
const player = new SkaraPlayer("player", cfg)
player.start();

player.on('metadataloaded', () => {
  console.log("loaded metadata")
})

```

### Usage in react.js or next.js application

```js
import SkaraPlayer, { PlayerConfig } from "@skara-live/skara-player";
import React from "react";

class Player extends React.Component {
  private player: SkaraPlayer | null;
  constructor(public props: PlayerConfig) {
    super(props);
    this.player = null;
  }

  componentDidMount() {
    this.player = new SkaraPlayer("player", this.props);
    this.player.start();
    window.dispatchEvent(new Event("load", { bubbles: true }))
  }

  componentWillUnmount() {
    this.player && this.player.dispose();
  }

  render(): React.ReactNode {
    return (
      <div id="player" style={{ width: "100%", height: "100%" }}></div>
    )
  }
}

export default Player;

```