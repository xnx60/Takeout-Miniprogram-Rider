const formatNumber = num => {
   num = num .toString()
    return  num [1] ? num : '0' + num 
  }
export function getCurrentTime(){
  let date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()  
  return [year, month, day].map(formatNumber).join('-')
}