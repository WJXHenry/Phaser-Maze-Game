import Graph from './graph';

test('constructor', () => {
  expect.assertions(5);
  let g = new Graph(new Set([1, 2, 3]), new Array([1, 2], [2, 3]));
  expect(Object.keys(g.alist)).toEqual(['1', '2', '3']);
  expect(g.alist[1]).toEqual(new Set([2]));
  expect(g.alist[3]).toEqual(new Set());
  let h1 = new Graph();
  let h2 = new Graph();
  h1.addVertex(1);
  expect(Object.keys(h1.alist)).toEqual(['1']);
  expect(Object.keys(h2.alist)).toEqual([]);
});

test('getVertices', () => {
  expect.assertions(2);
  let g = new Graph(new Set([1, 2, 3]), [
    [1, 2],
    [2, 3]
  ]);
  expect(g.getVertices()).toEqual(new Set(['1', '2', '3']));
  let h = new Graph();
  expect(h.getVertices()).toEqual(new Set());
});

test('getEdges', () => {
  expect.assertions(2);
  let g = new Graph(new Set([1, 2, 3]), [
    [1, 2],
    [2, 3],
    [3, 1]
  ]);
  expect(g.getEdges().sort()).toEqual([
    [1, 2],
    [2, 3],
    [3, 1]
  ]);
  g.addEdge([2, 1]);
  expect(g.getEdges().sort()).toEqual([
    [1, 2],
    [2, 1],
    [2, 3],
    [3, 1]
  ]);
});

test('getEdgesString', () => {
  expect.assertions(2);
  let g = new Graph(new Set(['1', '2', '3']), [
    ['1', '2'],
    ['2', '3'],
    ['3', '1']
  ]);
  expect(g.getEdges().sort()).toEqual([
    ['1', '2'],
    ['2', '3'],
    ['3', '1']
  ]);
  g.addEdge(['2', '1']);
  expect(g.getEdges().sort()).toEqual([
    ['1', '2'],
    ['2', '1'],
    ['2', '3'],
    ['3', '1']
  ]);
});

test('addVertex', () => {
  expect.assertions(3);
  let g = new Graph();
  expect(g.getVertices().size).toEqual(0);
  g.addVertex(1);
  g.addVertex('vertex');
  expect(g.getVertices().has('vertex')).toEqual(true);
  expect(g.getVertices().has('2')).toEqual(false);
});

test('addEdge', () => {
  expect.assertions(3);
  let g = new Graph();
  g.addVertex(1);
  g.addVertex(2);
  g.addEdge([1, 2]);
  expect(g.alist[1].has(2)).toEqual(true);
  expect(g.alist[2].has(1)).toEqual(false);
  g.addEdge([1, 2]);
  expect(g.alist[1]).toEqual(new Set([2]));
});

test('isVertex', () => {
  expect.assertions(3);
  let g = new Graph(new Set([1, 2]));
  expect(g.isVertex(1)).toEqual(true);
  expect(g.isVertex(3)).toEqual(false);
  g.addVertex(3);
  expect(g.isVertex(3)).toEqual(true);
});

test('isEdge', () => {
  expect.assertions(3);
  let g = new Graph(new Set([1, 2]), [[1, 2]]);
  expect(g.isEdge([1, 2])).toEqual(true);
  expect(g.isEdge([2, 1])).toEqual(false);
  g.addEdge([2, 1]);
  expect(g.isEdge([2, 1])).toEqual(true);
});

test('neighbours', () => {
  expect.assertions(4);
  let edges = [
    [1, 2],
    [1, 4],
    [3, 1],
    [3, 4],
    [2, 4],
    [1, 2]
  ];
  let g = new Graph(new Set([1, 2, 3, 4, 5]), edges);
  expect(g.neighbours(1)).toEqual([2, 4]);
  expect(g.neighbours(4)).toEqual([]);
  expect(g.neighbours(3)).toEqual([1, 4]);
  expect(g.neighbours(2)).toEqual([4]);
});

test('isWalk', () => {
  expect.assertions(6);
  let edges = [
    [1, 2],
    [1, 3],
    [2, 5],
    [3, 4],
    [4, 2],
    [5, 4]
  ];
  let g = new Graph(new Set([1, 2, 3, 4, 5]), edges);
  expect(Graph.isWalk(g, [3, 4, 2, 5, 4, 2])).toEqual(true);
  expect(Graph.isWalk(g, [5, 4, 2, 1, 3])).toEqual(false);
  expect(Graph.isWalk(g, [2])).toEqual(true);
  expect(Graph.isWalk(g, [])).toEqual(false);
  expect(Graph.isWalk(g, [1, 6])).toEqual(false);
  expect(Graph.isWalk(g, [6])).toEqual(false);
});

test('isPath', () => {
  expect.assertions(2);
  let edges = [
    [1, 2],
    [1, 3],
    [2, 5],
    [3, 4],
    [4, 2],
    [5, 4]
  ];
  let g = new Graph(new Set([1, 2, 3, 4, 5]), edges);
  expect(Graph.isPath(g, [3, 4, 2, 5, 4, 2])).toEqual(false);
  expect(Graph.isPath(g, [3, 4, 2, 5])).toEqual(true);
});
