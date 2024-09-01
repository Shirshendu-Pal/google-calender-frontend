//******* START API CALL ********/
export const startApiCall = (seterrorMessage, setLoader) => {
  {
    seterrorMessage !== null && seterrorMessage("");
  }
  setLoader(true);
  setTimeout(() => {
    setLoader(false);
  }, 50000);
};

export const getMonthDates =(monthIndex , date) => {

  const year = new Date(date).toISOString().split("T")[0].split("-")[0]
  
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);

  return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
  };
}
