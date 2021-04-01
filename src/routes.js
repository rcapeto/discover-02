const express = require('express');
const routes = express.Router();

const baseUrl = `${__dirname}/views`;

const Profile = {
   data: {
      name: 'Raphael',
      avatar: 'https://github.com/rcapeto.png',
      'monthly-budget': 3000,
      'days-per-week': 5,
      'hours-per-day': 5,
      'vacation-per-year': 4,
      'value-hour': 75
   },
   controllers: {
      index(req, res) {
         return res.render(`${baseUrl}/profile`, { profile: Profile.data });
      },

      update(req, res) {
         const data = req.body;
         const weeksPerYear = 52;
         const weekPerMonth = (weeksPerYear / data['vacation-per-year']) / 12;
         const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
         const monthlyTotalHours = weekTotalHours * weekPerMonth;
         const valueHour = data['monthly-budget'] / monthlyTotalHours;
         
         Profile.data = {
            ...Profile.data,
            ...req.body,
            'value-hour': valueHour
         }

         return res.redirect('/profile');
      }  
   }
}

const Job = {
   data: [
      {
         id: 1,
         name: 'Pizzaria Guloso',
         'daily-hours': 2,
         'total-hours': 60,
         created_at: Date.now(),
      },
      {
         id: 2,
         name: 'OneTwo Project',
         'daily-hours': 3,
         'total-hours': 47,
         created_at: Date.now(),
      }
   ],
   controllers: {
      index(req, res) {
         const jobsUpdated = Job.data.map(job => {

         const remaining_days = Job.services.remainingDays(job);
         const status = remaining_days <= 0 ? 'done' : 'progress';
      
            return {
               ...job,
               remaining_days,
               status,
               budget: Job.services.calculateBudget(Profile.data['value-hour'], job)
            }
         });

         let countProgressJobs = 0;
         let countDoneJobs = 0;

         for(const job of jobsUpdated) {
            if(job.status === 'done') {
               countDoneJobs++;
            } else {
               countProgressJobs++;
            }
         }

         return res.render(`${baseUrl}/index`, {
            jobs: jobsUpdated,
            total: jobsUpdated.length,
            progressJobs: countProgressJobs,
            doneJobs: countDoneJobs,
            profile: Profile.data,
         });
      },
      save(req, res) {
         const lastId = Job.data[Job.data.length - 1]?.id || 1;
   
         const job = {
            ...req.body,
            created_at: Date.now(),
            id: lastId + 1,
         }
      
         Job.data.push(job);
         return res.redirect('/');
      },
      create(req, res) {
         return res.render(`${baseUrl}/job`)
      },
      show(req, res) {
         const { id } = req.params;

         const job = Job.services.hasJob(id);
        
         if(!job) {
            return res.status(400).json({ error: `Don't find Job with id: ${id}` });
         }

         job.budget = Job.services.calculateBudget(Profile.data['value-hour'], job);

         return res.render(`${baseUrl}/job-edit`, { job });
      },
      update(req, res) {
         const { id } = req.params;

         const job = Job.services.hasJob(id);
        
         if(!job) {
            return res.status(400).json({ error: `Don't find Job with id: ${id}` });
         }

         const updatedJob = {
            ...job,
            ...req.body,
         }

         const jobIndex = Job.data.findIndex(currentJob => String(currentJob.id) === id);

         if(jobIndex >= 0) {
            Job.data[jobIndex] = updatedJob;
         }

         return res.redirect(`/job/${id}`);
      },
      delete(req, res) {
         const { id } = req.params;

         Job.data = Job.data.filter(job => String(job.id) !== id);
         
         return res.redirect('/');
      }
   },
   services: {
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
         return Job.data.find(currentJob => String(currentJob.id) === id);
      }
   }
}

routes.get('/', Job.controllers.index);

routes.post('/job', Job.controllers.save);
routes.get('/job', Job.controllers.create);

routes.get('/job/:id', Job.controllers.show);
routes.post('/job/edit/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;