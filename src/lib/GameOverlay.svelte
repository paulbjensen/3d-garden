<script lang="ts">
import eventEmitter from "./eventEmitter";
const { onClick, gameSettings } = $props();

function updateNumberOfPlayers(event: Event) {
	const input = event.target as HTMLInputElement;
	const newNumberOfPlayers = Number.parseInt(input.value, 10);
	eventEmitter.emit("updateGameSettings", {
		numberOfPlayers: newNumberOfPlayers,
	});
}
</script>

<style>
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

  #new-game-modal {
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px 40px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .restart-game {
	background-color: orange;
	color: white;
	border-radius: 4px;
	padding: 10px 20px;
	font-size: 16px;
	font-weight: bold;
	border-radius: 5px;
	cursor: pointer;
	border: none;
  }    
</style>

<div id="overlay">
    <div id="new-game-modal">
        <h1>New game</h1>
        <form>
            <label>
                Number of players: 
                <input type="number" onchange={updateNumberOfPlayers} min="2" max="10" bind:value={gameSettings.numberOfPlayers}/>
            </label>
        </form>
        <button class="restart-game" onclick={onClick}>Play</button>
    </div>
</div>