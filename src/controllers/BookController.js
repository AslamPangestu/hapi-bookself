const { nanoid } = require('nanoid')
const { responseHandler } = require('../helper')
const { books } = require('../db')

const addBookController = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return responseHandler(h, {
      code: 400,
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
  }

  if (readPage > pageCount) {
    return responseHandler(h, {
      code: 400,
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newData = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt, finished
  }
  books.push(newData)

  const isSuccess = books.find((book) => book.id === id)

  if (!isSuccess) {
    return responseHandler(h, {
      code: 500,
      message: 'Buku gagal ditambahkan'
    })
  }

  return responseHandler(h, {
    code: 201,
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id
    }
  })
}

const editBookController = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return responseHandler(h, {
      code: 400,
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
  }

  if (readPage > pageCount) {
    return responseHandler(h, {
      code: 400,
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  const index = books.findIndex((book) => book.id === id)

  if (index === -1) {
    return responseHandler(h, {
      code: 404,
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
  }

  const updatedAt = new Date().toISOString()
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  }
  return responseHandler(h, {
    code: 200,
    message: 'Buku berhasil diperbarui'
  })
}

const deleteBookController = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index === -1) {
    return responseHandler(h, {
      code: 404,
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
  }

  books.splice(index, 1)
  return responseHandler(h, {
    code: 200,
    message: 'Buku berhasil dihapus'
  })
}

const getBooksController = (request, h) => {
  const { name, reading, finished } = request.query
  let data = [...books]

  if (name || reading || finished) {
    data = books.filter(item => {
      const conditions = []
      if (name) {
        conditions.push(item.name.toLowerCase().includes(name.toLowerCase()))
      }
      if (reading) {
        const value = parseInt(reading, 10) === 1
        conditions.push(item.reading === value)
      }
      if (finished) {
        const value = parseInt(finished, 10) === 1
        conditions.push(item.finished === value)
      }
      return conditions.every(value => value)
    })
  }

  return responseHandler(h, {
    code: 200,
    data: {
      books: data.map(({ id, name, publisher }) => ({
        id, name, publisher
      }))
    }
  })
}

const getBookController = (request, h) => {
  const { id } = request.params
  const book = books.filter((n) => n.id === id)[0]

  if (!book) {
    return responseHandler(h, {
      code: 404,
      message: 'Buku tidak ditemukan'
    })
  }
  return responseHandler(h, {
    code: 200,
    data: {
      book
    }
  })
}

module.exports = { addBookController, editBookController, deleteBookController, getBooksController, getBookController }
