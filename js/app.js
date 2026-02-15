function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Fill all fields!");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => location.href = "dashboard.html")
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) return alert("Fill all fields!");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => location.href = "dashboard.html")
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => location.href = "index.html");
}

let editId = null;

function postItem() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  if (!title || !desc) return alert("Fill all fields!");

  db.collection("lost_found_items").add({
    title,
    desc,
    status: "Pending",
    userId: auth.currentUser.uid,
    timestamp: new Date()
  });

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
}

function editItem(id, title, desc) {
  document.getElementById("title").value = title;
  document.getElementById("desc").value = desc;
  editId = id;
  document.getElementById("postBtn").style.display = "none";
  document.getElementById("updateBtn").style.display = "inline";
}

function updateItem() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  if (!title || !desc) return alert("Fill all fields!");

db.collection("lost_found_items")
  .onSnapshot(snapshot => {
    const itemsDiv = document.getElementById("items");
    itemsDiv.innerHTML = "";
    let count = 0;

    snapshot.forEach(doc => {
      const d = doc.data();
      if(d.userId === auth.currentUser.uid){
        count++;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${d.title}</td>
          <td>${d.desc}</td>
          <td><span class="badge bg-warning">${d.status}</span></td>
          <td>
            <button class="btn btn-sm btn-info edit-btn">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
          </td>
        `;
        tr.querySelector(".edit-btn").addEventListener("click", () => editItem(doc.id, d.title, d.desc));
        tr.querySelector(".delete-btn").addEventListener("click", () => deleteItem(doc.id));
        itemsDiv.appendChild(tr);
      }
    });

    if(count === 0) itemsDiv.innerHTML = "<tr><td colspan='4'>No items yet</td></tr>";
    document.getElementById("totalLost").innerText = count;
  });}

function deleteItem(id) {
  if (confirm("Delete this item?")) {
    db.collection("lost_found_items").doc(id).delete();
  }
}

function submitComplaint() {
  const category = document.getElementById("complaintCategory").value;
  const desc = document.getElementById("complaintDesc").value.trim();
  if (!desc) return alert("Write complaint!");

  db.collection("complaints").add({
    category,
    desc,
    status: "Submitted",
    userId: auth.currentUser.uid,
    timestamp: new Date()
  })
  .then(() => {
    alert("Complaint submitted!");
    document.getElementById("complaintDesc").value = "";
  })
  .catch(err => alert(err.message));
}
function deleteComplaint(id) {
  if (confirm("Delete this complaint?")) {
    db.collection("complaints").doc(id).delete();
  }
}

function registerVolunteer() {
  const name = document.getElementById("volName").value.trim();
  const event = document.getElementById("eventName").value.trim();
  const availability = document.getElementById("availability").value;
  if (!name || !event || !availability) return alert("Fill all fields!");

  db.collection("volunteers").add({
    name,
    event,
    availability,
    status: "Registered",
    userId: auth.currentUser.uid,
    timestamp: new Date()
  })
  .then(() => {
    alert("Volunteer registered!");
    document.getElementById("volName").value = "";
    document.getElementById("eventName").value = "";
    document.getElementById("availability").value = "";
  })
  .catch(err => alert(err.message));
}
auth.onAuthStateChanged(user => {
  if (!user) return location.href = "index.html";

  const itemsDiv = document.getElementById("items");
  const totalLost = document.getElementById("totalLost");
  if (itemsDiv && totalLost) {
    db.collection("lost_found_items")
      .where("userId", "==", user.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        itemsDiv.innerHTML = "";
        let count = 0;
        snapshot.forEach(doc => {
          count++;
          const d = doc.data();
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${d.title}</td>
            <td>${d.desc}</td>
            <td><span class="badge bg-warning">${d.status}</span></td>
            <td>
              <button class="btn btn-sm btn-info edit-btn">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </td>
          `;
          tr.querySelector(".edit-btn").addEventListener("click", () => editItem(doc.id, d.title, d.desc));
          tr.querySelector(".delete-btn").addEventListener("click", () => deleteItem(doc.id));
          itemsDiv.appendChild(tr);
        });
        if (snapshot.empty) itemsDiv.innerHTML = "<tr><td colspan='4'>No items yet</td></tr>";
        totalLost.innerText = count;
      });
  }

  const complaintsDiv = document.getElementById("complaintsList");
  const totalComplaints = document.getElementById("totalComplaints");
  if (complaintsDiv && totalComplaints) {
db.collection("complaints").onSnapshot(snapshot => {
  const complaintsDiv = document.getElementById("complaintsList");
  complaintsDiv.innerHTML = "";
  let count = 0;

  snapshot.forEach(doc => {
    const d = doc.data();
    if(d.userId === auth.currentUser.uid){
      count++;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.category}</td>
        <td>${d.desc}</td>
        <td><span class="badge bg-primary">${d.status}</span></td>
        <td><button class="btn btn-sm btn-danger delete-btn">Delete</button></td>
      `;
      tr.querySelector(".delete-btn").addEventListener("click", ()=>deleteComplaint(doc.id));
      complaintsDiv.appendChild(tr);
    }
  });
  if(count===0) complaintsDiv.innerHTML = "<tr><td colspan='4'>No complaints</td></tr>";
  document.getElementById("totalComplaints").innerText = count;
});   }

  const volTable = document.getElementById("volunteerList");
  const totalVolunteers = document.getElementById("totalVolunteers");
  if (volTable && totalVolunteers) {
db.collection("volunteers").onSnapshot(snapshot => {
  const volTable = document.getElementById("volunteerList");
  volTable.innerHTML = "";
  let count = 0;

  snapshot.forEach(doc => {
    const d = doc.data();
    if(d.userId === auth.currentUser.uid){
      count++;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name}</td>
        <td>${d.event}</td>
        <td>${d.availability}</td>
        <td><span class="badge bg-success">${d.status}</span></td>
        <td><button class="btn btn-sm btn-danger delete-btn">Delete</button></td>
      `;
      tr.querySelector(".delete-btn").addEventListener("click", ()=>{
        if(confirm("Delete this volunteer?")) db.collection("volunteers").doc(doc.id).delete();
      });
      volTable.appendChild(tr);
    }
  });
  if(count===0) volTable.innerHTML = "<tr><td colspan='5'>No volunteers</td></tr>";
  document.getElementById("totalVolunteers").innerText = count;
});  }
});

window.postItem = postItem;
window.updateItem = updateItem;
window.submitComplaint = submitComplaint;
window.registerVolunteer = registerVolunteer;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.deleteComplaint = deleteComplaint;
window.logout = logout;

window.postItem = postItem;
window.updateItem = updateItem;
window.submitComplaint = submitComplaint;
window.deleteComplaint = deleteComplaint;
window.registerVolunteer = registerVolunteer;
window.logout = logout;
window.editItem = editItem;