// Your JavaScript code here
const concertForm = document.getElementById('concertForm');
const concertList = document.getElementById('concertList');

concertForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(concertForm);
  const concertData = {
    title: formData.get('title'),
    date: formData.get('date'),
    time: formData.get('time'),
    description: formData.get('description'),
  };

  try {
    const response = await fetch('/concerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(concertData),
    });

    if (!response.ok) {
      throw new Error('Failed to create concert');
    }

    const concert = await response.json();
    displayConcert(concert);
    concertForm.reset();
  } catch (error) {
    console.error(error);
  }
});

// Function to display the concerts
function displayConcert(concert) {
  const li = document.createElement('li');
  li.innerHTML = `
    <h2>${concert.title}</h2>
    <p>Date: ${concert.date}</p>
    <p>Time: ${concert.time}</p>
    <p>Description: ${concert.description}</p>
    <button onclick="editConcert('${concert._id}', '${concert.title}', '${concert.date}', '${concert.time}', '${concert.description}')">Edit</button>
    <button onclick="deleteConcert('${concert._id}')">Delete</button>
  `;
  concertList.appendChild(li);
}

async function editConcert(id, title, date, time, description) {
  const newTitle = prompt('Enter new concert title:', title);
  const newDate = prompt('Enter new concert date:', date);
  const newTime = prompt('Enter new concert time:', time);
  const newDescription = prompt('Enter new concert description:', description);

  const concertData = {
    title: newTitle,
    date: newDate,
    time: newTime,
    description: newDescription,
  };

  try {
    const response = await fetch(`/concerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(concertData),
    });

    if (!response.ok) {
      throw new Error('Failed to update concert');
    }

    const updatedConcert = await response.json();
    const li = document.querySelector(`li[data-id="${id}"]`);
    li.innerHTML = `
      <h2>${updatedConcert.title}</h2>
      <p>Date: ${updatedConcert.date}</p>
      <p>Time: ${updatedConcert.time}</p>
      <p>Description: ${updatedConcert.description}</p>
      <button onclick="editConcert('${updatedConcert._id}', '${updatedConcert.title}', '${updatedConcert.date}', '${updatedConcert.time}', '${updatedConcert.description}')">Edit</button>
      <button onclick="deleteConcert('${updatedConcert._id}')">Delete</button>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function deleteConcert(id) {
  try {
    const response = await fetch(`/concerts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete concert');
    }

    const li = document.querySelector(`li[data-id="${id}"]`);
    li.remove();
  } catch (error) {
    console.error(error);
  }
}

async function loadConcerts() {
  try {
    const response = await fetch('/concerts');
    const concerts = await response.json();

    concerts.forEach((concert) => {
      displayConcert(concert);
    });
  } catch (error) {
    console.error(error);
  }
}

loadConcerts();