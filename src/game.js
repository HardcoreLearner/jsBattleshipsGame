/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

const ships = (name, length) => {
  const ship = {};
  ship.length = length;
  ship.hit = 0;
  ship.name = name;
  ship.sunken = false;
  // eslint-disable-next-line no-return-assign
  const hitShip = () => ship.hit += 1;
  const isSunken = () => {
    if (ship.hit === ship.length) {
      ship.sunken = true;
    }
  };
  return { ship, isSunken, hitShip };
};

const gameboard = () => {
  const board = {};
  const coor = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      coor.push([i, j]);
    }
  }
  board.map = coor;
  board.missed = [];
  board.allSunken = false;
  board.ships = [];
  const placeShip = (ship, coordinate) => {
    board.ships.push(ship);
    let place = coordinate - 1;
    for (let index = 0; index < ship.ship.length; index++) {
      board.map[place] = ship.ship.name;
      place += 10;
    }
  };
  const receiveAttack = (coordinate) => {
    if (typeof board.map[coordinate - 1] === 'string') {
      let hittenShip = board.ships.filter((ship) => ship.ship.name === board.map[coordinate - 1]);
      hittenShip = hittenShip[0];
      hittenShip.hitShip();
    } else { board.missed.push(coordinate); }
  };
  const areShipsSunken = () => {
    const allShips = board.ships;
    for (let index = 0; index < allShips.length; index++) {
      const ship = allShips[index];
      ship.isSunken();
      if (!ship.ship.sunken) {
        return false;
      }
    } return true;
  };
  return {
    board, placeShip, receiveAttack, areShipsSunken,
  };
};

const player = (name) => {
  const playerData = {};
  playerData.name = name;
  playerData.attacks = [];

  const attackEnemy = (ennemyBoard, coordinate = 'random') => {
    if (coordinate === 'random') {
      let randomNumber = Math.floor((Math.random() * 100) + 1);
      while (playerData.attacks.includes(randomNumber)) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
      }
      ennemyBoard.receiveAttack(randomNumber);
      playerData.attacks.push(randomNumber);
    } else {
      if (playerData.attacks.includes(coordinate)) {
        return 'Already played';
      }
      ennemyBoard.receiveAttack(coordinate);
      playerData.attacks.push(coordinate);
    }
  };
  return { attackEnemy, playerData };
};

export { ships, player, gameboard };
