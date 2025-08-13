


export const API="http://localhost:8080";
// export const API="https://careplusbackend-production.up.railway.app";

// const API_BASE = `${API}/api/dates`;

// export const getDoctorDates = async (doctorId) => {
//   const response = await fetch(`${API}/api/doctors/${doctorId}`);
//   if (!response.ok) throw new Error("Failed to fetch doctor dates");
//   return response.json();
// };


// export async function updateDoctorDate(id, data) {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res;
// }

// export async function deleteDoctorDate(id) {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "DELETE",
//   });
//   return res;
// }

// export async function getAllDoctorDates() {
//   const res = await fetch(API_BASE);
//   return res.json();
// }

// export async function getDoctorDateById(id) {
//   const res = await fetch(`${API_BASE}/${id}`);
//   return res.json();
// }

// export const getDoctorById = async (id) => {
//   const res = await fetch(`${API}/api/doctors/${id}`);
//   if (!res.ok) throw new Error('Doctor not found');
//   return await res.json();
// };

// export const searchDoctorsByName = async (name) => {
//   const res = await fetch(`${API}/api/doctors/search?name=${name}`);
//   if (!res.ok) throw new Error('Error searching doctors');
//   return await res.json();
// };


export const addDoctorDate = async (payload) => {
  return await fetch(`${API}/api/dates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

