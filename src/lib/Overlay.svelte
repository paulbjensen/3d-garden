<script lang="ts">
import type { Body } from "./types";
const {
	playerWhoWon,
	onClick,
}: { playerWhoWon: Body | null; onClick: () => void } = $props();
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

  #game-over {
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
    <div id="game-over">
        <h1>Game Over</h1>
        {#if playerWhoWon !== null}
            <p>{playerWhoWon.name} won!</p>
        {/if}
        <button class="restart-game" onclick={onClick}>Play again</button>
    </div>
</div>