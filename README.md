# Budo
Martial Arts and Fitness Home Coach

Project Plan:

‘Budo’ is a web application that is designed to provide a customized coach/drillmaster to users who want to exercise and practice their martial arts at home or outside of the gym/dojo.

Target Functionality:

By selecting what techniques and movements the user knows, the application then provides an interface driven by online speech recognition and browser voice synth, which can guide the user through any length. Throughout these sessions, the application asks questions during the rest periods, dynamically meeting the user’s needs, and steadily driving them to improve while leaving no technique neglected.

Currently built with a JavaScript front end, making Ajax calls to a PHP server and a MySQL database. The CSS Styling is currently minimalist, and I’ve been putting off reworking the interface until I’ve implemented all the functionality- the carrot on a stick.

Current Limitations:

The current voice recognition is relies on Google's Web Speech API, and uses Chrome's Voice Synth.
The Web Speech API requires that the user click 'Okay' each time the application tries to use the microphone- this can be resolved with a HTTPS/SSL Certificate, but I'd prefer not to spend the money until this gets opened up to users.

A note on structure:

I'm still learning how to properly design an application, so my best attempt at structure is <a href="https://drive.google.com/file/d/0BwQwNu9_v0ymS1NiendFZXp3LVk/view?usp=sharing">shown here</a>:
Application object, contains Display, Data, and Tengu (contains the voice elements- speaking, listening, and session planning). The display object holds all of the html updates, the Data Object communicates with the server using ajax, and returns data requests made by the Display Object. Tengu is only called when necessary.
