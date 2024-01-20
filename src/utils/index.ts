export const checkIfSeatEmpty = (array, x, y) => {
  return array[x][y] === 0;
};

type Point = {
  x: number;
  y: number;
};

export const addOneToFurthestAxis = (centralPoint, positionChecked): Point => {
  return Math.abs(centralPoint.x - positionChecked.position.x) >
    Math.abs(centralPoint.y - positionChecked.position.y)
    ? { x: centralPoint.x > positionChecked.position.x ? 1 : -1, y: 0 }
    : { x: 0, y: centralPoint.y > positionChecked.position.y ? 1 : -1 };
};

export const checkIfSeatOnCentral = (centralPoint, positionChecked) => {
  return (
    positionChecked.position.x === centralPoint.x &&
    positionChecked.position.y === centralPoint.y
  );
};
