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
    const netIncome = document.getElementById('income'); 

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
            //console.log('Fetching Grade Potential CSV...');
            const response = await fetch('grade_potential.csv'); // Path to your program prices CSV
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
    
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(',')); // Parse CSV into rows
            const headers = rows[0]; // First row as headers
            const dataRows = rows.slice(1); // Remaining rows for data
    
            //console.log('Grade Potential Data:', dataRows);
    
            
            // Create an array out of the first items in each line to get the possible diploma types 
            const diplomas_array = [];

            dataRows.forEach(row => {
                diplomas_array.push(row[0]);

            });

            //console.log('Possible high school types: ', diplomas_array);

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
            console.log('Fetching Grade Potential CSV...');
            const response = await fetch('grade_potential.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching grade potential file:', response.statusText);
                return;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
            console.log('Grade Potential CSV Content:', rows);
    
            const headers = rows[0];
            const dataRows = rows.slice(1);
    
            const matchingRow = dataRows.find(row => row[0].trim() === diplomaDropdownValue);
            if (matchingRow) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = matchingRow[index]?.trim();
                });
                console.log('Matching Row Data:', rowData);
    
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
            console.log('Fetching CSV...');
            const response = await fetch('country_data.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
            console.log('CSV Content:', rows);
    
            const headers = rows[0];
            const dataRows = rows.slice(1);
    
            const matchingRow = dataRows.find(row => row[0].trim() === selectedCountry);
            if (matchingRow) {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header.trim()] = matchingRow[index].trim();
                });
                //console.log('Matching Row Data:', rowData);
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
            console.log('Fetching Program Pricing CSV...');
            const response = await fetch('program_prices.csv'); // Path to your program prices CSV
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
    
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim())); // Parse CSV into rows and trim spaces
            const headers = rows[0]; // First row as headers
            const dataRows = rows.slice(1); // Remaining rows for data
    
            console.log('Program Pricing Data:', dataRows);
    
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
            console.log(`Cost for ${selectedProgram} in ${countryType}: ${cost}`);
            return cost;
        } catch (error) {
            console.error('Error fetching or processing Program Pricing CSV:', error);
            return null;
        }
    }
    // WORKING: Function to fetch the academic factors csv
    async function fetchAcademicFactor(selectedGrade) {
        try {
            console.log('Fetching CSV...');
            const response = await fetch('academic_factor.csv'); // Check if this path works
            if (!response.ok) {
                console.error('Error fetching file:', response.statusText);
                return null;
            }
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
            console.log('CSV Content:', rows);
    
            const headers = rows[0];
            const dataRows = rows.slice(1);

            console.log(dataRows);

            const gradeIndex = headers.indexOf(selectedGrade);
            if (gradeIndex === -1) {
                console.error('Invalid grade:', selectedGrade);
                return null;
            }
    
            const factor = dataRows[0][gradeIndex];
            console.log(`The selected grade is ${selectedGrade} and its index is ${gradeIndex} and its multiplier is ${factor}`);
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
        console.log(maxAid);

        if (academicFactor == 1.3){
            maxAid += 2000;
        } 
        if (academicFactor == 1.1){
            maxAid += 1000;
        }

        console.log(maxAid);
        return maxAid;

        

    }

//EVENT LISTENERS ------------------------------------------------------------------------------------------------------------------------

    //Working?? Calculate everything when the calculate button is clicked
    calculateButton.addEventListener('click', async function () {
        const selectedCountry = countryDropdown.value;
        const selectedProgram = programRadio.querySelector('input[name="question-1"]:checked').value;
        const selectedGrade = document.querySelector('input[name="grades"]:checked').value;

        /*
    
        if (!emailField.value || emailError.textContent) {
            alert('Please provide a valid email address.');
            return;
        }
        
        */
    
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
        
        document.getElementById('question-5').style.display = 'none';
        loadingScreen.style.display = 'block';
    
        const countryData = await fetchCountryData(selectedCountry);
        const countryType = countryData['EEA/SW/UK or Non'];
        const countryFactor = countryData['Country factor'];
        const programCost = await fetchProgramCost(selectedProgram, countryType);
        const academicFactor = await fetchAcademicFactor (selectedGrade);

        console.log('The selected country type: ', countryType);
        console.log('The selected country factor: ', countryFactor);
        console.log('The selected program cost: ', programCost);
        console.log('The academic factor: ', academicFactor);

        let maxAid;

        switch (countryDropdown.value){
            case "France": return 0;
            case "Italy": return 0;
            case "Sweden": return 0;
            case "Norway": return 0;
            case "Finland": return 0;
            case "United Kingdom": return 0;
            default: maxAid = financialAidCalculator(academicFactor, programCost, countryFactor); break;

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

    
        setTimeout(function () {
            loadingScreen.style.display = 'none';
            if (programCost) {
                resultScreen.style.display = 'block';

                if(minAid < 0 || maxAid < 0){
                    resultText.textContent = `You are not eligible for financial aid.`
                } else{ 
                    resultText.textContent = `The expected financial aid you can receive: €${Math.trunc (minAid/100)*100} - €${Math.trunc (maxAid/100)*100}`;
                } 

                
            } else {
                resultText.textContent = 'No data available for the selected program.';
            }
        }, 1500);
    }); 



// NOT WORKING: (no email field yet) Validate email format
    /*
    emailField.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailError.textContent = 'Please enter a valid email address.';
        } else {
            emailError.textContent = '';
        }
    });
    */

    
//WORKING: changing between different pages when the answer is selected
document.addEventListener('change', function (event) {
    // Ellenőrizd, hogy a `radio` gombra kattintottak-e
    if (event.target && event.target.type === 'radio') {
        const currentQuestionId = event.target.dataset.current; // Az aktuális kérdés ID-ja
        const nextQuestionId = event.target.dataset.next; // A következő kérdés ID-ja

        const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
        const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

        if (currentQuestion) {
            currentQuestion.style.display = 'none'; // Az aktuális kérdés elrejtése
        }

        if (nextQuestion) {
            nextQuestion.style.display = 'block'; // A következő kérdés megjelenítése
        }
    }
});


    const dropdown = document.getElementById('country'); // Azonosítjuk a select elemet

    dropdown.addEventListener('change', function () {
        const currentQuestionId = dropdown.closest('.page').id.split('-')[1]; // Az aktuális kérdés ID-je
        const nextQuestionId = parseInt(currentQuestionId) + 1; // Következő kérdés ID-je

        const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
        const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

        if (dropdown.value) { // Ellenőrizzük, hogy választottak-e valamit
            if (currentQuestion) {
                currentQuestion.style.display = 'none'; // Aktuális kérdés elrejtése
            }
            if (nextQuestion) {
                nextQuestion.style.display = 'block'; // Következő kérdés megjelenítése
            }
        }
    });

    diplomaDropdown.addEventListener('change', function () {
        const currentQuestionId = diplomaDropdown.closest('.page').id.split('-')[1]; // Az aktuális kérdés ID-je
        const nextQuestionId = parseInt(currentQuestionId) + 1; // Következő kérdés ID-je

        const currentQuestion = document.getElementById(`question-${currentQuestionId}`);
        const nextQuestion = document.getElementById(`question-${nextQuestionId}`);

        if (diplomaDropdown.value) { // Ellenőrizzük, hogy választottak-e valamit
            if (currentQuestion) {
                currentQuestion.style.display = 'none'; // Aktuális kérdés elrejtése
            }
            if (nextQuestion) {
                nextQuestion.style.display = 'block'; // Következő kérdés megjelenítése
            }
        }

        diploma_grade_options_loader(diplomaDropdown.value);
    });

});
