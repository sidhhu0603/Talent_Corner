
const pool = require('./dbConfig');

function parseBooleanSearch(searchTerm) {
    const terms = searchTerm.match(/(?:[^\s"]+|"[^"]*")+/g);
    const conditions = terms.map(term => {
        if (term.includes('AND')) {
            const [field, value] = term.split('AND').map(s => s.trim());
            return `(${field} LIKE '%${value}%')`;
        } else if (term.includes('OR')) {
            const [field, value] = term.split('OR').map(s => s.trim());
            return `(${field} LIKE '%${value}%')`;
        } else if (term.includes('NOT')) {
            const [field, value] = term.split('NOT').map(s => s.trim());
            return `(${field} NOT LIKE '%${value}%')`;
        } else {
            return `(Name_1 LIKE '%${term}%' OR Role LIKE '%${term}%' OR current_location LIKE '%${term}%' OR email_id LIKE '%${term}%' OR contact_no LIKE '%${term}%')`;
        }
    });
    return conditions.join(' AND ');
}

async function getUserDetails(contactNo) {
    const query = `SELECT Name_1, email_id, contact_no, current_location, State, Department, Role, Industry, 
                    years_of_experience, ann_salary, curr_company_name, curr_company_duration_from, 
                    curr_company_designation, prev_employer_name, ug_degree, ug_specialization, ug_year, 
                    pg_degree, pg_specialization, pg_college, pg_year, Gender, marital_status, Age 
                    FROM naukri_details 
                    WHERE contact_no = ?`;

    try {
        const [rows] = await pool.query(query, [contactNo]);
        return rows[0]; // Assuming contact_no is unique and we get a single record
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getDetails(offset = 0, limit = 10, searchTerm = '', booleanSearch = false) {
    let query = `SELECT Name_1, Role, years_of_experience, current_location, contact_no, email_id FROM naukri_details`;

    if (searchTerm) {
        if (booleanSearch) {
            const booleanCondition = parseBooleanSearch(searchTerm);
            query += ` WHERE ${booleanCondition}`;
        } else {
            query += ` WHERE 
                LOWER(Name_1) LIKE '%${searchTerm}%' OR 
                LOWER(Role) LIKE '%${searchTerm}%' OR
                LOWER(current_location) LIKE '%${searchTerm}%' OR
                LOWER(email_id) LIKE '%${searchTerm}%' OR
                LOWER(contact_no) LIKE '%${searchTerm}%'`;
        }
    }

    query += ` ORDER BY Name_1 LIMIT ${limit} OFFSET ${offset}`;

    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function updateUserDetails(contactNo, userDetails) {
    const query = `UPDATE naukri_details SET 
                    Name_1 = ?, email_id = ?, contact_no = ?, current_location = ?, State = ?, Department = ?, 
                    Role = ?, Industry = ?, years_of_experience = ?, ann_salary = ?, curr_company_name = ?, 
                    curr_company_duration_from = ?, curr_company_designation = ?, prev_employer_name = ?, 
                    ug_degree = ?, ug_specialization = ?, ug_year = ?, pg_degree = ?, pg_specialization = ?, 
                    pg_college = ?, pg_year = ?, Gender = ?, marital_status = ?, Age = ?
                    WHERE contact_no = ?`;

    const values = [
        userDetails.Name_1, userDetails.email_id, userDetails.contact_no, userDetails.current_location, userDetails.State, 
        userDetails.Department, userDetails.Role, userDetails.Industry, userDetails.years_of_experience, userDetails.ann_salary, 
        userDetails.curr_company_name, userDetails.curr_company_duration_from, userDetails.curr_company_designation, 
        userDetails.prev_employer_name, userDetails.ug_degree, userDetails.ug_specialization, userDetails.ug_year, 
        userDetails.pg_degree, userDetails.pg_specialization, userDetails.pg_college, userDetails.pg_year, 
        userDetails.Gender, userDetails.marital_status, userDetails.Age, contactNo
    ];

    try {
        const [result] = await pool.query(query, values);
        return result;
    } catch (err) {
        console.log('Update Query Error:', err);
        throw err;
    }
}

async function getFiltered(roles, locations, ug_degrees, pg_degrees, ann_salaries, years_of_experience, Gender, Age, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM naukri_details WHERE 1=1`;

    if (roles && roles.length > 0) {
        const roleConditions = roles.map(role => ` Role='${role}'`).join(' OR ');
        query += ` AND (${roleConditions})`;
    }
    if (locations && locations.length > 0) {
        const locationConditions = locations.map(location => ` current_location='${location}'`).join(' OR ');
        query += ` AND (${locationConditions})`;
    }
    if (ug_degrees && ug_degrees.length > 0) {
        const ugDegreeConditions = ug_degrees.map(degree => ` ug_degree='${degree}'`).join(' OR ');
        query += ` AND (${ugDegreeConditions})`;
    }
    if (pg_degrees && pg_degrees.length > 0) {
        const pgDegreeConditions = pg_degrees.map(degree => ` pg_degree='${degree}'`).join(' OR ');
        query += ` AND (${pgDegreeConditions})`;
    }
    if (ann_salaries && ann_salaries.length > 0) {
        const annSalaryConditions = ann_salaries.map(salary => ` ann_salary='${salary}'`).join(' OR ');
        query += ` AND (${annSalaryConditions})`;
    }
    if (years_of_experience && years_of_experience.length > 0) {
        const years_of_experienceConditions = years_of_experience.map(yearexp => ` years_of_experience='${yearexp}'`).join(' OR ');
        query += ` AND (${years_of_experienceConditions})`;
    }
    if (Gender) {
        query += ` AND Gender='${Gender}'`;
    }
    if (Age) {
        query += ` AND Age = ${Age}`;
    }

    query += ` ORDER BY Name_1 LIMIT ${limit} OFFSET ${offset}`;

    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getData() {
    const query = `SELECT DISTINCT Role FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getData1() {
    const query = `SELECT DISTINCT current_location FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getUgDegrees() {
    const query = `SELECT DISTINCT ug_degree FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getPgDegrees() {
    const query = `SELECT DISTINCT pg_degree FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getAnnSalaries() {
    const query = `SELECT DISTINCT ann_salary FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function getExp() {
    const query = `SELECT DISTINCT years_of_experience FROM naukri_details`;
    try {
        const [rows] = await pool.query(query);
        console.log('Query Result:', rows);
        return rows;
    } catch (err) {
        console.log('Query Error:', err);
        throw err;
    }
}

async function insertCSVData(data) {
    if (!data || data.length === 0) {
        throw new Error("No data to insert");
    }

    const values = data.map(row => [
        row.Name,
        row.email_id,
        row.contact_no,
        row.current_location,
        row.State,
        row.Department,
        row.Role,
        row.Industry,
        row.years_of_experience,
        row.ann_salary,
        row.curr_company_name,
        row.curr_company_duration_from,
        row.curr_company_designation,
        row.prev_employer_name,
        row.ug_degree,
        row.ug_specialization,
        row.ug_year,
        row.pg_degree,
        row.pg_specialization,
        row.pg_college,
        row.pg_year,
        row.Gender,
        row.marital_status,
        row.Age
    ]);

    const query = `INSERT INTO naukri_details (Name_1, email_id, contact_no, current_location, State, Department, Role, Industry, 
                        years_of_experience, ann_salary, curr_company_name, curr_company_duration_from, 
                        curr_company_designation, prev_employer_name, ug_degree, ug_specialization, ug_year, 
                        pg_degree, pg_specialization, pg_college, pg_year, Gender, marital_status, Age) VALUES ?`;

    try {
        const [result] = await pool.query(query, [values]);
        console.log('Insert Result:', result); // Log the insert result
        return result;
    } catch (err) {
        console.error('Insert Query Error:', err);
        throw err;
    }
}

module.exports = {
    getUserDetails,
    getDetails,
    updateUserDetails,
    getFiltered,
    getData,
    getData1,
    getUgDegrees,
    getPgDegrees,
    getAnnSalaries,
    insertCSVData,
    getExp
};
