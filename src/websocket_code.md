# WebSocket code

I'm moving this into a markdown file for now so I have a reference to how the implementation was working:

```typescript

// import HubClient from '@anephenix/hub/lib/client';

// Create an instance of HubClient


// WebSocket connection to the server
// const hubClient = new HubClient({ url: 'ws://localhost:4000' });
// const channel = 'game';

// This is a workaround to wait for the connection to be established
// Otherwise, when trying to subscribe, it throws an error
// setTimeout(() => {
//   hubClient.subscribe(channel, (message) => {
//     console.log('Received message:', message);
//   });
// }, 1000);

// const gameUpdates = (message) => {
//   const { playerId, action } = message;
//   eventEmitter.emit('playerAction', { playerId, action });
//   console.log({ message });
// };
// hubClient.addChannelMessageHandler(channel, gameUpdates);

// (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'moveForward' }))();
```

This code was in the App.svelte file, and it worked nicely.

Only thing was that because of clients receiving events at slightly different times, the physics calculations 
would end up with clients seeing slightly different versions of physical state in the game, so therefore the
physics calculations would have to be done server-side and then relayed client-side in order to reduce the 
amount of deviation that occurs in the game. 

