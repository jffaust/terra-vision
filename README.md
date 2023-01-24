# Terra Vision

![demo](./docs/demo.gif)

Terra Vision is a web application that provides insights about the Earth in the form of simulations, charts, maps, etc. The initial drive behind the project was to facilitate the application of permaculture based on the idea that the better we understand our world and its complexity, the better we can live in harmony with it and live a more sustainable life. 

The current focus of the project is on insights about the Sun. It is a good opportunity to lay out the fondation of the project. We have the large scale simulation of the Earth and the Sun in space, where we can better understand how the tilt of the Earth causes seasons and why in some cases the Sun never rises or never sets for long periods of time. We also have the small scale simulation of how the Sun moves through the sky from the perspective of a specicic position on the surface of the Earth, enabling us to simulate shadows and design more energy-efficient homes and agriculture. The application uses the great [Astronomy Engine](https://github.com/cosinekitty/astronomy) library to get the positions of the Sun and the Earth at different times along with orientation data and more.

In the future, it would be interesting to include elevation data, climate data and other relevant information but these will rely on external providers (read: paid services or services with free quotas).

This software is still very experimental so things might change or break.

## Query Parameters

Some pages of the app use query parameters in the URL to be able to configure the parameters of the visualizations. 

*Main page (/)*

- GPS: ?lat=45.5114752&lon=-73.4363648
- Datetime: ?date=2022-11-05T16:14:25Z
- Datetime with timezone offset: ?date=2022-11-05T16:14-05:00


### Known Dates

https://www.timeanddate.com/calendar/autumnal-equinox.html

- September Equinox 2022: ?date=2022-09-23T01:03Z
- December Solstice 2022: ?date=2022-12-21T21:48Z
- March Equinox 2023: ?date=2023-03-20T21:24Z
- June Solstice 2023: ?date=2023-06-21T14:57Z
