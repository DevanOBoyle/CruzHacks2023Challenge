Devan O'Boyle
March 2022
CruzHacks 2023 Backend Engineering Challenge

Description: This is a REST API that supports GET, POST, PATCH, and DELETE
functions for applicants in a database. It is written in Javascript using
node.js along with express and joi libraries.

Files:
app.js - Contains the REST API code that supports the functions
package.json, package-lock.json - Contains version information and dependencies

Instructions:
To run the api via localhost, type 'node app.js' into a terminal.
A message will appear telling which port the program is listening on,
default port is 3000. To change port being used, type 'set PORT=port_number' 
for Windows or 'export PORT=port_number' for Mac where port_number is a value
inputted by the user. Once the program is listening, use the url: 
http://localhost:port_number/api/applicants/ for POST requests. For GET and
DELETE requests add either the id or the email of the applicant after the
'applicants/'. For PATCH requests the same applies, but only the email can
be used.

To enter data into the database use the following schema entered into the body:
{
    "name": string [1-60 chars]
    "gender": [He/Him, She/Her, other]
    "other_gender": string [1-30 chars] (Only fill if Gender choice is other)
    "email: string [1-320 chars] (Should throw error if the email already exists in the database)
    "age": Number/String [1-200 value]
    "application_type": [Hacker, Judge]

    //FIELDS FOR HACKERS ONLY
    "from_ucsc": [Yes, No]
    "other_school": string [1-50 chars] (Only fill if answer to previous question was No)

    //FIELDS FOR JUDGES ONLY
    "company": string [1-50 chars]
}

Example schema:
{
    "name": "Devan",
    "gender": "He/Him",
    "email": "doboyle@ucsc.edu",
    "age": "19",
    "application_type": "Hacker",
    "from_ucsc": "Yes"
}