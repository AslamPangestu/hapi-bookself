const responseHandler = (h, { message = '', code = 0, data = null } = {}) => {
  const CODE_MAP = {
    2: 'success',
    4: 'fail',
    5: 'error'
  }
  const response = h.response({
    status: CODE_MAP[code.toString()[0]],
    ...(message && { message }),
    ...(data && { data })
  })
  response.code(code)
  return response
}

module.exports = { responseHandler }
