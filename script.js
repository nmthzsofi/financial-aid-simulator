document.addEventListener('DOMContentLoaded', function() {
    const emailField = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const calculateButton = document.getElementById('calculate-button');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultText = document.getElementById('result');
    const countryDropdown = document.getElementById('country');
    const programDropdown = document.getElementById('program');
    const gradeDropdown = document.getElementById('grade');
    const netIncome = document.getElementById('income');


    //Creating the dropdown list of countries
   function countries_loader() {
        let countries_array = ["Bermuda", "Cayman Islands", "Turks and Caicos Islands", "Switzerland", "Barbados", "Bahamas", "Iceland", "Israel", "New Caledonia", "Denmark", "Ireland", "Virgin Islands", "Palau", "United States", "Vanuatu", "Luxembourg", "Australia", "New Zealand", "United Kingdom", "Norway", "Canada", "Finland", "Lebanon", "Netherlands", "Belgium", "Sweden", "Malta", "Austria", "France", "Germany", "Singapore", "Slovenia", "Qatar", "Hong Kong", "Japan", "United Arab Emirates", "Italy", "South Korea", "Estonia", "Spain", "Costa Rica", "Macao", "Czech Republic", "Portugal", "Lithuania", "Slovakia", "Greece", "Haiti", "Mexico", "Chile", "Croatia", "Hungary", "China", "Saudi Arabia", "Brazil", "Honduras", "Serbia", "El Salvador", "Albania", "Poland", "Ecuador", "East Timor", "Guatemala", "Romania", "Bulgaria", "Brunei", "Montenegro", "South Africa", "Morocco", "Iraq", "Ethiopia", "Philippines", "Colombia", "Cambodia", "Kazakhstan", "Ghana", "Indonesia", "Cameroon", "Russia", "Zambia", "Eswatini", "Benin", "Bolivia", "Nigeria", "Lesotho", "Thailand", "Malaysia", "Cyprus", "Kenya", "Azerbaijan", "Mongolia", "Kyrgyzstan", "Mauritania", "Turkey", "Algeria", "Georgia", "Vietnam", "Tajikistan", "Tunisia", "Belarus", "Bangladesh", "Ukraine", "Sri Lanka", "Tanzania", "Nepal", "Uzbekistan", "Bhutan", "Laos", "Suriname", "Libya", "Myanmar", "India", "Zimbabwe", "Pakistan", "Egypt"];
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


    // Function to fetch the country data
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

    // Function to fetch the programme prices
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

    // Function to fetch the academic factors
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
                console.error('Invalid garde:', selectedGrade);
                return null;
            }
    
            const factor = dataRows[0][gradeIndex];
            console.log(`The selected grade is ${selectedGrade} and its index is ${gradeIndex} and its multiplier is ${factor}`);
            return factor;
    
            
        } catch (error) {
            console.error('Error fetching or processing CSV:', error);
        }
    }
    
    function financialAidCalculator (academicFactor, programCost,countryFactor ) {

        const netIncomeReference = netIncome.value/ (countryFactor / 100);

        if(netIncomeReference < 30000 || netIncomeReference > 100000){
            return 0;
        }


        let maxAid = academicFactor*programCost*((100000-netIncomeReference)/(100000*1.05/100)/100);
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
    // Funcion to fetch the academic factors
    calculateButton.addEventListener('click', async function () {
        const selectedCountry = countryDropdown.value;
        const selectedProgram = programDropdown.value;
        const selectedGrade = gradeDropdown.value;
    
        if (!emailField.value || emailError.textContent) {
            alert('Please provide a valid email address.');
            return;
        }
    
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
    
        loadingScreen.classList.remove('d-none');
    
        const countryData = await fetchCountryData(selectedCountry);
        if (!countryData) {
            alert('Could not fetch data for the selected country.');
            loadingScreen.classList.add('d-none');
            return;
        }
    
        const countryType = countryData['EEA/SW/UK or Non'];
        const countryFactor = countryData['Country factor'];
        const programCost = await fetchProgramCost(selectedProgram, countryType);
        const academicFactor = await fetchAcademicFactor (selectedGrade);

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
            loadingScreen.classList.add('d-none');
            if (programCost) {
                resultScreen.classList.remove('d-none');

                if(minAid < 0 || maxAid < 0){
                    resultText.textContent = `You are not eligible for financial aid.`
                } else{ 
                    resultText.textContent = `The expected financial aid you can receive: €${Math.floor (minAid)} - €${Math.floor (maxAid)}`;
                } 

                
            } else {
                resultText.textContent = 'No data available for the selected program.';
            }
        }, 2500);
    });

       

    // Validate email format
    emailField.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailError.textContent = 'Please enter a valid email address.';
        } else {
            emailError.textContent = '';
        }
    });
});
