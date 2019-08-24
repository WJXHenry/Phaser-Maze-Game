import Graph from './graph';
import { shuffle } from '../Common/shuffle';

export default class Maze {
  constructor(size = 0) {
    this.maze = this._createGrid(size);
    this._createMaze(`${Math.floor(size / 2)},${Math.floor(size / 2)}`);
  }

  getVertices() {
    return this.maze.getVertices();
  }

  isEdge(e) {
    return this.maze.isEdge(e);
  }

  _createGrid(size) {
    let grid = new Graph();
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        grid.addVertex(`${i},${j}`);
      }
    }
    return grid;
  }

  _createMaze(vertex, completed = null, vertices = null) {
    if (vertices == null) {
      vertices = this.getVertices();
    }
    if (completed == null) {
      completed = new Set(vertex);
    }

    let paths = shuffle(['up', 'down', 'left', 'right']);

    let coords = vertex.split(',').map(position => {
      return parseInt(position);
    });

    let up = `${coords[0]},${coords[1] - 1}`;
    let down = `${coords[0]},${coords[1] + 1}`;
    let left = `${coords[0] - 1},${coords[1]}`;
    let right = `${coords[0] + 1},${coords[1]}`;

    paths.forEach(direction => {
      if (direction === 'up') {
        if (vertices.has(up) && !completed.has(up)) {
          this.maze.addEdge([vertex, up]);
          this.maze.addEdge([up, vertex]);
          completed.add(up);
          this._createMaze(up, completed, vertices);
        }
      } else if (direction === 'down') {
        if (vertices.has(down) && !completed.has(down)) {
          this.maze.addEdge([vertex, down]);
          this.maze.addEdge([down, vertex]);
          completed.add(down);
          this._createMaze(down, completed, vertices);
        }
      } else if (direction === 'left') {
        if (vertices.has(left) && !completed.has(left)) {
          this.maze.addEdge([vertex, left]);
          this.maze.addEdge([left, vertex]);
          completed.add(left);
          this._createMaze(left, completed, vertices);
        }
      } else if (direction === 'right') {
        if (vertices.has(right) && !completed.has(right)) {
          this.maze.addEdge([vertex, right]);
          this.maze.addEdge([right, vertex]);
          completed.add(right);
          this._createMaze(right, completed, vertices);
        }
      }
    });
  }
}
