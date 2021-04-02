const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobsUtils = require('../utils/jobUtils');

module.exports = {
   save(req, res) {
      const jobs = Job.get();

      const lastId = jobs[jobs.length - 1]?.id || 1;

      const job = {
         ...req.body,
         created_at: Date.now(),
         id: lastId + 1,
      }
   
      jobs.push(job);
      return res.redirect('/');
   },
   create(req, res) {
      return res.render('job');
   },
   show(req, res) {
      const profile = Profile.get();

      const { id } = req.params;

      const job = JobsUtils.hasJob(id);
     
      if(!job) {
         return res.status(400).json({ error: `Don't find Job with id: ${id}` });
      }

      job.budget = JobsUtils.calculateBudget(profile['value-hour'], job);

      return res.render('job-edit', { job });
   },
   update(req, res) {
      const jobs = Job.get();

      const { id } = req.params;

      const job = JobsUtils.hasJob(id);
     
      if(!job) {
         return res.status(400).json({ error: `Don't find Job with id: ${id}` });
      }

      const updatedJob = {
         ...job,
         ...req.body,
      }

      const jobIndex = jobs.findIndex(currentJob => String(currentJob.id) === id);

      if(jobIndex >= 0) {
         jobs[jobIndex] = updatedJob;
      }

      return res.redirect(`/job/${id}`);
   },
   delete(req, res) {
      const { id } = req.params;
      Job.delete(id);
      return res.redirect('/');
   }
}