const Redis = require("ioredis");

const client = new Redis();

const TESTS_KEY = 'tests';
const TESTS_VIEWS_KEY = 'tests:views:'

function viewLogger({ windowTimeMs }) {
  async function logView(test) {
    const now = Date.now();

    await client
      .multi()
      .zadd(TESTS_KEY, now, test)
      .zadd(TESTS_VIEWS_KEY + test, now, now)
      .expire(TESTS_VIEWS_KEY + test, windowTimeMs / 1000)
      .exec();
  }

  async function getViews(test) {
    const [, [, reply]] = await client
      .multi()
      .zremrangebyscore(TESTS_VIEWS_KEY + test, 0, expirationMs())
      .zcard(TESTS_VIEWS_KEY + test)
      .exec();

    return parseInt(reply);
  }

  async function getAllTests() {
    const [, [, tests]] = await client
      .multi()
      .zremrangebyscore(TESTS_KEY, 0, expirationMs())
      .zrange(TESTS_KEY, 0, -1)
      .exec();

    return tests;
  }

  async function getAllViews() {
    const tests = await getAllTests();

    const views = {};
    for (let test of tests) {
      views[test] = await getViews(test);
    }
    return views;
  }

  // --- utils --- //
  function expirationMs() {
    return Date.now() - windowTimeMs;
  }

  return { getViews, getAllViews, logView }
}

module.exports = viewLogger;