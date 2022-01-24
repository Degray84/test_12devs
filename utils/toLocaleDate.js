module.exports = (date, month = "short") => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "2-digit",
  });
};
