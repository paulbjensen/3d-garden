<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { World } from '@threlte/rapier'
  import type { Body } from './lib/types';
  import { getRandomRotation } from './lib/helpers';
	import { Vector3 } from 'three';
  import eventEmitter from './lib/eventEmitter';
  import { onMount, onDestroy } from 'svelte';
  // import HubClient from '@anephenix/hub/lib/client';

  // Create an instance of HubClient
  let players: Body[] = $state([]);

  let gameStatus = $state('active');
  let playerWhoWon = $state(null);

  const startingPositions = [
    new Vector3(-1, 4, 1),
    new Vector3(0, 4, 2),
    new Vector3(1, 4, 3),
    new Vector3(2, 4, 4)
  ];

  players.push({
    id: 'xx1',
    name: 'Player 1',
    mounted: Date.now(),
    position: startingPositions[0],
    rotation: getRandomRotation(),
    color: 'yellow',
    status: 'active',
    isBot: false
  },
  {
    id: 'xx2',
    name: 'Bot 1',
    mounted: Date.now(),
    position: startingPositions[1],
    rotation: getRandomRotation(),
    color: 'green',
    status: 'active',
    isBot: true
  },
  {
    id: 'xx3',
    name: 'Bot 2',
    mounted: Date.now(),
    position: startingPositions[2],
    rotation: getRandomRotation(),
    color: 'blue',
    status: 'active',
    isBot: true
  },
  {
    id: 'xx4',
    name: 'Bot 3',
    mounted: Date.now(),
    position: startingPositions[3],
    rotation: getRandomRotation(),
    color: 'red',
    status: 'active',
    isBot: true
  });

  function checkIfGameOver() {
    const remainingPlayers = players.filter(player => player.status === 'active');
    if (remainingPlayers.length === 1) {
      eventEmitter.emit('gameOver', { winner: remainingPlayers[0] });
    }

    // Check if it was the player that fells off
    const onlyBots = remainingPlayers.every(player => player.isBot);
    if (onlyBots) {
      eventEmitter.emit('gameOver', { winner: null });
    }
  }

  eventEmitter.on('gameOver', ({ winner }) => {
    playerWhoWon = winner;
    gameStatus = 'gameOver';
  });

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

  function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                // (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'moveForward' }))();
                eventEmitter.emit('playerAction', { playerId: players[0].id, action: 'moveForward' });
                break;
            case 'ArrowDown':
                // (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'moveBackward' }))();
                eventEmitter.emit('playerAction', { playerId: players[0].id, action: 'moveBackward' });
                break;
            case 'ArrowLeft':
                // (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'moveLeft' }))();
                eventEmitter.emit('playerAction', { playerId: players[0].id, action: 'moveLeft' });
                break;
            case 'ArrowRight':
                // (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'moveRight' }))();
                eventEmitter.emit('playerAction', { playerId: players[0].id, action: 'moveRight' });
                break;
            case ' ':
                // (async () => await hubClient.publish(channel, {playerId: players[0].id, action: 'jump' }))();
                eventEmitter.emit('playerAction', { playerId: players[0].id, action: 'jump' });
                break;          
        }
  }

  eventEmitter.on('ballFellOff', ({id}) => {
    players.find(player => player.id === id).status = 'fallen';
    checkIfGameOver();
  })

  function restartGame() {
    players.forEach((player, i) => {
      player.status = 'active';
    });
    gameStatus = 'active';
    playerWhoWon = null;
    eventEmitter.emit('gameRestart');
  }

  onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });
  onDestroy(() => {
      window.removeEventListener('keydown', handleKeyDown);
  });


</script>

<style>
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }

  #scores {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .score {
    width: 200px;
    border: solid 2px white;
    border-radius: 2px;
    padding: 4px;
  }

  .player-name {
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
    opacity: 0.95;
  }

  #overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  #game-over {
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px 40px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  #controls {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    line-height: 4px;
    font-size: 10pt;
  }

</style>

<main>
  <Canvas>
    <World framerate={60} gravity={[0, -9.81, 0]}>
      <Scene {players} />
    </World>
  </Canvas>
  <div id="scores">
    {#each players as player (player.id)}
      <div class="score" style:background-color={player.color} style:opacity={player.status === 'active' ? 1 : 0.1}>
        <span class="player-name" style:color={player.color}>{player.name}</span>
      </div>
    {/each}
  </div>
  <div id="controls">
    <p>You are the yellow ball. Force the other balls off the table.</p>
    <p>Use the arrow keys to control the player</p>
    <p>Press space to jump</p>
  </div>


  {#if gameStatus === 'gameOver' && playerWhoWon !== null}
    <div id="overlay">
      <div id="game-over">
        <h1>Game Over</h1>
        <p>{playerWhoWon.name} won!</p>
        <button onclick={restartGame}>Play again</button>
      </div>
    </div>
  {/if}
  {#if gameStatus === 'gameOver' && playerWhoWon === null}
    <div id="overlay">
      <div id="game-over">
        <h1>Game Over</h1>
        <button onclick={restartGame}>Play again</button>
      </div>
    </div>
  {/if}

</main>

