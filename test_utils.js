const { Cpm, Activity } = require("./cpm.js");

const testActivities2 = [
  new Activity("X", 3),
  new Activity("A", 5, ["X"]),
  new Activity("B", 3, ["X"]),
  new Activity("C", 7, ["B", "A",]),
];

const testActivities1 = [
  new Activity("B", 3),
  new Activity("D", 4, ["A", "B"]),
  new Activity("C", 3, ["A", "B"]),
  new Activity("H", 5, ["F", "G"]),
  new Activity("E", 3, ["C"]),
  new Activity("F", 6, ["C"]),
  new Activity("A", 3),
  new Activity("G", 2, ["D", "E"]),
];

const testResults1 = [
  {
    id: "A",
    duration: 3,
    predecessor: [],
    es: 0,
    ef: 3,
    ls: 0,
    lf: 3,
  },
  {
    id: "B",
    duration: 3,
    predecessor: [],
    es: 0,
    ef: 3,
    ls: 0,
    lf: 3,
  },
  {
    id: "C",
    duration: 3,
    predecessor: ["A", "B"],
    es: 3,
    ef: 6,
    ls: 3,
    lf: 6,
  },
  {
    id: "D",
    duration: 4,
    predecessor: ["A", "B"],
    es: 3,
    ef: 7,
    ls: 6,
    lf: 10,
  },
  {
    id: "E",
    duration: 3,
    predecessor: ["C"],
    es: 6,
    ef: 9,
    ls: 7,
    lf: 10,
  },
  {
    id: "F",
    duration: 6,
    predecessor: ["C"],
    es: 6,
    ef: 12,
    ls: 6,
    lf: 12,
  },
  {
    id: "G",
    duration: 2,
    predecessor: ["D", "E"],
    es: 9,
    ef: 11,
    ls: 10,
    lf: 12,
  },
  {
    id: "H",
    duration: 5,
    predecessor: ["F", "G"],
    es: 12,
    ef: 17,
    ls: 12,
    lf: 17,
  },
];

const testResults2 = [
  {
    id: "X",
    duration: 3,
    predecessor: [],
    es: 0,
    ef: 3,
    ls: 0,
    lf: 3,
  },
  {
    id: "B",
    duration: 3,
    predecessor: ["X"],
    es: 3,
    ef: 6,
    ls: 5,
    lf: 8,
  },
  {
    id: "A",
    duration: 5,
    predecessor: ["X"],
    es: 3,
    ef: 8,
    ls: 3,
    lf: 8,
  },
  {
    id: "C",
    duration: 7,
    predecessor: ["B", "A"],
    es: 8,
    ef: 15,
    ls: 8,
    lf: 15,
  },
];

module.exports = {
  testResults1,
  testResults2,
  testActivities1,
  testActivities2,
};
