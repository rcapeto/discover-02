const database = require('../database/config');
const ProfileUtils = require('../utils/profileUtils');

module.exports = {
   async get() {
      const db = await database();

      const profile = await db.get('SELECT * FROM profile');

      await db.close();

      return {
         name: profile.name,
         avatar: profile.avatar,
         'monthly-budget': profile['monthly_budget'],
         'days-per-week': profile['days_per_week'],
         'hours-per-day': profile['hours_per_day'],
         'vacation-per-year': profile['vacation_per_year'],
         'value-hour': ProfileUtils.calculateValueHour(profile),
      }
   },
   async update(data) {
      const db = await database();

      await db.run(`
         UPDATE profile SET
         name = "${data.name}",
         avatar = "${data.avatar}",
         monthly_budget = ${data['monthly-budget']},
         days_per_week = ${data['days-per-week']},
         hours_per_day = ${data['hours-per-day']},
         vacation_per_year = ${data['vacation-per-year']}
      `);

      await db.close();
   }
}