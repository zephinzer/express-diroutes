module.exports = () => ({
  get: (req, res) => {
    res.json('get handler_factory/test_object');
  },
  post: (req, res) => {
    res.json('post handler_factory/test_object');
  },
  put: (req, res) => {
    res.json('put handler_factory/test_object');
  },
  patch: (req, res) => {
    res.json('patch handler_factory/test_object');
  },
  delete: (req, res) => {
    res.json('delete handler_factory/test_object');
  },
  head: (req, res) => {
    res.json('head handler_factory/test_object');
  },
  options: (req, res) => {
    res.json('options handler_factory/test_object');
  },
});
