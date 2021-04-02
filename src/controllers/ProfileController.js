const Profile = require('../models/Profile');
const ProfileUtils = require('../utils/profileUtils');

module.exports = {
   index(req, res) {
      const profile = Profile.get();
      const valueHour = ProfileUtils.calculateValueHour(profile);


      return res.render('profile', { profile: { ...profile, 'value-hour': valueHour } });
   },

   update(req, res) {
      const profile = Profile.get();
      const data = req.body;

      ProfileUtils.calculateValueHour(data);

      const valueHour = ProfileUtils.calculateValueHour(data);

      const profileUpdated = {
         ...profile,
         ...data,
         'value-hour': valueHour
      }

      Profile.updated(profileUpdated);

      return res.redirect('/profile');
   }  
}