const { test, expect } = require("@jest/globals");
const { Cpm, Activity } = require("./cpm.js");
const {
  testResults1,
  testResults2,
  testResults3,
  testActivities1,
  testActivities2,
  testActivities3,
} = require("./test_utils");

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

test("CPM .run() Test Case 2", () => {
  expect(testCpm2.run()).toEqual(testCpm2.activitySort(testResults2));
});

test("CPM .run() Test Case 2", () => {
  expect(testCpm2.run()).not.toEqual(testActivities2);
});

const testCpm3 = new Cpm(testActivities3);

test("CPM .run() Test Case 3", () => {
  expect(testCpm3.run()).toEqual(testCpm3.activitySort(testResults3));
});

test("CPM .run() Test Case 3", () => {
  expect(testCpm3.run()).not.toEqual(testActivities3);
});
