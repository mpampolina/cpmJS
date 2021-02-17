const { test, expect } = require("@jest/globals");
const { Cpm, Activity } = require("./cpm.js");
const { testResults1, testActivities1 } = require("./test_utils");

const newCpm = new Cpm();

/* Run the Critical Path Algorithm with test case 1. The sample
results for test case 1 are sorted with the same methodology as
the Cpm class to ensure equality of order. */
test("CPM .run() Test Case 1", () => {
  expect(newCpm.run(testActivities1)).toEqual(newCpm.activitySort(testResults1));
});

/* Ensure newCpm.run() does not modify the original array. */
test("CPM .run() Test Case 1", () => {
  expect(newCpm.run(testActivities1)).not.toEqual(testActivities1);
});

test("CPM .earlyFinish() Test Case 1", () => {
  expect(newCpm.earlyFinish(testActivities1)).toBe(17);
});
