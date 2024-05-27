function formatDate(date: Date) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const weekDay = date.toLocaleString("default", { weekday: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Adjust startOfWeek for weeks starting on Monday
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (now.getDay() || 7) + 1); // set to previous Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // set to next Sunday

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${hours}:${minutes}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${hours}:${minutes}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${hours}:${minutes}`;
  } else if (date >= startOfWeek && date <= endOfWeek) {
    return `${weekDay}, ${hours}:${minutes}`;
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${day} ${month}, ${hours}:${minutes}`;
  } else {
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
}

function formatTimeDifference(startDate: Date, endDate: Date) {
  // Calculate time difference in milliseconds
  let diff = Number(endDate) - Number(startDate);

  // Time calculations for days, hours, minutes
  let minutes = Math.floor((diff / (1000 * 60)) % 60);
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let months = 0;
  let years = 0;

  // Approximate calculation for months and years
  if (days > 30) {
    months = Math.floor(days / 30);
    days %= 30;
  }
  if (months > 12) {
    years = Math.floor(months / 12);
    months %= 12;
  }

  // Formatting the output
  let formattedDiff = "";
  if (years > 0) {
    formattedDiff = `${years}y `;
  }
  else if (months > 0) {
    formattedDiff = `${months}mo `;
  }
  else if (days > 0) {
    formattedDiff = `${days}d `;
  }
  else if (hours > 0) {
    formattedDiff = `${hours}h `;
  }
  else if (minutes > 0) {
    formattedDiff = `${minutes}m`;
  }
  return formattedDiff;
}
export { formatTimeDifference };
export default formatDate;
