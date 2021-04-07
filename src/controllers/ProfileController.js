const Profile = require('../models/Profile');

module.exports = {
   async index(req, res) {
      const profile = await Profile.get();
      return res.render('profile', { profile });
   },

   async update(req, res) {
      const profile = await Profile.get();
      const data = req.body;

      const profileUpdated = {
         ...profile,
         ...data,
      }

      await Profile.update(profileUpdated);

      return res.redirect('/profile');
   }  
}