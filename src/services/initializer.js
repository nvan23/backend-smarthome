'use strict'

const config = require('../config')
const Role = require('../models/role.model')
const User = require('../models/user.model')
const Home = require('../models/home.model')

exports.roles = async () => {
  const roles = await Role.find()

  if (roles.length) return

  const rawRoles = config.roles
  for (const [key, value] of Object.entries(rawRoles)) {
    const role = new Role({ name: key, key: value })
    await role.save()
  }
}

exports.host = async () => {
  try {
    const users = await User.find()
    if (users?.length) throw { error: "Error during init default host account." }

    const user = new User(config?.default?.host)
    await user.save()
    await user.initHostRole()

    console.log({ msg: 'Init default host account successfully' })

  } catch (error) {
    console.log(error)
  }
}

exports.home = async () => {
  try {
    const users = await User.find()
    if (users?.length !== 1) throw { error: "Error during create default home." }

    const homes = await Home.find()
    if (homes?.length !== 1) throw { error: "Error during create default home." }

    const home = new Home({
      name: `${users[0]?.name}'s home`,
      hostId: users[0]?.id,
    })

    if (!home) throw { error: "Cannot create a first home" }
    await home.save()

    await User
      .findByIdAndUpdate(
        users[0]?.id,
        {
          homeId: home._id,
          currentHome: home._id,
        },
        { new: true }
      )

    console.log("Creating default home successfully")

  } catch (error) {
    console.log(error)
  }
}