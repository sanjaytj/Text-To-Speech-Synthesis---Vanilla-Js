// Initialize speech synthesize api 
const synth = window.speechSynthesis; // read-only propertry - entry point to web speech api

//DOM elements 
const textForm = document.querySelector('form');
const textInput = document.querySelector('#test-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

//Initialize voices array (from api)
let voices = [];

const getVoices = () => {
    voices = synth.getVoices(); //happens asyncronouly - called when event happens 
    //console.log(voices);

    //Lopp through voices and create an option for each one.
    voices.forEach(voice => {
        //create option element
        const option = document.createElement('option');
        //Fill the option with the voice and language - we have the inbuilt voice object
        option.textContent = voice.name + '('+ voice.lang + ')';

        //set needed options for attributes - lang
        option.setAttribute('data-lang', voice.lang) // detects the language on the web
        option.setAttribute('data-name', voice.name) //(property) SpeechSynthesisVoice.name: string
        //apend options to the select
        voiceSelect.appendChild(option);
    });
};

getVoices(); //currently returns empty array
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

//speak
const speak = () => {
    //check if speaking
    if(synth.speaking) {
        console.error('Already speaking...');
        return;
    }
    //check if not a empty string
    if(textInput.value != '') 
    {
        //get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        //speak end
        speakText.onend = e => 
        {
            console.log('Done speaking...');
        }

        //speak error
        speakText.onerror = e => {
            console.log('Something went wrong...');
        }

        //selected voice - has to know which voice to speak in
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        //Loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice)  //if the current voice selected = selected voice
            {
             speakText.voice = voice;   
            }
        });

        //set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value
        //speak
        synth.speak(speakText);
    }
};

//Event Listeners 

//text form submit
textForm.addEventListener('submit', e => {
    e.preventDefault(); //want to prevent from submiting to a file
    speak();
    textInput.blur();
});

//rate value change
rate.addEventListener('change', e => {
    rateValue.textContent = rate.value
});

//pitch value change
pitch.addEventListener('change', e => {
    pitchValue.textContent = pitch.value
});

//voice select - speak automactically when voice changed 
voiceSelect.addEventListener('change', e => speak());



//This Web Speech API interface is the controller interface for the speech service; this can be used to retrieve information about the synthesis voices available on the device, start and pause speech, and other commands besides.

//https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis