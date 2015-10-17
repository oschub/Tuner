function load() {

  // INITIALIZE

    var myOscillator = new Oscillator();
    nrofbars = myOscillator.bufferlength;
    var bars = CreateBarChart(nrofbars / 4); // this global variable is referred to in the draw function within Oscillator
    CreateHoverNotes(myOscillator);

    // initAudio();

  // OSCILLATOR

    function Oscillator() {

        // Set variables that can be accessed by any function within Oscillator
        var context = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator;
        var analyser;

        // create and set properties of analyser
        analyser = context.createAnalyser(); //var or no var?
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.0;
        analyser.connect(context.destination);

        // additional variables needed for FFT & Visualisation

        var bufferLength = analyser.frequencyBinCount;
        var timeArray = new Uint8Array(bufferLength);
        var freqArray = new Uint8Array(bufferLength);

        playnote = function (freq) {
                     // create an audio source, in this case an oscillator
                     oscillator = context.createOscillator();
                     oscillator.connect(analyser);

                     // set some properties of the oscillator
                     // oscillator.type = 0; // 0 = Sine
                     oscillator.frequency.value = freq;
                     oscillator.start(0);

                     draw(); // the function draw is defined later in the visualisation part
                 };

        stopnote = function() {

                     oscillator.stop(0);
                     oscillator.disconnect();

                 };

        draw = function() {

                     requestAnimationFrame(draw); // loop thingy

                     // analyser.getByteTimeDomainData(timeArray);
                     analyser.getByteFrequencyData(freqArray);

                     // update the height bars
                     bars.each(function (index, bar) {
                     bar.style.height = ( freqArray[index] * (1/5)) + 'px';
                     });

                };

        return {
            playnote: playnote,
            stopnote: stopnote,
            bufferlength: bufferLength,
        };

    }; // end Oscillator


  // FUNCTION TO CREATE NOTES ON SCREEN AND LINK THEM TO OSCILLATOR

    function CreateHoverNotes(osc) {

         // global
          var NotesVsFreq =
              [{"note": "E", "frequency": 82.41},
               {"note": "A", "frequency": 110.0},
               {"note": "D", "frequency": 146.83},
               {"note": "G", "frequency": 196.0},
               {"note": "B", "frequency": 246.94},
               {"note": "e", "frequency": 329.63}];

         // creates notes on screen and add functionality
         $.each( NotesVsFreq, function(i, object) {

              // obtain the name and frequency of the note
              var note = object.note;
              var freq = 2 * object.frequency; // frequency is doubled, too low for speakers otherwise

              // create a bootstrap column
              var col = document.createElement("div");
                col.className = "col-sm-1";

              // create element with note name and a border around it
              var g = document.createElement("div");
                g.className = 'border';
                g.id = object.note;
                g.innerHTML = object.note.toUpperCase();

              // add note name to column and column to the html code
              col.appendChild(g);
              $("#notes").get(0).appendChild(col);

              // assign functionality to the created notes on screen
              $("#" + note).on("mouseenter", function() {osc.playnote(freq);});
              $("#" + note).on("mouseleave", osc.stopnote);

          });


  }; // end CreateHoverNotes

  // FUNCTION TO CREATE THE BAR CHART

    function CreateBarChart(nrofbars) {

          // inside the visulation div we create a given number of bars
          // whose height can be adjusted individually

          var visualisation = $("#visualisation");
  	      var barSpacingPercent = 100 / nrofbars;

          for (var i = 0; i < nrofbars; i++)
            {
      	       $("<div/>").css("left", i * barSpacingPercent + "%").appendTo(visualisation);
            }
          $("#visualisation > div").css("width", barSpacingPercent/2 + "%");

          return $("#visualisation > div");

    }; // end CreateBarChart


}; // end load
