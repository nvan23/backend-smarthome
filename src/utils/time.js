exports.lt10Minutes = (time) => {
  return !time ? false : new Date(new Date().getTime() - new Date(time).getTime()).getMinutes() < 10
}
