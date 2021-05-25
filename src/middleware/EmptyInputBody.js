const EmptyInputBody = (req, res, next) => {
  try {
    if (!req.body)
      throw { error: 'Input Error - Empty Input' }

    next()
  } catch (error) {
    res.status(404).json()
  }
}

module.exports = EmptyInputBody