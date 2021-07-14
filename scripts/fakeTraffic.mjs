import fetch from "node-fetch";

const LOG_VIEW_END_POINT = "http://localhost:8080/views";
const EPIC_TESTS = ["TEST_1", "TEST_2", "TEST_3"];
const EPIC_TESTS_VIEW_PROBABILITIES = [0.5, 0.3, 0.2];

async function fakeTraffic() {
  while (true) {
    await postViewEvent();
    await sleep(1000);
  }
}

function postViewEvent() {
  const test = getRandomTest();

  console.log(`Posting view of: ${test}`);

  return fetch(LOG_VIEW_END_POINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      test,
    }),
  });
}

function getRandomTest() {
  const r = Math.random();

  let cumulativeProb = 0;
  for (let i = 0; i < EPIC_TESTS_VIEW_PROBABILITIES.length; i++) {
    cumulativeProb += EPIC_TESTS_VIEW_PROBABILITIES[i];

    if (r <= cumulativeProb) {
      return EPIC_TESTS[i];
    }
  }

  return EPIC_TESTS[EPIC_TESTS.length - 1];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

fakeTraffic();
