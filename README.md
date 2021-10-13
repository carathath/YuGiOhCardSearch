# **Yu-Gi-Oh Card Search**

**Used v7 of this [YuGiOh API](https://db.ygoprodeck.com/api-guide/)**

## **Overview**
This project lets you search for cards depending on their type, name and/or parameters available from the API

### **The card types are as follows:**
1. **Random** - uses the random card API call to receive ONE card
2. **Monster** - displays the different parameters that can be used for the search
   - Card Level
   - Monster Type
   - Monster Race
   - Monster Attribute
3. **Spell** - displays the Spell Type parameters (Ex. Equip, Field, etc.)
4. **Trap** - displays the Trap Type parameters (Ex. Normal, Continuous, Counter)

## **script.js Function Desciptions**

- **Onload**
  - Calls disableInput() to disable the Card Name textbox
  - Calls displayDiv() to hide the Monster/Spell/Trap card div as the default Card Type value is set to Random
  - Checks all the ANY value checkboxes in the Monster/Spell/Trap div
  - Calls disableCheckbox() since when the ANY checkbox is checked in a section, all other options are disabled
- **Button Section**
  - Pulled from [W3Schools](https://www.w3schools.com/howto/howto_js_scroll_to_top.asp)
  - Used as the structure for the back to top button
- **displayDiv()**
  - There are three main divs in the *index.html* file
    - Monster, Spell, Trap
  - When the user chooses the Card type of "Monster"
    - Monster div displays. Hides Spell/Trap div
    - Card Name syntax dropdown box remains enabled
  - When the user chooses the Card Type of "Spell"
    - Spell div displays. Hides Monster/Trap div
    - Card Name syntax dropdown box remains enabled
  - When the user chooses the Card Type of "Trap"
    - Trap div displays. Hides Monster/Spell div
    - Card Name syntax dropdown box remains enabled
  - When the user chooses the Card Type of "Random"
    - Monster/Spell/Trap div's get hidden as there are no search parameters needed
    - Both Card Name syntax dropdown box and input textbox get disabled
- **disableInput()**
  - When the Card Name syntax dropdown box is set to "Any", the input textbox becomes disabled as the search parameter will not include a name.
  - If the Card Name syntax dropdown box is "Exactly" or "Like," enable the input textbox.
- **disableCheckbox()**
  - The **place** variable keeps track of what section we are looking at in the *index.html* file by assigning the specific id to the variable **name**
  - When in the section chosen by **place**, if the "Any" checkbox is checked, disable all other checkbox options in that section. If a checkbox was checked, uncheck it first.
  - If the "Any" checkbox is not checked in the section chosen by **place**, enable all other checkboxes in that section
- **textCheck()**
  - When the user picks the Card Name syntax dropdown box to be "Exactly" or "Like", it checks to see that the input box is not empty or it checks to see that the name does no begin with special characters
  - A regular expression is used to check for the special characters
- **button_click()**
  - When the user clicks the "Search" button
  - Calls textCheck() to see if it returns a value of TRUE (an error in the Card Name input box)
  - Establishes the API's url in a variable. This will get the search parameters appended to it
  - First IF block sees what kind of name syntax we will be using for the API call
  - Then, we have the IF block where we form the rest of the API call depending on the Card Type chosen by the user
  - IF the Card Type is "Monster"
    - Append a Card Level to the API url if it is not a value of "Any"
    - Append the Monster Type value(s) to the API url if it is not a value of "Any"
    - Append the Monster Race value(s) to the API url if it is not a value of "Any"
    - Append the Monster Attribute value(s) to the API url if it is not a value of "Any"
  - IF the Card Type is "Spell"
    - Append the "type=Spell Card" to the API url as that is needed to specifically call for a Spell Card in the API url
    - Append the Spell Race value(s) to the API url if it is not a value of "Any"
  - IF the Card Type is "Trap"
    - Append the "type=Trap Card" to the API url as that is needed to specifically call for a Trap Card in the API url
    - Append the Trap Race value(s) to the API url if it is not a value of "Any"
  - IF the Card Type is "Random"
    - Change the API url to the random card API url available
  - Finally, we call the API attached with the search parameters and display the results
- **getName()**
  - This function is used to call the API using the card's ID, obtain the card name, then pass it along to specific_card()
  - Every card returned from the API call in button_click() has its ID attached to the getName() call
    - Ex. onClick="getName(ID#)"
    - In order to prevent any syntax errors, the ID is used for the function call instead of the card's name
  - Every card can have a different number of images attached to it. When the user clicks on their desired card, if it contains more than one image, it is displayed in a Bootstrap carousel
    - If it only contains one image then that image gets displayed
  - Calling the API using the card's ID, always returns ONE image, so to check for more, we have to call the API using the card's name
- **specific_card()**
  - Calls the API using the specific card's name from **getName()**
  - Here is where we assign all the values returned from the API call into their respective HTML elements
  - Displays all the information onto *card.html*

## **Error Prevention**
In order to minimize user errors, there are some steps that were taken:

**1.** If the user does not want to search for a card using its name, the "Any" option will disable the input textbox.
   - Even if the user had previously written a card name but then switched the option to "Any", the name found inside the disabled textbox will not be taken into account.

**2.** If the user decides to input a Card Name and leaves it blank OR inputs special characters at the beginning, they will be alerted.

**3.** Whenever the "Any" checkbox is checked in any section, the rest of the checkboxes in that section will be disabled.
   - If they were previously checked, they will be unchecked, then disabled.

**4.** If the user leaves all checkboxes in a section unchecked (including the "Any" checkbox), they will be alerted

**5.** For Card Type of "Monster" the user will need to change at least one search parameter in order to prevent a long load of all the monster cards availale in the API.
   - Same can be said for both Spell and Trap card(s) search
   - **Either one search parameter must be changed or the Card Name must be used (Ex. "Exactly" or "Like")**