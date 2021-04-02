const Job = require('../models/Job');
const Profile = require('../models/Profile');
const JobsUtils = require('../utils/jobUtils');
const ProfileUtils = require('../utils/profileUtils');

module.exports = {
   index(req, res) {
      const jobs = Job.get();
      const profile = Profile.get();

      Profile.updated({
         ...profile,
         'value-hour': ProfileUtils.calculateValueHour(profile),
      });

      const statusCount = {
         progress: 0,
         done: 0,
         total: jobs.length
      }

      let jobTotalHours = 0;

      const jobsUpdated = jobs.map(job => {

         const remaining_days = JobsUtils.remainingDays(job);
         const status = remaining_days <= 0 ? 'done' : 'progress';

         if(status === 'progress') jobTotalHours += job['daily-hours'];
         
         statusCount[status]++;
   
         return {
            ...job,
            remaining_days,
            status,
            budget: JobsUtils.calculateBudget(profile['value-hour'], job)
         }
      });

      const freeHours = profile['hours-per-day'] - jobTotalHours;

      return res.render('index', {
         jobs: jobsUpdated,
         total: statusCount.total,
         progressJobs: statusCount.progress,
         doneJobs: statusCount.done,
         profile,
         freeHours,
      });
   }
}