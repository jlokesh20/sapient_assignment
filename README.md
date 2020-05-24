This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Instructions to run the application :
  # 1. Take clone of project
  # 2. run 'npm install' to install dependencies
  # 3. run 'npm start' to start the application
  # 4. run 'npm test' to run unit test cases


## API's used :
 # 'https://hn.algolia.com/api/v1/search?tags=front_page&page=0' is used to fetch news records on initial load
 #  'https://hn.algolia.com/api/v1/search?tags=front_page&page=0' is called when next button clicked in pagination ,each time next is cliked , page no. is increased


## External packages used :
 # 1. Bootstrap
 # 2. Recharts (to display charts)
 # 3. Axios (to make http calls)


## Features Covered :
 # 1. News details - news dat fetched from api is shown in bootstrap table
 # 2. Upvote - upvote count is increased when user clicks on upvote icon.
 # 3. Upvote preserved - the upvote count is preserved by storing upvotes in local storage, upvote will change if:
 #    1.) News data is changed
 #    2.) Upvote fetched from server is greater than stored in local storage for particular news row
 # 4. Hide - If user clicks on hide link , then that row gets idden from the view
 # 5. Pagination - Click on Next and Prev button will make new api calls by increasing/decreasing page no.s
 # 6. Chart - A line chart is displayed where X axis denotes id of news row and Y axis denotes no of upvtes
 #      Chart is updated real time if upvote value is changed by clicking on upvote link
 # 7. Responsive Design - Application can be viwed in both mobile and desktop screens
 #      *note -Please reload app while switching from desktop to mobile view.





