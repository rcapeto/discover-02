const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobsUtils = require('../utils/jobUtils');

module.exports = {
   async save(req, res) {
      const job = {...req.body, created_at: Date.now() }
   
      await Job.create(job);

      return res.redirect('/');
   },
   create(req, res) {
      return res.render('job');
   },

   async show(req, res) {
      const profile = await Profile.get();

      const { id } = req.params;

      const job = await JobsUtils.hasJob(id);
     
      if(!job) {
         return res.status(400).json({ error: `Don't find Job with id: ${id}` });
      }

      job.budget = JobsUtils.calculateBudget(profile['value-hour'], job);

      return res.render('job-edit', { job });
   },
   
   async update(req, res) {
      const { id } = req.params;

      const job = await JobsUtils.hasJob(id);
     
      if(!job) {
         return res.status(400).json({ error: `Don't find Job with id: ${id}` });
      }

      const updatedJob = {...job,...req.body };

      await Job.upgrade(updatedJob, id);

      return res.redirect(`/job/${id}`);
   },
   async delete(req, res) {
      const { id } = req.params;
      await Job.delete(id);
      return res.redirect('/');
   }
}