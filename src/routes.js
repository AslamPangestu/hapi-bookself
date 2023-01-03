const {
  addBookController,
  deleteBookController,
  editBookController,
  getBookController,
  getBooksController
} = require('./controllers/BookController')
const { responseHandler } = require('./helper')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookController
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooksController
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookController
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookController
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookController
  },
  {
    method: '*',
    path: '/books',
    handler: (request, h) => {
      return responseHandler(h, { message: 'Method not allowed', code: 405 })
    }
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return responseHandler(h, { message: 'Not Found', code: 404 })
    }
  }
]

module.exports = routes
