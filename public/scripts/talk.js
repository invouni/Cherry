
  // Check if speech recognition is supported
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
  } else {
    let rec;

    document.getElementById("startBtn").onclick = () => {
      rec = new webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let finalTrans = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTrans += transcript + " ";
          }
        }

        if (finalTrans.trim() !== "") {
          sendQuestion(finalTrans.trim());
        }
      };

      rec.onerror = (e) => console.log("Speech recognition error:", e.error);
      rec.onend = () => console.log("Speech recognition ended");

      rec.start();
      console.log("Speech recognition started...");
    };

    // Function to send question to backend
    async function sendQuestion(question) {
      const data = { question };
      console.log(data)
      try {
        console.log("entered")
        const response = await fetch('/ques', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json()// parse JSON response
        speak(result.responce)
        console.log("Server response:", result);
      } catch (err) {
        console.error('Error sending question:', err);
      }
    }
    // Simple TTS in the browser
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language
    utterance.rate = 1;       // Speed (0.1 to 10)
    utterance.pitch = 1;      // Pitch (0 to 2)
    speechSynthesis.speak(utterance);
}

// Example usage:
//speak("Hello, this is a text-to-speech test!");
  }
