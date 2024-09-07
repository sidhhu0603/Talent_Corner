import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Filter(props) {
    const [data, setData] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [data1, setData1] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [ugDegrees, setUgDegrees] = useState([]);
    const [selectedUgDegrees, setSelectedUgDegrees] = useState([]);
    const [pgDegrees, setPgDegrees] = useState([]);
    const [selectedPgDegrees, setSelectedPgDegrees] = useState([]);
    const [annSalaries, setAnnSalaries] = useState([]);
    const [selectedAnnSalaries, setSelectedAnnSalaries] = useState([]);
    const [yearsOfExperience, setYearsOfExperience] = useState([]);
    const [selectedYearsOfExperience, setSelectedYearsOfExperience] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedAge, setSelectedAge] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const CACHE_TIMEOUT = 3600000; // 1 hour (optional)

    const fetchData = async () => {
        try {
            const cachedData = localStorage.getItem('cachedData');
            const cachedTime = localStorage.getItem('cachedTime');
            const currentTime = new Date().getTime();

            if (cachedData && cachedTime && (currentTime - cachedTime < CACHE_TIMEOUT)) {
                const parsedData = JSON.parse(cachedData);
                setData(parsedData.data);
                setData1(parsedData.data1);
                setUgDegrees(parsedData.ugDegrees);
                setPgDegrees(parsedData.pgDegrees);
                setAnnSalaries(parsedData.annSalaries);
                setYearsOfExperience(parsedData.yearsOfExperience);
            } else {
                const response = await axios.get('https://talent-corner-b7v4.onrender.com/api/data');
                const dataResponse = response.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setData(dataResponse);

                const response1 = await axios.get('https://talent-corner-b7v4.onrender.com/api/data1');
                const data1Response = response1.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setData1(data1Response);

                const response2 = await axios.get('https://talent-corner-b7v4.onrender.com/api/ug-degrees');
                const ugDegreesResponse = response2.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setUgDegrees(ugDegreesResponse);

                const response3 = await axios.get('https://talent-corner-b7v4.onrender.com/api/pg-degrees');
                const pgDegreesResponse = response3.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setPgDegrees(pgDegreesResponse);

                const response4 = await axios.get('https://talent-corner-b7v4.onrender.com/api/ann-salaries');
                const annSalariesResponse = response4.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setAnnSalaries(annSalariesResponse);

                const response5 = await axios.get('https://talent-corner-b7v4.onrender.com/api/years-of-experience');
                const yearsOfExperienceResponse = response5.data.map((item, index) => ({ ...item, uniqueId: index + 1 }));
                setYearsOfExperience(yearsOfExperienceResponse);

                // Store all responses in localStorage with a timestamp
                localStorage.setItem('cachedData', JSON.stringify({
                    data: dataResponse,
                    data1: data1Response,
                    ugDegrees: ugDegreesResponse,
                    pgDegrees: pgDegreesResponse,
                    annSalaries: annSalariesResponse,
                    yearsOfExperience: yearsOfExperienceResponse,
                }));
                localStorage.setItem('cachedTime', currentTime);
            }

            fetchFilteredData();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const fetchFilteredData = async () => {
        try {
            // Construct cache key based on the filter parameters
            const cacheKey = `filteredData_${JSON.stringify({
                roles: selectedRoles.map(item => item.label),
                locations: selectedLocations.map(item => item.label),
                ug_degrees: selectedUgDegrees.map(item => item.label),
                pg_degrees: selectedPgDegrees.map(item => item.label),
                ann_salaries: selectedAnnSalaries.map(item => item.label),
                years_of_experience: selectedYearsOfExperience.map(item => item.label),
                Gender: selectedGender,
                Age: selectedAge,
                page: currentPage
            })}`;
    
            // Check if the data is already in the cache
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { data, totalPages } = JSON.parse(cachedData);
                setFilteredData(data);
                setTotalPages(totalPages);
                return; // Skip API call if data is found in cache
            }
    
            // If no cached data, proceed with the API call
            const selectedRolesArray = selectedRoles.map(item => item.label);
            const selectedLocationsArray = selectedLocations.map(item => item.label);
            const selectedUgDegreesArray = selectedUgDegrees.map(item => item.label);
            const selectedPgDegreesArray = selectedPgDegrees.map(item => item.label);
            const selectedAnnSalariesArray = selectedAnnSalaries.map(item => item.label);
            const selectedYearsOfExperienceArray = selectedYearsOfExperience.map(item => item.label);
    
            const response = await axios.get('https://talent-corner-b7v4.onrender.com/api/filter', {
                params: {
                    roles: selectedRolesArray,
                    locations: selectedLocationsArray,
                    ug_degrees: selectedUgDegreesArray,
                    pg_degrees: selectedPgDegreesArray,
                    ann_salaries: selectedAnnSalariesArray,
                    years_of_experience: selectedYearsOfExperienceArray,
                    Gender: selectedGender,
                    Age: selectedAge,
                    page: currentPage,
                    limit: 20
                }
            });
    
            const fetchedData = response.data;
            const totalPageCount = Math.ceil(response.headers['x-total-count'] / 20);
    
            // Set the fetched data to state
            setFilteredData(fetchedData);
            setTotalPages(totalPageCount);
    
            // Cache the fetched data
            localStorage.setItem(cacheKey, JSON.stringify({
                data: fetchedData,
                totalPages: totalPageCount
            }));
    
        } catch (error) {
            console.error('Error filtering data:', error);
        }
    };
    

    useEffect(() => {
        fetchFilteredData();
    }, [selectedRoles, selectedLocations, selectedUgDegrees, selectedPgDegrees, selectedAnnSalaries, selectedYearsOfExperience, selectedGender, selectedAge, currentPage]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
      };
    
      const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
      };

    const handleWhatsAppClick = (contactNo) => {
        const message = "Please send your updated CV";
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${contactNo}?text=${encodedMessage}`, '_blank');
    };

    const handleEmailClick = (emailId) => {
        const url = `mailto:${emailId}`;
        window.open(url, '_blank');
    };

    const handleCallClick = (contactNo) => {
        window.location.href = `tel:${contactNo}`;
    };

    const handleProfileClick = (contactNo) => {
        navigate(`/profiles/${contactNo}`);
    };

    const handleCheckboxChange = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(item => item !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleSelectAll = () => {
        if (selectedRows.length === filteredData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows([...filteredData]);
        }
    };

    const handleExport = () => {
        const dataToExport = selectedRows.map(row => ({
            Name: row.Name_1,
            Role: row.Role,
            Experience: row.years_of_experience,
            Location: row.current_location,
            State: row.State,
            Department: row.Department,
            Contact: row.contact_no,
            Email: row.email_id,
            Ann_Salary: row.ann_salary,
            Industry: row.Industry,
            Current_Company_Name: row.curr_company_name,
            Current_Company_Duration_From: row.curr_company_duration_from,
            Current_Company_Designation: row.curr_company_designation,
            Previous_Company_Name: row.prev_employer_name,
            UG_Degree: row.ug_degree,
            UG_Specialization: row.ug_specialization,
            UG_Year: row.ug_year,
            PG_Degree: row.pg_degree,
            PG_Specialization: row.pg_specialization,
            PG_Year: row.pg_year,
            PG_College: row.pg_college,
            Gender: row.Gender,
            Marital_Status: row.marital_status,
            Age: row.Age
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Profiles");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'SelectedProfiles.xlsx');
    };

   

    const styles = {
        app: {
            fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent:'center',
            overflow: 'auto',
            backgroundColor: '#f4f9f4',
            marginTop:'15px',
            maxHeight: 'calc(100vh - 20px)', /* Limit the height of the page to the viewport height minus top margin */
        },
        tableContainer: {
            margin: '20px auto',
            maxHeight: '450px',
            fontSize: '16px',
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
            overflow: 'auto',
            color: 'purple',
            fontWeight: '200',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            padding: '20px', /* Add padding to avoid table touching the container borders */
            borderRadius: '10px', /* Round the corners of the table container */
        },
        table: {
            overflow:'auto',
            borderCollapse: 'separate', /* Use separate to apply spacing between rows */
            backgroundColor: '#fff',
            borderSpacing: '0 12px', /* Space between rows */
        },
        thTd: {
            padding: '8px',
            marginTop: '0px',
            textAlign: 'left',
        },
        thCheckbox: {
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        th: {
            borderBottom: '2px solid #ddd',
            textAlign: 'left',
            border:'none',
            paddingLeft: '10px',
            paddingTop: '0px',
            paddingBottom: '0px',
            backgroundColor: '#fff',
        },
        tr: {
            borderRadius: '10px', /* Round the corners of the rows */
            backgroundColor: '#fff',
            boxShadow: '0 5px 5px rgba(0, 0, 0, 0.1)', /* Add a slight shadow for better visibility */
            border: 'none',
            padding:'10px',
        },
        td: {
              border: 'none',
            padding:'10px',
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
        },
        button: {
            margin: '0 5px',
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#674F7F',
            color: '#fff',
            borderRadius: '10px',
            cursor: 'pointer',
        },
        actionCell: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '18px', /* Add gap between icons */
        },
        i:{
            cursor: 'pointer',
        },
        iconPurpleDark: {
            color: '#6a0dad',
        },
        filterBar: {
            backgroundColor: '#fff',
            padding: '12px',
            borderRadius: '20px',
            marginTop:'45px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            gap: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'space-between',
        },
        filterItem: {
            border: 'none',
            outline: '0px',
            alignItems: 'center',
            width:'200px',
            justifyContent:'space-around',
        },
        radioContainer: {
            display: 'flex',
            alignItems: 'center',
            alignContent:'center',
        },
        radioLabel: {
            paddingTop:'6px',
            marginRight: '10px',
        },
        input: {
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '70px',
            margin: '0',
        },

        
    };

    return (
        <div style={{backgroundColor:'#f4f9f4', marginLeft:'120px'}}>
            <div className={props.sidebarOpen ? "page-content" : "page-content shifted"} style={{backgroundColor:'#f4f9f4'}}>
                <div style={styles.filterBar}>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={data.map(item => ({ label: item.Role, value: item.uniqueId }))}
                        value={selectedRoles}
                        onChange={setSelectedRoles}
                        labelledBy={"Select Role"}
                        overrideStrings={{ selectSomeItems: "Role" }}
                    />
                </div>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={ugDegrees.map(item => ({ label: item.ug_degree, value: item.uniqueId }))}
                        value={selectedUgDegrees}
                        onChange={setSelectedUgDegrees}
                        labelledBy={"Select UG Degree"}
                        overrideStrings={{ selectSomeItems: "UG Degree" }}
                    />
                </div>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={annSalaries.map(item => ({ label: item.ann_salary, value: item.uniqueId }))}
                        value={selectedAnnSalaries}
                        onChange={setSelectedAnnSalaries}
                        labelledBy={"Select Annual Salary"}
                        overrideStrings={{ selectSomeItems: "Annual Salary" }}
                    />
                </div>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={data1.map(item => ({ label: item.current_location, value: item.uniqueId }))}
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                        labelledBy={"Select Location"}
                        overrideStrings={{ selectSomeItems: "Location" }}
                    />
                </div>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={pgDegrees.map(item => ({ label: item.pg_degree, value: item.uniqueId }))}
                        value={selectedPgDegrees}
                        onChange={setSelectedPgDegrees}
                        labelledBy="Select PG Degree"
                        overrideStrings={{ selectSomeItems: "PG Degree" }}
                    />
                </div>
                <div style={styles.filterItem}>
                    <MultiSelect
                        className="multi-select-container" // Apply the class
                        options={yearsOfExperience.map(item => ({ label: item.years_of_experience, value: item.uniqueId }))}
                        value={selectedYearsOfExperience}
                        onChange={setSelectedYearsOfExperience}
                        labelledBy={"Select Years of Experience"}
                        overrideStrings={{ selectSomeItems: "Experience" }}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={selectedAge || ''}
                        onChange={(e) => setSelectedAge(e.target.value)}
                        style={styles.input}
                        placeholder='Age'
                    />
                </div>
                <div style={styles.filterItem}>
                    <div style={styles.radioContainer}>
                        <label style={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Male"
                                checked={selectedGender === "Male"}
                                onChange={() => setSelectedGender("Male")}
                            />
                            Male
                        </label>
                        <label style={styles.radioLabel}>
                            <input
                                type="radio"
                                value="Female"
                                checked={selectedGender === "Female"}
                                onChange={() => setSelectedGender("Female")}
                            />
                            Female
                        </label>
                    </div>
                </div>
                </div>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tr}>
                            <th style={{...styles.th, paddingLeft: '8px', }}>
                            <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                                    
                                />
                                    
                                </th>
                    
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Experience</th>
                                <th style={styles.th}>Location</th>
                                <th style={styles.th}>Department</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr style={styles.tr} key={index}>
                                    <td style={styles.td}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row)}
                                            onChange={() => handleCheckboxChange(row)}
                                            
                                        />
                                    </td>
                                    <td>
                                        <i 
                                            className="bi bi-person-circle" 
                                            style={{ marginRight: '8px', cursor: 'pointer' }} 
                                            onClick={() => handleProfileClick(row.contact_no)}
                                        ></i>
                                        {row.Name_1}
                                    </td>
                                    <td style={styles.thTd}>{row.Role}</td>
                                    <td style={styles.thTd}>{row.years_of_experience}</td>
                                    <td style={styles.thTd}>{row.current_location}</td>
                                    <td style={styles.thTd}>{row.Department}</td>
                                    <td style={{ ...styles.thTd, ...styles.actionCell }}>
                                        <i
                                            className="bi bi-whatsapp iconPurpleDark"
                                            style={{ marginRight: '8px', cursor: 'pointer' }}
                                            onClick={() => handleWhatsAppClick(row.contact_no)}
                                        ></i>
                                        <i
                                            className="bi bi-envelope iconPurpleDark"
                                            style={{ marginRight: '8px', cursor: 'pointer' }}
                                            onClick={() => handleEmailClick(row.email_id)}
                                        ></i>
                                        <i
                                            className="bi bi-telephone iconPurpleDark"
                                            style={{ marginRight: '8px', cursor: 'pointer' }}
                                            onClick={() => handleCallClick(row.contact_no)}
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={handleExport} style={styles.button}>Export Data</button>
                <div style={styles.pagination}>
                    <button
                        style={styles.button}
                        onClick={() => handlePrevPage()}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        style={styles.button}
                        onClick={() => handleNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Filter;
