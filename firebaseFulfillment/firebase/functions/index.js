const functions = require('firebase-functions');
const {
  dialogflow,
  MediaObject,
  Suggestions
} = require('actions-on-google');
const POMODORO_TIMER_INTENT = 'Pomodoro Timer';
const RELAXING_EXERCISES = 'Relaxing Exercises';
const TIMER_ENTITY = 'sys.number-integer';
const app = dialogflow();

app.intent(POMODORO_TIMER_INTENT, (conv) => {
  const minute_time = conv.parameters.minutes;
  let background_music = `https://pigeonstein.nl/student_coach/1-min.mp3`;
  let minutes_work = 25;
  let minutes_break = 5;
  if (minute_time !== ""){
  	minutes_work = minute_time;
  }
  let sound_loop = `<audio src="https://pigeonstein.nl/student_coach/1-min.mp3"></audio><prosody volume ="silent"> </prosody>`;

  function calculateMinutes(minutes, sound) {
    for (i=0; i<minutes; i++){
      if (i !== 0){
        sound_loop = sound_loop + `<audio src="https://pigeonstein.nl/student_coach/1-min.mp3"></audio><prosody volume ="silent"> </prosody>`;
      }
    }
    return sound_loop;
  }
  conv.ask(`<speak>Oke, ik start de Pomodoro timer met ${minutes_work} minuten werktijd en ${minutes_break} minuten aan pauze. Succes! <break time="7s" /> Je hebt ${minutes_work} minuten gewerkt. Tijd voor een pauze van ${minutes_break} minuten! <break time="7s" /> Je pauze zit erop, wat wil je nu doen?</speak>`);
});
const BACKGROUND_MUSIC_INTENT = 'Background Music';

app.intent(BACKGROUND_MUSIC_INTENT, (conv) => {
  const background_music_choice = conv.parameters.soortachtergrondmuziek;
  let nature_choice = "vogelgeluiden";
  let nature_sound = `<audio src="https://firebasestorage.googleapis.com/v0/b/studiecoach-b5abe.appspot.com/o/Relaxing%20Nature%20Sounds-Birdsong-Sound%20of%20Nature%20Relaxation-Birds%20Singing-Johnnie%20Lawson%20Meditation.wav?alt=media&amp;token=8b5d77f6-f2c8-4cea-9aba-7070af8e8ede"></audio><prosody volume ="silent"></prosody>`;
  let lofi_sound = `<audio src="https://firebasestorage.googleapis.com/v0/b/student-coach.appspot.com/o/Joji%20-%20ATTENTION%20%20A%20COLORS%20SHOW%20(mp3cut.net).mp3?alt=media&amp;token=482f80f6-1dff-43ea-b7f0-e272a1eb43e9"></audio><prosody volume ="silent"></prosody>`;
  let lofi_choice= "lofi";
  let piano_sound = `<audio src="https://firebasestorage.googleapis.com/v0/b/student-coach.appspot.com/o/Spirited%20Away%20(2001)%20-%20The%20Name%20of%20Life%20(Instrumental%20piano)%20Inochi%20No%20Namae%20%E3%81%84%E3%81%AE%E3%81%A1%E3%81%AE%E5%90%8D%E5%89%8D%20(mp3cut.net).mp3?alt=media&amp;token=d839d901-0825-4644-9e29-847c8cb1c688"></audio><prosody volume ="silent"></prosody>`;
  let piano_choice = "piano";
  let rain_sound = `<audio src="https://firebasestorage.googleapis.com/v0/b/student-coach.appspot.com/o/Geluiden%20van%20regen%20en%20onweer%20geluiden%20van%20de%20natuur%20te%20slapen%20te%20ontspannen%20Study%20(mp3cut.net).mp3?alt=media&amp;token=ab49ea9d-9575-4f82-b722-3141a4a19eb7"></audio><prosody volume ="silent"></prosody>`;
  let rain_choice = "regen";
  let water_sound = `<audio src="https://firebasestorage.googleapis.com/v0/b/student-coach.appspot.com/o/Water%20Sounds%20for%20Sleep%20or%20Focus%20%20White%20Noise%20Stream%2010%20Hours.mp3?alt=media&amp;token=b67ab40d-44d8-462d-ba4f-b3fe1cfe3ee8"></audio><prosody volume ="silent"></prosody>`;
  let water_choice="water";
  function background_music() {
   if(background_music_choice == nature_choice){
      return nature_sound;
    }
  if(background_music_choice == lofi_choice){
    return lofi_sound;
  }
   if(background_music_choice == piano_choice){
    return piano_sound;
  }
 if(background_music_choice == rain_choice){
    return rain_sound;
  }
    if(background_music_choice == water_choice){
    return water_sound;
  }
  }
  
  conv.ask(`<speak>Oke, ik start de achtergrond muziek met ${background_music_choice} ${background_music()}</speak>`);
});

app.intent(RELAXING_EXERCISES, (conv) => {
  const type = conv.parameters.type;
  let selected;
  const mindfulness = {name: `Mindfulness`, url: `https://s3-eu-west-1.amazonaws.com/balansante/mindfulness+gratis/Ademruimte%2C+vrouwenstem.mp3`};
  const body_scan = {name: `Bodyscan`, url: `https://www.mindfulcentrum.nl/wp-content/uploads/2016/07/Korte-Bodyscan.mp3`};
  const check_in = {name: `Check-in`, url: `https://www.mindfulcentrum.nl/wp-content/uploads/2016/07/3-Minuten-Check-In-.mp3`};
  const walking = {name: `Mindfull Lopen`, url: `https://www.mindfulcentrum.nl/wp-content/uploads/2016/07/Loop-meditatie.mp3`};
  
  switch (type){
    case 'mindfulness':
      selected = mindfulness;
      break;
    case 'bodyscan':
      selected = body_scan;
      break;
    case 'check_in':
      selected = check_in;
      break;
    case 'walking':
      selected = walking;
      break;
    default:
      selected = mindfulness;
      break;
  }
  
  conv.ask(`<speak>Oke, ik speel nu een ${selected.name} oefening af.</speak>`);
  conv.ask(new MediaObject({
   name: `${selected.name}`,
   url: `${selected.url}`,
 }));
   conv.add(new Suggestions(['Nieuwe oefening', 'Wat kan je doen?']));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);