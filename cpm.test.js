const { test, expect } = require("@jest/globals");
const { Cpm, Activity } = require("./cpm.js");
const { testResults1, testResults2, testActivities1, testActivities2 } = require("./test_utils");

const testCpm1 = new Cpm(testActivities1);

/* Run the Critical Path Algorithm with test case 1. The sample
results for test case 1 are sorted with the same methodology as
the Cpm class to ensure equality of order. */
test("CPM .run() Test Case 1", () => {
  expect(testCpm1.run()).toEqual(testCpm1.activitySort(testResults1));
});

/* Ensure testCpm1.run() does not modify the original array. */
test("CPM .run() Test Case 1", () => {
  expect(testCpm1.run()).not.toEqual(testActivities1);
});

test("CPM .earlyFinish() Test Case 1", () => {
  expect(testCpm1.earlyFinish).toBe(17);
});

const testCpm2 = new Cpm(testActivities2);

/* Run the Critical Path Algorithm with test case 1. The sample
results for test case 1 are sorted with the same methodology as
the Cpm class to ensure equality of order. */
test("CPM .run() Test Case 2", () => {
  expect(testCpm2.run()).toEqual(testCpm2.activitySort(testResults2));
});

/* Ensure testCpm2.run() does not modify the original array. */
test("CPM .run() Test Case 2", () => {
  expect(testCpm2.run()).not.toEqual(testActivities2);
});