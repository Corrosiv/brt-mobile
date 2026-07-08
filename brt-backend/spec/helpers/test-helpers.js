global.createResponseMock = function createResponseMock() {
  const response = {
    statusCode: 200,
    body: null,
    filePath: null
  };

  response.status = jasmine.createSpy('status').and.callFake(function (code) {
    response.statusCode = code;
    return response;
  });

  response.json = jasmine.createSpy('json').and.callFake(function (payload) {
    response.body = payload;
    return response;
  });

  response.sendFile = jasmine.createSpy('sendFile').and.callFake(function (filePath) {
    response.filePath = filePath;
    return response;
  });

  return response;
};

global.createNextSpy = function createNextSpy() {
  return jasmine.createSpy('next');
};
