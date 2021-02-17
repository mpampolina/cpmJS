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
   * Perform a forward pass of the activity tree and assign
   * early start (es) and early finish (ef) properties to each
   * activity recursively. Modifies the object array in-place.
   * Returns the early finish date of the project.
   * @param {Activity} root - the final/last activity to be performed
   * @param {Activity[]} activities - an array of preceeding activities
   */
  forwardPass(root, activities) {
    if (root.predecessor.length === 0 && root.ef !== undefined) return root.ef
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
   * Runs the CPM algorithm, assigning early start (ef), early
   * finish (ef), late start (ls), late finish (lf) properties
   * to each activity in a given array. The activites are sorted in
   * ascending order based on latest finishing time.
   * @param {Activity[]} activities - an array of activities to be
   * performed in a given project
   */
  run(activities) {
    let localActivities = _.cloneDeep(activities);
    const localActivitiesRoot = this.root(localActivities);
    const earlyFinish = this.forwardPass(localActivitiesRoot, localActivities);
    this.backwardPass(localActivitiesRoot, localActivities, earlyFinish);
    this.activitySort(localActivities);
    return localActivities;
  }

  /**
   * Returns the earliest finish date for a given project.
   * @param {Activity[]} activities - an array of activities to be
   * performed in a given project
   */
  earlyFinish(activities) {
    let localActivities = _.cloneDeep(activities);
    const localActivitiesRoot = this.root(localActivities);
    const earlyFinish = this.forwardPass(localActivitiesRoot, localActivities);
    return earlyFinish;
  }

  /**
   * Retrieves the root activity for a project, defined as the activity for
   * which there are no further successors.
   * @param {Activity[]} activities - an array of activities to be
   * performed in a given project
   */
  root(activities) {
    const uniquepredecessor = activities.reduce((accumulator, activity) => {
      activity.predecessor.forEach((predessor) => {
        accumulator.add(predessor)
      });
      return accumulator;
    }, new Set());

    const root = activities.find((activity) => {
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
