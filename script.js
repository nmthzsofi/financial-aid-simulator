document.addEventListener('DOMContentLoaded', function() {


    // ---------------------------------- 
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultText = document.getElementById('result');

    // ---------------------------------- 
    const countryDropdown = document.getElementById('country'); 
    const programRadio = document.getElementById('program');
    const diplomaDropdown = document.getElementById('diploma');
    const gradeDropdown = document.getElementById('grade');


    //---------------------------------- income DOM elements
    const netIncome = document.getElementById('income');
    const netIncomeLabel = document.getElementById('income-radio-label');
    const incomeRadio = document.getElementById('income-radio');

    //---------------------------------- Lead form DOM elements
    const leadEmail = document.getElementById('lead-email');
    const leadFirstName = document.getElementById('lead-first-name');
    const leadLastName = document.getElementById('lead-last-name');
    const leadPhoneNumber = document.getElementById('lead-phone');
    const leadCountry = document.getElementById('lead-country');
    const leadProgram = document.getElementById('lead-program');
    const leadStartYear = document.getElementById('lead-start-year');
    const leadPrivacyPolicy = document.getElementById('lead-privacy');
    const leadPrivacyLabel = document.getElementById('lead-privacy-label')

    const emailError = document.getElementById('email-error');
    let gradeIndex;


    //---------------------------------- Buttons
    //Setting up initially enter jump option
    const handleEnterKeyS = (event) => {
        if (event.key === 'Enter') {
            primaryStartBtn.click();
        }
    };
    document.addEventListener('keydown', handleEnterKeyS);
    const primaryStartBtn = document.getElementById('primary-start-btn');

    const calculateButton = document.getElementById('calculate-button');
    const calculateBtnLabel = document.getElementById('calculate-label');
    

    // ----------------------------------
    const portalId = '27159977';
    const formGuid = '0c5ec7cb-9333-4519-8370-61f29eff2bc1';

    const hubspotEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    // ---------------------------------- Global card index for popstate()
    let currentCardIndex = 0;
    let defaultCardIndex = 0;
    history.replaceState({ cardIndex: defaultCardIndex }, `Card ${defaultCardIndex}`, `?card=${defaultCardIndex}`);





//UTILITY ARROW FUNCTIONS


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

            countries_array.forEach(element => {
                // Create an <option> element
                const countryItem = document.createElement("option");
                countryItem.value = element; // Set the value attribute
                countryItem.textContent = element; // Set the visible text

                // Append the option to the dropdown
                countryDropdown.appendChild(countryItem);

                const countryItem2 = document.createElement("option");
                countryItem2.value = element; // Set the value attribute
                countryItem2.textContent = element; // Set the visible text

                leadCountry.appendChild(countryItem2);
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

                console.log("rowData content: " + [rowData]);
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
            gradeIndex = headers.indexOf(selectedGrade); // 0-high 
            console.log("Grade Index: " + gradeIndex);
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
    function financialAidCalculator (academicFactor, programCost,countryFactor, studyCost ) {

        console.log("Net income loaded from the financialAidCalculator function" + netIncome);

        const netIncomeReference = (netIncome.value - studyCost) / (countryFactor/100);

        console.log("Net income reference loaded from the financialAidCalculator function" + netIncomeReference);

        if(netIncomeReference < 25000 || netIncomeReference > 75000){
            return 0;
        }

           
        let maxAid = academicFactor*programCost*((70000-netIncomeReference)/70000/100)*100;

        if (academicFactor == 1.3 && maxAid < 2000 && maxAid != 0){
            maxAid = 2000;
        } else if (academicFactor == 1.1 && maxAid < 1000 && maxAid != 0){
            maxAid = 1000;
        }

        //Removed based on Eric's feedback
        /*

        if (academicFactor == 1.3){
            maxAid += 2000;
        } 
        if (academicFactor == 1.1){
            maxAid += 1000;
        }
        */    

        return maxAid;   

    }

    function loanSoftener(netIncome, programCost){
        let maxAid = 0;

        if (20000 < netIncome.value && netIncome.value < 45000) {
            maxAid = programCost * 0.8;
        }
        else if (45000 < netIncome.value && netIncome.value < 65000) {
            maxAid = programCost * 0.5;
        }
        else if (65000 < netIncome.value && netIncome.value < 80000) {
            maxAid = programCost * 0.2;
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

    const isCalcUsable = () => {
        if (leadPrivacyPolicy.checked) {
            calculateBtnLabel.style.pointerEvents = '';
            calculateBtnLabel.style.opacity = '1';
            calculateButton.disabled = false; // Enable the radio button
        } else {
            calculateBtnLabel.style.pointerEvents = 'none';
            calculateBtnLabel.style.opacity = '0.2';
            calculateButton.disabled = true; // Disable the radio button
        }
    };

    const isValidEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailRegex.test(leadEmail.value)) {
            leadEmail.style.border = 'none';
        } else {
            leadEmail.style.border = '2px solid red';
            
        }
    }
    
    //-------------------------------------- Validating input
    netIncome.addEventListener(('input'), isBtnUsable);
    leadPrivacyPolicy.addEventListener(('change'), isCalcUsable);
    leadEmail.addEventListener('blur', isValidEmail); // Validate as the user types





    //Is al required filled out
    //WORKING: Calculate everything when the calculate button is clicked
    calculateButton.addEventListener('click', async function () {

        let valid = true; 
        let selectedCountry = countryDropdown.value;
        let selectedProgram = document.querySelector('input[name="question-1"]:checked').value;
        let selectedGrade = document.querySelector('input[name="grades"]:checked').value;
    
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

        if (!leadEmail.value || leadEmail.value === "") {
            //alert('Please enter a valid email.');
            leadEmail.style.border = "1px solid red";

            valid = false;
        }
        if (!leadFirstName.value || leadFirstName.value === "") {
            //alert('Please enter a valid email.');
            leadFirstName.style.border = "1px solid red";
            valid = false;
        }
        if (!leadLastName.value || leadLastName.value === "") {
            //alert('Please enter a valid email.');
            leadLastName.style.border = "1px solid red";
            valid = false;
        }
        if (leadCountry.value === "") {
            //alert('Please enter a valid email.');
            leadCountry.style.borderColor = "red";
            valid = false;
        }
        if (!leadProgram.value || leadProgram.value === "") {
            //alert('Please enter a valid email.');
            leadProgram.style.borderColor = "red";
            valid = false;
        }
        if (!leadStartYear.value || leadStartYear.value === "") {
            //alert('Please enter a valid email.');
            leadStartYear.style.borderColor = "red";
            valid = false;
        }
        /*
        if(!valid){
            return;
        }
        */    
        
        
        document.getElementById('question-6').classList.remove('active');
        loadingScreen.classList.add('active');
    
        const countryData = await fetchCountryData(selectedCountry);
        const countryType = countryData['EEA/SW/UK or Non']; 
        const countryFactor = countryData['Country factor'];
        const programCost = await fetchProgramCost(selectedProgram, countryType);
        const academicFactor = await fetchAcademicFactor (selectedGrade);
        let studyCost; 

        /*if (countryType == 'EEA/SW/UK'){
            //studyCost = 20000;
            studyCost = programCost * 0.8;
        }
        else */
        
        if ( countryFactor > 80){
            //studyCost = 20000;
            studyCost = programCost;
        }
        else {
            //studyCost = 30000;
            studyCost = programCost * 0.8;
        }

        /*

        console.log("Selected Country:" + selectedCountry);
        console.log("Selected Program:" + selectedProgram);
        console.log("Selected Grade:" + selectedGrade);
        console.log("Net Income:" + netIncome);
        console.log("Country Data:" + countryData);
        console.log("Country Type: " + countryType);
        console.log("Country Factor" + countryFactor);
        console.log("Program Cost" + programCost);
        console.log("Academic Factor" + academicFactor);
        */


        let maxAid;

        switch (countryDropdown.value){
            case "France": maxAid = loanSoftener(netIncome, programCost); break;
            case "Italy": maxAid = loanSoftener(netIncome, programCost); break;
            //minimum: 11000/12000
            case "Sweden": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor, studyCost) + 10000; break;
            /*case "Norway": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor) + 10000; break;*/
            case "Finland": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor, studyCost) + 10000; break;
            //minimum 6000/7000
            case "United Kingdom": maxAid = financialAidCalculator(academicFactor, programCost, countryFactor, studyCost) + 5000; break;
            //minimum 1000/2000
            default: maxAid = financialAidCalculator(academicFactor, programCost, countryFactor, studyCost); break;

        }

        if (selectedGrade == "Lower" || (gradeIndex == 4 && selectedProgram != "open-bachelor")){
            maxAid = 0;
        }

        if (maxAid > programCost){
            maxAid = programCost;
        }

        let minAid = maxAid;


        if (maxAid == 0){
            minAid = 0;
        } else if (0 < maxAid && maxAid <= 10000){
            minAid -= 2000;
        } else if (10000 < maxAid && maxAid <= 15000){
            minAid -= 2500;
        } else if (15000 > maxAid) {
            minAid -= 3500;
        } else {
            minAid = 0;
        }

        if (minAid < 0){
            minAid = 0;
        }

        console.log("Min aid after subtracting the appropriate amount:" + minAid);


    

        // Prepare HubSpot payload
        const hubspotData = {
            fields: [
            { name: 'email', value: leadEmail.value },
            { name: 'firstname', value: leadFirstName.value },
            { name: 'lastname', value: leadLastName.value },
            { name: 'country_of_residence___financial_aid_calculator', value: leadCountry.value },
            { name: 'phone_number___financial_aid_calculator', value: leadPhoneNumber.value },
            { name: 'start_year___financial_aid_calculator', value: leadStartYear.value },
            { name: 'program_of_interest___financial_aid_calculator', value: leadProgram.value },

            { name: 'forward_program_of_interest___financial_aid_calculator', value: selectedProgram },
            { name: 'high_school_diploma_country___financial_aid_calculator', value: selectedCountry },
            { name: 'high_school_diploma_name___financial_aid_calculator', value:  diplomaDropdown.value},
            { name: 'average_grade___financial_aid_calculator', value: selectedGrade },
            { name: 'family_income', value: netIncome.value },
            { name: 'minimum_aid', value: minAid},
            { name: 'maximum_aid', value: maxAid}

            ]
        };
        console.log(hubspotData);
    
        
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

                if(maxAid <= 0){
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

        if (event.target && event.target.type === 'radio' && event.target.id !== 'calculate-button') {
            const currentQuestionId = event.target.dataset.current; // Current question ID
            const nextQuestionId = event.target.dataset.next; // Next question ID

            const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
            const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

            if (currentQuestionId == 6 ){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!leadEmail.value || !emailRegex.test(leadEmail.value) || emailError.textContent) {
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
isCalcUsable();

});
