Hospital Management System: Entity and Table Design
Below is a detailed database schema for the Hospital Management System , which manages doctor-patient interactions, appointments, and medical histories. The system is structured into Admin , User (Patient) , and Doctor modules.

Entities for Hospital Management System
1. Admin Table
Table Name : admins
Description : Stores admin information who has control over the hospital management system.
Attributes :| Field Name | Data Type | Description | | -------------- | ------------ | ----------------------------- | | admin_id | INT | Primary Key, auto-incremented | | username | VARCHAR(255) | Admin's username | | password | VARCHAR(255) | Admin's password (hashed) | | email | VARCHAR(255) | Admin's email | | last_login | DATETIME | Timestamp of the last login |

2. Doctor Table
Table Name : doctors
Description : Stores information related to the doctors working in the hospital.
Attributes :| Field Name | Data Type | Description | | ------------------ | ------------ | -------------------------------------------- | | doctor_id | INT | Primary Key, auto-incremented | | first_name | VARCHAR(255) | Doctor's first name | | last_name | VARCHAR(255) | Doctor's last name | | specialization | VARCHAR(255) | Doctor's specialization (e.g., Cardiologist) | | email | VARCHAR(255) | Doctor's email address | | phone_number | VARCHAR(15) | Doctor's phone number | | password | VARCHAR(255) | Doctor's login password (hashed) | | status | VARCHAR(50) | Status of the doctor (active/inactive) |

3. Patient Table
Table Name : patients
Description : Stores information about patients visiting the hospital.
Attributes :| Field Name | Data Type | Description | | --------------------- | ------------ | ----------------------------------------- | | patient_id | INT | Primary Key, auto-incremented | | first_name | VARCHAR(255) | Patient's first name | | last_name | VARCHAR(255) | Patient's last name | | dob | DATE | Patient's date of birth | | email | VARCHAR(255) | Patient's email | | phone_number | VARCHAR(15) | Patient's contact number | | gender | VARCHAR(10) | Patient's gender (male/female) | | address | TEXT | Patient's address | | status | VARCHAR(50) | Status (active/inactive) | | registration_date | DATETIME | Date and time when the patient registered |

4. Appointment Table
Table Name : appointments
Description : Stores appointment details made by patients with doctors.
Attributes :| Field Name | Data Type | Description | | -------------------- | ----------- | ------------------------------------------------------ | | appointment_id | INT | Primary Key, auto-incremented | | patient_id | INT | Foreign Key referencing patientstable | | doctor_id | INT | Foreign Key referencing doctorstable | | appointment_date | DATETIME | Date and time of the appointment | | status | VARCHAR(20) | Status of the appointment (pending/confirmed) | | reason | TEXT | Reason for the appointment (e.g., check-up, treatment) | | created_at | DATETIME | Date and time when the appointment was created | | updated_at | DATETIME | Date and time when the appointment was last updated |

5. Medical History Table
Table Name : medical_histories
Description : Stores the medical history of patients (including past diagnoses, treatments, etc.).
Attributes :| Field Name | Data Type | Description | | -------------- | --------- | ---------------------------------------------- | | history_id | INT | Primary Key, auto-incremented | | patient_id | INT | Foreign Key referencing patientstable | | doctor_id | INT | Foreign Key referencing doctorstable | | diagnosis | TEXT | Description of the patient's medical condition | | treatment | TEXT | Treatment provided to the patient | | date | DATETIME | Date when the treatment was provided |

6. Contact Queries Table
Table Name : contact_queries
Description : Stores queries submitted by users via the "Contact Us" form.
Attributes :| Field Name | Data Type | Description | | ------------------ | ------------ | ------------------------------------------ | | query_id | INT | Primary Key, auto-incremented | | user_name | VARCHAR(255) | Name of the person submitting the query | | email | VARCHAR(255) | Email address of the person | | query_message | TEXT | Message content submitted by the user | | status | VARCHAR(20) | Status of the query (pending/responded) | | submitted_date | DATETIME | Date and time when the query was submitted |

7. Session Logs Table (Doctor)
Table Name : doctor_session_logs
Description : Tracks login and logout times of doctors.
Attributes :| Field Name | Data Type | Description | | --------------- | --------- | ---------------------------------------- | | log_id | INT | Primary Key, auto-incremented | | doctor_id | INT | Foreign Key referencing doctorstable | | login_time | DATETIME | Date and time when the doctor logged in | | logout_time | DATETIME | Date and time when the doctor logged out |

8. Session Logs Table (User)
Table Name : user_session_logs
Description : Tracks login and logout times of patients (users).
Attributes :| Field Name | Data Type | Description | | --------------- | --------- | ----------------------------------------- | | log_id | INT | Primary Key, auto-incremented | | user_id | INT | Foreign Key referencing patientstable | | login_time | DATETIME | Date and time when the patient logged in | | logout_time | DATETIME | Date and time when the patient logged out |

Admin Module Features Summary:
Dashboard : View of Patients, Doctors, Appointments, and Queries.
Doctors Management : Add, update, and manage doctor details and specializations.
Users Management : View, edit, and delete user information.
Patients Management : View patient details, medical histories, and appointments.
Appointment History : View complete appointment history for each patient.
Contact Queries : View and respond to user queries submitted through the contact form.
Doctor & User Session Logs : Track login/logout times of both doctors and patients.
Reports : Generate and view patient reports over specified periods.
Patient Search : Search patients by name or contact number.

Admin Profile & Change Password : Admin can update their own profile and change password.
User (Patient) Module Features Summary:
Dashboard : View and manage personal profile and appointment details.
Book Appointment : Patients can book appointments with doctors.
Appointment History : Patients can view their past appointments.
Medical History : Patients can view their medical history and treatment details.
Profile Management : Update personal profile details and change password.
Password Recovery : Recover forgotten password.

Doctor Module Features Summary:
Dashboard : View doctor’s profile and manage online appointments.
Appointment History : View patient appointment history.
Manage Patients : Add or update patient details.
Patient Search : Search for patient details by name or contact number.
Suggestions for Enhancements:
SMS and Email Notifications : Add notifications for appointment confirmations, reminders, and updates.
Online Payment System : Integrate payment gateways for booking appointments or paying medical bills.
Mobile Application : A mobile version of the system for patients and doctors to access the platform more easily.