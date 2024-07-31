import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaArrowLeft  } from 'react-icons/fa';
import './Profiles.css';
import Loader from './Loader'; 
import 'bootstrap/dist/css/bootstrap.min.css';
const Profiles = () => {
  const { contactNo } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const backend = "https://talent-corner-b7v4.onrender.com";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${backend}/api/user-details/${contactNo}`);
        setUserDetails(response.data);
        setFormData(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsLoading(false); 
      }
    };

    fetchUserDetails();
  }, [contactNo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await axios.put(`${backend}/api/update-user-details/${contactNo}`, formData);
      setUserDetails(formData);
      setIsEditing(false);
      setIsLoading(false); 
    } catch (error) {
      console.error('Error updating user details:', error);
      setIsLoading(false); 
    }
  };

  const handleCancel = () => {
    setFormData(userDetails);
    setIsEditing(false);
  };

  if (isLoading) {
    return <Loader />; // Display loader while fetching data
  }

  return (
    <div className="container">
      <div className="main-body">
        <div className="scrollable-container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card profile-widget">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="position-relative w-100">
                      <FaArrowLeft  className="close-icon" onClick={() => navigate(-1)} />
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar6.png"
                        alt="Admin"
                        className="rounded-circle p-1 bg-primary avatar"
                      />
                    </div>
                    <div className="mt-3">
                      <h4>{userDetails.Name_1}</h4>
                      <p className="text-secondary mb-1">{userDetails.Role}</p>
                      <p className="text-secondary mb-1">{userDetails.current_location}</p>
                    </div>
                </div>

                  <hr className="my-4" />
                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 className="mb-0">
                      <FaPhoneAlt className="me-2" />
                      Phone
                    </h6>
                    <span className="text-secondary">{userDetails.contact_no}</span>
                  </li>
                  <br />
                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 className="mb-0">
                      <FaEnvelope className="me-2" />
                      Email
                    </h6>
                    <span className="text-secondary">{userDetails.email_id}</span>
                  </li>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card profile-widget">
                <div className="card-body">
                  {isEditing ? (
                    <>
                      <div className="row mb-3">
                        <center><h5>Personal Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Full Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="Name_1" value={formData.Name_1} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="email_id" value={formData.email_id} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="contact_no" value={formData.contact_no} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Age</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="Age" value={formData.Age} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="current_location" value={formData.current_location} onChange={handleInputChange} />
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <center><h5>Educational Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Undergraduate Degree</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="ug_degree" value={formData.ug_degree} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Undergraduate Specialization</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="ug_specialization" value={formData.ug_specialization} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Year of Passing</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="ug_year" value={formData.ug_year} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Postgraduate Degree</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="pg_degree" value={formData.pg_degree} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Postgraduate Specialization</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="pg_specialization" value={formData.pg_specialization} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Year of Passing</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="pg_year" value={formData.pg_year} onChange={handleInputChange} />
                        </div>
                      </div>
                      <hr></hr>
                      <div className="row mb-3">
                        <center><h5>Professional Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Previous Company</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="prev_employer_name" value={formData.prev_employer_name} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Experience</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="years_of_experience" value={formData.years_of_experience} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Current Company</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="curr_company_name" value={formData.curr_company_name} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Joining Date</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="curr_company_duration_from" value={formData.curr_company_duration_from} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Job Type</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="curr_company_designation" value={formData.curr_company_designation} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Salary</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input type="text" className="form-control" name="ann_salary" value={formData.ann_salary} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12 text-end">
                          <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                          <button className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row mb-3">
                        <center><h5>Personal Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Full Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.Name_1}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.email_id}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.contact_no}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Age</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.Age}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.current_location}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <center><h5>Educational Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Undergraduate Degree</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.ug_degree}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Undergraduate Specialization</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.ug_specialization}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Year of Passing</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.ug_year}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Postgraduate Degree</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.pg_degree}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Postgraduate Specialization</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.pg_specialization}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Year of Passing</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.pg_year}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <center><h5>Professional Information</h5></center>
                        <br />
                        <div className="col-sm-3">
                          <h6 className="mb-0">Previous Company</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.prev_employer_name}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Experience</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.years_of_experience}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Current Company</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.curr_company_name}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Joining Date</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.curr_company_duration_from}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Job Type</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.curr_company_designation}</p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Salary</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <p>{userDetails.ann_salary}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12 text-end">
                          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
