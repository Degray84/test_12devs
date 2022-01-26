module.exports = (date, month = "short") => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "2-digit",
  });
};
