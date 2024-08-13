import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
  id: `1`,
  deliveryDays: 7,
  priceCents: 0
},
{
  id: '2',
  deliveryDays: 3,
  priceCents: 499
},
{
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => { //find current deliveryOption in delivery options array
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption) {
  let deliveryDate = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;
  while (daysToAdd > 0) {
    deliveryDate = deliveryDate.add(1, 'days');
    console.log(deliveryDate);
    if ((deliveryDate.day() !== 0) && (deliveryDate.day() !== 6)) {
      daysToAdd--;
    }
  }
  
  return deliveryDate.format(
    'dddd, MMMM D'
  );
}