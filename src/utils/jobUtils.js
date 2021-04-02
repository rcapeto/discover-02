const Job = require('../models/Job');

module.exports = {
   remainingDays(job) {
      const remaining_days = Math.floor(job['total-hours'] / job['daily-hours']);
      const createdDate = new Date(job.created_at);
   
      const dueDay = createdDate.getDate() + remaining_days;
      const dueDate = createdDate.setDate(dueDay); //retorna em MS
   
      const timeDiffInMs = dueDate - Date.now();
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);
   
      return dayDiff;
   },
   calculateBudget(valueHour, job) {
      return valueHour * job['total-hours'];
   },
   hasJob(id) {
      return Job.get().find(currentJob => String(currentJob.id) === id);
   }
}