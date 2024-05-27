import moment from "moment";

export function generateEvents() {
    const events = [];
    const backgroundColors = ['#5CAB7D', '#fb5607', '#ef233c'];
    const titles = ['Cleaning', 'Call with John', 'Work on project', 'Sprint planning meeting', 'Meeting'];
  
    for (let i = 0; i < 60; i++) {
      const backgroundColorIndex = i % backgroundColors.length;
      const titleIndex = i % titles.length;
      const start = moment().add(i % 30, 'days').add(i % 60, 'minutes').toDate();
      const end = moment(start).add(1, 'days').add(1, 'minutes').toDate();
      // const start = new Date(2024, 3, i % 30, i % 24, i % 60, 0, 0);
      // const end = new Date(2024, 3, i % 30, i % 24, i % 60, 0, 0);
      
      events.push({
        id: i,
        start: start,
        end: end,
        title: `${titles[titleIndex]} ${i}`,
        backgroundColor: backgroundColors[backgroundColorIndex],
      });
    }
  
    return events;
  }