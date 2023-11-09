export {cleanDesc, cleanDate, capitalise}

function cleanDesc(Desc, maxLength) {
  if (Desc === null || Desc === undefined || typeof Desc !== 'string' || Desc.length < 5) {
    return "No description available";
  }
  const pattern = /<i>.*?<\/i>.*?|.*?<\/i>\.|Remove:|<br>|\(.*?\)|\[.*?\]/g;
  let cleanedText = Desc.replace(pattern, '');
  const firstLineBreakIndex = cleanedText.indexOf('<br>');
  cleanedText = firstLineBreakIndex >= 0 ? cleanedText.substring(firstLineBreakIndex + 4) : cleanedText;
  if (cleanedText.length > maxLength) {
    cleanedText = cleanedText.substring(0, maxLength - 3) + '...';
  }
  return cleanedText;
}

function cleanDate(month, day, year) {
    var date = new Date();
    date.setMonth(month - 1);
    const Month = date.toLocaleString('en-GB', { month: 'short' });
    var formattedDate = Month + " " + day + ", " + year
    return formattedDate;
}

function capitalise(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}