const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
  console.log(xhr.response);
});

xhr.open('GET', 'https://supersimplebackend.dev'); //parameters: (type of http request, where to send this HTTP msg)
/*
Notes

Types of HTTP (Hypertext Transfer Protocol) Requests:
- GET
- POST
- PUT
- DELETE

URL = Uniform Resource Locator
- Address for the internet
- Helps us locate another computer on the internet
- typing a URL sends a get request to the browser -> browser will then display the backend response on the page

Request-Response Cycle: Every request will get a response from the backend

Responses from the backend will always be sent with a status code 
- status code that starts with 4 or 5 (400, 404, 500) = failed
  - if it starts with 4 it was our problem
  - if it starts with 5 it was the backend problem (ex: crashed)
- status codes that start with 2 indicate a success

Backend API = list of all the url paths that are supported
- API = application programming interface
*/
xhr.send(); //sends the request
//xhr.response undefined b/c takes time for response to be received