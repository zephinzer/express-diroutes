const path = require('path');

const handlerFactory = require('../../lib/handler-factory');

describe('lib/handler-factory', () => {
  it('exports the correct keys', () => {
    expect(handlerFactory).to.have.keys([
      'addRoute',
    ]);
  });

  describe('.addRoute()', () => {
    const allowedMethods = new RegExp(/(get|post|put|delete|patch|head|options)/i); // eslint-disable-line max-len
    const router = {
      use: sinon.spy(),
      get: sinon.spy(),
      post: sinon.spy(),
      put: sinon.spy(),
      patch: sinon.spy(),
      delete: sinon.spy(),
      head: sinon.spy(),
      options: sinon.spy(),
    };
    const routeHandlerMiddleware = {
      route: '/middleware',
      source: path.join(__dirname, '../data/handler_factory/test_middleware'),
      priority: 1,
    };
    const routeHandlerObject = {
      route: '/object',
      source: path.join(__dirname, '../data/handler_factory/test_object'),
      priority: 1,
    };
    const logger = {
      info: sinon.spy(),
      warn: sinon.spy(),
    };
    const routeStringMapping = [];
    const responseMock = {
      json: sinon.spy(),
    };

    afterEach(() => {
      router.use.resetHistory();
      router.get.resetHistory();
      router.post.resetHistory();
      router.put.resetHistory();
      router.patch.resetHistory();
      router.delete.resetHistory();
      router.head.resetHistory();
      router.options.resetHistory();
      logger.info.resetHistory();
      logger.warn.resetHistory();
      responseMock.json.resetHistory();
    });

    context('source exports a middleware', () => {
      it('works as expected', () => {
        handlerFactory.addRoute({
          router,
          routeHandler: routeHandlerMiddleware,
          options: {
            silent: false,
            logger,
            routeStringMapping,
            allowedMethods,
          },
        });
        expect(router.use).to.be.calledWith('/middleware');
        expect(router.use.args[0][1]).to.be.a('function');
        router.use.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledOnce;
        expect(responseMock.json).to.be.calledWith(
          'handler_factory/test_object'
        );

        expect(logger.info).to.be.calledOnce;
      });
    });

    context('source exports an object', () => {
      it('works as expected', () => {
        handlerFactory.addRoute({
          router,
          routeHandler: routeHandlerObject,
          options: {
            silent: false,
            logger,
            routeStringMapping,
            allowedMethods,
          },
        });
        expect(router.get).to.be.calledWith('/object');
        expect(router.get.args[0][1]).to.be.a('function');
        router.get.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'get handler_factory/test_object'
        );

        expect(router.post).to.be.calledWith('/object');
        expect(router.post.args[0][1]).to.be.a('function');
        router.post.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'post handler_factory/test_object'
        );

        expect(router.put).to.be.calledWith('/object');
        expect(router.put.args[0][1]).to.be.a('function');
        router.put.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'put handler_factory/test_object'
        );

        expect(router.patch).to.be.calledWith('/object');
        expect(router.patch.args[0][1]).to.be.a('function');
        router.patch.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'patch handler_factory/test_object'
        );

        expect(router.delete).to.be.calledWith('/object');
        expect(router.delete.args[0][1]).to.be.a('function');
        router.delete.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'delete handler_factory/test_object'
        );

        expect(router.options).to.be.calledWith('/object');
        expect(router.options.args[0][1]).to.be.a('function');
        router.options.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'options handler_factory/test_object'
        );

        expect(router.head).to.be.calledWith('/object');
        expect(router.head.args[0][1]).to.be.a('function');
        router.head.args[0][1](null, responseMock);
        expect(responseMock.json).to.be.calledWith(
          'head handler_factory/test_object'
        );

        expect(logger.info).to.have.callCount(7);
      });
    });
  });
});
