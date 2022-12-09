const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async (req, res) => {
  const userId = req.user.userId;
  //console.log(userId);
  const allJobs = await Job.find({ createdBy: userId });
  res.status(StatusCodes.OK).json({ allJobs });
};

const getJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;

  const singleJob = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!singleJob) {
    throw new NotFoundError(`job that you requsted with id ${jobId} not found`);
  }

  res.status(StatusCodes.OK).json({ singleJob });
};

const deleteJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;

  const deleteJob = await Job.deleteOne({ _id: jobId, createdBy: userId });

  res.status(StatusCodes.OK).json({ deleteJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newJob = await Job.create(req.body);
  console.log(newJob);
  res.status(StatusCodes.CREATED).json({ newJob });
};

const updateJob = async (req, res) => {
  const userId = req.user.userId;
  const { company, position } = req.body;
  const jobId = req.params.id;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or position are not provided');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    { createdBy: userId, _id: jobId },
    { company, position },
    { runValidators: true, new: true }
  );
  if (!updatedJob) {
    throw new NotFoundError(
      `job that you requested with id ${jobId} not found`
    );
  }

  console.log(updatedJob);

  res.status(StatusCodes.OK).json({ updatedJob });
};

module.exports = { getAllJobs, getJob, deleteJob, createJob, updateJob };
