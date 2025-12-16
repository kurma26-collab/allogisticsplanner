
let nextCustomId = 1000;
let currentTripData = null;
let selectedVehicle = null;
let selectedCategory = "All";
let editingVehicleId = null;
let tollCost = 0;

// ===== FUEL PRICE FUNCTIONS =====
function updateFuelPriceDisplay() {
    document.getElementById('dieselPriceDisplay').textContent = `₹${fuelPrices.diesel.toFixed(2)}/L`;
    document.getElementById('petrolPriceDisplay').textContent = `₹${fuelPrices.petrol.toFixed(2)}/L`;
    document.getElementById('cngPriceDisplay').textContent = `₹${fuelPrices.cng.toFixed(2)}/Kg`;
}

function openFuelPriceModal() {
    document.getElementById('edit_diesel').value = fuelPrices.diesel;
    document.getElementById('edit_petrol').value = fuelPrices.petrol;
    document.getElementById('edit_cng').value = fuelPrices.cng;
    document.getElementById('fuelPriceModal').classList.add('active');
}

function closeFuelPriceModal() {
    document.getElementById('fuelPriceModal').classList.remove('active');
}

function saveFuelPrices() {
    fuelPrices.diesel = parseFloat(document.getElementById('edit_diesel').value);
    fuelPrices.petrol = parseFloat(document.getElementById('edit_petrol').value);
    fuelPrices.cng = parseFloat(document.getElementById('edit_cng').value);

    updateFuelPriceDisplay();
    closeFuelPriceModal();
    alert('✅ Fuel prices updated successfully!');
}

// ===== TRIP PLANNING FUNCTIONS =====
function getUniqueCities() {
    const cities = new Set();
    tripMaster.forEach(trip => {
        cities.add(trip.origin);
        cities.add(trip.destination);
    });
    return Array.from(cities).sort();
}

function handleOriginInput() {
    const input = document.getElementById('originInput').value.toLowerCase();
    const suggestions = document.getElementById('originSuggestions');

    if (input.length === 0) {
        suggestions.classList.remove('active');
        return;
    }

    const cities = getUniqueCities();
    const filtered = cities.filter(c => c.toLowerCase().includes(input));

    suggestions.innerHTML = filtered.map(city =>
        `<div class="suggestion-item" onclick="selectOrigin('${city}')">${city}</div>`
    ).join('');
    suggestions.classList.toggle('active', filtered.length > 0);
    checkAndAutoFill();
}

function handleDestinationInput() {
    const input = document.getElementById('destinationInput').value.toLowerCase();
    const suggestions = document.getElementById('destinationSuggestions');

    if (input.length === 0) {
        suggestions.classList.remove('active');
        return;
    }

    const cities = getUniqueCities();
    const filtered = cities.filter(c => c.toLowerCase().includes(input));

    suggestions.innerHTML = filtered.map(city =>
        `<div class="suggestion-item" onclick="selectDestination('${city}')">${city}</div>`
    ).join('');
    suggestions.classList.toggle('active', filtered.length > 0);
    checkAndAutoFill();
}

function selectOrigin(city) {
    document.getElementById('originInput').value = city;
    document.getElementById('originSuggestions').classList.remove('active');
    checkAndAutoFill();
}

function selectDestination(city) {
    document.getElementById('destinationInput').value = city;
    document.getElementById('destinationSuggestions').classList.remove('active');
    checkAndAutoFill();
}

function checkAndAutoFill() {
    const origin = document.getElementById('originInput').value.trim();
    const destination = document.getElementById('destinationInput').value.trim();

    if (!origin || !destination) {
        clearAutoFillFields();
        return;
    }

    const route = tripMaster.find(t =>
        t.origin.toLowerCase() === origin.toLowerCase() &&
        t.destination.toLowerCase() === destination.toLowerCase()
    );

    if (route) {
        document.getElementById('distanceInput').value = route.distance_km;
        document.getElementById('travelDaysInput').value = route.travel_days;
        updateSummary(origin, destination, route);
        validateForm();
    } else {
        clearAutoFillFields();
        updateSummary(origin, destination, null);
    }
}

function clearAutoFillFields() {
    document.getElementById('distanceInput').value = '';
    document.getElementById('travelDaysInput').value = '';
    document.getElementById('nextBtn1').disabled = true;
}

function updateSummary(origin, destination, route) {
    if (route) {
        document.getElementById('tripSummary').textContent = `${origin} → ${destination} • ${route.distance_km}km • ${route.travel_days} day(s)`;
    } else {
        document.getElementById('tripSummary').textContent = `${origin} → ${destination} • Route not found`;
    }
}

function validateForm() {
    const origin = document.getElementById('originInput').value.trim();
    const destination = document.getElementById('destinationInput').value.trim();
    const distance = document.getElementById('distanceInput').value;

    const isValid = origin && destination && distance;
    document.getElementById('nextBtn1').disabled = !isValid;
}

function resetForm() {
    document.getElementById('originInput').value = '';
    document.getElementById('destinationInput').value = '';
    clearAutoFillFields();
    document.getElementById('tripSummary').textContent = 'Enter origin and destination...';
}

function proceedToFleetSelection() {
    const origin = document.getElementById('originInput').value.trim();
    const destination = document.getElementById('destinationInput').value.trim();
    const distance = document.getElementById('distanceInput').value;
    const days = document.getElementById('travelDaysInput').value;

    if (!origin || !destination || !distance) {
        alert('Please fill all required fields');
        return;
    }

    currentTripData = {
        origin, destination, distance_km: parseFloat(distance),
        travel_days: parseInt(days)
    };

    displayFleetSelection();
}

function displayFleetSelection() {
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.add('step-2');

    const tripDisplay = `${currentTripData.origin} → ${currentTripData.destination} | ${currentTripData.distance_km}km | ${currentTripData.travel_days} days`;
    document.getElementById('tripDisplaySummary').textContent = tripDisplay;

    // Auto-populate toll cost from database
    let autoToll = 0;
    const foundRoute = tripMaster.find(t =>
        t.origin.toLowerCase() === currentTripData.origin.toLowerCase() &&
        t.destination.toLowerCase() === currentTripData.destination.toLowerCase()
    );

    if (foundRoute) {
        autoToll = foundRoute.toll_cost;
    }

    document.getElementById('tollCostInput').value = autoToll;
    tollCost = autoToll;

    const categories = ['All', ...new Set(vehicleFleet.map(v => v.category))];
    const filterHTML = categories.map(cat =>
        `<button class="category-btn ${cat === 'All' ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</button>`
    ).join('');
    document.getElementById('categoryFilter').innerHTML = filterHTML;

    displayVehicles();
}

function filterByCategory(category) {
    selectedCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayVehicles();
}

function displayVehicles() {
    const filtered = selectedCategory === 'All'
        ? vehicleFleet
        : vehicleFleet.filter(v => v.category === selectedCategory);

    document.getElementById('vehicleCount').textContent = filtered.length;

    const vehicleGrid = document.getElementById('vehicleGrid');
    vehicleGrid.innerHTML = filtered.map(vehicle => `
        <div class="vehicle-card ${vehicle.id >= 1000 ? 'custom' : ''}" id="vehicle-${vehicle.id}" onclick="selectVehicle(${vehicle.id})">
            <div><span class="vehicle-card-label ${vehicle.id >= 1000 ? 'custom' : ''}">${vehicle.category}${vehicle.id >= 1000 ? ' (Custom)' : ''}</span></div>
            <h4>${vehicle.brand} ${vehicle.model}</h4>
            <div class="vehicle-specs">
                <p><strong>Capacity:</strong> ${vehicle.capacity}T | <strong>Body:</strong> ${vehicle.body_type}</p>
                <p><strong>Mileage:</strong> ${vehicle.mileage} km/L | <strong>Fuel:</strong> ${vehicle.fuelType}</p>
                <p><strong>CAPEX:</strong> ₹${vehicle.capex.toLocaleString()}</p>
            </div>
            <button class="edit-btn" onclick="openEditVehicleModal(${vehicle.id}, event)">✏️ Edit</button>
            ${vehicle.id >= 1000 ? `<button class="delete-btn" onclick="deleteCustomVehicle(${vehicle.id}, event)">🗑️ Delete</button>` : ''}
        </div>
    `).join('');
}

function selectVehicle(id) {
    document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
    document.getElementById(`vehicle-${id}`).classList.add('selected');
    selectedVehicle = vehicleFleet.find(v => v.id === id);
    document.getElementById('nextBtn2').disabled = false;
}

function updateTollCost() {
    const inputVal = parseFloat(document.getElementById('tollCostInput').value);
    tollCost = isNaN(inputVal) ? 0 : inputVal;
}

// ===== CUSTOM VEHICLE FUNCTIONS =====
function openCustomVehicleModal() {
    editingVehicleId = null;
    document.getElementById('vehicleModalTitle').textContent = '➕ Add Custom Vehicle';
    generateVehicleForm(null);
    document.getElementById('vehicleModal').classList.add('active');
}

function openEditVehicleModal(vehicleId, event) {
    event.stopPropagation();
    editingVehicleId = vehicleId;
    const vehicle = vehicleFleet.find(v => v.id === vehicleId);
    document.getElementById('vehicleModalTitle').textContent = '✏️ Edit Vehicle';
    generateVehicleForm(vehicle);
    document.getElementById('vehicleModal').classList.add('active');
}

function generateVehicleForm(vehicle) {
    const formHTML = `
        <div class="modal-form-group"><label>Brand/Manufacturer *</label><input type="text" id="v_brand" value="${vehicle?.brand || ''}" required></div>
        <div class="modal-form-group"><label>Model Name *</label><input type="text" id="v_model" value="${vehicle?.model || ''}" required></div>
        <div class="modal-form-group"><label>Category *</label>
            <select id="v_category" required>
                <option value="">Select Category</option>
                <option ${vehicle?.category === 'LCV' ? 'selected' : ''}>LCV</option>
                <option ${vehicle?.category === 'MCV' ? 'selected' : ''}>MCV</option>
                <option ${vehicle?.category === 'HCV' ? 'selected' : ''}>HCV</option>
                <option ${vehicle?.category === 'Container' ? 'selected' : ''}>Container</option>
                <option ${vehicle?.category === 'Trailer' ? 'selected' : ''}>Trailer</option>
                <option ${vehicle?.category === 'Tanker' ? 'selected' : ''}>Tanker</option>
                <option ${vehicle?.category === 'Refrigerated' ? 'selected' : ''}>Refrigerated</option>
                <option ${vehicle?.category === 'Tipper' ? 'selected' : ''}>Tipper</option>
            </select>
        </div>
        <div class="modal-form-group"><label>Capacity (Tons) *</label><input type="number" id="v_capacity" value="${vehicle?.capacity || ''}" step="0.1" required></div>
        <div class="modal-form-group"><label>Body Type *</label><input type="text" id="v_body" value="${vehicle?.body_type || ''}" placeholder="e.g., Closed, Open, Tipper" required></div>
        <div class="modal-form-group"><label>Mileage (km/L) *</label><input type="number" id="v_mileage" value="${vehicle?.mileage || ''}" step="0.1" required></div>
        <div class="modal-form-group"><label>Fuel Type *</label>
            <select id="v_fuelType" required>
                <option value="">Select Fuel</option>
                <option ${vehicle?.fuelType === 'diesel' ? 'selected' : ''}>diesel</option>
                <option ${vehicle?.fuelType === 'petrol' ? 'selected' : ''}>petrol</option>
                <option ${vehicle?.fuelType === 'cng' ? 'selected' : ''}>cng</option>
            </select>
        </div>
        <div class="modal-form-group"><label>Number of Tyres *</label><input type="number" id="v_tyres" value="${vehicle?.tyres || ''}" required></div>
        <div class="modal-form-group"><label>CAPEX (₹) *</label><input type="number" id="v_capex" value="${vehicle?.capex || ''}" required></div>
        <div class="modal-form-group"><label>Tyre Cost Each (₹)</label><input type="number" id="v_tyreCost" value="${vehicle?.tyreCost || ''}" step="0.01"></div>
        <div class="modal-form-group"><label>Tyre Life (km)</label><input type="number" id="v_tyreLife" value="${vehicle?.tyreLife || 80000}"></div>
        <div class="modal-form-group"><label>Driver Cost Daily (₹)</label><input type="number" id="v_driver" value="${vehicle?.driverNormal || ''}" step="0.01"></div>
        <div class="modal-form-group"><label>NP Permit Annual (₹)</label><input type="number" id="v_permit" value="${vehicle?.npPermit || ''}" step="0.01"></div>
    `;
    document.getElementById('vehicleFormGrid').innerHTML = formHTML;
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').classList.remove('active');
}

function saveVehicle() {
    const brand = document.getElementById('v_brand').value;
    const model = document.getElementById('v_model').value;
    const category = document.getElementById('v_category').value;
    const capacity = parseFloat(document.getElementById('v_capacity').value);
    const body = document.getElementById('v_body').value;
    const mileage = parseFloat(document.getElementById('v_mileage').value);
    const fuelType = document.getElementById('v_fuelType').value;
    const tyres = parseInt(document.getElementById('v_tyres').value);
    const capex = parseFloat(document.getElementById('v_capex').value);
    const tyreCost = parseFloat(document.getElementById('v_tyreCost').value) || 10000;
    const tyreLife = parseFloat(document.getElementById('v_tyreLife').value) || 80000;
    const driver = parseFloat(document.getElementById('v_driver').value) || 2000;
    const permit = parseFloat(document.getElementById('v_permit').value) || 20000;

    if (!brand || !model || !category || !capacity || !body || !mileage || !fuelType || !tyres || !capex) {
        alert('Please fill all required fields');
        return;
    }

    if (editingVehicleId) {
        const vehicle = vehicleFleet.find(v => v.id === editingVehicleId);
        vehicle.brand = brand;
        vehicle.model = model;
        vehicle.category = category;
        vehicle.capacity = capacity;
        vehicle.body_type = body;
        vehicle.mileage = mileage;
        vehicle.fuelType = fuelType;
        vehicle.tyres = tyres;
        vehicle.capex = capex;
        vehicle.tyreCost = tyreCost;
        vehicle.tyreLife = tyreLife;
        vehicle.driverNormal = driver;
        vehicle.npPermit = permit;
    } else {
        const newVehicle = {
            id: nextCustomId++,
            category, brand, model, capacity, body_type: body, tyres, mileage, fuelType,
            price: `${(capex / 100000).toFixed(1)}-${(capex / 100000 * 1.2).toFixed(1)}`,
            capex, tyreCost, tyreLife, driverNormal: driver, npPermit: permit
        };
        vehicleFleet.push(newVehicle);
    }

    closeVehicleModal();
    displayVehicles();

    // Refresh comparison view if we are on that step
    if (!document.getElementById('step4').classList.contains('hidden')) {
        displayComparisonVehicles();
    }

    alert(editingVehicleId ? '✅ Vehicle updated!' : '✅ Custom vehicle added!');
}

function deleteCustomVehicle(id, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this custom vehicle?')) {
        vehicleFleet = vehicleFleet.filter(v => v.id !== id);
        displayVehicles();

        // Refresh comparison view if we are on that step
        if (!document.getElementById('step4').classList.contains('hidden')) {
            displayComparisonVehicles();
        }

        alert('✅ Vehicle deleted!');
    }
}

// ===== COST ANALYSIS FUNCTIONS =====
function proceedToStep3() {
    if (!selectedVehicle) {
        alert('Please select a vehicle');
        return;
    }

    tollCost = parseFloat(document.getElementById('tollCostInput').value) || 0;
    displayCostAnalysis();
}

function displayCostAnalysis() {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-2');
    document.getElementById('stepIndicator').classList.add('step-3');

    const tripDisplay = `${currentTripData.origin} → ${currentTripData.destination} | ${currentTripData.distance_km}km | ${currentTripData.travel_days} days`;
    document.getElementById('tripCostSummary').textContent = tripDisplay;

    const vehicleDisplay = `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.category}, ${selectedVehicle.capacity}T)`;
    document.getElementById('vehicleCostSummary').textContent = vehicleDisplay;

    const fuelPrice = fuelPrices[selectedVehicle.fuelType];
    document.getElementById('fuelTypeSummary').textContent = selectedVehicle.fuelType.charAt(0).toUpperCase() + selectedVehicle.fuelType.slice(1);
    document.getElementById('mileageSummary').textContent = selectedVehicle.mileage;
    document.getElementById('fuelPriceSummary').textContent = fuelPrice.toFixed(2);
    document.getElementById('tollDisplaySummary').textContent = tollCost.toFixed(2);

    calculateCosts();
}

function calculateCosts() {
    const trip = currentTripData;
    const vehicle = selectedVehicle;
    const fuelPrice = fuelPrices[vehicle.fuelType];

    // ===== ADMIN INPUTS (Vehicle Parameters) =====
    const exShowroomPrice = vehicle.capex;
    const fabricationCost = 0;
    const salvagePercent = 0.25;
    const usefulLifeYears = 7;
    const daysPerYear = 300;
    const insurancePercent = 0.022;
    const annualRoadTax = 18000; // Standard RTO road tax
    const gpsMonthly = 450; // GPS tracker monthly cost
    const incidentalPerTrip = 500; // Incidental operational allowance - FLAT FEE PER TRIP
    const tyreCostEach = vehicle.tyreCost;
    const tyreCount = vehicle.tyres;
    const tyreLifeKm = vehicle.tyreLife;
    const mileageKmpl = vehicle.mileage;
    const npPermitAnnual = 20000; // National Permit annual cost
    const rmPerDay = 333; // R&M Cost per day: ₹333/day

    // Determine driver cost based on vehicle category (Trailer uses ₹2500, others use ₹2300)
    const isTrailer = vehicle.category === 'Trailer';
    const driverDailyNormal = isTrailer ? 2500 : 2300;

    // Commercial Parameters
    const sgandaPercent = 0.05;
    const marginPercent = 0.05;

    // ===== DERIVED VEHICLE VALUES =====
    const vehicleCapitalCost = exShowroomPrice + fabricationCost;
    const salvageValue = vehicleCapitalCost * salvagePercent;
    const depreciationBase = vehicleCapitalCost - salvageValue;
    const usefulLifeDays = usefulLifeYears * daysPerYear;

    // ===== FIXED COSTS (PER DAY) =====
    const deprPerDay = depreciationBase / usefulLifeDays;
    const annualInsurance = vehicleCapitalCost * insurancePercent;
    const insurancePerDay = annualInsurance / daysPerYear;
    const roadtaxPerDay = annualRoadTax / daysPerYear;
    const rmPerDayCalc = rmPerDay; // R&M: ₹333/day
    const gpsPerDay = gpsMonthly / 30;
    const npPerDay = npPermitAnnual / daysPerYear;
    const driverPerDay = driverDailyNormal;

    const fixedPerDay = deprPerDay + insurancePerDay + roadtaxPerDay + rmPerDayCalc +
        driverPerDay + gpsPerDay + npPerDay;

    // ===== FIXED COSTS (PER TRIP) =====
    const fixedPerTrip = (fixedPerDay * trip.travel_days) + incidentalPerTrip;
    const fixedPerKm = trip.distance_km > 0 ? fixedPerTrip / trip.distance_km : 0;

    // ===== VARIABLE COSTS (PER KM) =====
    const fuelCostPerKm = fuelPrice / mileageKmpl;
    const tyreCostPerKm = (tyreCostEach * tyreCount) / tyreLifeKm;
    const rmVariablePerKm = 0;
    const totalVariablePerKm = fuelCostPerKm + tyreCostPerKm + rmVariablePerKm;

    // ===== VARIABLE COSTS (PER TRIP) =====
    const variablePerTrip = totalVariablePerKm * trip.distance_km;
    const fuelCostPerTrip = fuelCostPerKm * trip.distance_km;
    const tyreCostPerTrip = tyreCostPerKm * trip.distance_km;
    const fuelRequiredLiters = trip.distance_km / mileageKmpl;

    // ===== TOLL COSTS =====
    const tollPerTrip = tollCost;
    const tollPerKm = trip.distance_km > 0 ? tollPerTrip / trip.distance_km : 0;

    // ===== FINAL COMMERCIALS =====
    const operatingCost = fixedPerTrip + variablePerTrip + tollPerTrip;
    const sganda = operatingCost * sgandaPercent;
    const margin = (operatingCost + sganda) * marginPercent;
    const totalTripCost = operatingCost + sganda + margin;
    const totalPerKm = trip.distance_km > 0 ? totalTripCost / trip.distance_km : 0;

    // Validate calculations before displaying
    if (isNaN(totalTripCost) || !isFinite(totalTripCost)) {
        console.error('Cost calculation error:', { fixedPerTrip, variablePerTrip, tollPerTrip, operatingCost });
        alert('Error in cost calculation. Please check your inputs.');
        return;
    }

    // ===== BUILD BREAKDOWN HTML =====
    const breakdown = document.getElementById('costBreakdown');
    if (!breakdown) {
        console.error('Cost breakdown container not found!');
        return;
    }

    breakdown.innerHTML = `
        <div class="cost-section">
            <div class="cost-section-title">📌 FIXED COSTS</div>
            <div class="cost-row">
                <div class="cost-row-label">Depreciation/Day (7yr @ 25% salvage)</div>
                <div class="cost-row-value">₹${deprPerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Depreciation (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(deprPerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Insurance/Day @ 2.2%</div>
                <div class="cost-row-value">₹${insurancePerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Insurance (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(insurancePerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Road Tax/Day (RTO)</div>
                <div class="cost-row-value">₹${roadtaxPerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Road Tax (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(roadtaxPerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">R&M Cost/Day @ ₹333/day</div>
                <div class="cost-row-value">₹${rmPerDayCalc.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">R&M Cost (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(rmPerDayCalc * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Driver Cost/Day (${isTrailer ? '₹2,500 Trailer' : '₹2,300 Truck'})</div>
                <div class="cost-row-value">₹${driverPerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Driver Cost (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(driverPerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">NP Permit/Day</div>
                <div class="cost-row-value">₹${npPerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">NP Permit (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(npPerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">GPS Cost/Day</div>
                <div class="cost-row-value">₹${gpsPerDay.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">GPS Cost (${trip.travel_days} days)</div>
                <div class="cost-row-value">₹${(gpsPerDay * trip.travel_days).toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Incidental (Flat Fee per Trip)</div>
                <div class="cost-row-value">₹${incidentalPerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row total">
                <div class="cost-row-label">Total Fixed Cost/Trip</div>
                <div class="cost-row-value">₹${fixedPerTrip.toFixed(2)}</div>
            </div>
        </div>

        <div class="cost-section">
            <div class="cost-section-title">⛽ FUEL COSTS (${vehicle.fuelType.toUpperCase()})</div>
            <div class="cost-row">
                <div class="cost-row-label">Fuel Price/Unit</div>
                <div class="cost-row-value">₹${fuelPrice.toFixed(2)}/${vehicle.fuelType === 'cng' ? 'Kg' : 'L'}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Vehicle Mileage</div>
                <div class="cost-row-value">${vehicle.mileage} km/L</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">📐 Fuel Required (Distance ÷ Mileage)</div>
                <div class="cost-row-value">${fuelRequiredLiters.toFixed(2)} L</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">📐 Fuel Cost/km (Price ÷ Mileage)</div>
                <div class="cost-row-value">₹${fuelCostPerKm.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">📐 Total Fuel Cost (Fuel Required × Price)</div>
                <div class="cost-row-value">₹${fuelCostPerTrip.toFixed(2)}</div>
            </div>
        </div>

        <div class="cost-section">
            <div class="cost-section-title">💨 VARIABLE COSTS</div>
            <div class="cost-row">
                <div class="cost-row-label">Fuel Cost/km</div>
                <div class="cost-row-value">₹${fuelCostPerKm.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Total Fuel Cost (${trip.distance_km}km)</div>
                <div class="cost-row-value">₹${fuelCostPerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Tyre Cost/km (${vehicle.tyres} tyres)</div>
                <div class="cost-row-value">₹${tyreCostPerKm.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Total Tyre Cost (${trip.distance_km}km)</div>
                <div class="cost-row-value">₹${tyreCostPerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row total">
                <div class="cost-row-label">Total Variable Cost (Fuel + Tyre)</div>
                <div class="cost-row-value">₹${variablePerTrip.toFixed(2)}</div>
            </div>
        </div>

        <div class="cost-section">
            <div class="cost-section-title">🛣️ TOLL COSTS (VARIABLE)</div>
            <div class="cost-row">
                <div class="cost-row-label">Toll Cost/km</div>
                <div class="cost-row-value">₹${tollPerKm.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Total Toll Cost (${trip.distance_km}km)</div>
                <div class="cost-row-value">₹${tollPerTrip.toFixed(2)}</div>
            </div>
        </div>

        <div class="cost-section">
            <div class="cost-section-title">💰 OPERATING & TOTAL COST</div>
            <div class="cost-row">
                <div class="cost-row-label">Fixed Cost/Trip</div>
                <div class="cost-row-value">₹${fixedPerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Variable Cost/Trip</div>
                <div class="cost-row-value">₹${variablePerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Toll Cost/Trip</div>
                <div class="cost-row-value">₹${tollPerTrip.toFixed(2)}</div>
            </div>
            <div class="cost-row total">
                <div class="cost-row-label">Operating Cost (Fixed + Variable + Toll)</div>
                <div class="cost-row-value">₹${operatingCost.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">SG&A Overhead (5%)</div>
                <div class="cost-row-value">₹${sganda.toFixed(2)}</div>
            </div>
            <div class="cost-row">
                <div class="cost-row-label">Profit Margin (5%)</div>
                <div class="cost-row-value">₹${margin.toFixed(2)}</div>
            </div>
            <div class="cost-row total" style="font-size: 1.15em;">
                <div class="cost-row-label">🎯 TOTAL TRIP COST</div>
                <div class="cost-row-value">₹${totalTripCost.toFixed(2)}</div>
            </div>
            <div class="cost-row total" style="font-size: 1.15em;">
                <div class="cost-row-label">🎯 COST PER KM</div>
                <div class="cost-row-value">₹${totalPerKm.toFixed(2)}</div>
            </div>
        </div>
    `;

    window.tripCostResult = {
        // Fixed costs
        fixedPerDay: fixedPerDay,
        fixedPerTrip: fixedPerTrip,
        fixedPerKm: fixedPerKm,
        depreciationPerDay: deprPerDay,
        insurancePerDay: insurancePerDay,
        rmPerDay: rmPerDayCalc,
        incidentalPerTrip: incidentalPerTrip,

        // Variable costs
        fuelCostPerKm: fuelCostPerKm,
        tyreCostPerKm: tyreCostPerKm,
        totalVariablePerKm: totalVariablePerKm,
        fuelCostPerTrip: fuelCostPerTrip,
        tyreCostPerTrip: tyreCostPerTrip,
        variablePerTrip: variablePerTrip,
        fuelRequiredLiters: fuelRequiredLiters,

        // Toll costs
        tollPerTrip: tollPerTrip,
        tollPerKm: tollPerKm,

        // Final costs
        operatingCost: operatingCost,
        sgandaCost: sganda,
        marginCost: margin,
        totalCost: totalTripCost,
        costPerKm: totalPerKm,

        // Trip and vehicle info for reports
        trip: trip,
        vehicle: vehicle,
        fuelPrice: fuelPrice
    };
}

// ===== MULTI-VEHICLE COMPARISON FUNCTIONS =====
let selectedVehiclesForComparison = [];
let selectedComparisonCategory = "All";

function displayComparisonVehicles() {
    // Render Filters
    const categories = ['All', ...new Set(vehicleFleet.map(v => v.category))];
    const filterHTML = categories.map(cat =>
        `<button class="category-btn ${cat === selectedComparisonCategory ? 'active' : ''}" onclick="filterComparisonByCategory('${cat}')">${cat}</button>`
    ).join('');
    document.getElementById('comparisonCategoryFilter').innerHTML = filterHTML;

    // Filter Vehicles
    const filtered = selectedComparisonCategory === 'All'
        ? vehicleFleet
        : vehicleFleet.filter(v => v.category === selectedComparisonCategory);

    const comparisonGrid = document.getElementById('comparisonVehicleGrid');
    comparisonGrid.innerHTML = filtered.map(vehicle => `
        <div class="vehicle-card comparison-selectable" id="comp-vehicle-${vehicle.id}" 
             onclick="toggleComparisonVehicle(${vehicle.id}, event)" 
             style="cursor: pointer; user-select: none;">
            <div><span class="vehicle-card-label ${vehicle.id >= 1000 ? 'custom' : ''}">${vehicle.category}${vehicle.id >= 1000 ? ' (Custom)' : ''}</span></div>
            <h4>${vehicle.brand} ${vehicle.model}</h4>
            <div class="vehicle-specs">
                <p><strong>Capacity:</strong> ${vehicle.capacity}T | <strong>Body:</strong> ${vehicle.body_type}</p>
                <p><strong>Mileage:</strong> ${vehicle.mileage} km/L | <strong>Fuel:</strong> ${vehicle.fuelType}</p>
                <p><strong>CAPEX:</strong> ₹${vehicle.capex.toLocaleString()}</p>
            </div>
            <button class="edit-btn" onclick="openEditVehicleModal(${vehicle.id}, event)">✏️ Edit</button>
            ${vehicle.id >= 1000 ? `<button class="delete-btn" onclick="deleteCustomVehicle(${vehicle.id}, event)">🗑️ Delete</button>` : ''}
        </div>
    `).join('');
    updateComparisonUI();
}

function toggleComparisonVehicle(vehicleId, event) {
    event.stopPropagation();
    const index = selectedVehiclesForComparison.indexOf(vehicleId);
    if (index > -1) {
        selectedVehiclesForComparison.splice(index, 1);
    } else {
        selectedVehiclesForComparison.push(vehicleId);
    }
    updateComparisonUI();
}

function filterComparisonByCategory(category) {
    selectedComparisonCategory = category;
    displayComparisonVehicles();
}

function updateComparisonUI() {
    document.getElementById('selectedCount').textContent = selectedVehiclesForComparison.length;
    document.querySelectorAll('.comparison-selectable').forEach(card => {
        const vehicleId = parseInt(card.id.replace('comp-vehicle-', ''));
        if (selectedVehiclesForComparison.includes(vehicleId)) {
            card.style.borderWidth = '4px';
            card.style.borderColor = '#ff9800';
            card.style.backgroundColor = '#fff8f0';
            card.style.boxShadow = '0 0 15px rgba(255, 152, 0, 0.3)';
        } else {
            card.style.borderWidth = '2px';
            card.style.borderColor = '#e0e0e0';
            card.style.backgroundColor = '#f9f9f9';
            card.style.boxShadow = 'none';
        }
    });
}

function clearComparisonSelection() {
    selectedVehiclesForComparison = [];
    updateComparisonUI();
}

function generateComparisonTable() {
    if (selectedVehiclesForComparison.length < 2) {
        alert('❌ Please select at least 2 vehicles to compare');
        return;
    }

    const selectedVehicles = vehicleFleet.filter(v => selectedVehiclesForComparison.includes(v.id));
    window.comparisonVehicles = selectedVehicles;

    // Calculate detailed costs for each vehicle
    const comparisonData = selectedVehicles.map(vehicle => {
        const fuelPrice = fuelPrices[vehicle.fuelType];
        const mileageKmpl = vehicle.mileage;
        const fuelCostPerKm = fuelPrice / mileageKmpl;
        const tyreCostPerKm = (vehicle.tyreCost * vehicle.tyres) / vehicle.tyreLife;
        const totalVarPerKm = fuelCostPerKm + tyreCostPerKm;

        const deprPerDay = (vehicle.capex * 0.75) / (7 * 300);
        const insurancePerDay = (vehicle.capex * 0.022) / 300;
        const roadtaxPerDay = 18000 / 300;
        const rmPerDay = 333;
        const gpsPerDay = 450 / 30;
        const npPerDay = 20000 / 300;
        const driverPerDay = vehicle.category === 'Trailer' ? 2500 : 2300;
        const fixedPerDay = deprPerDay + insurancePerDay + roadtaxPerDay + rmPerDay + driverPerDay + gpsPerDay + npPerDay;

        const fixedPerTrip = (fixedPerDay * currentTripData.travel_days) + 500;
        const varPerTrip = totalVarPerKm * currentTripData.distance_km;
        const fuelRequired = currentTripData.distance_km / mileageKmpl;
        const totalOpCost = fixedPerTrip + varPerTrip + tollCost;
        const sganda = totalOpCost * 0.05;
        const margin = (totalOpCost + sganda) * 0.05;
        const finalCost = totalOpCost + sganda + margin;

        return {
            id: vehicle.id,
            vehicle: vehicle,
            fuelPrice: fuelPrice,
            fuelRequired: fuelRequired,
            fuelCostPerKm: fuelCostPerKm,
            fuelCostPerTrip: fuelCostPerKm * currentTripData.distance_km,
            tyreCostPerKm: tyreCostPerKm,
            tyreCostPerTrip: tyreCostPerKm * currentTripData.distance_km,
            fixedPerDay: fixedPerDay,
            fixedPerTrip: fixedPerTrip,
            variablePerTrip: varPerTrip,
            operatingCost: totalOpCost,
            sgandaCost: sganda,
            marginCost: margin,
            totalCost: finalCost,
            costPerKm: finalCost / currentTripData.distance_km
        };
    });

    window.comparisonData = comparisonData;
    displayComparisonTable(comparisonData);

    // Show next button after comparison is generated
    document.getElementById('proceedToReportsBtn').disabled = false;
}

function displayComparisonTable(data) {
    const tableHtml = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-bottom: 15px;">📊 Fleet Cost Comparison - ${currentTripData.origin} → ${currentTripData.destination}</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Vehicle</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Category</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Capacity</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Mileage</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Fuel Type</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Fuel Required</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Fixed Cost</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Variable Cost</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Operating Cost</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right; background: #fff3e0; font-weight: bold; color: #1a237e;">Total Cost</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right; background: #fff3e0; font-weight: bold; color: #1a237e;">Cost/km</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((d, idx) => `
                        <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
                            <td style="padding: 12px; border: 1px solid #ddd;"><strong>${d.vehicle.brand} ${d.vehicle.model}</strong></td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${d.vehicle.category}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${d.vehicle.capacity}T</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${d.vehicle.mileage} km/L</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${d.vehicle.fuelType}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${d.fuelRequired.toFixed(2)} L</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${d.fixedPerTrip.toFixed(2)}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${d.variablePerTrip.toFixed(2)}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${d.operatingCost.toFixed(2)}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right; background: #fff3e0; font-weight: bold; color: #667eea;">₹${d.totalCost.toFixed(2)}</td>
                            <td style="padding: 12px; border: 1px solid #ddd; text-align: right; background: #fff3e0; font-weight: bold; color: #667eea;">₹${d.costPerKm.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <strong>✅ Comparison Complete!</strong> ${data.length} vehicles analyzed. Use the reports section for detailed PDF/Excel exports with full breakdown.
        </div>
    `;

    document.getElementById('comparisonMessage').style.display = 'none';
    document.getElementById('comparisonTable').innerHTML = tableHtml;
    document.getElementById('comparisonTable').style.display = 'block';
}



function goBackToStep1() {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-2');
}

function goBackToStep2() {
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-3');
    document.getElementById('stepIndicator').classList.add('step-2');
}

function proceedToStep4() {
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-3');
    document.getElementById('stepIndicator').classList.add('step-4');
    document.getElementById('proceedToReportsBtn').disabled = true;

    // Display current vehicle analysis
    const msg = `✅ Cost Analysis Complete!<br><br>
        <strong>📍 Route:</strong> ${currentTripData.origin} → ${currentTripData.destination}<br>
        <strong>🚛 Selected Vehicle:</strong> ${selectedVehicle.brand} ${selectedVehicle.model}<br>
        <strong>📏 Distance:</strong> ${currentTripData.distance_km}km | <strong>📅 Days:</strong> ${currentTripData.travel_days}<br>
        <strong>─────────────────────────</strong><br>
        <strong>Fixed Cost/Trip:</strong> ₹${window.tripCostResult.fixedPerTrip.toFixed(2)} (₹${window.tripCostResult.fixedPerKm.toFixed(2)}/km)<br>
        <strong>Variable Cost/Trip:</strong> ₹${window.tripCostResult.variablePerTrip.toFixed(2)} (₹${window.tripCostResult.totalVariablePerKm.toFixed(2)}/km)<br>
        <strong>⛽ Fuel Required:</strong> ${window.tripCostResult.fuelRequiredLiters.toFixed(2)} L @ ₹${fuelPrices[selectedVehicle.fuelType].toFixed(2)}/L<br>
        <strong>🛣️ Toll Cost:</strong> ₹${window.tripCostResult.tollPerTrip.toFixed(2)}<br>
        <strong>─────────────────────────</strong><br>
        <strong>Operating Cost:</strong> ₹${window.tripCostResult.operatingCost.toFixed(2)}<br>
        <strong>SG&A (5%):</strong> ₹${window.tripCostResult.sgandaCost.toFixed(2)}<br>
        <strong>Profit Margin (5%):</strong> ₹${window.tripCostResult.marginCost.toFixed(2)}<br>
        <strong>═══════════════════════════</strong><br>
        <strong>🎯 Total Trip Cost:</strong> ₹${window.tripCostResult.totalCost.toFixed(2)}<br>
        <strong>💰 Cost per km:</strong> ₹${window.tripCostResult.costPerKm.toFixed(2)}`;

    document.getElementById('comparisonMessage').innerHTML = msg;
    document.getElementById('comparisonMessage').style.display = 'block';
    document.getElementById('comparisonTable').style.display = 'none';

    // Clear previous selections and display all vehicles
    selectedVehiclesForComparison = [];
    displayComparisonVehicles();
}

function goBackToStep3() {
    document.getElementById('step4').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-4');
    document.getElementById('stepIndicator').classList.add('step-3');
}

function proceedToStep5() {
    document.getElementById('step4').classList.add('hidden');
    document.getElementById('step5').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-4');
    document.getElementById('stepIndicator').classList.add('step-5');

    let reportMsg = `✅ Analysis Complete - Ready for Export!<br><br>
        <strong>📍 Trip:</strong> ${currentTripData.origin} → ${currentTripData.destination}<br>
        <strong>🚛 Selected Vehicle:</strong> ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.category})<br>
        <strong>📏 Distance:</strong> ${currentTripData.distance_km}km<br>
        <strong>⛽ Fuel Used:</strong> ${selectedVehicle.fuelType} (${window.tripCostResult.fuelRequiredLiters.toFixed(2)} L)<br>
        <strong>💰 Total Trip Cost:</strong> ₹${window.tripCostResult.totalCost.toFixed(2)}<br>
        <strong>📊 Cost per km:</strong> ₹${window.tripCostResult.costPerKm.toFixed(2)}`;

    if (window.comparisonData && window.comparisonData.length > 1) {
        reportMsg += `<br><br>
        <strong style="color: #667eea;">📈 Fleet Comparison Data:</strong><br>
        Compared ${window.comparisonData.length} vehicles for same route<br>
        Lowest Cost: ₹${Math.min(...window.comparisonData.map(d => d.totalCost)).toFixed(2)}<br>
        Highest Cost: ₹${Math.max(...window.comparisonData.map(d => d.totalCost)).toFixed(2)}`;
    }

    document.getElementById('reportMessage').innerHTML = reportMsg;
}

function goBackToStep4() {
    document.getElementById('step5').classList.add('hidden');
    document.getElementById('step4').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-5');
    document.getElementById('stepIndicator').classList.add('step-4');
}

function downloadReportTXT() {
    const report = `
╔════════════════════════════════════════════════════════════════╗
║     FLEETCOST PLANNER PRO - TRIP ANALYSIS REPORT              ║
╚════════════════════════════════════════════════════════════════╝

📍 TRIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Origin:         ${currentTripData.origin}
  Destination:    ${currentTripData.destination}
  Distance:       ${currentTripData.distance_km} km
  Travel Days:    ${currentTripData.travel_days} days

🚛 VEHICLE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Brand:          ${selectedVehicle.brand}
  Model:          ${selectedVehicle.model}
  Category:       ${selectedVehicle.category}
  Capacity:       ${selectedVehicle.capacity} Tons
  Body Type:      ${selectedVehicle.body_type}
  Mileage:        ${selectedVehicle.mileage} km/L
  CAPEX:          ₹${selectedVehicle.capex.toLocaleString()}
  Tyres:          ${selectedVehicle.tyres}

⛽ FUEL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Fuel Type:      ${selectedVehicle.fuelType.toUpperCase()}
  Fuel Price:     ₹${fuelPrices[selectedVehicle.fuelType].toFixed(2)}/${selectedVehicle.fuelType === 'cng' ? 'Kg' : 'L'}
  Fuel Required:  ${window.tripCostResult.fuelRequiredLiters.toFixed(2)} L
  Fuel Cost/km:   ₹${window.tripCostResult.fuelCostPerKm.toFixed(2)}
  Total Fuel Cost:₹${window.tripCostResult.fuelCostPerTrip.toFixed(2)}

💰 FIXED COSTS (Per Day / Per Trip / Per KM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Depreciation:   ₹${window.tripCostResult.depreciationPerDay.toFixed(2)} / ₹${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days).toFixed(2)} / ₹${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}
  Insurance:      ₹${window.tripCostResult.insurancePerDay.toFixed(2)} / ₹${(window.tripCostResult.insurancePerDay * currentTripData.travel_days).toFixed(2)} / ₹${(window.tripCostResult.insurancePerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}
  ─────────────────────────────────────────────────
  Total Fixed:    ₹${(window.tripCostResult.fixedPerDay).toFixed(2)} / ₹${window.tripCostResult.fixedPerTrip.toFixed(2)} / ₹${window.tripCostResult.fixedPerKm.toFixed(2)}

💨 VARIABLE COSTS (Per KM / Per Trip)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Fuel Cost:      ₹${window.tripCostResult.fuelCostPerKm.toFixed(2)} / ₹${window.tripCostResult.fuelCostPerTrip.toFixed(2)}
  Tyre Cost:      ₹${window.tripCostResult.tyreCostPerKm.toFixed(2)} / ₹${window.tripCostResult.tyreCostPerTrip.toFixed(2)}
  ─────────────────────────────────────────────────
  Total Variable: ₹${window.tripCostResult.totalVariablePerKm.toFixed(2)} / ₹${window.tripCostResult.variablePerTrip.toFixed(2)}

🛣️ TOLL COSTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Toll Per KM:    ₹${window.tripCostResult.tollPerKm.toFixed(2)}
  Toll Per Trip:  ₹${window.tripCostResult.tollPerTrip.toFixed(2)}

💰 FINAL COST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Operating Cost: ₹${window.tripCostResult.operatingCost.toFixed(2)}
  SG&A (5%):      ₹${window.tripCostResult.sgandaCost.toFixed(2)}
  Profit Margin:  ₹${window.tripCostResult.marginCost.toFixed(2)}
  ═══════════════════════════════════════════════════
  TOTAL COST:     ₹${window.tripCostResult.totalCost.toFixed(2)}
  COST PER KM:    ₹${window.tripCostResult.costPerKm.toFixed(2)}

Generated: ${new Date().toLocaleString()}
Report ID: FCP-${Date.now()}
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `FleetCost_Report_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Text report downloaded successfully!');
}

function downloadReportExcel() {
    // Create Excel-like CSV with detailed breakdown and graphs
    const csv = `FLEETCOST PLANNER PRO - EXCEL REPORT,${new Date().toLocaleDateString()}
Trip Analysis Report,${new Date().toLocaleTimeString()}

TRIP DETAILS
Origin,${currentTripData.origin}
Destination,${currentTripData.destination}
Distance (km),${currentTripData.distance_km}
Travel Days,${currentTripData.travel_days}

VEHICLE DETAILS
Brand,${selectedVehicle.brand}
Model,${selectedVehicle.model}
Category,${selectedVehicle.category}
Capacity (Tons),${selectedVehicle.capacity}
Body Type,${selectedVehicle.body_type}
Mileage (km/L),${selectedVehicle.mileage}
Fuel Type,${selectedVehicle.fuelType.toUpperCase()}
CAPEX (₹),${selectedVehicle.capex.toLocaleString()}
Tyres,${selectedVehicle.tyres}

FUEL INFORMATION
Fuel Price (₹/L),${fuelPrices[selectedVehicle.fuelType].toFixed(2)}
Fuel Required (L),${window.tripCostResult.fuelRequiredLiters.toFixed(2)}
Fuel Cost/km (₹),${window.tripCostResult.fuelCostPerKm.toFixed(2)}
Total Fuel Cost (₹),${window.tripCostResult.fuelCostPerTrip.toFixed(2)}

FIXED COSTS BREAKDOWN
Cost Component,Per Day (₹),Per Trip (₹),Per KM (₹)
Depreciation,${window.tripCostResult.depreciationPerDay.toFixed(2)},${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days).toFixed(2)},${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}
Insurance,${window.tripCostResult.insurancePerDay.toFixed(2)},${(window.tripCostResult.insurancePerDay * currentTripData.travel_days).toFixed(2)},${(window.tripCostResult.insurancePerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}
Total Fixed,${(window.tripCostResult.fixedPerDay).toFixed(2)},${window.tripCostResult.fixedPerTrip.toFixed(2)},${window.tripCostResult.fixedPerKm.toFixed(2)}

VARIABLE COSTS BREAKDOWN
Cost Component,Per KM (₹),Per Trip (₹)
Fuel Cost,${window.tripCostResult.fuelCostPerKm.toFixed(2)},${window.tripCostResult.fuelCostPerTrip.toFixed(2)}
Tyre Cost,${window.tripCostResult.tyreCostPerKm.toFixed(2)},${window.tripCostResult.tyreCostPerTrip.toFixed(2)}
Total Variable,${window.tripCostResult.totalVariablePerKm.toFixed(2)},${window.tripCostResult.variablePerTrip.toFixed(2)}

TOLL COSTS
Per KM (₹),${window.tripCostResult.tollPerKm.toFixed(2)}
Per Trip (₹),${window.tripCostResult.tollPerTrip.toFixed(2)}

FINAL COST SUMMARY
Cost Category,Amount (₹)
Operating Cost,${window.tripCostResult.operatingCost.toFixed(2)}
SG&A Overhead (5%),${window.tripCostResult.sgandaCost.toFixed(2)}
Profit Margin (5%),${window.tripCostResult.marginCost.toFixed(2)}
TOTAL TRIP COST,${window.tripCostResult.totalCost.toFixed(2)}
COST PER KM,${window.tripCostResult.costPerKm.toFixed(2)}

COST BREAKDOWN %
Fixed Cost %,${((window.tripCostResult.fixedPerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%
Variable Cost %,${((window.tripCostResult.variablePerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%
Toll Cost %,${((window.tripCostResult.tollPerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%
SG&A %,${((window.tripCostResult.sgandaCost / window.tripCostResult.totalCost) * 100).toFixed(2)}%
Profit %,${((window.tripCostResult.marginCost / window.tripCostResult.totalCost) * 100).toFixed(2)}%
`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `FleetCost_Report_${Date.now()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert('✅ Excel report (CSV) downloaded successfully!');
}

function downloadReportPDF() {
    // Create HTML to print as PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>FleetCost Report</title>
        <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #667eea; text-align: center; }
            h2 { color: #333; border-bottom: 2px solid #667eea; padding: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #667eea; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .highlight { color: #667eea; font-weight: bold; font-size: 1.2em; }
            .cost-box { background: #fff3e0; padding: 15px; margin: 15px 0; border-left: 4px solid #ff9800; }
        </style>
    </head>
    <body>
        <h1>🚚 FleetCost Planner Pro - Trip Analysis Report</h1>
        <p style="text-align: center; color: #666;">Report Generated: ${new Date().toLocaleString()}</p>
        
        <h2>📍 Trip Details</h2>
        <table>
            <tr><td>Origin</td><td>${currentTripData.origin}</td></tr>
            <tr><td>Destination</td><td>${currentTripData.destination}</td></tr>
            <tr><td>Distance (km)</td><td>${currentTripData.distance_km}</td></tr>
            <tr><td>Travel Days</td><td>${currentTripData.travel_days}</td></tr>
        </table>

        <h2>🚛 Vehicle Details</h2>
        <table>
            <tr><td>Brand</td><td>${selectedVehicle.brand}</td></tr>
            <tr><td>Model</td><td>${selectedVehicle.model}</td></tr>
            <tr><td>Category</td><td>${selectedVehicle.category}</td></tr>
            <tr><td>Capacity (Tons)</td><td>${selectedVehicle.capacity}</td></tr>
            <tr><td>Mileage (km/L)</td><td>${selectedVehicle.mileage}</td></tr>
            <tr><td>Fuel Type</td><td>${selectedVehicle.fuelType.toUpperCase()}</td></tr>
            <tr><td>CAPEX (₹)</td><td>₹${selectedVehicle.capex.toLocaleString()}</td></tr>
        </table>

        <h2>⛽ Fuel Information</h2>
        <table>
            <tr><td>Fuel Price</td><td>₹${fuelPrices[selectedVehicle.fuelType].toFixed(2)}/L</td></tr>
            <tr><td>Fuel Required</td><td>${window.tripCostResult.fuelRequiredLiters.toFixed(2)} L</td></tr>
            <tr><td>Fuel Cost/km</td><td>₹${window.tripCostResult.fuelCostPerKm.toFixed(2)}</td></tr>
            <tr><td>Total Fuel Cost</td><td>₹${window.tripCostResult.fuelCostPerTrip.toFixed(2)}</td></tr>
        </table>

        <h2>💰 Fixed Costs Breakdown</h2>
        <table>
            <tr>
                <th>Component</th>
                <th>Per Day (₹)</th>
                <th>Per Trip (₹)</th>
                <th>Per KM (₹)</th>
            </tr>
            <tr>
                <td>Depreciation</td>
                <td>${window.tripCostResult.depreciationPerDay.toFixed(2)}</td>
                <td>${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days).toFixed(2)}</td>
                <td>${(window.tripCostResult.depreciationPerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}</td>
            </tr>
            <tr>
                <td>Insurance</td>
                <td>${window.tripCostResult.insurancePerDay.toFixed(2)}</td>
                <td>${(window.tripCostResult.insurancePerDay * currentTripData.travel_days).toFixed(2)}</td>
                <td>${(window.tripCostResult.insurancePerDay * currentTripData.travel_days / currentTripData.distance_km).toFixed(2)}</td>
            </tr>
            <tr style="background: #f0f4ff; font-weight: bold;">
                <td>TOTAL FIXED</td>
                <td>₹${(window.tripCostResult.fixedPerDay).toFixed(2)}</td>
                <td>₹${window.tripCostResult.fixedPerTrip.toFixed(2)}</td>
                <td>₹${window.tripCostResult.fixedPerKm.toFixed(2)}</td>
            </tr>
        </table>

        <h2>💨 Variable Costs Breakdown</h2>
        <table>
            <tr>
                <th>Component</th>
                <th>Per KM (₹)</th>
                <th>Per Trip (₹)</th>
            </tr>
            <tr>
                <td>Fuel Cost</td>
                <td>${window.tripCostResult.fuelCostPerKm.toFixed(2)}</td>
                <td>${window.tripCostResult.fuelCostPerTrip.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Tyre Cost</td>
                <td>${window.tripCostResult.tyreCostPerKm.toFixed(2)}</td>
                <td>${window.tripCostResult.tyreCostPerTrip.toFixed(2)}</td>
            </tr>
            <tr style="background: #f0f4ff; font-weight: bold;">
                <td>TOTAL VARIABLE</td>
                <td>₹${window.tripCostResult.totalVariablePerKm.toFixed(2)}</td>
                <td>₹${window.tripCostResult.variablePerTrip.toFixed(2)}</td>
            </tr>
        </table>

        <h2>🛣️ Toll Costs</h2>
        <table>
            <tr>
                <td>Per KM</td>
                <td>₹${window.tripCostResult.tollPerKm.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Per Trip</td>
                <td>₹${window.tripCostResult.tollPerTrip.toFixed(2)}</td>
            </tr>
        </table>

        <h2>🎯 Final Cost Summary</h2>
        <div class="cost-box">
            <p><strong>Operating Cost:</strong> ₹${window.tripCostResult.operatingCost.toFixed(2)}</p>
            <p><strong>SG&A Overhead (5%):</strong> ₹${window.tripCostResult.sgandaCost.toFixed(2)}</p>
            <p><strong>Profit Margin (5%):</strong> ₹${window.tripCostResult.marginCost.toFixed(2)}</p>
        </div>
        
        <div class="summary">
            <p class="highlight">TOTAL TRIP COST: ₹${window.tripCostResult.totalCost.toFixed(2)}</p>
            <p class="highlight">COST PER KM: ₹${window.tripCostResult.costPerKm.toFixed(2)}</p>
        </div>

        <h2>📊 Cost Distribution (%)</h2>
        <table>
            <tr>
                <td>Fixed Cost</td>
                <td>${((window.tripCostResult.fixedPerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Variable Cost</td>
                <td>${((window.tripCostResult.variablePerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Toll Cost</td>
                <td>${((window.tripCostResult.tollPerTrip / window.tripCostResult.operatingCost) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>SG&A</td>
                <td>${((window.tripCostResult.sgandaCost / window.tripCostResult.totalCost) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>Profit</td>
                <td>${((window.tripCostResult.marginCost / window.tripCostResult.totalCost) * 100).toFixed(2)}%</td>
            </tr>
        </table>

        <p style="margin-top: 40px; text-align: center; color: #999; font-size: 0.9em;">
            Report ID: FCP-${Date.now()} | Generated on ${new Date().toLocaleString()}
        </p>
    </body>
    </html>
    `;

    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
}

function resetToStart() {
    currentTripData = null;
    selectedVehicle = null;
    selectedCategory = 'All';
    tollCost = 0;

    document.getElementById('step5').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('stepIndicator').classList.remove('step-5');

    resetForm();
}

document.addEventListener('DOMContentLoaded', function () {
    validateForm();
    updateFuelPriceDisplay();
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.form-group-wrapper')) {
        document.getElementById('originSuggestions').classList.remove('active');
        document.getElementById('destinationSuggestions').classList.remove('active');
    }
});


