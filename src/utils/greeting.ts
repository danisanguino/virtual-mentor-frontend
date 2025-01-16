export const greeting = (newHour: number) => {
  if (newHour >= 12 && newHour < 20) {
    return "Buenas tardes"
  } else if (newHour >= 6 && newHour < 12 ) {
    return "Buenos días"
  } else {
    return "Buena noches"
  }
}

