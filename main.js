// Check for Speech Recognition API support
const welcomePage = document.getElementById("welcomePage");
const demoSection = document.querySelector(".demoSection")

function containers() {
  const totalContainers = 5;
  let currentIndex = 0;

  demoSection.style.display = "grid";

  const showContent = (index) => {
    const isLastContainer = index === totalContainers - 1;
    const container = document.getElementById(`imgContainer${index + 1}`);

    if (container) {
      // Hide all content containers
      for (let i = 0; i < totalContainers; i++) {
        const container = document.getElementById(`imgContainer${i + 1}`);
        if (container) {
          container.style.display = i === index ? 'block' : 'none';
        }
      }

      if (!isLastContainer) {
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % totalContainers;
          showContent(currentIndex);
        }, 4000);
      } else {
        setTimeout(() => {
          demoSection.classList.toggle('remove');
          setTimeout(() => {
            demoSection.style.display = "none";
          }, 4500);
          localStorage.setItem('demoShown', 'shown');
        }, 4000);
      }
    }
  };

  const demoShown = localStorage.getItem('demoShown');
  if (demoShown) {
    demoSection.classList.toggle('remove');
  } else {
    showContent(currentIndex);
  }
}

function showDemo() {
  demoSection.style.display = "grid";
  demoSection.classList.remove('remove');
  const rtotalContainers = 5;
  let rcurrentIndex = 0;
  const rshowContent = (rindex) => {
    const risLastContainer = rindex === rtotalContainers - 1;
    const rcontainer = document.getElementById(`imgContainer${rindex + 1}`);

    if (rcontainer) {
      // Hide all content containers
      for (let i = 0; i < rtotalContainers; i++) {
        const rcontainer = document.getElementById(`imgContainer${i + 1}`);
        if (rcontainer) {
          rcontainer.style.display = i === rindex ? 'block' : 'none';
        }
      }

      if (!risLastContainer) {
        setTimeout(() => {
          rcurrentIndex = (rcurrentIndex + 1) % rtotalContainers;
          rshowContent(rcurrentIndex);
        }, 4000);
      } else {
        setTimeout(() => {
          demoSection.classList.toggle('remove');
          setTimeout(() => {
            demoSection.style.display = "none";
          }, 4500);
        }, 4000);
      }
    }
  };

  // Start sliding after a delay
  setTimeout(() => {
    rshowContent(rcurrentIndex);
  }, 4000);
}

function welcomePageTimer() {
  setTimeout(() => {
    welcomePage.style.display = "none";
    containers()
  }, 2000);
}


if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synthesis = window.speechSynthesis;

  // Create a recognition object with configurations
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  let currentTranscript = '';

  // Handle speech recognition results
  recognition.onresult = (event) => {
    const latestResult = event.results[event.results.length - 1][0].transcript;

    if (latestResult !== currentTranscript) {
      currentTranscript = latestResult;
      updateTranscription(currentTranscript);
    }
  };

  const transcriptionElement = document.getElementById('transcriptionText');
  const transcriptionTimeElement = document.getElementById('transcriptionTime');

  function updateTranscription(transcript) {
    transcriptionElement.textContent = transcript;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    transcriptionTimeElement.textContent = formattedDate;
    localStorage.setItem("transcriptText", transcript);
    localStorage.setItem("transcriptionTime", formattedDate);
  }


  const storedTranscript = localStorage.getItem("transcriptText");
  const storedTranscriptTime = localStorage.getItem("transcriptionTime");
  transcriptionElement.textContent = storedTranscript;
  transcriptionTimeElement.textContent = storedTranscriptTime;


  const closeEditButton = document.getElementById("closeEditContainer")
  const editContainer = document.getElementById("editTranscriptContainer")
  const editTranscriptButton = document.getElementById("editTranscriptButton")
  closeEditButton.addEventListener("click", () => {
    editContainer.style.display = "none"
  })
  editTranscriptButton.addEventListener("click", () => {
    editContainer.style.display = "grid"
  })

  function startTranscription() {
    recognition.start();
  }

  function stopTranscription() {
    recognition.stop();
  }

  function clearTranscription() {
    currentTranscript = '';
    updateTranscription(currentTranscript);
  }

  function readOutLoud() {
    const speakUtterance = document.getElementById("transcriptionText").textContent
    const utterance = new SpeechSynthesisUtterance(speakUtterance);
    speechSynthesis.speak(utterance);
  }


  function editTranscript() {
    const editedTranscriptInput = document.getElementById('editedTranscriptInput');
    const editedTranscripts = editedTranscriptInput.value;

    if (editedTranscripts) {
      // Store the edited transcript in localStorage
      localStorage.setItem("transcriptText", editedTranscripts);

      // Update the displayed transcript
      document.getElementById("transcriptionText").textContent = editedTranscripts;

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();

      localStorage.setItem("transcriptionTime", formattedDate);

      const transcriptionTimeElement = document.getElementById('transcriptionTime');
      transcriptionTimeElement.textContent = formattedDate;
      editContainer.style.display = "none"
    }
  }

  const optionsButton = document.querySelector(".fa-ellipsis-vertical");
  const transcriptionOutputContainer = document.querySelector("#transcriptionOutputContainer");
  const transcriptionOutputOptions = document.querySelector("#transcriptionOutputOptions");

  let isContainerOpen = false;


  optionsButton.addEventListener("click", () => {
    transcriptionOutputContainer.classList.toggle("expanded");
    transcriptionOutputOptions.classList.toggle("hidden");
    isContainerOpen = !isContainerOpen;
  });

  document.getElementById('deleteTranscriptionContainer').addEventListener('click', () => {
    const transcriptElement = document.getElementById('transcriptionText');
    const timeElement = document.getElementById('transcriptionTime');
    transcriptElement.textContent = '';
    timeElement.textContent = '';
    localStorage.removeItem('transcriptText');
    localStorage.removeItem('transcriptionTime');
    transcriptionOutputOptions.classList.add("hidden");
    isContainerOpen = false;
  });
}
else {
  alert('SpeechRecognition not supported in this browser.');
}

window.addEventListener("DOMContentLoaded", () => {
  welcomePageTimer()


  const moreTab = document.getElementById("moreTab")
  const transcriptSection = document.getElementById("transcriptSection")
  const aboutSection = document.getElementById("aboutSection")
  const transcriptSectionCover = document.getElementById("transcriptSectionCover")
  moreTab.addEventListener('click', () => {
    transcriptSection.classList.toggle("reveal")
    transcriptSectionCover.classList.toggle("dim")
    aboutSection.classList.toggle("display")
  })
})