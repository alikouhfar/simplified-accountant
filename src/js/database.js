export const records = localStorage.getItem("records")
  ? { ...JSON.parse(localStorage.getItem("records")) }
  : {};
