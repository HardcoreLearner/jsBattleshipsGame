/* eslint-disable no-trailing-spaces */
/* eslint-disable no-alert */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import './style.css';
import { ships, gameboard, player } from './game';

const uiGame = () => {
  // le fait de changer les tours sur l'interface
  const domTurnModify = (playerTurn, turn) => {
    playerTurn.textContent = turn;
  };

  const newGame = () => {
    const newGameBtn = document.querySelector("button");
    newGameBtn.addEventListener("click", () => { window.location.reload(); });
  };

  const positionToAttack = () => new Promise((resolve) => {
      const aiGrid = document.querySelectorAll('#aiTable div:not(.attacked):not(.success)');
      aiGrid.forEach((elem) => {
        elem.addEventListener('click', function handleClick() {
          // Le gestionnaire d'événements est appelé, on le supprime et on résout la promesse.
          this.classList.add("attacked");
          aiGrid.forEach((elem) => elem.removeEventListener('click', handleClick));
          resolve(elem); // Résoud la promesse avec l'élément cliqué (elem).
        });
      });
    });
  // le fait en fin de partie d'afficher le gagnant et de proposer de rejouer via un bouton
  // sans oublier les eventlisteners
  return { newGame, domTurnModify, positionToAttack };
};

const gameloop = async () => {
  // create a new game by creating players and  gameboards
  // populate the gameboard with predetermined coordinates
  let winner = '';
  let turn = 1;

  const playerTable = document.querySelector('#playerTable');
  const aiTable = document.querySelector('#aiTable');
  const playerGrid = document.querySelectorAll('#playerTable div');
  const aiGrid = document.querySelectorAll('#aiTable div');
  console.log(aiGrid);

  const turnUI = document.getElementById('turn');

  const player1 = player('Player 1');
  const player1Board = gameboard();

  const carrier1 = ships('Carrier', 5);
  const battleship1 = ships('Battleship', 4);
  const cruiser1 = ships('Cruiser', 3);
  const submarine1 = ships('Submarine', 3);
  const destroyer1 = ships('Destroyer', 2);

  player1Board.placeShip(carrier1, 1);
  player1Board.placeShip(battleship1, 3);
  player1Board.placeShip(cruiser1, 9);
  player1Board.placeShip(submarine1, 34);
  player1Board.placeShip(destroyer1, 68);

  const ai = player('AI');
  const aiBoard = gameboard();

  const carrier2 = ships('Carrier', 5);
  const battleship2 = ships('Battleship', 4);
  const cruiser2 = ships('Cruiser', 3);
  const submarine2 = ships('Submarine', 3);
  const destroyer2 = ships('Destroyer', 2);

  aiBoard.placeShip(carrier2, 2);
  aiBoard.placeShip(battleship2, 3);
  aiBoard.placeShip(cruiser2, 9);
  aiBoard.placeShip(submarine2, 34);
  aiBoard.placeShip(destroyer2, 82);

  const gameInterface = uiGame();
  gameInterface.newGame();

  while (!aiBoard.areShipsSunken() && !player1Board.areShipsSunken()) {
    gameInterface.domTurnModify(turnUI, turn);
    
    const playerFirstMisses = aiBoard.board.missed.length;
    console.log(playerFirstMisses);

    const clickedElement = await gameInterface.positionToAttack();

    const index = Array.prototype.indexOf.call(aiGrid, clickedElement);
    player1.attackEnemy(aiBoard, index);

    const playerSecondMisses = aiBoard.board.missed.length;

    if (playerFirstMisses === playerSecondMisses) {
      clickedElement.classList.remove("attacked");
      clickedElement.classList.add("success");
    }

    const AiFirstMisses = player1Board.board.missed.length;

    ai.attackEnemy(player1Board);
    
    const aiIndex = ai.playerData.attacks[ai.playerData.attacks.length - 1];
    const aiTarget = document.querySelector(`#playerTable :nth-child(${aiIndex})`);
    aiTarget.classList.add("attacked");
    const AiSecondMisses = player1Board.board.missed.length;
    if (AiFirstMisses === AiSecondMisses) {
      aiTarget.classList.remove("attacked");
      aiTarget.classList.add("success");
    }
    turn++;
  }

  if (aiBoard.areShipsSunken()) {
    winner = player1.playerData.name;
  } else {
    winner = ai.playerData.name;
  }

  alert(`${winner} has won the game !!!`);
};

gameloop();
