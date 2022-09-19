document.addEventListener('DOMContentLoaded', speechToEmotion, false)

function speechToEmotion() {
  const recognition = new webkitSpeechRecognition()
  
  recognition.lang = 'fr-FR' // Recognized speech will be in French so set the French word dictinary 
  recognition.continuous = false
  recognition.onresult = function(event) {
	// get the recognized speech in the event as variable
	const results = event.results
    const transcript = results[results.length-1][0].transcript

	// send the transcript the Sentiment API to get an emotion score
    fetch(`./emotion?text=${transcript}`)
	.then((response) => response.json())
	.then((result) => {
		console.log(result);
		
		// Was what I said positive?
        if (result.score > 0) {
			// Yes, set the happy emoji
			setText('^ ^')
        } else if (result.score < -1) {
			// Is it really negative? Set sad emoji
			setText('; ;')
        } else {
			// else, set indifferent
			setText('■ ■')
        }
		
      })
      .catch((e) => {
		//Error? Stop the recognition
        console.error('Request error -> ', e)
        recognition.abort()
		setText('■ ■')
      })
}
	
	
	
  recognition.onerror = function(event) {
    console.error('Recognition error -> ', event.error);
    
  }

  recognition.onend = function() 
  {
	setTimeout(recognition.start(), 1000); // has the recognition ended? Start again 
  }

  recognition.start();
}


function setText(type) 
{
	//Find the text field in index .html and set it
	console.log(type)
    const textField = document.querySelector('.sourceTextClass')
    textField.value = type
}