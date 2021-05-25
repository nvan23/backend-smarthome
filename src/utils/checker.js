exports.isObjectId = (value) => {
  let ObjectID = require("mongodb").ObjectID
  return ObjectID.isValid(value)
}