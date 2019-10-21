const Bootcamp = require('../models/Bootcamp')

// @GET /api/v1/bootcamps public
exports.getAllBootCamps = async (req, res) => {
  try {
    const bootCamps = await Bootcamp.find()

    res.status(200).json(bootCamps)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Bad request' })
  }
}

// @GET /api/v1/bootcamps/:id public
exports.getBootCampById = async (req, res) => {
  try {
    const bootCamp = await Bootcamp.findById(req.params.id)

    if (!bootCamp) return res.status(400).json({ message: 'Bad request' })

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Bad request' })
  }
}

// @POST /api/v1/bootcamps Private
exports.createBootCamp = async (req, res) => {
  try {
    const bootCamp = await Bootcamp.create(req.body)

    res.status(201).json(bootCamp)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Bad request' })
  }
}

// @PUT /api/v1/bootcamps/:id Private
exports.updateBootCamp = async (req, res) => {
  try {
    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!bootCamp) return res.status(400).json({ message: 'Bad request' })

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Bad request' })
  }
}

// @DELETE /api/v1/bootcamps/:id Private
exports.deleteBootCamp = async (req, res) => {
  try {
    const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootCamp) return res.status(400).json({ message: 'Bad request' })

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Bad request' })
  }
}
