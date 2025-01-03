document.addEventListener('DOMContentLoaded', function() {
    const emailField = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const calculateButton = document.getElementById('calculate-button');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultText = document.getElementById('result');
    const countryDropdown = document.getElementById('country'); 
    const programRadio = document.getElementById('program');
    const diplomaDropdown = document.getElementById('diploma');
    const gradeDropdown = document.getElementById('grade');


    //income DOM elements
    const netIncome = document.getElementById('income');
    const netIncomeLabel = document.getElementById('income-radio-label');
    const incomeRadio = document.getElementById('income-radio');

    //Setting up initially enter jump option
    const handleEnterKeyS = (event) => {
        if (event.key === 'Enter') {
            primaryStartBtn.click();
        }
    };

    const primaryStartBtn = document.getElementById('primary-start-btn');
    document.addEventListener('keydown', handleEnterKeyS);


    const portalId = '27159977';
    const formGuid = '0c5ec7cb-9333-4519-8370-61f29eff2bc1';

    const hubspotEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    //Global card index for popstate()
    let currentCardIndex = 0;
    let defaultCardIndex = 0;
    history.replaceState({ cardIndex: defaultCardIndex }, `Card ${defaultCardIndex}`, `?card=${defaultCardIndex}`);





//UTILITY ARROW FUNCTIONS
//--- Page 5: input field should not be empty ------


//Efficiency for page transition --> letting go of enter key
    const handleEnterKeyR = (event) => {
        if (event.key === 'Enter') {
            incomeRadio.click();
        }
    };

//Page transition
function showPage(pageId) {

    if (pageId == 5) {
        document.addEventListener('keydown', handleEnterKeyR);
    } else {
        document.removeEventListener('keydown', handleEnterKeyR);
    }
    if (pageId == 0){
        document.addEventListener('keydown', handleEnterKeyS);
    }else {
        document.removeEventListener('keydown', handleEnterKeyS);
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active')); // Hide all pages
    document.getElementById(`question-${pageId}`).classList.add('active'); // Show the selected page
}

//OPTION LOADERS -----------------------------------------------------------------------------------------------------------------------
    //WORKING: Creating the dropdown list of countries
   function countries_loader() {
        let countries_array = ["Albania", "Algeria", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bangladesh", "Barbados", "Belarus", "Belgium", "Benin", "Bermuda", "Bhutan", "Bolivia", "Brazil", "Brunei", "Bulgaria", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cyprus", "Czech Republic", "Denmark", "East Timor", "Ecuador", "Egypt", "El Salvador", "Estonia", "Eswatini", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Kazakhstan", "Kenya", "Kyrgyzstan", "Laos", "Lebanon", "Lesotho", "Libya", "Lithuania", "Luxembourg", "Macao", "Malaysia", "Malta", "Mauritania", "Mexico", "Mongolia", "Montenegro", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nigeria", "Norway", "Pakistan", "Palau", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Suriname", "Sweden", "Switzerland", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turks and Caicos Islands", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan", "Vanuatu", "Vietnam", "Virgin Islands", "Zambia", "Zimbabwe"];

        const countryDropdown = document.getElementById("country");

            countries_array.forEach(element => {
                // Create an <option> element
                const countryItem = document.createElement("option");
                countryItem.value = element; // Set the value attribute
                countryItem.textContent = element; // Set the visible text

                // Append the option to the dropdown
                countryDropdown.appendChild(countryItem);
            });
    }
    countries_loader();

    //WORKING: Creating the dropdown list of possible high school diploma types 
    async function diploma_type_loader(){
        try {
            const response = await fetch('grade_potential.csv'); // Path to your program prices CSV
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
    
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(',')); // Parse CSV into rows
            const headers = rows[0]; // First row as headers
            const dataRows = rows.slice(1); // Remaining rows for data
        
            
            // Create an array out of the first items in each line to get the possible diploma types 
            const diplomas_array = [];

            dataRows.forEach(row => {
                diplomas_array.push(row[0]);

            });


            //Populate the diploma types dropdown
            diplomas_array.forEach(element => {
                const diplomaItem = document.createElement("option");
                diplomaItem.value = element; // Set the value attribute
                diplomaItem.textContent = element; // Set the visible text

                // Append the option to the dropdown
                diplomaDropdown.appendChild(diplomaItem);

            //Populate the average grade dropdown
             
                
            });


            
        } catch (error) {
            console.error('Error fetching or processing Grade Potential CSV:', error);
            return null;
        }

    }
    diploma_type_loader();
    
    //WORKING: Creating the dropdown list of possible high school diploma grades based on the selected program
    async function diploma_grade_options_loader(diplomaDropdownValue) {

        try {
            const response = await fetch('grade_potential.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching grade potential file:', response.statusText);
                return;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
            const headers = rows[0];
            const dataRows = rows.slice(1);

            const matchingRow = dataRows.find(row => row[0].trim() === diplomaDropdownValue);
            if (matchingRow) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = matchingRow[index]?.trim();
                });    
                if (rowData && typeof rowData === 'object') {
                    const gradeDropdown = document.getElementById('grade');
                    if (!gradeDropdown) {
                        console.error('The gradeDropdown div is missing!');
                        return;
                    }
    
                    gradeDropdown.innerHTML = ''; // Clear previous options
    
                    const values = Object.values(rowData).slice(1); // Exclude the first definition
                    const letters = ['a', 'b', 'c', 'd', 'e']; // Predefined letter sequence
                    let letterIndex = 0; // Counter for letters


                    values.forEach((element, index) => {
                        if (!element || element.trim() === "") return; // Skip empty values
    
                        // Create radio button
                        const radioWrapper = document.createElement("label");
                        radioWrapper.classList.add("option-label");
    
                        const radioButton = document.createElement("input");
                        radioButton.type = "radio";
                        radioButton.name = "grades";
                        radioButton.classList.add("grade-label", "option-button");
                        radioButton.value = letters[letterIndex];
                        letterIndex++;
    
                        // Add navigation attributes
                        radioButton.dataset.current = "4"; // Current question ID
                        radioButton.dataset.next = "5"; // Next question ID
    
                        // Set text
                        radioWrapper.textContent = element;
                        radioWrapper.prepend(radioButton);
    
                        // Append to dropdown
                        gradeDropdown.appendChild(radioWrapper);
                    });
    
                    // Append the static "Lower" option
                    const staticWrapper = document.createElement("label");
                    staticWrapper.classList.add("option-label");
    
                    const staticRadio = document.createElement("input");
                    staticRadio.type = "radio";
                    staticRadio.name = "grades";
                    staticRadio.classList.add("grade-label", "option-button");
                    staticRadio.value = "Lower";
    
                    // Add navigation attributes for "Lower"
                    staticRadio.dataset.current = "4";
                    staticRadio.dataset.next = "5";
    
                    staticWrapper.textContent = "Lower";
                    staticWrapper.prepend(staticRadio);
    
                    // Append the static option to the dropdown
                    gradeDropdown.appendChild(staticWrapper);
                }
            }
        } catch (error) {
            console.error('Error fetching or processing CSV:', error);
        }
    }
    

    

//FILE IMPUTS -----------------------------------------------------------------------------------------------------------------------------

    // WORKING: Function to fetch the country data csv - EU or not + Country factor
    async function fetchCountryData(selectedCountry) {
        try {
            const response = await fetch('country_data.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));    
            const headers = rows[0];
            const dataRows = rows.slice(1);
    
            const matchingRow = dataRows.find(row => row[0].trim() === selectedCountry);
            if (matchingRow) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = matchingRow[index].trim();
                });
                return rowData;
            } else {
                console.error('No matching country found for:', selectedCountry);
                return null;
            }
        } catch (error) {
            console.error('Error fetching or processing CSV:', error);
        }
    }
    // WORKING: Function to fetch the programme prices csv
    async function fetchProgramCost(selectedProgram, countryType) {
        try {
            const response = await fetch('program_prices.csv'); // Path to your program prices CSV
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
    
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim())); // Parse CSV into rows and trim spaces
            const headers = rows[0]; // First row as headers
            const dataRows = rows.slice(1); // Remaining rows for data
        
            // Find the row that matches the selected program
            const matchingRow = dataRows.find(row => row[0] === selectedProgram);
            if (!matchingRow) {
                console.error('No matching program found for:', selectedProgram);
                return null;
            }
    
            // Get the cost based on the country type
            const costIndex = headers.indexOf(countryType);
            if (costIndex === -1) {
                console.error('Invalid country type:', countryType);
                return null;
            }
    
            const cost = matchingRow[costIndex];
            return cost;
        } catch (error) {
            console.error('Error fetching or processing Program Pricing CSV:', error);
            return null;
        }
    }
    // WORKING: Function to fetch the academic factors csv
    async function fetchAcademicFactor(selectedGrade) {
        try {
            const response = await fetch('academic_factor.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
    
            const headers = rows[0];
            const dataRows = rows.slice(1);
            const gradeIndex = headers.indexOf(selectedGrade);
            if (gradeIndex === -1) {
                console.error('Invalid grade:', selectedGrade);
                return null;
            }
    
            const factor = dataRows[0][gradeIndex];
            return factor;
    
            
        } catch (error) {
            console.error('Error fetching or processing CSV:', error);
        }
    }

//BACKGROUND CALCULATION ------------------------------------------------------------------------------------------------------------------   
    function financialAidCalculator (academicFactor, programCost,countryFactor ) {

        const netIncomeReference = netIncome.value/ (countryFactor / 100);

        if(netIncomeReference < 30000 || netIncomeReference > 100000){
            return 0;
        }

        //TO-DO: Remove last two digits and make them 0s    
        let maxAid = academicFactor*programCost*((100000-netIncomeReference)/100000*1.05/100)*100;

        if (academicFactor == 1.3){
            maxAid += 2000;
        } 
        if (academicFactor == 1.1){
            maxAid += 1000;
        }

        return maxAid;

        

    }

    function loanSoftener(netIncome, programCost){
        let maxAid = 0;

        if (30000 < netIncome.value && netIncome.value < 70000) {
            maxAid = programCost * 0.75;
        }
        else if (70000 < netIncome.value && netIncome.value < 85000) {
            maxAid = programCost * 0.6;
        }
        else if (85000 < netIncome.value && netIncome.value < 100000) {
            maxAid = programCost * 0.3;
        }
        else {
            return 0;
        }
        

        return maxAid;

    }

//EVENT LISTENERS ------------------------------------------------------------------------------------------------------------------------
    //Helper for validating income input
    const isBtnUsable = () =>{
        if (netIncome.value){
            netIncomeLabel.style.pointerEvents = '';
            netIncomeLabel.style.opacity = '1';
            incomeRadio.disabled = false;
        } else {
            netIncomeLabel.style.pointerEvents = 'none';
            netIncomeLabel.style.opacity = '0.2';
            incomeRadio.disabled = true;
        }
    }
    
    //PAGE 5: Validating input
    netIncome.addEventListener(('input'), isBtnUsable);

    //WORKING: Calculate everything when the calculate button is clicked
    calculateButton.addEventListener('click', async function () {
        const selectedCountry = countryDropdown.value;
        const selectedProgram = programRadio.querySelector('input[name="question-1"]:checked').value;
        const selectedGrade = document.querySelector('input[name="grades"]:checked').value;
    
        if (!selectedCountry || selectedCountry === "Select your country") {
            alert('Please select a valid country.');
            return;
        }
    
        if (!selectedProgram || selectedProgram === "Select a program") {
            alert('Please select a valid program.');
            return;
        }

        if (!selectedGrade || selectedProgram === "Select a grade") {
            alert('Please select a valid grade.');
            return;
        }
        
        document.getElementById('question-6').classList.remove('active');
        loadingScreen.classList.add('active');
    
        const countryData = await fetchCountryData(selectedCountry);
        const countryType = countryData['EEA/SW/UK or Non'];
        const countryFactor = countryData['Country factor'];
        const programCost = await fetchProgramCost(selectedProgram, countryType);
        const academicFactor = await fetchAcademicFactor (selectedGrade);

        let maxAid;

        switch (countryDropdown.value){
            case "France": maxAid = loanSoftener(netIncome, programCost); break;
            case "Italy": maxAid = loanSoftener(netIncome, programCost); break;
            case "Sweden": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor) + 10000; break;
            case "Norway": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor) + 10000; break;
            case "Finland": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor) + 10000; break;
            case "United Kingdom": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor) + 5000; break;
            default: maxAid = financialAidCalculator(academicFactor, programCost, countryFactor); break;

        }


        if (maxAid > programCost){
            maxAid = programCost;
        }

        let minAid = maxAid;


        if(0 < maxAid <= 10000){
            minAid -= 2000;
        } else if (10000 < maxAid <= 15000){
            minAid -= 2500;
        } else if (15000 > maxAid) {
            minAid -= 3500;
        } else {
            minAid = 0;
        }

    

        // Prepare HubSpot payload
        const hubspotData = {
            fields: [
            { name: 'email', value: emailField.value },
            { name: 'forward_programmes', value: selectedProgram },
            { name: 'highschool_diploma_country', value: selectedCountry },
            { name: 'high_school_diploma_name', value:  diplomaDropdown.value},
            { name: 'average_grade_over_last_two_school', value: selectedGrade },
            { name: 'family_income', value: netIncome.value },
            { name: 'minimum_aid', value: minAid},
            { name: 'maximum_aid', value: maxAid}

            ]
        };
    
        // Send data to HubSpot
        fetch(hubspotEndpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(hubspotData)
        })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
            console.error('Error submitting data to HubSpot:', error);
        });

        setTimeout(function () {
            loadingScreen.classList.remove('active');
            if (programCost) {
                resultScreen.classList.add('active');

                if(minAid < 0 || maxAid < 0){
                    resultText.textContent = `You are not eligible for financial aid.`
                } else{ 
                    resultText.innerHTML = `Based on the information provided, it seems that you may be eligible to receive financial aid ranging between <b>€${Math.trunc (minAid/100)*100} and €${Math.trunc (maxAid/100)*100}</b>.  Please note that this is an estimate only, and we will need to review your full documentation to determine the exact amount of aid you are eligible for.`;
                } 

                
            } else {
                resultText.textContent = 'No data available for the selected program.';
            }
        }, 1500);
    }); 

    //WORKING: changing between different pages when the answer is selected
    document.addEventListener('change', function (event) {

        if (event.target && event.target.type === 'radio') {
            const currentQuestionId = event.target.dataset.current; // Current question ID
            const nextQuestionId = event.target.dataset.next; // Next question ID

            const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
            const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

            if (currentQuestionId == 6 ){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailField.value || !emailRegex.test(emailField.value) || emailError.textContent) {
                    alert('Please provide a valid email address.');
                    event.target.checked = false;
                    return;
                }  
            }

            showPage(nextQuestionId);
            currentCardIndex = nextQuestionId;
            history.pushState({ cardIndex: currentCardIndex }, `Card ${currentCardIndex}`, `?card=${currentCardIndex}`);

            if (currentQuestion) {
                currentQuestion.classList.remove('active');
            }

            if (nextQuestion) {
                nextQuestion.classList.add('active');
            } else {
                console.error(`Next Question not found: ${nextQuestionId}`);
            }
        }
    });

    countryDropdown.addEventListener('change', function (){
        const currentQuestionId = countryDropdown.closest('.page').id.split('-')[1]; // Az aktuális kérdés ID-je
        const nextQuestionId = parseInt(currentQuestionId) + 1; // Következő kérdés ID-je

        const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
        const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

        if (countryDropdown.value) { // Ellenőrizzük, hogy választottak-e valamit
            if (currentQuestion) {
                currentQuestion.classList.remove('active'); // Aktuális kérdés elrejtése
            }
            if (nextQuestion) {
                currentCardIndex = nextQuestionId;
                history.pushState({ cardIndex: currentCardIndex }, `Card ${currentCardIndex}`, `?card=${currentCardIndex}`);
                nextQuestion.classList.add('active'); // Következő kérdés megjelenítése
            }
        }
    });

    diplomaDropdown.addEventListener('change', function () {
        
        const currentQuestionId = diplomaDropdown.closest('.page').id.split('-')[1]; // Current question ID
        const nextQuestionId = parseInt(currentQuestionId) + 1; // Next question ID
        const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
        const nextQuestion = document.getElementById(`question-${nextQuestionId}`);
    
        if (diplomaDropdown.value) {
            if (currentQuestion) {
                currentQuestion.classList.remove('active'); // Hide current question
            }
            if (nextQuestion) {
                currentCardIndex = nextQuestionId;
                history.pushState({ cardIndex: currentCardIndex }, `Card ${currentCardIndex}`, `?card=${currentCardIndex}`);
                nextQuestion.classList.add('active'); // Show next question
            } else {
                console.error('Next Question not found:', nextQuestionId);
            }
        }
    
        diploma_grade_options_loader(diplomaDropdown.value); // Populate grades
    });

//WINDOW LISTENER --------------------------------------------------------------------------------------------------------------------------
//Handling going back with questions

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.cardIndex !== undefined && event.state.cardIndex !== 0 ) {
        currentCardIndex = (event.state.cardIndex);
        // Loop through the NodeList and uncheck each radio button
        document.querySelectorAll('input').forEach(radio => {
            radio.checked = false;
        });

        currentCardIndex = event.state.cardIndex;
        showPage(currentCardIndex);

    } else if (event.state.cardIndex == 0) {
        history.pushState(null, "", "?card=0");
        history.replaceState({ cardIndex: defaultCardIndex }, `Card ${defaultCardIndex}`, `?card=${defaultCardIndex}`);

        document.querySelectorAll('input').forEach(radio => {
            radio.checked = false;
        });

        showPage(defaultCardIndex);
    } else {
        console.error('Invalid history state detected:', event.state);
    }
});

//CLEANING UP AND LOADING UP
isBtnUsable();

});
