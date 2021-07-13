const Redis = require("ioredis");

const client = new Redis();

const TESTS_KEY = 'tests';
const TESTS_VIEWS_KEY = 'tests:views:'

function viewLogger({ windowTimeMs }) {
  async function logView(test) {
    const now = Date.now();

    await client
      .multi()
      .sadd(TESTS_KEY, test)
      .zadd(TESTS_VIEWS_KEY + test, now, now)
      .expire(TESTS_VIEWS_KEY + test, windowTimeMs / 1000)
      .exec();
  }

  async function getViews(test) {
    const now = Date.now();
    const expirationMs = now - windowTimeMs;

    const [, [, reply]] = await client
      .multi()
      .zremrangebyscore(TESTS_VIEWS_KEY + test, 0, expirationMs)
      .zcard(TESTS_VIEWS_KEY + test)
      .exec();

    return parseInt(reply);
  }

  async function getAllViews() {
    const tests = await client.smembers(TESTS_KEY)

    const views = {};
    for (let test of tests) {
      views[test] = await getViews(test);
    }
    return views;
  }

  return { getViews, getAllViews, logView }
}

module.exports = viewLogger;