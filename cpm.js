const _ = require("lodash");

class Activity {
  /**
   * @param {string} id - unique string identifier for a specific activity
   * @param {number} duration - activity duration
   * @param {string[]} predecessor - array of unique string identifiers
   * that refer to predessor activities. An empty array indicates no predecessor.
   */
  constructor(id, duration, predecessor = []) {
    this.id = id;
    this.duration = duration;
    this.predecessor = predecessor;
  }
}

class Cpm {
  /**
   * @param {Activity[]} activities - an array of activities to be
   * performed in a given project
   */
  constructor(activities) {
    this.activities = _.cloneDeep(activities);
  }

  /**
   * Perform a forward pass of the activity tree and assign
   * early start (es) and early finish (ef) properties to each
   * activity recursively. Modifies the object array in-place.
   * Returns the early finish date of the project.
   * @param {Activity} root - the final/last activity to be performed
   * @param {Activity[]} activities - an array of preceeding activities
   */
  forwardPass(root, activities) {
    if (root.predecessor.length === 0 && root.ef !== undefined) return root.ef;
    if (root.predecessor.length === 0) {
      root.es = 0;
      root.ef = root.es + root.duration;
      return root.ef;
    }
    let earliestStart = 0;

    for (const id of root.predecessor) {
      const currentStart = this.forwardPass(
        activities.find((activity) => activity.id === id),
        activities
      );
      if (currentStart > earliestStart) {
        earliestStart = currentStart;
      }
    }

    root.es = earliestStart;
    root.ef = root.es + root.duration;

    return root.ef;
  }

  /**
   * Perform a backward pass of the activity tree and assign
   * late start (ls) and late finish (lf) properties to each
   * activity recursively. Modifies the object array in-place.
   * Returns none.
   * @param {Activity} root - the final/last activity to be performed
   * @param {Activity[]} activities - an array of preceeding activities
   * @param {number} duration - the latest finishing time for the project,
   * usually set to be equivalent to the earliest finishing time for the project
   */
  backwardPass(root, activities, duration) {
    if (root.ls === undefined || root.ls > duration - root.duration) {
      root.ls = duration - root.duration;
    }
    if (root.lf === undefined || root.lf > duration) {
      root.lf = duration;
    }
    if (root.predecessor.length === 0) {
      return;
    }

    for (const id of root.predecessor) {
      this.backwardPass(
        activities.find((activity) => activity.id === id),
        activities,
        root.ls
      );
    }

    return;
  }

  /**
   * Runs the CPM algorithm, assigning early start (es), early
   * finish (ef), late start (ls), late finish (lf), total float (tf),
   * free float (ff), and critical (boolean) properties to each
   * activity in the activities array. The activites are sorted in
   * ascending order based on latest finishing time.
   */
  run() {
    this.root = this.getRoot();
    this.earlyFinish = this.forwardPass(this.root, this.activities);
    this.backwardPass(this.root, this.activities, this.earlyFinish);
    this.activitySort(this.activities);
    this.retrieveImmmediateSuccessors(this.root, this.activities);
    this.calculateFloat();
    return this.activities;
  }

  /**
   * Retrieves the root activity for a project, defined as the activity for
   * which there are no further successors.
   */
  getRoot() {
    const uniquepredecessor = this.activities.reduce(
      (accumulator, activity) => {
        activity.predecessor.forEach((predecessor) => {
          accumulator.add(predecessor);
        });
        return accumulator;
      },
      new Set()
    );

    const root = this.activities.find((activity) => {
      return !uniquepredecessor.has(activity.id);
    });

    return root;
  }

  /**
   * Helper function that assigns a "completePredecessors" property
   * to each activity in an array, which is a set of activity IDs that
   * refer to all predecessors of a given activity. Modifies the activity
   * array in place.
   * @param {Activity} root - the final/last activity to be performed
   * @param {Activity[]} activities - an array of activities to be
   * performed in a given project
   */
  retrievePredecessors(root, activities) {
    root.completePredecessors = new Set();

    if (root.predecessor.length === 0) {
      return root;
    }

    for (const id of root.predecessor) {
      const predecessor = this.retrievePredecessors(
        activities.find((activity) => activity.id === id),
        activities
      );
      predecessor.completePredecessors.forEach((predecessor) => {
        root.completePredecessors.add(predecessor);
      });
      root.completePredecessors.add(id);
    }

    return root;
  }

  /**
   * Retrieves immediate successors for each activity in activity array
   * and assigns their IDs to the "successor" property of a given activity.
   * Modifies the activity array in place.
   * @param {Activity} root - the final/last activity to be performed
   * @param {Activity[]} activites - an array of activities to be
   * performed in a given project
   * @param {string} successorID - an identifier of the current successor
   */
  retrieveImmmediateSuccessors(root, activites, successorID = null) {
    if (root.successor === undefined) {
      root.successor = [];
    }
    if (successorID && root.successor.indexOf(successorID) === -1) {
      root.successor.push(successorID);
    }
    if (root.predecessor.length === 0) return;

    for (const id of root.predecessor) {
      this.retrieveImmmediateSuccessors(
        activites.find((activity) => activity.id === id),
        activites,
        root.id
      );
    }

    return;
  }

  /**
   * For each activity, calculate the total float (tf), free float (ff),
   * and whether or the activity falls on the critical path (boolean).
   * Assign these values to their respective activities. Modifies the
   * activity array in-place.
   */
  calculateFloat() {
    for (const currentActivity of this.activities) {
      currentActivity.tf = currentActivity.lf - currentActivity.ef;
      /* Since all successors should have the same early start,
      we can grab a successor of the current activity.  */
      const aSuccessor = this.activities.find(
        (activity) => activity.id === currentActivity.successor[0]
      );

      if (currentActivity === this.root) {
        currentActivity.ff = this.earlyFinish - currentActivity.ef;
      } else {
        const destNodeES = aSuccessor.es;
        currentActivity.ff = destNodeES - currentActivity.ef;
      }
      currentActivity.critical = currentActivity.tf === 0 ? true : false;
    }
  }

  /**
   * Sorts activities by their latest finish date in ascending order. If
   * the latest finish date is common between two activities, their early
   * finish date are compared and ordered ascendingly. If both the late and
   * early finish dates are equivalent, the activities with be sorted
   * alphanumerically according to their activity ID.
   * @param {Activity[]} activities an array of activities to be
   * performed in a given project
   */
  activitySort(activities) {
    activities.sort((activity1, activity2) => {
      if (activity1.lf > activity2.lf) {
        return 1;
      } else if (activity1.lf === activity2.lf && activity1.ef > activity2.ef) {
        return 1;
      } else if (
        activity1.lf === activity2.lf &&
        activity1.ef === activity2.ef
      ) {
        return activity1.id.localeCompare(activity2.id);
      } else {
        return -1;
      }
    });
    return activities;
  }
}

module.exports = {
  Cpm,
  Activity,
};
