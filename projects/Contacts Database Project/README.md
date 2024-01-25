# Contacts Database Project
## Context and Description
This project is a web page used to store contacts in your browser local storage. I did this project to practice JSON format, interacting with local storage and dynamic tables. The features are:
* Input fields for entering contact details
* 'Add' button for adding the contact
* Dynamic table that displays the added contacts
* 'Hide' button for hiding table of contacts
* 'View' button for showing table of contacts
* 'Clear' button for deleting all contacts
* 'Save' button for saving changes to local storage
* 'Load' button for fetching saved contacts from local storage
* Clickable Table Heads for sorting contact list by different criteria (sort by first name, lastname, phone number... )
* 'Delete' icon for each contact
* 'Search' tab that updates results as you type
## How to run
* Ensure you have a modern web browser installed
* Open the index.html file in your web browser
* The project should now be visible in your browser
## Technologies used
* HTML
* CSS
* JavaScript
## Challenges faced during development
* Window click event listeners that were to be set up by a function were automatically triggered by the click that called the function due to click propagation
  * I had to either stop propagation or wrap the event listener in a timeout function to defer its creation to the next iteration in the JavaScript event loop, allowing any pending synchronous tasks like propagation or an updating UI to complete