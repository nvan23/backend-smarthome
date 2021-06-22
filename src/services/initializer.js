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
    if (users?.length) return

    const user = new User(config?.default?.host)
    await user.save()
    await user.initHostRole()

    const homes = await Home.find()
    if (homes?.length === 0) {
      const home = new Home({
        name: `${user?.name}'s home`,
        hostId: user?.id,
      })

      if (!home) throw { error: "Cannot create a first home" }
      await home.save()

      await User
        .findByIdAndUpdate(
          user?.id,
          {
            homeId: home._id,
            currentHome: home._id,
          },
          { new: true }
        )

      console.log("Creating default home successfully")
      return
    }
    console.log('Error during create default home')
  } catch (error) {
    console.log(error)
  }
}
