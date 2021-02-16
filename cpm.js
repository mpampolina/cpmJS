class Activity {
  constructor(id, duration, predessors = []) {
    this.id = id;
    this.duration = duration;
    this.predessors = predessors;
  }
}

const activities = [new Activity("A", 5), new Activity("B", 3)];
const activities3 = [
  new Activity("X", 3),
  new Activity("A", 5, ["X"]),
  new Activity("B", 3, ["X"]),
];

const root = new Activity("C", 7, ["A", "B"]);

const activities2 = [
  new Activity("1", 3),
  new Activity("2", 3),
  new Activity("3", 3, ["1", "2"]),
  new Activity("4", 4, ["1", "2"]),
  new Activity("5", 3, ["3"]),
  new Activity("6", 6, ["3"]),
  new Activity("7", 2, ["4", "5"]),
];

const root2 = new Activity("8", 5, ["6", "7"]);

/* Assuming that the last activity is latest.
Will have to sort. */
console.log(activities2.reverse());

const fwdPass = (root, activities) => {
  if (root.predessors.length === 0) {
    root.es = 0;
    root.ef = root.es + root.duration;
    return root.duration;
  }
  let tot = 0;

  for (const id of root.predessors) {
    const temp = fwdPass(
      activities.find((activity) => activity.id === id),
      activities
    );
    if (temp > tot) {
      tot = temp;
    }
  }

  root.es = tot;
  root.ef = root.es + root.duration;

  return tot + root.duration;
};

const backPass = (root, activities, duration) => {
  if (root.ls === undefined || root.ls > duration - root.duration) {
    root.ls = duration - root.duration;
  }
  if (root.lf === undefined || root.lf > duration) {
    root.lf = duration;
  }
  if (root.predessors.length === 0) {
    return;
  }

  for (const id of root.predessors) {
    backPass(
      activities.find((activity) => activity.id === id),
      activities,
      root.ls
    );
  }
};

const max2 = fwdPass(root2, activities2);
backPass(root2, activities2, max2);
console.log(max2);
console.log(activities2);
console.log(root2);
