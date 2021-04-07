module.exports = {
   calculateValueHour(data) {
      const weeksPerYear = 52;
      const weekPerMonth = (weeksPerYear - +data['vacation_per_year']) / 12;

      const weekTotalHours = data['hours_per_day'] * data['days_per_week'];
      const monthlyTotalHours = weekTotalHours * weekPerMonth;

      const valueHour = data['monthly_budget'] / monthlyTotalHours;
      
      return valueHour;
   }
}