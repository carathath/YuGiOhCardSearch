window.onload = function(){
    disableInput(); // Disable input textbox
    displayDiv(); // Hide Monster/Spell/Trap card div on page load

    document.getElementById("mons-type-0").checked = true // Check the ANY Monster Type checkbox
    document.getElementById("mons-race-0").checked = true // Check the ANY Monster Race checkbox
    document.getElementById("mons-attr-0").checked = true // Check the ANY Monster Attribute checkbox
    document.getElementById("spell-race-0").checked = true // Check the ANY Spell Race checkbox
    document.getElementById("trap-race-0").checked = true // Check the ANY Trap Race checkbox

    // Called to disable all other checkboxes as ANY is default on page load
    for(var d = 1; d <= 5; d++){
        disableCheckbox(d);
    }
}

////////////// https://www.w3schools.com/howto/howto_js_scroll_to_top.asp ////////////////
//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
///////////////////////////////////////////////////////////////////////////////

// Depending card choice, a certain div is displayed
function displayDiv(){
    var card_type = document.getElementById("card-type") // Tracks type of card chosen (Random as default)
    var mons_div = document.getElementById("monster-div") // Tracks the Monster card siv
    var spell_div = document.getElementById("spell-div") // Tracks the Spell card div
    var trap_div = document.getElementById("trap-div") // Tracks the Trap card div

    console.log(card_type.value) // Display value of chosen card type

    if(card_type.value == "monster"){ // Only display Monster Card div
        mons_div.style.display = "block"
        spell_div.style.display = "none"
        trap_div.style.display = "none"
        document.getElementById("card-name-syntax").value = "any"
        document.getElementById("card-name-syntax").disabled = false
    } else if(card_type.value == "spell"){ // Only display Spell Card div
        spell_div.style.display = "block"
        mons_div.style.display = "none"
        trap_div.style.display = "none"
        document.getElementById("card-name-syntax").value = "any"
        document.getElementById("card-name-syntax").disabled = false
    } else if(card_type.value == "trap"){ // Onlu display Trap Card div
        trap_div.style.display = "block"
        mons_div.style.display = "none"
        spell_div.style.display = "none"
        document.getElementById("card-name-syntax").value = "any"
        document.getElementById("card-name-syntax").disabled = false
    } else if(card_type.value == "random"){ // Do not display any div's as card choice will be random
        mons_div.style.display = "none"
        spell_div.style.display = "none"
        trap_div.style.display = "none"
        document.getElementById("card-name-syntax").value = "any"
        document.getElementById("card-name-syntax").disabled = true
        document.getElementById("card-name").disabled = true
    }
}

// Depending on card name search option
function disableInput(){
    if(document.getElementById("card-name-syntax").value == "any"){ // If ANY name
        document.getElementById("card-name").disabled = true // Disable the input textbox
    } else{
        document.getElementById("card-name").disabled = false // Else, make it available
    }
}

// Used to disable checkbox options in case ANY is clicked
function disableCheckbox(place){
    console.log(place) // What specific part of the div are we looking at
    var name = "x" // Placeholder for id of the HTML elements to be disabled
    var min = 1 // All checkbox id values begin at 1
    var max = 10 // Max value changes depending on the amount of options available in the specific option spot

    if(place == '1'){
        name = "mons-type-" // HTML id's begins with this value
        max = 24 // Total options available
    } else if(place == '2'){
        name = "mons-race-" // HTML id's begins with this value
        max = 23 // Total options available
    } else if(place == '3'){
        name = "mons-attr-" // HTML id's begins with this value
        max = 7 // Total options available
    } else if(place == '4'){
        name = "spell-race-" // HTML id's begins with this value
        max = 6 // Total options available
    } else if(place == "5"){
        name = "trap-race-" // HTML id's begins with this value
        max = 3 // Total options available
    }

    // For the specific id name chosen
    if(document.getElementById(name + "0").checked == true){ // If the ANY checkbox value is checked
        for(var x = min; x <= max; x++){ // For all options available
            if(document.getElementById(name + x.toString()).checked){ // If the checkbox is checked
                document.getElementById(name + x.toString()).checked = false // Uncheck it
            }
            document.getElementById(name + x.toString()).disabled = true // Disable it
        }
    } else if(document.getElementById(name + "0").checked == false){ // If ANY is not checked
        for(var x = min; x <= max; x++){ // For all options available
            document.getElementById(name + x.toString()).disabled = false // Enable the checkbox
        }
    }
}

// Checks user card name input
function textCheck(){
    var textSyntax = document.getElementById("card-name-syntax").value // Gets value of input type (Exactly or Like)
    var text = document.getElementById('card-name').value.toString() // Gets card name input value
    let reg = new RegExp('^((\\s)|(\\W)|[_])') // Card name can't start with whitespace, special characters or underscore
    
    if((textSyntax != "any") && text == ''){ // If input is empty
        alert("Card Name cannot be left blank") // Alert
        return true;
    } else if((textSyntax != "any") && reg.test(text)){ // If input matches the regular expression
        alert("Card Name cannot begin with whitespace, special characters or underline") // Alert
        return true;
    }
}

var card = "f" // Value used to keep Spell/Trap/Skill cards out of Monster card search

function button_click(){ // When the user clicks the "Search" button

    if(textCheck()){ // If a flaw in the card name input is found, leave this entire function
        return;
    }

    var api_url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php' // API url
    var show = '' // Used to form the HTML elements to be displayed
    var firstattribute = 0 // Used to check if there is already a search parameter. If true, add an '&' to the API url
    var randCard = 0 // If user selects a random card, the API url changes
    var anycount = 0 // Will keep track if all search parameters are left as any
    var nameUsed = 0 // Will be used for Spell/Trap parameters
    
    if(document.getElementById("card-name-syntax").value == "exact"){ // If EXACT card name
        // Append the syntax for exact name and add the card name value
        api_url += "?name=" + document.getElementById("card-name").value
        firstattribute = 1 // First attribute becomes true
        nameUsed = 1 // Card Name has been used
    } else if(document.getElementById("card-name-syntax").value == "like"){ // If LIKE card name
        // Append the syntax for like name and add the card name value
        api_url += "?fname=" + document.getElementById("card-name").value
        firstattribute = 1 // First attribute becomes true
        nameUsed = 1 // Card Name has been used
    } else if(document.getElementById("card-name-syntax").value == "any"){ // If ANY
        api_url += "?" // Prepare the API url for possible extra search parameters
        firstattribute = 0
    }

    if (document.getElementById("card-type").value == "monster"){ // If Card Type is Monster
        console.log("Monster card")
        card = "mon" // Changes value of global variable

        if(document.getElementById("monster-lvl").value!="0"){ // If the ANY option is not selected
            var mons = document.getElementById("monster-lvl").value // Get the monster level
            if(firstattribute==1){ // If Card Name has already been added to the search parameter
                api_url+= "&" + mons // Add an '&' to chain to the API url
            }else if(firstattribute == 0){ // Else if there are no previous parameters
                api_url += mons // This becomes the first search parameter
                firstattribute = 1 // First attribute becomes true
            }
        } else{ anycount++ }

        if(!document.getElementById("mons-type-0").checked){ // If the ANY option is not selected
            var settype = 0; // Checks if more than one checkbox in this section has been checked
            var typeIndex = "mons-type-" // HTML id's in this section begin with this string
            var typeUse = "x" // Used as the string combining the typeIndex and id number
            var type_url = "" // Used to combine all the checkbox values selected in this section. Gets appended to the API url
            var checked = false // Checks if the specific checkbox has been checked

            for(var i = 1; i < 24; i++){ // For all the checkboxes in this section
                // Append the number of the checkbox we are looking at (Ex. "mons-type-1")
                typeUse = typeIndex + i.toString()

                // If it is the first checkbox in this section to be checked
                if(document.getElementById(typeUse).checked && settype==0){
                    type_url += document.getElementById(typeUse).value; // Append it to the type_url string
                    settype = 1; // First checkbox in this section
                    checked = true // Some checkbox has been checked in this section
                } else if(document.getElementById(typeUse).checked){ // If another checked checkbox
                    type_url += "," + document.getElementById(typeUse).value; // Add a ',' to chain it for API url use
                }
            }

            if(checked == false && settype == 0){ // If the ANY and every other checkbox is unchecked
                alert("Monster Type is empty") // Alert
                return;
            }

            if(firstattribute == 1 && checked == true){ // If it is not the first search parameter
                api_url += "&type=" + type_url // Chain it with that is already part of the API url
            } else if(firstattribute == 0 && checked == true){ // If this IS the first attribute in the API url
                api_url += "type=" + type_url // Append it straight onto the API url
                firstattribute = 1 // Becomes the first attribute
            }
        } else{ anycount++ }

        if(!document.getElementById("mons-race-0").checked){ // If the ANY option is not selected
            var setrace = 0; // Checks if a race checkbox has been checked
            var raceIndex = "mons-race-" // HTML id's in this section begin with this string
            var raceUse = "x" // Used as the string combining raceIndex and id number
            var race_url = "" // String of all race values
            var checked = false // Checks if any values were checked

            for(var i = 1; i < 24; i++){ // For all possible options in this section
                raceUse = raceIndex + i.toString() // Create the HTML id string

                if(document.getElementById(raceUse).checked && setrace==0){ // Encounter the first checked checkbox
                    race_url += document.getElementById(raceUse).value; // Append it to the race string
                    setrace = 1; // A race has been chosen
                    checked = true // A checkbox in this section has been chosen
                } else if(document.getElementById(raceUse).checked){ // If more than one race has been seelected
                    // Append it with a ',' to the race string
                    race_url += "," + document.getElementById(raceUse).value;
                }
            }

            if(checked == false && setrace == 0){ // If no checkboxes have been checked in this section
                alert("Monster Race is empty") // Alert
                return;
            }

            if(firstattribute == 1 && checked == true){ // If it is not the first attribute in the search parameters
                api_url += "&race=" + race_url // Use the proper API syntax to add on
            } else if(firstattribute == 0 && checked == true){ // If it is the first search parameter
                api_url += "race=" + race_url // Use the proper API syntax to search for
                firstattribute = 1 // First attribute has been set
            }
        } else{ anycount++ }

        if(!document.getElementById("mons-attr-0").checked){ // If the ANY checkbox is not checked
            var setattr = 0; // Checks if more than one attribute was checked
            var attrIndex = "mons-attr-" // HTML id's in this section begin with this string
            var attrUse = "x" // Used to append the id string to the id number
            var attr_url = "" // Will take the value of all attributes selected
            var checked = false // Checks if an attribute checkbox has been selected

            for(var i = 1; i < 8; i++){ // For all options in this section
                attrUse = attrIndex + i.toString() // Create the id string

                // If it is the first checked attribute checkbox
                if(document.getElementById(attrUse).checked && setattr==0){
                    attr_url += document.getElementById(attrUse).value; // Append to attribute string
                    setattr = 1; // An attribute value has been selected
                    checked = true // An attribute checkbox has been checkedd
                } else if(document.getElementById(attrUse).checked){ // If more than one attribute selected
                    // Add on to the attribute string
                    attr_url += "," + document.getElementById(attrUse).value;
                }
            }

            if(checked == false && setattr == 0){ // If no checkboxes in this section have been checked
                alert("Monster Attribute is empty") // Alert
                return;
            }

            if(firstattribute == 1 && checked == true){ // If it is not the first search parameter
                api_url += "&attribute=" + attr_url // Append to the API url using proper syntax
            } else if(firstattribute == 0 && checked == true){ // If it is the first search parameter
                api_url += "attribute=" + attr_url // Append to the API url using proper syntax
                firstattribute = 1 // First attribute becomes set
            }
        } else{ anycount++ }

        if(anycount == 4 && firstattribute == 0){
            alert("At least one search parameter must be changed to prevent overload OR Card Name must be used");
            return;
        }

    } else if(document.getElementById("card-type").value == "spell"){ // If user chooses Spell Card type
        card = "f" // Global variable keeps its original value
        console.log("Spell card")
        if(firstattribute == 1){ // If the user has inputed a Card Name
            api_url += "&type=Spell Card" // Will let the API know we are searching for s Spell Card
        } else{ // If no Card Name has been given
            firstattribute = 1 // First attribute is set
            api_url += "type=Spell Card" // Append to the API url
        }
        

        if(!document.getElementById("spell-race-0").checked){ // If the ANY checkbox is not checkesd
            var setspell = 0 // Checks if a Spell card race has been selected
            var spellIndex = "spell-race-" // HTML id's in this section begin with this string
            var spellUse = "x" // Used to attach the spellIndex to id number
            var spell_url = "" // All the Spell races get appended to this string
            var checked = false // Checks if any Spell races were selected

            for(var i = 1; i < 7; i++){ // For all options available
                spellUse = spellIndex + i.toString() // Create the id string

                // First Spell race checkbox checked
                if(document.getElementById(spellUse).checked && setspell==0){
                    spell_url += document.getElementById(spellUse).value; // Append to Spell race string
                    setspell = 1; // A Spell race has been selected
                    checked = true // A checkbox in this section has been selected
                } else if(document.getElementById(spellUse).checked){ // If more than one Spell race
                    spell_url += "," + document.getElementById(spellUse).value; // Add on to Spell string
                }
            }

            if(checked == false && setspell == 0){ // If nothing has been checked in this section
                alert("Spell Type is empty") // Alert
                return;
            }

            if(firstattribute == 1 && checked == true){ // Add on a race
                api_url += "&race=" + spell_url // Append to the API url
            }
        }else{ anycount++ }

        if(anycount == 1 && nameUsed == 0){
            alert("At least one Spell Type checkbox must be used to prevent overload OR Card Name must be used")
            return;
        }

    } else if(document.getElementById("card-type").value == "trap"){
        card = "f" // Keep global variable as a non-monster card
        console.log("Trap Card")

        if(firstattribute == 1){ // If Card Name has been used
            api_url += "&type=Trap Card" // Append to the API url
        } else{
            firstattribute = 1 // This becomes the first search parameter
            api_url += "type=Trap Card" // Append to the API url
        }
        
        // If the user selects a Trap Card race type that is not ANY
        if(!document.getElementById("trap-race-0").checked){
            var settrap = 0 // Checks that a Trap race has been selected
            var trapIndex = "trap-race-" // HTML id's in this section begin with this string
            var trapUse = "x" // Used to combine the trapIndex string with an id number
            var trap_url = "" // All Trap raaces get appended on this string
            var checked = false // Checks to see if any Trap Race checkbox has been selected

            for(var i = 1; i < 4; i++){ // For all options available
                trapUse = trapIndex + i.toString() // Create the HTML id string

                // If you encounter the first checked checkbox
                if(document.getElementById(trapUse).checked && settrap==0){
                    trap_url += document.getElementById(trapUse).value; // Append to trap_url
                    settrap = 1; // A Trap Card race has been selected
                    checked = true // Something has been checked in this section
                } else if(document.getElementById(trapUse).checked){ // If more than one race
                    trap_url += "," + document.getElementById(trapUse).value;
                }
            }

            if(checked == false && settrap == 0){ // If nothing is checked in this section
                alert("Trap Type is empty") // Alert
                return;
            }

            if(firstattribute == 1 && checked == true){ // Append to API url the type(s) of Trap races
                api_url += "&race=" + trap_url
            }
        }else{ anycount++ }

        if(anycount == 1 && nameUsed == 0){
            alert("At least one Trap Type checkbox must be used to prevent overload OR Card Name must be used")
            return;
        }

    } else if(document.getElementById("card-type").value == "random"){ // If user wants a random card
        api_url = 'https://db.ygoprodeck.com/api/v7/randomcard.php' // Route to random card API url
        randCard = 1 // Random card flag
    }

    console.log(api_url) // Console log the API call
    
    fetch(api_url) // Call the API url
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            // Reset screen whenever the user searches
            document.getElementById("card-display").innerHTML = "";
            console.log(data); // Console log the returned cards

            if(randCard == 0){ // If not a random card
                for(let x of data.data){ // For all the data in the response
                    // If it is a Monster Card search, get rid of all Trap/Spell/Skill cards returned
                    if((x.type == "Spell Card" || x.type == "Trap Card" || x.type == "Skill Card") && card == "mon"){
                        console.log("Spell/Trap/or Skill found in Monster search");
                    }else{ // Display normally
                        // Form the HTML element
                        show = '<div class="col animate__animated animate__slideInUp cardcol" onClick="getName(\'' + x.id + '\')"><img src="' + x.card_images[0].image_url + '" class="cardimg cardcol" alt="card image"></div>';
                        document.getElementById("card-display").innerHTML += show; // Add it to the display section on the HTML page
                    }             
                }
            } else if(randCard == 1){ // If user chose a random card
                console.log(data.type) // Check type of card returned

                // If it is a Spell/Trap, keep global variable as "f" for individual display purposes
                if(data.type.toString() == "Spell Card" || data.type.toString() == "Trap Card"){
                    card = "f"
                } else { // The card type becomes Monster for individual display purpose
                    card = "mon"
                }
                // Form the HTML element
                show = '<div class="col animate__animated animate__slideInUp" onClick="getName(\'' + data.id + '\')"><img src="' + data.card_images[0].image_url + '" class="cardimg cardcol" alt="card image"></div>';
                document.getElementById("card-display").innerHTML += show;
            }
        })
        .catch((err) => { // In case of an error or not cards found
            console.log(err)
            alert("No cards match the current search option(s)") // Alert
            return;
        })
}

// Since each card can have a different number of pictures attached to its response,
// when the user clicks on a card for more information, the API is called using the cards ID.
// Searching with ID on the API only returns one picture per card. This function getName is used to get the name
// of the card in order to call the API again using the "name=" parameter. Using "name=", depending
// on the card, returns either one or more pictures for each individual card. This lets the individual
// card page display all the images received involving a specific card
function getName(cardID){
    var cardid_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + cardID; // API url using card ID

    fetch(cardid_url) // Call the API
        .then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data) // Console log the response
            for(let n of data.data){
                specific_card(n.name) // Call the function that will display the individual card info
            }
        }).catch((err) => {
            console.log("ID error")
            console.log(err)
            return;
        })
}

// Used to display information regarding the specific card the user chose
function specific_card(cardname){
    var cardAtt = "attr" // Used for Monster Card attribute
    var cardLvl = "lvl" // Used for Monster Card card level
    var cardScale = "scale" // Used for Pendulum Monster Card scale
    var cardRace = "race" // Used for Monster Card race
    var cardType = "type" // Used for Monster Card type
    var cardAtk = "atk" // Used for Monster Card attack point
    var cardDef = "def" // Used for Monster Card defense points
    const page = window.open('card.html') // Open the individual card page

    page.addEventListener('DOMContentLoaded', () => {
        const pageName = page.document.getElementById('specific-card-name') // Gets assigned card name HTML element
        const pageDesc = page.document.getElementById('specific-card-desc') // Gets assigned card description HTML element
        const pageImg = page.document.getElementById('specific-card-image') // Gets assigned card image HTML element
        const pageCarsl = page.document.getElementById('carimages') // If more than one picture received, an image carousel is used
        const pageCardInfo = page.document.getElementById('cardinfo')

        var name = "" // Used for card's name
        var card_image = "" // Used for individual card image
        var card_desc = "card_desc" // Used for card description HTML string
        var card_carsl = "" // Used to form image carousel HTML string
        var singleCard_url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + cardname.toString() // API call
        page.console.log(singleCard_url)

        fetch(singleCard_url) // Call API
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                for(let s of data.data){
                    // Sees amount of images returned. Determines if we need only one picture or a carousel
                    var img_size = s.card_images.length
                    page.console.log(s)

                    name = '<h1 class="cardname">' + s.name + '</h1>' // Form card name HTML element
                    pageName.innerHTML = name // Display the card name in its designated div

                    if(img_size == 1){ // If only one card image returned
                        card_image += '<img src="' + s.card_images[0].image_url + '" class="idvimg">' // Display individual image
                        page.document.getElementById("carousel-div").style.display = "none"; // Hide the carousel div
                        pageImg.innerHTML = card_image // Apply the card image HTML element into its designated div
                    } else{
                        for(var l = 0; l < img_size; l++){ // If more than one image
                            if(l == 0){ 
                                // Form the carousel HTML element and make it active in order to trigger the Bootstrap carousel
                                card_carsl += '<div class="carousel-item active"><img src="' + s.card_images[l].image_url + '" class="d-block carouselimg"></div>'
                            } else { // Keep adding on the rest of the pictures into the carousel
                                card_carsl += '<div class="carousel-item"><img src="' + s.card_images[l].image_url + '" class="d-block carouselimg"></div>'
                            }
                        }
                        // Insert the carousel HTML elements into its designated div
                        pageCarsl.innerHTML = card_carsl
                    }

                    if(card == "mon"){ // Monster cards receive a card information display. Here we form the HTML elements
                        cardAtt = '<div class="col"><p class="checkbox-label"><b class="card-label">Attribute:</b> ' + s.attribute + '</p></div>'
                        cardLvl = '<div class="col"><p class="checkbox-label"><b class="card-label">Level:</b> ' + s.level + '</p></div>'
                        cardRace = '<div class="col"><p class="checkbox-label"><b class="card-label">Race:</b> ' + s.race + '</p></div>'
                        cardType = '<div class="col"><p class="checkbox-label"><b class="card-label">Type:</b> ' + s.type + '</p></div>'
                        cardAtk = '<div class="col"><p class="checkbox-label"><b class="card-label">ATK:</b> ' + s.atk + '</p></div>'
                        cardDef = '<div class="col"><p class="checkbox-label"><b class="card-label">DEF:</b> ' + s.def + '</p></div>'
                    } else{
                        pageCardInfo.style.display = "none" // Spell and Trap cards do not need this, so this div gets hidden
                    }
                    
                    if(s.type.includes("Link")){ // If a Link Monster, "Level" becomes "Link"
                        cardLvl = '<div class="col"><p class="checkbox-label"><b class="card-label">Link:</b> ' + s.linkval + '</p></div>'
                        pageCardInfo.innerHTML = cardAtt + cardLvl + cardRace + cardType + cardAtk
                    } else if(s.type.includes("Pendulum")){ // If a Pendulum Monster, "Level" becomes "Scale"
                        cardScale = '<div class="col"><p class="checkbox-label"><b class="card-label">Scale:</b> ' + s.scale + '</p></div>'
                        pageCardInfo.innerHTML = cardAtt + cardLvl + cardScale + cardRace + cardType + cardAtk + cardDef
                    } else{
                        pageCardInfo.innerHTML = cardAtt + cardLvl + cardRace + cardType + cardAtk + cardDef
                    }
                    
                    card_desc = '<pre class="carddescription">' + s.desc + '</pre>' // Form HTML element for card description
                    pageDesc.innerHTML = card_desc
                }
            })
            .catch((err) => {
                page.console.log(err)
            })
    })
}