/**
 * Directed Graph Class
 *
 * This graph class is a container that holds a set
 * of vertices and a list of directed edges.
 * Edges are modelled as tuples (u,v) of vertices.
 *
 * Uses an adjacency list representation. Loops
 * and parallel copies of edges can be stored.
 */

export default class Graph {
  constructor(vertices = new Set(), edges = []) {
    this.alist = {};

    vertices.forEach(v => {
      this.addVertex(v);
    });
    edges.forEach(e => {
      this.addEdge(e);
    });
  }

  getVertices() {
    return new Set(Object.keys(this.alist));
  }

  getEdges() {
    let edges = [];
    Object.keys(this.alist).forEach(key => {
      this.alist[key].forEach(vertex => {
        if (Number.isInteger(vertex)) {
          edges.push([Number(key), vertex]);
        } else {
          edges.push([key, vertex]);
        }
      });
    });
    return edges;
  }

  addVertex(v) {
    if (!(v in this.alist)) {
      this.alist[v] = new Set();
    }
  }

  addEdge(e) {
    if (!this.isVertex(e[0]) || !this.isVertex(e[1])) {
      throw new Error('An endpoint is not in graph');
    }
    this.alist[e[0]].add(e[1]);
  }

  isVertex(v) {
    return v in this.alist;
  }

  isEdge(e) {
    if (!(e[0] in this.alist)) {
      return false;
    }
    return this.alist[e[0]].has(e[1]);
  }

  neighbours(v) {
    if (!this.isVertex(v)) {
      throw new Error('Vertex not in graph');
    }
    return Array.from(this.alist[v]);
  }

  static isWalk(g, walk) {
    if (walk.length === 0)
      // Should have at least one vertex
      return false;

    if (walk.length === 1) return g.isVertex(walk[0]);

    for (let i = 0; i < walk.length - 1; i++) {
      if (!g.isEdge([walk[i], walk[i + 1]])) {
        return false;
      }
    }
    return true;
  }

  static isPath(g, path) {
    if (new Set(path).size < path.length) return false;

    return this.isWalk(g, path);
  }
}
