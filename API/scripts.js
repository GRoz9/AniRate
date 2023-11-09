export function getAnimeSeason(isNextSeason = false) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    let season = '';
    let year = currentYear;
  
    if (isNextSeason) {
      if (currentMonth >= 1 && currentMonth <= 3) {
        season = "Spring";
      } else if (currentMonth >= 4 && currentMonth <= 6) {
        season = "Summer";
      } else if (currentMonth >= 7 && currentMonth <= 9) {
        season = "Fall";
      } else {
        season = "Winter";
        year = currentYear + 1
      }
    } else {
      if (currentMonth >= 1 && currentMonth <= 3) {
        season = "Winter";
      } else if (currentMonth >= 4 && currentMonth <= 6) {
        season = "Spring";
      } else if (currentMonth >= 7 && currentMonth <= 9) {
        season = "Summer";
      } else {
        season = "Fall";
      }
    }
    return { season, year };
}