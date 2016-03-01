### INSTALL

```
npm install
```

### RUN

```
npm run dev
open localhost:8080
```


https://github.com/TalAter/annyang/blob/master/docs/README.md

// useful example
var Annyang = require('annyang');
 
var annyang = new Annyang();
var commands = {'hello :name': helloFunction};

function helloFunction() {
    console.log(arguments);
}

// true second argument for overwriting any previously added commands
annyang.init(commands);
annyang.start({ autoRestart: true, continuous: true });

// second useful example
  var r= document.getElementById('results')
  var color = function(color){var theme='red';r.style.backgroundColor=theme}
  var commands = {
    'привет': color
  };

  annyang.setLanguage('ru-RU');
  annyang.addCommands(commands);
  annyang.start();
