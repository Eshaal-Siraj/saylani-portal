const ADMIN_EMAIL = "eshaaladmin2007@gmail.com";

// const auth = firebase.auth();
// const db = firebase.firestore();
const auth = window.auth;
const db = window.db;

function logout() {
  auth.signOut().then(() => location.href = "index.html");
}
window.logout = logout;

// rest of admin functions...window.logout = logout;

// Only run admin logic
auth.onAuthStateChanged(user => {
  if (!user) return location.href = "index.html";

  if(user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()){
    alert("You are not authorized to access this page!");
    logout();
    return;
  }

  // Fetch admin tables
  fetchLostFound();
  fetchComplaints();
  fetchVolunteers();
});

// ======================== FETCH FUNCTIONS ========================

// Lost & Found
function fetchLostFound() {
  const table = document.getElementById("adminLostFound");

  db.collection("lost_found_items")
    .onSnapshot(snapshot => {
      table.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();

        table.innerHTML += `
          <tr>
            <td>${d.userId || ""}</td>
            <td>${d.title || ""}</td>
            <td>${d.desc || ""}</td>
            <td>${d.status || ""}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="updateLostFound('${doc.id}')">Update</button>
              <button class="btn btn-sm btn-danger" onclick="deleteLostFound('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}
function updateLostFound(id){
  const newStatus = prompt("Enter new status (Pending/Resolved):");
  if(newStatus) db.collection("lost_found_items").doc(id).update({status: newStatus});
}
function deleteLostFound(id){
  if(confirm("Delete this item?")) db.collection("lost_found_items").doc(id).delete();
}

// Complaints
function fetchComplaints() {
  const table = document.getElementById("adminComplaints");

  db.collection("complaints")
    .onSnapshot(snapshot => {
      table.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();

        table.innerHTML += `
          <tr>
            <td>${d.userId || ""}</td>
            <td>${d.category || ""}</td>
            <td>${d.desc || ""}</td>
            <td>${d.status || ""}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="updateComplaint('${doc.id}')">Update</button>
              <button class="btn btn-sm btn-danger" onclick="deleteComplaint('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}function updateComplaint(id){
  const newStatus = prompt("Enter new status (Pending/Resolved):");
  if(newStatus) db.collection("complaints").doc(id).update({status: newStatus});
}
function deleteComplaint(id){
  if(confirm("Delete this complaint?")) db.collection("complaints").doc(id).delete();
}

// Volunteers
function fetchVolunteers() {
  const table = document.getElementById("adminVolunteers");

  db.collection("volunteers")
    .onSnapshot(snapshot => {
      table.innerHTML = "";

      snapshot.forEach(doc => {
        const d = doc.data();

        table.innerHTML += `
          <tr>
            <td>${d.userId || ""}</td>
            <td>${d.name || ""}</td>
            <td>${d.event || ""}</td>
            <td>${d.availability || ""}</td>
            <td>${d.status || ""}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="updateVolunteer('${doc.id}')">Update</button>
              <button class="btn btn-sm btn-danger" onclick="deleteVolunteer('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}function updateVolunteer(id){
  const newStatus = prompt("Enter new status (Pending/Approved):");
  if(newStatus) db.collection("volunteers").doc(id).update({status: newStatus});
}
function deleteVolunteer(id){
  if(confirm("Delete this volunteer?")) db.collection("volunteers").doc(id).delete();
}

// Export functions for inline buttons
window.updateLostFound = updateLostFound;
window.deleteLostFound = deleteLostFound;
window.updateComplaint = updateComplaint;
window.deleteComplaint = deleteComplaint;
window.updateVolunteer = updateVolunteer;
window.deleteVolunteer = deleteVolunteer;