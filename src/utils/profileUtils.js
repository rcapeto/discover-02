module.exports = {
   calculateValueHour(data) {
      const weeksPerYear = 52;
      const weekPerMonth = (weeksPerYear - +data['vacation-per-year']) / 12;

      const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
      const monthlyTotalHours = weekTotalHours * weekPerMonth;

      const valueHour = data['monthly-budget'] / monthlyTotalHours;
      
      return valueHour;
   }
}