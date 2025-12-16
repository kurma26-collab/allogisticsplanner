// Fuel prices (updated as of Dec 10, 2025)
let fuelPrices = {
    diesel: 87.67,
    petrol: 94.77,
    cng: 77.09
};

// Trip Master Data - Cleaned & Verified
const tripMaster = [
    { route: "Alwar-Chennai", origin: "Alwar", destination: "Chennai", distance_km: 2107, travel_days: 5, toll_cost: 7185 },
    { route: "Alwar-Hosur", origin: "Alwar", destination: "Hosur", distance_km: 2114, travel_days: 5, toll_cost: 5825 },
    { route: "Alwar-Lucknow", origin: "Alwar", destination: "Lucknow", distance_km: 499, travel_days: 1, toll_cost: 590 },
    { route: "Alwar-Pantnagar", origin: "Alwar", destination: "Pantnagar", distance_km: 425, travel_days: 1, toll_cost: 1960 },
    { route: "Alwar-Vijayawada", origin: "Alwar", destination: "Vijayawada", distance_km: 1745, travel_days: 4, toll_cost: 4360 },
    { route: "Bangalore-Alwar", origin: "Bangalore", destination: "Alwar", distance_km: 2106, travel_days: 5, toll_cost: 4370 },
    { route: "Bangalore-Chennai", origin: "Bangalore", destination: "Chennai", distance_km: 309, travel_days: 1, toll_cost: 2185 },
    { route: "Bangalore-Pantnagar", origin: "Bangalore", destination: "Pantnagar", distance_km: 2226, travel_days: 5, toll_cost: 8985 },
    { route: "Bhandara-Chennai", origin: "Bhandara", destination: "Chennai", distance_km: 1186, travel_days: 3, toll_cost: 1725 },
    { route: "Bhandara-Coimbatore", origin: "Bhandara", destination: "Coimbatore", distance_km: 1514, travel_days: 3, toll_cost: 4975 },
    { route: "Bhandara-Pantnagar", origin: "Bhandara", destination: "Pantnagar", distance_km: 1109, travel_days: 3, toll_cost: 2250 },
    { route: "Chennai-Alwar", origin: "Chennai", destination: "Alwar", distance_km: 2099, travel_days: 5, toll_cost: 10000 },
    { route: "Chennai-Bangalore", origin: "Chennai", destination: "Bangalore", distance_km: 309, travel_days: 1, toll_cost: 2185 },
    { route: "Chennai-Bhandara", origin: "Chennai", destination: "Bhandara", distance_km: 1186, travel_days: 3, toll_cost: 1725 },
    { route: "Chennai-Hosur", origin: "Chennai", destination: "Hosur", distance_km: 323, travel_days: 1, toll_cost: 1930 },
    { route: "Chennai-Jabalpur", origin: "Chennai", destination: "Jabalpur", distance_km: 1400, travel_days: 3, toll_cost: 6510 },
    { route: "Chennai-Lucknow", origin: "Chennai", destination: "Lucknow", distance_km: 1848, travel_days: 5, toll_cost: 7588 },
    { route: "Chennai-Pantnagar", origin: "Chennai", destination: "Pantnagar", distance_km: 2218, travel_days: 5, toll_cost: 8995 },
    { route: "Chennai-Vijayawada", origin: "Chennai", destination: "Vijayawada", distance_km: 510, travel_days: 1, toll_cost: 2685 },
    { route: "Ennore-Sriperumpudur", origin: "Ennore", destination: "Sriperumpudur", distance_km: 66, travel_days: 1, toll_cost: 560 },
    { route: "Hosur-Alwar", origin: "Hosur", destination: "Alwar", distance_km: 2106, travel_days: 5, toll_cost: 11330 },
    { route: "Hosur-Chennai", origin: "Hosur", destination: "Chennai", distance_km: 309, travel_days: 1, toll_cost: 3860 },
    { route: "Hosur-Hosur", origin: "Hosur", destination: "Hosur", distance_km: 14, travel_days: 1, toll_cost: 0 },
    { route: "Hosur-Jabalpur", origin: "Hosur", destination: "Jabalpur", distance_km: 1407, travel_days: 3, toll_cost: 6415 },
    { route: "Hosur-Lucknow", origin: "Hosur", destination: "Lucknow", distance_km: 1888, travel_days: 5, toll_cost: 8870 },
    { route: "Hosur-Pantnagar", origin: "Hosur", destination: "Pantnagar", distance_km: 2225, travel_days: 5, toll_cost: 10630 },
    { route: "Jabalpur-Hosur", origin: "Jabalpur", destination: "Hosur", distance_km: 1407, travel_days: 3, toll_cost: 5110 },
    { route: "Lucknow-Alwar", origin: "Lucknow", destination: "Alwar", distance_km: 499, travel_days: 1, toll_cost: 385 },
    { route: "Lucknow-Chennai", origin: "Lucknow", destination: "Chennai", distance_km: 1848, travel_days: 5, toll_cost: 11836 },
    { route: "Lucknow-Hosur", origin: "Lucknow", destination: "Hosur", distance_km: 1888, travel_days: 5, toll_cost: 7365 },
    { route: "Lucknow-Pantnagar", origin: "Lucknow", destination: "Pantnagar", distance_km: 341, travel_days: 1, toll_cost: 560 },
    { route: "Pantnagar-Alwar", origin: "Pantnagar", destination: "Alwar", distance_km: 415, travel_days: 1, toll_cost: 1960 },
    { route: "Pantnagar-Bangalore", origin: "Pantnagar", destination: "Bangalore", distance_km: 2226, travel_days: 5, toll_cost: 8995 },
    { route: "Pantnagar-Bhandara", origin: "Pantnagar", destination: "Bhandara", distance_km: 1102, travel_days: 3, toll_cost: 2250 },
    { route: "Pantnagar-Chennai", origin: "Pantnagar", destination: "Chennai", distance_km: 2218, travel_days: 5, toll_cost: 8995 },
    { route: "Pantnagar-Hosur", origin: "Pantnagar", destination: "Hosur", distance_km: 2226, travel_days: 5, toll_cost: 10630 },
    { route: "Pantnagar-Lucknow", origin: "Pantnagar", destination: "Lucknow", distance_km: 341, travel_days: 1, toll_cost: 560 },
    { route: "Sriperumpudur-Ennore", origin: "Sriperumpudur", destination: "Ennore", distance_km: 66, travel_days: 1, toll_cost: 615 },
    { route: "Vijayawada-Alwar", origin: "Vijayawada", destination: "Alwar", distance_km: 1745, travel_days: 4, toll_cost: 1850 },
    { route: "Viralimalai-Vijayawada", origin: "Viralimalai", destination: "Vijayawada", distance_km: 852, travel_days: 2, toll_cost: 5165 }
];

// Vehicle Fleet - 51 Vehicles (Sample - Include all from previous version)
let vehicleFleet = [
    // LCV Category
    { id: 1, category: "LCV", brand: "TATA", model: "Ace Gold", capacity: 0.9, body_type: "Closed", tyres: 4, mileage: 21, fuelType: "diesel", price: "4.50-6.69", capex: 650000, tyreCost: 8000, tyreLife: 80000, driverNormal: 1500, npPermit: 15000 },
    { id: 2, category: "LCV", brand: "Mahindra", model: "Jeeto", capacity: 0.715, body_type: "Closed", tyres: 4, mileage: 20, fuelType: "diesel", price: "4.79-5.67", capex: 550000, tyreCost: 7500, tyreLife: 80000, driverNormal: 1500, npPermit: 15000 },
    { id: 3, category: "LCV", brand: "Maruti", model: "Super Carry", capacity: 0.625, body_type: "Closed", tyres: 4, mileage: 20, fuelType: "petrol", price: "5.49-6.64", capex: 600000, tyreCost: 7000, tyreLife: 80000, driverNormal: 1500, npPermit: 15000 },
    { id: 4, category: "LCV", brand: "Ashok Leyland", model: "Dost", capacity: 1.0, body_type: "Open", tyres: 4, mileage: 19, fuelType: "diesel", price: "8.25-8.70", capex: 825000, tyreCost: 8500, tyreLife: 80000, driverNormal: 1800, npPermit: 18000 },
    { id: 5, category: "LCV", brand: "TATA", model: "407", capacity: 2.5, body_type: "Open", tyres: 6, mileage: 12, fuelType: "diesel", price: "13.26-14.30", capex: 1350000, tyreCost: 9000, tyreLife: 80000, driverNormal: 2000, npPermit: 20000 },
    { id: 6, category: "LCV", brand: "TATA", model: "Ace HT", capacity: 0.75, body_type: "Closed", tyres: 4, mileage: 22, fuelType: "diesel", price: "4.80-6.20", capex: 600000, tyreCost: 8000, tyreLife: 80000, driverNormal: 1500, npPermit: 15000 },
    { id: 7, category: "LCV", brand: "TATA", model: "Intra V30", capacity: 1.5, body_type: "Open", tyres: 4, mileage: 15, fuelType: "diesel", price: "7.50-9.20", capex: 850000, tyreCost: 8500, tyreLife: 80000, driverNormal: 1800, npPermit: 18000 },
    { id: 8, category: "LCV", brand: "Ashok Leyland", model: "Dost Plus", capacity: 1.25, body_type: "Open", tyres: 4, mileage: 18, fuelType: "diesel", price: "8.50-9.80", capex: 900000, tyreCost: 8500, tyreLife: 80000, driverNormal: 1800, npPermit: 18000 },
    { id: 9, category: "LCV", brand: "Mahindra", model: "Bolero Pickup", capacity: 1.0, body_type: "Open", tyres: 4, mileage: 16, fuelType: "diesel", price: "7.20-8.50", capex: 800000, tyreCost: 8000, tyreLife: 80000, driverNormal: 1800, npPermit: 18000 },
    { id: 10, category: "LCV", brand: "Mahindra", model: "Bolero Maxitruck", capacity: 1.5, body_type: "Open", tyres: 4, mileage: 14, fuelType: "diesel", price: "9.50-11.20", capex: 950000, tyreCost: 8500, tyreLife: 80000, driverNormal: 1800, npPermit: 18000 },
    { id: 11, category: "LCV", brand: "Eicher", model: "Pro 1049", capacity: 2.5, body_type: "Open", tyres: 6, mileage: 13, fuelType: "diesel", price: "12.50-14.80", capex: 1300000, tyreCost: 9000, tyreLife: 80000, driverNormal: 2000, npPermit: 20000 },
    { id: 12, category: "LCV", brand: "BharatBenz", model: "1017", capacity: 3.0, body_type: "Open", tyres: 6, mileage: 12, fuelType: "diesel", price: "14.50-16.20", capex: 1500000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2000, npPermit: 20000 },

    // MCV Category
    { id: 13, category: "MCV", brand: "TATA", model: "1109 Ex", capacity: 4.0, body_type: "Open", tyres: 6, mileage: 10, fuelType: "diesel", price: "16.50-18.90", capex: 1700000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2200, npPermit: 22000 },
    { id: 14, category: "MCV", brand: "Ashok Leyland", model: "U3718", capacity: 4.0, body_type: "Open", tyres: 6, mileage: 8.6, fuelType: "diesel", price: "15.80-17.50", capex: 1650000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2200, npPermit: 22000 },
    { id: 15, category: "MCV", brand: "Eicher", model: "Pro 1095", capacity: 4.0, body_type: "Open", tyres: 6, mileage: 9.6, fuelType: "diesel", price: "16.20-18.50", capex: 1700000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2200, npPermit: 22000 },
    { id: 16, category: "MCV", brand: "BharatBenz", model: "1215R", capacity: 4.5, body_type: "Closed", tyres: 6, mileage: 8, fuelType: "diesel", price: "18.50-20.80", capex: 1900000, tyreCost: 10000, tyreLife: 80000, driverNormal: 2300, npPermit: 23000 },
    { id: 17, category: "MCV", brand: "Mahindra", model: "Furio 9", capacity: 3.5, body_type: "Closed", tyres: 6, mileage: 8.6, fuelType: "diesel", price: "17.20-19.50", capex: 1800000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2300, npPermit: 23000 },
    { id: 18, category: "MCV", brand: "TATA", model: "LPT 1216", capacity: 5.0, body_type: "Open", tyres: 6, mileage: 8, fuelType: "diesel", price: "19.50-22.00", capex: 2000000, tyreCost: 10000, tyreLife: 80000, driverNormal: 2400, npPermit: 24000 },
    { id: 19, category: "MCV", brand: "Ashok Leyland", model: "2516", capacity: 5.5, body_type: "Open", tyres: 10, mileage: 7.5, fuelType: "diesel", price: "21.00-24.00", capex: 2200000, tyreCost: 10500, tyreLife: 80000, driverNormal: 2500, npPermit: 25000 },
    { id: 20, category: "MCV", brand: "Eicher", model: "Pro 2049", capacity: 5.0, body_type: "Open", tyres: 10, mileage: 7.8, fuelType: "diesel", price: "20.50-23.00", capex: 2100000, tyreCost: 10000, tyreLife: 80000, driverNormal: 2500, npPermit: 25000 },

    // HCV Category (7 vehicles - keeping sample)
    { id: 21, category: "HCV", brand: "TATA", model: "Signa 3018.T", capacity: 8.0, body_type: "Open", tyres: 10, mileage: 6.5, fuelType: "diesel", price: "26.50-29.50", capex: 2700000, tyreCost: 11000, tyreLife: 80000, driverNormal: 2800, npPermit: 28000 },
    { id: 22, category: "HCV", brand: "TATA", model: "1623 RR", capacity: 12.0, body_type: "Open", tyres: 10, mileage: 5.5, fuelType: "diesel", price: "32.00-36.00", capex: 3300000, tyreCost: 12000, tyreLife: 80000, driverNormal: 3000, npPermit: 30000 },
    { id: 23, category: "HCV", brand: "Ashok Leyland", model: "3118", capacity: 10.0, body_type: "Open", tyres: 12, mileage: 5, fuelType: "diesel", price: "30.00-33.50", capex: 3100000, tyreCost: 11500, tyreLife: 80000, driverNormal: 2900, npPermit: 29000 },
    { id: 24, category: "HCV", brand: "BharatBenz", model: "2823R", capacity: 12.0, body_type: "Open", tyres: 12, mileage: 5.2, fuelType: "diesel", price: "31.50-35.00", capex: 3200000, tyreCost: 12000, tyreLife: 80000, driverNormal: 3000, npPermit: 30000 },
    { id: 25, category: "HCV", brand: "Volvo", model: "FM 9 440", capacity: 13.0, body_type: "Open", tyres: 12, mileage: 5.8, fuelType: "diesel", price: "35.00-40.00", capex: 3600000, tyreCost: 12500, tyreLife: 80000, driverNormal: 3200, npPermit: 32000 },
    { id: 26, category: "HCV", brand: "Scania", model: "P340", capacity: 14.0, body_type: "Open", tyres: 12, mileage: 5.5, fuelType: "diesel", price: "38.00-45.00", capex: 4000000, tyreCost: 13000, tyreLife: 80000, driverNormal: 3300, npPermit: 33000 },
    { id: 27, category: "HCV", brand: "Taurus", model: "35 Ton", capacity: 35.0, body_type: "Open", tyres: 16, mileage: 4.5, fuelType: "diesel", price: "40.00-45.00", capex: 4200000, tyreCost: 14000, tyreLife: 80000, driverNormal: 3500, npPermit: 35000 },

    // Container, Trailer, Tanker, Refrigerated, Tipper (keeping brief sample - 24 total)
    { id: 28, category: "Container", brand: "TATA", model: "Signa Container 20FT", capacity: 6.5, body_type: "Closed", tyres: 6, mileage: 8, fuelType: "diesel", price: "20.00-25.00", capex: 2200000, tyreCost: 10000, tyreLife: 80000, driverNormal: 2400, npPermit: 24000 },
    { id: 29, category: "Container", brand: "Ashok Leyland", model: "Container 20FT", capacity: 6.5, body_type: "Closed", tyres: 6, mileage: 7.5, fuelType: "diesel", price: "22.00-27.00", capex: 2350000, tyreCost: 10500, tyreLife: 80000, driverNormal: 2400, npPermit: 24000 },
    { id: 30, category: "Container", brand: "BharatBenz", model: "Container 20FT", capacity: 6.5, body_type: "Closed", tyres: 6, mileage: 8, fuelType: "diesel", price: "24.00-29.00", capex: 2600000, tyreCost: 10500, tyreLife: 80000, driverNormal: 2500, npPermit: 25000 },
    { id: 31, category: "Container", brand: "TATA", model: "Signa Container 32FT", capacity: 7.0, body_type: "Closed", tyres: 10, mileage: 6.5, fuelType: "diesel", price: "30.00-35.00", capex: 3200000, tyreCost: 11000, tyreLife: 80000, driverNormal: 2700, npPermit: 27000 },
    { id: 32, category: "Container", brand: "TATA", model: "Signa Container 32FT Heavy", capacity: 15.0, body_type: "Closed", tyres: 12, mileage: 6, fuelType: "diesel", price: "35.00-40.00", capex: 3700000, tyreCost: 12000, tyreLife: 80000, driverNormal: 2900, npPermit: 29000 },
    { id: 33, category: "Container", brand: "TATA", model: "Signa Container 40FT", capacity: 15.0, body_type: "Closed", tyres: 12, mileage: 5.5, fuelType: "diesel", price: "40.00-50.00", capex: 4300000, tyreCost: 12500, tyreLife: 80000, driverNormal: 3000, npPermit: 30000 },
    { id: 34, category: "Container", brand: "Ashok Leyland", model: "Container 40FT", capacity: 15.0, body_type: "Closed", tyres: 12, mileage: 5.5, fuelType: "diesel", price: "42.00-52.00", capex: 4500000, tyreCost: 12500, tyreLife: 80000, driverNormal: 3100, npPermit: 31000 },
    { id: 35, category: "Container", brand: "BharatBenz", model: "Container 40FT", capacity: 15.0, body_type: "Closed", tyres: 12, mileage: 5.5, fuelType: "diesel", price: "45.00-55.00", capex: 4800000, tyreCost: 13000, tyreLife: 80000, driverNormal: 3200, npPermit: 32000 },

    { id: 36, category: "Trailer", brand: "TATA", model: "Prima Semi Trailer 32T", capacity: 32.0, body_type: "Open", tyres: 18, mileage: 4, fuelType: "diesel", price: "45.00-55.00", capex: 5000000, tyreCost: 14000, tyreLife: 80000, driverNormal: 3500, npPermit: 35000 },
    { id: 37, category: "Trailer", brand: "Ashok Leyland", model: "Semi Trailer 35T", capacity: 35.0, body_type: "Open", tyres: 20, mileage: 3.8, fuelType: "diesel", price: "50.00-60.00", capex: 5500000, tyreCost: 15000, tyreLife: 80000, driverNormal: 3700, npPermit: 37000 },
    { id: 38, category: "Trailer", brand: "BharatBenz", model: "Multi Axle Trailer 40T", capacity: 40.0, body_type: "Open", tyres: 22, mileage: 3.5, fuelType: "diesel", price: "60.00-75.00", capex: 6500000, tyreCost: 16000, tyreLife: 80000, driverNormal: 4000, npPermit: 40000 },
    { id: 39, category: "Trailer", brand: "Volvo", model: "FM 500 with Trailer", capacity: 38.0, body_type: "Open", tyres: 20, mileage: 3.8, fuelType: "diesel", price: "65.00-80.00", capex: 7000000, tyreCost: 15500, tyreLife: 80000, driverNormal: 4000, npPermit: 40000 },
    { id: 40, category: "Trailer", brand: "Scania", model: "R440 with Trailer", capacity: 42.0, body_type: "Open", tyres: 22, mileage: 3.6, fuelType: "diesel", price: "70.00-85.00", capex: 7500000, tyreCost: 16500, tyreLife: 80000, driverNormal: 4200, npPermit: 42000 },

    { id: 41, category: "Tanker", brand: "TATA", model: "Signa Tanker 10000L", capacity: 6.0, body_type: "Tanker", tyres: 6, mileage: 7, fuelType: "diesel", price: "25.00-30.00", capex: 2700000, tyreCost: 10500, tyreLife: 80000, driverNormal: 2500, npPermit: 25000 },
    { id: 42, category: "Tanker", brand: "Ashok Leyland", model: "Tanker 10000L", capacity: 6.0, body_type: "Tanker", tyres: 6, mileage: 6.8, fuelType: "diesel", price: "26.00-31.00", capex: 2800000, tyreCost: 10500, tyreLife: 80000, driverNormal: 2500, npPermit: 25000 },
    { id: 43, category: "Tanker", brand: "BharatBenz", model: "Tanker 12000L", capacity: 8.0, body_type: "Tanker", tyres: 10, mileage: 6.5, fuelType: "diesel", price: "32.00-38.00", capex: 3400000, tyreCost: 11500, tyreLife: 80000, driverNormal: 2800, npPermit: 28000 },
    { id: 44, category: "Tanker", brand: "TATA", model: "Signa Tanker 15000L", capacity: 10.0, body_type: "Tanker", tyres: 10, mileage: 6, fuelType: "diesel", price: "35.00-42.00", capex: 3800000, tyreCost: 12000, tyreLife: 80000, driverNormal: 3000, npPermit: 30000 },

    { id: 45, category: "Refrigerated", brand: "TATA", model: "Signa Reefer 15T", capacity: 8.0, body_type: "Reefer", tyres: 10, mileage: 5.5, fuelType: "diesel", price: "48.00-55.00", capex: 5200000, tyreCost: 12000, tyreLife: 80000, driverNormal: 3200, npPermit: 32000 },
    { id: 46, category: "Refrigerated", brand: "Ashok Leyland", model: "Reefer 18T", capacity: 10.0, body_type: "Reefer", tyres: 10, mileage: 5.2, fuelType: "diesel", price: "50.00-57.00", capex: 5400000, tyreCost: 12500, tyreLife: 80000, driverNormal: 3300, npPermit: 33000 },
    { id: 47, category: "Refrigerated", brand: "BharatBenz", model: "Premium Reefer 20T", capacity: 12.0, body_type: "Reefer", tyres: 12, mileage: 5, fuelType: "diesel", price: "55.00-65.00", capex: 6000000, tyreCost: 13000, tyreLife: 80000, driverNormal: 3500, npPermit: 35000 },

    { id: 48, category: "Tipper", brand: "TATA", model: "407 Tipper", capacity: 3.0, body_type: "Tipper", tyres: 6, mileage: 11, fuelType: "diesel", price: "16.00-18.50", capex: 1750000, tyreCost: 9500, tyreLife: 80000, driverNormal: 2200, npPermit: 22000 },
    { id: 49, category: "Tipper", brand: "Ashok Leyland", model: "2018 Tipper", capacity: 4.5, body_type: "Tipper", tyres: 10, mileage: 7.5, fuelType: "diesel", price: "24.00-27.50", capex: 2500000, tyreCost: 11000, tyreLife: 80000, driverNormal: 2600, npPermit: 26000 },
    { id: 50, category: "Tipper", brand: "Eicher", model: "Pro 6010 Tipper", capacity: 5.0, body_type: "Tipper", tyres: 10, mileage: 7, fuelType: "diesel", price: "26.50-30.00", capex: 2800000, tyreCost: 11500, tyreLife: 80000, driverNormal: 2700, npPermit: 27000 },
    { id: 51, category: "Tipper", brand: "BharatBenz", model: "3018 Tipper", capacity: 8.0, body_type: "Tipper", tyres: 12, mileage: 6, fuelType: "diesel", price: "32.00-36.50", capex: 3400000, tyreCost: 12500, tyreLife: 80000, driverNormal: 3000, npPermit: 30000 }
];

// Dynamically populate tollCostDatabase from tripMaster for consistency
const tollCostDatabase = tripMaster.reduce((acc, trip) => {
    acc[`${trip.origin}-${trip.destination}`] = trip.toll_cost;
    return acc;
}, {});