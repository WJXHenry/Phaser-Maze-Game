import Maze from './maze';

// TODO: for each vertex, should have at least one edge (use the get edges)
test('constructor', () => {
  expect.assertions(2);
  let maze = new Maze(3);
  let vertices = maze.getVertices();
  expect(vertices.size).toEqual(9);
  expect(vertices).toEqual(
    new Set(['0,0', '0,1', '0,2', '1,0', '1,1', '1,2', '2,0', '2,1', '2,2'])
  );
});

// TODO: finish tests
