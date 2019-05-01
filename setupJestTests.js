beforeEach(() => {
  global.Math.random = jest.fn()
    .mockReturnValueOnce(0.2)
    .mockReturnValueOnce(0.6)
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0.99)
    .mockReturnValue(0.3)
})
